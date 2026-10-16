# AI.md — AI assistance disclosure

## Tools

- Claude Code (CLI / VS Code extension) using Claude models (Sonnet 5.5 for this documentation pass).
- Used for scaffolding, implementing, testing and documenting the sign-up / sign-in module.

## How this file was produced

Prompt-by-prompt transcripts were not retained, so the sections below are reconstructed from
the code as it exists in the repository, not quoted from chat history. Each claim about
behaviour was checked against the source.

## What was AI-assisted

| Area                     | Files                                                                  | Role of AI                                                                                              |
| ------------------------ | ---------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| Backend auth             | `backend/src/auth/*`                                                   | Generated service, controller, JWT strategy/guard and DTOs; reviewed for security behaviour (see below) |
| Backend users            | `backend/src/users/*`                                                  | Generated Mongoose schema and service (password hash excluded from default selects)                     |
| Backend bootstrap/config | `main.ts`, `setup-app.ts`, `app.module.ts`, `config/env.validation.ts` | Generated Helmet, CORS allow-list, global `ValidationPipe`, throttling and env validation               |
| Backend tests            | `auth.service.spec.ts`, `test/auth.e2e-spec.ts`                        | Generated unit tests and an e2e suite against `mongodb-memory-server`                                   |
| Frontend shell           | `App.tsx`, `main.tsx`, `auth/*`                                        | Generated routing with `ProtectedRoute` / `PublicOnlyRoute` and an auth provider                        |
| Frontend state & API     | `store/*`, `services/*`, `lib/api.ts`                                  | Generated Redux Toolkit store and RTK Query API layer                                                   |
| Frontend forms           | `pages/*`, `components/FormField.tsx`, `lib/validation.ts`             | Generated react-hook-form + zod forms                                                                   |
| UI primitives            | `components/ui/*`                                                      | shadcn/ui CLI output, not hand-written                                                                  |
| Frontend tests           | `App.test.tsx`, `lib/validation.test.ts`                               | Generated Vitest tests                                                                                  |
| Docs & tooling           | `README.md`, `docker-compose.yml`, root `package.json` scripts         | Generated; this `AI.md` as well                                                                         |

## Prompts and approaches that were effective

- **Naming the stack and constraints up front** (NestJS + Mongoose + JWT; React + react-hook-form + zod; ESM) produced code consistent with the intended architecture on the first pass.
- **Stating security properties explicitly** — bcrypt hashing, no hash in responses, generic sign-in error, rate limiting, CORS allow-list — rather than "make it secure". The resulting code reflects each one: `BCRYPT_ROUNDS = 12`, a constant `Invalid credentials` error, `ThrottlerGuard` as `APP_GUARD`.
- **Asking for identical validation on both sides.** `frontend/src/lib/validation.ts` (zod) and `backend/src/auth/dto/signup.dto.ts` (class-validator) enforce the same rules: valid email, name ≥ 3, password ≥ 8 with a letter, a digit and a special character.
- **Asking for tests alongside each feature**, including e2e tests that need no external database.

## What had to be reviewed, corrected or reworked

These are the places where AI-generated first drafts of auth code are typically wrong, and where the current code shows deliberate handling. They were the focus of review:

1. **User enumeration via timing.** A naive sign-in returns early when the email is unknown. The service compares against a precomputed `DUMMY_HASH` so unknown-email and wrong-password paths do equal bcrypt work (`auth.service.ts`).
2. **Duplicate-email race.** Checking "exists, then insert" is racy. The service relies on the unique index and maps Mongo error `11000` to `409 Conflict`.
3. **Input normalisation.** Emails are trimmed and lower-cased in the DTO transform so `A@x.com` and `a@x.com` cannot be two accounts; names are trimmed.
4. **Secret handling.** `JWT_SECRET` is validated at startup (min 32 chars) and `MONGODB_URI` is read with `getOrThrow`, so the app fails fast instead of running with a weak or missing secret.
5. **ESM import suffixes.** The backend is ESM, so relative imports need `.js` extensions (e.g. `'../users/users.service.js'`); generated code that omits them fails at runtime.
6. **Library choice.** The implementation uses `bcryptjs` (pure JS) rather than native `bcrypt`; the README's "bcrypt" wording refers to the algorithm.
7. **Repo hygiene.** `.env`, `dist`, `node_modules` and `*.tsbuildinfo` are git-ignored; `.env.example` files document required variables.

```bash
cd backend  && pnpm test && pnpm test:e2e
cd frontend && pnpm test
```
