import { canManageCatalog, requireSessionContext } from "@/lib/auth/auth";
import { saveLocationAction, deleteLocationAction } from "@/features/products/actions";
import { getLocationById, listLocationsByCompany } from "@/lib/store/database";
import { notFound } from "next/navigation";
import Link from "next/link";

type EditLocationPageProps = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{
    error?: string;
    success?: string;
  }>;
};

export default async function EditLocationPage({ params, searchParams }: EditLocationPageProps) {
  const session = await requireSessionContext();
  const { id } = await params;
  const search = await searchParams;
  const [location, locations] = await Promise.all([
    getLocationById(session.activeCompany.id, id),
    listLocationsByCompany(session.activeCompany.id),
  ]);

  if (!location) {
    notFound();
  }

  const canEdit = canManageCatalog(session.activeRole);

  return (
    <div className="stack-lg">
      <section className="surface-card section-card">
        <div className="section-header">
          <h2>Editando: {location.name}</h2>
          <Link href="/locations" className="link-button">
            Cancelar edicao
          </Link>
        </div>

        {search?.error ? <div className="message error" style={{ marginBottom: 16 }}>{search.error}</div> : null}
        {search?.success ? <div className="message success" style={{ marginBottom: 16 }}>{search.success}</div> : null}

        {!canEdit ? (
          <div className="message error">Seu perfil nao pode alterar localizacoes nesta empresa.</div>
        ) : (
          <>
            <form action={saveLocationAction} className="field-grid">
              <input type="hidden" name="id" value={location.id} />
              <input type="hidden" name="level" value={location.level} />

              <div className="field">
                <label htmlFor="name">Nome *</label>
                <input id="name" name="name" defaultValue={location.name} required />
              </div>

              <div className="field">
                <label htmlFor="parentId">Pai</label>
                <select id="parentId" name="parentId" defaultValue={location.parentId ?? ""}>
                  <option value="">Nivel raiz (sem pai)</option>
                  {locations
                    .filter((l) => l.id !== location.id)
                    .map((loc) => (
                      <option key={loc.id} value={loc.id}>
                        {"  ".repeat(loc.level)}{loc.name} (Nivel {loc.level})
                      </option>
                    ))}
                </select>
              </div>

              <div className="field">
                <label htmlFor="sortOrder">Ordem</label>
                <input id="sortOrder" name="sortOrder" type="number" min="0" defaultValue={location.sortOrder} />
              </div>

              <button type="submit" className="button primary">
                Salvar alteracoes
              </button>
            </form>

            <div style={{ marginTop: 24, paddingTop: 16, borderTop: "1px solid var(--border)" }}>
              <form action={deleteLocationAction} onSubmit={(e) => {
                if (!confirm(`Excluir "${location.name}"? Esta acao nao pode ser desfeita.`)) {
                  e.preventDefault();
                }
              }}>
                <input type="hidden" name="id" value={location.id} />
                <button type="submit" className="button danger" style={{ fontSize: 13 }}>
                  Excluir localizacao
                </button>
              </form>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
