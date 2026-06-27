# Padrões do Leslie

## Stack principal

- Next.js App Router
- TypeScript
- Tailwind CSS
- Railway (backend e PostgreSQL)
- Vercel (frontend)
- Prisma ORM
- GitHub
- Zod
- React Hook Form

## Filosofia

- Mobile First
- Simplicidade antes de complexidade
- Evitar dependências desnecessárias
- Componentes reutilizáveis
- Código legível acima de código "esperto"

## Estrutura padrão

/app
/components
/lib
/services
/types
/hooks
/prisma
/public

## Banco

- Sempre usar Prisma
- Migrations obrigatórias
- Seeds quando necessário

## Git

- Commits pequenos
- Uma feature por branch
- PR com checklist

## Segurança

- Nunca confiar em dados do cliente
- Validar tudo com Zod
- Variáveis sensíveis apenas via ENV

## Performance

- Server Components por padrão
- Client Components somente quando necessário
- Lazy Loading para componentes pesados

## UI

- Design limpo
- Poucas cores
- Responsivo
- Acessível (WCAG básico)

## Deploy

Frontend → Vercel
Backend/DB → Railway