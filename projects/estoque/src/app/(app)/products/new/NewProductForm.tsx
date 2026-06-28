"use client";

import { useState, useCallback } from "react";
import { saveProductAction } from "@/features/products/actions";

type Category = {
  id: string;
  name: string;
};

function generateSku(name: string, categoryName: string): string {
  const namePart = name.replace(/[^a-zA-Z0-9]/g, "").slice(0, 3).toUpperCase();
  const catPart = categoryName.replace(/[^a-zA-Z0-9]/g, "").slice(0, 4).toUpperCase();
  const randomPart = String(Math.floor(100 + Math.random() * 900));
  return `${namePart}-${catPart}-${randomPart}`;
}

export default function NewProductForm({ categories }: { categories: Category[] }) {
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [sku, setSku] = useState("");

  const selectedCategory = categories.find((c) => c.id === categoryId);

  const updateSku = useCallback(
    (newName: string, newCategoryId: string) => {
      const cat = newCategoryId
        ? categories.find((c) => c.id === newCategoryId)
        : null;
      const catName = cat?.name ?? "";
      if (newName.trim() || catName) {
        setSku(generateSku(newName, catName));
      } else {
        setSku("");
      }
    },
    [categories]
  );

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setName(value);
    updateSku(value, categoryId);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setCategoryId(value);
    updateSku(name, value);
  };

  return (
    <form action={saveProductAction} className="field-grid">
      <div className="field-row three">
        <div className="field">
          <label htmlFor="name">Nome *</label>
          <input
            id="name"
            name="name"
            value={name}
            onChange={handleNameChange}
            required
            placeholder="Ex: Arroz Branco Tipo 1"
          />
        </div>

        <div className="field">
          <label htmlFor="categoryId">Categoria</label>
          <select
            id="categoryId"
            name="categoryId"
            value={categoryId}
            onChange={handleCategoryChange}
            defaultValue=""
          >
            <option value="">Sem categoria</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="unit">Unidade *</label>
          <select id="unit" name="unit" defaultValue="UNIT">
            <option value="UNIT">UNIT</option>
            <option value="BOX">BOX</option>
            <option value="KG">KG</option>
            <option value="LITER">LITER</option>
            <option value="METER">METER</option>
          </select>
        </div>
      </div>

      <div className="field-row three">
        <div className="field">
          <label htmlFor="sku">SKU <span className="muted" style={{ fontWeight: 400 }}>(gerado automaticamente)</span></label>
          <input
            id="sku"
            name="sku"
            value={sku}
            onChange={(e) => setSku(e.target.value)}
            placeholder="Preencha o nome e a categoria"
          />
        </div>

        <div className="field">
          <label htmlFor="costPrice">Preco de custo (R$)</label>
          <input id="costPrice" name="costPrice" type="number" min="0" step="0.01" placeholder="0,00" />
        </div>

        <div className="field">
          <label htmlFor="minimumStock">Estoque minimo</label>
          <input id="minimumStock" name="minimumStock" type="number" min="0" step="0.01" />
        </div>

        <div className="field">
          <label htmlFor="status">Status *</label>
          <select id="status" name="status" defaultValue="ACTIVE">
            <option value="ACTIVE">ACTIVE</option>
            <option value="INACTIVE">INACTIVE</option>
          </select>
        </div>
      </div>

      <button type="submit" className="button primary">
        Criar produto
      </button>
    </form>
  );
}
