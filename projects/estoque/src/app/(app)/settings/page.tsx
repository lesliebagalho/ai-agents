import Link from "next/link";
import { requireSessionContext } from "@/lib/auth/auth";
import { getCompanyById, listProductsByCompany } from "@/lib/store/database";

type SettingsPageProps = {
  searchParams?: Promise<{
    tab?: string;
    success?: string;
    error?: string;
  }>;
};

const TABS = [
  { key: "company", label: "Empresa" },
  { key: "units", label: "Unidades" },
  { key: "currency", label: "Moedas" },
  { key: "numbering", label: "Numeracao" },
  { key: "backup", label: "Backup" },
  { key: "integrations", label: "Integracoes" },
];

export default async function SettingsPage({ searchParams }: SettingsPageProps) {
  const session = await requireSessionContext();
  const params = await searchParams;
  const activeTab = params?.tab || "company";

  const company = await getCompanyById(session.activeCompany.id);

  return (
    <div className="stack-lg">
      {params?.error && <div className="message error">{params.error}</div>}
      {params?.success && <div className="message success">{params.success}</div>}

      <section className="surface-card section-card">
        <div className="section-header">
          <h2>Configuracoes</h2>
          <span className="muted">{session.activeCompany.name}</span>
        </div>

        {/* Abas */}
        <div style={{ display: "flex", gap: 4, marginBottom: 20, flexWrap: "wrap" }}>
          {TABS.map((tab) => (
            <Link
              key={tab.key}
              href={`/settings?tab=${tab.key}`}
              className={`button ${activeTab === tab.key ? "primary" : "secondary"}`}
              style={{ fontSize: 13 }}
            >
              {tab.label}
            </Link>
          ))}
        </div>

        {/* ============ Empresa ============ */}
        {activeTab === "company" && (
          <CompanyTab company={company!} session={session} />
        )}

        {/* ============ Unidades ============ */}
        {activeTab === "units" && <UnitsTab companyId={session.activeCompany.id} />}

        {/* ============ Moedas ============ */}
        {activeTab === "currency" && <CurrencyTab />}

        {/* ============ Numeracao ============ */}
        {activeTab === "numbering" && <NumberingTab />}

        {/* ============ Backup ============ */}
        {activeTab === "backup" && <BackupTab companyId={session.activeCompany.id} />}

        {/* ============ Integracoes ============ */}
        {activeTab === "integrations" && <IntegrationsTab />}
      </section>
    </div>
  );
}

// ============================================================
// TAB: Empresa
// ============================================================
async function CompanyTab({
  company,
  session,
}: {
  company: NonNullable<Awaited<ReturnType<typeof getCompanyById>>>;
  session: { user: { email: string }; activeRole: string };
}) {
  // Formulario separado para edicao futura de dados da empresa
  return (
    <>
      <h3 style={{ fontSize: 15, marginBottom: 12 }}>Dados da empresa</h3>

      <div className="field-grid" style={{ maxWidth: 480 }}>
        <div className="field">
          <label>Nome</label>
          <p className="readonly-field">{company.name}</p>
        </div>
        <div className="field">
          <label>Slug</label>
          <p className="readonly-field">{company.slug}</p>
        </div>
        <div className="field">
          <label>Status</label>
          <p className="readonly-field">
            <span className="status-badge">{company.status}</span>
          </p>
        </div>
        <div className="field">
          <label>ID</label>
          <p className="readonly-field" style={{ fontFamily: "monospace", fontSize: 12 }}>
            {company.id}
          </p>
        </div>
      </div>

      <div
        className="surface-card"
        style={{ padding: 16, background: "var(--surface-alt, #f7fafc)", borderRadius: 8, marginTop: 16 }}
      >
        <p className="muted" style={{ fontSize: 13, margin: 0 }}>
          <strong>Usuario ativo:</strong> {session.user.email} &middot;{" "}
          <strong>Perfil:</strong> {session.activeRole}
        </p>
      </div>
    </>
  );
}

