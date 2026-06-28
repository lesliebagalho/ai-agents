import Link from "next/link";
import { logoutAction } from "@/features/auth/actions";
import { switchCompanyAction } from "@/features/companies/actions";
import { canManageCatalog, canManageUsers, canRegisterMovements, requireSessionContext } from "@/lib/auth/auth";
import SidebarNav from "@/components/SidebarNav";

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
          <span>Operacao multiempresa em validacao</span>
        </div>

        <SidebarNav links={links} />
      </aside>

      <div className="app-main">
        <header className="topbar">
          <div className="topbar-row">
            <div>
              <p className="eyebrow">Empresa ativa</p>
              <h1 style={{ margin: "8px 0 0", fontSize: "24px" }}>{session.activeCompany.name}</h1>
              <p className="muted" style={{ margin: "6px 0 0" }}>
                Perfil atual: {session.activeRole}
              </p>
            </div>

            <div className="topbar-meta">
              <span>{session.user.name}</span>
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
              <form action={switchCompanyAction} className="inline-form">
                <input type="hidden" name="returnTo" value="/dashboard" />
                <div className="field">
                  <label htmlFor="companyId">Empresa</label>
                  <select id="companyId" name="companyId" defaultValue={session.activeCompany.id}>
                    {session.memberships.map((membership) => (
                      <option key={membership.company.id} value={membership.company.id}>
                        {membership.company.name} ({membership.role})
                      </option>
                    ))}
                  </select>
                </div>
                <button type="submit" className="button secondary">
                  Trocar contexto
                </button>
              </form>

              <form action={logoutAction}>
                <button type="submit" className="button secondary">
                  Sair
                </button>
              </form>
            </div>
          </div>
        </header>

        <main className="page-content">{children}</main>
      </div>
    </div>
  );
}
