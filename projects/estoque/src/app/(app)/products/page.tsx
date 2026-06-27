import Link from "next/link";
import { canManageCatalog, requireSessionContext } from "@/lib/auth/auth";
import { saveProductAction } from "@/features/products/actions";
import { getProductById, listCategoriesByCompany, listProductsWithBalance } from "@/lib/store/database";

type ProductsPageProps = {
  searchParams?: Promise<{
    edit?: string;
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

  const [categories, products, editingProduct] = await Promise.all([
    listCategoriesByCompany(session.activeCompany.id),
    listProductsWithBalance(session.activeCompany.id, filters),
    getProductById(session.activeCompany.id, params?.edit),
  ]);
  const canEdit = canManageCatalog(session.activeRole);

  return (
    <div className="stack-lg">
      <section className="surface-card section-card">
        <div className="section-header">
          <h2>Filtros de produtos</h2>
          <span className="muted">{session.activeCompany.name}</span>
        </div>

        <form action="/products" className="field-row two">
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

          <div style={{ display: "flex", alignItems: "end", gap: 12 }}>
            <button type="submit" className="button secondary">
              Filtrar
            </button>
            <Link href="/products" className="link-button">
              Limpar
            </Link>
          </div>
        </form>
      </section>

      <div className="content-grid two">
        <section className="surface-card section-card">
          <div className="section-header">
            <h2>Produtos cadastrados</h2>
            <span className="muted">{products.length} item(ns)</span>
          </div>

          {params?.error ? <div className="message error" style={{ marginBottom: 16 }}>{params.error}</div> : null}
          {params?.success ? <div className="message success" style={{ marginBottom: 16 }}>{params.success}</div> : null}

          {products.length === 0 ? (
            <div className="empty-state">Nenhum produto encontrado com os filtros atuais.</div>
          ) : (
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
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
                        <td>{product.name}</td>
                        <td>{product.sku || "-"}</td>
                        <td>{category?.name || "-"}</td>
                        <td>{product.unit}</td>
                        <td>{product.currentQuantity}</td>
                        <td>{product.minimumStock ?? "-"}</td>
                        <td>
                          <span className="status-badge">{product.status}</span>
                        </td>
                        <td>{canEdit ? <Link href={`/products?edit=${product.id}`} className="link-button">Editar</Link> : <span className="muted">Somente leitura</span>}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="surface-card section-card">
          <div className="section-header">
            <h2>{editingProduct ? "Editar produto" : "Novo produto"}</h2>
            {editingProduct ? (
              <Link href="/products" className="link-button">
                Limpar edicao
              </Link>
            ) : null}
          </div>

          {!canEdit ? (
            <div className="message error">Seu perfil nao pode alterar produtos nesta empresa.</div>
          ) : (
          <form action={saveProductAction} className="field-grid">
            <input type="hidden" name="id" value={editingProduct?.id ?? ""} />

            <div className="field">
              <label htmlFor="name">Nome</label>
              <input id="name" name="name" defaultValue={editingProduct?.name ?? ""} required />
            </div>

            <div className="field-row two">
              <div className="field">
                <label htmlFor="sku">SKU</label>
                <input id="sku" name="sku" defaultValue={editingProduct?.sku ?? ""} />
              </div>

              <div className="field">
                <label htmlFor="categoryId">Categoria</label>
                <select id="categoryId" name="categoryId" defaultValue={editingProduct?.categoryId ?? ""}>
                  <option value="">Sem categoria</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="field-row two">
              <div className="field">
                <label htmlFor="unit">Unidade</label>
                <select id="unit" name="unit" defaultValue={editingProduct?.unit ?? "UNIT"}>
                  <option value="UNIT">UNIT</option>
                  <option value="BOX">BOX</option>
                  <option value="KG">KG</option>
                  <option value="LITER">LITER</option>
                  <option value="METER">METER</option>
                </select>
              </div>

              <div className="field">
                <label htmlFor="minimumStock">Estoque minimo</label>
                <input
                  id="minimumStock"
                  name="minimumStock"
                  type="number"
                  min="0"
                  step="0.01"
                  defaultValue={editingProduct?.minimumStock ?? ""}
                />
              </div>
            </div>

            <div className="field">
              <label htmlFor="status">Status</label>
              <select id="status" name="status" defaultValue={editingProduct?.status ?? "ACTIVE"}>
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
              </select>
            </div>

            <button type="submit" className="button primary">
              {editingProduct ? "Salvar alteracoes" : "Criar produto"}
            </button>
          </form>
          )}
        </section>
      </div>
    </div>
  );
}