// ============================================================
// TAB: Unidades
// ============================================================
async function UnitsTab({ companyId }: { companyId: string }) {
  const products = await listProductsByCompany(companyId);
  const usedUnits: string[] = [...new Set(products.map((p) => p.unit))];

  const UNIT_LABELS: Record<string, string> = {
    UNIT: "Unidade (UNIT)",
    BOX: "Caixa (BOX)",
    KG: "Quilograma (KG)",
    LITER: "Litro (LITER)",
    METER: "Metro (METER)",
  };

  const UNIT_DESCRIPTIONS: Record<string, string> = {
    UNIT: "Itens contaveis individualmente (pecas, unidades)",
    BOX: "Pacotes, caixas ou conjuntos fechados",
    KG: "Produtos vendidos por peso",
    LITER: "Produtos liquidos ou fluidos",
    METER: "Produtos vendidos por comprimento (tecidos, cabos)",
  };

  return (
    <>
      <h3 style={{ fontSize: 15, marginBottom: 12 }}>Unidades de medida disponiveis</h3>
      <p className="muted" style={{ fontSize: 13, marginBottom: 16 }}>
        O sistema suporta as seguintes unidades. As que ja estao em uso aparecem destacadas.
      </p>

      <div className="dashboard-grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 12 }}>
        {Object.entries(UNIT_LABELS).map(([key, label]) => {
          const inUse = usedUnits.includes(key);
          return (
            <div
              key={key}
              className="stat-card"
              style={{
                padding: "14px 16px",
                borderLeft: `3px solid ${inUse ? "var(--primary, #0f766e)" : "var(--border)"}`,
                opacity: inUse ? 1 : 0.6,
              }}
            >
              <strong style={{ fontSize: 14 }}>{label}</strong>
              <p className="muted" style={{ fontSize: 12, margin: "4px 0 0" }}>
                {UNIT_DESCRIPTIONS[key]}
              </p>
              {inUse && (
                <span
                  style={{
                    display: "inline-block",
                    marginTop: 6,
                    fontSize: 11,
                    background: "var(--primary)",
                    color: "#fff",
                    padding: "2px 8px",
                    borderRadius: 12,
                  }}
                >
                  Em uso
                </span>
              )}
            </div>
          );
        })}
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
          As unidades sao definidas por produto no cadastro. Para adicionar novas unidades, entre em contato com o suporte.
        </p>
      </div>
    </>
  );
}

// ============================================================
// TAB: Moedas
// ============================================================
function CurrencyTab() {
  return (
    <>
      <h3 style={{ fontSize: 15, marginBottom: 12 }}>Configuracao de moeda</h3>

      <div className="field-grid" style={{ maxWidth: 480 }}>
        <div className="field">
          <label>Moeda padrao</label>
          <p className="readonly-field">BRL (R$) - Real Brasileiro</p>
        </div>
        <div className="field">
          <label>Formato de exibicao</label>
          <p className="readonly-field">R$ 1.234,56 (milhar com ponto, decimal com virgula)</p>
        </div>
        <div className="field">
          <label>Simbolo</label>
          <p className="readonly-field">R$</p>
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
          O sistema atualmente suporta apenas BRL (Real). Suporte a multiplas moedas sera implementado em versoes futuras.
        </p>
      </div>
    </>
  );
}

// ============================================================
// TAB: Numeracao
// ============================================================
function NumberingTab() {
  return (
    <>
      <h3 style={{ fontSize: 15, marginBottom: 12 }}>Numeracao automatica</h3>
      <p className="muted" style={{ fontSize: 13, marginBottom: 16 }}>
        O sistema gera numeracoes automaticamente com base nas regras abaixo.
      </p>

      <div className="table-wrap">
        <table className="data-table" style={{ fontSize: 13 }}>
          <thead>
            <tr>
              <th>Documento</th>
              <th>Formato</th>
              <th>Exemplo</th>
              <th>Explicacao</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>SKU</td>
              <td>
                <code>AAA-CCCC-NNN</code>
              </td>
              <td>
                <code>PAP-ALIM-001</code>
              </td>
              <td>3 letras do nome + 4 letras da categoria + 3 numeros aleatorios</td>
            </tr>
            <tr>
              <td>Codigo do produto</td>
              <td>
                <code>Livre</code>
              </td>
              <td>
                <code>PROD-001</code>
              </td>
              <td>Definido manualmente no cadastro do produto</td>
            </tr>
            <tr>
              <td>Codigo de barras</td>
              <td>
                <code>Livre (13-14 digitos)</code>
              </td>
              <td>
                <code>7891234567890</code>
              </td>
              <td>Padrao EAN-13, definido manualmente</td>
            </tr>
            <tr>
              <td>ID interno (produto)</td>
              <td>
                <code>UUID v4</code>
              </td>
              <td>
                <code>a1b2c3d4-...</code>
              </td>
              <td>Gerado automaticamente pelo sistema</td>
            </tr>
            <tr>
              <td>Movimentacao</td>
              <td>
                <code>UUID v4</code>
              </td>
              <td>
                <code>e5f6g7h8-...</code>
              </td>
              <td>Gerado automaticamente a cada registro</td>
            </tr>
          </tbody>
        </table>
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
          A numeracao sequencial personalizada (ex: NF-0001, MOV-2026-0001) estara disponivel em versao futura.
        </p>
      </div>
    </>
  );
}

