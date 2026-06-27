# Response Format

## Objetivo

Definir o formato oficial de resposta utilizado pelos agentes do AI Engineering Framework (AIEF).

Este padrão garante que todas as respostas sejam consistentes, previsíveis e fáceis de consumir por outros agentes ou pelo CEO.

Todos os agentes devem seguir este documento.

---

# Filosofia

Uma boa resposta deve responder cinco perguntas:

1. O que foi entendido?
2. O que será feito?
3. Como será feito?
4. Qual foi o resultado?
5. O que acontece depois?

---

# Estrutura Obrigatória

Toda resposta técnica deve seguir a ordem abaixo.

## 1. Resumo

Explicar em poucas linhas o objetivo da tarefa.

---

## 2. Contexto

Descrever o cenário e as informações relevantes.

---

## 3. Análise

Explicar as decisões tomadas.

Identificar:

* riscos
* impactos
* dependências

---

## 4. Plano

Apresentar as etapas que serão executadas.

---

## 5. Execução

Descrever o que foi implementado.

Sempre citar:

* arquivos
* componentes
* APIs
* banco
* infraestrutura

quando aplicável.

---

## 6. Validação

Informar como verificar que a solução está correta.

---

## 7. Próximos Passos

Listar as próximas ações recomendadas.

---

# Formato para Desenvolvimento

Sempre responder utilizando a seguinte estrutura.

```text
Resumo

Contexto

Análise

Plano

Execução

Validação

Próximos Passos
```

---

# Formato para Revisão de Código

```text
Resumo

Pontos Positivos

Problemas Encontrados

Impacto

Sugestões

Resultado
```

---

# Formato para Arquitetura

```text
Objetivo

Requisitos

Arquitetura

Fluxo

Tecnologias

Justificativas

Riscos

Resultado
```

---

# Formato para Correção de Bugs

```text
Problema

Causa

Impacto

Correção

Validação

Resultado
```

---

# Formato para QA

```text
Escopo

Cenários Testados

Resultados

Falhas

Riscos

Aprovação
```

---

# Formato para Product Manager

```text
Problema

Objetivo

Público

MVP

Funcionalidades

Critérios de Aceite

Backlog
```

---

# Formato para Software Architect

```text
Objetivo

Arquitetura

Estrutura

Fluxo

Banco

APIs

Tecnologias

Riscos
```

---

# Formato para Database Engineer

```text
Modelo

Entidades

Relacionamentos

Schema

Migrações

Índices

Validação
```

---

# Formato para DevOps

```text
Infraestrutura

Pipeline

Deploy

Variáveis

Monitoramento

Resultado
```

---

# Formato para Marketing

```text
Objetivo

Público

Mensagem

Canais

Plano

Métricas
```

---

# Regras de Escrita

As respostas devem ser:

* objetivas
* completas
* organizadas
* técnicas quando necessário
* fáceis de ler

---

# O que Evitar

Nunca:

* responder de forma vaga;
* esconder limitações;
* assumir informações não fornecidas;
* repetir conteúdo desnecessariamente;
* misturar assuntos sem relação.

---

# Uso de Tabelas

Utilizar tabelas quando:

* comparar tecnologias;
* apresentar decisões;
* resumir informações;
* listar vantagens e desvantagens.

---

# Uso de Listas

Utilizar listas para:

* checklists;
* etapas;
* requisitos;
* dependências;
* riscos.

---

# Uso de Código

Quando necessário:

* fornecer exemplos mínimos;
* destacar apenas o trecho relevante;
* evitar código repetitivo.

---

# Comunicação entre Agentes

Quando uma resposta será utilizada por outro agente, ela deve terminar com:

## Entrega

Resumo dos artefatos produzidos.

---

## Pendências

O que ainda precisa ser feito.

---

## Próximo Agente

Quem continuará o trabalho.

---

# Comunicação com o CEO

Ao responder diretamente ao CEO:

* informar decisões;
* justificar escolhas importantes;
* destacar riscos;
* apresentar recomendações quando necessário.

---

# Níveis de Detalhamento

## Baixo

Perguntas simples.

Resposta curta.

---

## Médio

Tarefas comuns.

Resposta estruturada.

---

## Alto

Projetos.

Arquitetura.

Planejamento.

Documentação completa.

---

# Checklist

Antes de enviar uma resposta verificar:

* Estrutura seguida.
* Linguagem clara.
* Objetivo atendido.
* Próximos passos definidos.
* Sem ambiguidades.
* Sem informações inventadas.

---

# Regra Final

**A resposta deve permitir que outro agente continue o trabalho sem precisar pedir esclarecimentos adicionais.**

Esse é o principal critério de qualidade da comunicação dentro do AIEF.

---
