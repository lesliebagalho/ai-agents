"use client";

import { useState, useCallback } from "react";
import { saveProductAction } from "@/features/products/actions";
import ImagePreview from "@/components/ImagePreview";

type Category = {
  id: string;
  name: string;
};

type Brand = {
  id: string;
  name: string;
};

type LocationItem = {
  id: string;
  parentId?: string;
  name: string;
  level: number;
};

function generateSku(name: string, categoryName: string): string {
  const namePart = name.replace(/[^a-zA-Z0-9]/g, "").slice(0, 3).toUpperCase();
  const catPart = categoryName.replace(/[^a-zA-Z0-9]/g, "").slice(0, 4).toUpperCase();
  const randomPart = String(Math.floor(100 + Math.random() * 900));
  return `${namePart}-${catPart}-${randomPart}`;
}

function getLocationPath(locations: LocationItem[], locationId?: string | null): string {
  if (!locationId) return "";
  const buildPath = (id: string, acc: string[] = []): string[] => {
    const loc = locations.find((l) => l.id === id);
    if (!loc) return acc;
    acc.unshift(loc.name);
    if (loc.parentId) return buildPath(loc.parentId, acc);
    return acc;
  };
  return buildPath(locationId).join(" → ");
}

export default function NewProductForm({ categories, brands, locations }: { categories: Category[]; brands: Brand[]; locations: LocationItem[] }) {
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [sku, setSku] = useState("");
  const [imageUrl, setImageUrl] = useState("");

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
      <input type="hidden" name="id" value="" />

      <h3 style={{ margin: "16px 0 0", fontSize: 15, fontWeight: 700 }}>Identificacao</h3>
      <div className="field-row three">
        <div className="field">
          <label htmlFor="name">Nome *</label>
          <input id="name" name="name" value={name} onChange={handleNameChange} required placeholder="Ex: Arroz Branco Tipo 1" />
        </div>
        <div className="field">
          <label htmlFor="code">Codigo</label>
          <input id="code" name="code" placeholder="Ex: PROD-001" />
        </div>
        <div className="field">
          <label htmlFor="sku">SKU <span className="muted" style={{ fontWeight: 400 }}>(gerado automaticamente)</span></label>
          <input id="sku" name="sku" value={sku} onChange={(e) => setSku(e.target.value)} placeholder="Preencha o nome e a categoria" />
        </div>
      </div>

      <div className="field-row two">
        <div className="field">
          <label htmlFor="barcode">Codigo de barras</label>
          <input id="barcode" name="barcode" placeholder="Ex: 7891234567890" />
        </div>
        <div className="field">
          <label htmlFor="brandId">Marca</label>
          <select id="brandId" name="brandId" defaultValue="">
            <option value="">Sem marca</option>
            {brands.map((brand) => (
              <option key={brand.id} value={brand.id}>{brand.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="field">
        <label htmlFor="description">Descricao</label>
        <textarea id="description" name="description" rows={3} placeholder="Descricao do produto..." />
      </div>

      <h3 style={{ margin: "16px 0 0", fontSize: 15, fontWeight: 700 }}>Categorizacao</h3>
      <div className="field-row three">
        <div className="field">
          <label htmlFor="categoryId">Categoria</label>
          <select id="categoryId" name="categoryId" value={categoryId} onChange={handleCategoryChange} defaultValue="">
            <option value="">Sem categoria</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>{category.name}</option>
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
        <div className="field">
          <label htmlFor="costPrice">Preco de custo (R$)</label>
          <input id="costPrice" name="costPrice" type="number" min="0" step="0.01" placeholder="0,00" />
        </div>
      </div>

      <h3 style={{ margin: "16px 0 0", fontSize: 15, fontWeight: 700 }}>Estoque</h3>
      <div className="field-row three">
        <div className="field">
          <label htmlFor="minimumStock">Estoque minimo</label>
          <input id="minimumStock" name="minimumStock" type="number" min="0" step="0.01" />
        </div>
        <div className="field">
          <label htmlFor="maximumStock">Estoque maximo</label>
          <input id="maximumStock" name="maximumStock" type="number" min="0" step="0.01" />
        </div>
        <div className="field">
          <label htmlFor="locationId">Localizacao</label>
          <select id="locationId" name="locationId" defaultValue="">
            <option value="">Sem localizacao</option>
            {locations.map((loc) => (
              <option key={loc.id} value={loc.id}>
                {"  ".repeat(loc.level)}{getLocationPath(locations, loc.id)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <h3 style={{ margin: "16px 0 0", fontSize: 15, fontWeight: 700 }}>Fisico</h3>
      <div className="field-row three">
        <div className="field">
          <label htmlFor="weight">Peso (kg)</label>
          <input id="weight" name="weight" type="number" min="0" step="0.001" placeholder="0,000" />
        </div>
        <div className="field">
          <label htmlFor="dimensions">Dimensoes</label>
          <input id="dimensions" name="dimensions" placeholder="Ex: 30x20x10 cm" />
        </div>
        <div className="field">
          <label htmlFor="imageUrl">URL da foto</label>
          <ImagePreview url={imageUrl} />
          <input id="imageUrl" name="imageUrl" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://..." />
        </div>
      </div>

      <div className="field">
        <label htmlFor="status">Status *</label>
        <select id="status" name="status" defaultValue="ACTIVE">
          <option value="ACTIVE">ACTIVE</option>
          <option value="INACTIVE">INACTIVE</option>
        </select>
      </div>

      <button type="submit" className="button primary">
        Criar produto
      </button>
    </form>
  );
}
