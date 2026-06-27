# Migration Template

## Nome da migration

`[descricao-curta-da-migration]`

## Objetivo

Explique por que a migration e necessaria.

## Contexto

Descreva o estado atual do banco e a mudanca desejada.

## Alteracoes propostas

- Criar:
- Alterar:
- Remover:
- Popular dados:

## Schema antes

```sql
-- Opcional: estrutura atual relevante
```

## Schema depois

```sql
-- Opcional: estrutura esperada
```

## Compatibilidade

- A aplicacao atual continua funcionando durante a migration?
- Existe deploy em duas etapas?
- Ha necessidade de backfill?

## Plano de execucao

1. `[Passo 1]`
2. `[Passo 2]`
3. `[Passo 3]`

## Plano de rollback

1. `[Passo 1]`
2. `[Passo 2]`

## Riscos

- Perda de dados:
- Lock de tabela:
- Tempo de execucao:
- Inconsistencia temporaria:

## Validacao

- Conferir estrutura.
- Conferir dados existentes.
- Rodar fluxos impactados.
- Verificar logs apos deploy.
