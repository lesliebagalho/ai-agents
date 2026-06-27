# Plano de Testes

## Objetivo

Validar o MVP do projeto Estoque considerando autenticacao, contexto multiempresa, catalogo, movimentacoes, dashboard e usuarios.

## Escopo Coberto

- Login e sessao.
- Troca de empresa ativa.
- Cadastro e edicao de categorias.
- Cadastro, edicao, busca e filtros de produtos.
- Registro de entrada, saida e ajuste.
- Atualizacao de saldo consolidado.
- Historico de movimentacoes.
- Dashboard com indicadores e alertas.
- Gestao basica de usuarios.
- Regras basicas de permissao por perfil.

## Cenários Funcionais

### 1. Autenticacao

- Deve permitir login com usuario demo valido.
- Deve bloquear login com credenciais invalidas.
- Deve redirecionar usuario autenticado para o dashboard.
- Deve encerrar sessao ao sair.

### 2. Multiempresa

- Deve permitir trocar a empresa ativa quando o usuario possuir mais de um contexto.
- Deve atualizar produtos, categorias, usuarios e movimentacoes conforme a empresa ativa.
- Deve impedir acesso a dados de outra empresa fora do contexto atual.

### 3. Categorias

- Deve criar categoria com nome valido.
- Deve editar categoria existente.
- Deve impedir duplicidade de nome na mesma empresa.
- Deve respeitar permissao de escrita por perfil.

### 4. Produtos

- Deve criar produto com nome e unidade obrigatorios.
- Deve editar produto existente.
- Deve impedir SKU duplicado dentro da mesma empresa.
- Deve filtrar por nome, SKU, categoria e status.
- Deve exibir saldo atual junto ao produto.

### 5. Movimentacoes

- Deve registrar entrada e aumentar saldo.
- Deve registrar saida e reduzir saldo.
- Deve bloquear saida com saldo insuficiente.
- Deve registrar ajuste definindo saldo final.
- Deve exigir motivo no ajuste.
- Deve gerar historico com produto, usuario, tipo e saldo resultante.

### 6. Dashboard

- Deve exibir indicadores com dados reais do estoque.
- Deve listar alertas de estoque baixo quando houver.
- Deve refletir novas movimentacoes nos cards e tabelas.

### 7. Usuarios e Permissoes

- Deve listar usuarios da empresa ativa.
- Deve criar e editar usuario para a empresa ativa.
- Deve permitir gestao de usuarios apenas para `ADMIN` e `MANAGER`.
- Deve permitir movimentacoes para `ADMIN`, `MANAGER` e `OPERATOR`.
- Deve manter `VIEWER` como somente leitura.

## Validações Executadas Nesta Etapa

- `npx tsc --noEmit --incremental false`: aprovado.
- Revisao funcional de fluxo com base na implementacao das Sprints 01, 02 e 03: concluida.

## Pendências de Validação

- Executar fluxo manual completo em navegador com servidor estavel.
- Validar mensagens de erro e sucesso em cada formulario.
- Rodar homologacao final por negocio.

## Resultado Atual

Status: Em andamento.

O plano de testes esta estruturado e a validacao estatica foi concluida, mas a validacao manual completa ainda depende de um ambiente local sem bloqueio de lockfile.
