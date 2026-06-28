import { requireSessionContext } from "@/lib/auth/auth";
import { listProductsByCompany } from "@/lib/store/database";
import LabelsGrid from "./LabelsGrid";

type LabelsPageProps = {
  searchParams?: Promise<{
    q?: string;
  }>;
};

export default async function LabelsPage({ searchParams }: LabelsPageProps) {
  const session = await requireSessionContext();
  const params = await searchParams;

  const products = await listProductsByCompany(session.activeCompany.id, {
    query: params?.q,
    status: "ACTIVE",
  });

  return (
    <div className="stack-lg">
      <section className="surface-card section-card">
        <div className="section-header">
          <h2>Etiquetas de produtos</h2>
          <form>
            <div className="inline-form">
              <div className="field" style={{ minWidth: 200 }}>
                <label htmlFor="q">Filtrar</label>
                <input id="q" name="q" placeholder="Nome ou SKU" defaultValue={params?.q ?? ""} />
              </div>
              <button type="submit" className="button secondary" style={{ marginTop: 22 }}>
                Filtrar
              </button>
            </div>
          </form>
        </div>

        {products.length === 0 ? (
          <div className="empty-state">
            {params?.q ? "Nenhum produto encontrado com esse filtro." : "Nenhum produto ativo cadastrado."}
          </div>
        ) : (
          <LabelsGrid products={products} companyName={session.activeCompany.name} />
        )}
      </section>
    </div>
  );
}
