import Link from "next/link";
import { notFound } from "next/navigation";
import { canManageCatalog, requireSessionContext } from "@/lib/auth/auth";
import { getInventoryCountById, getInventoryCountItems, getInventoryDivergences, listProductsByCompany } from "@/lib/store/database";
import { updateInventoryCountItemAction } from "@/features/products/actions";
import CloseInventoryButton from "./CloseInventoryButton";

type InventoryCountDetailPageProps = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{
    error?: string;
    success?: string;
  }>;
};

export default async function InventoryCountDetailPage({ params, searchParams }: InventoryCountDetailPageProps) {
  const session = await requireSessionContext();
  const { id } = await params;
  const search = await searchParams;

  const [count, items, divergences, products] = await Promise.all([
    getInventoryCountById(session.activeCompany.id, id),
    getInventoryCountItems(id),
    getInventoryDivergences(session.activeCompany.id, id).catch(() => []),
    listProductsByCompany(session.activeCompany.id),
  ]);

  if (!count) {
    notFound();
  }

  const canEdit = canManageCatalog(session.activeRole);
  const productMap = Object.fromEntries(products.map((p) => [p.id, p]));
  const isOpen = count.status === "OPEN";
  const totalItems = items.length;
  const countedItems = items.filter((i) => i.countedAt).length;
  const divergingItems = items.filter((i) => i.difference !== 0);

  const totalDiff = divergingItems.reduce((acc, i) => acc + i.difference, 0);
  const absTotalDiff = divergingItems.reduce((acc, i) => acc + Math.abs(i.difference), 0);

  return (
    <div className="stack-lg">
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <Link href="/inventory-counts" className="link-button" style={{ fontSize: 14 }}>
          &larr; Voltar para inventarios
        </Link>
      </div>

      {search?.error ? <div className="message error" style={{ marginBottom: 16 }}>{search.error}</div> : null}
      {search?.success ? <div className="message success" style={{ marginBottom: 16 }}>{search.success}</div> : null}

      {/* Cabecalho */}
      <section className="surface-card section-card">
        <div className="section-header">
          <h2>{count.name}</h2>
          <span className={`status-badge ${isOpen ? "bg-warning" : ""}`}>{count.status}</span>
        </div>

        {/* Resumo */}
        <div className="dashboard-grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", marginBottom: 0 }}>
          <div className="stat-card" style={{ padding: "12px 16px" }}>
            <p className="muted" style={{ fontSize: 11 }}>Total de itens</p>
            <strong style={{ fontSize: 22 }}>{totalItems}</strong>
          </div>
          <div className="stat-card" style={{ padding: "12px 16px" }}>
            <p className="muted" style={{ fontSize: 11 }}>Contados</p>
            <strong style={{ fontSize: 22 }}>{countedItems}/{totalItems}</strong>
          </div>
          <div className="stat-card" style={{ padding: "12px 16px" }}>
            <p className="muted" style={{ fontSize: 11 }}>Divergencias</p>
            <strong style={{ fontSize: 22, color: divergingItems.length > 0 ? "var(--danger, #e53e3e)" : "inherit" }}>
              {divergingItems.length}
            </strong>
          </div>
          <div className="stat-card" style={{ padding: "12px 16px" }}>
            <p className="muted" style={{ fontSize: 11 }}>Diferenca total</p>
            <strong style={{ fontSize: 22 }}>
              {totalDiff > 0 ? "+" : ""}{totalDiff}
            </strong>
          </div>
        </div>

        {isOpen && canEdit && (
          <CloseInventoryButton countId={id} isOpen={isOpen} canEdit={canEdit} />
        )}
      </section>

      {/* Divergencias */}
      {divergences.length > 0 && (
        <section className="surface-card section-card">
          <div className="section-header">
            <h2>Divergencias</h2>
            <span className="muted">{divergences.length} item(ns) com diferenca</span>
          </div>
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Produto</th>
                  <th>Esperado</th>
                  <th>Contado</th>
                  <th>Diferenca</th>
                  <th>Observacao</th>
                </tr>
              </thead>
              <tbody>
                {divergences.map((div) => (
                  <tr key={div.id}>
                    <td>{div.product?.name || "-"}</td>
                    <td>{div.expectedQuantity}</td>
                    <td>{div.countedQuantity}</td>
                    <td>
                      <span style={{ color: div.difference > 0 ? "var(--success, #38a169)" : "var(--danger, #e53e3e)", fontWeight: 600 }}>
                        {div.difference > 0 ? "+" : ""}{div.difference}
                      </span>
                    </td>
                    <td>{div.notes || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Todos os itens */}
      <section className="surface-card section-card">
        <div className="section-header">
          <h2>Itens do inventario</h2>
          <span className="muted">{totalItems} produto(s)</span>
        </div>

        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Produto</th>
                <th>SKU</th>
                <th>Esperado</th>
                <th>Contado</th>
                <th>Diferenca</th>
                <th>Obs</th>
                {isOpen && canEdit ? <th>Acoes</th> : null}
              </tr>
            </thead>
            <tbody>
              {items.map((item) => {
                const product = productMap[item.productId];
                return (
                  <tr key={item.id}>
                    <td>{product?.name || "-"}</td>
                    <td>{product?.sku || "-"}</td>
                    <td>{item.expectedQuantity}</td>
                    <td>
                      {isOpen && canEdit ? (
                        <form action={updateInventoryCountItemAction} style={{ display: "flex", gap: 4, alignItems: "center" }}>
                          <input type="hidden" name="countId" value={id} />
                          <input type="hidden" name="itemId" value={item.id} />
                          <input
                            name="countedQuantity"
                            type="number"
                            min="0"
                            step="0.01"
                            defaultValue={item.countedQuantity}
                            style={{ width: 80, padding: "4px 6px", fontSize: 13 }}
                          />
                          <button type="submit" className="button secondary" style={{ padding: "4px 8px", fontSize: 12 }}>
                            Salvar
                          </button>
                        </form>
                      ) : (
                        item.countedQuantity
                      )}
                    </td>
                    <td>
                      {item.difference !== 0 ? (
                        <span style={{ color: item.difference > 0 ? "var(--success, #38a169)" : "var(--danger, #e53e3e)", fontWeight: 600 }}>
                          {item.difference > 0 ? "+" : ""}{item.difference}
                        </span>
                      ) : "0"}
                    </td>
                    <td>
                      {isOpen && canEdit ? (
                        <form action={updateInventoryCountItemAction} style={{ display: "inline" }}>
                          <input type="hidden" name="countId" value={id} />
                          <input type="hidden" name="itemId" value={item.id} />
                          <input type="hidden" name="countedQuantity" value={item.countedQuantity} />
                          <input
                            name="notes"
                            defaultValue={item.notes ?? ""}
                            placeholder="Obs"
                            style={{ width: 100, padding: "4px 6px", fontSize: 12 }}
                          />
                          <button type="submit" className="link-button" style={{ fontSize: 12 }}>
                            OK
                          </button>
                        </form>
                      ) : (
                        item.notes || "-"
                      )}
                    </td>
                    {isOpen && canEdit ? null : null}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
