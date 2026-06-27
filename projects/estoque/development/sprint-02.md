# Sprint 02

## Status

Concluida em nivel de implementacao inicial.

## Objetivo

Entregar o nucleo operacional do estoque: entradas, saidas, ajustes e consulta de saldo.

## Escopo

- Registro de entrada de estoque.
- Registro de saida de estoque.
- Registro de ajuste manual.
- Atualizacao de saldo consolidado.
- Historico de movimentacoes.
- Busca e filtros basicos por produto, categoria e tipo de movimento.

## Entregas Esperadas

- Formularios de movimentacao funcionando.
- Regras de negocio aplicadas no backend.
- Historico rastreavel por usuario, data e tipo.
- Consulta de saldo por produto disponivel.

## Critérios de Conclusão

- Toda movimentacao gera historico.
- Entrada aumenta saldo corretamente.
- Saida reduz saldo corretamente.
- Ajuste registra motivo e saldo resultante.
- Empresa visualiza apenas seus proprios dados.

## Resultado da Implementacao

- Registro de entradas, saidas e ajustes implementado.
- Saldo consolidado por produto implementado.
- Historico de movimentacoes com filtros por produto e tipo implementado.
- Consulta de saldo refletida em dashboard, produtos e movimentacoes.
- Regra de saida sem saldo suficiente bloqueia a operacao.
