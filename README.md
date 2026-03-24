# Savvy Fraud Intelligence

Dark intelligence operations interface for fraud monitoring, alert triage, case investigation, entity review, and regulatory reporting.

This repo now runs as a Vercel-native `Next.js + TypeScript` frontend. The previous Streamlit prototype and Python model artifacts have been removed.

## Screens

- `Dashboard / Command Centre`
- `Alert Queue`
- `Case Manager`
- `Entity Search`
- `Reporting`
- `Audit Logs`

## Design Direction

The UI follows the `Sovereign Analyst` direction:

- dark tonal surfaces
- architectural layout instead of dashboard-template grids
- Public Sans typography
- lavender-blue operational accent
- isolated pink-red risk signaling
- left rail plus centered command bar
- dossier-style intelligence modules

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Production (Vercel)

1. Import this repo in the [Vercel dashboard](https://vercel.com/new).
2. Framework preset: **Next.js** (default).
3. Build command: `npm run build` · Output: Next.js default (no static `out/` unless you enable `output: "export"`).

### Verify locally before deploy

```bash
npm run lint
npm run build
npm run start
```

Open `http://localhost:3000` and confirm production mode.

## Design References

- `STITCH_MOCKUP_PROMPTS.md`
- External design spec: keep your `DESIGN.md` alongside the project or in team docs (do not commit machine-specific paths).

## Notes

- The current implementation is a frontend prototype with curated mock intelligence data.
- It is structured to support replacement with live API-backed data later.
