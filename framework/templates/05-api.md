# API Template

## Nome da API

`[Nome ou recurso]`

## Objetivo

Explique para que a API existe e qual problema resolve.

## Endpoint

- Metodo: `[GET | POST | PUT | PATCH | DELETE]`
- Rota: `/api/[recurso]`
- Autenticacao: `[sim/nao]`
- Permissao: `[regra de acesso]`

## Request

### Params

```json
{}
```

### Query

```json
{}
```

### Body

```json
{}
```

## Response de sucesso

- Status: `200`

```json
{}
```

## Responses de erro

- `400 Bad Request`: entrada invalida.
- `401 Unauthorized`: usuario nao autenticado.
- `403 Forbidden`: usuario sem permissao.
- `404 Not Found`: recurso nao encontrado.
- `500 Internal Server Error`: erro inesperado.

## Validacoes

- `[Campo/regra]`
- `[Campo/regra]`

## Regras de negocio

- `[Regra]`

## Efeitos colaterais

- Banco de dados:
- Eventos:
- Emails/notificacoes:
- Integracoes:

## Observabilidade

- Logs:
- Metricas:
- Alertas:

## Testes

- Casos de sucesso.
- Validacoes de entrada.
- Permissoes.
- Erros esperados.
- Idempotencia, se aplicavel.
