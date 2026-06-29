import { canManageCatalog, requireSessionContext } from "@/lib/auth/auth";
import { saveBrandAction } from "@/features/products/actions";

type NewBrandPageProps = {
  searchParams?: Promise<{
    error?: string;
    success?: string;
  }>;
};

export default async function NewBrandPage({ searchParams }: NewBrandPageProps) {
  const session = await requireSessionContext();
  const params = await searchParams;
  const canEdit = canManageCatalog(session.activeRole);

  return (
    <div className="stack-lg">
      <section className="surface-card section-card">
        <div className="section-header">
          <h2>Nova marca</h2>
        </div>

        {params?.error ? <div className="message error" style={{ marginBottom: 16 }}>{params.error}</div> : null}
        {params?.success ? <div className="message success" style={{ marginBottom: 16 }}>{params.success}</div> : null}

        {!canEdit ? (
          <div className="message error">Seu perfil nao pode alterar marcas nesta empresa.</div>
        ) : (
          <form action={saveBrandAction} className="field-grid">
            <input type="hidden" name="id" value="" />

            <div className="field">
              <label htmlFor="name">Nome *</label>
              <input id="name" name="name" required placeholder="Ex: Nestle, Coca-Cola, 3M" />
            </div>

            <div className="field">
              <label htmlFor="description">Descricao</label>
              <textarea
                id="description"
                name="description"
                placeholder="Opcional"
              />
            </div>

            <button type="submit" className="button primary">
              Criar marca
            </button>
          </form>
        )}
      </section>
    </div>
  );
}
