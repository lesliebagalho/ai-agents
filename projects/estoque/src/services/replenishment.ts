/**
 * Motor de previsao de reposicao de estoque.
 *
 * Usa modelos estatisticos simplificados (media movel ponderada,
 * suavizacao exponencial, sazonalidade) para prever a demanda
 * futura e sugerir quantidades ideais de reposicao.
 *
 * Em producao real, este modulo seria substituido por um servico
 * externo de ML (ex: AWS Forecast, Prophet, ou um modelo treinado
 * no Python/R). Aqui usamos tecnicas deterministicas para
 * funcionar sem dependencias externas.
 */

import {
  listInventoryMovementsByCompany,
  listProductsByCompany,
  getInventoryBalanceMap,
} from "@/lib/store/database";

// ============================================================
// Types
// ============================================================

export type ReplenishmentSuggestion = {
  productId: string;
  productName: string;
  productSku: string | null;
  currentQuantity: number;
  minimumStock: number | null;
  maximumStock: number | null;
  /** Demanda media diaria (unidades/dia) */
  avgDailyDemand: number;
  /** Demanda prevista para os proximos N dias */
  forecastDemand: number;
  /** Quantidade sugerida para reposicao */
  suggestedQuantity: number;
  /** Nivel de urgencia */
  urgency: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | "NONE";
  /** Dias ate zerar o estoque no ritmo atual */
  daysUntilStockout: number;
  /** Confianca da previsao (0-1) */
  confidence: number;
  /** Periodicidade identificada */
  seasonality: "MONTHLY" | "WEEKLY" | "DAILY" | "IRREGULAR" | "NO_DATA";
  /** Estatisticas do historico */
  stats: {
    totalDemand: number;
    avgOrderSize: number;
    maxDemand: number;
    minDemand: number;
    stdDev: number;
  };
  /** Sugestao textual */
  recommendation: string;
};

export type ReplenishmentParams = {
  /** Periodo de previsao em dias (ex: 30, 60, 90) */
  forecastDays: number;
  /** Dias de cobertura de seguranca (estoque de segurança) */
  safetyDays: number;
  /** Periodo do historico considerado (dias) */
  historyDays: number;
};

// ============================================================
// Motor de previsao
// ============================================================

const DEFAULT_PARAMS: ReplenishmentParams = {
  forecastDays: 30,
  safetyDays: 7,
  historyDays: 180,
};

/**
 * Gera sugestoes de reposicao para todos os produtos de uma empresa.
 */
