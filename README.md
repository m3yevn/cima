# CIMA v2 — Web-first steel delivery QA

Rebirth of [cima-mobile](https://github.com/m3yevn/cima-mobile) + [cima-cron](https://github.com/m3yevn/cima-cron) as a Vercel PWA + serverless API.

## Monorepo

```
cima/
├── apps/web/          Landing + docs (static)
├── apps/field/        React PWA — field + lab UI at /app/
├── services/api/      Express API (separate Vercel project)
├── packages/shared/   Business rules (test flag, cost adjust, overdue)
└── scripts/           build-web.mjs
```

## Local dev

```bash
cd services/api && npm install && npm run dev    # :4010
cd apps/field && npm install && npm run dev      # :5174/app/
```

## Deploy

**Canonical production URLs:**

| Surface | URL |
|---------|-----|
| Landing | https://cima-flame.vercel.app |
| Field app | https://cima-flame.vercel.app/app/ |
| API | https://cima-flame.vercel.app/api/* (colocated) |

> `cima-app.vercel.app` is **not** a separate deployment (returns 404). The field PWA lives at `/app/` on `cima-flame.vercel.app`.  
> `cima.vercel.app` exists but `/app/` and `/api` are incomplete — do not use as canonical until aliased.

1. **Web** — link repo root → Vercel project `cima` (hostname: `cima-flame.vercel.app`)
2. **API** — colocated in `cima/api/` (no separate `cima-api` deploy required)
3. Field app uses same-origin `/api` by default (`VITE_API_URL` optional)

See [SETUP.md](./SETUP.md).

## Legacy

v1: React Native 0.62 + Firebase `ITEM_RECORDS` + Gmail cron every 8s.
