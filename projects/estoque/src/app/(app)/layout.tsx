import Link from "next/link";
import { logoutAction } from "@/features/auth/actions";
import { canManageCatalog, canManageUsers, canRegisterMovements, requireSessionContext } from "@/lib/auth/auth";
import SidebarNav from "@/components/SidebarNav";
import CompanyInfo from "@/components/CompanyInfo";

type AppLayoutProps = {
  children: import("react").ReactNode;
};

export default async function AppLayout({ children }: AppLayoutProps) {
  const session = await requireSessionContext();
  const links = [
    { href: "/dashboard", label: "Dashboard", visible: true },
    {
      href: "/products",
      label: "Produtos",
      visible: true,
      children: [
        { href: "/products", label: "Listagem", visible: true },
        { href: "/products/new", label: "Novo", visible: canManageCatalog(session.activeRole) },
      ],
    },
    {
      href: "/inventory",
      label: "Movimentacoes",
      visible: true,
      children: [
        { href: "/inventory", label: "Historico", visible: true },
        { href: "/inventory/new", label: "Nova", visible: canRegisterMovements(session.activeRole) },
      ],
    },
    {
      href: "/categories",
      label: "Categorias",
      visible: canManageCatalog(session.activeRole),
      children: [
        { href: "/categories", label: "Listagem", visible: true },
        { href: "/categories/new", label: "Nova", visible: canManageCatalog(session.activeRole) },
      ],
    },
    {
      href: "/users",
      label: "Usuarios",
      visible: canManageUsers(session.activeRole),
      children: [
        { href: "/users", label: "Listagem", visible: true },
        { href: "/users/new", label: "Novo", visible: canManageUsers(session.activeRole) },
      ],
    },
  ];

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <strong>Estoque</strong>
          <span>Sistema de gestao</span>
        </div>

        <CompanyInfo
          name={session.activeCompany.name}
          role={session.activeRole}
        />

        <SidebarNav links={links} />

        <div className="sidebar-divider"></div>

        <form action={logoutAction} style={{ marginTop: "auto" }}>
          <button type="submit" className="sidebar-logout">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Sair
          </button>
        </form>
      </aside>

      <div className="app-main">
        <header className="topbar">
          <div className="topbar-row">
            <div>
              <p className="eyebrow">Ambiente</p>
              <h1 style={{ margin: "8px 0 0", fontSize: "24px" }}>{session.activeCompany.name}</h1>
              <p className="muted" style={{ margin: "6px 0 0" }}>
                {session.user.name} &middot; {session.activeRole}
              </p>
            </div>

            <div className="topbar-meta">
              <span>{session.user.email}</span>
            </div>
          </div>

          <div className="topbar-row">
            <form action="/products" className="inline-form">
              <div className="field">
                <label htmlFor="global-search">Busca global de produtos</label>
                <input id="global-search" name="q" placeholder="Nome ou SKU" />
              </div>
              <button type="submit" className="button secondary">
                Buscar
              </button>
            </form>

            <div className="inline-form">
              {!canRegisterMovements(session.activeRole) ? (
                <div className="message error" style={{ margin: 0 }}>
                  Perfil em leitura.
                </div>
              ) : null}
            </div>
          </div>
        </header>

        <main className="page-content">{children}</main>
      </div>
    </div>
  );
}
