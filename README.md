# Auth Module

Sign up / sign in module with a NestJS + MongoDB API and a React + TypeScript front end (Vite, Tailwind, shadcn/ui).

```
backend/    NestJS API (ESM, Mongoose, JWT)
frontend/   React 19 SPA (react-hook-form + zod, react-router)
```

## Prerequisites
- Node.js 20+ and [pnpm](https://pnpm.io)
- MongoDB (use `docker compose up -d mongo`, or point `MONGODB_URI` at your own instance)

## Run everything at once
```bash
pnpm install:all   # first time only
pnpm dev           # starts MongoDB (docker), API and web together
pnpm stop          # stops MongoDB
```
Requires `backend/.env` and `frontend/.env` (copy from each `.env.example`).

## Run locally (manual)
```bash
docker compose up -d mongo

# API  -> http://localhost:3000/api
cd backend
cp .env.example .env        # set JWT_SECRET to a long random string
pnpm install
pnpm start:dev

# Web  -> http://localhost:5173
cd ../frontend
cp .env.example .env
pnpm install
pnpm dev
```

## Configuration
| App | Variable | Description |
| --- | --- | --- |
| backend | `PORT` | API port (default 3000) |
| backend | `MONGODB_URI` | MongoDB connection string |
| backend | `JWT_SECRET` | Signing secret, min 32 chars (required) |
| backend | `JWT_EXPIRES_IN` | Token lifetime (default `15m`) |
| backend | `CORS_ORIGIN` | Comma-separated allowed origins |
| frontend | `VITE_API_URL` | API base URL |

## API
| Method | Path | Auth | Description |
| --- | --- | --- | --- |
| POST | `/api/auth/signup` | – | `{ email, name, password }` → `201 { user, accessToken }`; `409` if email exists |
| POST | `/api/auth/signin` | – | `{ email, password }` → `200 { user, accessToken }`; `401` on bad credentials |
| GET | `/api/users/me` | Bearer JWT | Current user (protected endpoint) |

Validation (enforced on both client and server): valid email; name ≥ 3 chars; password ≥ 8 chars with at least one letter, one number and one special character.

## Tests
```bash
cd backend  && pnpm test && pnpm test:e2e   # e2e uses an in-memory MongoDB (downloaded on first run)
cd frontend && pnpm test
```

## Security notes
- Passwords hashed with bcrypt (12 rounds); hashes are never selected or returned.
- Sign-in returns a generic error and does equal work for unknown emails and wrong passwords.
- Helmet, restricted CORS, global validation (`whitelist` + `forbidNonWhitelisted`), rate limiting (stricter on `/auth`).
- The front end stores the JWT in `localStorage` for simplicity. For stricter XSS resistance, switch to an httpOnly, SameSite cookie issued by the API (plus refresh tokens) before going to production.
