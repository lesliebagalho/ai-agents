# Bugs e Riscos Conhecidos

## Status Geral

Nenhum bug funcional critico foi confirmado por execucao manual completa nesta etapa.

## Itens Abertos

### 1. Servidor de desenvolvimento instavel no ambiente atual

- Severidade: Media
- Tipo: Ambiente
- Descricao: em tentativas anteriores, o `next dev` iniciou e caiu em seguida por erro de lockfile/permissao do ambiente.
- Impacto: impede uma rodada completa de validacao manual no navegador dentro deste contexto.
- Status: Aberto

### 2. Persistencia ainda em modo demo local

- Severidade: Media
- Tipo: Tecnico
- Descricao: o MVP usa persistencia local em arquivo para viabilizar validacao sem banco conectado.
- Impacto: o fluxo funcional existe, mas ainda nao representa a integracao final com Prisma/PostgreSQL.
- Status: Aberto

### 3. Build completo do Next.js nao validado neste ambiente

- Severidade: Media
- Tipo: Ambiente
- Descricao: a geracao de `.next` ja encontrou restricoes de permissao neste ambiente.
- Impacto: ainda nao ha evidência completa de build de producao dentro deste contexto.
- Status: Aberto

### 4. Massa inicial nao possui usuario VIEWER pronto para teste

- Severidade: Baixa
- Tipo: Massa de teste
- Descricao: o seed inicial nao entrega um usuario `VIEWER`, entao esse fluxo precisa ser montado durante a execucao do teste manual.
- Impacto: aumenta um pouco o tempo da validacao de permissoes.
- Status: Aberto
