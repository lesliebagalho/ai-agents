import { canManageUsers, requireSessionContext } from "@/lib/auth/auth";
import { saveUserAction } from "@/features/users/actions";
import { getUserMembershipById } from "@/lib/store/database";
import { notFound } from "next/navigation";
import Link from "next/link";

type EditUserPageProps = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{
    error?: string;
    success?: string;
  }>;
};

export default async function EditUserPage({ params, searchParams }: EditUserPageProps) {
  const session = await requireSessionContext();
  const { id } = await params;
  const search = await searchParams;

  if (!canManageUsers(session.activeRole)) {
    return (
      <section className="surface-card section-card">
        <div className="section-header">
          <h2>Editar usuario</h2>
        </div>
        <div className="message error">Seu perfil nao pode gerenciar usuarios nesta empresa.</div>
      </section>
    );
  }

  const editingUser = await getUserMembershipById(session.activeCompany.id, id);

  if (!editingUser) {
    notFound();
  }

  return (
    <div className="stack-lg">
      <section className="surface-card section-card">
        <div className="section-header">
          <h2>Editando: {editingUser.name}</h2>
          <Link href="/users" className="link-button">
            Cancelar edicao
          </Link>
        </div>

        {search?.error ? <div className="message error" style={{ marginBottom: 16 }}>{search.error}</div> : null}
        {search?.success ? <div className="message success" style={{ marginBottom: 16 }}>{search.success}</div> : null}

        <form action={saveUserAction} className="field-grid">
          <input type="hidden" name="id" value={editingUser.id} />

          <div className="field">
            <label htmlFor="name">Nome *</label>
            <input id="name" name="name" defaultValue={editingUser.name} required />
          </div>

          <div className="field">
            <label htmlFor="email">Email *</label>
            <input id="email" name="email" type="email" defaultValue={editingUser.email} required />
          </div>

          <div className="field">
            <label htmlFor="password">Senha (opcional)</label>
            <input id="password" name="password" type="password" placeholder="Manter atual" />
          </div>

          <div className="field-row two">
            <div className="field">
              <label htmlFor="role">Perfil *</label>
              <select id="role" name="role" defaultValue={editingUser.membership.role}>
                <option value="ADMIN">ADMIN</option>
                <option value="MANAGER">MANAGER</option>
                <option value="OPERATOR">OPERATOR</option>
                <option value="VIEWER">VIEWER</option>
              </select>
            </div>

            <div className="field">
              <label htmlFor="status">Status *</label>
              <select id="status" name="status" defaultValue={editingUser.status}>
                <option value="ACTIVE">ACTIVE</option>
                <option value="INVITED">INVITED</option>
                <option value="INACTIVE">INACTIVE</option>
              </select>
            </div>
          </div>

          <button type="submit" className="button primary">
            Salvar alteracoes
          </button>
        </form>
      </section>
    </div>
  );
}
