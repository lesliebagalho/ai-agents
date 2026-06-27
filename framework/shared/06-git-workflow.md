# Git Workflow

## Objetivo

Definir o fluxo oficial de trabalho e versionamento do AI Engineering Framework (AIEF).

Este documento estabelece como os agentes colaboram, como as tarefas evoluem, como o Git deve ser utilizado e quais informações devem ser transmitidas entre as etapas.

Todos os agentes devem seguir este workflow.

---

# Filosofia

O desenvolvimento é um processo sequencial e colaborativo.

Cada agente deve:

* Executar apenas sua responsabilidade.
* Entregar um resultado estruturado.
* Facilitar o trabalho do próximo agente.
* Nunca pular etapas sem justificativa.

---

# Fluxo Oficial

```text
CEO (Usuário)
        │
        ▼
Product Manager
        │
        ▼
Software Architect
        │
 ┌──────┴──────────┐
 ▼                 ▼
UI/UX        Database Engineer
        │         │
        └────┬────┘
             ▼
Senior Full Stack Engineer
             │
             ▼
QA Engineer
             │
             ▼
DevOps Engineer
             │
             ▼
Marketing Strategist
             │
             ▼
Entrega
```

---

# Regras de Git

## Branches

Usar nomes curtos, descritivos e orientados ao tipo de trabalho:

* `feature/nome-da-feature`
* `bugfix/resumo-do-bug`
* `hotfix/problema-critico`
* `docs/ajuste-documentacao`
* `chore/tarefa-tecnica`

## Commits

Commits devem ser pequenos, coesos e claros.

Formato recomendado:

```text
tipo: descricao curta
```

Tipos recomendados:

* `feat`
* `fix`
* `docs`
* `refactor`
* `test`
* `chore`

## Pull Requests

Toda PR deve informar:

* O que mudou.
* Por que mudou.
* Como foi validado.
* Riscos ou pendências.

---

# Papel do CEO

O CEO é o único responsável por:

* Definir visão.
* Definir prioridades.
* Aprovar mudanças.
* Aprovar entregas.
* Alterar escopo.

Nenhum agente altera essas decisões.

---

# Etapa 1 — Product Manager

## Entrada

Uma ideia.

Exemplo:

```
Quero criar um SaaS para controle de manutenção.
```

## Saída

Documento contendo:

* Objetivo
* Problema
* Público-alvo
* MVP
* Funcionalidades
* Requisitos
* Critérios de aceite
* Backlog inicial

---

# Etapa 2 — Software Architect

## Entrada

Documento do Product Manager.

## Saída

Documento contendo:

* Arquitetura
* Estrutura de pastas
* Fluxo de dados
* APIs
* Banco de dados
* Tecnologias
* Decisões arquiteturais

---

# Etapa 3 — UI/UX Designer

## Entrada

Arquitetura aprovada.

## Saída

* Fluxo das telas
* Wireframes
* Componentes
* Design System
* Experiência do usuário

---

# Etapa 4 — Database Engineer

## Entrada

Arquitetura.

## Saída

* Modelagem
* Entidades
* Relacionamentos
* Prisma Schema
* Estratégia de migração

---

# Etapa 5 — Senior Full Stack Engineer

## Entrada

Arquitetura + UI + Banco.

## Saída

* Implementação
* Componentes
* APIs
* Integrações
* Ajustes técnicos

---

# Etapa 6 — QA Engineer

## Entrada

Aplicação implementada.

## Saída

* Plano de testes
* Bugs encontrados
* Evidências
* Aprovação ou reprovação

---

# Etapa 7 — DevOps Engineer

## Entrada

Aplicação aprovada.

## Saída

* Deploy
* Configuração de ambiente
* Monitoramento
* Pipeline
* Observabilidade

---

# Etapa 8 — Marketing Strategist

## Entrada

Produto pronto.

## Saída

* Landing Page
* Copy
* Estratégia de lançamento
* SEO
* Conteúdo inicial

---

# Fluxo de Comunicação

Todo agente deve comunicar:

## O que recebeu

Resumo da entrada.

---

## O que fez

Resumo da execução.

---

## O que entrega

Resultado produzido.

---

## Riscos

Problemas encontrados.

---

## Pendências

O que ainda depende de outro agente.

---

# Handoff

Toda transição entre agentes deve conter:

## Contexto

Resumo da situação.

---

## Artefatos

Arquivos produzidos.

---

## Decisões

Principais escolhas.

---

## Limitações

Pontos de atenção.

---

## Próxima ação

O que o próximo agente deverá fazer.

---

# Fluxo de Aprovação

```text
CEO

↓

Solicitação

↓

Agente

↓

Entrega

↓

Validação

↓

CEO

↓

Aprovado

↓

Próxima etapa
```

---

# Gestão de Mudanças

Mudanças devem seguir o fluxo:

1. Solicitação.
2. Avaliação.
3. Aprovação.
4. Implementação.
5. Validação.

Mudanças não aprovadas não devem ser executadas.

---

# Gestão de Riscos

Todo agente deve informar quando identificar:

* Limitações técnicas.
* Dependências.
* Riscos de segurança.
* Riscos de performance.
* Riscos de prazo.

---

# Critérios para Prosseguir

Uma etapa só pode iniciar quando:

* A etapa anterior estiver concluída.
* A documentação estiver disponível.
* Não existirem bloqueios.

---

# Fluxo de Correções

Quando houver problemas:

```text
Problema

↓

Identificação

↓

Correção

↓

Nova validação

↓

Aprovação

↓

Continuação
```

Nunca ocultar problemas.

---

# Workflow para Bugs

```text
Bug identificado

↓

Reprodução

↓

Análise

↓

Correção

↓

Validação

↓

Entrega
```

---

# Workflow para Novas Funcionalidades

```text
Ideia

↓

Refinamento

↓

Arquitetura

↓

Implementação

↓

Testes

↓

Deploy
```

---

# Workflow para Refatoração

```text
Problema

↓

Análise

↓

Planejamento

↓

Refatoração

↓

Validação

↓

Entrega
```

---

# Responsabilidade Compartilhada

Todos os agentes devem:

* Produzir entregas completas.
* Facilitar o trabalho seguinte.
* Informar riscos.
* Respeitar limites.
* Seguir os documentos da pasta `shared`.

---

# Regra Final

**Nenhum agente deve iniciar sua etapa sem possuir informações suficientes para executá-la corretamente.**

Quando houver dúvidas, o agente deve solicitar esclarecimentos antes de prosseguir.

---
