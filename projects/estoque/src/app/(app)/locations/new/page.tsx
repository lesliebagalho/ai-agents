import { canManageCatalog, requireSessionContext } from "@/lib/auth/auth";
import { saveLocationAction } from "@/features/products/actions";
import { listLocationsByCompany } from "@/lib/store/database";

type NewLocationPageProps = {
  searchParams?: Promise<{
    error?: string;
    parentId?: string;
    level?: string;
  }>;
};

export default async function NewLocationPage({ searchParams }: NewLocationPageProps) {
  const session = await requireSessionContext();
  const params = await searchParams;
  const locations = await listLocationsByCompany(session.activeCompany.id);
  const canEdit = canManageCatalog(session.activeRole);
  const parentLevel = params?.level ? Number(params.level) : 0;

  return (
    <div className="stack-lg">
      <section className="surface-card section-card">
        <div className="section-header">
          <h2>Nova localizacao</h2>
        </div>

        {params?.error ? <div className="message error" style={{ marginBottom: 16 }}>{params.error}</div> : null}

        {!canEdit ? (
          <div className="message error">Seu perfil nao pode alterar localizacoes nesta empresa.</div>
        ) : (
          <form action={saveLocationAction} className="field-grid">
            <input type="hidden" name="id" value="" />
            <input type="hidden" name="level" value={params?.level ?? "0"} />

            <div className="field">
              <label htmlFor="name">Nome *</label>
              <input id="name" name="name" required placeholder="Ex: Galpao A, Rua 01, Prateleira 02" />
            </div>

            <div className="field">
              <label htmlFor="parentId">Pai (opcional)</label>
              <select id="parentId" name="parentId" defaultValue={params?.parentId ?? ""}>
                <option value="">Nivel raiz (sem pai)</option>
                {locations.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {"  ".repeat(loc.level)}{loc.name} (Nivel {loc.level})
                  </option>
                ))}
              </select>
            </div>

            <div className="field">
              <label htmlFor="sortOrder">Ordem</label>
              <input id="sortOrder" name="sortOrder" type="number" min="0" defaultValue="0" />
            </div>

            <p className="muted" style={{ fontSize: 13 }}>
              Nivel atual: <strong>{parentLevel}</strong>. As localizacoes sao organizadas em niveis hierarquicos.
            </p>

            <button type="submit" className="button primary">
              Criar localizacao
            </button>
          </form>
        )}
      </section>
    </div>
  );
}
