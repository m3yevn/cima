# CIMA — Production setup

## Vercel projects

| Project | Root directory | URL |
|---------|----------------|-----|
| `cima` | repo root | `cima.vercel.app` |
| `cima-api` | `services/api` | `cima-api.vercel.app` |

## Web env

| Variable | Value |
|----------|-------|
| `VITE_API_URL` | `https://cima-api.vercel.app` |

## API env (Phase 2 — MongoDB + Blob)

| Variable | Purpose |
|----------|---------|
| `MONGODB_STRING` | Vercel Postgres or MongoDB Atlas |
| `BLOB_READ_WRITE_TOKEN` | Photo uploads (Vercel Blob) |
| `RESEND_API_KEY` | Overdue email reminders |

## Vercel Cron (on `cima-api` project)

Add to `services/api/vercel.json`:

```json
"crons": [{ "path": "/cron/reminders", "schedule": "0 8 * * *" }]
```

Replaces cima-cron Firebase poll + Gmail.

## Firebase migration

Export `ITEM_RECORDS` from Firebase console → JSON → import script (TODO Phase 2).