// ============================================================
// TAB: Backup
// ============================================================
async function BackupTab({ companyId }: { companyId: string }) {
  return (
    <>
      <h3 style={{ fontSize: 15, marginBottom: 12 }}>Backup de dados</h3>
      <p className="muted" style={{ fontSize: 13, marginBottom: 16 }}>
        O sistema atualmente utiliza armazenamento local em arquivo JSON. Abaixo voce pode visualizar informacoes
        sobre os dados e exportar uma copia.
      </p>

      <div className="dashboard-grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", marginBottom: 20 }}>
        <div className="stat-card" style={{ padding: "12px 16px" }}>
          <p className="muted" style={{ fontSize: 11 }}>Tipo de armazenamento</p>
          <strong style={{ fontSize: 16 }}>Arquivo JSON</strong>
        </div>
        <div className="stat-card" style={{ padding: "12px 16px" }}>
          <p className="muted" style={{ fontSize: 11 }}>Localizacao</p>
          <strong style={{ fontSize: 14, wordBreak: "break-all" }}>.data/demo-database.json</strong>
        </div>
      </div>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <a href="/api/backup/export" className="button primary" style={{ fontSize: 14 }} download>
          Exportar backup (.json)
        </a>
        <Link href="/settings?tab=backup" className="button secondary" style={{ fontSize: 14 }}>
          Informar sobre migracao
        </Link>
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
          <strong>Nota:</strong> O sistema atual usa persistencia baseada em arquivo para fins de demonstracao.
          Para producao, recomenda-se migrar para PostgreSQL via Prisma ORM.
          Entre em contato com o suporte para assistencia na migracao.
        </p>
      </div>
    </>
  );
}

// ============================================================
// TAB: Integracoes
// ============================================================
function IntegrationsTab() {
  const integrations = [
    {
      name: "API REST",
      status: "disponivel",
      description: "Integracao via API REST para sistemas externos.",
      docs: "/docs",
    },
    {
      name: "Importacao CSV",
      status: "disponivel",
      description: "Importar produtos em lote via arquivo CSV.",
      docs: "/products/import",
    },
    {
      name: "Exportacao CSV",
      status: "disponivel",
      description: "Exportar produtos para arquivo CSV.",
      docs: "/products/export",
    },
    {
      name: "NF-e (Nota Fiscal)",
      status: "futuro",
      description: "Integracao com SEFAZ para emisso de notas fiscais eletronicas.",
      docs: null,
    },
    {
      name: "API de pagamentos",
      status: "futuro",
      description: "Integracao com gateways de pagamento (Stripe, Mercado Pago, etc).",
      docs: null,
    },
    {
      name: "Shopify / E-commerce",
      status: "futuro",
      description: "Sincronizacao automatica de estoque com lojas online.",
      docs: null,
    },
  ];

  return (
    <>
      <h3 style={{ fontSize: 15, marginBottom: 12 }}>Integracoes disponiveis</h3>
      <p className="muted" style={{ fontSize: 13, marginBottom: 16 }}>
        Integracoes permitem conectar o sistema com outras ferramentas.
      </p>

      <div className="dashboard-grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 }}>
        {integrations.map((integration) => (
          <div
            key={integration.name}
            className="stat-card"
            style={{
              padding: "16px",
              borderLeft: `3px solid ${
                integration.status === "disponivel" ? "var(--success, #38a169)" : "var(--border)"
              }`,
              opacity: integration.status === "futuro" ? 0.6 : 1,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <strong style={{ fontSize: 14 }}>{integration.name}</strong>
              <span
                style={{
                  fontSize: 10,
                  padding: "2px 8px",
                  borderRadius: 12,
                  background: integration.status === "disponivel" ? "#c6f6d5" : "#e2e8f0",
                  color: integration.status === "disponivel" ? "#276749" : "#718096",
                  fontWeight: 700,
                  textTransform: "uppercase",
                }}
              >
                {integration.status === "disponivel" ? "Ativo" : "Em breve"}
              </span>
            </div>
            <p className="muted" style={{ fontSize: 12, margin: "8px 0 0" }}>
              {integration.description}
            </p>
            {integration.docs && (
              <Link
                href={integration.docs}
                className="link-button"
                style={{ fontSize: 12, marginTop: 8 }}
              >
                Ver mais
              </Link>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
