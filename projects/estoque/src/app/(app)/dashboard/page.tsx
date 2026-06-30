import Link from "next/link";
import { requireSessionContext } from "@/lib/auth/auth";
import {
  getInventorySummary,
  getCurrentStockReport,
  getStagnantProducts,
  listCategoriesByCompany,
  listInventoryMovementsByCompany,
  listProductsWithBalance,
} from "@/lib/store/database";
import MovementChartWithSelector from "./_components/MovementChartWithSelector";
import ProductThumb from "@/components/ProductThumb";

function formatBRL(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

type DashboardPageProps = {
  searchParams?: Promise<{
    error?: string;
  }>;
};

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const session = await requireSessionContext();
  const params = await searchParams;
  const [categories, products, movements, summary] = await Promise.all([
    listCategoriesByCompany(session.activeCompany.id),
    listProductsWithBalance(session.activeCompany.id),
    listInventoryMovementsByCompany(session.activeCompany.id),
    getInventorySummary(session.activeCompany.id),
  ]);

  const [stockReport, stagnantProducts] = await Promise.all([
    getCurrentStockReport(session.activeCompany.id),
    getStagnantProducts(session.activeCompany.id, 60),
  ]);

  const activeProducts = products.filter((product) => product.status === "ACTIVE");
  const lowStockProducts = products.filter(
    (product) => typeof product.minimumStock === "number" && product.currentQuantity <= product.minimumStock,
  );

  // Produtos sem movimentacao nos ultimos 30 dias
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const productsWithMovement = new Set(movements.map((m) => m.productId));
  const productsWithoutMovement = products.filter(
    (product) => !productsWithMovement.has(product.id) || true,
  );

  // Agrupar movimentos por produto para verificar data
  const lastMovementByProduct = new Map<string, string>();
  for (const movement of movements) {
    const existing = lastMovementByProduct.get(movement.productId);
    if (!existing || movement.createdAt > existing) {
      lastMovementByProduct.set(movement.productId, movement.createdAt);
    }
  }

  const staleProducts = products.filter((product) => {
    const lastDate = lastMovementByProduct.get(product.id);
    if (!lastDate) return true;
    return new Date(lastDate) < thirtyDaysAgo;
  });

  // Produtos zerados
  const zeroStockProducts = products.filter((p) => p.currentQuantity === 0);

  // Media de valor em especie (R$) por produto
  const totalStockValue = products.reduce((acc, p) => {
    const price = p.costPrice ?? 0;
    return acc + price * p.currentQuantity;
  }, 0);
  const avgStockValue = activeProducts.length > 0
    ? formatBRL(totalStockValue / activeProducts.length)
    : formatBRL(0);

  // SLA: % de produtos com estoque adequado (dentro do min-max)
  const productsWithMinMax = activeProducts.filter(
    (p) => typeof p.minimumStock === "number" && typeof p.maximumStock === "number",
  );
  const productsWithinSla = productsWithMinMax.filter(
    (p) => p.currentQuantity >= (p.minimumStock ?? 0) && p.currentQuantity <= (p.maximumStock ?? Infinity),
  );
  const slaPct = productsWithMinMax.length > 0
    ? Math.round((productsWithinSla.length / productsWithMinMax.length) * 100)
    : 0;

  // Dados para o grafico (ultimos 7 dias) - convertidos para o formato do seletor
  const chartData7d: { label: string; entradas: number; saidas: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().slice(0, 10);
    const label = d.toLocaleString("pt-BR", { weekday: "short", day: "2-digit" });

    const dayMovements = movements.filter((m) => m.createdAt.slice(0, 10) === dateStr);
    chartData7d.push({
      label,
      entradas: dayMovements.filter((m) => m.type === "ENTRY").reduce((a, m) => a + m.quantity, 0),
      saidas: dayMovements.filter((m) => m.type === "EXIT").reduce((a, m) => a + m.quantity, 0),
    });
  }

  const hasChartData = chartData7d.some((d) => d.entradas > 0 || d.saidas > 0);

  // Dados para 28 dias
  const last28Days: { label: string; entradas: number; saidas: number }[] = [];
  for (let i = 27; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().slice(0, 10);
    const label = d.toLocaleString("pt-BR", { weekday: "short", day: "2-digit" });

    const dayMovements = movements.filter((m) => m.createdAt.slice(0, 10) === dateStr);
    last28Days.push({
      label,
      entradas: dayMovements.filter((m) => m.type === "ENTRY").reduce((a, m) => a + m.quantity, 0),
      saidas: dayMovements.filter((m) => m.type === "EXIT").reduce((a, m) => a + m.quantity, 0),
    });
  }

  // Dados por mes (ultimos 12 meses)
  const monthsData: { label: string; entradas: number; saidas: number }[] = [];
  for (let i = 11; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const yearMonth = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const label = d.toLocaleString("pt-BR", { month: "short", year: "numeric" });

    const monthMovements = movements.filter((m) => m.createdAt.slice(0, 7) === yearMonth);
    monthsData.push({
      label,
      entradas: monthMovements.filter((m) => m.type === "ENTRY").reduce((a, m) => a + m.quantity, 0),
      saidas: monthMovements.filter((m) => m.type === "EXIT").reduce((a, m) => a + m.quantity, 0),
    });
  }

  // Dados para 6 meses
  const chartData6m = monthsData.slice(-6);

  // Ultimas entradas e saidas
  const lastEntries = movements.filter((m) => m.type === "ENTRY").slice(0, 5);
  const lastExits = movements.filter((m) => m.type === "EXIT").slice(0, 5);

  return (
    <div className="dashboard">
      {params?.error ? <div className="message error">{params.error}</div> : null}

      {/* KPIS */}
      <div className="kpis">
        <div className="kpi-card">
          <div className="kpi-icon kpi-icon--total">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 002 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
              <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
              <line x1="12" y1="22.08" x2="12" y2="12" />
            </svg>
          </div>
          <div className="kpi-body">
            <span className="kpi-label">Valor total em estoque</span>
            <strong className="kpi-value">{formatBRL(totalStockValue)}</strong>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon kpi-icon--products">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2" />
              <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
            </svg>
          </div>
          <div className="kpi-body">
            <span className="kpi-label">Produtos ativos</span>
            <strong className="kpi-value">{activeProducts.length}</strong>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon kpi-icon--low">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </div>
          <div className="kpi-body">
            <span className="kpi-label">Estoque baixo</span>
            <strong className="kpi-value">{lowStockProducts.length}</strong>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon kpi-icon--movements">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
          </div>
          <div className="kpi-body">
            <span className="kpi-label">Movimentacoes hoje</span>
            <strong className="kpi-value">{summary.movementsToday}</strong>
          </div>
        </div>

        {/* Entradas hoje */}
        <div className="kpi-card">
          <div className="kpi-icon" style={{ background: "#ecfdf5", color: "#047857" }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
              <line x1="12" y1="2" x2="12" y2="22" />
            </svg>
          </div>
          <div className="kpi-body">
            <span className="kpi-label">Entradas hoje</span>
            <strong className="kpi-value" style={{ color: "#047857" }}>
              {movements.filter((m) => m.createdAt.slice(0, 10) === new Date().toISOString().slice(0, 10) && m.type === "ENTRY").length}
            </strong>
          </div>
        </div>

        {/* Saidas hoje */}
        <div className="kpi-card">
          <div className="kpi-icon" style={{ background: "#fef2f2", color: "#b91c1c" }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
              <line x1="2" y1="2" x2="22" y2="22" />
            </svg>
          </div>
          <div className="kpi-body">
            <span className="kpi-label">Saidas hoje</span>
            <strong className="kpi-value" style={{ color: "#b91c1c" }}>
              {movements.filter((m) => m.createdAt.slice(0, 10) === new Date().toISOString().slice(0, 10) && ["EXIT", "SALE", "LOSS", "BREAKAGE", "INTERNAL_CONSUMPTION", "NEGATIVE_ADJUSTMENT"].includes(m.type)).length}
            </strong>
          </div>
        </div>

        {/* Produtos zerados */}
        <div className="kpi-card">
          <div className="kpi-icon" style={{ background: "#fef3c7", color: "#92400e" }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
          </div>
          <div className="kpi-body">
            <span className="kpi-label">Produtos zerados</span>
            <strong className="kpi-value" style={{ color: "#92400e" }}>
              {zeroStockProducts.length}
            </strong>
          </div>
        </div>

        {/* Media de valor em especie */}
        <div className="kpi-card">
          <div className="kpi-icon" style={{ background: "#eef2ff", color: "#4338ca" }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="1" x2="12" y2="23" />
              <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
            </svg>
          </div>
          <div className="kpi-body">
            <span className="kpi-label">Valor medio por produto</span>
            <strong className="kpi-value" style={{ color: "#4338ca", fontSize: 22 }}>
              {avgStockValue}
            </strong>
          </div>
        </div>

        {/* SLA - nivel de servico */}
        <div className="kpi-card">
          <div className="kpi-icon" style={{ background: slaPct >= 80 ? "#ecfdf5" : slaPct >= 50 ? "#fef3c7" : "#fef2f2", color: slaPct >= 80 ? "#047857" : slaPct >= 50 ? "#92400e" : "#b91c1c" }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </div>
          <div className="kpi-body">
            <span className="kpi-label">SLA Estoque</span>
            <strong className="kpi-value" style={{ color: slaPct >= 80 ? "#047857" : slaPct >= 50 ? "#92400e" : "#b91c1c" }}>
              {slaPct}%
            </strong>
            <span className="muted" style={{ fontSize: 11 }}>
              {productsWithinSla.length}/{productsWithMinMax.length} produtos
            </span>
          </div>
        </div>
      </div>

      {/* GRAFICO MOVIMENTACAO */}
      <section className="surface-card dashboard-section">
        <div className="section-header">
          <h3>Movimentacao</h3>
        </div>
        <MovementChartWithSelector
          data7d={chartData7d}
          data28d={last28Days}
          data6m={chartData6m}
          monthsData={monthsData}
        />
      </section>

      {/* ESTOQUE BAIXO + SEM MOVIMENTACAO */}
      <div className="dashboard-grid two">
        <section className="surface-card dashboard-section">
          <div className="section-header">
            <h3>Estoque baixo</h3>
            <span className="muted">{lowStockProducts.length} produto(s)</span>
          </div>
          {lowStockProducts.length === 0 ? (
            <div className="empty-state">Nenhum produto abaixo do minimo.</div>
          ) : (
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th></th>
                    <th>Produto</th>
                    <th>Saldo</th>
                    <th>Minimo</th>
                  </tr>
                </thead>
                <tbody>
                  {lowStockProducts.slice(0, 6).map((product) => (
                    <tr key={product.id}>
                      <td>
                        <ProductThumb url={product.imageUrl} alt={product.name} />
                      </td>
                      <td>
                        <Link href={`/products/${product.id}`} className="table-link">
                          {product.name}
                        </Link>
                      </td>
                      <td className="text-danger">{product.currentQuantity}</td>
                      <td>{product.minimumStock}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="surface-card dashboard-section">
          <div className="section-header">
            <h3>Sem movimentacao (30 dias)</h3>
            <span className="muted">{staleProducts.length} produto(s)</span>
          </div>
          {staleProducts.length === 0 ? (
            <div className="empty-state">Todos os produtos tiveram movimentacao recente.</div>
          ) : (
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Produto</th>
                    <th>Saldo</th>
                    <th>Ultima mov.</th>
                  </tr>
                </thead>
                <tbody>
                  {staleProducts.slice(0, 6).map((product) => {
                    const lastDate = lastMovementByProduct.get(product.id);
                    return (
                      <tr key={product.id}>
                        <td>
                          <Link href={`/products/${product.id}`} className="table-link">
                            {product.name}
                          </Link>
                        </td>
                        <td>{product.currentQuantity}</td>
                        <td className="muted">
                          {lastDate
                            ? new Date(lastDate).toLocaleString("pt-BR")
                            : "Nunca"}
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

      {/* ULTIMAS ENTRADAS E SAIDAS */}
      <div className="dashboard-grid two">
        <section className="surface-card dashboard-section">
          <div className="section-header">
            <h3>Ultimas entradas</h3>
            <Link href="/inventory?type=ENTRY" className="link-button" style={{ fontSize: 13 }}>
              Ver todas
            </Link>
          </div>
          {lastEntries.length === 0 ? (
            <div className="empty-state">Nenhuma entrada registrada.</div>
          ) : (
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Produto</th>
                    <th>Qtd</th>
                    <th>Data</th>
                  </tr>
                </thead>
                <tbody>
                  {lastEntries.map((movement) => (
                    <tr key={movement.id}>
                      <td>{movement.product.name}</td>
                      <td className="text-success">+{movement.quantity}</td>
                      <td className="muted">{new Date(movement.createdAt).toLocaleString("pt-BR")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="surface-card dashboard-section">
          <div className="section-header">
            <h3>Ultimas saidas</h3>
            <Link href="/inventory?type=EXIT" className="link-button" style={{ fontSize: 13 }}>
              Ver todas
            </Link>
          </div>
          {lastExits.length === 0 ? (
            <div className="empty-state">Nenhuma saida registrada.</div>
          ) : (
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Produto</th>
                    <th>Qtd</th>
                    <th>Data</th>
                  </tr>
                </thead>
                <tbody>
                  {lastExits.map((movement) => (
                    <tr key={movement.id}>
                      <td>{movement.product.name}</td>
                      <td className="text-danger">-{movement.quantity}</td>
                      <td className="muted">{new Date(movement.createdAt).toLocaleString("pt-BR")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>

      {/* TOP PRODUTOS + PRODUTOS SEM GIRO */}
      <div className="dashboard-grid two">
        <section className="surface-card dashboard-section">
          <div className="section-header">
            <h3>Top produtos (maior valor em estoque)</h3>
            <Link href="/reports?tab=current-stock" className="link-button" style={{ fontSize: 13 }}>
              Ver relatorio
            </Link>
          </div>
          {stockReport.length === 0 ? (
            <div className="empty-state">Nenhum produto em estoque.</div>
          ) : (
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Produto</th>
                    <th>Qtd</th>
                    <th>Valor total</th>
                  </tr>
                </thead>
                <tbody>
                  {stockReport.slice(0, 6).map((item) => (
                    <tr key={item.product.id}>
                      <td>
                        <Link href={`/products/${item.product.id}`} className="table-link">
                          {item.product.name}
                        </Link>
                      </td>
                      <td>{item.currentQuantity}</td>
                      <td style={{ fontWeight: 700 }}>{formatBRL(item.totalValue)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="surface-card dashboard-section">
          <div className="section-header">
            <h3>Produtos sem giro (60+ dias)</h3>
            <Link href="/reports?tab=stagnant" className="link-button" style={{ fontSize: 13 }}>
              Ver relatorio
            </Link>
          </div>
          {stagnantProducts.length === 0 ? (
            <div className="empty-state">Nenhum produto parado.</div>
          ) : (
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Produto</th>
                    <th>Saldo</th>
                    <th>Dias parado</th>
                    <th>Valor</th>
                  </tr>
                </thead>
                <tbody>
                  {stagnantProducts.slice(0, 6).map((item) => (
                    <tr key={item.product.id}>
                      <td>
                        <Link href={`/products/${item.product.id}`} className="table-link">
                          {item.product.name}
                        </Link>
                      </td>
                      <td>{item.currentQuantity}</td>
                      <td style={{ color: item.daysSinceLastMove > 180 ? "var(--danger, #e53e3e)" : "inherit", fontWeight: 600 }}>
                        {item.daysSinceLastMove}d
                      </td>
                      <td>{formatBRL((item.product.costPrice ?? 0) * item.currentQuantity)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>

      {/* ULTIMAS MOVIMENTACOES (geral) */}
      <section className="surface-card dashboard-section">
        <div className="section-header">
          <h3>Ultimas movimentacoes</h3>
          <Link href="/inventory" className="link-button" style={{ fontSize: 13 }}>
            Ver todas
          </Link>
        </div>
        {movements.length === 0 ? (
          <div className="empty-state">Nenhuma movimentacao registrada.</div>
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Tipo</th>
                  <th>Produto</th>
                  <th>Qtd</th>
                  <th>Usuario</th>
                </tr>
              </thead>
              <tbody>
                {movements.slice(0, 8).map((m) => (
                  <tr key={m.id}>
                    <td className="muted">{new Date(m.createdAt).toLocaleString("pt-BR")}</td>
                    <td>
                      <span className={`status-badge ${m.type === "ENTRY" ? "entry" : "exit"}`}>
                        {m.type}
                      </span>
                    </td>
                    <td>
                      <Link href={`/products/${m.productId}`} className="table-link">
                        {m.product.name}
                      </Link>
                    </td>
                    <td style={{ fontWeight: 600 }}>{m.quantity}</td>
                    <td className="muted">{m.user.name}</td>
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
