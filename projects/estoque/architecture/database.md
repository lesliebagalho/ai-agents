# Modelagem Inicial de Dados

## Objetivo

Definir a visao inicial das entidades e relacoes que o Database Engineer deve detalhar.

---

## Entidades Principais

### Company

Representa a empresa dona dos dados.

Campos iniciais:

- id
- name
- slug
- status
- createdAt
- updatedAt

### User

Representa uma pessoa com acesso ao sistema.

Campos iniciais:

- id
- name
- email
- passwordHash ou provider auth
- status
- createdAt
- updatedAt

### UserCompany

Relaciona usuario e empresa, permitindo multiempresa e papel por contexto.

Campos iniciais:

- id
- userId
- companyId
- role
- isActive

### Category

Agrupa produtos por classificacao.

Campos iniciais:

- id
- companyId
- name
- description opcional

### Product

Representa o item controlado em estoque.

Campos iniciais:

- id
- companyId
- categoryId opcional
- name
- sku opcional
- unit
- minimumStock opcional
- isActive
- createdAt
- updatedAt

### InventoryMovement

Representa toda entrada, saida ou ajuste.

Campos iniciais:

- id
- companyId
- productId
- type
- quantity
- reason opcional
- note opcional
- performedByUserId
- createdAt

### InventoryBalance

Representa o saldo consolidado por produto.

Campos iniciais:

- id
- companyId
- productId
- currentQuantity
- updatedAt

---

## Relacionamentos

- `Company 1:N Category`
- `Company 1:N Product`
- `Company 1:N InventoryMovement`
- `Company 1:N UserCompany`
- `User 1:N UserCompany`
- `Product 1:N InventoryMovement`
- `Product 1:1 InventoryBalance`
- `Category 1:N Product`

---

## Regras de Modelagem

- Entidades de negocio devem carregar `companyId`.
- SKU deve ser unico por empresa quando preenchido.
- Saldo deve ser consistente com movimentacoes.
- Exclusao fisica de registros de estoque deve ser evitada; preferir desativacao quando fizer sentido.

---

## Índices Iniciais Sugeridos

- `User.email`
- `Company.slug`
- `Product(companyId, name)`
- `Product(companyId, sku)`
- `InventoryMovement(companyId, productId, createdAt)`
- `InventoryBalance(companyId, productId)`
- `Category(companyId, name)`

---

## Pendências para o Database Engineer

- Definir estrategia final de saldo:
  tabela consolidada + movimentacoes, que e a preferencia inicial.
- Definir enum de tipos de movimentacao.
- Definir enum de papeis de usuario.
- Definir politica para estoque negativo.
- Definir obrigatoriedade de motivo em ajustes.

---

## Direcao Recomendada

Preferir:

- trilha de movimentacao imutavel;
- saldo consolidado por produto para leitura rapida;
- isolamento multiempresa como constraint basica do modelo.
