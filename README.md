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

1. **Web** — link repo root → `cima.vercel.app`
2. **API** — link `services/api` → `cima-api.vercel.app`
3. Set `VITE_API_URL` on web build to API URL

See [SETUP.md](./SETUP.md).

## Legacy

v1: React Native 0.62 + Firebase `ITEM_RECORDS` + Gmail cron every 8s.
