
# CEO Interview

## Objetivo

Antes que qualquer agente inicie seu trabalho, o Orchestrator deve conduzir uma entrevista estruturada com o CEO.

O objetivo é obter informações suficientes para que o Product Manager possa iniciar o projeto sem precisar interromper o fluxo posteriormente.

---

# Regra Principal

O Orchestrator nunca inicia um projeto sem um briefing mínimo.

Se informações essenciais estiverem ausentes, ele deve perguntar antes de acionar qualquer agente.

---

# Fluxo da Entrevista

```text
CEO

↓

Entrevista

↓

Project Brief

↓

Product Manager

↓

Fluxo normal do AIEF
```

---

# Bloco 1 — Identificação

Perguntar:

1. Nome do projeto.
2. Nome curto (opcional).
3. Descrição em uma frase.

Exemplo:

> "Sistema de controle de estoque para pequenas empresas."

---

# Bloco 2 — Problema

Perguntar:

1. Qual problema o sistema resolve?
2. Quem sofre com esse problema?
3. Como isso é feito hoje?
4. O que há de ruim na solução atual?

---

# Bloco 3 — Público-Alvo

Perguntar:

1. Quem utilizará o sistema?
2. Empresa ou consumidor final?
3. Quantos usuários são esperados inicialmente?
4. O sistema será usado diariamente?

---

# Bloco 4 — Plataforma

Perguntar:

1. Web, Mobile ou ambos?
2. SaaS ou sistema interno?
3. Multiempresa?
4. Multiusuário?

---

# Bloco 5 — Funcionalidades

Perguntar:

Liste apenas as funcionalidades essenciais do MVP.

Exemplo:

* Login
* Cadastro de produtos
* Entrada de estoque
* Saída de estoque
* Relatórios

---

# Bloco 6 — Monetização

Perguntar:

1. O sistema será gratuito?
2. Assinatura?
3. Pagamento único?
4. Uso interno?

---

# Bloco 7 — Integrações

Perguntar:

Existem integrações previstas?

Exemplos:

* Stripe
* OpenAI
* WhatsApp
* Google
* APIs próprias

---

# Bloco 8 — Restrições

Perguntar:

Existe alguma restrição importante?

Exemplos:

* prazo;
* orçamento;
* tecnologia obrigatória;
* legislação.

---

# Bloco 9 — Stack Preferencial

Perguntar apenas se não estiver definida pelo framework.

Caso contrário, utilizar automaticamente o padrão AIEF.

---

# Stack Padrão do AIEF

* Front-end: Next.js
* Backend: Next.js Server Actions
* ORM: Prisma
* Banco: PostgreSQL
* Hospedagem Front-end: Vercel
* Banco e Backend: Railway

Esses valores só podem ser alterados por decisão explícita do CEO.

---

# Resultado da Entrevista

Ao finalizar, o Orchestrator deve gerar automaticamente:

* `project.md`
* `README.md`
* Resumo Executivo
* Lista inicial de funcionalidades
* Status do projeto = DISCOVERY

---

# Critérios de Conclusão

A entrevista é considerada concluída quando:

* todas as informações obrigatórias foram respondidas;
* o escopo do MVP está definido;
* existe clareza suficiente para iniciar o trabalho do Product Manager.

---

# Regra Suprema

> **Perguntar uma vez, documentar corretamente e reutilizar a informação durante todo o ciclo do projeto.**

---

# Fim do Documento

---

## ✅ Arquivo concluído

**Arquivo:** `prompts/03-ceo-interview.md`

**Status:** 🔒 **CONGELADO**

---

### O que esse arquivo muda?

Agora você poderá iniciar um projeto assim:

> **Orchestrator, inicie o projeto Estoque.**

E, em vez de começar a trabalhar às cegas, o Orchestrator fará uma entrevista estruturada, gerará automaticamente a documentação inicial do projeto e só então acionará o Product Manager.

