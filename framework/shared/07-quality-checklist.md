# Quality Checklist

## Objetivo

Definir os critérios obrigatórios de qualidade para todas as entregas produzidas pelos agentes do AI Engineering Framework (AIEF).

Nenhuma tarefa é considerada concluída apenas porque "funciona". Toda entrega deve atender aos critérios deste documento.

---

# Princípios de Qualidade

Toda entrega deve ser:

* Correta
* Completa
* Consistente
* Legível
* Testável
* Segura
* Performática
* Manutenível

---

# Definition of Ready (DoR)

Uma tarefa só pode ser iniciada quando atender aos seguintes critérios:

## Requisitos

* Objetivo claramente definido.
* Escopo compreendido.
* Critérios de aceite conhecidos.
* Dependências identificadas.

---

## Arquitetura

* Arquitetura aprovada.
* Impactos avaliados.
* Tecnologias definidas.

---

## Planejamento

* Estratégia definida.
* Arquivos afetados identificados.
* Riscos conhecidos.

---

# Definition of Done (DoD)

Uma tarefa só é considerada concluída quando TODOS os itens abaixo forem atendidos.

## Funcionalidade

* Implementação concluída.
* Requisitos atendidos.
* Critérios de aceite cumpridos.
* Fluxo funcionando corretamente.

---

## Código

* Segue Coding Standards.
* Sem código duplicado.
* Tipagem completa.
* Sem warnings.
* Sem erros.

---

## Banco de Dados

Quando aplicável:

* Migration criada.
* Schema atualizado.
* Integridade preservada.

---

## APIs

Quando aplicável:

* Entrada validada.
* Erros tratados.
* Status HTTP corretos.
* Respostas consistentes.

---

## Interface

Quando aplicável:

* Responsiva.
* Acessível.
* Consistente com o design.
* Sem quebras visuais.

---

## Segurança

Verificar:

* Autenticação.
* Autorização.
* Validação.
* Sanitização.
* Exposição de dados.

---

## Performance

Verificar:

* Consultas eficientes.
* Componentes otimizados.
* Renderizações desnecessárias evitadas.
* Bundle controlado.

---

## Documentação

Quando necessário:

* Atualizada.
* Clara.
* Coerente.

---

# Critérios de Revisão

Toda revisão deve analisar:

## Funcional

A funcionalidade atende ao objetivo?

---

## Arquitetura

Segue a arquitetura aprovada?

---

## Código

Segue os padrões?

---

## Segurança

Existe algum risco?

---

## Performance

Existe gargalo evidente?

---

## Manutenção

Outro desenvolvedor entenderia facilmente?

---

# Critérios de Aceitação

Uma entrega deve responder "SIM" para todas as perguntas abaixo.

## Negócio

* Resolve o problema?

---

## Técnica

* Está correta?

---

## Arquitetura

* Está alinhada?

---

## Segurança

* Está protegida?

---

## Performance

* Está eficiente?

---

## UX

* É intuitiva?

---

## Código

* Está limpo?

---

# Níveis de Severidade

## Crítico

Impede uso da funcionalidade.

Exemplos:

* Sistema quebra.
* Perda de dados.
* Falha de segurança.

Entrega bloqueada.

---

## Alto

Funcionalidade parcialmente comprometida.

Correção obrigatória antes da entrega.

---

## Médio

Não impede uso.

Deve ser corrigido.

---

## Baixo

Melhoria recomendada.

Pode ser planejada.

---

# Checklist de Código

* Compila.
* Sem erros TypeScript.
* Sem warnings.
* Sem imports não utilizados.
* Sem código morto.
* Sem duplicação.

---

# Checklist de Banco

* Migration criada.
* Schema atualizado.
* Relacionamentos corretos.
* Índices avaliados.

---

# Checklist de API

* Entrada validada.
* Erros tratados.
* Status HTTP corretos.
* Resposta padronizada.

---

# Checklist Front-end

* Responsivo.
* Mobile First.
* Componentes reutilizáveis.
* Sem quebras visuais.
* Loading tratado.
* Estados de erro tratados.

---

# Checklist Segurança

* Dados validados.
* Permissões verificadas.
* Secrets protegidos.
* ENV utilizada corretamente.
* Sem informações sensíveis expostas.

---

# Checklist Performance

* Consultas otimizadas.
* Cache quando necessário.
* Componentes otimizados.
* Lazy Loading quando apropriado.
* Evitar processamento desnecessário.

---

# Checklist Final

Antes da entrega responder:

* Está correto?
* Está completo?
* Está simples?
* Está seguro?
* Está performático?
* Está documentado?
* Está dentro do escopo?
* Está pronto para produção?

Se qualquer resposta for **NÃO**, a tarefa retorna para correção.

---

# Responsabilidade pela Qualidade

Todos os agentes são responsáveis pela qualidade de suas entregas.

O QA Engineer é responsável por validar a qualidade, não por criá-la.

A qualidade deve ser construída durante o desenvolvimento, e não apenas verificada ao final.

---

# Regra Final

**Só entregar quando você tiver confiança técnica de que a solução poderia ser implantada em produção.**

"Funciona" não é suficiente.

"Pronto para produção" é o padrão esperado.

---
