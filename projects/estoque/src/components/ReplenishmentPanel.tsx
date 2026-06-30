"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import type { ReplenishmentSuggestion } from "@/services/replenishment";
import { useExport } from "@/hooks/useExport";

type Props = {
  initialSuggestions: ReplenishmentSuggestion[];
  companyId: string;
  forecastDays?: number;
  safetyDays?: number;
};

export default function ReplenishmentPanel({
  initialSuggestions,
  forecastDays: defaultForecastDays = 30,
  safetyDays: defaultSafetyDays = 7,
}: Props) {
  const [suggestions] = useState(initialSuggestions);
  const [forecastDays] = useState(defaultForecastDays);
  const [safetyDays] = useState(defaultSafetyDays);
  const [filterUrgency, setFilterUrgency] = useState<string>("ALL");
  const { exportXlsx, exportCsv } = useExport();

  const filtered = filterUrgency === "ALL"
    ? suggestions
    : suggestions.filter((s) => s.urgency === filterUrgency);

  const urgentCount = suggestions.filter(
    (s) => s.urgency === "CRITICAL" || s.urgency === "HIGH",
  ).length;

  const totalRepositionValue = suggestions
    .filter((s) => s.urgency !== "NONE")
    .reduce((acc, s) => {
      // Estima valor baseado em preco medio (R$ 10 - placeholder)
      return acc + s.suggestedQuantity * 10;
    }, 0);

  const handleExportXlsx = useCallback(() => {
    const data = suggestions.map((s) => ({
      Produto: s.productName,
      SKU: s.productSku ?? "",
      "Estoque Atual": s.currentQuantity,
      "Estoque Minimo": s.minimumStock ?? 0,
      "Demanda Diaria": s.avgDailyDemand,
      "Previsao (30d)": s.forecastDemand,
      "Sugestao de Reposicao": s.suggestedQuantity,
      "Dias ate zerar": s.daysUntilStockout > 0 ? s.daysUntilStockout : "N/A",
      Urgencia: s.urgency,
      Confianca: `${(s.confidence * 100).toFixed(0)}%`,
      Sazonalidade: s.seasonality,
      Recomendacao: s.recommendation,
    }));

    exportXlsx({
      data,
      filename: `reposicao-${new Date().toISOString().slice(0, 10)}`,
      columns: {
        Produto: "Produto",
        SKU: "SKU",
        "Estoque Atual": "Estoque Atual",
        "Estoque Minimo": "Estoque Minimo",
        "Demanda Diaria": "Demanda Diaria",
        "Previsao (30d)": "Previsao (30d)",
        "Sugestao de Reposicao": "Sugestao de Reposicao",
        "Dias ate zerar": "Dias ate zerar",
        Urgencia: "Urgencia",
        Confianca: "Confianca",
        Sazonalidade: "Sazonalidade",
        Recomendacao: "Recomendacao",
      },
      title: "Relatorio de Reposicao de Estoque",
    });
  }, [suggestions, exportXlsx]);

  const handleExportCsv = useCallback(() => {
    const data = suggestions.map((s) => ({
      Produto: s.productName,
      SKU: s.productSku ?? "",
      "Estoque Atual": s.currentQuantity,
      "Estoque Minimo": s.minimumStock ?? 0,
      "Demanda Diaria": s.avgDailyDemand,
      "Previsao (30d)": s.forecastDemand,
      "Sugestao de Reposicao": s.suggestedQuantity,
      "Dias ate zerar": s.daysUntilStockout > 0 ? s.daysUntilStockout : "N/A",
      Urgencia: s.urgency,
      Confianca: `${(s.confidence * 100).toFixed(0)}%`,
      Sazonalidade: s.seasonality,
      Recomendacao: s.recommendation,
    }));

    exportCsv({
      data,
      filename: `reposicao-${new Date().toISOString().slice(0, 10)}`,
      columns: {
        Produto: "Produto",
        SKU: "SKU",
        "Estoque Atual": "Estoque Atual",
        "Estoque Minimo": "Estoque Minimo",
        "Demanda Diaria": "Demanda Diaria",
        "Previsao (30d)": "Previsao (30d)",
        "Sugestao de Reposicao": "Sugestao de Reposicao",
        "Dias ate zerar": "Dias ate zerar",
        Urgencia: "Urgencia",
        Confianca: "Confianca",
      },
    });
  }, [suggestions, exportCsv]);

  const urgencyColor = (u: string) => {
    switch (u) {
      case "CRITICAL": return { bg: "#fef2f2", color: "#b91c1c" };
      case "HIGH": return { bg: "#fff7ed", color: "#c2410c" };
      case "MEDIUM": return { bg: "#fef3c7", color: "#92400e" };
      case "LOW": return { bg: "#f0fdf4", color: "#166534" };
      default: return { bg: "#f8fafc", color: "#475569" };
    }
  };

  return (
    <div>
      {/* Resumo */}
      <div className="dashboard-grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", marginBottom: 20 }}>
        <div className="stat-card" style={{ padding: "12px 16px", borderLeft: "3px solid #b91c1c" }}>
          <p className="muted" style={{ fontSize: 11 }}>Produtos criticos/altos</p>
          <strong style={{ fontSize: 22, color: "#b91c1c" }}>{urgentCount}</strong>
        </div>
        <div className="stat-card" style={{ padding: "12px 16px" }}>
          <p className="muted" style={{ fontSize: 11 }}>Total analisado</p>
          <strong style={{ fontSize: 22 }}>{suggestions.length}</strong>
        </div>
        <div className="stat-card" style={{ padding: "12px 16px" }}>
          <p className="muted" style={{ fontSize: 11 }}>Valor estimado reposicao</p>
          <strong style={{ fontSize: 22 }}>R$ {totalRepositionValue.toFixed(2)}</strong>
        </div>
        <div className="stat-card" style={{ padding: "12px 16px" }}>
          <p className="muted" style={{ fontSize: 11 }}>Parametros</p>
          <strong style={{ fontSize: 16, color: "var(--text-muted)" }}>
            {forecastDays}d previsao | {safetyDays}d seguranca
          </strong>
        </div>
      </div>

      {/* Filtros */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap", alignItems: "center" }}>
        <span className="muted" style={{ fontSize: 13, fontWeight: 700 }}>Filtrar:</span>
        {["ALL", "CRITICAL", "HIGH", "MEDIUM", "LOW", "NONE"].map((u) => {
          const label = u === "ALL" ? "Todos" : u === "CRITICAL" ? "Criticos" : u === "HIGH" ? "Altos" : u === "MEDIUM" ? "Medios" : u === "LOW" ? "Baixos" : "OK";
          const count = u === "ALL" ? suggestions.length : suggestions.filter((s) => s.urgency === u).length;
          return (
            <button
              key={u}
              onClick={() => setFilterUrgency(u)}
              className={`button ${filterUrgency === u ? "primary" : "secondary"}`}
              style={{ fontSize: 12, minHeight: 30, padding: "0 10px" }}
            >
              {label} ({count})
            </button>
          );
        })}
        <div style={{ flex: 1 }} />
        <button onClick={handleExportXlsx} className="button secondary" style={{ fontSize: 12, minHeight: 30, padding: "0 10px" }}>
          XLSX
        </button>
        <button onClick={handleExportCsv} className="button secondary" style={{ fontSize: 12, minHeight: 30, padding: "0 10px" }}>
          CSV
        </button>
      </div>

      {/* Tabela */}
      <div className="table-wrap">
        <table className="data-table" style={{ fontSize: 13 }}>
          <thead>
            <tr>
              <th>Produto</th>
              <th>Estoque</th>
              <th>Min</th>
              <th>Demanda/dia</th>
              <th>Previsao ({forecastDays}d)</th>
              <th>Sugestao reposicao</th>
              <th>Dias ate zerar</th>
              <th>Confianca</th>
              <th>Urgencia</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={9} style={{ textAlign: "center", padding: 20, color: "var(--text-muted)" }}>
                  Nenhum produto encontrado com este filtro.
                </td>
              </tr>
            ) : (
              filtered.map((s) => {
                const uc = urgencyColor(s.urgency);
                return (
                  <tr key={s.productId}>
                    <td>
                      <Link href={`/products/${s.productId}`} className="table-link">
                        {s.productName}
                      </Link>
                      {s.productSku && <span className="muted" style={{ fontSize: 11, display: "block" }}>{s.productSku}</span>}
                    </td>
                    <td style={{ fontWeight: 600 }}>{s.currentQuantity}</td>
                    <td>{s.minimumStock ?? "-"}</td>
                    <td>{s.avgDailyDemand.toFixed(1)}</td>
                    <td style={{ fontWeight: 600 }}>{s.forecastDemand}</td>
                    <td>
                      {s.suggestedQuantity > 0 ? (
                        <strong style={{ color: "var(--primary)" }}>{s.suggestedQuantity} un</strong>
                      ) : (
                        <span className="muted">-</span>
                      )}
                    </td>
                    <td>
                      {s.daysUntilStockout > 0 ? (
                        <span style={{
                          fontWeight: 600,
                          color: s.daysUntilStockout <= 7 ? "#b91c1c" : s.daysUntilStockout <= 15 ? "#c2410c" : "#166534",
                        }}>
                          {s.daysUntilStockout}d
                        </span>
                      ) : (
                        <span className="muted">N/A</span>
                      )}
                    </td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <div style={{
                          width: 40,
                          height: 6,
                          borderRadius: 3,
                          background: "#e2e8f0",
                          overflow: "hidden",
                        }}>
                          <div style={{
                            width: `${s.confidence * 100}%`,
                            height: "100%",
                            borderRadius: 3,
                            background: s.confidence >= 0.7 ? "#047857" : s.confidence >= 0.4 ? "#d97706" : "#b91c1c",
                          }} />
                        </div>
                        <span className="muted" style={{ fontSize: 11 }}>
                          {(s.confidence * 100).toFixed(0)}%
                        </span>
                      </div>
                    </td>
                    <td>
                      <span style={{
                        display: "inline-block",
                        padding: "2px 8px",
                        borderRadius: 4,
                        fontWeight: 700,
                        fontSize: 11,
                        background: uc.bg,
                        color: uc.color,
                      }}>
                        {s.urgency === "CRITICAL" ? "CRITICO" : s.urgency === "HIGH" ? "ALTO" : s.urgency === "MEDIUM" ? "MEDIO" : s.urgency === "LOW" ? "BAIXO" : "OK"}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Recomendacoes detalhadas */}
      {filtered.filter((s) => s.urgency !== "NONE").length > 0 && (
        <section style={{ marginTop: 24 }}>
          <h3 style={{ fontSize: 15, marginBottom: 12 }}>Recomendacoes detalhadas da IA</h3>
          <div className="stack-md">
            {filtered
              .filter((s) => s.urgency !== "NONE")
              .slice(0, 10)
              .map((s) => (
                <div
                  key={s.productId}
                  style={{
                    padding: "12px 16px",
                    border: `1px solid var(--border)`,
                    borderLeft: `3px solid ${urgencyColor(s.urgency).color}`,
                    borderRadius: 8,
                    background: "#fff",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: 12 }}>
                    <div>
                      <strong>
                        <Link href={`/products/${s.productId}`} style={{ color: "inherit" }}>
                          {s.productName}
                        </Link>
                      </strong>
                      {s.productSku && <span className="muted" style={{ fontSize: 12, marginLeft: 8 }}>SKU: {s.productSku}</span>}
                    </div>
                    <span style={{
                      padding: "2px 8px",
                      borderRadius: 4,
                      fontWeight: 700,
                      fontSize: 11,
                      background: urgencyColor(s.urgency).bg,
                      color: urgencyColor(s.urgency).color,
                      whiteSpace: "nowrap",
                    }}>
                      {s.urgency === "CRITICAL" ? "CRITICO" : s.urgency === "HIGH" ? "ALTO" : s.urgency === "MEDIUM" ? "MEDIO" : "BAIXO"}
                    </span>
                  </div>
                  <p style={{ margin: "8px 0 0", fontSize: 13, lineHeight: 1.5, color: "var(--text)" }}>
                    {s.recommendation}
                  </p>
                  <div style={{ display: "flex", gap: 16, marginTop: 8, fontSize: 12, color: "var(--text-muted)" }}>
                    <span>Consumo: <strong>{s.avgDailyDemand.toFixed(1)} un/dia</strong></span>
                    <span>Previsao: <strong>{s.forecastDemand} un</strong></span>
                    <span>Sugestao: <strong style={{ color: "var(--primary)" }}>{s.suggestedQuantity} un</strong></span>
                    <span>Confianca: <strong>{(s.confidence * 100).toFixed(0)}%</strong></span>
                  </div>
                </div>
              ))}
          </div>
        </section>
      )}

      {/* Nota */}
      <div className="surface-card" style={{ padding: 16, marginTop: 20, background: "var(--surface-muted)", borderRadius: 8 }}>
        <p className="muted" style={{ fontSize: 12, margin: 0 }}>
          <strong>Como o algoritmo funciona:</strong> O motor de previsao analisa o historico de saidas dos ultimos {forecastDays * 2} dias,
          calcula a demanda media diaria, projeta o consumo futuro e sugere quantidades de reposicao com base no estoque atual,
          ponto de pedido e estoque de seguranca ({safetyDays} dias). A confianca da previsao e maior quanto mais dados historicos
          estiverem disponiveis. Produtos sem saidas registradas aparecem como "sem dados".
        </p>
      </div>
    </div>
  );
}
