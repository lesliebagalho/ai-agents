
# Project Bootstrap

## Objetivo

Padronizar a preparação do ambiente de desenvolvimento antes do início da implementação.

O Bootstrap é responsável por transformar uma arquitetura aprovada em um projeto pronto para receber código.

Nenhuma funcionalidade de negócio deve ser implementada durante esta etapa.

---

# Responsável

**Orchestrator**

O Orchestrator executa o Bootstrap antes de entregar o projeto ao Senior Full Stack Engineer.

---

# Dependências

O Bootstrap somente pode iniciar quando as seguintes etapas estiverem concluídas:

* CEO Interview
* Product Manager
* Software Architect
* UI/UX Designer
* Database Engineer

Caso qualquer uma dessas etapas esteja pendente, o Bootstrap não pode ser executado.

---

# Objetivos

Ao final do Bootstrap, o projeto deve possuir:

* estrutura inicial criada;
* stack instalada;
* dependências configuradas;
* ambiente preparado;
* repositório inicializado;
* pronto para implementação.

---

# Fluxo

```text
Arquitetura Aprovada

↓

Ler Stack Definida

↓

Criar Projeto

↓

Instalar Dependências

↓

Configurar Ambiente

↓

Criar Estrutura

↓

Validar Ambiente

↓

Entregar ao Full Stack
```

---

# Bootstrap Next.js (Padrão AIEF)

## Criar Projeto

```bash
npx create-next-app@latest
```

---

## Inicializar Git

```bash
git init
```

---

## Instalar Dependências

Conforme arquitetura aprovada.

Exemplo:

* Prisma
* PostgreSQL
* Tailwind CSS
* shadcn/ui
* Auth.js (quando aplicável)
* Zod
* React Hook Form
* TanStack Query (quando aplicável)

---

## Configurar Banco

* criar `schema.prisma`;
* configurar conexão;
* validar acesso ao banco.

---

## Configurar Variáveis de Ambiente

Criar:

```text
.env.local
```

Definir:

* DATABASE_URL
* NEXTAUTH_SECRET (quando aplicável)
* NEXTAUTH_URL (quando aplicável)
* APIs externas
* demais variáveis previstas na arquitetura

---

## Estrutura Inicial

Criar a estrutura definida pelo AIEF.

Exemplo:

```text
src/
├── app/
├── actions/
├── components/
├── lib/
├── hooks/
├── services/
├── types/
├── utils/
├── prisma/
├── styles/
└── middleware.ts
```

---

## Configuração Inicial

Verificar:

* TypeScript;
* ESLint;
* Tailwind;
* aliases (`@/`);
* build sem erros.

---

## Primeiro Commit

Registrar o estado inicial do projeto.

Exemplo:

```text
chore: bootstrap inicial do projeto
```

---

# Critérios de Validação

O Bootstrap somente é considerado concluído quando:

* projeto compila sem erros;
* banco conectado (quando aplicável);
* dependências instaladas;
* estrutura criada;
* variáveis configuradas;
* primeiro commit realizado.

---

# Entrega ao Full Stack

Ao finalizar, o Orchestrator registra:

```text
Projeto: Estoque

Etapa: BOOTSTRAP

Status: Concluído

Próximo Agente:
Senior Full Stack Engineer

Ambiente preparado para implementação.
```

---

# Regras

Durante o Bootstrap é proibido:

* criar funcionalidades;
* implementar regras de negócio;
* desenvolver telas;
* criar APIs do domínio;
* alterar arquitetura aprovada.

O objetivo é apenas preparar o ambiente.

---

# Regra Suprema

> **Um projeto bem preparado reduz erros, elimina retrabalho e permite que o desenvolvimento comece imediatamente com foco exclusivo na implementação das funcionalidades.**

---

# Fim do Documento

---

## ✅ Arquivo concluído

**Arquivo:** `tools/04-project-bootstrap.md`

**Status:** 🔒 **CONGELADO**

---

# 🎉 AGORA SIM, EU DECLARO O AIEF CONCLUÍDO.

## Estrutura final

```text
D:\AIEF\
│
├── framework\
│   ├── agents/
│   ├── orchestrator/
│   ├── prompts/
│   ├── shared/
│   ├── templates/
│   ├── tools/
│   └── README.md
│
└── projects/
```

---