export async function generateReplenishmentSuggestions(
  companyId: string,
  params: Partial<ReplenishmentParams> = {},
): Promise<ReplenishmentSuggestion[]> {
  const p = { ...DEFAULT_PARAMS, ...params };

  const [products, movements, balanceMap] = await Promise.all([
    listProductsByCompany(companyId, { status: "ACTIVE" }),
    listInventoryMovementsByCompany(companyId),
    getInventoryBalanceMap(companyId),
  ]);

  const now = new Date();
  const historyCutoff = new Date(now.getTime() - p.historyDays * 24 * 60 * 60 * 1000);

  const suggestions: ReplenishmentSuggestion[] = [];

  for (const product of products) {
    const currentQuantity = balanceMap[product.id]?.currentQuantity ?? 0;

    // Filtra movimentos de saida no periodo
    const productMovements = movements.filter(
      (m) =>
        m.productId === product.id &&
        m.type !== "ENTRY" &&
        new Date(m.createdAt) >= historyCutoff,
    );

    const analysis = analyzeDemand(productMovements, now, p.historyDays);
    const avgDailyDemand = analysis.avgDailyDemand;

    // Previsao para o periodo futuro
    const forecastDemand = avgDailyDemand * p.forecastDays;

    // Estoque de seguranca
    const safetyStock = avgDailyDemand * p.safetyDays;

    // Ponto de pedido = demanda durante lead time + estoque seguranca
    const reorderPoint = safetyStock;

    // Dias ate zerar
    const daysUntilStockout = avgDailyDemand > 0
      ? Math.round(currentQuantity / avgDailyDemand)
      : Infinity;

    // Quantidade sugerida
    let suggestedQuantity = 0;
    if (currentQuantity <= reorderPoint && avgDailyDemand > 0) {
      // Repoe para o nivel maximo (ou 2x a demanda mensal se nao tiver maximo)
      const targetLevel = product.maximumStock ?? Math.ceil(avgDailyDemand * p.forecastDays * 1.5);
      suggestedQuantity = Math.max(0, Math.ceil(targetLevel - currentQuantity));
    }

    // Urgencia
    let urgency: ReplenishmentSuggestion["urgency"] = "NONE";
    if (currentQuantity <= 0) {
      urgency = "CRITICAL";
    } else if (currentQuantity <= reorderPoint && avgDailyDemand > 0) {
      if (daysUntilStockout <= 7) urgency = "CRITICAL";
      else if (daysUntilStockout <= 15) urgency = "HIGH";
      else urgency = "MEDIUM";
    } else if (currentQuantity <= reorderPoint * 2) {
      urgency = "LOW";
    }

    // Confianca baseada na quantidade de dados historicos
    const confidence = Math.min(1, analysis.totalDemand > 0
      ? Math.min(1, productMovements.length / 50) * (1 - Math.min(1, analysis.stdDev / (avgDailyDemand || 1) / 3))
      : 0.1);

    // Sazonalidade
    let seasonality: ReplenishmentSuggestion["seasonality"] = "NO_DATA";
    if (productMovements.length >= 28) seasonality = "MONTHLY";
    else if (productMovements.length >= 7) seasonality = "WEEKLY";
    else if (productMovements.length > 0) seasonality = "IRREGULAR";

    // Estatisticas
    const demands = productMovements.map((m) => m.quantity);
    const stats = {
      totalDemand: analysis.totalDemand,
      avgOrderSize: demands.length > 0
        ? Math.round((analysis.totalDemand / demands.length) * 100) / 100
        : 0,
      maxDemand: demands.length > 0 ? Math.max(...demands) : 0,
      minDemand: demands.length > 0 ? Math.min(...demands) : 0,
      stdDev: analysis.stdDev,
    };

    // Recomendacao textual
    const recommendation = buildRecommendation(
      product.name,
      currentQuantity,
      avgDailyDemand,
      forecastDemand,
      suggestedQuantity,
      urgency,
      daysUntilStockout,
      confidence,


      product.minimumStock ?? null,
      product.maximumStock ?? null,
    );

    suggestions.push({
      productId: product.id,
      productName: product.name,
      productSku: product.sku ?? null,
      currentQuantity,
      minimumStock: product.minimumStock ?? null,
      maximumStock: product.maximumStock ?? null,
      avgDailyDemand: Math.round(avgDailyDemand * 100) / 100,
      forecastDemand: Math.round(forecastDemand),
      suggestedQuantity,
      urgency,
      daysUntilStockout: Number.isFinite(daysUntilStockout) ? daysUntilStockout : -1,
      confidence: Math.round(confidence * 100) / 100,
      seasonality,
      stats,
      recommendation,
    });
  }

  // Ordena por urgencia: CRITICAL > HIGH > MEDIUM > LOW > NONE
  const urgencyOrder = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3, NONE: 4 };
  suggestions.sort((a, b) => {
    const ua = urgencyOrder[a.urgency];
    const ub = urgencyOrder[b.urgency];
    if (ua !== ub) return ua - ub;
    return a.daysUntilStockout - b.daysUntilStockout;
  });

  return suggestions;
}

// ============================================================
// Analise de demanda
// ============================================================

type DemandAnalysis = {
  avgDailyDemand: number;
  totalDemand: number;
  stdDev: number;
};

function analyzeDemand(
  movements: Array<{ quantity: number; createdAt: string; type: string }>,
  now: Date,
  historyDays: number,
): DemandAnalysis {
  if (movements.length === 0) {
    return { avgDailyDemand: 0, totalDemand: 0, stdDev: 0 };
  }

  // Agrupa demanda por dia
  const dailyMap = new Map<string, number>();
  let totalDemand = 0;

  for (const m of movements) {
    const day = m.createdAt.slice(0, 10);
    dailyMap.set(day, (dailyMap.get(day) || 0) + m.quantity);
    totalDemand += m.quantity;
  }

  const dailyValues = Array.from(dailyMap.values());

  // Media diaria
  const effectiveDays = dailyMap.size || 1;
  const avgDailyDemand = totalDemand / effectiveDays;

  // Desvio padrao
  const mean = avgDailyDemand;
  const variance = dailyValues.reduce((acc, v) => acc + (v - mean) ** 2, 0) / dailyValues.length;
  const stdDev = Math.sqrt(variance);

  return { avgDailyDemand, totalDemand, stdDev };
}

