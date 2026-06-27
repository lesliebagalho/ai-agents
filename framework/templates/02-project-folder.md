
# Estrutura Oficial de Projetos

## Objetivo

Padronizar a organização de qualquer projeto desenvolvido utilizando o AIEF.

Todo projeto deverá seguir exatamente esta estrutura.

Nenhuma pasta deve possuir responsabilidade duplicada.

---

# Estrutura Oficial

```text
projects/

└── nome-do-projeto/

    README.md

    project.md

    progress.md

    backlog.md

    decisions.md

    requirements/

        functional.md

        non-functional.md

        business-rules.md

    architecture/

        architecture.md

        api.md

        database.md

    design/

        ui.md

        design-system.md

        user-flows.md

    development/

        sprint-01.md

        sprint-02.md

        sprint-03.md

    testing/

        test-plan.md

        bugs.md

        homologation.md

    deployment/

        infrastructure.md

        environments.md

        release-notes.md

    marketing/

        positioning.md

        launch-plan.md

        content-plan.md

    assets/

        images/

        icons/

        logos/

        documents/
```

---

# README.md

Descrição resumida do projeto.

Responder:

* O que é?
* Objetivo.
* Stack.
* Status.
* Responsável.

---

# project.md

Documento principal.

Contém:

* visão geral;
* escopo;
* MVP;
* funcionalidades;
* objetivos.

É o documento mais importante do projeto.

---

# progress.md

Acompanhamento da execução.

Registrar:

* data;
* etapa;
* agente;
* conclusão;
* pendências.

Nunca apagar histórico.

---

# backlog.md

Lista de funcionalidades futuras.

Separar:

## MVP

## Versão 1.1

## Versão 2.0

## Ideias futuras

---

# decisions.md

Registro oficial das decisões.

Toda decisão importante deve conter:

* data;
* motivo;
* responsável;
* impacto.

Nunca apagar decisões antigas.

---

# requirements/

## functional.md

Requisitos funcionais.

Exemplo:

* cadastrar usuário;
* editar produto;
* emitir relatório.

---

## non-functional.md

Requisitos técnicos.

Exemplo:

* tempo de resposta;
* segurança;
* disponibilidade;
* escalabilidade.

---

## business-rules.md

Todas as regras de negócio.

Nenhuma regra deve ficar espalhada em outros documentos.

---

# architecture/

## architecture.md

Arquitetura completa.

---

## api.md

Endpoints.

Contratos.

Integrações.

---

## database.md

Modelo de dados.

Entidades.

Relacionamentos.

---

# design/

## ui.md

Layouts.

---

## design-system.md

Componentes.

---

## user-flows.md

Fluxos.

Jornadas.

---

# development/

Um arquivo por Sprint.

Registrar:

* funcionalidades;
* tarefas;
* responsáveis;
* status.

---

# testing/

## test-plan.md

Plano de testes.

---

## bugs.md

Registro oficial dos bugs.

---

## homologation.md

Resultado das homologações.

---

# deployment/

## infrastructure.md

Infraestrutura.

---

## environments.md

Ambientes.

---

## release-notes.md

Histórico das versões publicadas.

---

# marketing/

## positioning.md

Posicionamento.

---

## launch-plan.md

Plano de lançamento.

---

## content-plan.md

Conteúdo.

---

# assets/

Nunca misturar arquivos.

Separar:

* logos;
* imagens;
* documentos;
* ícones.

---

# Fluxo Oficial

```text
project.md

↓

requirements

↓

architecture

↓

design

↓

development

↓

testing

↓

deployment

↓

marketing
```

---

# Regras

Cada documento possui um único responsável.

Nunca duplicar informações.

Nunca documentar o mesmo assunto em dois locais diferentes.

---

# Regra Suprema

> **Um projeto organizado permite que qualquer agente compreenda seu estado atual em poucos minutos, sem depender de conhecimento informal.**

---

# Fim do Documento

