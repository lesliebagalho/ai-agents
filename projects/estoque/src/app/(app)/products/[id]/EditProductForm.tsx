"use client";

import Link from "next/link";
import { saveProductAction } from "@/features/products/actions";
import ImagePreview from "@/components/ImagePreview";

type ProductData = {
  id: string;
  companyId: string;
  categoryId?: string | null;
  brandId?: string | null;
  locationId?: string | null;
  name: string;
  description?: string | null;
  code?: string | null;
  sku?: string | null;
  barcode?: string | null;
  costPrice?: number | null;
  unit: string;
  minimumStock?: number | null;
  maximumStock?: number | null;
  weight?: number | null;
  dimensions?: string | null;
  imageUrl?: string | null;
  expiryDate?: string | null;
  status: string;
};

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

export default function EditProductForm({
  product,
  categories,
  brands,
  locations,
}: {
  product: ProductData;
  categories: Category[];
  brands: Brand[];
  locations: LocationItem[];
}) {
  return (
    <form action={saveProductAction} className="field-grid">
      <input type="hidden" name="id" value={product.id} />

      <h3 style={{ margin: "16px 0 0", fontSize: 15, fontWeight: 700 }}>Identificacao</h3>
      <div className="field-row three">
        <div className="field">
          <label htmlFor="name">Nome *</label>
          <input id="name" name="name" defaultValue={product.name} required placeholder="Ex: Arroz Branco Tipo 1" />
        </div>
        <div className="field">
          <label htmlFor="code">Codigo</label>
          <input id="code" name="code" defaultValue={product.code ?? ""} placeholder="Ex: PROD-001" />
        </div>
        <div className="field">
          <label htmlFor="sku">SKU</label>
          <input id="sku" name="sku" defaultValue={product.sku ?? ""} placeholder="Ex: ARR-ALIM-001" />
        </div>
      </div>

      <div className="field-row two">
        <div className="field">
          <label htmlFor="barcode">Codigo de barras</label>
          <input id="barcode" name="barcode" defaultValue={product.barcode ?? ""} placeholder="Ex: 7891234567890" />
        </div>
        <div className="field">
          <label htmlFor="brandId">Marca</label>
          <select id="brandId" name="brandId" defaultValue={product.brandId ?? ""}>
            <option value="">Sem marca</option>
            {brands.map((brand) => (
              <option key={brand.id} value={brand.id}>{brand.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="field">
        <label htmlFor="description">Descricao</label>
        <textarea id="description" name="description" rows={3} defaultValue={product.description ?? ""} placeholder="Descricao do produto..." />
      </div>

      <h3 style={{ margin: "16px 0 0", fontSize: 15, fontWeight: 700 }}>Categorizacao</h3>
      <div className="field-row three">
        <div className="field">
          <label htmlFor="categoryId">Categoria</label>
          <select id="categoryId" name="categoryId" defaultValue={product.categoryId ?? ""}>
            <option value="">Sem categoria</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="unit">Unidade *</label>
          <select id="unit" name="unit" defaultValue={product.unit}>
            <option value="UNIT">UNIT</option>
            <option value="BOX">BOX</option>
            <option value="KG">KG</option>
            <option value="LITER">LITER</option>
            <option value="METER">METER</option>
          </select>
        </div>
        <div className="field">
          <label htmlFor="costPrice">Preco de custo (R$)</label>
          <input id="costPrice" name="costPrice" type="number" min="0" step="0.01" defaultValue={product.costPrice ?? ""} placeholder="0,00" />
        </div>
      </div>

      <h3 style={{ margin: "16px 0 0", fontSize: 15, fontWeight: 700 }}>Estoque</h3>
      <div className="field-row three">
        <div className="field">
          <label htmlFor="minimumStock">Estoque minimo</label>
          <input id="minimumStock" name="minimumStock" type="number" min="0" step="0.01" defaultValue={product.minimumStock ?? ""} />
        </div>
        <div className="field">
          <label htmlFor="maximumStock">Estoque maximo</label>
          <input id="maximumStock" name="maximumStock" type="number" min="0" step="0.01" defaultValue={product.maximumStock ?? ""} />
        </div>
        <div className="field">
          <label htmlFor="locationId">Localizacao</label>
          <select id="locationId" name="locationId" defaultValue={product.locationId ?? ""}>
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
      <div className="field-row two">
        <div className="field">
          <label htmlFor="weight">Peso (kg)</label>
          <input id="weight" name="weight" type="number" min="0" step="0.001" defaultValue={product.weight ?? ""} placeholder="0,000" />
        </div>
        <div className="field">
          <label htmlFor="dimensions">Dimensoes</label>
          <input id="dimensions" name="dimensions" defaultValue={product.dimensions ?? ""} placeholder="Ex: 30x20x10 cm" />
        </div>
      </div>

      <h3 style={{ margin: "16px 0 0", fontSize: 15, fontWeight: 700 }}>Validade</h3>
      <div className="field-row two">
        <div className="field">
          <label htmlFor="expiryDate">Data de validade</label>
          <input id="expiryDate" name="expiryDate" type="date" defaultValue={product.expiryDate ? product.expiryDate.slice(0, 10) : ""} />
          <p className="muted" style={{ fontSize: 11, marginTop: 2 }}>Deixe em branco se nao tiver validade.</p>
        </div>
        <div className="field">
          <label htmlFor="imageUrl">URL da foto</label>
          <ImagePreview url={product.imageUrl} />
          <input id="imageUrl" name="imageUrl" defaultValue={product.imageUrl ?? ""} placeholder="https://..." />
        </div>
      </div>

      <div className="field">
        <label htmlFor="status">Status *</label>
        <select id="status" name="status" defaultValue={product.status}>
          <option value="ACTIVE">ACTIVE</option>
          <option value="INACTIVE">INACTIVE</option>
        </select>
      </div>

      <div style={{ display: "flex", gap: 12 }}>
        <button type="submit" className="button primary">Salvar alteracoes</button>
        <Link href="/products" className="button secondary">Cancelar</Link>
      </div>
    </form>
  );
}
