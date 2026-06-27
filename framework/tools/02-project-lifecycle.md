
# Ciclo de Vida Oficial dos Projetos

## Objetivo

Definir o ciclo de vida completo de um projeto desenvolvido utilizando o AIEF.

Todo projeto deve seguir obrigatoriamente este fluxo.

---

# Visão Geral

```text
IDEIA
   │
   ▼
ENTREVISTA
   │
   ▼
DESCOBERTA
   │
   ▼
ARQUITETURA
   │
   ▼
DESIGN + BANCO
   │
   ▼
DESENVOLVIMENTO
   │
   ▼
QA
   │
   ▼
DEPLOY
   │
   ▼
MARKETING
   │
   ▼
PRODUÇÃO
   │
   ▼
MANUTENÇÃO
```

---

# Fase 1 — Ideia

## Objetivo

Registrar uma nova oportunidade.

### Entrada

* ideia do CEO.

### Saída

* projeto criado;
* entrevista iniciada.

---

# Fase 2 — Entrevista

## Responsável

Orchestrator

### Objetivo

Coletar todas as informações necessárias.

### Saída

* `README.md`;
* `project.md`;
* resumo executivo;
* MVP definido.

---

# Fase 3 — Descoberta

## Responsável

Product Manager

### Objetivo

Transformar a ideia em requisitos.

### Artefatos

* requisitos funcionais;
* requisitos não funcionais;
* regras de negócio.

---

# Fase 4 — Arquitetura

## Responsável

Software Architect

### Objetivo

Definir a solução técnica.

### Artefatos

* arquitetura;
* APIs;
* módulos;
* integrações.

---

# Fase 5 — Design e Banco

## Responsáveis

* UI/UX Designer
* Database Engineer

### Objetivo

Projetar interface e modelo de dados.

### Artefatos

#### UI

* wireframes;
* layouts;
* componentes.

#### Banco

* entidades;
* relacionamentos;
* schema.

---

# Fase 6 — Desenvolvimento

## Responsável

Senior Full Stack Engineer

### Objetivo

Implementar a solução.

### Artefatos

* código;
* componentes;
* APIs;
* migrations;
* documentação técnica.

---

# Fase 7 — QA

## Responsável

QA Engineer

### Objetivo

Validar a qualidade.

### Artefatos

* plano de testes;
* bugs;
* homologação.

---

# Fase 8 — Deploy

## Responsável

DevOps Engineer

### Objetivo

Publicar a solução.

### Artefatos

* infraestrutura;
* ambientes;
* release notes.

---

# Fase 9 — Marketing

## Responsável

Marketing Strategist

### Objetivo

Preparar o lançamento.

### Artefatos

* posicionamento;
* landing page;
* plano de conteúdo;
* GTM.

---

# Fase 10 — Produção

Projeto disponível para usuários.

O Orchestrator altera o status para:

```text
PRODUCTION
```

---

# Fase 11 — Manutenção

Toda nova solicitação inicia um novo ciclo.

Exemplo:

```text
Nova funcionalidade

↓

DISCOVERY

↓

ARCHITECTURE

↓

DEVELOPMENT

↓

QA

↓

DEPLOY

↓

PRODUCTION
```

O projeto permanece o mesmo.

O ciclo reinicia apenas para a nova demanda.

---

# Fluxos Especiais

## Correção de Bug

```text
Bug

↓

QA

↓

Full Stack

↓

QA

↓

Deploy
```

---

## Mudança de Requisito

```text
CEO

↓

Product Manager

↓

Architect

↓

Implementação
```

---

## Mudança de Banco

```text
Database

↓

Full Stack

↓

QA
```

---

# Critérios de Conclusão

Uma fase somente termina quando:

* documentação concluída;
* artefatos entregues;
* pendências resolvidas;
* próximo agente definido.

---

# Responsabilidade do Orchestrator

Durante todo o ciclo de vida ele deve:

* controlar estados;
* validar dependências;
* registrar histórico;
* direcionar agentes;
* impedir quebra do fluxo.

---

# Regra Suprema

> **Todo projeto percorre o mesmo ciclo de vida. O que muda é o conteúdo produzido em cada fase, nunca o processo.**

---

# Fim do Documento

