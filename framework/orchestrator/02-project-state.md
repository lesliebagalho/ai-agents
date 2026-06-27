
# Project State Manager

## Objetivo

Controlar o estado de todos os projetos desenvolvidos utilizando o AIEF.

O Orchestrator deve consultar este documento antes de iniciar qualquer ação.

---

# Princípio

Cada projeto possui um único estado atual.

Nunca pode existir mais de um estado ativo.

---

# Estrutura do Estado

Todo projeto deve registrar:

```text
Nome do Projeto

Versão

Status Atual

Agente Atual

Data de Início

Última Atualização

Responsável

Próximo Agente
```

---

# Estados Oficiais

Somente os estados abaixo são permitidos.

```text
IDEA

DISCOVERY

ARCHITECTURE

DESIGN

DATABASE

DEVELOPMENT

QA

DEPLOY

MARKETING

DONE

PAUSED

CANCELLED
```

Nenhum outro estado é permitido.

---

# Estado: IDEA

Projeto criado.

Nenhum agente iniciou.

---

# Estado: DISCOVERY

Product Manager executando.

---

# Estado: ARCHITECTURE

Software Architect executando.

---

# Estado: DESIGN

UI/UX trabalhando.

---

# Estado: DATABASE

Database Engineer trabalhando.

---

# Estado: DEVELOPMENT

Senior Full Stack Engineer trabalhando.

---

# Estado: QA

QA Engineer executando.

---

# Estado: DEPLOY

DevOps executando.

---

# Estado: MARKETING

Marketing Strategist executando.

---

# Estado: DONE

Projeto concluído.

---

# Estado: PAUSED

Projeto interrompido temporariamente.

Nenhum agente inicia novas atividades.

---

# Estado: CANCELLED

Projeto encerrado sem conclusão.

---

# Histórico

Todo projeto deve manter um histórico permanente.

Nunca apagar eventos anteriores.

---

# Estrutura do Histórico

Cada evento registra:

```text
Data

Agente

Etapa

Resultado

Pendências

Próximo Agente
```

---

# Mudança de Estado

Somente o Orchestrator pode alterar o estado do projeto.

Nenhum agente possui essa permissão.

---

# Critérios para Avançar

Antes de mudar de estado verificar:

* etapa concluída;
* documentação entregue;
* pendências resolvidas;
* próximo agente definido.

---

# Critérios para Retroceder

O Orchestrator deve retornar para a etapa anterior quando houver:

* reprovação do QA;
* mudança de requisitos;
* falha arquitetural;
* inconsistência de banco;
* bloqueio técnico.

---

# Continuação de Projeto

Quando o CEO disser:

> **Continuar projeto X**

O Orchestrator deve:

1. Localizar o estado atual.
2. Identificar o agente responsável.
3. Ler as pendências.
4. Continuar exatamente da última etapa concluída.

Nunca reiniciar o projeto.

---

# Dashboard do Projeto

O Orchestrator deve ser capaz de apresentar:

```text
Projeto

Status

████████░░ 80%

Etapa Atual

Agente Atual

Próxima Etapa

Pendências

Riscos

Última Atualização
```

---

# Comandos Oficiais

O CEO pode utilizar:

### Iniciar projeto

```text
Inicie o projeto Estoque
```

---

### Continuar projeto

```text
Continue o projeto Estoque
```

---

### Pausar projeto

```text
Pause o projeto Estoque
```

---

### Retomar projeto

```text
Retome o projeto Estoque
```

---

### Encerrar projeto

```text
Finalize o projeto Estoque
```

---

### Status

```text
Status do projeto Estoque
```

---

# Regra Suprema

> **O Orchestrator sempre sabe onde o projeto está, o que já foi entregue, o que falta e quem deve trabalhar a seguir.**

