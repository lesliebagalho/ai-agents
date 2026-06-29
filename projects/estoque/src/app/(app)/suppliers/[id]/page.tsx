import { canManageCatalog, requireSessionContext } from "@/lib/auth/auth";
import { saveSupplierAction } from "@/features/products/actions";
import { getSupplierById, listInventoryMovementsByCompany } from "@/lib/store/database";
import { notFound } from "next/navigation";
import Link from "next/link";

type EditSupplierPageProps = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{
    error?: string;
    success?: string;
  }>;
};

export default async function EditSupplierPage({ params, searchParams }: EditSupplierPageProps) {
  const session = await requireSessionContext();
  const { id } = await params;
  const search = await searchParams;
  const supplier = await getSupplierById(session.activeCompany.id, id);

  if (!supplier) {
    notFound();
  }

  const canEdit = canManageCatalog(session.activeRole);
  const movements = await listInventoryMovementsByCompany(session.activeCompany.id);
  const supplierMovements = movements.filter((m) => m.referenceCode === supplier.id).slice(0, 20);

  const cnpjFormatted = supplier.cnpj
    ? `${supplier.cnpj.slice(0, 2)}.${supplier.cnpj.slice(2, 5)}.${supplier.cnpj.slice(5, 8)}/${supplier.cnpj.slice(8, 12)}-${supplier.cnpj.slice(12)}`
    : "-";

  return (
    <div className="stack-lg">
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <Link href="/suppliers" className="link-button" style={{ fontSize: 14 }}>
          &larr; Voltar para listagem
        </Link>
      </div>

      <section className="surface-card section-card">
        <div className="section-header">
          <h2>Editando: {supplier.name}</h2>
          <Link href="/suppliers" className="link-button">
            Cancelar edicao
          </Link>
        </div>

        {search?.error ? <div className="message error" style={{ marginBottom: 16 }}>{search.error}</div> : null}
        {search?.success ? <div className="message success" style={{ marginBottom: 16 }}>{search.success}</div> : null}

        {!canEdit ? (
          <div className="message error">Seu perfil nao pode alterar fornecedores nesta empresa.</div>
        ) : (
          <>
            <form action={saveSupplierAction} className="field-grid">
              <input type="hidden" name="id" value={supplier.id} />

              <h3 style={{ margin: "16px 0 0", fontSize: 15, fontWeight: 700 }}>Dados principais</h3>
              <div className="field-row two">
                <div className="field">
                  <label htmlFor="name">Nome *</label>
                  <input id="name" name="name" defaultValue={supplier.name} required />
                </div>
                <div className="field">
                  <label htmlFor="cnpj">CNPJ</label>
                  <input id="cnpj" name="cnpj" defaultValue={supplier.cnpj ?? ""} placeholder="Ex: 11.222.333/0001-81" />
                </div>
              </div>

              <h3 style={{ margin: "16px 0 0", fontSize: 15, fontWeight: 700 }}>Contato</h3>
              <div className="field-row three">
                <div className="field">
                  <label htmlFor="contact">Contato</label>
                  <input id="contact" name="contact" defaultValue={supplier.contact ?? ""} />
                </div>
                <div className="field">
                  <label htmlFor="phone">Telefone</label>
                  <input id="phone" name="phone" defaultValue={supplier.phone ?? ""} />
                </div>
                <div className="field">
                  <label htmlFor="email">Email</label>
                  <input id="email" name="email" type="email" defaultValue={supplier.email ?? ""} />
                </div>
              </div>

              <h3 style={{ margin: "16px 0 0", fontSize: 15, fontWeight: 700 }}>Endereco</h3>
              <div className="field">
                <label htmlFor="address">Endereco</label>
                <textarea id="address" name="address" rows={2} defaultValue={supplier.address ?? ""} />
              </div>

              <div className="field">
                <label htmlFor="status">Status *</label>
                <select id="status" name="status" defaultValue={supplier.status}>
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="INACTIVE">INACTIVE</option>
                </select>
              </div>

              <button type="submit" className="button primary">
                Salvar alteracoes
              </button>
            </form>
          </>
        )}
      </section>

      {/* Historico de Compras */}
      <section className="surface-card section-card">
        <div className="section-header">
          <h2>Historico de compras</h2>
          <span className="muted">{supplierMovements.length} registro(s)</span>
        </div>

        {supplierMovements.length === 0 ? (
          <div className="empty-state">
            Nenhuma movimentacao encontrada para este fornecedor.
            <p className="muted" style={{ marginTop: 8 }}>
              As compras aparecerao aqui quando uma movimentacao for registrada com o ID do fornecedor como referencia.
            </p>
          </div>
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Tipo</th>
                  <th>Produto</th>
                  <th>Qtd</th>
                  <th>Nota</th>
                </tr>
              </thead>
              <tbody>
                {supplierMovements.map((movement) => (
                  <tr key={movement.id}>
                    <td>{new Date(movement.createdAt).toLocaleDateString("pt-BR")}</td>
                    <td>
                      <span className="status-badge">{movement.type}</span>
                    </td>
                    <td>{movement.product.name}</td>
                    <td>{movement.quantity}</td>
                    <td>{movement.note || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
