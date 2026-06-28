import { canManageCatalog, requireSessionContext } from "@/lib/auth/auth";
import { saveCategoryAction } from "@/features/products/actions";

type NewCategoryPageProps = {
  searchParams?: Promise<{
    error?: string;
    success?: string;
  }>;
};

export default async function NewCategoryPage({ searchParams }: NewCategoryPageProps) {
  const session = await requireSessionContext();
  const params = await searchParams;
  const canEdit = canManageCatalog(session.activeRole);

  return (
    <div className="stack-lg">
      <section className="surface-card section-card">
        <div className="section-header">
          <h2>Nova categoria</h2>
        </div>

        {params?.error ? <div className="message error" style={{ marginBottom: 16 }}>{params.error}</div> : null}
        {params?.success ? <div className="message success" style={{ marginBottom: 16 }}>{params.success}</div> : null}

        {!canEdit ? (
          <div className="message error">Seu perfil nao pode alterar categorias nesta empresa.</div>
        ) : (
          <form action={saveCategoryAction} className="field-grid">
            <input type="hidden" name="id" value="" />

            <div className="field">
              <label htmlFor="name">Nome *</label>
              <input id="name" name="name" required placeholder="Ex: Alimentos, Eletronicos" />
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
              Criar categoria
            </button>
          </form>
        )}
      </section>
    </div>
  );
}
