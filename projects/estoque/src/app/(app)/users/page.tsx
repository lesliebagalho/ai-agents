import Link from "next/link";
import { canManageUsers, requireSessionContext } from "@/lib/auth/auth";
import { saveUserAction } from "@/features/users/actions";
import { getUserMembershipById, listUsersByCompany } from "@/lib/store/database";

type UsersPageProps = {
  searchParams?: Promise<{
    edit?: string;
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

  const [users, editingUser] = await Promise.all([
    listUsersByCompany(session.activeCompany.id),
    getUserMembershipById(session.activeCompany.id, params?.edit),
  ]);

  return (
    <div className="content-grid two">
      <section className="surface-card section-card">
        <div className="section-header">
          <h2>Usuarios da empresa</h2>
          <span className="muted">{users.length} usuario(s)</span>
        </div>

        {params?.error ? <div className="message error" style={{ marginBottom: 16 }}>{params.error}</div> : null}
        {params?.success ? <div className="message success" style={{ marginBottom: 16 }}>{params.success}</div> : null}

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
                    <Link href={`/users?edit=${user.id}`} className="link-button">
                      Editar
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="surface-card section-card">
        <div className="section-header">
          <h2>{editingUser ? "Editar usuario" : "Novo usuario"}</h2>
          {editingUser ? (
            <Link href="/users" className="link-button">
              Limpar edicao
            </Link>
          ) : null}
        </div>

        <form action={saveUserAction} className="field-grid">
          <input type="hidden" name="id" value={editingUser?.id ?? ""} />

          <div className="field">
            <label htmlFor="name">Nome</label>
            <input id="name" name="name" defaultValue={editingUser?.name ?? ""} required />
          </div>

          <div className="field">
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" defaultValue={editingUser?.email ?? ""} required />
          </div>

          <div className="field">
            <label htmlFor="password">Senha {editingUser ? "(opcional)" : ""}</label>
            <input id="password" name="password" type="password" placeholder={editingUser ? "Manter atual" : "123456"} />
          </div>

          <div className="field-row two">
            <div className="field">
              <label htmlFor="role">Perfil</label>
              <select id="role" name="role" defaultValue={editingUser?.membership.role ?? "OPERATOR"}>
                <option value="ADMIN">ADMIN</option>
                <option value="MANAGER">MANAGER</option>
                <option value="OPERATOR">OPERATOR</option>
                <option value="VIEWER">VIEWER</option>
              </select>
            </div>

            <div className="field">
              <label htmlFor="status">Status</label>
              <select id="status" name="status" defaultValue={editingUser?.status ?? "ACTIVE"}>
                <option value="ACTIVE">ACTIVE</option>
                <option value="INVITED">INVITED</option>
                <option value="INACTIVE">INACTIVE</option>
              </select>
            </div>
          </div>

          <button type="submit" className="button primary">
            {editingUser ? "Salvar alteracoes" : "Criar usuario"}
          </button>
        </form>
      </section>
    </div>
  );
}
