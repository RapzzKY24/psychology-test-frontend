# Psychology Test — Frontend

Next.js 16 (App Router) frontend for the psychology test platform. Backend: `../psychology-test-backend` (NestJS, port 4000).

**Architecture & conventions:** [`../docs/frontend/00-architecture.md`](../docs/frontend/00-architecture.md) — read it before writing any feature code. Stack decisions: [ADR-009](../docs/decisions/adr-009-frontend-stack.md), [ADR-010](../docs/decisions/adr-010-frontend-api-integration.md).

## Stack (pinned — see docs/standards/tech-versions.md)

Next.js 16.3.4 · React 19.2.8 · shadcn/ui (radix) · React Hook Form 7.87 + Zod 4.5.4 · TanStack Query 5.102 · better-auth 1.7.2 (must match backend) · Vitest 5

## Getting started

```bash
npm install
cp .env.example .env.local        # API_INTERNAL_URL=http://localhost:4000
npm run dev                       # http://localhost:3000
```

The backend must be running for anything beyond the landing page (`cd ../psychology-test-backend && npm run start:dev`).

- `/` landing placeholder · `/status` backend health smoke (server-side path)
- `/api/v1/*` is proxied to the backend via `next.config.ts` rewrites (same-origin cookies; no CORS anywhere)

## Scripts

| Script | What |
|---|---|
| `npm run dev` | Dev server (Turbopack) |
| `npm run build` | Production build |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint (no `next lint` in Next 16) |
| `npm run test` / `test:watch` | Vitest (unit only in MVP) |
| `npm run format` / `format:check` | Prettier |

## Non-negotiable conventions

- **Contract types** live in `src/lib/api/types/` — hand-mirrored from backend controllers, never invented. Verify against controller code, not feature docs.
- **UI copy Bahasa Indonesia** (error copy: `src/lib/api/error.ts` catalog); code and comments in English.
- **Query keys** only via `src/lib/api/query-keys.ts` factories.
- **Silence global error toasts** per query/mutation with `meta: { silentError: true }` + local handling.
- **Guest token** (ADR-005): localStorage `pt:participant-token:<sessionId>`, attached as `x-participant-token`.
- Route groups per persona (`(app)`, `(admin)`, `(psikolog)`, `(guest)`); `proxy.ts` is a cheap cookie gate, real role checks in group layouts.
