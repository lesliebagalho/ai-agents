import Link from "next/link";
import { requireSessionContext } from "@/lib/auth/auth";
import { getAuditSummary, listAuditLogs } from "@/lib/store/database";

type AuditPageProps = {
  searchParams?: Promise<{
    entity?: string;
    action?: string;
    userId?: string;
    days?: string;
  }>;
};

const ENTITY_LABELS: Record<string, string> = {
  PRODUCT: "Produto",
  CATEGORY: "Categoria",
  BRAND: "Marca",
  LOCATION: "Localizacao",
  SUPPLIER: "Fornecedor",
  USER: "Usuario",
  MOVEMENT: "Movimentacao",
  INVENTORY: "Inventario",
  EXIT: "Saida",
  COMPANY: "Empresa",
};

const ACTION_LABELS: Record<string, string> = {
  CREATE: "Criacao",
  UPDATE: "Edicao",
  DELETE: "Exclusao",
  MOVEMENT: "Mov. Estoque",
  LOGIN: "Login",
  EXPORT: "Exportacao",
  IMPORT: "Importacao",
  INVENTORY_START: "Init. Inventario",
  INVENTORY_CLOSE: "Fechar Inventario",
  INVENTORY_COUNT: "Contagem",
};

const ACTION_COLORS: Record<string, string> = {
  CREATE: "#276749",
  UPDATE: "#c05621",
  DELETE: "#c53030",
  MOVEMENT: "#2b6cb0",
  LOGIN: "#6b46c1",
  EXPORT: "#045f5e",
  IMPORT: "#045f5e",
  INVENTORY_START: "#276749",
  INVENTORY_CLOSE: "#c05621",
  INVENTORY_COUNT: "#2b6cb0",
};

const ACTION_BG: Record<string, string> = {
  CREATE: "#c6f6d5",
  UPDATE: "#feebc8",
  DELETE: "#fed7d7",
  MOVEMENT: "#bee3f8",
  LOGIN: "#e9d8fd",
  EXPORT: "#b2f5ea",
  IMPORT: "#b2f5ea",
  INVENTORY_START: "#c6f6d5",
  INVENTORY_CLOSE: "#feebc8",
  INVENTORY_COUNT: "#bee3f8",
};

