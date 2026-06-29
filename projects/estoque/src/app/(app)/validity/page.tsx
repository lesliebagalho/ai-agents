import Link from "next/link";
import { requireSessionContext } from "@/lib/auth/auth";
import { getValidityAlerts, getValiditySummaryByMonth } from "@/lib/store/database";

type ValidityPageProps = {
  searchParams?: Promise<{
    tab?: string;
  }>;
};

export default async function ValidityPage({ searchParams }: ValidityPageProps) {
  const session = await requireSessionContext();
  const params = await searchParams;
  const activeTab = params?.tab || "expiring";

  const [alerts, monthlySummary] = await Promise.all([
    getValidityAlerts(session.activeCompany.id),
    getValiditySummaryByMonth(session.activeCompany.id),
  ]);

  const totalExpiringValue = alerts.expiringSoon.reduce((acc, i) => acc + (i.totalValue ?? 0), 0);
  const totalExpiredValue = alerts.expired.reduce((acc, i) => acc + (i.totalValue ?? 0), 0);

  return (
    <div className="stack-lg">
      <section className="surface-card section-card">
        <div className="section-header">
          <h2>Controle de validade</h2>
          <span className="muted">
            {alerts.expiringSoon.length + alerts.expired.length} alerta(s)
          </span>
        </div>

        {/* Cards de resumo */}
        <div className="dashboard-grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", marginBottom: 20 }}>
          <div className="stat-card" style={{ padding: "12px 16px", borderLeft: "3px solid var(--warning, #dd6b20)" }}>
            <p className="muted" style={{ fontSize: 11 }}>A vencer (30 dias)</p>
            <strong style={{ fontSize: 22 }}>{alerts.expiringSoon.length}</strong>
            <p className="muted" style={{ fontSize: 11 }}>
              {alerts.expiringSoon.length > 0
                ? `R$ ${totalExpiringValue.toFixed(2)} em risco`
                : "Nenhum"}
            </p>
          </div>
          <div className="stat-card" style={{ padding: "12px 16px", borderLeft: "3px solid var(--danger, #e53e3e)" }}>
            <p className="muted" style={{ fontSize: 11 }}>Vencidos</p>
            <strong style={{ fontSize: 22, color: "var(--danger, #e53e3e)" }}>{alerts.expired.length}</strong>
            <p className="muted" style={{ fontSize: 11 }}>
              {alerts.expired.length > 0
                ? `R$ ${totalExpiredValue.toFixed(2)} em perda`
                : "Nenhum"}
            </p>
          </div>
          <div className="stat-card" style={{ padding: "12px 16px" }}>
            <p className="muted" style={{ fontSize: 11 }}>Produtos com validade</p>
            <strong style={{ fontSize: 22 }}>
              {monthlySummary.reduce((acc, m) => acc + m.count, 0)}
            </strong>
          </div>
          <div className="stat-card" style={{ padding: "12px 16px" }}>
            <p className="muted" style={{ fontSize: 11 }}>Meses com vencimento</p>
            <strong style={{ fontSize: 22 }}>{monthlySummary.length}</strong>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 4, marginBottom: 20, flexWrap: "wrap" }}>
          {[
            { key: "expiring", label: "A vencer", count: alerts.expiringSoon.length },
            { key: "expired", label: "Vencidos", count: alerts.expired.length },
            { key: "calendar", label: "Calendario", count: null },
          ].map((tab) => (
            <Link
              key={tab.key}
              href={`/validity?tab=${tab.key}`}
              className={`button ${activeTab === tab.key ? "primary" : "secondary"}`}
              style={{ fontSize: 13, display: "flex", alignItems: "center", gap: 6 }}
            >
              {tab.label}
              {tab.count !== null && tab.count > 0 && (
                <span
                  style={{
                    background: activeTab === tab.key ? "rgba(255,255,255,0.3)" : "var(--primary)",
                    color: "#fff",
                    borderRadius: 12,
                    padding: "1px 8px",
                    fontSize: 11,
                  }}
                >
                  {tab.count}
                </span>
              )}
            </Link>
          ))}
        </div>

        {/* Tab: A vencer */}
        {activeTab === "expiring" && (
          <>
            <h3 style={{ fontSize: 15, marginBottom: 12 }}>
              Produtos a vencer nos proximos 30 dias <span className="muted">({alerts.expiringSoon.length})</span>
            </h3>
            {alerts.expiringSoon.length === 0 ? (
              <div className="empty-state">Nenhum produto proximo do vencimento.</div>
            ) : (
              <div className="table-wrap">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Produto</th>
                      <th>SKU</th>
                      <th>Data vencimento</th>
                      <th>Dias restantes</th>
                      <th>Quantidade</th>
                      <th>Valor total</th>
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
                          <td>{item.product.sku || "-"}</td>
                          <td>{new Date(item.product.expiryDate!).toLocaleDateString("pt-BR")}</td>
                          <td style={{ fontWeight: 700, fontSize: 15, color: isUrgent ? "var(--danger, #e53e3e)" : "var(--warning, #dd6b20)" }}>
                            {item.daysUntilExpiry}d
                          </td>
                          <td>{item.currentQuantity}</td>
                          <td>{item.totalValue !== undefined ? `R$ ${item.totalValue.toFixed(2)}` : "-"}</td>
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

        {/* Tab: Vencidos */}
        {activeTab === "expired" && (
          <>
            <h3 style={{ fontSize: 15, marginBottom: 12 }}>
              Produtos vencidos <span className="muted">({alerts.expired.length})</span>
            </h3>
            <p className="muted" style={{ fontSize: 13, marginBottom: 12 }}>
              Esses produtos ja passaram da data de validade e nao devem ser comercializados ou utilizados.
            </p>
            {alerts.expired.length === 0 ? (
              <div className="empty-state">Nenhum produto vencido.</div>
            ) : (
              <div className="table-wrap">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Produto</th>
                      <th>SKU</th>
                      <th>Data vencimento</th>
                      <th>Dias vencido</th>
                      <th>Quantidade</th>
                      <th>Valor em perda</th>
                      <th>Status</th>
                      <th>Acoes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {alerts.expired.map((item) => (
                      <tr key={item.product.id}>
                        <td>{item.product.name}</td>
                        <td>{item.product.sku || "-"}</td>
                        <td>{new Date(item.product.expiryDate!).toLocaleDateString("pt-BR")}</td>
                        <td style={{ fontWeight: 700, fontSize: 15, color: "var(--danger, #e53e3e)" }}>
                          {item.daysOverdue}d
                        </td>
                        <td>{item.currentQuantity}</td>
                        <td style={{ color: "var(--danger, #e53e3e)" }}>
                          {item.totalValue !== undefined ? `R$ ${item.totalValue.toFixed(2)}` : "-"}
                        </td>
                        <td>
                          <span className="status-badge">
                            VENCIDO
                          </span>
                        </td>
                        <td>
                          <div style={{ display: "flex", gap: 6 }}>
                            <Link href={`/products/${item.product.id}`} className="link-button">
                              Editar
                            </Link>
                            <Link href={`/exits/new?productId=${item.product.id}`} className="link-button" style={{ color: "var(--danger, #e53e3e)" }}>
                              Descartar
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {/* Tab: Calendario mensal */}
        {activeTab === "calendar" && (
          <>
            <h3 style={{ fontSize: 15, marginBottom: 12 }}>
              Calendario de vencimentos
            </h3>
            {monthlySummary.length === 0 ? (
              <div className="empty-state">Nenhum produto com data de validade cadastrada.</div>
            ) : (
              <div className="dashboard-grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))" }}>
                {monthlySummary.map((month) => {
                  const [year, monthNum] = month.month.split("-");
                  const monthName = new Date(Number(year), Number(monthNum) - 1).toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
                  const isOverdue = month.month < new Date().toISOString().slice(0, 7);
                  const isCurrent = month.month === new Date().toISOString().slice(0, 7);

                  return (
                    <div
                      key={month.month}
                      className="stat-card"
                      style={{
                        padding: "12px 16px",
                        borderLeft: `3px solid ${isOverdue ? "var(--danger, #e53e3e)" : isCurrent ? "var(--warning, #dd6b20)" : "var(--primary)"}`,
                      }}
                    >
                      <p className="muted" style={{ fontSize: 11, textTransform: "capitalize" }}>{monthName}</p>
                      <strong style={{ fontSize: 20 }}>{month.count} produto(s)</strong>
                      <p className="muted" style={{ fontSize: 11 }}>
                        {month.quantity} unidade(s) &middot; R$ {month.totalValue.toFixed(2)}
                      </p>
                      {isOverdue && (
                        <span className="status-badge" style={{ fontSize: 10, marginTop: 4 }}>
                          VENCIDO
                        </span>
                      )}
                      {isCurrent && (
                        <span className="status-badge bg-warning" style={{ fontSize: 10, marginTop: 4 }}>
                          VENCE AGORA
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </section>

      {/* Dica: cadastrar validade */}
      <section className="surface-card section-card" style={{ background: "var(--surface-alt, #f7fafc)" }}>
        <div className="section-header">
          <h3>Como cadastrar validade</h3>
        </div>
        <p className="muted" style={{ fontSize: 13, margin: 0 }}>
          Para que os alertas de validade funcionem, edite o produto e preencha o campo
          {" "}<strong>"Data de validade"</strong>. Produtos sem essa data sao ignorados.
        </p>
      </section>
    </div>
  );
}
