# Wazife (وظيفة) — Product Requirements Document

## Overview

Wazife is a web app that visualizes companies in Lebanon on an interactive map. Users can filter by industry to discover companies relevant to their job search, view company details, and access their websites or contact information directly.

The app addresses a real gap in the Lebanese job market: LinkedIn and other platforms are ineffective locally, and most young people find jobs through word-of-mouth or cold outreach. Wazife makes the "which companies exist and where are they?" question easy to answer.

## Problem

- Job platforms (LinkedIn, Bayt, etc.) have low adoption and poor coverage in Lebanon
- Young job seekers rely on personal networks and cold emails to find opportunities
- There is no centralized, visual directory of Lebanese companies organized by industry
- Students and recent graduates waste time researching companies one by one

## Target Users

- University students and recent graduates in Lebanon looking for jobs or internships
- Young professionals exploring companies in their industry
- Anyone relocating within Lebanon who wants to understand the local job landscape

## MVP Scope

### Core Features

1. **Interactive Map**
   - Full map of Lebanon using Mapbox GL JS
   - Default view: zoomed out to show all of Lebanon
   - Company locations displayed as pins/markers
   - Clustered markers when zoomed out to avoid clutter
   - Smooth zoom and pan navigation
   - Light and dark theme toggle (Mapbox styles for both)

2. **Company Markers**
   - Each marker represents one company
   - Color-coded by primary industry category
   - Companies can belong to multiple industries (1-3 tags); primary tag determines marker color
   - Click a marker to open a bottom card with company details

3. **Company Details — Bottom Card**
   - Slides up from the bottom of the screen (works on both mobile and desktop)
   - Displays:
     - Company name (+ Arabic name if available)
     - Industry tags
     - Location (city/area)
     - Brief description (1-2 sentences)
     - Website URL — opens in new tab on click
     - Contact email (if available)
     - Careers page link (if available)

4. **Industry Filter — Collapsible Sidebar**
   - Sidebar on the left, open by default on desktop, collapsible via toggle button
   - All industries start **unselected** — map shows an onboarding prompt on first load:
     _"Select industries to get started"_
   - Toggle industries on/off to filter map markers
   - Visual indicator of active filters (count badge, highlighted chips)
   - "Show All" / "Clear Filters" buttons
   - **Mobile**: filters appear as a top dropdown bar with horizontal scrolling industry chips

5. **Search — Autocomplete**
   - Search bar at the top of the page
   - Autocomplete dropdown shows matching company names as user types
   - Selecting a result flies the map to that company's marker and opens its bottom card

6. **List View**
   - Toggle between map view and list/table view
   - List view shows all filtered companies in a sortable table
   - Sort options: by name (A-Z), by industry, by city/region
   - User selects sort via a dropdown

7. **Shareable URLs**
   - Filter state is encoded in URL query parameters
   - Example: `wazife.app/?industry=tech,finance&view=list`
   - Users can share filtered views via WhatsApp, etc.

### Industry Categories (initial set)

- Technology / Software
- Finance / Banking
- Healthcare / Pharmacy
- Law / Legal
- Engineering / Construction
- Education
- Marketing / Advertising
- Hospitality / Tourism
- Retail / E-commerce
- NGOs / International Organizations
- Media / Entertainment
- Other

## Tech Stack

| Layer       | Choice                  | Reason                                      |
|-------------|-------------------------|---------------------------------------------|
| Framework   | React (Vite)            | Fast, simple, no SSR needed for MVP         |
| Map         | Mapbox GL JS            | High-quality tiles, good DX, free tier      |
| Styling     | Tailwind CSS            | Rapid UI development                        |
| Data        | Static JSON file        | No backend needed for MVP                   |
| Deployment  | Vercel                  | Best React/Vite support, free tier, preview deploys |
| Language    | TypeScript              | Type safety for company data structures     |
| Analytics   | Vercel Analytics        | Lightweight, privacy-friendly, built-in     |

## Data Model

```typescript
type IndustryCategory =
  | "technology"
  | "finance"
  | "healthcare"
  | "law"
  | "engineering"
  | "education"
  | "marketing"
  | "hospitality"
  | "retail"
  | "ngo"
  | "media"
  | "other";

interface Company {
  id: string;
  name: string;
  name_ar?: string;              // Arabic name (optional)
  industries: IndustryCategory[]; // 1-3 industry tags
  description: string;
  latitude: number;
  longitude: number;
  city: string;
  website?: string;
  email?: string;
  careers_url?: string;
  phone?: string;
}
```

