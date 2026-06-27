# Constraints

## Objetivo

Documentar as restricoes que garantem integridade dos dados do projeto Estoque.

---

## Chaves Primárias

- Todas as tabelas usam `UUID` como chave primaria.

---

## Chaves Únicas

- `Company.slug` deve ser unico.
- `User.email` deve ser unico globalmente.
- `UserCompany(userId, companyId)` deve ser unico.
- `Category(companyId, name)` deve ser unico entre registros ativos da mesma empresa.
- `Product(companyId, sku)` deve ser unico quando `sku` existir.
- `InventoryBalance(productId)` deve ser unico.

---

## Chaves Estrangeiras

- `UserCompany.userId` -> `User.id`
- `UserCompany.companyId` -> `Company.id`
- `Category.companyId` -> `Company.id`
- `Product.companyId` -> `Company.id`
- `Product.categoryId` -> `Category.id`
- `InventoryMovement.companyId` -> `Company.id`
- `InventoryMovement.productId` -> `Product.id`
- `InventoryMovement.performedByUserId` -> `User.id`
- `InventoryBalance.companyId` -> `Company.id`
- `InventoryBalance.productId` -> `Product.id`

---

## Regras de Delete

- `Company`: evitar exclusao fisica.
- `User`: evitar exclusao fisica.
- `Category`: `RESTRICT` quando houver produto ativo relacionado.
- `Product`: `RESTRICT` para exclusao fisica se houver movimentacoes.
- `InventoryMovement`: nunca excluir fisicamente em fluxo comum.
- `InventoryBalance`: pode ser gerenciado junto ao ciclo do produto, mas nao deve ser removido sem controle.

---

## Campos Obrigatórios

### Company

- `name`
- `slug`
- `status`

### User

- `name`
- `email`
- `status`

### UserCompany

- `userId`
- `companyId`
- `role`

### Category

- `companyId`
- `name`

### Product

- `companyId`
- `name`
- `unit`
- `status`

### InventoryMovement

- `companyId`
- `productId`
- `performedByUserId`
- `type`
- `quantity`

### InventoryBalance

- `companyId`
- `productId`
- `currentQuantity`

---

## Checks e Regras Lógicas

- `quantity` em `InventoryMovement` deve ser maior que zero.
- `currentQuantity` em `InventoryBalance` deve ser numerico valido.
- `minimumStock`, quando existir, deve ser maior ou igual a zero.

---

## Pendências

- Regra final para estoque negativo ainda depende de decisão funcional.
- Obrigatoriedade de `reason` em ajustes ainda depende de refinamento.
