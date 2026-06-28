import Link from "next/link";
import { canManageCatalog, requireSessionContext } from "@/lib/auth/auth";
import { listCategoriesByCompany, listProductsWithBalance } from "@/lib/store/database";
import ProductThumb from "@/components/ProductThumb";

type ProductsPageProps = {
  searchParams?: Promise<{
    error?: string;
    success?: string;
    q?: string;
    categoryId?: string;
    status?: string;
  }>;
};

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const session = await requireSessionContext();
  const params = await searchParams;
  const filters = {
    query: params?.q,
    categoryId: params?.categoryId,
    status: params?.status,
  };

  const [categories, products] = await Promise.all([
    listCategoriesByCompany(session.activeCompany.id),
    listProductsWithBalance(session.activeCompany.id, filters),
  ]);
  const canEdit = canManageCatalog(session.activeRole);

  return (
    <div className="stack-lg">
      <section className="surface-card section-card">
        <div className="section-header">
          <h2>Filtros de produtos</h2>
          <span className="muted">{session.activeCompany.name}</span>
        </div>

        <form action="/products" className="field-row filters-row">
          <div className="field">
            <label htmlFor="q">Busca</label>
            <input id="q" name="q" defaultValue={params?.q ?? ""} placeholder="Nome ou SKU" />
          </div>

          <div className="field">
            <label htmlFor="categoryId">Categoria</label>
            <select id="categoryId" name="categoryId" defaultValue={params?.categoryId ?? ""}>
              <option value="">Todas</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label htmlFor="status">Status</label>
            <select id="status" name="status" defaultValue={params?.status ?? "ALL"}>
              <option value="ALL">Todos</option>
              <option value="ACTIVE">Ativos</option>
              <option value="INACTIVE">Inativos</option>
            </select>
          </div>

          <div className="filters-actions">
            <button type="submit" className="button secondary">
              Filtrar
            </button>
            <Link href="/products" className="link-button">
              Limpar
            </Link>
          </div>
        </form>
      </section>

      {params?.error ? <div className="message error" style={{ marginBottom: 16 }}>{params.error}</div> : null}
      {params?.success ? <div className="message success" style={{ marginBottom: 16 }}>{params.success}</div> : null}

      <section className="surface-card section-card">
        <div className="section-header">
          <h2>Produtos cadastrados</h2>
          <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
            <span className="muted">{products.length} item(ns)</span>
            <Link href="/products/labels" className="link-button" style={{ fontSize: 13 }}>
              Etiquetas
            </Link>
            <Link href="/products/export" className="link-button" style={{ fontSize: 13 }}>
              Exportar
            </Link>
            {canEdit ? (
              <>
                <Link href="/products/import" className="link-button" style={{ fontSize: 13 }}>
                  Importar
                </Link>
                <Link href="/products/new" className="button primary" style={{ fontSize: 14 }}>
                  + Novo produto
                </Link>
              </>
            ) : null}
          </div>
        </div>

        {products.length === 0 ? (
          <div className="empty-state">Nenhum produto encontrado com os filtros atuais.</div>
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th></th>
                  <th>Produto</th>
                  <th>SKU</th>
                  <th>Categoria</th>
                  <th>Unidade</th>
                  <th>Saldo</th>
                  <th>Minimo</th>
                  <th>Status</th>
                  <th>Acoes</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => {
                  const category = categories.find((item) => item.id === product.categoryId);

                  return (
                    <tr key={product.id}>
                      <td>
                        <ProductThumb url={product.imageUrl} alt={product.name} />
                      </td>
                      <td>{product.name}</td>
                      <td>{product.sku || "-"}</td>
                      <td>{category?.name || "-"}</td>
                      <td>{product.unit}</td>
                      <td>{product.currentQuantity}</td>
                      <td>{product.minimumStock ?? "-"}</td>
                      <td>
                        <span className="status-badge">{product.status}</span>
                      </td>
                      <td>
                        {canEdit ? (
                          <Link href={`/products/${product.id}`} className="link-button">
                            Editar
                          </Link>
                        ) : (
                          <span className="muted">Somente leitura</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
