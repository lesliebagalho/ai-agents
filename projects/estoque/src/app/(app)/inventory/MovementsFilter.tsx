"use client";

import { useRouter } from "next/navigation";

type Product = {
  id: string;
  name: string;
};

type MovementsFilterProps = {
  products: Product[];
  currentProductId: string;
  currentType: string;
};

const TYPE_OPTIONS = [
  { value: "ALL", label: "Todos" },
  { value: "ENTRY", label: "Entradas" },
  { value: "EXIT", label: "Saidas" },
  { value: "ADJUSTMENT", label: "Ajustes" },
  { value: "SALE", label: "Venda" },
  { value: "INTERNAL_CONSUMPTION", label: "Consumo interno" },
  { value: "LOSS", label: "Perda" },
  { value: "BREAKAGE", label: "Quebra" },
  { value: "NEGATIVE_ADJUSTMENT", label: "Ajuste negativo" },
];

export default function MovementsFilter({ products, currentProductId, currentType }: MovementsFilterProps) {
  const router = useRouter();

  const handleFilter = (formData: FormData) => {
    const params = new URLSearchParams();
    const productId = formData.get("productId") as string;
    const type = formData.get("type") as string;
    if (productId) params.set("productId", productId);
    if (type && type !== "ALL") params.set("type", type);
    const qs = params.toString();
    router.push(qs ? `/inventory?${qs}` : "/inventory");
  };

  return (
    <form action={handleFilter} className="field-row three" style={{ marginBottom: 16 }}>
      <div className="field">
        <label htmlFor="productIdFilter">Produto</label>
        <select id="productIdFilter" name="productId" defaultValue={currentProductId}>
          <option value="">Todos</option>
          {products.map((product) => (
            <option key={product.id} value={product.id}>
              {product.name}
            </option>
          ))}
        </select>
      </div>

      <div className="field">
        <label htmlFor="typeFilter">Tipo</label>
        <select id="typeFilter" name="type" defaultValue={currentType}>
          {TYPE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      <div style={{ display: "flex", alignItems: "end", gap: 12 }}>
        <button type="submit" className="button secondary">
          Filtrar
        </button>
        <a href="/inventory" className="link-button">
          Limpar
        </a>
      </div>
    </form>
  );
}
