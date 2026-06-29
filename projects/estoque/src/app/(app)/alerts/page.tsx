import Link from "next/link";
import { requireSessionContext } from "@/lib/auth/auth";
import { getAlerts } from "@/lib/store/database";

type AlertsPageProps = {
  searchParams?: Promise<{
    tab?: string;
  }>;
};

const TABS = [
  { key: "low-stock", label: "Estoque baixo", icon: "⬇" },
  { key: "zero-stock", label: "Estoque zerado", icon: "🚫" },
  { key: "expiring", label: "Proximo do vencimento", icon: "⏰" },
  { key: "no-movement", label: "Sem movimentacao", icon: "💤" },
];

export default async function AlertsPage({ searchParams }: AlertsPageProps) {
  const session = await requireSessionContext();
  const params = await searchParams;
  const activeTab = params?.tab || "low-stock";
  const alerts = await getAlerts(session.activeCompany.id);

  const totalAlerts =
    alerts.lowStock.length +
    alerts.zeroStock.length +
    alerts.expiringSoon.length +
    alerts.noMovement.length;

  return (
    <div className="stack-lg">
      <section className="surface-card section-card">
        <div className="section-header">
          <h2>Alertas do estoque</h2>
          <span className="muted">{totalAlerts} alerta(s) ativo(s)</span>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 4, marginBottom: 20, flexWrap: "wrap" }}>
          {TABS.map((tab) => {
            const count =
              tab.key === "low-stock"
                ? alerts.lowStock.length
                : tab.key === "zero-stock"
                  ? alerts.zeroStock.length
                  : tab.key === "expiring"
                    ? alerts.expiringSoon.length
                    : alerts.noMovement.length;

            return (
              <Link
                key={tab.key}
                href={`/alerts?tab=${tab.key}`}
                className={`button ${activeTab === tab.key ? "primary" : "secondary"}`}
                style={{ fontSize: 13, display: "flex", alignItems: "center", gap: 6 }}
              >
                <span>{tab.icon}</span>
                {tab.label}
                {count > 0 && (
                  <span
                    style={{
                      background: activeTab === tab.key ? "rgba(255,255,255,0.3)" : "var(--primary)",
                      color: "#fff",
                      borderRadius: 12,
                      padding: "1px 8px",
                      fontSize: 11,
                    }}
                  >
                    {count}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Conteudo da tab ativa */}
        {activeTab === "low-stock" && (
          <>
            <h3 style={{ fontSize: 15, marginBottom: 12 }}>
              Estoque baixo <span className="muted">({alerts.lowStock.length})</span>
            </h3>
            <p className="muted" style={{ fontSize: 13, marginBottom: 12 }}>
              Produtos com quantidade igual ou inferior ao estoque minimo definido.
            </p>
            {alerts.lowStock.length === 0 ? (
              <div className="empty-state">Nenhum produto com estoque baixo.</div>
            ) : (
              <div className="table-wrap">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Produto</th>
                      <th>SKU</th>
                      <th>Saldo atual</th>
                      <th>Estoque minimo</th>
                      <th>Diferenca</th>
                      <th>Acoes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {alerts.lowStock.map((item) => (
                      <tr key={item.product.id}>
                        <td>{item.product.name}</td>
                        <td>{item.product.sku || "-"}</td>
                        <td style={{ fontWeight: 700, color: "var(--danger, #e53e3e)" }}>
                          {item.currentQuantity}
                        </td>
                        <td>{item.product.minimumStock}</td>
                        <td style={{ color: "var(--danger, #e53e3e)" }}>
                          {item.currentQuantity - (item.product.minimumStock ?? 0)}
                        </td>
                        <td>
                          <Link href={`/products/${item.product.id}`} className="link-button">
                            Editar
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {activeTab === "zero-stock" && (
          <>
            <h3 style={{ fontSize: 15, marginBottom: 12 }}>
              Estoque zerado <span className="muted">({alerts.zeroStock.length})</span>
            </h3>
            <p className="muted" style={{ fontSize: 13, marginBottom: 12 }}>
              Produtos ativos com saldo igual a zero. Considere registrar uma entrada ou desativar o produto.
            </p>
            {alerts.zeroStock.length === 0 ? (
              <div className="empty-state">Nenhum produto com estoque zerado.</div>
            ) : (
              <div className="table-wrap">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Produto</th>
                      <th>SKU</th>
                      <th>Categoria</th>
                      <th>Acoes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {alerts.zeroStock.map((item) => (
                      <tr key={item.product.id}>
                        <td>{item.product.name}</td>
                        <td>{item.product.sku || "-"}</td>
                        <td>{item.product.categoryId || "-"}</td>
                        <td>
                          <Link href={`/products/${item.product.id}`} className="link-button">
                            Editar
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {activeTab === "expiring" && (
          <>
            <h3 style={{ fontSize: 15, marginBottom: 12 }}>
              Proximo do vencimento <span className="muted">({alerts.expiringSoon.length})</span>
            </h3>
            <p className="muted" style={{ fontSize: 13, marginBottom: 12 }}>
              Produtos com data de vencimento nos proximos 30 dias.
            </p>
            {alerts.expiringSoon.length === 0 ? (
              <div className="empty-state">
                Nenhum produto proximo do vencimento.
                <p className="muted" style={{ marginTop: 8 }}>
                  Para usar este alerta, cadastre a data de validade nos produtos.
                </p>
              </div>
            ) : (
              <div className="table-wrap">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Produto</th>
                      <th>Data vencimento</th>
                      <th>Dias restantes</th>
                      <th>Status</th>
                      <th>Acoes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {alerts.expiringSoon.map((item) => {
                      const isUrgent = item.daysUntilExpiry <= 7;
                      return (
                        <tr key={item.product.id}>
                          <td>{item.product.name}</td>
                          <td>{new Date(item.product.expiryDate!).toLocaleDateString("pt-BR")}</td>
                          <td style={{ fontWeight: 700, color: isUrgent ? "var(--danger, #e53e3e)" : "var(--warning, #dd6b20)" }}>
                            {item.daysUntilExpiry} dia(s)
                          </td>
                          <td>
                            <span className={`status-badge ${isUrgent ? "" : "bg-warning"}`}>
                              {isUrgent ? "URGENTE" : "ATENCAO"}
                            </span>
                          </td>
                          <td>
                            <Link href={`/products/${item.product.id}`} className="link-button">
                              Editar
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {activeTab === "no-movement" && (
          <>
            <h3 style={{ fontSize: 15, marginBottom: 12 }}>
              Sem movimentacao <span className="muted">({alerts.noMovement.length})</span>
            </h3>
            <p className="muted" style={{ fontSize: 13, marginBottom: 12 }}>
              Produtos sem nenhuma movimentacao nos ultimos 60 dias. Podem ser candidatos a desativacao.
            </p>
            {alerts.noMovement.length === 0 ? (
              <div className="empty-state">Todos os produtos tiveram movimentacao nos ultimos 60 dias.</div>
            ) : (
              <div className="table-wrap">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Produto</th>
                      <th>SKU</th>
                      <th>Saldo atual</th>
                      <th>Ultima movimentacao</th>
                      <th>Dias parado</th>
                      <th>Acoes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {alerts.noMovement.map((item) => {
                      const lastDate = item.lastMovementAt ? new Date(item.lastMovementAt) : null;
                      const daysSince = lastDate
                        ? Math.floor((Date.now() - lastDate.getTime()) / (1000 * 60 * 60 * 24))
                        : null;

                      return (
                        <tr key={item.product.id}>
                          <td>{item.product.name}</td>
                          <td>{item.product.sku || "-"}</td>
                          <td>{item.currentQuantity}</td>
                          <td>
                            {lastDate
                              ? lastDate.toLocaleDateString("pt-BR")
                              : "Nunca"}
                          </td>
                          <td>{daysSince !== null ? `${daysSince} dias` : "-"}</td>
                          <td>
                            <Link href={`/products/${item.product.id}`} className="link-button">
                              Editar
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
