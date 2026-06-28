import { canRegisterMovements, requireSessionContext } from "@/lib/auth/auth";
import Link from "next/link";
import { listInventoryMovementsByCompany, listProductsWithBalance } from "@/lib/store/database";

type InventoryPageProps = {
  searchParams?: Promise<{
    error?: string;
    success?: string;
    productId?: string;
    type?: string;
  }>;
};

function getMovementBadgeClass(type: string) {
  if (type === "ENTRY") return "status-badge entry";
  if (type === "EXIT") return "status-badge exit";
  return "status-badge adjustment";
}

export default async function InventoryPage({ searchParams }: InventoryPageProps) {
  const session = await requireSessionContext();
  const params = await searchParams;
  const filters = {
    productId: params?.productId,
    type: params?.type,
  };

  const [products, movements] = await Promise.all([
    listProductsWithBalance(session.activeCompany.id),
    listInventoryMovementsByCompany(session.activeCompany.id, filters),
  ]);
  const canWrite = canRegisterMovements(session.activeRole);

  return (
    <div className="stack-lg">
      {params?.error ? <div className="message error" style={{ marginBottom: 16 }}>{params.error}</div> : null}
      {params?.success ? <div className="message success" style={{ marginBottom: 16 }}>{params.success}</div> : null}

      <section className="surface-card section-card">
        <div className="section-header">
          <h2>Historico de movimentacoes</h2>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <span className="muted">{movements.length} registro(s)</span>
            {canWrite ? (
              <Link href="/inventory/new" className="button primary" style={{ fontSize: 14 }}>
                + Nova movimentacao
              </Link>
            ) : null}
          </div>
        </div>

        <form action="/inventory" className="field-row three" style={{ marginBottom: 16 }}>
          <div className="field">
            <label htmlFor="productIdFilter">Produto</label>
            <select id="productIdFilter" name="productId" defaultValue={params?.productId ?? ""}>
              <option value="">Todos</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label htmlFor="typeFilter">Tipo</label>
            <select id="typeFilter" name="type" defaultValue={params?.type ?? "ALL"}>
              <option value="ALL">Todos</option>
              <option value="ENTRY">Entradas</option>
              <option value="EXIT">Saidas</option>
              <option value="ADJUSTMENT">Ajustes</option>
            </select>
          </div>

          <div style={{ display: "flex", alignItems: "end", gap: 12 }}>
            <button type="submit" className="button secondary">
              Filtrar
            </button>
            <a href="/inventory" className="link-button">
              Limpar
            </a>
          </div>
        </form>

        {movements.length === 0 ? (
          <div className="empty-state">Nenhuma movimentacao encontrada para os filtros atuais.</div>
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Tipo</th>
                  <th>Produto</th>
                  <th>Quantidade</th>
                  <th>Saldo anterior</th>
                  <th>Saldo resultante</th>
                  <th>Usuario</th>
                  <th>Motivo / Observacao</th>
                </tr>
              </thead>
              <tbody>
                {movements.map((movement) => (
                  <tr key={movement.id}>
                    <td>{new Date(movement.createdAt).toLocaleString("pt-BR")}</td>
                    <td>
                      <span className={getMovementBadgeClass(movement.type)}>{movement.type}</span>
                    </td>
                    <td>{movement.product.name}</td>
                    <td>{movement.quantity}</td>
                    <td>{movement.previousQuantity}</td>
                    <td>{movement.resultingQuantity}</td>
                    <td>{movement.user.name}</td>
                    <td>
                      <div>{movement.reason || "-"}</div>
                      {movement.note ? <div className="muted">{movement.note}</div> : null}
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
