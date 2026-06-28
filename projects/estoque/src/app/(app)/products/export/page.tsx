"use client";

import { useCallback } from "react";
import { redirect, useRouter } from "next/navigation";
import { exportProductsCsvAction } from "@/features/products/actions";

export default function ExportClient() {
  const router = useRouter();

  const handleExportCsv = useCallback(async () => {
    const result = await exportProductsCsvAction();

    if ("error" in result) {
      alert(result.error);
      return;
    }

    const blob = new Blob([result.csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = result.filename;
    a.click();
    URL.revokeObjectURL(url);

    router.push("/products?success=Exportacao%20concluida.");
  }, [router]);

  return (
    <div className="stack-lg" style={{ maxWidth: 480 }}>
      <section className="surface-card section-card">
        <div className="section-header">
          <h2>Exportar produtos</h2>
        </div>
        <p className="muted" style={{ marginBottom: 20 }}>
          Exporte a lista de produtos cadastrados na empresa ativa em formato CSV.
          O arquivo pode ser aberto no Excel, Google Sheets ou qualquer editor de planilhas.
        </p>
        <button onClick={handleExportCsv} className="button primary">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Exportar CSV
        </button>
      </section>
    </div>
  );
}
