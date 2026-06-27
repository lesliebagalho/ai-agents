
# Runner Flow

## Objetivo

Definir o fluxo oficial de execução do AI Runner.

Este documento descreve como todos os componentes interagem durante a execução de qualquer comando.

---

# Fluxo Geral

```text
Usuário

↓

Interface

↓

Intent Engine

↓

Orchestrator

↓

Context Builder

↓

Agent Executor

↓

LLM Provider

↓

LLM

↓

Agent Executor

↓

Orchestrator

↓

Project State

↓

Interface
```

---

# Etapa 1

## Interface

Recebe uma mensagem.

Exemplo:

> Crie um sistema de estoque.

A Interface nunca interpreta comandos.

Sua única responsabilidade é encaminhar a mensagem ao Intent Engine.

---

# Etapa 2

## Intent Engine

Converte linguagem natural.

Entrada:

> Crie um sistema de estoque.

Saída:

```json
{
    "intent":"NEW_PROJECT",
    "project":"Sistema de Estoque"
}
```

---

# Etapa 3

## Orchestrator

Recebe o comando estruturado.

Exemplo:

```json
{
    "intent":"NEW_PROJECT"
}
```

O Orchestrator identifica:

* estado atual;
* dependências;
* agente responsável.

Neste caso:

CEO Interview.

---

# Etapa 4

## Context Builder

Recebe:

```text
Agente

CEO Interview
```

Seleciona somente os documentos necessários.

Exemplo:

* shared/
* prompts/
* templates/

---

# Etapa 5

## Agent Executor

Recebe:

* agente;
* contexto.

Seleciona o LLM.

Executa.

---

# Etapa 6

## LLM

Executa o agente solicitado.

Retorna:

* resposta;
* documentos;
* pendências.

---

# Etapa 7

## Agent Executor

Valida:

* formato;
* documentos;
* erros.

Retorna ao Orchestrator.

---

# Etapa 8

## Orchestrator

Atualiza:

* estado;
* histórico;
* progresso;
* próximo agente.

---

# Etapa 9

## Interface

Atualiza:

* chat;
* dashboard;
* timeline.

---

# Fluxo de Continuação

Mensagem:

> Continue o projeto Estoque.

Fluxo:

```text
Intent

↓

CONTINUE_PROJECT

↓

Orchestrator

↓

Ler Estado

↓

Selecionar Agente

↓

Executar

↓

Atualizar Projeto
```

---

# Fluxo para Bug

Mensagem:

> Corrigir erro de login.

Fluxo:

```text
Intent

↓

FIX_BUG

↓

Orchestrator

↓

QA

↓

Full Stack

↓

QA

↓

Atualizar Estado
```

---

# Fluxo para Nova Funcionalidade

Mensagem:

> Adicionar código de barras.

Fluxo:

```text
Intent

↓

ADD_FEATURE

↓

Product Manager

↓

Architect

↓

Database

↓

Full Stack

↓

QA

↓

Deploy
```

---

# Falhas

Caso um componente falhe.

O fluxo é interrompido.

O estado do projeto permanece inalterado.

O usuário recebe:

* erro;
* causa;
* ação recomendada.

---

# Comunicação

Nenhum componente pode "pular" outro.

Exemplo:

Interface

❌

LLM

Nunca.

Toda comunicação passa obrigatoriamente pelo fluxo oficial.

---

# Regra Suprema

> Todo comando percorre exatamente o mesmo fluxo. O que muda é apenas a intenção identificada e o agente executado.

---

# Fim do Documento
