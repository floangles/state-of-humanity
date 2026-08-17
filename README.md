# State of Humanity

Official world series on survival, literacy, living standards, conflict, and the planet. The app shows a number only when a producer published a **World** aggregate for that year. It never averages country rows and never interpolates gaps.

## Stack

- Next.js (App Router), TypeScript, Tailwind, shadcn/ui, Recharts, Framer Motion
- Drizzle ORM + Neon Postgres (optional)
- World Bank WDI API as the main access channel, plus producer files when WDI has no World row; the UI credits the original producer

## Local setup

```bash
npm install
npm run ingest
npm run dev
```

`npm run ingest` fetches official World series: WDI `country=WLD` for most candidates, the UCDP battle-deaths file, and the WID World (WO) file for the top 10% income share. A candidate with zero non-null World points is dropped. The snapshot is written to `data/world-series.json`. The UI reads that file when `DATABASE_URL` is unset.

Copy [`.env.example`](.env.example) to `.env.local` if you want Postgres.

## Neon (optional, free)

1. Create a project at [neon.tech](https://neon.tech)
2. Put the connection string in `.env.local` as `DATABASE_URL`
3. Push the schema, then ingest again:

```bash
npm run db:push
npm run ingest
```

With `DATABASE_URL` set, ingest syncs sources, metrics, and World observations into Neon. The app prefers Postgres when it contains shipped metrics, and falls back to the JSON snapshot.

## Deploy on Vercel (free, no domain)

1. Push this repo to GitHub
2. Import it on [vercel.com](https://vercel.com) — Hobby is enough
3. The site will be at `https://<project>.vercel.app`

The committed snapshot is enough for a first deploy. To read from Neon in production, add `DATABASE_URL` in the Vercel project settings and run ingest against that database (locally or in CI) before or after deploy.

Hobby is for personal, non-commercial use.

## Quality rules

- Fetch World (`WLD`) only
- Do not compute a world average
- Do not interpolate missing years
- Do not keep a dead WDI code
- Credit the original producer, not only the World Bank

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Local Next.js server |
| `npm run ingest` | Fetch official World series and write the snapshot |
| `npm run db:push` | Push the Drizzle schema to Neon |
| `npm run build` | Production build |
