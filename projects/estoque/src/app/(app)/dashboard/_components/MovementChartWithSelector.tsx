"use client";

import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

type MovementDataPoint = {
  label: string;
  entradas: number;
  saidas: number;
};

type MovementChartWithSelectorProps = {
  data7d: MovementDataPoint[];
  data28d: MovementDataPoint[];
  data6m: { label: string; entradas: number; saidas: number }[];
  monthsData: { label: string; entradas: number; saidas: number }[];
};

type ViewMode = "7d" | "28d" | "6m" | "months";

export default function MovementChartWithSelector({
  data7d,
  data28d,
  data6m,
  monthsData,
}: MovementChartWithSelectorProps) {
  const [view, setView] = useState<ViewMode>("7d");

  const currentData = view === "7d" ? data7d : view === "28d" ? data28d : view === "6m" ? data6m : monthsData;

  const tabs: { key: ViewMode; label: string }[] = [
    { key: "7d", label: "7 dias" },
    { key: "28d", label: "28 dias" },
    { key: "6m", label: "6 meses" },
    { key: "months", label: "12 meses" },
  ];

  return (
    <div>
      <div style={{ display: "flex", gap: 4, marginBottom: 12 }}>
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setView(tab.key)}
            className={`button ${view === tab.key ? "primary" : "secondary"}`}
            style={{ fontSize: 12, minHeight: 30, padding: "0 10px" }}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {currentData.length === 0 ? (
        <div className="empty-state" style={{ minHeight: 200, display: "grid", placeItems: "center" }}>
          Nenhum dado para o periodo selecionado.
        </div>
      ) : (
        <div style={{ width: "100%", height: 260 }}>
          <ResponsiveContainer>
            <BarChart data={currentData} barCategoryGap="20%">
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 12, fill: "#64748b" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 12, fill: "#64748b" }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: 8,
                  border: "1px solid #e2e8f0",
                  fontSize: 13,
                }}
              />
              <Bar dataKey="entradas" name="Entradas" fill="#0f766e" radius={[4, 4, 0, 0]} />
              <Bar dataKey="saidas" name="Saidas" fill="#f97316" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
