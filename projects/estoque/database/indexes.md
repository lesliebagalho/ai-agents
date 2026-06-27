# Indexes

## Objetivo

Documentar os indices recomendados para performance inicial do projeto Estoque.

---

## Índices Obrigatórios

- `User.email`
- `Company.slug`
- `UserCompany(userId, companyId)`
- `Category(companyId, name)`
- `Product(companyId, name)`
- `Product(companyId, sku)`
- `InventoryMovement(companyId, productId, createdAt)`
- `InventoryMovement(companyId, type, createdAt)`
- `InventoryBalance(companyId, productId)`

---

## Motivações

### `User.email`

Suporta autenticacao e busca de usuarios.

### `Company.slug`

Suporta resolucao de tenant ou identificacao publica quando necessario.

### `UserCompany(userId, companyId)`

Garante associacao unica e acelera verificacao de acesso.

### `Category(companyId, name)`

Evita duplicidade logica e acelera listagens por empresa.

### `Product(companyId, name)`

Suporta busca, filtros e listagens por tenant.

### `Product(companyId, sku)`

Suporta consulta rapida por identificador interno.

### `InventoryMovement(companyId, productId, createdAt)`

Suporta historico por produto e ordenacao temporal.

### `InventoryMovement(companyId, type, createdAt)`

Suporta relatorios e filtros por tipo de movimentacao.

### `InventoryBalance(companyId, productId)`

Suporta leitura rapida do saldo consolidado.

---

## Índices Futuros

- `Product(companyId, status)`
- `InventoryMovement(companyId, performedByUserId, createdAt)`
- `Product(companyId, minimumStock)`

Esses indices devem ser adicionados apenas se os acessos reais justificarem.
