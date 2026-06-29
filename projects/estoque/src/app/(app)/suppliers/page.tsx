import Link from "next/link";
import { canManageCatalog, requireSessionContext } from "@/lib/auth/auth";
import { listSuppliersByCompany } from "@/lib/store/database";

type SuppliersPageProps = {
  searchParams?: Promise<{
    error?: string;
    success?: string;
  }>;
};

export default async function SuppliersPage({ searchParams }: SuppliersPageProps) {
  const session = await requireSessionContext();
  const params = await searchParams;
  const suppliers = await listSuppliersByCompany(session.activeCompany.id);
  const canEdit = canManageCatalog(session.activeRole);

  return (
    <div className="stack-lg">
      {params?.error ? <div className="message error" style={{ marginBottom: 16 }}>{params.error}</div> : null}
      {params?.success ? <div className="message success" style={{ marginBottom: 16 }}>{params.success}</div> : null}

      <section className="surface-card section-card">
        <div className="section-header">
          <h2>Fornecedores</h2>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <span className="muted">{suppliers.length} item(ns)</span>
            {canEdit ? (
              <Link href="/suppliers/new" className="button primary" style={{ fontSize: 14 }}>
                + Novo fornecedor
              </Link>
            ) : null}
          </div>
        </div>

        {suppliers.length === 0 ? (
          <div className="empty-state">Nenhum fornecedor cadastrado.</div>
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>CNPJ</th>
                  <th>Contato</th>
                  <th>Telefone</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Acoes</th>
                </tr>
              </thead>
              <tbody>
                {suppliers.map((supplier) => (
                  <tr key={supplier.id}>
                    <td>{supplier.name}</td>
                    <td style={{ fontFamily: "monospace", fontSize: 13 }}>
                      {supplier.cnpj
                        ? `${supplier.cnpj.slice(0, 2)}.${supplier.cnpj.slice(2, 5)}.${supplier.cnpj.slice(5, 8)}/${supplier.cnpj.slice(8, 12)}-${supplier.cnpj.slice(12)}`
                        : "-"}
                    </td>
                    <td>{supplier.contact || "-"}</td>
                    <td>{supplier.phone || "-"}</td>
                    <td>{supplier.email || "-"}</td>
                    <td>
                      <span className="status-badge">{supplier.status}</span>
                    </td>
                    <td>
                      {canEdit ? (
                        <Link href={`/suppliers/${supplier.id}`} className="link-button">
                          Editar
                        </Link>
                      ) : (
                        <span className="muted">Somente leitura</span>
                      )}
                    </td>
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
