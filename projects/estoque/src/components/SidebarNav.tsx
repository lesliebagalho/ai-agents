"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

type NavItem = {
  href: string;
  label: string;
  visible: boolean;
  children?: { href: string; label: string; visible: boolean }[];
};

export default function SidebarNav({ links }: { links: NavItem[] }) {
  const pathname = usePathname();

  const visibleLinks = links.filter((link) => link.visible);

  // Determinar quais menus iniciar abertos baseado na rota atual
  const initialOpenState = () => {
    const open: Record<string, boolean> = {};
    for (const link of visibleLinks) {
      if (link.children) {
        const anyChildActive = link.children.some(
          (child) => pathname === child.href || pathname.startsWith(child.href + "/")
        );
        if (anyChildActive) open[link.href] = true;
      }
    }
    return open;
  };

  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>(initialOpenState);

  const toggleMenu = (href: string) => {
    setOpenMenus((prev) => ({ ...prev, [href]: !prev[href] }));
  };

  // Retorna true se a rota atual corresponde exatamente ao href
  const isExactMatch = (href: string) => pathname === href;

  // Retorna true se a rota atual é um filho (ex: /products/abc-123 é filho de /products)
  const isDescendant = (href: string) => pathname.startsWith(href + "/") || pathname === href;

  // Verifica se algum filho está ativo (match exato ou descendente)
  const hasActiveChild = (children: { href: string }[]) => {
    return children.some((child) => isDescendant(child.href) && child.href !== "/products");
  };

  // Verifica qual child específico está ativo
  const isChildActive = (childHref: string) => {
    // Para "Listagem" (/products), ativa também para /products/[id]
    if (childHref === "/products") {
      return pathname === "/products" || (pathname.startsWith("/products/") && !pathname.startsWith("/products/new"));
    }
    // Para outros filhos, match exato
    return isExactMatch(childHref);
  };

  return (
    <nav className="nav-list">
      {visibleLinks.map((link) => {
        if (link.children) {
          const anyChildActive = hasActiveChild(link.children);
          const isOpen = openMenus[link.href] ?? anyChildActive;

          return (
            <div key={link.href} className="nav-group">
              <button
                className={`nav-link nav-accordion ${anyChildActive ? "active" : ""}`}
                onClick={() => toggleMenu(link.href)}
                aria-expanded={isOpen}
              >
                <span>{link.label}</span>
                <svg
                  className={`accordion-chevron ${isOpen ? "open" : ""}`}
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>

              {isOpen && (
                <div className="nav-children">
                  {link.children
                    .filter((child) => child.visible)
                    .map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={`nav-link nav-child ${isChildActive(child.href) ? "active" : ""}`}
                      >
                        {child.label}
                      </Link>
                    ))}
                </div>
              )}
            </div>
          );
        }

        return (
          <Link
            key={link.href}
            href={link.href}
            className={`nav-link ${isDescendant(link.href) ? "active" : ""}`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
