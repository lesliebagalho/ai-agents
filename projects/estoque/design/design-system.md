# Design System

## Objetivo

Definir os padroes visuais e comportamentais da interface do projeto Estoque.

---

## Princípios

- clareza antes de estilo
- consistencia antes de variacao
- produtividade antes de ornamentacao
- acessibilidade como requisito

---

## Direção Visual

- Interface clara, densa e organizada.
- Base neutra com contraste funcional.
- Cor usada para significado operacional, nao para decoracao.

---

## Tipografia

### Hierarquia

- Titulo de pagina
- Subtitulo ou contexto
- Titulo de secao
- Texto de interface
- Legenda e apoio

### Regras

- textos curtos e objetivos
- numeros com destaque em KPIs
- labels sempre explicitos em formularios

---

## Cores Semânticas

- primaria: acoes principais
- neutra: estrutura, texto e superficies
- sucesso: confirmacoes e estados saudaveis
- alerta: estoque baixo e pontos de atencao
- erro: falhas de validacao ou operacao
- informacao: estados neutros e avisos contextuais

---

## Grid e Espaçamento

- grid consistente com foco em dashboard e tabelas
- espacamento regular entre blocos
- formularios com respiracao suficiente para leitura

Escala sugerida:

- `4`
- `8`
- `12`
- `16`
- `24`
- `32`

---

## Componentes Base

### Botões

- primario
- secundario
- ghost
- destrutivo

Estados:

- default
- hover
- focus
- disabled
- loading

### Inputs

- texto
- busca
- select
- textarea
- campo numerico

Estados:

- default
- focus
- erro
- desabilitado

### Tabelas

- cabecalho fixo quando necessario
- filtros associados
- ordenacao explicita
- paginacao

### Cards

- KPIs
- avisos
- blocos resumidos no dashboard

### Badges

- status de produto
- tipo de movimentacao
- papel do usuario

### Modais

- confirmar acao destrutiva
- editar item rapido

---

## Padrões de Formulário

- campos obrigatorios identificados
- mensagens de erro abaixo do campo
- agrupamento logico de informacoes
- CTA principal unico por formulario

---

## Padrões de Feedback

- toast para sucesso curto
- alerta inline para erro
- skeleton para carregamento
- empty state com orientacao acionavel

---

## Tabelas e Dados

- primeira coluna com o identificador principal
- ultima coluna com acoes
- saldo e quantidades alinhados para leitura rapida
- filtros sempre visiveis quando forem parte central da tarefa

---

## Ícones

Usar icones consistentes para:

- adicionar
- editar
- excluir ou desativar
- entrada
- saida
- ajuste
- busca
- filtro

---

## Responsividade

- manter as acoes principais acima da dobra
- reduzir colunas em telas menores
- transformar blocos muito densos em cards quando necessario

---

## Componentes Críticos do Produto

- tabela de produtos
- tabela de movimentacoes
- formulario de produto
- formulario de movimentacao
- seletor de empresa
- seletor de papel/permissao

---

## Observações para o Full Stack

- Componentes devem nascer reutilizaveis.
- Tabelas e formularios precisam ter estados bem definidos.
- Nao usar textos genericos em erros e vazios.
