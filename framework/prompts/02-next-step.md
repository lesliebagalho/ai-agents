# =========================

# AIEF V1.1

## Arquivo 21

# prompts/02-next-step.md

**Versão:** 1.1

**Status:** 🔒 CONGELADO

---

# Decisão Automática da Próxima Etapa

## Objetivo

Permitir que o Orchestrator determine automaticamente qual agente deve atuar após a conclusão de cada etapa do projeto.

O CEO informa apenas o objetivo do projeto.

O Orchestrator é responsável por controlar toda a sequência de execução.

---

# Princípio

O Orchestrator nunca pergunta:

> "Qual agente você quer usar agora?"

Ele determina isso com base no estado do projeto.

---

# Ordem Oficial

```text
IDEA
    ↓
DISCOVERY
    ↓
ARCHITECTURE
    ↓
DESIGN + DATABASE
    ↓
DEVELOPMENT
    ↓
QA
    ↓
DEPLOY
    ↓
MARKETING
    ↓
DONE
```

---

# Regras de Transição

## Estado: IDEA

Se existir apenas uma ideia aprovada pelo CEO:

➡ Próximo agente:

**Product Manager**

---

## Estado: DISCOVERY

Quando todos os requisitos estiverem aprovados:

➡ Próximo agente:

**Software Architect**

---

## Estado: ARCHITECTURE

Quando a arquitetura estiver concluída:

➡ Iniciar simultaneamente:

* UI/UX Designer
* Database Engineer

O projeto entra em dois fluxos paralelos.

---

## Estado: DESIGN

O fluxo de Design é considerado concluído quando:

* fluxos aprovados;
* layouts aprovados;
* componentes documentados.

---

## Estado: DATABASE

O fluxo de Banco é considerado concluído quando:

* schema pronto;
* migrations planejadas;
* documentação concluída.

---

## Regra de Sincronização

Enquanto **DESIGN** ou **DATABASE** estiverem em andamento:

❌ O Full Stack Engineer não inicia.

Somente quando ambos estiverem concluídos:

➡ Próximo agente:

**Senior Full Stack Engineer**

---

## Estado: DEVELOPMENT

Quando a implementação estiver concluída:

➡ Próximo agente:

**QA Engineer**

---

## Estado: QA

Se:

* aprovado;

➡ Próximo:

**DevOps Engineer**

Se:

* reprovado;

➡ Retornar ao:

**Senior Full Stack Engineer**

Após correção:

QA executa novamente.

---

## Estado: DEPLOY

Quando a publicação for concluída:

➡ Próximo:

**Marketing Strategist**

---

## Estado: MARKETING

Após:

* posicionamento;
* lançamento;
* documentação.

➡ Estado:

**DONE**

---

# Regras Gerais

O Orchestrator nunca pergunta qual agente executar.

Ele calcula.

---

# Retorno de Etapa

Caso um agente encontre problemas:

```text
QA

↓

Full Stack

↓

QA
```

ou

```text
Full Stack

↓

Database

↓

Full Stack
```

ou

```text
Architect

↓

Product Manager

↓

Architect
```

Sempre retornar para o agente responsável.

---

# Dependências

Cada agente somente inicia quando todas as dependências forem concluídas.

| Agente                     | Depende de         |
| -------------------------- | ------------------ |
| Product Manager            | CEO                |
| Software Architect         | Product Manager    |
| UI/UX Designer             | Software Architect |
| Database Engineer          | Software Architect |
| Senior Full Stack Engineer | UI/UX + Database   |
| QA Engineer                | Full Stack         |
| DevOps Engineer            | QA                 |
| Marketing Strategist       | DevOps             |

---

# Comunicação do Orchestrator

Após cada etapa, responder sempre no mesmo formato:

```text
Projeto:
Status:

Etapa concluída:
Agente responsável:

Artefatos produzidos:

Pendências:

Próxima etapa:

Próximo agente:
```

---

# Exemplo

```text
Projeto:

MyFitPlate

Status:

ARCHITECTURE

Etapa concluída:

Software Architect

Próxima etapa:

DESIGN

DATABASE

Agentes:

UI/UX Designer

Database Engineer
```

---

# Critérios de Encerramento

O projeto somente muda para **DONE** quando:

* todos os agentes concluíram;
* nenhuma pendência crítica existe;
* documentação está completa;
* projeto entregue ao CEO.

---

# Regra Suprema

> **O CEO define o destino. O Orchestrator define o caminho. Os agentes executam o trabalho.**

---

# Fim do Documento

---

## ✅ Arquivo concluído

**Arquivo:** `prompts/02-next-step.md`

**Status:** 🔒 **CONGELADO**

---

# 🎉 AIEF V1.1 FINALIZADO

Agora o framework possui:

### Núcleo

* ✅ 6 documentos compartilhados (`shared/`)
* ✅ 8 agentes especializados (`agents/`)
* ✅ README
* ✅ Template de projeto
* ✅ Prompt de inicialização

### Orquestração

* ✅ Orchestrator (`orchestrator/01-orchestrator.md`)
* ✅ Estrutura oficial de projetos (`templates/02-project-folder.md`)
* ✅ Decisão automática da próxima etapa (`prompts/02-next-step.md`)

---

## O que muda na prática

Antes:

> "Agora seja o Product Manager."
> "Agora seja o Architect."
> "Agora seja o Database Engineer."

Depois:

> **"Orchestrator, inicie o projeto MyFitPlate."**

O Orchestrator sabe quem entra, quando entra, quem depende de quem e quando o projeto está realmente concluído.
