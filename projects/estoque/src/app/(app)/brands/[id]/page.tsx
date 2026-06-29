import { canManageCatalog, requireSessionContext } from "@/lib/auth/auth";
import { saveBrandAction } from "@/features/products/actions";
import { getBrandById } from "@/lib/store/database";
import { notFound } from "next/navigation";
import Link from "next/link";

type EditBrandPageProps = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{
    error?: string;
    success?: string;
  }>;
};

export default async function EditBrandPage({ params, searchParams }: EditBrandPageProps) {
  const session = await requireSessionContext();
  const { id } = await params;
  const search = await searchParams;
  const brand = await getBrandById(session.activeCompany.id, id);

  if (!brand) {
    notFound();
  }

  const canEdit = canManageCatalog(session.activeRole);

  return (
    <div className="stack-lg">
      <section className="surface-card section-card">
        <div className="section-header">
          <h2>Editando: {brand.name}</h2>
          <Link href="/brands" className="link-button">
            Cancelar edicao
          </Link>
        </div>

        {search?.error ? <div className="message error" style={{ marginBottom: 16 }}>{search.error}</div> : null}
        {search?.success ? <div className="message success" style={{ marginBottom: 16 }}>{search.success}</div> : null}

        {!canEdit ? (
          <div className="message error">Seu perfil nao pode alterar marcas nesta empresa.</div>
        ) : (
          <form action={saveBrandAction} className="field-grid">
            <input type="hidden" name="id" value={brand.id} />

            <div className="field">
              <label htmlFor="name">Nome *</label>
              <input id="name" name="name" defaultValue={brand.name} required />
            </div>

            <div className="field">
              <label htmlFor="description">Descricao</label>
              <textarea
                id="description"
                name="description"
                defaultValue={brand.description ?? ""}
                placeholder="Opcional"
              />
            </div>

            <button type="submit" className="button primary">
              Salvar alteracoes
            </button>
          </form>
        )}
      </section>
    </div>
  );
}
