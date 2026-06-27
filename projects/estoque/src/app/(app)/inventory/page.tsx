import { saveInventoryMovementAction } from "@/features/products/actions";
import { canRegisterMovements, requireSessionContext } from "@/lib/auth/auth";
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
      <section className="surface-card section-card">
        <div className="section-header">
          <h2>Nova movimentacao</h2>
          <span className="muted">{session.activeCompany.name}</span>
        </div>

        {params?.error ? <div className="message error" style={{ marginBottom: 16 }}>{params.error}</div> : null}
        {params?.success ? <div className="message success" style={{ marginBottom: 16 }}>{params.success}</div> : null}

        {!canWrite ? (
          <div className="message error">Seu perfil nao pode registrar movimentacoes nesta empresa.</div>
        ) : (
        <form action={saveInventoryMovementAction} className="field-grid">
          <div className="field-row three">
            <div className="field">
              <label htmlFor="type">Tipo</label>
              <select id="type" name="type" defaultValue="ENTRY">
                <option value="ENTRY">Entrada</option>
                <option value="EXIT">Saida</option>
                <option value="ADJUSTMENT">Ajuste</option>
              </select>
            </div>

            <div className="field">
              <label htmlFor="productId">Produto</label>
              <select id="productId" name="productId" required defaultValue="">
                <option value="" disabled>
                  Selecione
                </option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name} | saldo atual: {product.currentQuantity}
                  </option>
                ))}
              </select>
            </div>

            <div className="field">
              <label htmlFor="quantity">Quantidade</label>
              <input id="quantity" name="quantity" type="number" min="0" step="0.01" required />
            </div>
          </div>

          <div className="field-row two">
            <div className="field">
              <label htmlFor="reason">Motivo</label>
              <input id="reason" name="reason" placeholder="Obrigatorio para ajuste" />
            </div>

            <div className="field">
              <label htmlFor="referenceCode">Referencia</label>
              <input id="referenceCode" name="referenceCode" placeholder="NF, pedido ou codigo interno" />
            </div>
          </div>

          <div className="field">
            <label htmlFor="note">Observacao</label>
            <textarea id="note" name="note" placeholder="Detalhes da movimentacao" />
          </div>

          <button type="submit" className="button primary">
            Registrar movimentacao
          </button>
        </form>
        )}
      </section>

      <section className="surface-card section-card">
        <div className="section-header">
          <h2>Historico de movimentacoes</h2>
          <span className="muted">{movements.length} registro(s)</span>
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
