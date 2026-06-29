# ScoutIQ — Site Preview Templates

Ten Next.js templates that render AI-generated business previews. Each fetches content from your ScoutIQ API:

```
GET {API_URL}/sites/{businessId}/content
```

## Structure

```
templates/
  site-shared/          # Shared components, themes, fetch logic
  apps/
    scoutiq-restaurant-01/   → port 3011  Warm bistro (orange/gold)
    scoutiq-restaurant-02/   → port 3012  Fine dining noir (dark/gold)
    scoutiq-clinic-01/       → port 3013  Clinical trust (teal/cyan)
    scoutiq-salon-01/        → port 3014  Soft salon (rose/blush)
    scoutiq-gym-01/          → port 3015  Power gym (black/lime)
    scoutiq-retail-01/       → port 3016  Bright retail (blue/amber)
    scoutiq-law-01/           → port 3017  Legal authority (navy/gold)
    scoutiq-cafe-01/          → port 3018  Cozy cafe (brown/cream)
    scoutiq-education-01/    → port 3019  Academy (indigo/orange)
    scoutiq-default-01/      → port 3020  Professional default
  scripts/
    generate-apps.mjs     # Regenerate app scaffolding
```

## Local development

### 1. Backend — enable local template URLs

In the root `.env`:

```env
USE_LOCAL_TEMPLATES=true
NEXT_PUBLIC_API_URL=http://localhost:4000   # in each template's .env.local
```

Restart API + workers after changing.

### 2. Run one template

```bash
cd templates/apps/scoutiq-retail-01
cp .env.example .env.local
npm install
npm run dev
```

Open: `http://localhost:3016/{businessId}`

Replace `{businessId}` with a real ID from your database (one that has `GeneratedWebsite` + `contentJson`).

### 3. Run all templates (optional)

Open 10 terminals, or use the port list above. Each app is independent.

## Deploy to Vercel

1. Push this repo to GitHub
2. In Vercel: **Add New Project** → import repo
3. Set **Root Directory** to e.g. `templates/apps/scoutiq-retail-01`
4. Add env var: `NEXT_PUBLIC_API_URL=https://your-api.com`
5. Deploy — repeat for each of the 10 apps (10 Vercel projects)

Project names should match production URLs in `src/config/templates.ts`:

- `scoutiq-retail-01.vercel.app`
- etc.

Set `USE_LOCAL_TEMPLATES=false` (or remove) in production backend `.env`.

## Customizing a template

Each template shares the same page sections (Hero, Services, About, Contact, Footer) but has a unique **theme** in `site-shared/src/themes/`:

| Theme file | Controls |
|------------|----------|
| `heroGradient` | Hero background |
| `palette` | Default colors (AI colors override when present) |
| `heroLayout` | `centered` \| `split` \| `fullscreen` |
| `cardStyle` | `rounded` \| `sharp` \| `pill` |
| `dark` | Dark vs light mode |
| `fontHeading` / `fontBody` | Google Fonts (loaded in each app's `layout.tsx`) |

To customize **retail-01** only:

1. Edit `templates/site-shared/src/themes/index.ts` → `retail01` object
2. Or fork `scoutiq-retail-01` and change its `page.tsx` / add custom CSS

Regenerate app scaffolds after structural changes:

```bash
node templates/scripts/generate-apps.mjs
```

## Requirements

- ScoutIQ API running with at least one generated site
- CORS: API `FRONTEND_URL` does not affect templates — templates call `/sites/:id/content` directly (no auth)
- For local templates, API must be reachable at `NEXT_PUBLIC_API_URL`
