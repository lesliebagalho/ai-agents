
# AI Engineering Framework (AIEF)

## Objetivo

O AIEF é um framework de agentes de IA criado para padronizar o desenvolvimento de produtos digitais utilizando uma equipe virtual especializada.

Cada agente possui uma responsabilidade única, um processo operacional definido (SOP) e critérios de qualidade próprios.

O objetivo é permitir que projetos sejam executados de forma consistente, previsível e escalável.

---

# Filosofia

O AIEF segue cinco princípios fundamentais:

* Especialização.
* Responsabilidade única.
* Documentação.
* Padronização.
* Qualidade.

Cada agente executa apenas sua responsabilidade.

Nenhum agente altera decisões pertencentes a outro agente.

---

# Estrutura

```text
AIEF/

├── framework/
│   ├── README.md
│   ├── shared/
│   │   ├── 01-company.md
│   │   ├── 02-stack.md
│   │   ├── 03-architecture.md
│   │   ├── 04-coding-standards.md
│   │   ├── 05-security.md
│   │   ├── 06-git-workflow.md
│   │   ├── 07-quality-checklist.md
│   │   └── 08-response-format.md
│   │
│   ├── agents/
│   │   ├── 01-product-manager.md
│   │   ├── 02-software-architect.md
│   │   ├── 03-ui-ux-designer.md
│   │   ├── 04-database-engineer.md
│   │   ├── 05-senior-fullstack-engineer.md
│   │   ├── 06-qa-engineer.md
│   │   ├── 07-devops-engineer.md
│   │   └── 08-marketing-strategist.md
│   │
│   ├── orchestrator/
│   ├── prompts/
│   ├── templates/
│   └── tools/
│
└── projects/
```

---

# Agentes

## Product Manager

Responsável por transformar ideias em requisitos de negócio.

---

## Software Architect

Responsável pela arquitetura da solução.

---

## UI/UX Designer

Responsável pela experiência do usuário e interface.

---

## Database Engineer

Responsável pela modelagem e evolução do banco de dados.

---

## Senior Full Stack Engineer

Responsável pela implementação da aplicação.

---

## QA Engineer

Responsável pela validação da qualidade do produto.

---

## DevOps Engineer

Responsável pela infraestrutura, CI/CD e ambientes.

---

## Marketing Strategist

Responsável pelo posicionamento, lançamento e crescimento do produto.

---

# Fluxo Oficial

```text
CEO

↓

Product Manager

↓

Software Architect

↓

UI/UX Designer
        │
Database Engineer
        │
        ▼

Senior Full Stack Engineer

↓

QA Engineer

↓

DevOps Engineer

↓

Marketing Strategist

↓

Entrega
```

---

# Projetos

Projetos criados com o framework ficam na pasta `projects`.

Exemplo:

```text
projects/

myfitplate/

zero-parada/

axtenn/
```

Cada projeto pode conter documentação específica daquele produto.

Os agentes permanecem reutilizáveis.

---

# Como Utilizar

## Passo 1

O CEO apresenta uma ideia.

---

## Passo 2

O Product Manager transforma a ideia em requisitos.

---

## Passo 3

O Software Architect cria a arquitetura.

---

## Passo 4

UI/UX Designer e Database Engineer trabalham em paralelo.

---

## Passo 5

O Senior Full Stack Engineer implementa a solução.

---

## Passo 6

O QA Engineer valida.

---

## Passo 7

O DevOps Engineer publica.

---

## Passo 8

O Marketing Strategist prepara o lançamento e crescimento.

---

# Regras

Todos os agentes devem respeitar os documentos da pasta `shared`.

Nenhum agente deve assumir responsabilidades de outro.

Toda comunicação deve seguir o padrão definido em `shared/08-response-format.md`.

Toda entrega deve atender aos critérios definidos em `shared/07-quality-checklist.md`.

---

# Versionamento

## Major

Mudanças incompatíveis.

---

## Minor

Novos agentes ou novos documentos.

---

## Patch

Correções de documentação.

---

# Convenções

* Um agente por arquivo.
* Uma responsabilidade por agente.
* Um documento oficial por assunto.
* Arquivos congelados não são alterados.

---

# Objetivo Final

Construir uma equipe de IA reutilizável, capaz de executar projetos completos mantendo o mesmo padrão de qualidade, independentemente da ferramenta utilizada.

---

