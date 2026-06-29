import Link from "next/link";
import { requireSessionContext } from "@/lib/auth/auth";
import {
  getCurrentStockReport,
  getAbcCurve,
  getInventoryTurnover,
  getStagnantProducts,
  getFinancialSummary,
  listInventoryMovementsByCompany,
} from "@/lib/store/database";

type ReportsPageProps = {
  searchParams?: Promise<{
    tab?: string;
  }>;
};

const TABS = [
  { key: "current-stock", label: "Estoque Atual" },
  { key: "abc-curve", label: "Curva ABC" },
  { key: "turnover", label: "Giro de Estoque" },
  { key: "stagnant", label: "Produtos Parados" },
  { key: "movements", label: "Entradas & Saidas" },
  { key: "financial", label: "Valor Financeiro" },
];

export default async function ReportsPage({ searchParams }: ReportsPageProps) {
  const session = await requireSessionContext();
  const params = await searchParams;
  const activeTab = params?.tab || "current-stock";

  return (
    <div className="stack-lg">
      <section className="surface-card section-card">
        <div className="section-header">
          <h2>Relatorios</h2>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 4, marginBottom: 20, flexWrap: "wrap" }}>
          {TABS.map((tab) => (
            <Link
              key={tab.key}
              href={`/reports?tab=${tab.key}`}
              className={`button ${activeTab === tab.key ? "primary" : "secondary"}`}
              style={{ fontSize: 13 }}
            >
              {tab.label}
            </Link>
          ))}
        </div>

        {/* ============== Estoque Atual ============== */}
        {activeTab === "current-stock" && <CurrentStockTab companyId={session.activeCompany.id} />}

        {/* ============== Curva ABC ============== */}
        {activeTab === "abc-curve" && <AbcCurveTab companyId={session.activeCompany.id} />}

        {/* ============== Giro de Estoque ============== */}
        {activeTab === "turnover" && <TurnoverTab companyId={session.activeCompany.id} />}

        {/* ============== Produtos Parados ============== */}
        {activeTab === "stagnant" && <StagnantTab companyId={session.activeCompany.id} />}

        {/* ============== Entradas & Saidas ============== */}
        {activeTab === "movements" && <MovementsTab companyId={session.activeCompany.id} />}

        {/* ============== Valor Financeiro ============== */}
        {activeTab === "financial" && <FinancialTab companyId={session.activeCompany.id} />}
      </section>
    </div>
  );
}