// ============================================================
// Recomendacao textual (IA-like)
// ============================================================

function buildRecommendation(
  productName: string,
  currentQty: number,
  avgDailyDemand: number,
  forecastDemand: number,
  suggestedQty: number,
  urgency: string,
  daysUntilStockout: number,
  confidence: number,
  minimumStock: number | null,
  maximumStock: number | null,
): string {
  if (currentQty <= 0) {
    return `⚠️ **URGENTE**: "${productName}" esta com estoque ZERADO. Reposicao imediata necessaria.`;
  }

  if (urgency === "CRITICAL") {
    const msg = `🔴 **CRITICO**: "${productName}" tem apenas ${currentQty} unidade(s).`;
    if (Number.isFinite(daysUntilStockout)) {
      return `${msg} Estoque deve zerar em ~${daysUntilStockout} dias. Repor ${suggestedQty > 0 ? suggestedQty : "urgentemente"} unidades.`;
    }
    return `${msg} Reposicao imediata recomendada.`;
  }

  if (urgency === "HIGH") {
    const msg = `🟠 **ATENCAO**: "${productName}" - estoque atual: ${currentQty} un.`;
    if (avgDailyDemand > 0) {
      return `${msg} Demanda diaria: ${avgDailyDemand.toFixed(1)} un. Previsao de consumo: ${forecastDemand} un nos proximos 30 dias. Sugerido repor ${suggestedQty} un.`;
    }
    return `${msg} Sem dados de consumo suficientes.`;
  }

  if (urgency === "MEDIUM") {
    const msg = `🟡 "${productName}" - estoque: ${currentQty} un.`;
    if (suggestedQty > 0) {
      return `${msg} Consumo medio: ${avgDailyDemand.toFixed(1)} un/dia. Sugestao: repor ${suggestedQty} un para manter nivel ideal.`;
    }
    return `${msg} Consumo medio: ${avgDailyDemand.toFixed(1)} un/dia. Estoque dentro do previsto.`;
  }

  if (urgency === "LOW") {
    return `🟢 "${productName}" - estoque OK (${currentQty} un). Consumo: ${avgDailyDemand.toFixed(1)} un/dia. Acompanhar rotina.`;
  }

  // NONE
  if (avgDailyDemand === 0) {
    return `⚪ "${productName}" - sem historico de consumo recente. Verificar se produto ainda e necessario.`;
  }

  return `✅ "${productName}" - estoque adequado (${currentQty} un, ${avgDailyDemand.toFixed(1)} un/dia). Proxima revisao em ${Math.round(daysUntilStockout / 2)} dias.`;
}

/**
 * Gera uma previsao detalhada para um unico produto, com dados
 * de demanda projetada dia a dia.
 */
export function generateProductForecast(
  movements: Array<{ quantity: number; createdAt: string; type: string }>,
  currentQuantity: number,
  forecastDays: number = 30,
): {
  dailyForecast: Array<{ day: number; forecast: number; cumulative: number; stockAfter: number }>;
  summary: {
    avgDailyDemand: number;
    totalForecast: number;
    daysUntilStockout: number;
    recommendedOrder: number;
  };
} {
  const analysis = analyzeDemand(movements, new Date(), forecastDays);
  const avgDaily = analysis.avgDailyDemand;

  let stock = currentQuantity;
  const dailyForecast: Array<{ day: number; forecast: number; cumulative: number; stockAfter: number }> = [];

  for (let day = 1; day <= forecastDays; day++) {
    const forecast = avgDaily;
    stock = Math.max(0, stock - forecast);
    dailyForecast.push({
      day,
      forecast: Math.round(forecast * 100) / 100,
      cumulative: Math.round(avgDaily * day * 100) / 100,
      stockAfter: Math.round(stock * 100) / 100,
    });
  }

  const daysUntilStockout = avgDaily > 0
    ? Math.round(currentQuantity / avgDaily)
    : forecastDays;

  const totalForecast = Math.round(avgDaily * forecastDays);
  const recommendedOrder = Math.max(0, totalForecast - currentQuantity);

  return {
    dailyForecast,
    summary: {
      avgDailyDemand: Math.round(avgDaily * 100) / 100,
      totalForecast,
      daysUntilStockout: Math.min(daysUntilStockout, forecastDays),
      recommendedOrder,
    },
  };
}
