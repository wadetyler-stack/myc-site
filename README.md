# muddyyorkcontracting.com

Astro static site for Muddy York Contracting. Deployed on Netlify from `main`.

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # outputs dist/
```

## How it's put together
- `content/` holds all the data. Pages are generated from it, so most updates are JSON edits, not code.
  - `site.json`: business facts, process, testimonials, service area
  - `services.json`: the 5 service pages (Commercial is shown on About only)
  - `projects.json`: 87 jobs. One page per job with at least one `after` photo (68 pages)
  - `neighbourhoods.json`: map pin locations
  - `areas.json`: area pages (Etobicoke, West End Toronto, Mississauga)
  - `faqs.json`: FAQ answers (confirmed facts only)
  - `guides.json`: cost guides (drafts until real prices are added)
- Service page copy lives in `src/lib/copy.js`.
- `CLAUDE.md` is the original build brief.

## Common updates
**Put a project on the map:** in `projects.json`, set the job's `neighbourhood` to an id from `neighbourhoods.json` and set `map_ready: true`. To add a new area, add an entry to `neighbourhoods.json` with an approximate centre (`lat`, `lng`). Pins only ever show the neighbourhood, never an address.

**Publish a cost guide:** add real price ranges to the guide page template, then set `"published": true` in `guides.json`, and remove `/guides/` from `robots.txt` and from `DRAFT_PATHS` in `astro.config.mjs`.

**Swap in the real logo:** replace the markup in `src/components/LogoBadge.astro` (currently a vector redraw of the low-res placeholder) and `public/favicon.svg`.

## Launch checklist
- [ ] Vector logo from Dylan (current one is a redraw)
- [ ] Blake's surname for the About page and schema (`site.json` → `business.founders`)
- [ ] Neighbourhoods for the 2021–2025 jobs, so they show on the map
- [ ] Price ranges for the three cost guides (`/guides/...`, currently noindex drafts)
- [ ] Confirm who pulls permits and supplies engineering for wall removal (`/load-bearing-wall-removal/`)
- [ ] Netlify form notifications → dylan@muddyyorkcontracting.com
- [ ] Point the GoDaddy domain at Netlify **without touching the MX/email records** (email is hosted at GoDaddy)
- [ ] Ask 3–5 past clients for Google reviews
