# Fluxos de Usuário

## Objetivo

Documentar os fluxos principais para que a experiencia do projeto Estoque seja previsivel e implementavel.

---

## Fluxo 1: Login e Entrada no Sistema

### Objetivo

Permitir que o usuario entre no sistema e acesse a empresa correta.

### Fluxo

```text
Login
    ↓
Validacao de credenciais
    ↓
Sessao criada
    ↓
Selecao ou confirmacao da empresa ativa
    ↓
Dashboard
```

### Estados

- erro de credencial
- usuario sem empresa associada
- sessao expirada

---

## Fluxo 2: Cadastro de Produto

### Objetivo

Permitir criacao rapida de produtos.

### Fluxo

```text
Produtos
    ↓
Novo produto
    ↓
Preencher formulario
    ↓
Validar dados
    ↓
Salvar
    ↓
Produto criado
    ↓
Retorno para lista ou pagina do produto
```

### Pontos de Atenção

- nome obrigatorio
- unidade obrigatoria
- categoria recomendada
- sku opcional, mas unico quando preenchido

---

## Fluxo 3: Entrada de Estoque

### Objetivo

Registrar recebimento ou reposicao de produto.

### Fluxo

```text
Movimentacoes
    ↓
Nova entrada
    ↓
Selecionar produto
    ↓
Informar quantidade
    ↓
Informar observacao ou referencia
    ↓
Confirmar
    ↓
Saldo atualizado
```

### Resultado Esperado

- movimentacao registrada
- historico atualizado
- saldo refletido imediatamente

---

## Fluxo 4: Saída de Estoque

### Objetivo

Registrar consumo, venda ou baixa de produto.

### Fluxo

```text
Movimentacoes
    ↓
Nova saida
    ↓
Selecionar produto
    ↓
Informar quantidade
    ↓
Informar observacao ou referencia
    ↓
Confirmar
    ↓
Saldo atualizado
```

### Pontos de Atenção

- comportamento em caso de saldo insuficiente ainda depende de regra final

---

## Fluxo 5: Ajuste Manual

### Objetivo

Corrigir diferencas de estoque com rastreabilidade.

### Fluxo

```text
Movimentacoes
    ↓
Novo ajuste
    ↓
Selecionar produto
    ↓
Informar quantidade ajustada
    ↓
Informar motivo
    ↓
Confirmar
    ↓
Historico e saldo atualizados
```

### Observação

O campo motivo deve receber destaque, pois tende a ser importante para auditoria.

---

## Fluxo 6: Consulta de Saldo

### Objetivo

Permitir visualizacao rapida da disponibilidade dos produtos.

### Fluxo

```text
Produtos
    ↓
Buscar ou filtrar
    ↓
Visualizar saldo
    ↓
Abrir detalhes, se necessario
```

---

## Fluxo 7: Histórico de Movimentações

### Objetivo

Permitir rastrear o que mudou, quando mudou e quem executou.

### Fluxo

```text
Movimentacoes
    ↓
Aplicar filtros
    ↓
Visualizar linhas do historico
    ↓
Inspecionar registro
```

### Filtros Principais

- periodo
- produto
- tipo de movimentacao
- usuario

---

## Fluxo 8: Gestão de Usuários

### Objetivo

Permitir que a empresa controle acessos.

### Fluxo

```text
Usuarios
    ↓
Novo usuario ou editar usuario
    ↓
Definir papel
    ↓
Associar empresa
    ↓
Salvar
    ↓
Usuario atualizado
```

---

## Fluxo 9: Troca de Empresa

### Objetivo

Permitir navegacao segura entre empresas quando o usuario tiver mais de um contexto.

### Fluxo

```text
Empresa ativa no topo
    ↓
Selecionar outra empresa
    ↓
Atualizar contexto
    ↓
Recarregar dados do tenant selecionado
```

### Regra de UX

A empresa ativa deve estar sempre visivel.

---

## Estados Globais

### Vazio

- sem produtos
- sem movimentacoes
- sem usuarios adicionais

### Erro

- falha ao salvar
- falha ao carregar tabela
- falta de permissao

### Sucesso

- produto criado
- movimentacao registrada
- usuario atualizado

### Carregando

- tabelas
- dashboards
- formularios em envio

---

## Prioridade para Implementação

### Fase 1

- login
- dashboard
- produtos
- entrada
- saida
- ajuste
- historico

### Fase 2

- usuarios e permissoes
- categorias
- configuracoes

### Fase 3

- alertas
- indicadores avancados
- recursos futuros
