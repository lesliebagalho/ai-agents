"use client";

import { useCallback } from "react";
import * as XLSX from "xlsx";

type AnyRecord = Record<string, string | number | boolean | null | undefined>;

type ExportOptions = {
  /** Dados a exportar */
  data: AnyRecord[];
  /** Nome do arquivo (sem extensao) */
  filename: string;
  /** Mapeamento de colunas: { chaveNoDado: "Nome da Coluna" } */
  columns: Record<string, string>;
  /** Titulo opcional do relatorio */
  title?: string;
};

/**
 * Hook que retorna funcoes para exportar dados em XLSX e PDF.
 *
 * Uso:
 *   const { exportXlsx, exportPdf } = useExport();
 *   exportXlsx({ data: produtos, filename: "relatorio", columns: { name: "Nome", price: "Preco" } });
 */
export function useExport() {
  const exportXlsx = useCallback(({ data, filename, columns, title }: ExportOptions) => {
    const headers = Object.values(columns);
    const rows = data.map((item) =>
      Object.keys(columns).map((key) => {
        const val = item[key];
        return val ?? "";
      }),
    );

    const wb = XLSX.utils.book_new();
    const wsData = title
      ? [[title], [], headers, ...rows]
      : [headers, ...rows];
    const ws = XLSX.utils.aoa_to_sheet(wsData);

    // Largura das colunas
    ws["!cols"] = Object.values(columns).map((col) => ({ wch: Math.max(col.length * 2, 16) }));

    XLSX.utils.book_append_sheet(wb, ws, "Dados");
    XLSX.writeFile(wb, `${filename}.xlsx`);
  }, []);

  const exportPdf = useCallback(async ({ data, filename, columns, title }: ExportOptions) => {
    // Import dinâmico do jspdf
    const { default: jsPDF } = await import("jspdf");
    await import("jspdf-autotable");

    const doc = new jsPDF("landscape");

    if (title) {
      doc.setFontSize(14);
      doc.text(title, 14, 20);
      doc.setFontSize(10);
    }

    const headers = Object.values(columns).map((col) => col);
    const rows = data.map((item) =>
      Object.keys(columns).map((key) => {
        const val = item[key];
        return val ?? "";
      }),
    );

    (doc as any).autoTable({
      head: [headers],
      body: rows,
      startY: title ? 28 : 14,
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: { fillColor: [15, 118, 110] },
      margin: { top: 14 },
    });

    doc.save(`${filename}.pdf`);
  }, []);

  const exportCsv = useCallback(({ data, filename, columns }: ExportOptions) => {
    const headers = Object.values(columns).join(",");
    const rows = data.map((item) =>
      Object.keys(columns)
        .map((key) => {
          const val = item[key];
          const str = val != null ? String(val) : "";
          return `"${str.replace(/"/g, '""')}"`;
        })
        .join(","),
    );

    const bom = "\uFEFF";
    const csv = bom + [headers, ...rows].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${filename}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  return { exportXlsx, exportPdf, exportCsv };
}
