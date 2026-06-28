import Link from "next/link";
import { canManageCatalog, canManageUsers, canRegisterMovements, requireSessionContext } from "@/lib/auth/auth";
import {
  getInventorySummary,
  listCategoriesByCompany,
  listInventoryMovementsByCompany,
  listProductsWithBalance,
} from "@/lib/store/database";
import MovementChart from "./_components/MovementChart";
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

  const activeProducts = products.filter((product) => product.status === "ACTIVE");
  const lowStockProducts = products.filter(
    (product) => typeof product.minimumStock === "number" && product.currentQuantity <= product.minimumStock,
  );

  // Valor total do estoque
  const totalStockValue = products.reduce((acc, product) => {
    const price = product.costPrice ?? 0;
    return acc + price * product.currentQuantity;
  }, 0);

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

  // Dados para o grafico (ultimos 7 dias)
  const last7Days: { date: string; entradas: number; saidas: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().slice(0, 10);
    const dayLabel = d.toLocaleString("pt-BR", { weekday: "short", day: "2-digit" });

    const dayMovements = movements.filter((m) => m.createdAt.slice(0, 10) === dateStr);
    last7Days.push({
      date: dayLabel,
      entradas: dayMovements.filter((m) => m.type === "ENTRY").reduce((a, m) => a + m.quantity, 0),
      saidas: dayMovements.filter((m) => m.type === "EXIT").reduce((a, m) => a + m.quantity, 0),
    });
  }

  const hasChartData = last7Days.some((d) => d.entradas > 0 || d.saidas > 0);

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
      </div>

      {/* GRAFICO + ACOES RAPIDAS */}
      <div className="dashboard-grid two">
        <section className="surface-card dashboard-section">
          <div className="section-header">
            <h3>Movimentacao (7 dias)</h3>
            {!hasChartData && <span className="muted">Sem dados recentes</span>}
          </div>
          {hasChartData ? (
            <MovementChart data={last7Days} />
          ) : (
            <div className="empty-state" style={{ minHeight: 160, display: "grid", placeItems: "center" }}>
              Nenhuma movimentacao nos ultimos 7 dias.
            </div>
          )}
        </section>

        <section className="surface-card dashboard-section">
          <div className="section-header">
            <h3>Acoes rapidas</h3>
          </div>
          <div className="quick-actions-grid">
            {canManageCatalog(session.activeRole) ? (
              <>
                <Link href="/products/new" className="quick-action">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  Novo produto
                </Link>
                <Link href="/categories/new" className="quick-action">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  Nova categoria
                </Link>
              </>
            ) : null}
            {canRegisterMovements(session.activeRole) ? (
              <Link href="/inventory/new" className="quick-action">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                </svg>
                Nova movimentacao
              </Link>
            ) : null}
            {canManageUsers(session.activeRole) ? (
              <Link href="/users/new" className="quick-action">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" />
                </svg>
                Novo usuario
              </Link>
            ) : null}
          </div>
        </section>
      </div>

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
    </div>
  );
}
