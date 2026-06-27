# Arquitetura do Sistema

## Resumo Executivo

O projeto Estoque sera uma aplicacao web baseada em Next.js, com frontend e backend no mesmo repositorio, seguindo o padrao fullstack recomendado pelo framework.

A arquitetura prioriza simplicidade, baixo acoplamento e evolucao segura, com suporte nativo a multiusuario e multiempresa desde a primeira versao.

Como o modelo do produto ainda esta em aberto entre SaaS e sistema interno, a arquitetura deve tratar empresa, usuario e permissao como conceitos centrais do dominio, evitando suposicoes que prendam a solucao a um unico formato de operacao.

---

## Objetivo

Definir uma arquitetura tecnica capaz de:

- suportar o fluxo principal de estoque;
- manter isolamento de dados entre empresas;
- suportar multiplos usuarios por empresa;
- permitir evolucao para funcionalidades avancadas;
- manter a base simples o suficiente para uma primeira entrega consistente.

---

## Arquitetura Geral

### Estilo Arquitetural

- Monolito modular.
- Frontend e backend no mesmo projeto.
- API e camada de dominio organizadas por modulos.
- Persistencia centralizada em PostgreSQL via Prisma.

### Motivo da Escolha

- reduz complexidade operacional;
- acelera o desenvolvimento inicial;
- facilita manutencao por time pequeno;
- suporta bem o tamanho atual do produto;
- permite evolucao futura sem reescrever a base.

### Visao Geral dos Blocos

```text
UI Web
    ↓
App Router / Route Handlers / Server Actions
    ↓
Camada de validacao
    ↓
Camada de servicos de dominio
    ↓
Camada de acesso a dados
    ↓
PostgreSQL
```

---

## Stack

- Frontend: Next.js App Router
- Linguagem: TypeScript
- UI: React
- Estilizacao: Tailwind CSS
- Backend: Next.js Route Handlers e Server Actions
- Banco: PostgreSQL
- ORM: Prisma
- Validacao: Zod
- Formularios: React Hook Form
- Autenticacao: Auth.js como preferencia arquitetural

---

## Estrutura do Projeto

```text
src/
├── app/
│   ├── (auth)/
│   ├── dashboard/
│   ├── products/
│   ├── inventory/
│   ├── users/
│   └── settings/
├── components/
├── features/
│   ├── auth/
│   ├── companies/
│   ├── users/
│   ├── products/
│   ├── inventory/
│   └── reports/
├── lib/
│   ├── db/
│   ├── auth/
│   ├── validation/
│   └── utils/
├── services/
├── types/
├── hooks/
└── prisma/
```

### Organização por Responsabilidade

- `app/`: rotas, layouts e composicao da experiencia.
- `features/`: regras e fluxos por dominio.
- `services/`: servicos de aplicacao e casos de uso.
- `lib/db/`: cliente Prisma e utilitarios de persistencia.
- `lib/auth/`: autenticacao, sessao e verificacoes comuns.
- `lib/validation/`: schemas Zod.

---

## Fluxo de Dados

```text
Usuario
    ↓
Tela / formulario
    ↓
Validacao no cliente
    ↓
Server Action ou Route Handler
    ↓
Validacao no servidor
    ↓
Servico de dominio
    ↓
Repositorio / Prisma
    ↓
Banco
    ↓
Resposta
```

### Regra Fundamental

Nenhuma regra de negocio critica deve depender apenas da validacao do cliente.

---

## Modulos Principais

### Auth

Responsavel por login, sessao e vinculo do usuario a uma ou mais empresas.

### Companies

Responsavel por tenant, configuracoes basicas e contexto da empresa ativa.

### Users

Responsavel por usuarios, papeis e permissoes.

### Products

Responsavel por cadastro, categorias, unidade de medida e estado do produto.

### Inventory

Responsavel por entradas, saidas, ajustes e saldo consolidado.

### Reports

Responsavel por consultas, indicadores e historicos, inicialmente em nivel basico.

---

## Estratégias Técnicas

### Autenticacao

- Sessao autenticada por usuario.
- Usuario sempre associado a uma empresa ativa no contexto atual.

### Autorizacao

- Autorizacao por papel.
- Papeis iniciais sugeridos:
  `admin`, `manager`, `operator`, `viewer`

### Multiempresa

- Toda entidade de negocio relevante deve carregar `companyId`.
- Toda consulta deve filtrar por empresa.
- Nenhuma operacao pode acessar dados fora do tenant atual.

### Multiusuario

- Toda acao relevante deve registrar `createdBy` ou `performedBy` quando aplicavel.
- Historico de movimentacao deve ser rastreavel por usuario.

### Validacao

- Zod em todas as entradas de formularios e endpoints.
- Validacao duplicada no servidor para operacoes criticas.

### Logs e Auditoria

- Movimentacoes de estoque devem ter trilha minima de auditoria.
- Ajustes manuais merecem maior rastreabilidade.

### Cache

- Usar recursos nativos do Next.js apenas para consultas de leitura.
- Nao aplicar cache em operacoes de escrita de estoque.

### Erros

- Retornos consistentes.
- Mensagens seguras ao usuario.
- Logs internos com detalhe suficiente para suporte.

---

## Riscos

- Escopo inicial amplo pode pressionar a simplicidade da primeira versao.
- Produto em aberto entre SaaS e sistema interno amplia algumas decisoes de autenticacao e provisionamento.
- Regras ainda pendentes, como estoque negativo e nivel exato de permissao, podem afetar modelagem fina.
- Historico e auditoria mal definidos podem comprometer confiabilidade operacional.

---

## Decisões Arquiteturais

### Monolito modular em vez de microservicos

Motivo:
produto inicial ainda nao justifica distribuicao de servicos.

Impacto:
menor custo operacional e maior velocidade de entrega.

### Multiempresa nativo desde a base

Motivo:
o requisito ja esta confirmado no discovery.

Impacto:
modelagem, filtros e autorizacao precisam nascer corretos.

### Backend no proprio Next.js

Motivo:
aderencia a stack padrao e menor complexidade inicial.

Impacto:
mais rapidez para implementar, testar e evoluir.

### Dominio separado da interface

Motivo:
evitar regra de estoque espalhada em componentes.

Impacto:
melhor testabilidade e manutencao.

---

## Entrega para os Próximos Agentes

### UI/UX Designer

- Priorizar dashboard, produtos e movimentacoes.
- Considerar fluxos de troca de empresa e permissao.

### Database Engineer

- Modelar empresa, usuario, papel, produto, categoria, movimentacao e saldo.
- Garantir isolamento multiempresa.

### Senior Full Stack Engineer

- Implementar modulos em torno de `products`, `inventory`, `users` e `companies`.
- Concentrar regra de negocio em servicos de dominio.
