
## Nome

AI Runner

---

## Missão

Executar projetos de software utilizando o framework AIEF de forma automática, organizada e consistente.

---

## Problema

Hoje, mesmo utilizando IA, o usuário precisa:

* decidir qual especialista utilizar;
* repetir contexto diversas vezes;
* controlar o fluxo do projeto manualmente;
* manter documentação sincronizada;
* lembrar qual é a próxima etapa.

Isso gera desperdício de tempo, inconsistências e alto consumo de contexto da IA.

---

## Solução

O AI Runner é uma camada de execução sobre o AIEF.

Ele interpreta a intenção do usuário, coordena automaticamente os agentes, controla o estado do projeto e mantém toda a documentação sincronizada.

O usuário conversa apenas com o Orchestrator.

---

# Objetivo

Permitir que qualquer projeto seja conduzido do início ao fim utilizando um único ponto de interação.

---

# Não é objetivo

O AI Runner não pretende:

* substituir LLMs;
* gerar código por conta própria;
* competir com IDEs;
* substituir Git;
* substituir Jira ou Notion.

Seu papel é coordenar a execução do framework.

---

# Usuário

CEO do projeto.

---

# Fluxo Principal

Usuário

↓

Intent Engine

↓

Orchestrator

↓

Agent Executor

↓

LLM

↓

Framework AIEF

↓

Projeto

---

# Benefícios

* redução de contexto repetido;
* redução de consumo de tokens;
* padronização;
* documentação automática;
* continuidade entre sessões;
* menor dependência de uma IA específica.

---

# Regra Suprema

> O AI Runner nunca toma decisões de negócio. Ele apenas executa o framework AIEF.
