# Contributing to DevBoard

## Development Setup

Follow the getting started guide in [README.md](./README.md).

## Project Structure

- `apps/frontend` — React frontend
- `apps/backend` — Node.js backend
- `packages/shared` — shared TypeScript types used by both apps

## Code Style

- TypeScript strict mode enabled everywhere
- ESLint + Prettier for formatting
- `import type` for all type-only imports (verbatimModuleSyntax)
- Zod 4 for all validation schemas

## Git Conventions

We use Conventional Commits:

```
feat: add new feature
fix: bug fix
chore: tooling or config change
refactor: code restructure
style: UI changes
docs: documentation
```

## Branch Strategy

- `master` — production ready code
- Feature branches: `feat/feature-name`
- Bug fixes: `fix/bug-description`

## Pull Request Process

1. Create a branch from `master`
2. Make your changes
3. Run `pnpm lint` and `pnpm test`
4. Push and open a PR with a clear description
5. PR title should follow Conventional Commits format

## Database Changes

- Add migration SQL to `apps/backend/src/db/migrate.ts`
- Update Kysely types in `apps/backend/src/db/database.ts`
- Update shared types in `packages/shared/src/types.ts` if needed
- Run `pnpm db:migrate` to apply
