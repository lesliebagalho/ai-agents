"use client";

import { useCallback, useState } from "react";

type Product = {
  id: string;
  name: string;
  sku?: string | null;
  barcode?: string | null;
  costPrice?: number | null;
  unit: string;
};

type LabelsGridProps = {
  products: Product[];
  companyName: string;
};

export default function LabelsGrid({ products, companyName }: LabelsGridProps) {
  const [showAll, setShowAll] = useState(false);
  const displayed = showAll ? products : products.slice(0, 24);

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  return (
    <div>
      <div className="action-buttons" style={{ marginBottom: 20 }}>
        <button onClick={handlePrint} className="button primary">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 6 2 18 2 18 9" />
            <path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2" />
            <rect x="6" y="14" width="12" height="8" />
          </svg>
          Imprimir etiquetas
        </button>
        {products.length > 24 && (
          <button onClick={() => setShowAll(!showAll)} className="button secondary">
            {showAll ? "Mostrar menos" : `Mostrar todos (${products.length})`}
          </button>
        )}
      </div>

      <div className="labels-grid">
        {displayed.map((product) => (
          <div key={product.id} className="label-card">
            <div className="label-header">{companyName}</div>
            <div className="label-name">{product.name}</div>
            {product.sku && <div className="label-sku">SKU: {product.sku}</div>}
            {product.barcode && <div className="label-barcode">{product.barcode}</div>}
            {product.costPrice != null && (
              <div className="label-price">
                {product.costPrice.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
              </div>
            )}
            <div className="label-unit">{product.unit}</div>
          </div>
        ))}
      </div>

      <style>{`
        @media print {
          .sidebar, .topbar, .action-buttons, .section-header form { display: none !important; }
          .labels-grid { grid-template-columns: repeat(3, 1fr) !important; }
          .label-card { border: 1px solid #000 !important; break-inside: avoid; }
        }
      `}</style>
    </div>
  );
}
