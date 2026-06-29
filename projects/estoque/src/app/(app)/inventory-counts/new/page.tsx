import { canManageCatalog, requireSessionContext } from "@/lib/auth/auth";
import { startInventoryCountAction } from "@/features/products/actions";
import Link from "next/link";

type NewInventoryCountPageProps = {
  searchParams?: Promise<{
    error?: string;
  }>;
};

export default async function NewInventoryCountPage({ searchParams }: NewInventoryCountPageProps) {
  const session = await requireSessionContext();
  const params = await searchParams;
  const canEdit = canManageCatalog(session.activeRole);

  return (
    <div className="stack-lg">
      <section className="surface-card section-card">
        <div className="section-header">
          <h2>Novo inventario</h2>
          <Link href="/inventory-counts" className="link-button">
            Cancelar
          </Link>
        </div>

        {params?.error ? <div className="message error" style={{ marginBottom: 16 }}>{params.error}</div> : null}

        {!canEdit ? (
          <div className="message error">Seu perfil nao pode criar inventarios.</div>
        ) : (
          <form action={startInventoryCountAction} className="field-grid">
            <div className="field">
              <label htmlFor="name">Nome do inventario *</label>
              <input id="name" name="name" required placeholder="Ex: Inventario Geral Junho 2026" />
              <p className="muted" style={{ fontSize: 12, marginTop: 4 }}>
                Ao iniciar, sera criada uma contagem para todos os produtos ativos com o saldo atual como valor esperado.
              </p>
            </div>

            <button type="submit" className="button primary">
              Iniciar inventario
            </button>
          </form>
        )}
      </section>
    </div>
  );
}
