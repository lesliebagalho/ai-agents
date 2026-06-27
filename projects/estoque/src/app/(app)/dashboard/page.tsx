import Link from "next/link";
import { canManageCatalog, canManageUsers, canRegisterMovements, requireSessionContext } from "@/lib/auth/auth";
import { getInventorySummary, listCategoriesByCompany, listInventoryMovementsByCompany, listProductsWithBalance } from "@/lib/store/database";

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

  return (
    <div className="stack-lg">
      {params?.error ? <div className="message error">{params.error}</div> : null}

      <section className="stats-grid">
        <article className="surface-card stat-card">
          <p className="stat-label">Quantidade total em estoque</p>
          <p className="stat-value">{summary.totalQuantity}</p>
        </article>
        <article className="surface-card stat-card">
          <p className="stat-label">Produtos ativos</p>
          <p className="stat-value">{activeProducts.length}</p>
        </article>
        <article className="surface-card stat-card">
          <p className="stat-label">Categorias</p>
          <p className="stat-value">{categories.length}</p>
        </article>
        <article className="surface-card stat-card">
          <p className="stat-label">Movimentacoes hoje</p>
          <p className="stat-value">{summary.movementsToday}</p>
        </article>
      </section>

      <section className="content-grid two">
        <article className="surface-card section-card">
          <div className="section-header">
            <h2>Alertas e acoes</h2>
            <span className="muted">{summary.lowStockCount} alerta(s) de estoque baixo</span>
          </div>
          <div className="stack-md">
            <div className="quick-actions">
              {canManageCatalog(session.activeRole) ? (
                <>
                  <Link href="/products" className="link-button">
                    Novo produto
                  </Link>
                  <Link href="/categories" className="link-button">
                    Nova categoria
                  </Link>
                </>
              ) : null}
              {canRegisterMovements(session.activeRole) ? (
                <Link href="/inventory" className="link-button">
                  Nova movimentacao
                </Link>
              ) : null}
              {canManageUsers(session.activeRole) ? (
                <Link href="/users" className="link-button">
                  Gerenciar usuarios
                </Link>
              ) : null}
            </div>

            {lowStockProducts.length === 0 ? (
              <div className="empty-state">Nenhum produto abaixo do estoque minimo na empresa ativa.</div>
            ) : (
              <div className="table-wrap">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Produto</th>
                      <th>Saldo</th>
                      <th>Minimo</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lowStockProducts.slice(0, 6).map((product) => (
                      <tr key={product.id}>
                        <td>{product.name}</td>
                        <td>{product.currentQuantity}</td>
                        <td>{product.minimumStock}</td>
                        <td>
                          <span className="status-badge low">Baixo</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </article>

        <article className="surface-card section-card">
          <div className="section-header">
            <h2>Movimentacoes recentes</h2>
            <Link href="/inventory" className="link-button">
              Abrir movimentacoes
            </Link>
          </div>
          {movements.length === 0 ? (
            <div className="empty-state">Nenhuma movimentacao registrada na empresa ativa.</div>
          ) : (
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Tipo</th>
                    <th>Produto</th>
                    <th>Quantidade</th>
                    <th>Saldo</th>
                    <th>Usuario</th>
                  </tr>
                </thead>
                <tbody>
                  {movements.slice(0, 6).map((movement) => (
                    <tr key={movement.id}>
                      <td>{movement.type}</td>
                      <td>{movement.product.name}</td>
                      <td>{movement.quantity}</td>
                      <td>{movement.resultingQuantity}</td>
                      <td>{movement.user.name}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </article>
      </section>
    </div>
  );
}
