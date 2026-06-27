import Link from "next/link";
import { canManageCatalog, requireSessionContext } from "@/lib/auth/auth";
import { saveCategoryAction } from "@/features/products/actions";
import { getCategoryById, listCategoriesByCompany } from "@/lib/store/database";

type CategoriesPageProps = {
  searchParams?: Promise<{
    edit?: string;
    error?: string;
    success?: string;
  }>;
};

export default async function CategoriesPage({ searchParams }: CategoriesPageProps) {
  const session = await requireSessionContext();
  const params = await searchParams;
  const categories = await listCategoriesByCompany(session.activeCompany.id);
  const editingCategory = await getCategoryById(session.activeCompany.id, params?.edit);
  const canEdit = canManageCatalog(session.activeRole);

  return (
    <div className="content-grid two">
      <section className="surface-card section-card">
        <div className="section-header">
          <h2>Categorias da empresa</h2>
          <span className="muted">{session.activeCompany.name}</span>
        </div>

        {params?.error ? <div className="message error" style={{ marginBottom: 16 }}>{params.error}</div> : null}
        {params?.success ? <div className="message success" style={{ marginBottom: 16 }}>{params.success}</div> : null}

        {categories.length === 0 ? (
          <div className="empty-state">Nenhuma categoria cadastrada para a empresa ativa.</div>
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
                {categories.map((category) => (
                  <tr key={category.id}>
                    <td>{category.name}</td>
                    <td>{category.description || "-"}</td>
                    <td>{canEdit ? <Link href={`/categories?edit=${category.id}`} className="link-button">Editar</Link> : <span className="muted">Somente leitura</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="surface-card section-card">
        <div className="section-header">
          <h2>{editingCategory ? "Editar categoria" : "Nova categoria"}</h2>
          {editingCategory ? (
            <Link href="/categories" className="link-button">
              Limpar edicao
            </Link>
          ) : null}
        </div>

        {!canEdit ? (
          <div className="message error">Seu perfil nao pode alterar categorias nesta empresa.</div>
        ) : (
        <form action={saveCategoryAction} className="field-grid">
          <input type="hidden" name="id" value={editingCategory?.id ?? ""} />

          <div className="field">
            <label htmlFor="name">Nome</label>
            <input id="name" name="name" defaultValue={editingCategory?.name ?? ""} required />
          </div>

          <div className="field">
            <label htmlFor="description">Descricao</label>
            <textarea
              id="description"
              name="description"
              defaultValue={editingCategory?.description ?? ""}
              placeholder="Opcional"
            />
          </div>

          <button type="submit" className="button primary">
            {editingCategory ? "Salvar alteracoes" : "Criar categoria"}
          </button>
        </form>
        )}
      </section>
    </div>
  );
}
