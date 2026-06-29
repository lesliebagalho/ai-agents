import { canManageCatalog, requireSessionContext } from "@/lib/auth/auth";
import { saveSupplierAction } from "@/features/products/actions";
import Link from "next/link";

type NewSupplierPageProps = {
  searchParams?: Promise<{
    error?: string;
  }>;
};

export default async function NewSupplierPage({ searchParams }: NewSupplierPageProps) {
  const session = await requireSessionContext();
  const params = await searchParams;
  const canEdit = canManageCatalog(session.activeRole);

  return (
    <div className="stack-lg">
      <section className="surface-card section-card">
        <div className="section-header">
          <h2>Novo fornecedor</h2>
          <Link href="/suppliers" className="link-button">
            Cancelar
          </Link>
        </div>

        {params?.error ? <div className="message error" style={{ marginBottom: 16 }}>{params.error}</div> : null}

        {!canEdit ? (
          <div className="message error">Seu perfil nao pode alterar fornecedores nesta empresa.</div>
        ) : (
          <form action={saveSupplierAction} className="field-grid">
            <input type="hidden" name="id" value="" />

            <h3 style={{ margin: "16px 0 0", fontSize: 15, fontWeight: 700 }}>Dados principais</h3>
            <div className="field-row two">
              <div className="field">
                <label htmlFor="name">Nome *</label>
                <input id="name" name="name" required placeholder="Ex: Distribuidora de Papeis Ltda" />
              </div>
              <div className="field">
                <label htmlFor="cnpj">CNPJ</label>
                <input id="cnpj" name="cnpj" placeholder="Ex: 11.222.333/0001-81" />
              </div>
            </div>

            <h3 style={{ margin: "16px 0 0", fontSize: 15, fontWeight: 700 }}>Contato</h3>
            <div className="field-row three">
              <div className="field">
                <label htmlFor="contact">Contato</label>
                <input id="contact" name="contact" placeholder="Ex: Carlos" />
              </div>
              <div className="field">
                <label htmlFor="phone">Telefone</label>
                <input id="phone" name="phone" placeholder="Ex: (11) 99999-0001" />
              </div>
              <div className="field">
                <label htmlFor="email">Email</label>
                <input id="email" name="email" type="email" placeholder="Ex: contato@fornecedor.com" />
              </div>
            </div>

            <h3 style={{ margin: "16px 0 0", fontSize: 15, fontWeight: 700 }}>Endereco</h3>
            <div className="field">
              <label htmlFor="address">Endereco</label>
              <textarea id="address" name="address" rows={2} placeholder="Rua, numero, bairro, cidade, estado" />
            </div>

            <div className="field">
              <label htmlFor="status">Status *</label>
              <select id="status" name="status" defaultValue="ACTIVE">
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
              </select>
            </div>

            <button type="submit" className="button primary">
              Criar fornecedor
            </button>
          </form>
        )}
      </section>
    </div>
  );
}
