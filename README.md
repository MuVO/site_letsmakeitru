# Let's make IT — static site

Bilingual Astro site for GitHub Pages. Russian page is `/`, English page is `/en/`.

## Local development

```bash
npm ci
npm run dev
```

Build and preview the static output:

```bash
npm run build
npm run preview
```

The build output is `dist/`.

## GitHub Pages deployment

The workflow in `.github/workflows/deploy.yml` builds this repository root and publishes `dist/` on pushes to `main`.

Set these GitHub Actions repository variables for production builds:

- `SITE_DOMAIN`
- `CONTACT_EMAIL`
- `TELEGRAM_URL`
- `LINKEDIN_URL`
- `CONTACT_FUNCTION_URL`

These are public values embedded in the static site, not secrets. Telegram bot credentials belong only in the Yandex Cloud Function environment.
