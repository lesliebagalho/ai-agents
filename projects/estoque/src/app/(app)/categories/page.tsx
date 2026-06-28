import Link from "next/link";
import { canManageCatalog, requireSessionContext } from "@/lib/auth/auth";
import { listCategoriesByCompany } from "@/lib/store/database";

type CategoriesPageProps = {
  searchParams?: Promise<{
    error?: string;
    success?: string;
  }>;
};

export default async function CategoriesPage({ searchParams }: CategoriesPageProps) {
  const session = await requireSessionContext();
  const params = await searchParams;
  const categories = await listCategoriesByCompany(session.activeCompany.id);
  const canEdit = canManageCatalog(session.activeRole);

  return (
    <div className="stack-lg">
      {params?.error ? <div className="message error" style={{ marginBottom: 16 }}>{params.error}</div> : null}
      {params?.success ? <div className="message success" style={{ marginBottom: 16 }}>{params.success}</div> : null}

      <section className="surface-card section-card">
        <div className="section-header">
          <h2>Categorias da empresa</h2>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <span className="muted">{categories.length} item(ns)</span>
            {canEdit ? (
              <Link href="/categories/new" className="button primary" style={{ fontSize: 14 }}>
                + Nova categoria
              </Link>
            ) : null}
          </div>
        </div>

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
                    <td>
                      {canEdit ? (
                        <Link href={`/categories/${category.id}`} className="link-button">
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
