import Link from "next/link";

export default function ApiDocsPage() {
  return (
    <div className="stack-lg" style={{ maxWidth: 800, margin: "0 auto" }}>
      <section className="surface-card section-card">
        <div className="section-header">
          <h2>Documentacao da API REST</h2>
          <Link href="/settings?tab=integrations" className="link-button">
            &larr; Voltar para configuracoes
          </Link>
        </div>

        <p className="muted" style={{ fontSize: 14, marginBottom: 20 }}>
          O sistema expoe endpoints REST para integracao com sistemas externos.
          Abaixo estao os endpoints disponiveis atualmente.
        </p>

        <h3 style={{ fontSize: 16, marginBottom: 12 }}>Endpoints</h3>

        <div className="table-wrap">
          <table className="data-table" style={{ fontSize: 13 }}>
            <thead>
              <tr>
                <th style={{ width: 80 }}>Metodo</th>
                <th>Rota</th>
                <th>Descricao</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <span style={{ color: "var(--success, #38a169)", fontWeight: 700 }}>GET</span>
                </td>
                <td>
                  <code>/api/backup/export</code>
                </td>
                <td>Exporta o banco de dados completo em formato JSON (backup)</td>
              </tr>
              <tr>
                <td>
                  <span style={{ color: "var(--primary, #0f766e)", fontWeight: 700 }}>POST</span>
                </td>
                <td>
                  <code>/api/auth/login</code>
                </td>
                <td>Autenticacao de usuario (retorna cookie de sessao)</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 style={{ fontSize: 16, margin: "20px 0 12px" }}>Exemplo de uso</h3>

        <div
          style={{
            background: "#0f172a",
            color: "#e2e8f0",
            padding: 16,
            borderRadius: 8,
            fontSize: 13,
            fontFamily: "monospace",
            overflowX: "auto",
            marginBottom: 12,
          }}
        >
          <div style={{ color: "#94a3b8" }}># Exportar backup</div>
          <div>
            <span style={{ color: "#60a5fa" }}>curl</span> -X GET{" "}
            <span style={{ color: "#34d399" }}>https://estoque.local/api/backup/export</span>{" "}
            -o backup.json
          </div>
          <br />
          <div style={{ color: "#94a3b8" }}># Autenticar</div>
          <div>
            <span style={{ color: "#60a5fa" }}>curl</span> -X POST{" "}
            <span style={{ color: "#34d399" }}>https://estoque.local/api/auth/login</span>{" "}
            \<br />
            &nbsp;&nbsp;-H <span style={{ color: "#fbbf24" }}>&quot;Content-Type: application/json&quot;</span>{" "}
            \<br />
            &nbsp;&nbsp;-d {`'{"email":"ana@estoque.local","password":"123456"}'`}
          </div>
        </div>

        <div
          className="surface-card"
          style={{
            padding: 16,
            background: "var(--surface-alt, #f7fafc)",
            borderRadius: 8,
            marginTop: 16,
          }}
        >
          <p className="muted" style={{ fontSize: 13, margin: 0 }}>
            <strong>Nota:</strong> A API esta em fase inicial. Novos endpoints serao adicionados conforme a necessidade.
            Para requisitar novos endpoints, entre em contato com o suporte.
          </p>
        </div>
      </section>
    </div>
  );
}
