import { canRegisterMovements, requireSessionContext } from "@/lib/auth/auth";
import Link from "next/link";
import { listInventoryMovementsByCompany, listProductsWithBalance } from "@/lib/store/database";
import MovementsFilter from "./MovementsFilter";

type InventoryPageProps = {
  searchParams?: Promise<{
    error?: string;
    success?: string;
    productId?: string;
    type?: string;
  }>;
};

const MOVEMENT_TYPE_LABELS: Record<string, string> = {
  ENTRY: "Entrada",
  EXIT: "Saida",
  ADJUSTMENT: "Ajuste",
  SALE: "Venda",
  INTERNAL_CONSUMPTION: "Consumo interno",
  LOSS: "Perda",
  BREAKAGE: "Quebra",
  NEGATIVE_ADJUSTMENT: "Ajuste negativo",
};

function getMovementBadgeClass(type: string) {
  const entryTypes = ["ENTRY"];
  const exitTypes = ["EXIT", "SALE", "INTERNAL_CONSUMPTION", "LOSS", "BREAKAGE", "NEGATIVE_ADJUSTMENT"];
  if (entryTypes.includes(type)) return "status-badge entry";
  if (exitTypes.includes(type)) return "status-badge exit";
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
          <h2>Historico geral de movimentacoes</h2>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <span className="muted">{movements.length} registro(s)</span>
            {canWrite ? (
              <Link href="/inventory/new" className="button primary" style={{ fontSize: 14 }}>
                + Nova movimentacao
              </Link>
            ) : null}
          </div>
        </div>

        {/* Filtros avancados */}
        <MovementsFilter
          products={products}
          currentProductId={params?.productId ?? ""}
          currentType={params?.type ?? "ALL"}
        />

        {movements.length === 0 ? (
          <div className="empty-state">Nenhuma movimentacao encontrada para os filtros atuais.</div>
        ) : (
          <div className="table-wrap">
            <table className="data-table" style={{ fontSize: 13 }}>
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Tipo</th>
                  <th>Produto</th>
                  <th>Quantidade</th>
                  <th>Saldo anterior</th>
                  <th>Saldo resultante</th>
                  <th>Responsavel</th>
                  <th>Referencia</th>
                  <th>Auditoria</th>
                </tr>
              </thead>
              <tbody>
                {movements.map((movement) => (
                  <tr key={movement.id}>
                    <td style={{ whiteSpace: "nowrap" }}>
                      {new Date(movement.createdAt).toLocaleDateString("pt-BR")}
                      <br />
                      <span className="muted" style={{ fontSize: 11 }}>
                        {new Date(movement.createdAt).toLocaleTimeString("pt-BR")}
                      </span>
                    </td>
                    <td>
                      <span className={getMovementBadgeClass(movement.type)}>
                        {MOVEMENT_TYPE_LABELS[movement.type] || movement.type}
                      </span>
                    </td>
                    <td>
                      <Link href={`/products/${movement.product.id}`} className="link-button" style={{ fontSize: 13 }}>
                        {movement.product.name}
                      </Link>
                    </td>
                    <td style={{ fontWeight: 600 }}>{movement.quantity}</td>
                    <td style={{ textAlign: "center" }}>{movement.previousQuantity}</td>
                    <td style={{ textAlign: "center" }}>{movement.resultingQuantity}</td>
                    <td>{movement.user.name}</td>
                    <td>
                      <div>{movement.referenceCode || "-"}</div>
                      {movement.note ? <div className="muted" style={{ fontSize: 11 }}>{movement.note}</div> : null}
                    </td>
                    <td>
                      <details style={{ fontSize: 12 }}>
                        <summary style={{ cursor: "pointer", color: "var(--primary)" }}>Detalhes</summary>
                        <div style={{ marginTop: 6, padding: 8, background: "var(--surface-alt, #f7fafc)", borderRadius: 6 }}>
                          <div><strong>ID:</strong> {movement.id.slice(0, 8)}...</div>
                          <div><strong>Tipo:</strong> {movement.type}</div>
                          <div><strong>Motivo:</strong> {movement.reason || "-"}</div>
                          <div><strong>Obs:</strong> {movement.note || "-"}</div>
                          <div><strong>Ref:</strong> {movement.referenceCode || "-"}</div>
                          <div><strong>Usuario:</strong> {movement.user.email}</div>
                        </div>
                      </details>
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

