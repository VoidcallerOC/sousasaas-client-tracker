# SousaSaaS Client Tracker

Private phone-first CRM for SousaSaaS clients and prospects.

## Warnings

- **This repo is private.** It holds client PII (names, phones, emails, notes). Do not make it public. Do not paste dumps into public chats.
- **Never commit a real AUTH_PASSWORD.** Use `.env.local` locally and Vercel env vars in production. Only `.env.example` belongs in git.
- **Do not invent dollar amounts.** Seeded quoted / deposit / paid are empty.
- **Care plan is $35/month.** Seeded next-action copy uses $35/mo. Never $60.

## Statuses

Exactly four. Do not rename them: Potential | Pending | Paid | Lost

Default view is grouped by Potential / Pending / Paid. Lost is filterable.

## How to run locally

Copy `.env.example` to `.env.local` and set AUTH_PASSWORD.
Then run `npm install` and `npm run dev`.
Open http://localhost:3000 and log in.

Local persistence writes `data/clients.json` when BLOB_READ_WRITE_TOKEN is unset.

## Persistence: blob vs local

- Local without BLOB_READ_WRITE_TOKEN: `data/clients.json` (seeded file)
- With BLOB_READ_WRITE_TOKEN (local or Vercel): persist at Blob pathname `clients.json`
- Vercel serverless filesystem is ephemeral. Do not rely on it for writes.
- If the blob is empty, the app seeds it from `data/clients.json`.

## Deploy on Vercel

1. Import this private GitHub repo.
2. Set Production + Preview env: AUTH_PASSWORD and BLOB_READ_WRITE_TOKEN (private store preferred; this file is PII).
3. Deploy. Middleware protects every route except `/login`.
4. First authenticated load seeds Blob from `data/clients.json` if missing.

## Seeded clients (5)

1. M&J Video Games & Collectibles — Paid — next: $35/mo care plan + referral ask
2. Thousand Sunny Cards & Collectibles — Paid — next: $35/mo care plan + referral ask
3. The Stronghold — Lost — declined (said no)
4. Hard Hitting — Lost — declined (said no)
5. Boom Tube Comics — Potential — same-town cold/referral target after M&J

No placeholder rows. Bulk-add pastes one name per line as Potential.

## Env vars Nick must set

- AUTH_PASSWORD — required locally and on Vercel
- BLOB_READ_WRITE_TOKEN — required on Vercel; optional locally
