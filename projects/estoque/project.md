# Estoque

## Informações Gerais

**Nome do Projeto:** Estoque

**Nome Curto:** estoque

**Status:** DEVELOPMENT

**Responsável:** Senior Full Stack Engineer

---

## Briefing

Entrevista concluida.

## Respostas Coletadas

### Pergunta 1

**Qual é o principal objetivo do sistema?**

Cadastrar e controlar um estoque.

### Pergunta 2

**Qual problema esse sistema resolve no dia a dia da empresa?**

Evitar usar anotações no papel ou usar planilhas.

### Pergunta 3

**Quem vai usar esse sistema no dia a dia?**

Pequenas e médias empresas.

### Pergunta 4

**Como essas empresas fazem esse controle hoje?**

Muitas empresas utilizam planilha em Excel e as de poucos recursos utilizam papel.

### Pergunta 5

**Quais funcionalidades precisam entrar no MVP?**

Neste momento, é desejado um escopo amplo, cobrindo as funcionalidades de um bom sistema de estoque, pois o projeto também está sendo usado para validar o agent.

### Pergunta 6

**Esse sistema será um SaaS, um sistema interno, ou você quer deixar as duas opções abertas?**

Vamos deixar as duas opções abertas.

### Pergunta 7

**Esse sistema precisa ser multiusuário?**

Sim.

### Pergunta 8

**Esse sistema precisa ser multiempresa ou será usado por apenas uma empresa por vez?**

Multiempresa.

### Pergunta 9

**Existe alguma restrição importante para esse projeto, como prazo, orçamento, tecnologia obrigatória ou alguma limitação específica?**

Nao.

---

## Resumo Executivo

O projeto Estoque tem como objetivo cadastrar e controlar estoque, substituindo controles manuais em papel e planilhas.

O sistema sera direcionado a pequenas e medias empresas, com operacao multiusuario e multiempresa.

Neste momento, o escopo funcional desejado e amplo, buscando cobrir as capacidades de um bom sistema de estoque, pois o projeto tambem esta sendo usado para validar o agent.

O modelo do produto permanece em aberto entre SaaS e sistema interno.

Nao existem restricoes relevantes de prazo, orcamento ou tecnologia obrigatoria fora do padrao do framework.

---

## Pontos-Chave para Discovery

- Definir o conjunto exato de funcionalidades do MVP amplo.
- Separar o que e obrigatorio agora do que pode ser fase 2.
- Traduzir "bom sistema de estoque" em requisitos verificaveis.
- Detalhar permissoes multiusuario e isolamento multiempresa.
- Decidir se o produto vai priorizar SaaS, sistema interno ou manter ambos desde a arquitetura inicial.

---

## Descoberta do Produto

### Problema

Pequenas e medias empresas ainda controlam estoque com papel ou planilhas, o que gera retrabalho, perda de historico, baixa confiabilidade do saldo e pouca visibilidade operacional.

### Objetivo

Criar um sistema web de estoque que centralize cadastro, movimentacoes e consulta de saldo, com operacao multiusuario e multiempresa.

### Publico-Alvo

- Pequenas empresas.
- Medias empresas.
- Operacoes que hoje usam controles manuais ou planilhas.

### Proposta de Valor

Dar previsibilidade e organizacao ao controle de estoque sem depender de processos manuais espalhados.

### MVP Definido

Embora o briefing indique um MVP amplo, nesta etapa o MVP e entendido como:

- produto pronto para operar o fluxo essencial de estoque;
- com recursos suficientes para substituir papel e planilhas;
- sem depender inicialmente de integracoes externas.

### Funcionalidades do MVP

#### Essenciais

- Cadastro de produtos.
- Cadastro de categorias.
- Registro de entrada de estoque.
- Registro de saida de estoque.
- Ajuste manual de estoque.
- Consulta de saldo atual.
- Historico de movimentacoes.
- Busca e filtros de produtos.
- Multiusuario.
- Multiempresa.
- Controle basico de perfis e permissoes.

#### Importantes

- Dashboard com indicadores basicos.
- Alertas de estoque baixo.
- Controle de unidades de medida.
- Motivo de ajuste de estoque.
- Auditoria basica por usuario e data.

#### Futuras

- Integracoes externas.
- Importacao de planilhas.
- Leitura de codigo de barras.
- Gestao de multiplos depositos.
- Relatorios avancados.
- Lotes e validade.

### Fora do Escopo Neste Momento

- Integracoes com ERP.
- Automacao fiscal.
- Aplicativo mobile nativo.
- Financeiro completo.
- Compras e vendas completas.

### User Stories Iniciais

- Como operador, quero cadastrar produtos para controlar o estoque da empresa.
- Como operador, quero registrar entradas para manter o saldo atualizado.
- Como operador, quero registrar saidas para refletir consumo, venda ou perda.
- Como gestor, quero consultar o saldo atual para tomar decisoes com mais seguranca.
- Como gestor, quero visualizar o historico de movimentacoes para rastrear alteracoes.
- Como administrador, quero gerenciar usuarios para controlar quem acessa o sistema.
- Como empresa, quero que meus dados fiquem isolados das demais empresas.

### Critérios de Aceite Iniciais

- O sistema deve permitir cadastrar produto com informacoes basicas obrigatorias.
- Toda entrada deve aumentar o saldo do produto correspondente.
- Toda saida deve reduzir o saldo do produto correspondente.
- Toda movimentacao deve gerar historico rastreavel.
- Cada usuario deve acessar apenas dados da empresa a que pertence.
- O sistema deve permitir mais de um usuario por empresa.
- O usuario deve conseguir localizar produtos por busca e filtros basicos.

### Riscos

- Escopo amplo demais comprometer a primeira entrega.
- Falta de definicao de permissoes atrasar arquitetura.
- Regras como estoque negativo, ajuste e auditoria precisarem de refinamento adicional.
- Manter SaaS e sistema interno em aberto pode ampliar decisoes arquiteturais.

### Próximos Passos

- Software Architect deve transformar esta descoberta em arquitetura.
- Database Engineer devera modelar entidades considerando multiempresa e multiusuario.
- UI/UX devera priorizar fluxos de cadastro, movimentacao e consulta.

---

## Próxima Etapa

Senior Full Stack Engineer iniciar a implementacao do MVP com base na arquitetura, banco e design aprovados.
