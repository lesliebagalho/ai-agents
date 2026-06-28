import { canManageUsers, requireSessionContext } from "@/lib/auth/auth";
import { saveUserAction } from "@/features/users/actions";

type NewUserPageProps = {
  searchParams?: Promise<{
    error?: string;
    success?: string;
  }>;
};

export default async function NewUserPage({ searchParams }: NewUserPageProps) {
  const session = await requireSessionContext();
  const params = await searchParams;

  if (!canManageUsers(session.activeRole)) {
    return (
      <section className="surface-card section-card">
        <div className="section-header">
          <h2>Novo usuario</h2>
        </div>
        <div className="message error">Seu perfil nao pode gerenciar usuarios nesta empresa.</div>
      </section>
    );
  }

  return (
    <div className="stack-lg">
      <section className="surface-card section-card">
        <div className="section-header">
          <h2>Novo usuario</h2>
        </div>

        {params?.error ? <div className="message error" style={{ marginBottom: 16 }}>{params.error}</div> : null}
        {params?.success ? <div className="message success" style={{ marginBottom: 16 }}>{params.success}</div> : null}

        <form action={saveUserAction} className="field-grid">
          <input type="hidden" name="id" value="" />

          <div className="field">
            <label htmlFor="name">Nome *</label>
            <input id="name" name="name" required placeholder="Ex: Maria Silva" />
          </div>

          <div className="field">
            <label htmlFor="email">Email *</label>
            <input id="email" name="email" type="email" required placeholder="maria@exemplo.com" />
          </div>

          <div className="field">
            <label htmlFor="password">Senha</label>
            <input id="password" name="password" type="password" placeholder="123456" />
          </div>

          <div className="field-row two">
            <div className="field">
              <label htmlFor="role">Perfil *</label>
              <select id="role" name="role" defaultValue="OPERATOR">
                <option value="ADMIN">ADMIN</option>
                <option value="MANAGER">MANAGER</option>
                <option value="OPERATOR">OPERATOR</option>
                <option value="VIEWER">VIEWER</option>
              </select>
            </div>

            <div className="field">
              <label htmlFor="status">Status *</label>
              <select id="status" name="status" defaultValue="ACTIVE">
                <option value="ACTIVE">ACTIVE</option>
                <option value="INVITED">INVITED</option>
                <option value="INACTIVE">INACTIVE</option>
              </select>
            </div>
          </div>

          <button type="submit" className="button primary">
            Criar usuario
          </button>
        </form>
      </section>
    </div>
  );
}
