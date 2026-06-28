import { canManageCatalog, requireSessionContext } from "@/lib/auth/auth";
import { saveProductAction } from "@/features/products/actions";
import { listCategoriesByCompany } from "@/lib/store/database";
import NewProductForm from "./NewProductForm";

type NewProductPageProps = {
  searchParams?: Promise<{
    error?: string;
    success?: string;
  }>;
};

export default async function NewProductPage({ searchParams }: NewProductPageProps) {
  const session = await requireSessionContext();
  const params = await searchParams;
  const categories = await listCategoriesByCompany(session.activeCompany.id);
  const canEdit = canManageCatalog(session.activeRole);

  return (
    <div className="stack-lg">
      <section className="surface-card section-card">
        <div className="section-header">
          <h2>Novo produto</h2>
        </div>

        {params?.error ? (
          <div className="message error" style={{ marginBottom: 16 }}>
            {params.error}
          </div>
        ) : null}

        {params?.success ? (
          <div className="message success" style={{ marginBottom: 16 }}>
            {params.success}
          </div>
        ) : null}

        {!canEdit ? (
          <div className="message error">Seu perfil nao pode alterar produtos nesta empresa.</div>
        ) : (
          <NewProductForm categories={categories} />
        )}
      </section>
    </div>
  );
}
