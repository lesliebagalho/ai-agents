import Link from "next/link";
import { canRegisterMovements, requireSessionContext } from "@/lib/auth/auth";
import { listInventoryMovementsByCompany } from "@/lib/store/database";
import ExitsFilter from "./ExitsFilter";

type ExitsPageProps = {
  searchParams?: Promise<{
    error?: string;
    success?: string;
    type?: string;
  }>;
};

const EXIT_TYPES = [
  { value: "SALE", label: "Venda", desc: "Produto vendido ao cliente" },
  { value: "INTERNAL_CONSUMPTION", label: "Consumo interno", desc: "Uso interno pela empresa" },
  { value: "LOSS", label: "Perda", desc: "Produto perdido ou extraviado" },
  { value: "BREAKAGE", label: "Quebra", desc: "Produto danificado/quebrado" },
  { value: "NEGATIVE_ADJUSTMENT", label: "Ajuste negativo", desc: "Ajuste manual para baixo" },
];

const EXIT_TYPE_LABEL: Record<string, string> = {};
for (const t of EXIT_TYPES) {
  EXIT_TYPE_LABEL[t.value] = t.label;
}

export default async function ExitsPage({ searchParams }: ExitsPageProps) {
  const session = await requireSessionContext();
  const params = await searchParams;
  const canEdit = canRegisterMovements(session.activeRole);

  const typeFilter = params?.type ?? "ALL";

  const allMovements = await listInventoryMovementsByCompany(session.activeCompany.id);
  const exitMovements = allMovements.filter((m) => {
    const isExit = ["EXIT", "SALE", "INTERNAL_CONSUMPTION", "LOSS", "BREAKAGE", "NEGATIVE_ADJUSTMENT"].includes(m.type);
    if (typeFilter !== "ALL" && m.type !== typeFilter) return false;
    return isExit;
  });

  return (
    <div className="stack-lg">
      {params?.error ? <div className="message error" style={{ marginBottom: 16 }}>{params.error}</div> : null}
      {params?.success ? <div className="message success" style={{ marginBottom: 16 }}>{params.success}</div> : null}

      <section className="surface-card section-card">
        <div className="section-header">
          <h2>Saidas do estoque</h2>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <span className="muted">{exitMovements.length} registro(s)</span>
            {canEdit ? (
              <Link href="/exits/new" className="button primary" style={{ fontSize: 14 }}>
                + Nova saida
              </Link>
            ) : null}
          </div>
        </div>

        {/* Filtro por tipo */}
        <ExitsFilter currentType={typeFilter} />

        {exitMovements.length === 0 ? (
          <div className="empty-state">Nenhuma saida encontrada com os filtros atuais.</div>
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Tipo</th>
                  <th>Produto</th>
                  <th>Quantidade</th>
                  <th>Responsavel</th>
                  <th>Motivo</th>
                  <th>Referencia</th>
                </tr>
              </thead>
              <tbody>
                {exitMovements.map((movement) => (
                  <tr key={movement.id}>
                    <td>{new Date(movement.createdAt).toLocaleString("pt-BR")}</td>
                    <td>
                      <span className={`status-badge type-${movement.type.toLowerCase()}`}>
                        {EXIT_TYPE_LABEL[movement.type] || movement.type}
                      </span>
                    </td>
                    <td>
                      <Link href={`/products/${movement.product.id}`} className="link-button">
                        {movement.product.name}
                      </Link>
                    </td>
                    <td>{movement.quantity} {movement.product.unit}</td>
                    <td>{movement.user.name}</td>
                    <td>{movement.reason || "-"}</td>
                    <td>{movement.note || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Cards resumo por tipo */}
      <section className="surface-card section-card">
        <div className="section-header">
          <h2>Resumo por tipo</h2>
        </div>
        <div className="dashboard-grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))" }}>
          {EXIT_TYPES.map((t) => {
            const count = exitMovements.filter((m) => m.type === t.value).length;
            return (
              <div key={t.value} className="stat-card" style={{ padding: "12px 16px" }}>
                <strong style={{ fontSize: 13 }}>{t.label}</strong>
                <p style={{ fontSize: 22, fontWeight: 700, margin: "4px 0" }}>{count}</p>
                <p className="muted" style={{ fontSize: 11 }}>{t.desc}</p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
