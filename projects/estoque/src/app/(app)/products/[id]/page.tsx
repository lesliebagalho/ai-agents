import Link from "next/link";
import { notFound } from "next/navigation";
import { canManageCatalog, requireSessionContext } from "@/lib/auth/auth";
import { saveProductAction } from "@/features/products/actions";
import { getProductById, listCategoriesByCompany } from "@/lib/store/database";

type EditProductPageProps = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ error?: string; success?: string }>;
};

export default async function EditProductPage({ params, searchParams }: EditProductPageProps) {
  const session = await requireSessionContext();
  const { id } = await params;
  const sp = await searchParams;

  const [categories, product] = await Promise.all([
    listCategoriesByCompany(session.activeCompany.id),
    getProductById(session.activeCompany.id, id),
  ]);

  if (!product) {
    notFound();
  }

  const canEdit = canManageCatalog(session.activeRole);

  return (
    <div className="stack-lg">
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <Link href="/products" className="link-button" style={{ fontSize: 14 }}>
          &larr; Voltar para listagem
        </Link>
        <span className="muted" style={{ fontSize: 14 }}>
          Editando produto
        </span>
      </div>

      <section className="surface-card section-card">
        <div className="section-header">
          <h2>Editando: {product.name}</h2>
        </div>

        {sp?.error ? (
          <div className="message error" style={{ marginBottom: 16 }}>
            {sp.error}
          </div>
        ) : null}

        {sp?.success ? (
          <div className="message success" style={{ marginBottom: 16 }}>
            {sp.success}
          </div>
        ) : null}

        {!canEdit ? (
          <div className="message error">Seu perfil nao pode alterar produtos nesta empresa.</div>
        ) : (
          <form action={saveProductAction} className="field-grid">
            <input type="hidden" name="id" value={product.id} />

            <div className="field">
              <label htmlFor="name">Nome</label>
              <input id="name" name="name" defaultValue={product.name ?? ""} required />
            </div>

            <div className="field-row two">
              <div className="field">
                <label htmlFor="sku">SKU</label>
                <input id="sku" name="sku" defaultValue={product.sku ?? ""} />
              </div>

              <div className="field">
                <label htmlFor="categoryId">Categoria</label>
                <select id="categoryId" name="categoryId" defaultValue={product.categoryId ?? ""}>
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
                <select id="unit" name="unit" defaultValue={product.unit ?? "UNIT"}>
                  <option value="UNIT">UNIT</option>
                  <option value="BOX">BOX</option>
                  <option value="KG">KG</option>
                  <option value="LITER">LITER</option>
                  <option value="METER">METER</option>
                </select>
              </div>

              <div className="field">
                <label htmlFor="costPrice">Preco de custo (R$)</label>
                <input
                  id="costPrice"
                  name="costPrice"
                  type="number"
                  min="0"
                  step="0.01"
                  defaultValue={product.costPrice ?? ""}
                  placeholder="0,00"
                />
              </div>
            </div>

            <div className="field-row two">
              <div className="field">
                <label htmlFor="minimumStock">Estoque minimo</label>
                <input
                  id="minimumStock"
                  name="minimumStock"
                  type="number"
                  min="0"
                  step="0.01"
                  defaultValue={product.minimumStock ?? ""}
                />
              </div>

              <div className="field">
                <label htmlFor="status">Status</label>
                <select id="status" name="status" defaultValue={product.status ?? "ACTIVE"}>
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="INACTIVE">INACTIVE</option>
                </select>
              </div>
            </div>

            <div style={{ display: "flex", gap: 12 }}>
              <button type="submit" className="button primary">
                Salvar alteracoes
              </button>
              <Link href="/products" className="button secondary">
                Cancelar
              </Link>
            </div>
          </form>
        )}

        {/* Visualizacao em modo somente leitura */}
        {!canEdit && (
          <div className="field-grid" style={{ marginTop: 24 }}>
            <div className="field-row two">
              <div className="field">
                <label>Nome</label>
                <p style={{ padding: "11px 12px", background: "var(--surface-muted)", borderRadius: 8, margin: 0 }}>
                  {product.name}
                </p>
              </div>
              <div className="field">
                <label>SKU</label>
                <p style={{ padding: "11px 12px", background: "var(--surface-muted)", borderRadius: 8, margin: 0 }}>
                  {product.sku || "-"}
                </p>
              </div>
            </div>
            <div className="field-row two">
              <div className="field">
                <label>Unidade</label>
                <p style={{ padding: "11px 12px", background: "var(--surface-muted)", borderRadius: 8, margin: 0 }}>
                  {product.unit}
                </p>
              </div>
              <div className="field">
                <label>Estoque minimo</label>
                <p style={{ padding: "11px 12px", background: "var(--surface-muted)", borderRadius: 8, margin: 0 }}>
                  {product.minimumStock ?? "-"}
                </p>
              </div>
            </div>
            <div className="field">
              <label>Status</label>
              <p style={{ padding: "11px 12px", background: "var(--surface-muted)", borderRadius: 8, margin: 0 }}>
                <span className="status-badge">{product.status}</span>
              </p>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
