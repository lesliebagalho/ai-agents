
import { canRegisterMovements, requireSessionContext } from "@/lib/auth/auth";
import { listProductsWithBalance } from "@/lib/store/database";
import Link from "next/link";
import NewExitForm from "./NewExitForm";

type NewExitPageProps = {
  searchParams?: Promise<{
    error?: string;
    success?: string;
  }>;
};

export default async function NewExitPage({ searchParams }: NewExitPageProps) {
  const session = await requireSessionContext();
  const params = await searchParams;
  const products = await listProductsWithBalance(session.activeCompany.id, { status: "ACTIVE" });
  const canEdit = canRegisterMovements(session.activeRole);

  return (
    <div className="stack-lg">
      <section className="surface-card section-card">
        <div className="section-header">
          <h2>Nova saida</h2>
          <Link href="/exits" className="link-button">
            Cancelar
          </Link>
        </div>

        {params?.error ? <div className="message error" style={{ marginBottom: 16 }}>{params.error}</div> : null}
        {params?.success ? <div className="message success" style={{ marginBottom: 16 }}>{params.success}</div> : null}

        {!canEdit ? (
          <div className="message error">Seu perfil nao pode registrar saidas.</div>
        ) : (
          <NewExitForm products={products} />
        )}
      </section>
    </div>
  );
}
