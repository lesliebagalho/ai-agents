"use client";

import { useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { importProductsFromCsvAction } from "@/features/products/actions";
import * as XLSX from "xlsx";

export default function ImportClient() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<{ imported: number; errors: string[] } | null>(null);
  const [mode, setMode] = useState<"csv" | "xlsx">("csv");

  const readXlsxAsCsv = useCallback(async (file: File): Promise<string> => {
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: "array" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    // Converte para CSV
    const csv = XLSX.utils.sheet_to_csv(sheet, { blankrows: false });
    return csv;
  }, []);

  const handleImport = useCallback(async () => {
    const file = fileRef.current?.files?.[0];
    if (!file) {
      alert("Selecione um arquivo.");
      return;
    }

    setImporting(true);
    setResult(null);

    try {
      let csv: string;

      if (mode === "xlsx" || file.name.endsWith(".xlsx")) {
        csv = await readXlsxAsCsv(file);
      } else {
        csv = await file.text();
      }

      const formData = new FormData();
      formData.append("csv", csv);

      const response = await importProductsFromCsvAction(formData);
      setResult(response);

      if (response.imported > 0) {
        router.refresh();
      }
    } catch {
      setResult({ imported: 0, errors: ["Nao foi possivel ler o arquivo."] });
    } finally {
      setImporting(false);
    }
  }, [router, mode, readXlsxAsCsv]);

  return (
    <div className="stack-lg" style={{ maxWidth: 600 }}>
      <section className="surface-card section-card">
        <div className="section-header">
          <h2>Importar produtos</h2>
        </div>

        <p className="muted" style={{ marginBottom: 20 }}>
          Selecione um arquivo CSV ou XLSX (Excel) com os produtos.
          O formato deve seguir o mesmo padrao da exportacao.
          Colunas esperadas: Codigo, SKU, Nome, Unidade, Status.
        </p>

        {result && (
          <div className={`message ${result.errors.length === 0 ? "success" : "error"}`} style={{ marginBottom: 16 }}>
            <strong>{result.imported} produto(s) importado(s).</strong>
            {result.errors.length > 0 && (
              <ul style={{ margin: "8px 0 0", paddingLeft: 20 }}>
                {result.errors.map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            )}
          </div>
        )}

        <div style={{ display: "flex", gap: 4, marginBottom: 12 }}>
          <button
            type="button"
            className={`button ${mode === "csv" ? "primary" : "secondary"}`}
            onClick={() => setMode("csv")}
            style={{ fontSize: 12, minHeight: 30, padding: "0 10px" }}
          >
            CSV
          </button>
          <button
            type="button"
            className={`button ${mode === "xlsx" ? "primary" : "secondary"}`}
            onClick={() => setMode("xlsx")}
            style={{ fontSize: 12, minHeight: 30, padding: "0 10px" }}
          >
            XLSX (Excel)
          </button>
        </div>

        <div className="field">
          <label htmlFor="csvFile">
            {mode === "csv" ? "Arquivo CSV" : "Arquivo Excel (.xlsx)"}
          </label>
          <input
            ref={fileRef}
            id="csvFile"
            type="file"
            accept={mode === "csv" ? ".csv,text/csv" : ".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"}
          />
        </div>

        <button
          onClick={handleImport}
          className="button primary"
          disabled={importing}
        >
          {importing ? "Importando..." : "Importar"}
        </button>
      </section>
    </div>
  );
}
