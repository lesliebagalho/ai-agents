# Schema de Dados

## Resumo Executivo

O banco do projeto Estoque sera orientado a multiempresa, multiusuario e rastreabilidade de movimentacoes.

A modelagem utiliza entidades centrais de empresa, usuario, associacao usuario-empresa, categoria, produto, movimentacao e saldo consolidado.

---

## Entidades

### Company

Representa a empresa proprietaria dos dados.

Campos:

- `id`
- `name`
- `slug`
- `status`
- `createdAt`
- `updatedAt`
- `deletedAt`

### User

Representa uma pessoa com acesso ao sistema.

Campos:

- `id`
- `name`
- `email`
- `passwordHash`
- `status`
- `createdAt`
- `updatedAt`
- `deletedAt`

### UserCompany

Relaciona usuarios e empresas, permitindo contexto multiempresa e papel por empresa.

Campos:

- `id`
- `userId`
- `companyId`
- `role`
- `isActive`
- `createdAt`
- `updatedAt`

### Category

Agrupa produtos dentro de uma empresa.

Campos:

- `id`
- `companyId`
- `name`
- `description`
- `createdAt`
- `updatedAt`
- `deletedAt`

### Product

Representa o item controlado em estoque.

Campos:

- `id`
- `companyId`
- `categoryId`
- `name`
- `sku`
- `unit`
- `minimumStock`
- `status`
- `createdAt`
- `updatedAt`
- `deletedAt`

### InventoryMovement

Representa qualquer alteracao de estoque.

Campos:

- `id`
- `companyId`
- `productId`
- `performedByUserId`
- `type`
- `quantity`
- `reason`
- `note`
- `referenceCode`
- `createdAt`

### InventoryBalance

Representa o saldo consolidado por produto.

Campos:

- `id`
- `companyId`
- `productId`
- `currentQuantity`
- `updatedAt`

---

## Relacionamentos

- `Company 1:N UserCompany`
- `Company 1:N Category`
- `Company 1:N Product`
- `Company 1:N InventoryMovement`
- `User 1:N UserCompany`
- `User 1:N InventoryMovement`
- `Category 1:N Product`
- `Product 1:N InventoryMovement`
- `Product 1:1 InventoryBalance`

---

## Enums

### CompanyStatus

- `ACTIVE`
- `INACTIVE`

### UserStatus

- `ACTIVE`
- `INVITED`
- `INACTIVE`

### UserRole

- `ADMIN`
- `MANAGER`
- `OPERATOR`
- `VIEWER`

### ProductStatus

- `ACTIVE`
- `INACTIVE`

### MovementType

- `ENTRY`
- `EXIT`
- `ADJUSTMENT`

### UnitType

- `UNIT`
- `BOX`
- `KG`
- `LITER`
- `METER`

---

## Regras Gerais

- Toda entidade de negocio relevante deve carregar `companyId`.
- SKU deve ser unico por empresa quando preenchido.
- Historico de movimentacao deve ser imutavel.
- Saldo consolidado deve refletir a soma operacional das movimentacoes.
- Soft delete deve ser preferido para entidades cadastrais.