export default async function AuditPage({ searchParams }: AuditPageProps) {
  const session = await requireSessionContext();
  const params = await searchParams;

  const filters = {
    entity: params?.entity,
    action: params?.action,
    userId: params?.userId,
    days: params?.days ? Number(params.days) : 30,
    limit: 200,
  };

  const [logs, summary] = await Promise.all([
    listAuditLogs(session.activeCompany.id, filters),
    getAuditSummary(session.activeCompany.id),
  ]);

  return (
    <div className="stack-lg">
      <section className="surface-card section-card">
        <div className="section-header">
          <h2>Auditoria</h2>
          <span className="muted">{summary.total} registro(s)</span>
        </div>

        {/* Cards de resumo */}
        <div className="dashboard-grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", marginBottom: 20 }}>
          <div className="stat-card" style={{ padding: "12px 16px" }}>
            <p className="muted" style={{ fontSize: 11 }}>Total de registros</p>
            <strong style={{ fontSize: 22 }}>{summary.total}</strong>
          </div>
          {Object.entries(summary.byUser).slice(0, 4).map(([userId, data]) => (
            <div key={userId} className="stat-card" style={{ padding: "12px 16px" }}>
              <p className="muted" style={{ fontSize: 11 }}>{data.name}</p>
              <strong style={{ fontSize: 22 }}>{data.count}</strong>
              <p className="muted" style={{ fontSize: 11 }}>acoes</p>
            </div>
          ))}
        </div>

        {/* Filtros */}
        <div className="filters-actions" style={{ marginBottom: 16, flexWrap: "wrap" }}>
          <Link
            href="/audit"
            className={`button ${!params?.entity && !params?.action && !params?.userId ? "primary" : "secondary"}`}
            style={{ fontSize: 12 }}
          >
            Todos
          </Link>
          <Link
            href="/audit?days=7"
            className={`button ${params?.days === "7" ? "primary" : "secondary"}`}
            style={{ fontSize: 12 }}
          >
            7 dias
          </Link>
          <Link
            href="/audit?days=30"
            className={`button ${!params?.days || params?.days === "30" ? "primary" : "secondary"}`}
            style={{ fontSize: 12 }}
          >
            30 dias
          </Link>
          <Link
            href="/audit?days=90"
            className={`button ${params?.days === "90" ? "primary" : "secondary"}`}
            style={{ fontSize: 12 }}
          >
            90 dias
          </Link>
          <span style={{ color: "var(--border)", margin: "0 4px" }}>|</span>
          {(["CREATE", "UPDATE", "DELETE", "MOVEMENT"] as const).map((action) => (
            <Link
              key={action}
              href={`/audit?action=${action}${params?.days ? `&days=${params.days}` : ""}`}
              className={`button ${params?.action === action ? "primary" : "secondary"}`}
              style={{ fontSize: 12 }}
            >
              {ACTION_LABELS[action]}
            </Link>
          ))}
          <span style={{ color: "var(--border)", margin: "0 4px" }}>|</span>
          {(["PRODUCT", "MOVEMENT", "USER", "SUPPLIER"] as const).map((entity) => (
            <Link
              key={entity}
              href={`/audit?entity=${entity}${params?.days ? `&days=${params.days}` : ""}`}
              className={`button ${params?.entity === entity ? "primary" : "secondary"}`}
              style={{ fontSize: 12 }}
            >
              {ENTITY_LABELS[entity]}
            </Link>
          ))}
        </div>

        {/* Tabela de logs */}
        {logs.length === 0 ? (
          <div className="empty-state">
            Nenhum registro de auditoria encontrado para os filtros selecionados.
          </div>
        ) : (
          <div className="table-wrap">
            <table className="data-table" style={{ fontSize: 13 }}>
              <thead>
                <tr>
                  <th style={{ width: 140 }}>Data / Hora</th>
                  <th>Usuario</th>
                  <th>Acao</th>
                  <th>Entidade</th>
                  <th>Descricao</th>
                  <th>Detalhes</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id}>
                    <td style={{ whiteSpace: "nowrap", fontSize: 12 }}>
                      {new Date(log.createdAt).toLocaleDateString("pt-BR")}
                      <br />
                      <span className="muted" style={{ fontSize: 11 }}>
                        {new Date(log.createdAt).toLocaleTimeString("pt-BR")}
                      </span>
                    </td>
                    <td>
                      <strong>{log.userName}</strong>
                      <br />
                      <span className="muted" style={{ fontSize: 11 }}>
                        {log.userEmail} &middot; {log.userRole}
                      </span>
                    </td>
                    <td>
                      <span
                        style={{
                          display: "inline-block",
                          padding: "2px 8px",
                          borderRadius: 4,
                          fontWeight: 700,
                          fontSize: 11,
                          background: ACTION_BG[log.action] || "#e2e8f0",
                          color: ACTION_COLORS[log.action] || "#475569",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {ACTION_LABELS[log.action] || log.action}
                      </span>
                    </td>
                    <td>
                      <span className="muted" style={{ fontSize: 12 }}>
                        {ENTITY_LABELS[log.entity] || log.entity}
                      </span>
                      <br />
                      <span style={{ fontSize: 12 }}>{log.entityName}</span>
                    </td>
                    <td style={{ fontSize: 12 }}>{log.description}</td>
                    <td style={{ fontSize: 11, color: "var(--text-muted)", maxWidth: 200 }}>
                      {log.details || "-"}
                      {log.ipAddress && (
                        <div style={{ fontSize: 10, marginTop: 2 }}>IP: {log.ipAddress}</div>
                      )}
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
