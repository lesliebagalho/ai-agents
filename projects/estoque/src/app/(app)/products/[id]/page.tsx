import Link from "next/link";
import { notFound } from "next/navigation";
import { canManageCatalog, requireSessionContext } from "@/lib/auth/auth";
import { getProductById, listBrandsByCompany, listCategoriesByCompany, listLocationsByCompany } from "@/lib/store/database";
import EditProductForm from "./EditProductForm";

type EditProductPageProps = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ error?: string; success?: string }>;
};

export default async function EditProductPage({ params, searchParams }: EditProductPageProps) {
  const session = await requireSessionContext();
  const { id } = await params;
  const sp = await searchParams;

  const [categories, brands, locations, product] = await Promise.all([
    listCategoriesByCompany(session.activeCompany.id),
    listBrandsByCompany(session.activeCompany.id),
    listLocationsByCompany(session.activeCompany.id),
    getProductById(session.activeCompany.id, id),
  ]);

  const brandMap = Object.fromEntries(brands.map((b) => [b.id, b.name]));

  if (!product) {
    notFound();
  }

  const canEdit = canManageCatalog(session.activeRole);

  return (
    <div className="stack-lg">
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <Link href="/products" className="link-button" style={{ fontSize: 14 }}>
          &larr; Voltar para listagem
        </Link>
        <span className="muted" style={{ fontSize: 14 }}>Editando produto</span>
      </div>

      <section className="surface-card section-card">
        <div className="section-header">
          <h2>Editando: {product.name}</h2>
        </div>

        {sp?.error ? <div className="message error" style={{ marginBottom: 16 }}>{sp.error}</div> : null}
        {sp?.success ? <div className="message success" style={{ marginBottom: 16 }}>{sp.success}</div> : null}

        {!canEdit ? (
          <div className="message error">Seu perfil nao pode alterar produtos nesta empresa.</div>
        ) : (
          <EditProductForm product={product} categories={categories} brands={brands} locations={locations} />
        )}

        {!canEdit && <ProductReadOnly product={product} brandMap={brandMap} locations={locations} />}
      </section>
    </div>
  );
}

function getLocationPath(locations: Awaited<ReturnType<typeof listLocationsByCompany>>, locationId?: string | null): string {
  if (!locationId) return "-";
  const buildPath = (id: string, acc: string[] = []): string[] => {
    const loc = locations.find((l) => l.id === id);
    if (!loc) return acc;
    acc.unshift(loc.name);
    if (loc.parentId) return buildPath(loc.parentId, acc);
    return acc;
  };
  return buildPath(locationId).join(" → ");
}

function ProductReadOnly({ product, brandMap, locations }: { product: NonNullable<Awaited<ReturnType<typeof getProductById>>>; brandMap: Record<string, string>; locations: Awaited<ReturnType<typeof listLocationsByCompany>> }) {
  return (
    <div className="field-grid" style={{ marginTop: 24 }}>
      <div className="field-row two">
        <div className="field">
          <label>Nome</label>
          <p className="readonly-field">{product.name}</p>
        </div>
        <div className="field">
          <label>Codigo</label>
          <p className="readonly-field">{product.code || "-"}</p>
        </div>
      </div>
      <div className="field-row three">
        <div className="field">
          <label>SKU</label>
          <p className="readonly-field">{product.sku || "-"}</p>
        </div>
        <div className="field">
          <label>Codigo de barras</label>
          <p className="readonly-field">{product.barcode || "-"}</p>
        </div>
        <div className="field">
          <label>Marca</label>
          <p className="readonly-field">{product.brandId ? brandMap[product.brandId] || "-" : "-"}</p>
        </div>
      </div>
      <div className="field-row two">
        <div className="field">
          <label>Unidade</label>
          <p className="readonly-field">{product.unit}</p>
        </div>
        <div className="field">
          <label>Preco de custo</label>
          <p className="readonly-field">
            {product.costPrice != null
              ? product.costPrice.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
              : "-"}
          </p>
        </div>
      </div>
      <div className="field-row three">
        <div className="field">
          <label>Estoque minimo</label>
          <p className="readonly-field">{product.minimumStock ?? "-"}</p>
        </div>
        <div className="field">
          <label>Estoque maximo</label>
          <p className="readonly-field">{product.maximumStock ?? "-"}</p>
        </div>
        <div className="field">
          <label>Localizacao</label>
          <p className="readonly-field">{getLocationPath(locations, product.locationId)}</p>
        </div>
      </div>
      <div className="field-row three">
        <div className="field">
          <label>Peso</label>
          <p className="readonly-field">{product.weight != null ? `${product.weight} kg` : "-"}</p>
        </div>
        <div className="field">
          <label>Dimensoes</label>
          <p className="readonly-field">{product.dimensions || "-"}</p>
        </div>
        <div className="field">
          <label>Status</label>
          <p className="readonly-field">
            <span className="status-badge">{product.status}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
