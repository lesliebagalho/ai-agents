
# Arquitetura do Sistema

## Objetivo

Definir a arquitetura oficial do AI Runner.

Esta arquitetura é a base permanente do sistema.

---

# Princípios

O AI Runner possui apenas uma responsabilidade:

Coordenar a execução do framework AIEF.

Todo componente do sistema possui responsabilidade única.

---

# Arquitetura Geral

```
                   Usuário
                      │
                      ▼
               Interface (Chat/UI)
                      │
                      ▼
               Intent Engine
                      │
                      ▼
                Orchestrator
                      │
          ┌───────────┼───────────┐
          ▼           ▼           ▼
   Context Builder  Project State Agent Executor
          │                         │
          └───────────┬─────────────┘
                      ▼
                 LLM Provider
                      │
                      ▼
               Framework AIEF
                      │
                      ▼
             Projeto (File System)
```

---

# Componentes

## Interface

Responsável pela comunicação com o usuário.

Funções:

* receber comandos;
* exibir respostas;
* mostrar dashboard;
* mostrar histórico.

Nunca executa regras de negócio.

---

## Intent Engine

Responsável por transformar linguagem natural em intenções estruturadas.

Entrada:

"Crie um sistema de estoque."

Saída:

```
Intent:
NEW_PROJECT

Project:
Sistema de Estoque
```

Nunca executa agentes.

---

## Orchestrator

Responsável por coordenar toda a execução.

Funções:

* decidir próximo agente;
* validar dependências;
* atualizar estados;
* controlar fluxo.

Nunca conversa diretamente com o usuário.

Nunca executa IA.

---

## Context Builder

Responsável por montar o contexto necessário para execução de cada agente.

Fontes:

* framework/
* project/
* histórico
* estado atual

Entrega um contexto completo ao Agent Executor.

---

## Agent Executor

Responsável por executar agentes do AIEF.

Funções:

* localizar SOP;
* montar prompt;
* enviar ao LLM;
* receber resposta;
* devolver resultado ao Orchestrator.

---

## Project State

Responsável por manter o estado oficial do projeto.

Controla:

* fase;
* agente atual;
* histórico;
* progresso;
* pendências.

---

## LLM Provider

Camada de abstração.

Permite utilizar:

* ChatGPT
* Codex
* Claude
* Gemini
* DeepSeek

Sem alterar o restante do sistema.

---

## Framework AIEF

Fonte oficial das regras.

Contém:

* agentes;
* SOPs;
* templates;
* prompts;
* ferramentas.

Nunca é modificado pelo Runner.

---

## Projeto

Toda informação do projeto permanece em arquivos.

O sistema de arquivos é a fonte oficial da verdade.

---

# Comunicação

Toda comunicação ocorre apenas entre componentes adjacentes.

Nenhum componente pode acessar outro diretamente ignorando a arquitetura.

---

# Dependências

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

LLM

↓

Orchestrator

↓

Project State

↓

Interface

---

# Regra Suprema

> Nenhum componente deve assumir responsabilidades pertencentes a outro componente.

