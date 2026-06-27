# UI

## Resumo Executivo

A interface do projeto Estoque deve priorizar produtividade, clareza operacional e leitura rápida.

O sistema sera usado com frequencia por usuarios recorrentes, entao a experiencia deve reduzir cliques, facilitar busca e deixar o estado do estoque visivel sem esforço.

---

## Direção de Interface

- Estilo: SaaS operacional limpo e direto.
- Foco: tabelas, filtros, formularios eficientes e feedback rapido.
- Tom visual: profissional, confiavel e sem excesso decorativo.
- Prioridade: leitura de dados, lancamento de movimentacoes e consulta de saldo.

---

## Estrutura Principal da Aplicação

### Navegação Primária

- Dashboard
- Produtos
- Movimentações
- Categorias
- Usuários
- Configurações

### Navegação Secundária

- filtros locais por modulo
- acoes contextuais
- breadcrumbs quando houver subniveis

### Contexto Global

Sempre visivel no topo:

- empresa ativa
- usuario autenticado
- pesquisa global de produtos
- acesso rapido para sair ou trocar contexto

---

## Telas Principais

### 1. Login

Objetivo:
permitir acesso rapido e claro ao sistema.

Elementos:

- formulario de autenticacao
- recuperacao de acesso, se existir
- mensagem clara de erro

### 2. Dashboard

Objetivo:
resumir situacao atual do estoque.

Elementos:

- cards com indicadores principais
- lista de produtos com estoque baixo
- resumo de entradas e saidas recentes
- atalho para cadastrar produto e lancar movimentacao

### 3. Lista de Produtos

Objetivo:
consultar, buscar e filtrar produtos rapidamente.

Elementos:

- tabela principal
- busca por nome ou sku
- filtros por categoria e status
- saldo atual por produto
- acao de editar
- acao de movimentar

### 4. Cadastro e Edição de Produto

Objetivo:
permitir criacao e manutencao de produtos.

Campos principais:

- nome
- sku
- categoria
- unidade
- estoque minimo
- status

### 5. Movimentações

Objetivo:
registrar entradas, saidas e ajustes.

Elementos:

- seletor de tipo de movimentacao
- selecao do produto
- quantidade
- motivo e observacao quando aplicavel
- confirmacao com saldo atualizado

### 6. Histórico de Movimentações

Objetivo:
dar rastreabilidade e auditoria operacional.

Elementos:

- tabela com data, usuario, produto, tipo e quantidade
- filtros por periodo, usuario, produto e tipo
- ordenacao por data

### 7. Categorias

Objetivo:
organizar produtos por classificacao.

Elementos:

- lista de categorias
- criar, editar e desativar

### 8. Usuários e Permissões

Objetivo:
gerenciar acesso por empresa.

Elementos:

- lista de usuarios
- papel do usuario
- status de acesso
- acoes de ativar, editar ou desativar

### 9. Configurações

Objetivo:
manter configuracoes basicas da empresa e preferências operacionais.

---

## Wireframes Textuais

### Dashboard

```text
[Topo: empresa ativa | busca | usuario]

[KPI saldo total] [KPI produtos ativos] [KPI estoque baixo] [KPI movimentacoes hoje]

[Acoes rapidas]
- Novo produto
- Nova entrada
- Nova saida
- Novo ajuste

[Tabela: produtos com estoque baixo]

[Tabela: movimentacoes recentes]
```

### Lista de Produtos

```text
[Busca] [Filtro categoria] [Filtro status] [Botao novo produto]

[Tabela]
Produto | SKU | Categoria | Unidade | Saldo | Estoque minimo | Status | Acoes
```

### Lançamento de Movimentação

```text
[Tipo: Entrada | Saida | Ajuste]
[Produto]
[Quantidade]
[Motivo]
[Observacao]
[Botao confirmar]
```

---

## Estados de Interface

### Loading

- skeleton em tabelas e cards
- botao em estado processando

### Vazio

- mensagem clara
- orientacao do que fazer em seguida
- CTA principal

### Erro

- mensagem amigavel
- orientacao curta
- opcao de tentar novamente quando fizer sentido

### Sucesso

- toast ou feedback inline
- refletir imediatamente o novo saldo quando aplicavel

### Desabilitado

- acoes sem permissao ou sem contexto valido

---

## Responsividade

### Desktop

- layout completo com sidebar
- tabelas amplas
- filtros em linha

### Tablet

- reducao de colunas secundarias
- filtros em linha quebrando em duas linhas

### Mobile

- navegacao compacta
- cards no lugar de tabelas extensas quando necessario
- formulários em fluxo vertical
- acoes principais sempre acessiveis

---

## Acessibilidade

- foco visivel
- labels explicitos
- contraste adequado
- feedback nao dependente apenas de cor
- navegacao por teclado nas acoes principais

---

## Observações para Implementação

- Priorizar leitura rapida de estoque e movimentacao.
- A tela de produtos e a tela de movimentacoes sao o centro operacional do sistema.
- O contexto de empresa ativa deve ser sempre evidente.
