import Link from "next/link";
import { canManageCatalog, requireSessionContext } from "@/lib/auth/auth";
import { listInventoryCountsByCompany } from "@/lib/store/database";

type InventoryCountsPageProps = {
  searchParams?: Promise<{
    error?: string;
    success?: string;
  }>;
};

export default async function InventoryCountsPage({ searchParams }: InventoryCountsPageProps) {
  const session = await requireSessionContext();
  const params = await searchParams;
  const counts = await listInventoryCountsByCompany(session.activeCompany.id);
  const canEdit = canManageCatalog(session.activeRole);

  return (
    <div className="stack-lg">
      {params?.error ? <div className="message error" style={{ marginBottom: 16 }}>{params.error}</div> : null}
      {params?.success ? <div className="message success" style={{ marginBottom: 16 }}>{params.success}</div> : null}

      <section className="surface-card section-card">
        <div className="section-header">
          <h2>Inventarios</h2>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <span className="muted">{counts.length} item(ns)</span>
            {canEdit ? (
              <Link href="/inventory-counts/new" className="button primary" style={{ fontSize: 14 }}>
                + Novo inventario
              </Link>
            ) : null}
          </div>
        </div>

        {counts.length === 0 ? (
          <div className="empty-state">
            Nenhum inventario realizado.
            <p className="muted" style={{ marginTop: 8 }}>
              Crie um inventario para contar o estoque e identificar divergencias.
            </p>
          </div>
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Status</th>
                  <th>Data abertura</th>
                  <th>Fechamento</th>
                  <th>Acoes</th>
                </tr>
              </thead>
              <tbody>
                {counts.map((count) => (
                  <tr key={count.id}>
                    <td>{count.name}</td>
                    <td>
                      <span className={`status-badge ${count.status === "CLOSED" ? "" : "bg-warning"}`}>
                        {count.status}
                      </span>
                    </td>
                    <td>{new Date(count.createdAt).toLocaleString("pt-BR")}</td>
                    <td>{count.closedAt ? new Date(count.closedAt).toLocaleString("pt-BR") : "-"}</td>
                    <td>
                      <Link href={`/inventory-counts/${count.id}`} className="link-button">
                        {count.status === "OPEN" ? "Continuar" : "Ver"}
                      </Link>
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