## Data Strategy

The data challenge is the biggest risk for this project. A phased approach:

### Phase 1 — Manual Seed Dataset
- Research and manually compile 50–100 companies across industries
- Sources to use:
  - Lebanese Chamber of Commerce directories
  - Industry-specific associations (e.g., Lebanon's tech ecosystem lists)
  - University career center employer lists (LAU, AUB, USJ, etc.)
  - Personal knowledge and word-of-mouth
  - Company websites and Google Maps searches by area (Beirut, Jounieh, Tripoli, etc.)
- Store as a structured JSON file in the repo

### Phase 2 — Community Contributions
- Add a "Submit a Company" form (Google Form or simple in-app form)
- Manual review before adding to the dataset
- Encourage sharing on university WhatsApp groups and social media

### Phase 3 — Scraping & Enrichment (future)
- Scrape public business directories (e.g., Lebanese Yellow Pages, Kompass)
- Enrich data with LinkedIn company pages, Google Places API
- Automate geocoding for addresses without coordinates

## UI / UX

### Desktop Layout
```
┌─────────────────────────────────────────────────────┐
│  🔍 Search (autocomplete)    [Map|List] [🌙 Theme] │
├───────────┬─────────────────────────────────────────┤
│           │                                         │
│ Industry  │         Mapbox Map                      │
│ Filters   │         (pins/markers)                  │
│ (collaps- │                                         │
│  ible)    │   ── or ──                              │
│           │                                         │
│ [<] hide  │         Sortable List View              │
│           │                                         │
├───────────┴─────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────┐    │
│  │ Company Name          ✕                     │    │
│  │ Tech · Finance · Beirut                     │    │
│  │ Description text here...                    │    │
│  │ 🔗 website.com  · 📧 email · 💼 Careers   │    │
│  └─────────────────────────────────────────────┘    │
├─────────────────────────────────────────────────────┤
│  Footer: About | Submit a Company | GitHub          │
└─────────────────────────────────────────────────────┘
```

### Mobile Layout
```
┌────────────────────────┐
│ 🔍 Search   [Map|List] │
├────────────────────────┤
│ [Tech] [Finance] [Law] │  ← horizontal scrolling chips
│ [Health] [NGO] [More]  │
├────────────────────────┤
│                        │
│      Mapbox Map        │
│      (or List View)    │
│                        │
│                        │
├────────────────────────┤
│ ┌────────────────────┐ │
│ │ Company Card       │ │  ← slides up from bottom
│ │ Details + links    │ │
│ └────────────────────┘ │
└────────────────────────┘
```

### First-Load Experience
- All industries are unselected on first visit
- Map displays with a centered onboarding prompt: **"Select industries to get started"**
- Once user selects at least one industry, markers appear and the prompt disappears

### Design Principles
- Clean, minimal — modern/neutral palette (blues, grays, single accent color)
- The map is the main focus
- Mobile-responsive (sidebar → top chips, detail popup → bottom card)
- Fast load times — no heavy dependencies beyond Mapbox
- English UI with Arabic data support (company names/descriptions can be in Arabic)
- All external links open in a new tab

## Non-Goals (for MVP)

- User accounts or authentication
- Job listing aggregation
- Company reviews or ratings
- Real-time data updates
- Backend API or database
- Notifications or alerts
- Company size/employee count
- Full Arabic UI / RTL layout

## Success Metrics

- Number of companies listed (target: 100+ at launch)
- Page views and unique visitors (via Vercel Analytics)
- Shares on WhatsApp / social media
- "Submit a Company" form submissions
- User feedback from university communities

## Open Questions

- [ ] Mapbox API key — need to create a free account at mapbox.com
- [ ] Final list of industry categories — refine based on actual data
- [ ] Domain name — wazife.com / wazife.io / wazife.app availability
- [ ] How to best geocode company addresses that don't have lat/lng

## Milestones

1. **M1 — Skeleton**: Project setup (Vite + React + TS + Tailwind + Mapbox), map rendering with Lebanon in view, light/dark toggle
2. **M2 — Data**: Seed dataset of 50+ companies in JSON, data model types
3. **M3 — Core UX**: Markers on map, bottom card detail view, collapsible sidebar filters, onboarding prompt
4. **M4 — Search & List**: Autocomplete search, list view toggle with sorting, URL query params for sharing
5. **M5 — Polish**: Marker clustering, mobile responsive (top chips, bottom card), Vercel Analytics
6. **M6 — Launch**: Deploy to Vercel, share with university communities
