import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Estoque",
  description: "Sistema web para controle de estoque de pequenas e medias empresas.",
};

type RootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
