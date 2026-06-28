import { canManageCatalog, requireSessionContext } from "@/lib/auth/auth";
import { saveCategoryAction } from "@/features/products/actions";
import { getCategoryById } from "@/lib/store/database";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";

type EditCategoryPageProps = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{
    error?: string;
    success?: string;
  }>;
};

export default async function EditCategoryPage({ params, searchParams }: EditCategoryPageProps) {
  const session = await requireSessionContext();
  const { id } = await params;
  const search = await searchParams;
  const category = await getCategoryById(session.activeCompany.id, id);

  if (!category) {
    notFound();
  }

  const canEdit = canManageCatalog(session.activeRole);

  return (
    <div className="stack-lg">
      <section className="surface-card section-card">
        <div className="section-header">
          <h2>Editando: {category.name}</h2>
          <Link href="/categories" className="link-button">
            Cancelar edicao
          </Link>
        </div>

        {search?.error ? <div className="message error" style={{ marginBottom: 16 }}>{search.error}</div> : null}
        {search?.success ? <div className="message success" style={{ marginBottom: 16 }}>{search.success}</div> : null}

        {!canEdit ? (
          <div className="message error">Seu perfil nao pode alterar categorias nesta empresa.</div>
        ) : (
          <form action={saveCategoryAction} className="field-grid">
            <input type="hidden" name="id" value={category.id} />

            <div className="field">
              <label htmlFor="name">Nome *</label>
              <input id="name" name="name" defaultValue={category.name} required />
            </div>

            <div className="field">
              <label htmlFor="description">Descricao</label>
              <textarea
                id="description"
                name="description"
                defaultValue={category.description ?? ""}
                placeholder="Opcional"
              />
            </div>

            <button type="submit" className="button primary">
              Salvar alteracoes
            </button>
          </form>
        )}
      </section>
    </div>
  );
}
