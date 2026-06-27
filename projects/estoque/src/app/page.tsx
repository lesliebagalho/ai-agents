const sections = [
  "Autenticacao e contexto de empresa",
  "Cadastro de categorias e produtos",
  "Entradas, saidas e ajustes de estoque",
  "Historico de movimentacoes e saldo consolidado",
];

export default function HomePage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: "32px",
      }}
    >
      <section
        style={{
          width: "100%",
          maxWidth: "760px",
          background: "#ffffff",
          border: "1px solid #e2e8f0",
          borderRadius: "8px",
          padding: "32px",
        }}
      >
        <p style={{ margin: 0, fontSize: "12px", fontWeight: 700, color: "#475569" }}>
          AIEF / Bootstrap
        </p>
        <h1 style={{ margin: "12px 0 8px", fontSize: "32px" }}>Projeto Estoque</h1>
        <p style={{ margin: 0, lineHeight: 1.6, color: "#334155" }}>
          Base inicial criada para iniciar a implementacao fullstack do MVP seguindo a arquitetura
          definida no framework.
        </p>

        <div style={{ marginTop: "24px" }}>
          <h2 style={{ margin: "0 0 12px", fontSize: "18px" }}>Proximas frentes</h2>
          <ul style={{ margin: 0, paddingLeft: "20px", lineHeight: 1.8, color: "#334155" }}>
            {sections.map((section) => (
              <li key={section}>{section}</li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
