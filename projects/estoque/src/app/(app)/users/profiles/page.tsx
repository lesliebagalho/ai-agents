import { requireSessionContext } from "@/lib/auth/auth";

const PROFILES = [
  {
    id: "ADMIN",
    name: "Administrador",
    color: "#c53030",
    bg: "#fed7d7",
    description: "Acesso total ao sistema. Pode gerenciar usuarios, catalogo, movimentacoes, relatorios e configuracoes.",
    permissions: [
      { module: "Dashboard", access: "Visualizar" },
      { module: "Produtos", access: "Criar, Editar, Excluir, Visualizar" },
      { module: "Categorias", access: "Criar, Editar, Excluir, Visualizar" },
      { module: "Marcas", access: "Criar, Editar, Excluir, Visualizar" },
      { module: "Fornecedores", access: "Criar, Editar, Excluir, Visualizar" },
      { module: "Localizacoes", access: "Criar, Editar, Excluir, Visualizar" },
      { module: "Movimentacoes", access: "Registrar entradas, saidas e ajustes" },
      { module: "Saidas", access: "Todos os tipos (venda, consumo, perda, quebra)" },
      { module: "Inventario", access: "Criar, executar e fechar contagens" },
      { module: "Usuarios", access: "Criar, Editar, Excluir, Visualizar" },
      { module: "Relatorios", access: "Todos" },
      { module: "Alertas", access: "Visualizar" },
      { module: "Validade", access: "Visualizar e gerenciar" },
    ],
  },
  {
    id: "SUPERVISOR",
    name: "Supervisor",
    color: "#c05621",
    bg: "#feebc8",
    description: "Supervisiona o estoque. Pode gerenciar catalogo, movimentacoes, inventarios e usuarios, mas sem acesso a exclusoes.",
    permissions: [
      { module: "Dashboard", access: "Visualizar" },
      { module: "Produtos", access: "Criar, Editar, Visualizar" },
      { module: "Categorias", access: "Criar, Editar, Visualizar" },
      { module: "Marcas", access: "Criar, Editar, Visualizar" },
      { module: "Fornecedores", access: "Criar, Editar, Visualizar" },
      { module: "Localizacoes", access: "Criar, Editar, Visualizar" },
      { module: "Movimentacoes", access: "Registrar entradas, saidas e ajustes" },
      { module: "Saidas", access: "Todos os tipos" },
      { module: "Inventario", access: "Criar, executar e fechar contagens" },
      { module: "Usuarios", access: "Visualizar (sem editar)" },
      { module: "Relatorios", access: "Todos" },
      { module: "Alertas", access: "Visualizar" },
      { module: "Validade", access: "Visualizar" },
    ],
  },
  {
    id: "STORAGE_CLERK",
    name: "Almoxarife",
    color: "#2b6cb0",
    bg: "#bee3f8",
    description: "Opera o dia a dia do almoxarifado. Pode registrar movimentacoes, mas nao altera cadastros.",
    permissions: [
      { module: "Dashboard", access: "Visualizar" },
      { module: "Produtos", access: "Visualizar" },
      { module: "Movimentacoes", access: "Registrar entradas e saidas" },
      { module: "Saidas", access: "Tipos: Venda, Consumo interno, Perda" },
      { module: "Inventario", access: "Participar da contagem (visualizar)" },
      { module: "Relatorios", access: "Estoque Atual, Minhas movimentacoes" },
      { module: "Alertas", access: "Visualizar" },
      { module: "Validade", access: "Visualizar" },
    ],
  },
  {
    id: "BUYER",
    name: "Comprador",
    color: "#276749",
    bg: "#c6f6d5",
    description: "Focado em compras e fornecedores. Pode visualizar e sugerir, mas nao registra movimentacoes fisicas.",
    permissions: [
      { module: "Dashboard", access: "Visualizar" },
      { module: "Produtos", access: "Criar, Editar, Visualizar" },
      { module: "Categorias", access: "Visualizar" },
      { module: "Marcas", access: "Visualizar" },
      { module: "Fornecedores", access: "Criar, Editar, Visualizar" },
      { module: "Movimentacoes", access: "Visualizar apenas" },
      { module: "Relatorios", access: "Estoque Atual, Curva ABC, Financeiro" },
      { module: "Alertas", access: "Estoque baixo, Validade" },
      { module: "Validade", access: "Visualizar" },
    ],
  },
  {
    id: "VIEWER",
    name: "Consulta",
    color: "#6b46c1",
    bg: "#e9d8fd",
    description: "Acesso apenas de leitura em todos os modulos. Nao pode criar, editar ou excluir nada.",
    permissions: [
      { module: "Dashboard", access: "Visualizar" },
      { module: "Produtos", access: "Visualizar" },
      { module: "Categorias", access: "Visualizar" },
      { module: "Marcas", access: "Visualizar" },
      { module: "Fornecedores", access: "Visualizar" },
      { module: "Localizacoes", access: "Visualizar" },
      { module: "Movimentacoes", access: "Visualizar" },
      { module: "Inventario", access: "Visualizar" },
      { module: "Relatorios", access: "Visualizar" },
      { module: "Alertas", access: "Visualizar" },
      { module: "Validade", access: "Visualizar" },
    ],
  },
];

export default async function ProfilesPage() {
  const session = await requireSessionContext();

  return (
    <div className="stack-lg">
      <section className="surface-card section-card">
        <div className="section-header">
          <h2>Perfis e Permissoes</h2>
          <span className="muted">{PROFILES.length} perfis</span>
        </div>
        <p className="muted" style={{ fontSize: 13, marginBottom: 20 }}>
          Cada perfil possui um conjunto de permissoes que define o que o usuario pode ver e fazer no sistema.
          O perfil e definido no momento da criacao do usuario e pode ser alterado na edicao.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {PROFILES.map((profile) => {
            const isCurrent = session.activeRole === profile.id;
            return (
              <div
                key={profile.id}
                style={{
                  border: `1px solid ${profile.bg}`,
                  borderRadius: 12,
                  overflow: "hidden",
                  outline: isCurrent ? `2px solid ${profile.color}` : "none",
                }}
              >
                {/* Header */}
                <div
                  style={{
                    background: profile.bg,
                    padding: "12px 16px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div>
                    <strong style={{ fontSize: 16, color: profile.color }}>{profile.name}</strong>
                    {isCurrent && (
                      <span
                        style={{
                          marginLeft: 8,
                          fontSize: 11,
                          background: profile.color,
                          color: "#fff",
                          padding: "2px 8px",
                          borderRadius: 12,
                        }}
                      >
                        Seu perfil atual
                      </span>
                    )}
                    <p style={{ margin: "4px 0 0", fontSize: 13, color: profile.color }}>{profile.description}</p>
                  </div>
                </div>

                {/* Tabela de permissoes */}
                <div style={{ padding: "8px 16px 16px" }}>
                  <table className="data-table" style={{ fontSize: 13 }}>
                    <thead>
                      <tr>
                        <th style={{ width: "40%" }}>Modulo</th>
                        <th>Acesso</th>
                      </tr>
                    </thead>
                    <tbody>
                      {profile.permissions.map((perm) => (
                        <tr key={perm.module}>
                          <td>{perm.module}</td>
                          <td>{perm.access}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
