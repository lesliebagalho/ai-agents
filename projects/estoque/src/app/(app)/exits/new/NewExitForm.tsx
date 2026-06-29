"use client";

import { useState } from "react";
import { saveExitMovementAction } from "@/features/products/actions";
import Link from "next/link";

type Product = {
  id: string;
  name: string;
  sku?: string | null;
  unit: string;
  currentQuantity: number;
};

const EXIT_TYPES = [
  { value: "SALE", label: "Venda", desc: "Produto vendido ao cliente" },
  { value: "INTERNAL_CONSUMPTION", label: "Consumo interno", desc: "Uso interno pela empresa" },
  { value: "LOSS", label: "Perda", desc: "Produto perdido ou extraviado" },
  { value: "BREAKAGE", label: "Quebra", desc: "Produto danificado/quebrado" },
  { value: "NEGATIVE_ADJUSTMENT", label: "Ajuste negativo", desc: "Ajuste manual para baixo" },
];

export default function NewExitForm({ products }: { products: Product[] }) {
  const [selectedProductId, setSelectedProductId] = useState("");
  const selectedProduct = products.find((p) => p.id === selectedProductId);

  return (
    <form action={saveExitMovementAction} className="field-grid">
      <h3 style={{ margin: "16px 0 0", fontSize: 15, fontWeight: 700 }}>Tipo de saida</h3>
      <div className="field-row" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 8 }}>
        {EXIT_TYPES.map((t) => (
          <label
            key={t.value}
            className="radio-card"
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 8,
              padding: "10px 12px",
              border: "1px solid var(--border)",
              borderRadius: 8,
              cursor: "pointer",
            }}
          >
            <input type="radio" name="type" value={t.value} defaultChecked={t.value === "SALE"} required />
            <div>
              <strong style={{ fontSize: 13 }}>{t.label}</strong>
              <p className="muted" style={{ fontSize: 11, margin: 0 }}>{t.desc}</p>
            </div>
          </label>
        ))}
      </div>

      <h3 style={{ margin: "16px 0 0", fontSize: 15, fontWeight: 700 }}>Dados da saida</h3>
      <div className="field-row two">
        <div className="field">
          <label htmlFor="productId">Produto *</label>
          <select
            id="productId"
            name="productId"
            value={selectedProductId}
            onChange={(e) => setSelectedProductId(e.target.value)}
            required
          >
            <option value="">Selecione um produto</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} {p.sku ? `(${p.sku})` : ""} - Saldo: {p.currentQuantity} {p.unit}
              </option>
            ))}
          </select>
          {selectedProduct && (
            <p className="muted" style={{ fontSize: 12, marginTop: 4 }}>
              Saldo atual: <strong>{selectedProduct.currentQuantity}</strong> {selectedProduct.unit}
              {selectedProduct.currentQuantity <= 0 && (
                <span style={{ color: "var(--danger, red)", marginLeft: 8 }}>
                  (saldo zerado!)
                </span>
              )}
            </p>
          )}
        </div>

        <div className="field">
          <label htmlFor="quantity">Quantidade *</label>
          <input id="quantity" name="quantity" type="number" min="0.01" step="0.01" required placeholder="Ex: 10" />
        </div>
      </div>

      <div className="field-row two">
        <div className="field">
          <label htmlFor="reason">Motivo</label>
          <input id="reason" name="reason" placeholder="Ex: Cliente X, Nota fiscal Y" />
        </div>
        <div className="field">
          <label htmlFor="referenceCode">Codigo de referencia</label>
          <input id="referenceCode" name="referenceCode" placeholder="Ex: NF-12345" />
        </div>
      </div>

      <div className="field">
        <label htmlFor="note">Observacao</label>
        <textarea id="note" name="note" rows={2} placeholder="Informacoes adicionais..." />
      </div>

      <div style={{ display: "flex", gap: 12 }}>
        <button type="submit" className="button primary">
          Registrar saida
        </button>
        <Link href="/exits" className="link-button">
          Cancelar
        </Link>
      </div>
    </form>
  );
}
