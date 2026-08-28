# SousaSaaS Client Tracker

Private CRM for Nick Sousa / SousaSaaS. Phone-first client pipeline.

**This repo is private.** It contains client PII (names, phones, emails). Do not fork publicly, do not copy into a marketing site, and do not put this code in any public SousaSaaS repo.

## Statuses

Exactly four strings:

- Potential
- Pending
- Paid
- Lost

Default view is the live pipeline: Potential / Pending / Paid, grouped. Lost is first-class and filterable.

Monthly care plan is **$35/month**. Never quote $60.

## Run locally

```bash
cp .env.example .env
npm i
npm run dev
```

Open http://localhost:3000 and sign in with `AUTH_PASSWORD` (example value in `.env.example` is `change-me`).

Local persistence is `data/clients.json` on disk. Writes survive process restarts.

## Deploy on Vercel

1. Import this private GitHub repo into Vercel.
2. Set `AUTH_PASSWORD` (required; do not use the example value in production).
3. Set `BLOB_READ_WRITE_TOKEN` (required in production so writes survive serverless).
4. Deploy. Middleware protects every route except `/login`. Cookie session, httpOnly.

## Persistence

- **Local/dev:** read/write `data/clients.json` on disk. A seeded file ships with the repo.
- **Production:** if `BLOB_READ_WRITE_TOKEN` is set, persist one JSON blob via `@vercel/blob` at pathname `clients.json`. If the blob is missing or empty, the app seeds from the shipped JSON.
- Do **not** rely on the Vercel filesystem to keep writes. Use a private Blob store when possible.

## Auth

Shared password via `AUTH_PASSWORD`. Never commit a real production value. `.env` is gitignored.

## Seeded clients

1. M&J Video Games & Collectibles — Paid
2. Thousand Sunny Cards & Collectibles — Paid
3. The Stronghold — Lost
4. Hard Hitting — Lost
5. Boom Tube Comics — Potential