// ============================================================
// TAB: Estoque Atual
// ============================================================
async function CurrentStockTab({ companyId }: { companyId: string }) {
  const stock = await getCurrentStockReport(companyId);
  const totalValue = stock.reduce((acc, i) => acc + i.totalValue, 0);
  const totalQty = stock.reduce((acc, i) => acc + i.currentQuantity, 0);

  return (
    <>
      <div className="dashboard-grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", marginBottom: 20 }}>
        <div className="stat-card" style={{ padding: "12px 16px" }}>
          <p className="muted" style={{ fontSize: 11 }}>Produtos ativos</p>
          <strong style={{ fontSize: 22 }}>{stock.length}</strong>
        </div>
        <div className="stat-card" style={{ padding: "12px 16px" }}>
          <p className="muted" style={{ fontSize: 11 }}>Total unidades</p>
          <strong style={{ fontSize: 22 }}>{totalQty}</strong>
        </div>
        <div className="stat-card" style={{ padding: "12px 16px" }}>
          <p className="muted" style={{ fontSize: 11 }}>Valor total em estoque</p>
          <strong style={{ fontSize: 22 }}>R$ {totalValue.toFixed(2)}</strong>
        </div>
      </div>

      <div className="table-wrap">
        <table className="data-table" style={{ fontSize: 13 }}>
          <thead>
            <tr>
              <th>Produto</th>
              <th>SKU</th>
              <th>Categoria</th>
              <th>Marca</th>
              <th>Qtd</th>
              <th>Preco custo</th>
              <th>Valor total</th>
            </tr>
          </thead>
          <tbody>
            {stock.map((item) => (
              <tr key={item.product.id}>
                <td>
                  <Link href={`/products/${item.product.id}`} className="link-button" style={{ fontSize: 13 }}>
                    {item.product.name}
                  </Link>
                </td>
                <td>{item.product.sku || "-"}</td>
                <td>{item.categoryName}</td>
                <td>{item.brandName}</td>
                <td style={{ fontWeight: 600 }}>{item.currentQuantity}</td>
                <td>{item.costPrice ? `R$ ${item.costPrice.toFixed(2)}` : "-"}</td>
                <td style={{ fontWeight: 600 }}>R$ {item.totalValue.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

// ============================================================
// TAB: Curva ABC
// ============================================================
async function AbcCurveTab({ companyId }: { companyId: string }) {
  const abc = await getAbcCurve(companyId);
  const totalValue = abc.reduce((acc, i) => acc + i.totalValue, 0);

  const summary = { A: 0, B: 0, C: 0 };
  const valueSummary = { A: 0, B: 0, C: 0 };
  for (const item of abc) {
    summary[item.classification]++;
    valueSummary[item.classification] += item.totalValue;
  }

  return (
    <>
      <h3 style={{ fontSize: 15, marginBottom: 12 }}>Classificacao ABC do estoque</h3>
      <p className="muted" style={{ fontSize: 13, marginBottom: 16 }}>
        Classe A: 80% do valor | Classe B: 15% | Classe C: 5%
      </p>

      <div className="dashboard-grid" style={{ gridTemplateColumns: "repeat(3, 1fr)", marginBottom: 20 }}>
        {(["A", "B", "C"] as const).map((cls) => (
          <div
            key={cls}
            className="stat-card"
            style={{
              padding: "12px 16px",
              borderLeft: `3px solid ${
                cls === "A" ? "var(--danger, #e53e3e)" : cls === "B" ? "var(--warning, #dd6b20)" : "var(--primary)"
              }`,
            }}
          >
            <p className="muted" style={{ fontSize: 11 }}>Classe {cls}</p>
            <strong style={{ fontSize: 22 }}>{summary[cls]} produtos</strong>
            <p className="muted" style={{ fontSize: 11 }}>
              R$ {valueSummary[cls].toFixed(2)} ({totalValue > 0 ? ((valueSummary[cls] / totalValue) * 100).toFixed(1) : 0}%)
            </p>
          </div>
        ))}
      </div>

      <div className="table-wrap">
        <table className="data-table" style={{ fontSize: 13 }}>
          <thead>
            <tr>
              <th>Class.</th>
              <th>Produto</th>
              <th>Qtd</th>
              <th>Valor total</th>
              <th>% Individual</th>
              <th>% Acumulada</th>
            </tr>
          </thead>
          <tbody>
            {abc.map((item, idx) => (
              <tr key={item.product.id}>
                <td>
                  <span
                    style={{
                      display: "inline-block",
                      padding: "2px 8px",
                      borderRadius: 4,
                      fontWeight: 700,
                      fontSize: 12,
                      background:
                        item.classification === "A"
                          ? "#fed7d7"
                          : item.classification === "B"
                            ? "#feebc8"
                            : "#bee3f8",
                      color:
                        item.classification === "A"
                          ? "#c53030"
                          : item.classification === "B"
                            ? "#c05621"
                            : "#2b6cb0",
                    }}
                  >
                    {item.classification}
                  </span>
                </td>
                <td>
                  <Link href={`/products/${item.product.id}`} className="link-button" style={{ fontSize: 13 }}>
                    {item.product.name}
                  </Link>
                </td>
                <td>{item.currentQuantity}</td>
                <td style={{ fontWeight: 600 }}>R$ {item.totalValue.toFixed(2)}</td>
                <td>{item.pct.toFixed(1)}%</td>
                <td>{item.cumulativePct.toFixed(1)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

// ============================================================
// TAB: Giro de Estoque
// ============================================================
async function TurnoverTab({ companyId }: { companyId: string }) {
  const turnover = await getInventoryTurnover(companyId);

  const withMovement = turnover.filter((t) => t.totalExits > 0);
  const avgTurnover =
    withMovement.length > 0
      ? withMovement.reduce((acc, t) => acc + t.turnover, 0) / withMovement.length
      : 0;

  return (
    <>
      <h3 style={{ fontSize: 15, marginBottom: 12 }}>Giro de estoque (ultimos 6 meses)</h3>
      <div className="dashboard-grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", marginBottom: 20 }}>
        <div className="stat-card" style={{ padding: "12px 16px" }}>
          <p className="muted" style={{ fontSize: 11 }}>Media de giro</p>
          <strong style={{ fontSize: 22 }}>{avgTurnover.toFixed(2)}x</strong>
        </div>
        <div className="stat-card" style={{ padding: "12px 16px" }}>
          <p className="muted" style={{ fontSize: 11 }}>Produtos c/ saida</p>
          <strong style={{ fontSize: 22 }}>{withMovement.length}/{turnover.length}</strong>
        </div>
      </div>

      <div className="table-wrap">
        <table className="data-table" style={{ fontSize: 13 }}>
          <thead>
            <tr>
              <th>Produto</th>
              <th>Saldo</th>
              <th>Saidas (6m)</th>
              <th>Giro</th>
              <th>Dias p/ zerar</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {turnover.map((item) => (
              <tr key={item.product.id}>
                <td>
                  <Link href={`/products/${item.product.id}`} className="link-button" style={{ fontSize: 13 }}>
                    {item.product.name}
                  </Link>
                </td>
                <td>{item.currentQuantity}</td>
                <td>{item.totalExits}</td>
                <td style={{ fontWeight: 600 }}>{item.turnover.toFixed(2)}x</td>
                <td>{Number.isFinite(item.daysToZero) ? `${Math.round(item.daysToZero)} dias` : "-"}</td>
                <td>
                  {item.turnover === 0 ? (
                    <span className="status-badge">PARADO</span>
                  ) : item.turnover < 1 ? (
                    <span className="status-badge bg-warning">BAIXO</span>
                  ) : (
                    <span className="status-badge entry">NORMAL</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

// ============================================================
// TAB: Produtos Parados
// ============================================================
async function StagnantTab({ companyId }: { companyId: string }) {
  const stagnant = await getStagnantProducts(companyId, 60);
  const totalValue = stagnant.reduce((acc, item) => acc + (item.product.costPrice ?? 0) * item.currentQuantity, 0);

  return (
    <>
      <h3 style={{ fontSize: 15, marginBottom: 12 }}>
        Produtos sem movimentacao ha 60+ dias <span className="muted">({stagnant.length})</span>
      </h3>
      <div className="dashboard-grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", marginBottom: 20 }}>
        <div className="stat-card" style={{ padding: "12px 16px" }}>
          <p className="muted" style={{ fontSize: 11 }}>Produtos parados</p>
          <strong style={{ fontSize: 22 }}>{stagnant.length}</strong>
        </div>
        <div className="stat-card" style={{ padding: "12px 16px" }}>
          <p className="muted" style={{ fontSize: 11 }}>Valor empatado</p>
          <strong style={{ fontSize: 22 }}>R$ {totalValue.toFixed(2)}</strong>
        </div>
      </div>

      {stagnant.length === 0 ? (
        <div className="empty-state">Nenhum produto parado nos ultimos 60 dias.</div>
      ) : (
        <div className="table-wrap">
          <table className="data-table" style={{ fontSize: 13 }}>
            <thead>
              <tr>
                <th>Produto</th>
                <th>SKU</th>
                <th>Saldo</th>
                <th>Ultima mov.</th>
                <th>Dias parado</th>
                <th>Valor empatado</th>
              </tr>
            </thead>
            <tbody>
              {stagnant.map((item) => (
                <tr key={item.product.id}>
                  <td>
                    <Link href={`/products/${item.product.id}`} className="link-button" style={{ fontSize: 13 }}>
                      {item.product.name}
                    </Link>
                  </td>
                  <td>{item.product.sku || "-"}</td>
                  <td>{item.currentQuantity}</td>
                  <td>{item.lastMovementAt ? new Date(item.lastMovementAt).toLocaleDateString("pt-BR") : "Nunca"}</td>
                  <td style={{ fontWeight: 600, color: item.daysSinceLastMove > 180 ? "var(--danger, #e53e3e)" : "inherit" }}>
                    {item.daysSinceLastMove}d
                  </td>
                  <td>R$ {((item.product.costPrice ?? 0) * item.currentQuantity).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

// ============================================================
// TAB: Entradas & Saidas
// ============================================================
async function MovementsTab({ companyId }: { companyId: string }) {
  const movements = await listInventoryMovementsByCompany(companyId);
  const last30Days = movements.filter((m) => {
    const d = new Date(m.createdAt);
    const threshold = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    return d >= threshold;
  });

  const entries = last30Days.filter((m) => m.type === "ENTRY");
  const exits = last30Days.filter((m) => ["EXIT", "SALE", "INTERNAL_CONSUMPTION", "LOSS", "BREAKAGE", "NEGATIVE_ADJUSTMENT"].includes(m.type));
  const totalEntries = entries.reduce((acc, m) => acc + m.quantity, 0);
  const totalExits = exits.reduce((acc, m) => acc + m.quantity, 0);

  return (
    <>
      <h3 style={{ fontSize: 15, marginBottom: 12 }}>Entradas e saidas (ultimos 30 dias)</h3>
      <div className="dashboard-grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", marginBottom: 20 }}>
        <div className="stat-card" style={{ padding: "12px 16px", borderLeft: "3px solid var(--success, #38a169)" }}>
          <p className="muted" style={{ fontSize: 11 }}>Entradas</p>
          <strong style={{ fontSize: 22, color: "var(--success, #38a169)" }}>{entries.length}</strong>
          <p className="muted" style={{ fontSize: 11 }}>{totalEntries} unidades</p>
        </div>
        <div className="stat-card" style={{ padding: "12px 16px", borderLeft: "3px solid var(--danger, #e53e3e)" }}>
          <p className="muted" style={{ fontSize: 11 }}>Saidas</p>
          <strong style={{ fontSize: 22, color: "var(--danger, #e53e3e)" }}>{exits.length}</strong>
          <p className="muted" style={{ fontSize: 11 }}>{totalExits} unidades</p>
        </div>
        <div className="stat-card" style={{ padding: "12px 16px" }}>
          <p className="muted" style={{ fontSize: 11 }}>Saldo liquido (30d)</p>
          <strong style={{ fontSize: 22 }}>{totalEntries - totalExits}</strong>
        </div>
        <div className="stat-card" style={{ padding: "12px 16px" }}>
          <p className="muted" style={{ fontSize: 11 }}>Total mov. (30d)</p>
          <strong style={{ fontSize: 22 }}>{last30Days.length}</strong>
        </div>
      </div>

      <div className="table-wrap">
        <table className="data-table" style={{ fontSize: 13 }}>
          <thead>
            <tr>
              <th>Data</th>
              <th>Tipo</th>
              <th>Produto</th>
              <th>Qtd</th>
              <th>Responsavel</th>
            </tr>
          </thead>
          <tbody>
            {last30Days.slice(0, 50).map((m) => (
              <tr key={m.id}>
                <td>{new Date(m.createdAt).toLocaleDateString("pt-BR")}</td>
                <td>
                  <span className={`status-badge ${m.type === "ENTRY" ? "entry" : "exit"}`}>{m.type}</span>
                </td>
                <td>{m.product.name}</td>
                <td>{m.quantity}</td>
                <td>{m.user.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

// ============================================================
// TAB: Valor Financeiro
// ============================================================
async function FinancialTab({ companyId }: { companyId: string }) {
  const financial = await getFinancialSummary(companyId);

  return (
    <>
      <h3 style={{ fontSize: 15, marginBottom: 12 }}>Resumo financeiro do estoque</h3>
      <div className="dashboard-grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", marginBottom: 20 }}>
        <div className="stat-card" style={{ padding: "16px 20px", borderLeft: "3px solid var(--primary)" }}>
          <p className="muted" style={{ fontSize: 11 }}>Valor total em estoque</p>
          <strong style={{ fontSize: 26 }}>R$ {financial.totalStockValue.toFixed(2)}</strong>
        </div>
        <div className="stat-card" style={{ padding: "16px 20px" }}>
          <p className="muted" style={{ fontSize: 11 }}>Produtos com custo</p>
          <strong style={{ fontSize: 26 }}>{financial.productsWithCost}</strong>
          <p className="muted" style={{ fontSize: 11 }}>de {financial.totalProducts} ativos</p>
        </div>
        <div className="stat-card" style={{ padding: "16px 20px" }}>
          <p className="muted" style={{ fontSize: 11 }}>Preco medio de custo</p>
          <strong style={{ fontSize: 26 }}>R$ {financial.avgCostPrice.toFixed(2)}</strong>
        </div>
      </div>

      <div className="surface-card" style={{ padding: 16, background: "var(--surface-alt, #f7fafc)", borderRadius: 8 }}>
        <p className="muted" style={{ fontSize: 13, margin: 0 }}>
          <strong>Nota:</strong> O valor total e calculado com base no preco de custo multiplicado pela quantidade atual em estoque.
          Produtos sem preco de custo cadastrado sao contabilizados como R$ 0,00.
          Cadastre o preco de custo nos produtos para um relatorio financeiro mais preciso.
        </p>
      </div>
    </>
  );
}
