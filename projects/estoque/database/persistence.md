# Persistence Strategy

## Resumo Executivo

A estrategia recomendada para o projeto Estoque e manter:

- historico imutavel em `InventoryMovement`
- saldo consolidado em `InventoryBalance`

Isso permite rastreabilidade confiavel e leitura rapida nas telas principais.

---

## Estratégia Principal

### Movimentações

Toda entrada, saida ou ajuste gera um registro em `InventoryMovement`.

Esse registro e a trilha oficial do que aconteceu.

### Saldo Consolidado

O saldo atual de cada produto e armazenado em `InventoryBalance`.

Esse saldo deve ser atualizado transacionalmente a cada nova movimentacao valida.

---

## Motivos da Escolha

- historico completo para auditoria;
- leitura rapida de saldo sem agregacao pesada em toda consulta;
- menor custo de processamento para dashboards e listagens;
- base preparada para crescimento do volume de movimentacoes.

---

## Regras Operacionais

- Criacao de movimentacao e atualizacao de saldo devem ocorrer na mesma transacao.
- O saldo nao deve ser alterado diretamente fora do fluxo de movimentacao.
- Ajustes manuais devem sempre gerar movimentacao do tipo `ADJUSTMENT`.
- Reprocessamento de saldo deve ser possivel a partir do historico em cenarios de suporte ou correcoes.

---

## Concorrência

Como o sistema e multiusuario, a persistencia deve considerar concorrencia em operacoes de estoque.

Direcao recomendada:

- transacoes por movimentacao;
- bloqueio logico no saldo do produto;
- validacao de saldo atual dentro da mesma transacao.

---

## Soft Delete

### Aplicar Soft Delete

- `Company`
- `User`
- `Category`
- `Product`

### Não aplicar Soft Delete como fluxo principal

- `InventoryMovement`
- `InventoryBalance`

Movimentacoes devem ser preservadas como historico.

---

## Migrações

Direcao inicial:

- `create_company_and_user_core`
- `create_catalog_entities`
- `create_inventory_entities`

Os nomes finais podem ser ajustados no momento da implementacao real.

---

## Riscos

- regra de estoque negativo ainda nao esta fechada;
- motivo obrigatorio em ajuste ainda nao esta fechado;
- manter SaaS e sistema interno em aberto pode influenciar a estrategia de provisionamento de empresas.
