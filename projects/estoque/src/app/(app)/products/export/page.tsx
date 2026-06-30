"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { exportProductsCsvAction } from "@/features/products/actions";
import { useExport } from "@/hooks/useExport";

type ProductRow = Record<string, string | number | boolean | null | undefined>;

export default function ExportClient() {
  const router = useRouter();
  const { exportXlsx, exportPdf, exportCsv } = useExport();
  const [loading, setLoading] = useState<string | null>(null);

  const fetchProducts = useCallback(async (): Promise<ProductRow[]> => {
    const result = await exportProductsCsvAction();
    if ("error" in result) {
      alert(result.error);
      return [];
    }

    // Parse CSV simples para obter dados estruturados
    const csv = result.csv.replace(/^\uFEFF/, "");
    const lines = csv.split("\n").filter(Boolean);
    if (lines.length < 2) return [];

    const headers = lines[0]
      .split(",")
      .map((h) => h.replace(/^"|"$/g, ""));

    return lines.slice(1).map((line) => {
      const values = parseCsvLine(line);
      const row: ProductRow = {};
      headers.forEach((header, i) => {
        row[header] = values[i] ?? "";
      });
      return row;
    });
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const COLUMNS: Record<string, string> = {
    Codigo: "Codigo",
    SKU: "SKU",
    "Codigo de Barras": "Codigo de Barras",
    Nome: "Nome",
    Descricao: "Descricao",
    Unidade: "Unidade",
    "Preco de Custo": "Preco de Custo",
    "Estoque Minimo": "Estoque Minimo",
    "Estoque Maximo": "Estoque Maximo",
    Status: "Status",
  };

  const handleExportXlsx = useCallback(async () => {
    setLoading("xlsx");
    const data = await fetchProducts();
    if (data.length > 0) {
      exportXlsx({
        data,
        filename: `produtos-export-${new Date().toISOString().slice(0, 10)}`,
        columns: COLUMNS,
        title: "Relatorio de Produtos",
      });
    }
    setLoading(null);
    router.push("/products?success=Exportacao%20XLSX%20concluida.");
  }, [fetchProducts, exportXlsx, COLUMNS, router]);

  const handleExportPdf = useCallback(async () => {
    setLoading("pdf");
    const data = await fetchProducts();
    if (data.length > 0) {
      await exportPdf({
        data,
        filename: `produtos-export-${new Date().toISOString().slice(0, 10)}`,
        columns: COLUMNS,
        title: "Relatorio de Produtos",
      });
    }
    setLoading(null);
    router.push("/products?success=Exportacao%20PDF%20concluida.");
  }, [fetchProducts, exportPdf, COLUMNS, router]);

  const handleExportCsv = useCallback(async () => {
    setLoading("csv");
    const result = await exportProductsCsvAction();
    if ("error" in result) {
      alert(result.error);
      setLoading(null);
      return;
    }
    const blob = new Blob([result.csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = result.filename;
    a.click();
    URL.revokeObjectURL(url);
    setLoading(null);
    router.push("/products?success=Exportacao%20CSV%20concluida.");
  }, [router]);

  return (
    <div className="stack-lg" style={{ maxWidth: 520 }}>
      <section className="surface-card section-card">
        <div className="section-header">
          <h2>Exportar produtos</h2>
        </div>
        <p className="muted" style={{ marginBottom: 20 }}>
          Exporte a lista de produtos cadastrados na empresa ativa em diversos formatos.
        </p>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <button onClick={handleExportXlsx} disabled={loading !== null} className="button primary" style={{ minWidth: 140 }}>
            {loading === "xlsx" ? "Gerando..." : "Exportar XLSX"}
          </button>
          <button onClick={handleExportPdf} disabled={loading !== null} className="button secondary" style={{ minWidth: 140 }}>
            {loading === "pdf" ? "Gerando..." : "Exportar PDF"}
          </button>
          <button onClick={handleExportCsv} disabled={loading !== null} className="button secondary" style={{ minWidth: 140 }}>
            {loading === "csv" ? "Gerando..." : "Exportar CSV"}
          </button>
        </div>
        <p className="muted" style={{ fontSize: 12, marginTop: 16 }}>
          <strong>XLSX:</strong> Excel nativo (recomendado) &bull;
          <strong> PDF:</strong> Documento portatil &bull;
          <strong> CSV:</strong> Formato universal
        </p>
      </section>
    </div>
  );
}

/** Parse uma linha CSV respeitando aspas */
function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === "," && !inQuotes) {
      result.push(current);
      current = "";
    } else {
      current += ch;
    }
  }
  result.push(current);
  return result;
}
