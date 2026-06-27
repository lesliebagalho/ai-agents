
# Referência Oficial de Comandos

## Objetivo

Definir todos os comandos oficiais aceitos pelo Orchestrator.

O objetivo é que o CEO possa operar toda a equipe utilizando uma linguagem simples e consistente.

---

# Princípios

Os comandos devem ser:

* curtos;
* claros;
* previsíveis;
* orientados a ações.

Não é necessário memorizar nomes de agentes.

O Orchestrator identifica automaticamente quem deve atuar.

---

# Projetos

## Criar Projeto

```text
Inicie o projeto <nome>.
```

Exemplo:

```text
Inicie o projeto Estoque.
```

---

## Continuar Projeto

```text
Continue o projeto <nome>.
```

---

## Pausar Projeto

```text
Pause o projeto <nome>.
```

---

## Retomar Projeto

```text
Retome o projeto <nome>.
```

---

## Cancelar Projeto

```text
Cancele o projeto <nome>.
```

---

## Finalizar Projeto

```text
Finalize o projeto <nome>.
```

---

## Status

```text
Status do projeto <nome>.
```

---

# Desenvolvimento

## Criar Funcionalidade

```text
Adicione a funcionalidade <nome>.
```

---

## Alterar Funcionalidade

```text
Altere a funcionalidade <nome>.
```

---

## Remover Funcionalidade

```text
Remova a funcionalidade <nome>.
```

---

## Corrigir Defeito

```text
Corrija o problema <descrição>.
```

---

## Revisar Implementação

```text
Revise a implementação.
```

O Orchestrator encaminha automaticamente ao agente responsável.

---

# Documentação

## Gerar Documentação

```text
Gere a documentação do projeto.
```

---

## Atualizar Documentação

```text
Atualize a documentação.
```

---

## Exportar Projeto

```text
Exporte a documentação do projeto.
```

---

# Arquitetura

## Revisar Arquitetura

```text
Revise a arquitetura.
```

---

## Atualizar Banco

```text
Atualize o banco de dados.
```

---

## Revisar APIs

```text
Revise as APIs.
```

---

# Qualidade

## Executar QA

```text
Execute QA.
```

---

## Executar Regressão

```text
Execute regressão.
```

---

## Homologar

```text
Homologue a versão.
```

---

# Deploy

## Publicar

```text
Publique o projeto.
```

---

## Gerar Release

```text
Gere as release notes.
```

---

## Rollback

```text
Execute rollback.
```

---

# Marketing

## Preparar Lançamento

```text
Prepare o lançamento.
```

---

## Gerar Landing Page

```text
Crie a landing page.
```

---

## Gerar Plano de Conteúdo

```text
Crie o plano de conteúdo.
```

---

# Gestão

## Dashboard

```text
Mostre o dashboard do projeto.
```

---

## Pendências

```text
Mostre as pendências.
```

---

## Próxima Etapa

```text
Qual a próxima etapa?
```

---

## Próximo Agente

```text
Quem trabalha agora?
```

---

## Histórico

```text
Mostre o histórico do projeto.
```

---

# Regras

O CEO nunca precisa indicar o agente.

Exemplo:

❌

```text
Peça para o Database Engineer criar o banco.
```

✔

```text
Atualize o banco de dados.
```

O Orchestrator identifica automaticamente o agente correto.

---

# Regra Suprema

> **O CEO descreve o objetivo. O Orchestrator traduz o objetivo em tarefas para os agentes.**

---

# Fim do Documento

---

## ✅ Arquivo concluído

**Arquivo:** `tools/01-command-reference.md`

**Status:** 🔒 **CONGELADO**

---

## O que esse documento muda na prática

Agora você passa a conversar com o AIEF de forma muito mais natural.

Em vez de pensar:

> "Agora preciso chamar o Full Stack..."

Você simplesmente diz:

* `Inicie o projeto Estoque.`
* `Adicione controle de lote.`
* `Atualize o banco de dados.`
* `Execute QA.`
* `Publique o projeto.`

Quem decide **qual agente deve executar** é sempre o Orchestrator.

---

