# Architecture

## Objetivo

Definir como organizamos projetos para que o sistema seja compreensivel, testavel e evolutivo.

## Principios

- Arquitetura deve resolver problemas reais do projeto.
- Comece simples e evolua com evidencia.
- Separe responsabilidades por dominio.
- Mantenha baixo acoplamento entre interface, regra de negocio, persistencia e integracoes.
- Contratos entre partes do sistema devem ser explicitos.

## Organizacao recomendada

- `app/` ou `pages/`: rotas, layouts e composicao da experiencia.
- `components/`: componentes reutilizaveis de interface.
- `features/`: fluxos ou dominios de produto, quando o projeto crescer.
- `lib/`: utilitarios, clients e infraestrutura compartilhada.
- `services/`: integracoes externas e operacoes de negocio.
- `data/` ou `repositories/`: acesso a dados, quando existir separacao.
- `types/`: tipos compartilhados, quando nao pertencerem a um modulo especifico.

## Regras de dependencia

- UI pode chamar casos de uso ou actions, mas nao deve conter regra complexa de dominio.
- Regra de negocio nao deve depender de componentes visuais.
- Persistencia deve ficar isolada o suficiente para ser testada e modificada.
- Integracoes externas devem ter fronteiras claras.

## APIs e contratos

- Defina entradas, saidas, erros e permissoes.
- Valide dados nas bordas do sistema.
- Use respostas consistentes.
- Evite expor detalhes internos de implementacao.

## Banco de dados

- Modele dados a partir do dominio.
- Use constraints para proteger invariantes.
- Planeje migrations compativeis com producao.

## Quando criar abstracao

Crie uma abstracao apenas quando ela:

- Remove duplicacao real.
- Isola risco ou complexidade.
- Representa um conceito estavel do dominio.
- Facilita teste ou evolucao.

## O que evitar

- Microservicos sem necessidade.
- Camadas genericas sem responsabilidade clara.
- Eventos, filas ou caches apenas por preferencia tecnica.
- Misturar refatoracao estrutural com mudanca funcional sem motivo.
