
# Intent Engine

## Objetivo

Interpretar a intenção do usuário e convertê-la em comandos estruturados para o Orchestrator.

O Intent Engine é a única camada responsável por interpretar linguagem natural.

Nenhum outro componente do AI Runner pode interpretar comandos do usuário.

---

# Missão

Traduzir frases humanas em intenções padronizadas.

Exemplo:

Entrada:

> Crie um sistema de estoque.

Saída:

```json
{
  "intent": "NEW_PROJECT",
  "project": "Sistema de Estoque"
}
```

---

# Responsabilidades

O Intent Engine deve:

* identificar a intenção principal;
* extrair parâmetros relevantes;
* validar informações mínimas;
* encaminhar o resultado ao Orchestrator.

---

# Não é responsabilidade

Nunca:

* executar agentes;
* modificar projetos;
* criar arquivos;
* consultar LLMs diretamente;
* alterar estados.

---

# Fluxo

```text
Mensagem do Usuário

↓

Análise da Intenção

↓

Extração de Dados

↓

Validação

↓

Comando Estruturado

↓

Orchestrator
```

---

# Estrutura do Comando

Todo comando deve seguir o formato:

```json
{
  "intent": "",
  "project": "",
  "target": "",
  "parameters": {},
  "rawMessage": ""
}
```

---

# Intenções Oficiais

## Projetos

NEW_PROJECT

CONTINUE_PROJECT

PAUSE_PROJECT

RESUME_PROJECT

CANCEL_PROJECT

FINISH_PROJECT

PROJECT_STATUS

LIST_PROJECTS

---

## Desenvolvimento

ADD_FEATURE

UPDATE_FEATURE

REMOVE_FEATURE

FIX_BUG

REFACTOR

REVIEW_CODE

---

## Arquitetura

UPDATE_DATABASE

REVIEW_ARCHITECTURE

UPDATE_API

---

## Qualidade

RUN_QA

RUN_REGRESSION

HOMOLOGATE

---

## Deploy

DEPLOY

ROLLBACK

GENERATE_RELEASE

---

## Documentação

EXPORT_PROJECT

GENERATE_DOCUMENTATION

UPDATE_DOCUMENTATION

---

## Dashboard

SHOW_DASHBOARD

SHOW_HISTORY

SHOW_PENDING

SHOW_TIMELINE

---

# Exemplos

### Exemplo 1

Entrada:

> Crie um sistema de estoque.

Saída:

```json
{
  "intent": "NEW_PROJECT",
  "project": "Sistema de Estoque"
}
```

---

### Exemplo 2

Entrada:

> Continue o projeto MyFitPlate.

Saída:

```json
{
  "intent": "CONTINUE_PROJECT",
  "project": "MyFitPlate"
}
```

---

### Exemplo 3

Entrada:

> Adicione autenticação.

Saída:

```json
{
  "intent": "ADD_FEATURE",
  "feature": "Autenticação"
}
```

---

### Exemplo 4

Entrada:

> Faça o deploy.

Saída:

```json
{
  "intent": "DEPLOY"
}
```

---

### Exemplo 5

Entrada:

> Como está o projeto?

Saída:

```json
{
  "intent": "PROJECT_STATUS"
}
```

---

# Regras

O Intent Engine deve identificar apenas uma intenção principal por mensagem.

Se houver múltiplas intenções, o Orchestrator deverá solicitar confirmação ao usuário.

---

# Tratamento de Ambiguidade

Caso a intenção ou os parâmetros não possam ser determinados com segurança, o Intent Engine deve retornar um estado de esclarecimento.

Exemplo:

```json
{
  "intent": "NEEDS_CLARIFICATION",
  "reason": "Projeto não informado."
}
```

O Orchestrator será responsável por solicitar apenas as informações faltantes.

---

# Regra Suprema

> O Intent Engine traduz a linguagem do usuário. O Orchestrator traduz a intenção em execução. Nenhum dos dois invade a responsabilidade do outro.

---

# Fim do Documento
