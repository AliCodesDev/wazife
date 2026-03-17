# Wazife — Claude Instructions

## Session Start
- Always read `progress.txt` at the start of every session to understand what's been done and what's next.
- Always update `progress.txt` at the end of every session with what was completed.

## Project
- Wazife (وظيفة) — interactive map of companies in Lebanon for job seekers
- See `prd.md` for full product spec and all design decisions

## Tech Stack
- React + Vite + TypeScript
- Tailwind CSS v4 (CSS-first config via @tailwindcss/vite plugin, no tailwind.config.js)
- Mapbox GL JS for the map
- Static JSON for company data (no backend)
- Deploying to Vercel

## Environment
- Mapbox token is in `.env` as `VITE_MAPBOX_TOKEN` — .env is gitignored, never commit it

## Code Structure
- `src/types/` — TypeScript interfaces (Company, IndustryCategory)
- `src/data/` — static data (companies.json, industries.ts)
- `src/components/` — React components
- `src/hooks/` — custom hooks
- `src/utils/` — helper functions

## Conventions
- Keep components simple and focused
- Use Tailwind classes for styling, no separate CSS files per component
- English UI, but company data can include Arabic (name_ar field)
