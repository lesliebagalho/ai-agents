
# Entrega entre Agentes (Agent Handoff)

## Objetivo

Padronizar a forma como um agente entrega seu trabalho ao próximo agente.

Toda transição deve ser clara, completa e rastreável.

O próximo agente nunca deve depender de conhecimento implícito.

---

# Princípios

Toda entrega deve ser:

* completa;
* objetiva;
* documentada;
* rastreável;
* suficiente para continuidade.

---

# Estrutura Obrigatória

Todo handoff deve conter exatamente os seguintes blocos:

```text
Projeto

Etapa concluída

Agente responsável

Objetivo da etapa

Artefatos produzidos

Pendências

Riscos

Próximo agente

Instruções para continuidade
```

---

# Projeto

Informar o nome oficial do projeto.

Exemplo:

```text
Projeto

Estoque
```

---

# Etapa Concluída

Informar a fase encerrada.

Exemplo:

```text
DISCOVERY
```

---

# Agente Responsável

Informar quem realizou a entrega.

Exemplo:

```text
Product Manager
```

---

# Objetivo da Etapa

Descrever em poucas linhas o que foi realizado.

---

# Artefatos Produzidos

Listar todos os documentos ou entregas.

Exemplo:

```text
requirements/functional.md

requirements/non-functional.md

requirements/business-rules.md
```

---

# Pendências

Informar apenas pendências reais.

Caso não existam:

```text
Nenhuma.
```

---

# Riscos

Informar riscos conhecidos.

Exemplo:

* integração externa pendente;
* requisito sujeito a alteração.

---

# Próximo Agente

Informar quem assume o projeto.

Exemplo:

```text
Software Architect
```

---

# Instruções para Continuidade

Explicar objetivamente o que o próximo agente deve fazer.

Exemplo:

```text
Utilizar os requisitos aprovados para definir a arquitetura da solução.
```

---

# Handoff por Agente

## Product Manager

Entrega para:

Software Architect

---

## Software Architect

Entrega para:

* UI/UX Designer
* Database Engineer

---

## UI/UX Designer

Entrega para:

Senior Full Stack Engineer

---

## Database Engineer

Entrega para:

Senior Full Stack Engineer

---

## Senior Full Stack Engineer

Entrega para:

QA Engineer

---

## QA Engineer

Se aprovado:

↓

DevOps Engineer

Se reprovado:

↓

Senior Full Stack Engineer

---

## DevOps Engineer

Entrega para:

Marketing Strategist

---

## Marketing Strategist

Entrega para:

CEO

Projeto concluído.

---

# Critérios para Aceitação

O próximo agente deve conseguir iniciar o trabalho sem solicitar informações adicionais.

Caso contrário, o handoff é considerado incompleto.

---

# Papel do Orchestrator

Antes de alterar a etapa do projeto, o Orchestrator deve verificar:

* documentação entregue;
* artefatos existentes;
* pendências registradas;
* próximo agente definido.

Somente então o estado do projeto pode ser atualizado.

---

# Exemplo Completo

```text
Projeto

Estoque

Etapa Concluída

ARCHITECTURE

Agente

Software Architect

Objetivo

Definir arquitetura da solução.

Artefatos

architecture.md

api.md

Pendências

Nenhuma.

Riscos

Integração futura com ERP.

Próximo Agente

UI/UX Designer

Database Engineer

Instruções

Projetar interface e modelo de dados utilizando a arquitetura aprovada.
```

---

# Regra Suprema

> **Um handoff de qualidade permite que qualquer agente continue o trabalho imediatamente, sem reuniões, sem explicações adicionais e sem perda de contexto.**

---

# Fim do Documento

