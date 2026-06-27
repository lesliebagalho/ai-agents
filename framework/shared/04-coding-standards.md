# Coding Standards

## Objetivo

Definir os padrões obrigatórios de desenvolvimento para todos os projetos do AI Engineering Framework (AIEF).

Estes padrões têm como objetivo garantir:

* Consistência
* Legibilidade
* Manutenibilidade
* Escalabilidade
* Facilidade de revisão

Todos os agentes responsáveis por código devem seguir este documento.

---

# Filosofia

## O código é escrito para pessoas.

Computadores executam código.

Pessoas mantêm código.

Sempre priorizar legibilidade.

---

# Regra Principal

Sempre escolher a solução mais simples que resolva o problema.

Nunca adicionar complexidade sem necessidade.

---

# Clean Code

Todo código deve ser:

* Simples
* Claro
* Pequeno
* Coeso
* Testável
* Reutilizável

---

# Nomenclatura

## Variáveis

Devem possuir nomes claros.

Bom:

```ts
const totalPrice
const userProfile
const activeSubscription
```

Ruim:

```ts
const x
const tmp
const data2
const value1
```

---

## Funções

Devem representar exatamente sua ação.

Bom:

```ts
calculateTotal()
sendEmail()
createUser()
validateCPF()
```

Ruim:

```ts
process()
execute()
run()
handle()
```

---

## Componentes React

Sempre em PascalCase.

```text
UserCard.tsx

ProductTable.tsx

LoginForm.tsx
```

---

## Hooks

Sempre iniciar com "use".

```text
useAuth()

useProducts()

useDarkMode()
```

---

## Interfaces

Sempre representar entidades.

```ts
interface User

interface Product

interface Order
```

Evitar:

```ts
interface IData

interface IObject
```

---

# Organização

Cada arquivo deve possuir uma única responsabilidade.

Evitar arquivos gigantes.

---

## Ordem Recomendada

1. Imports
2. Tipos
3. Constantes
4. Funções auxiliares
5. Componente principal
6. Export

---

# Componentização

Extrair componentes quando:

* Houver reutilização.
* O componente ficar muito grande.
* A leitura estiver prejudicada.

---

# Tamanho

## Componentes

Preferencialmente até 300 linhas.

Acima disso, avaliar divisão.

---

## Funções

Preferencialmente até 40 linhas.

Acima disso, revisar responsabilidade.

---

# DRY

Don't Repeat Yourself.

Nunca duplicar lógica.

Sempre avaliar reutilização.

---

# KISS

Keep It Simple.

A solução mais simples geralmente é a melhor.

---

# SOLID

Aplicar quando fizer sentido.

Não utilizar SOLID apenas por formalidade.

---

# Tratamento de Erros

Nunca ignorar erros.

Sempre:

* Capturar
* Tratar
* Registrar quando necessário
* Retornar mensagens adequadas

---

# Logs

Logs devem ser úteis.

Evitar:

```ts
console.log("teste")
```

Preferir:

```ts
console.error(error)

logger.info()

logger.warn()
```

---

# Comentários

Comentários apenas quando agregarem valor.

Evitar comentar o óbvio.

Ruim:

```ts
// Soma dois números
return a + b
```

Bom:

```ts
// Regra fiscal exigida pela legislação brasileira.
```

---

# Tipagem

Obrigatória.

Nunca utilizar:

```ts
any
```

Exceto quando inevitável e devidamente justificado.

---

# Constantes

Evitar valores mágicos.

Ruim:

```ts
if (status === 7)
```

Bom:

```ts
const STATUS_APPROVED = 7
```

---

# Imports

Organizar:

1. Bibliotecas
2. Framework
3. Arquivos internos
4. Estilos

---

# Estrutura de Pastas

Organizar por domínio.

Exemplo:

```text
features/

users/

orders/

products/

dashboard/
```

Evitar organização baseada apenas em tipo de arquivo.

---

# Performance

Evitar:

* Loops desnecessários.
* Re-renderizações.
* Consultas repetidas.
* Processamentos duplicados.

---

# Segurança

Nunca confiar em dados recebidos.

Sempre:

* Validar entrada.
* Sanitizar dados.
* Validar permissões.
* Validar autenticação.

---

# Banco de Dados

Nunca acessar diretamente.

Sempre utilizar:

* Prisma
* Repository
* Service

Conforme arquitetura adotada.

---

# APIs

Toda API deve:

* Validar entrada.
* Validar autenticação.
* Retornar status corretos.
* Tratar exceções.

---

# React

Preferências:

* Server Components por padrão.
* Client Components apenas quando necessários.
* Hooks apenas quando necessários.
* Estado mínimo possível.

---

# CSS

Priorizar Tailwind.

Evitar:

* CSS inline.
* Duplicação.
* Classes mortas.

---

# Git

Commits devem ser pequenos.

Cada commit representa uma única mudança lógica.

---

# Boas Práticas

Sempre:

* Reutilizar componentes.
* Reutilizar funções.
* Nomear corretamente.
* Remover código morto.
* Remover imports não utilizados.
* Manter organização.

---

# Más Práticas

Nunca:

* Duplicar código.
* Criar funções gigantes.
* Misturar responsabilidades.
* Ignorar erros.
* Ignorar TypeScript.
* Escrever código sem planejamento.
* Utilizar qualquer tecnologia apenas por moda.

---

# Revisão de Código

Antes de considerar uma tarefa concluída, verificar:

* Código legível.
* Tipagem correta.
* Sem duplicação.
* Sem warnings.
* Sem erros.
* Performance adequada.
* Segurança adequada.
* Organização correta.

---

# Checklist

Antes da entrega:

* Código limpo.
* Nomes claros.
* Responsabilidade única.
* Tipagem completa.
* Tratamento de erros.
* Sem duplicação.
* Estrutura organizada.
* Performance adequada.
* Segurança validada.
* Pronto para revisão.

---

# Regra Final

**Todo código deve ser escrito como se outro desenvolvedor fosse mantê-lo pelos próximos cinco anos.**

Essa regra deve orientar todas as decisões de implementação.

---
