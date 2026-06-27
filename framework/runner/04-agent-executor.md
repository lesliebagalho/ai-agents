
# Agent Executor

## Objetivo

Executar qualquer agente do AIEF utilizando qualquer LLM suportado pelo AI Runner.

O Agent Executor é a única camada autorizada a conversar com modelos de IA.

Nenhum outro componente do Runner pode enviar prompts diretamente para um LLM.

---

# Missão

Receber uma solicitação do Orchestrator, montar automaticamente o contexto necessário e executar o agente correspondente.

---

# Responsabilidades

O Agent Executor deve:

* identificar o agente solicitado;
* localizar os documentos necessários;
* construir o contexto completo;
* enviar a solicitação ao LLM;
* receber a resposta;
* devolver o resultado ao Orchestrator.

---

# Não é responsabilidade

Nunca:

* decidir qual agente executar;
* interpretar comandos do usuário;
* alterar o estado do projeto;
* criar regras de negócio;
* modificar o framework.

---

# Fluxo Geral

```text
Orchestrator

↓

Receber Solicitação

↓

Identificar Agente

↓

Montar Contexto

↓

Selecionar LLM

↓

Executar Agente

↓

Receber Resposta

↓

Validar

↓

Orchestrator
```

---

# Entrada

O Executor recebe um comando estruturado.

Exemplo:

```json
{
  "agent": "Product Manager",
  "project": "Sistema de Estoque",
  "task": "Executar etapa DISCOVERY"
}
```

---

# Construção de Contexto

Antes de chamar o LLM, o Executor deve reunir automaticamente:

## Framework

* shared/
* templates/
* tools/
* SOP do agente

---

## Projeto

* project.md
* progress.md
* requirements/
* architecture/
* design/
* development/
* estado atual

---

## Histórico

Últimos handoffs.

Pendências.

Decisões.

---

# Ordem de Leitura

O contexto deve seguir sempre esta sequência:

```text
Framework

↓

SOP do Agente

↓

Estado do Projeto

↓

Documentação do Projeto

↓

Solicitação Atual
```

---

# Seleção do LLM

O Executor não depende de um modelo específico.

Pode utilizar:

* ChatGPT
* Codex
* Claude
* Gemini
* DeepSeek

A escolha é feita pelo LLM Provider.

---

# Resposta Esperada

Todo agente deve devolver:

* resumo;
* artefatos produzidos;
* pendências;
* riscos;
* próximo agente sugerido.

---

# Validação

Antes de devolver o resultado ao Orchestrator verificar:

* resposta completa;
* artefatos existentes;
* formato válido;
* ausência de erros críticos.

---

# Tratamento de Falhas

Caso a execução falhe:

1. registrar o erro;
2. preservar o estado do projeto;
3. devolver mensagem ao Orchestrator.

O Executor nunca altera o projeto parcialmente.

---

# Cache

Sempre que possível reutilizar contexto já carregado para reduzir consumo de tokens e tempo de resposta.

---

# Segurança

O Executor nunca envia documentos desnecessários ao LLM.

Somente o contexto mínimo necessário para a tarefa atual.

---

# Comunicação

O Executor comunica-se apenas com:

* Orchestrator;
* Context Builder;
* LLM Provider.

Nunca acessa Interface diretamente.

---

# Regra Suprema

> O Agent Executor não pensa. Não decide. Não coordena. Ele apenas executa o agente correto utilizando o contexto correto.

---

# Fim do Documento
