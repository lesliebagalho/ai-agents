import Link from "next/link";
import { canManageCatalog, requireSessionContext } from "@/lib/auth/auth";
import { listBrandsByCompany } from "@/lib/store/database";

type BrandsPageProps = {
  searchParams?: Promise<{
    error?: string;
    success?: string;
  }>;
};

export default async function BrandsPage({ searchParams }: BrandsPageProps) {
  const session = await requireSessionContext();
  const params = await searchParams;
  const brands = await listBrandsByCompany(session.activeCompany.id);
  const canEdit = canManageCatalog(session.activeRole);

  return (
    <div className="stack-lg">
      {params?.error ? <div className="message error" style={{ marginBottom: 16 }}>{params.error}</div> : null}
      {params?.success ? <div className="message success" style={{ marginBottom: 16 }}>{params.success}</div> : null}

      <section className="surface-card section-card">
        <div className="section-header">
          <h2>Marcas da empresa</h2>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <span className="muted">{brands.length} item(ns)</span>
            {canEdit ? (
              <Link href="/brands/new" className="button primary" style={{ fontSize: 14 }}>
                + Nova marca
              </Link>
            ) : null}
          </div>
        </div>

        {brands.length === 0 ? (
          <div className="empty-state">Nenhuma marca cadastrada para a empresa ativa.</div>
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Descricao</th>
                  <th>Acoes</th>
                </tr>
              </thead>
              <tbody>
                {brands.map((brand) => (
                  <tr key={brand.id}>
                    <td>{brand.name}</td>
                    <td>{brand.description || "-"}</td>
                    <td>
                      {canEdit ? (
                        <Link href={`/brands/${brand.id}`} className="link-button">
                          Editar
                        </Link>
                      ) : (
                        <span className="muted">Somente leitura</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
