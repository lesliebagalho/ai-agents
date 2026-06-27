
# Context Builder

## Objetivo

Montar automaticamente o menor contexto possível para que um agente execute sua tarefa com qualidade.

O Context Builder é responsável por selecionar apenas os documentos realmente necessários para cada execução.

---

# Missão

Reduzir consumo de tokens, tempo de processamento e quantidade de informações desnecessárias enviadas ao LLM.

---

# Responsabilidades

O Context Builder deve:

* identificar o agente;
* identificar a etapa do projeto;
* identificar a tarefa atual;
* selecionar documentos do framework;
* selecionar documentos do projeto;
* organizar o contexto na ordem correta;
* entregar o contexto ao Agent Executor.

---

# Não é responsabilidade

Nunca:

* conversar com o usuário;
* executar agentes;
* alterar documentos;
* decidir fluxo do projeto;
* interpretar intenções.

---

# Entrada

Recebe do Orchestrator:

```json
{
  "agent": "Software Architect",
  "project": "Sistema de Estoque",
  "task": "Definir arquitetura"
}
```

---

# Fontes de Contexto

## Framework

Local:

```text
framework/
```

---

## Projeto

Local:

```text
projects/<nome-do-projeto>/
```

---

## Estado

Project State.

---

## Histórico

Últimos handoffs.

---

# Ordem de Prioridade

Sempre utilizar:

```text
1. Estado atual

2. Projeto

3. SOP do agente

4. Shared

5. Templates (quando necessários)
```

---

# Contexto por Agente

## Product Manager

Enviar:

* project.md
* README.md
* interview
* shared/
* SOP Product Manager

---

## Software Architect

Enviar:

* project.md
* requirements/
* shared/
* SOP Architect

---

## UI/UX

Enviar:

* architecture/
* requirements/
* design-system (quando existir)
* SOP UI

---

## Database

Enviar:

* architecture/
* requirements/
* regras de negócio
* SOP Database

---

## Full Stack

Enviar:

* architecture/
* design/
* database/
* backlog atual
* SOP Full Stack

---

## QA

Enviar:

* código implementado
* requirements
* arquitetura
* SOP QA

---

## DevOps

Enviar:

* infraestrutura
* ambiente
* release
* SOP DevOps

---

## Marketing

Enviar:

* visão do produto
* funcionalidades
* público-alvo
* SOP Marketing

---

# Regras de Seleção

Nunca enviar:

* documentos irrelevantes;
* versões antigas;
* arquivos duplicados;
* histórico completo quando apenas o estado atual for suficiente.

---

# Estratégia

Sempre enviar primeiro:

* contexto mínimo.

Caso o agente solicite mais informações, ampliar gradualmente o contexto.

Nunca iniciar com contexto máximo.

---

# Cache

O Context Builder pode reutilizar documentos já carregados na mesma sessão, evitando leituras repetidas.

---

# Organização do Contexto

O contexto deve ser montado exatamente nesta sequência:

```text
1. Estado Atual

2. Objetivo da Tarefa

3. Projeto

4. Documentação Relacionada

5. Framework Compartilhado

6. SOP do Agente
```

---

# Saída

Entregar ao Agent Executor:

```json
{
  "agent": "Software Architect",
  "context": "...",
  "documents": [
    "project.md",
    "requirements/functional.md",
    "shared/01-principles.md",
    "agents/02-software-architect.md"
  ]
}
```

---

# Benefícios

* redução de tokens;
* maior velocidade;
* respostas mais consistentes;
* menor risco de informações conflitantes.

---

# Regra Suprema

> Um agente deve receber apenas o contexto necessário para executar sua tarefa atual. Informação em excesso é desperdício de tokens e aumenta a probabilidade de respostas inconsistentes.

---

# Fim do Documento
