import Link from "next/link";
import { canManageCatalog, requireSessionContext } from "@/lib/auth/auth";
import { listLocationsByCompany } from "@/lib/store/database";

type LocationsPageProps = {
  searchParams?: Promise<{
    error?: string;
    success?: string;
  }>;
};

function buildTree(locations: Awaited<ReturnType<typeof listLocationsByCompany>>) {
  const roots = locations.filter((l) => !l.parentId);
  const children = (parentId: string) => locations.filter((l) => l.parentId === parentId);
  return { roots, children };
}

function LocationRow({
  location,
  childrenFn,
  depth,
  canEdit,
}: {
  location: Awaited<ReturnType<typeof listLocationsByCompany>>[number];
  childrenFn: (parentId: string) => typeof location[];
  depth: number;
  canEdit: boolean;
}) {
  const kids = childrenFn(location.id);
  return (
    <>
      <tr>
        <td style={{ paddingLeft: 12 + depth * 24 }}>
          <span style={{ opacity: 0.5, marginRight: 6, fontSize: 11 }}>
            L{location.level}
          </span>
          {location.name}
        </td>
        <td>
          <span className="status-badge" style={{ fontSize: 11 }}>
            Nivel {location.level}
          </span>
        </td>
        <td>{kids.length > 0 ? `${kids.length} sub` : "-"}</td>
        <td>
          {canEdit ? (
            <div style={{ display: "flex", gap: 8 }}>
              <Link href={`/locations/${location.id}`} className="link-button">
                Editar
              </Link>
              <form action="/locations/new" style={{ display: "inline" }}>
                <input type="hidden" name="parentId" value={location.id} />
                <input type="hidden" name="level" value={location.level + 1} />
                <button type="submit" className="link-button" style={{ color: "var(--primary)" }}>
                  + Sub
                </button>
              </form>
            </div>
          ) : (
            <span className="muted">Somente leitura</span>
          )}
        </td>
      </tr>
      {kids.map((kid) => (
        <LocationRow key={kid.id} location={kid} childrenFn={childrenFn} depth={depth + 1} canEdit={canEdit} />
      ))}
    </>
  );
}

export default async function LocationsPage({ searchParams }: LocationsPageProps) {
  const session = await requireSessionContext();
  const params = await searchParams;
  const locations = await listLocationsByCompany(session.activeCompany.id);
  const canEdit = canManageCatalog(session.activeRole);
  const { roots, children } = buildTree(locations);

  return (
    <div className="stack-lg">
      {params?.error ? <div className="message error" style={{ marginBottom: 16 }}>{params.error}</div> : null}
      {params?.success ? <div className="message success" style={{ marginBottom: 16 }}>{params.success}</div> : null}

      <section className="surface-card section-card">
        <div className="section-header">
          <h2>Localizacoes</h2>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <span className="muted">{locations.length} item(ns)</span>
            {canEdit ? (
              <Link href="/locations/new" className="button primary" style={{ fontSize: 14 }}>
                + Nova localizacao
              </Link>
            ) : null}
          </div>
        </div>

        <p className="muted" style={{ marginBottom: 16 }}>
          Estrutura hierarquica de localizacoes. Ex: Galpao A → Rua 01 → Prateleira 02 → Nivel 03
        </p>

        {locations.length === 0 ? (
          <div className="empty-state">Nenhuma localizacao cadastrada.</div>
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Nivel</th>
                  <th>Sub-localizacoes</th>
                  <th>Acoes</th>
                </tr>
              </thead>
              <tbody>
                {roots.map((loc) => (
                  <LocationRow key={loc.id} location={loc} childrenFn={children} depth={0} canEdit={canEdit} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
