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

## Credenciais e Massa de Teste

### Usuarios demo atuais

- `ana@estoque.local` / `123456`
  - `ADMIN` em `Acme Varejo`
  - `MANAGER` em `Beta Distribuidora`
- `bruno@estoque.local` / `123456`
  - `OPERATOR` em `Beta Distribuidora`

### Empresas iniciais

- `Acme Varejo`
- `Beta Distribuidora`

## Checklist Operacional

### Preparação

- Subir a aplicacao local.
- Acessar a tela de login.
- Confirmar que a massa demo foi carregada.

### Fluxo A: Login e Sessao

1. Entrar com `ana@estoque.local` / `123456`.
   Resultado esperado:
   - redirecionamento para o dashboard;
   - empresa ativa inicial visivel no topo;
   - perfil atual visivel no topo.
2. Sair da sessao.
   Resultado esperado:
   - redirecionamento para `/login`;
   - mensagem de sessao encerrada.
3. Tentar login com senha incorreta.
   Resultado esperado:
   - bloqueio do acesso;
   - mensagem de credenciais invalidas.

### Fluxo B: Troca de Empresa

1. Entrar com `ana@estoque.local`.
2. Trocar de `Acme Varejo` para `Beta Distribuidora`.
   Resultado esperado:
   - dashboard atualizado;
   - produtos, categorias, usuarios e movimentacoes mudam conforme a empresa;
   - papel exibido muda junto com o contexto.
3. Confirmar que os dados da empresa anterior nao continuam visiveis.

### Fluxo C: Categorias

1. Com `ana@estoque.local`, criar nova categoria.
   Resultado esperado:
   - categoria aparece na lista;
   - mensagem de sucesso exibida.
2. Editar a categoria criada.
   Resultado esperado:
   - alteracao refletida na tabela.
3. Tentar criar categoria duplicada na mesma empresa.
   Resultado esperado:
   - bloqueio da operacao;
   - mensagem de erro.

### Fluxo D: Produtos

1. Criar novo produto com nome, unidade e estoque minimo.
   Resultado esperado:
   - produto aparece na lista;
   - saldo inicial igual a `0`.
2. Editar produto existente.
   Resultado esperado:
   - alteracao refletida na tabela.
3. Tentar criar SKU duplicado na mesma empresa.
   Resultado esperado:
   - bloqueio da operacao;
   - mensagem de erro.
4. Validar busca e filtros.
   Resultado esperado:
   - lista responde por nome, SKU, categoria e status.

### Fluxo E: Movimentacoes

1. Registrar uma entrada.
   Resultado esperado:
   - saldo do produto aumenta;
   - historico ganha nova linha.
2. Registrar uma saida valida.
   Resultado esperado:
   - saldo do produto reduz;
   - historico atualizado.
3. Tentar registrar saida maior que o saldo.
   Resultado esperado:
   - operacao bloqueada;
   - mensagem de saldo insuficiente.
4. Registrar ajuste com motivo.
   Resultado esperado:
   - saldo final passa a ser o valor informado;
   - motivo aparece no historico.
5. Tentar ajuste sem motivo.
   Resultado esperado:
   - bloqueio da operacao.

### Fluxo F: Dashboard

1. Verificar cards principais apos movimentacoes.
   Resultado esperado:
   - valores refletem o estado atual do estoque.
2. Verificar secao de alertas.
   Resultado esperado:
   - produtos abaixo do minimo aparecem destacados.
3. Verificar movimentacoes recentes.
   Resultado esperado:
   - novas operacoes aparecem em ordem recente.

### Fluxo G: Usuarios e Permissoes

1. Com `ana@estoque.local` em `Beta Distribuidora`, abrir usuarios.
   Resultado esperado:
   - tela acessivel;
   - lista carregada.
2. Criar usuario `VIEWER`.
   Resultado esperado:
   - usuario aparece na lista.
3. Editar o usuario criado para `INACTIVE`.
   Resultado esperado:
   - status atualizado.
4. Entrar com `bruno@estoque.local`.
   Resultado esperado:
   - acesso a movimentacoes permitido;
   - acesso a usuarios indisponivel;
   - escrita em categorias e produtos bloqueada.
5. Entrar com usuario `VIEWER` criado.
   Resultado esperado:
   - leitura permitida;
   - escrita bloqueada em produtos, categorias, usuarios e movimentacoes.

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

## Observações para QA

- O projeto ainda usa persistencia demo local em arquivo, entao os testes alteram a massa local do ambiente.
- Se quiser repetir o teste do zero, pode ser necessario limpar o arquivo `.data/demo-database.json`.
- Ainda nao ha banco Prisma/PostgreSQL real conectado nesta etapa.

## Resultado Atual

Status: Em andamento.

O plano de testes esta estruturado e a validacao estatica foi concluida, mas a validacao manual completa ainda depende de um ambiente local sem bloqueio de lockfile.
