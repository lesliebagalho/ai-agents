# Arquitetura de API

## Objetivo

Definir a base dos contratos de API e das operacoes servidoras do projeto Estoque.

---

## Estratégia Geral

- Priorizar Server Actions para fluxos de formulario simples.
- Usar Route Handlers para endpoints REST quando houver consumo externo, separacao por modulo ou necessidade clara de contrato HTTP.
- Todas as operacoes devem validar contexto autenticado e empresa ativa.

---

## Convenções

- Prefixo principal: `/api`
- Formato de resposta padrao:
  sucesso com payload claro e erro com mensagem segura
- Toda escrita deve validar sessao, permissao e `companyId`

---

## Módulos de API

### Auth

- `POST /api/auth/sign-in`
- `POST /api/auth/sign-out`
- `GET /api/auth/session`

### Companies

- `GET /api/companies`
- `POST /api/companies`
- `GET /api/companies/:id`
- `PATCH /api/companies/:id`

### Users

- `GET /api/users`
- `POST /api/users`
- `GET /api/users/:id`
- `PATCH /api/users/:id`

### Categories

- `GET /api/categories`
- `POST /api/categories`
- `PATCH /api/categories/:id`

### Products

- `GET /api/products`
- `POST /api/products`
- `GET /api/products/:id`
- `PATCH /api/products/:id`

### Inventory

- `GET /api/inventory/balance`
- `GET /api/inventory/movements`
- `POST /api/inventory/entries`
- `POST /api/inventory/exits`
- `POST /api/inventory/adjustments`

### Reports

- `GET /api/reports/stock-summary`
- `GET /api/reports/low-stock`

---

## Contratos Principais

### Criar Produto

Entrada:

- nome
- sku opcional
- categoria
- unidade de medida
- estoque minimo opcional
- status

Saida:

- produto criado
- `companyId`
- timestamps

### Registrar Entrada

Entrada:

- `productId`
- quantidade
- observacao opcional
- referencia opcional

Saida:

- movimentacao criada
- novo saldo consolidado

### Registrar Saida

Entrada:

- `productId`
- quantidade
- observacao opcional
- referencia opcional

Saida:

- movimentacao criada
- novo saldo consolidado

### Ajuste de Estoque

Entrada:

- `productId`
- quantidade ajustada
- tipo de ajuste
- motivo

Saida:

- movimentacao de ajuste
- saldo atualizado

---

## Regras de API

- Nenhum endpoint pode operar sem empresa ativa.
- Nenhum endpoint pode acessar dados fora do tenant.
- Escritas devem ser auditaveis.
- Erros de validacao devem retornar `400`.
- Falta de autenticacao deve retornar `401`.
- Falta de permissao deve retornar `403`.
- Recurso inexistente deve retornar `404`.

---

## Pendências para Implementação

- Definir estrategia final entre Server Actions e Route Handlers por fluxo.
- Definir detalhe exato dos papeis e permissoes.
- Definir se saldo sera persistido e recalculado ou lido de agregacao em tempo real.
