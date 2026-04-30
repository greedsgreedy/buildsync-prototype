# ModScout

ModScout is a Next.js prototype for an A90/A91 Supra garage app. It includes a garage dashboard, installed mod tracker, parts catalog, wishlist, cost calculator, budget planner, drop alerts, preview studio, and community builds.

## Local Development

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

## Vercel Deployment

1. Push this folder to a GitHub repository.
2. In Vercel, create a new project and import the repo.
3. Vercel should auto-detect Next.js. The included `vercel.json` uses:
   - Install command: `npm install`
   - Build command: `npm run build`
   - Output directory: `.next`
4. Deploy.

## Production Notes

The current app uses local React state and static sample data. A production version should connect the garage, wishlist, alerts, and catalog data to a backend such as Supabase, then add a scraper/API pipeline for live vendor pricing and restock alerts.
