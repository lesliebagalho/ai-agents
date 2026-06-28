import Link from "next/link";
import { canManageUsers, requireSessionContext } from "@/lib/auth/auth";
import { listUsersByCompany } from "@/lib/store/database";

type UsersPageProps = {
  searchParams?: Promise<{
    error?: string;
    success?: string;
  }>;
};

export default async function UsersPage({ searchParams }: UsersPageProps) {
  const session = await requireSessionContext();
  const params = await searchParams;

  if (!canManageUsers(session.activeRole)) {
    return (
      <section className="surface-card section-card">
        <div className="section-header">
          <h2>Usuarios</h2>
        </div>
        <div className="message error">Seu perfil nao pode gerenciar usuarios nesta empresa.</div>
      </section>
    );
  }

  const users = await listUsersByCompany(session.activeCompany.id);

  return (
    <div className="stack-lg">
      {params?.error ? <div className="message error" style={{ marginBottom: 16 }}>{params.error}</div> : null}
      {params?.success ? <div className="message success" style={{ marginBottom: 16 }}>{params.success}</div> : null}

      <section className="surface-card section-card">
        <div className="section-header">
          <h2>Usuarios da empresa</h2>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <span className="muted">{users.length} usuario(s)</span>
            <Link href="/users/new" className="button primary" style={{ fontSize: 14 }}>
              + Novo usuario
            </Link>
          </div>
        </div>

        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Email</th>
                <th>Perfil</th>
                <th>Status</th>
                <th>Acoes</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.membership.role}</td>
                  <td>
                    <span className="status-badge">{user.status}</span>
                  </td>
                  <td>
                    <Link href={`/users/${user.id}`} className="link-button">
                      Editar
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
