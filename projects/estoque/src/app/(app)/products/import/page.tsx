"use client";

import { useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { importProductsFromCsvAction } from "@/features/products/actions";

export default function ImportClient() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<{ imported: number; errors: string[] } | null>(null);

  const handleImport = useCallback(async () => {
    const file = fileRef.current?.files?.[0];
    if (!file) {
      alert("Selecione um arquivo CSV.");
      return;
    }

    setImporting(true);
    setResult(null);

    try {
      const text = await file.text();
      const formData = new FormData();
      formData.append("csv", text);

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
  }, [router]);

  return (
    <div className="stack-lg" style={{ maxWidth: 600 }}>
      <section className="surface-card section-card">
        <div className="section-header">
          <h2>Importar produtos (CSV)</h2>
        </div>

        <p className="muted" style={{ marginBottom: 20 }}>
          Selecione um arquivo CSV com os produtos. O formato deve seguir o mesmo padrao da exportacao.
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

        <div className="field">
          <label htmlFor="csvFile">Arquivo CSV</label>
          <input
            ref={fileRef}
            id="csvFile"
            type="file"
            accept=".csv,text/csv"
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
