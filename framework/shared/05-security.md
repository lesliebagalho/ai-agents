# Security

## Objetivo

Definir regras minimas de seguranca para qualquer projeto criado ou alterado pelos agentes.

## Principios

- Toda entrada externa e nao confiavel.
- Segredos nunca devem aparecer no codigo, logs, commits ou respostas.
- Permissoes devem ser validadas no servidor.
- Erros devem ajudar o usuario sem revelar detalhes internos.
- Seguranca deve ser considerada no desenho, na implementacao e no deploy.

## Secrets e variaveis de ambiente

- Nunca commitar `.env` com valores reais.
- Usar arquivos de exemplo como `.env.example`.
- Nomear variaveis de forma clara.
- Separar variaveis por ambiente.
- Rotacionar secrets quando houver exposicao.

## Autenticacao e autorizacao

- Confirmar identidade do usuario em rotas protegidas.
- Validar permissao para cada acao sensivel.
- Nao confiar em flags enviadas pelo cliente.
- Proteger dados por usuario, organizacao ou tenant quando aplicavel.

## Validacao de entrada

- Validar body, params, query e headers relevantes.
- Rejeitar formatos inesperados.
- Normalizar dados antes de persistir.
- Tratar uploads com restricoes de tipo, tamanho e destino.

## Dados sensiveis

- Coletar apenas o necessario.
- Evitar logs com email, telefone, documento, tokens ou dados financeiros.
- Mascarar dados sensiveis quando exibidos.
- Respeitar regras de retencao e exclusao do projeto.

## APIs e integracoes

- Validar webhooks com assinatura quando disponivel.
- Usar HTTPS em comunicacoes externas.
- Definir timeouts para chamadas remotas.
- Tratar falhas de integracao sem expor detalhes internos.

## Checklist rapido

- Existe validacao no servidor?
- Existe checagem de permissao?
- Algum secret foi exposto?
- Erros retornam informacao sensivel?
- Logs contem dados privados?
- Dependencias novas sao realmente necessarias?
