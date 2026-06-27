# Stack Oficial

## Objetivo

Definir a stack tecnológica oficial utilizada pelos agentes do AI Engineering Framework (AIEF).

Esta stack representa o padrão recomendado para projetos modernos de SaaS, aplicações web e automações.

Os agentes devem priorizar esta stack. Tecnologias diferentes só podem ser utilizadas quando houver justificativa técnica ou exigência do projeto.

---

# Filosofia da Stack

A stack foi escolhida com base em cinco princípios:

* Simplicidade
* Produtividade
* Escalabilidade
* Baixo custo operacional
* Ecossistema consolidado

---

# Front-end

## Framework

* Next.js (App Router)

### Motivos

* Server Components
* SEO
* Performance
* Escalabilidade
* Ecossistema React
* Excelente integração com Vercel

---

## Linguagem

* TypeScript

### Regras

Obrigatório.

Não utilizar JavaScript em novos projetos.

---

## Biblioteca de Interface

* React

---

## Estilização

* Tailwind CSS

### Preferências

* Mobile First
* Utility First
* Componentização

Evitar CSS global desnecessário.

---

## Componentes

Priorizar componentes reutilizáveis.

Evitar duplicação.

---

# Backend

## Framework

O próprio Next.js sempre que possível.

Criar backend separado apenas quando houver necessidade técnica.

---

## APIs

Priorizar:

* Route Handlers
* Server Actions

Evitar APIs desnecessárias.

---

# Banco de Dados

## Oficial

PostgreSQL

---

## ORM

Prisma ORM

### Obrigatório

* Schema organizado
* Migrations versionadas
* Tipagem automática

---

# Hospedagem

## Front-end

Vercel

---

## Banco de Dados

Railway

---

## Backend

Railway

---

# Gerenciamento de Estado

Prioridade:

1. React State
2. Context API
3. Zustand

Evitar Redux, salvo necessidade comprovada.

---

# Validação

* Zod

Toda entrada de dados deve ser validada.

---

# Formulários

* React Hook Form

Integrado ao Zod.

---

# Autenticação

Preferência:

* Auth.js (NextAuth)

Quando necessário.

---

# Upload de Arquivos

Preferência:

* UploadThing

Alternativas apenas mediante justificativa.

---

# Armazenamento

Preferência:

* Cloudflare R2
* Supabase Storage

Conforme necessidade do projeto.

---

# Requisições HTTP

Utilizar:

* fetch nativo

Evitar bibliotecas externas quando não agregarem valor.

---

# Cache

Utilizar recursos nativos do Next.js.

Implementar cache apenas quando houver necessidade.

---

# Testes

Prioridade:

* Vitest
* Playwright

Quando aplicável.

---

# Qualidade

Ferramentas obrigatórias:

* ESLint
* Prettier

---

# Versionamento

Git

Fluxo baseado em branches.

---

# Repositórios

GitHub

---

# CI/CD

GitHub Actions

Sempre que fizer sentido.

---

# Monitoramento

Preferência:

* Sentry

Quando necessário.

---

# Analytics

Preferência:

* Google Analytics
* PostHog

Conforme necessidade.

---

# Documentação

Markdown.

Sempre armazenada no próprio projeto.

---

# Ferramentas de Desenvolvimento

## IDE

Visual Studio Code

---

## IA

Compatível com:

* ChatGPT
* Codex
* Claude Code
* Gemini CLI
* Cursor
* Windsurf
* OpenCode

---

# Estrutura Padrão de Projeto

```text
src/
│
├── app/
├── components/
├── features/
├── hooks/
├── lib/
├── services/
├── types/
├── utils/
├── styles/
├── prisma/
└── middleware.ts
```

---

# Convenções

## Componentes

PascalCase

Exemplo:

```text
UserCard.tsx
```

---

## Hooks

camelCase iniciando por "use"

Exemplo:

```text
useAuth.ts
```

---

## Utilitários

camelCase

Exemplo:

```text
formatDate.ts
```

---

## Tipos

Centralizados na pasta `types`.

---

## Features

Organizadas por domínio de negócio.

---

# Tecnologias Secundárias

Para projetos específicos:

## Mobile

Flutter

---

## Business Intelligence

Power BI

---

## Automação

Power Apps

Power Automate

---

## Escritório

Excel

VBA

Power Query

---

# Tecnologias Não Recomendadas

Evitar sem justificativa:

* Redux
* JQuery
* Bootstrap
* JavaScript puro em novos projetos
* CSS inline
* ORM sem tipagem
* Banco de dados sem migrations

---

# Critérios para Adotar Nova Tecnologia

Uma nova tecnologia somente poderá ser adotada quando:

* Resolver um problema real.
* Possuir comunidade ativa.
* Estar bem documentada.
* Ser compatível com a stack oficial.
* Não aumentar complexidade sem necessidade.

---

# Checklist

Antes de iniciar um projeto, verificar:

* Next.js
* TypeScript
* Tailwind
* PostgreSQL
* Prisma
* Railway
* Vercel
* GitHub
* ESLint
* Prettier
* Zod
* React Hook Form

---

# Resumo da Stack Oficial

| Camada           | Tecnologia                              |
| ---------------- | --------------------------------------- |
| Front-end        | Next.js                                 |
| Linguagem        | TypeScript                              |
| UI               | React                                   |
| CSS              | Tailwind CSS                            |
| Banco            | PostgreSQL                              |
| ORM              | Prisma                                  |
| Backend          | Next.js                                 |
| Hospedagem Front | Vercel                                  |
| Hospedagem Back  | Railway                                 |
| Versionamento    | Git                                     |
| Repositório      | GitHub                                  |
| Validação        | Zod                                     |
| Formulários      | React Hook Form                         |
| Testes           | Vitest + Playwright                     |
| IA               | ChatGPT, Codex, Claude Code, Gemini CLI |

---

