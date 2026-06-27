import { loginAction } from "@/features/auth/actions";

type LoginPageProps = {
  searchParams?: Promise<{
    error?: string;
    success?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;

  return (
    <main className="auth-shell">
      <section className="auth-card">
        <p className="eyebrow">AIEF / Sprint 01</p>
        <h1 className="page-title">Entrar no Estoque</h1>
        <p className="page-subtitle">
          Acesse o ambiente inicial do sistema com o usuario demo para validar autenticacao e
          contexto multiempresa.
        </p>

        <form action={loginAction} className="field-grid">
          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              defaultValue="ana@estoque.local"
              placeholder="voce@empresa.com"
              required
            />
          </div>

          <div className="field">
            <label htmlFor="password">Senha</label>
            <input
              id="password"
              name="password"
              type="password"
              defaultValue="123456"
              placeholder="Sua senha"
              required
            />
          </div>

          {params?.error ? <div className="message error">{params.error}</div> : null}
          {params?.success ? <div className="message success">{params.success}</div> : null}

          <button className="button primary full" type="submit">
            Entrar
          </button>
        </form>

        <div style={{ marginTop: "24px" }} className="message success">
          Usuario demo: <strong>ana@estoque.local</strong> / <strong>123456</strong>
        </div>
      </section>
    </main>
  );
}
