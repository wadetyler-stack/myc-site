# Muddy York Contracting — website build brief

You are building the new marketing site for **Muddy York Contracting**, a small renovation general contractor based in Etobicoke (west Toronto). The current domain redirects to Instagram, so this site starts from zero. Deploy target: **Netlify**, from this GitHub repo.

Everything you need is in this repo. Read `content/` before writing any page. Do not invent facts, reviews, prices, licences, warranties or years in business. If something isn't in `content/`, leave a clearly marked TODO.

## Goal
Homeowners in the west GTA find Muddy York (in Google and in AI answers), see real local proof (before/after photos by neighbourhood) and book a free consultation.

## Stack (recommended)
- **Astro** static site, content loaded from the JSON in `content/`. No CMS for v1.
- **Leaflet** + OpenStreetMap tiles for the map (no API key; keep the OSM attribution visible).
- A small before/after comparison slider component (vanilla JS or a light web component). No heavy UI framework.
- **Netlify Forms** for the contact/consultation form (`data-netlify="true"`, honeypot field, success page).
- Images are already web-ready WebP in `public/images/`: use `sm` (≤720 px) in grids and `lg` (≤1600 px) in lightboxes and heroes, with `srcset`, explicit `width`/`height`, and `loading="lazy"` below the fold.

## Content files
| File | What it is |
|---|---|
| `content/site.json` | Business facts: name, legal name, phone, email, hours, service area, process, testimonials. Each fact has a `status`. **Only publish `to_confirm` items once Tyler confirms them.** |
| `content/services.json` | The service landing pages: slug, summary, hero images, featured before/after project, proof points, known gaps. |
| `content/projects.json` | 87 jobs (posts already grouped into jobs). Each job has `images.before/during/after/detail` arrays, `hero_image`, `services`, `primary_service`, `neighbourhood`, `has_before_after`, `map_ready`, `scope`, `homeowner_goal`. |
| `content/neighbourhoods.json` | Map pins: one per neighbourhood with approximate centre coordinates and the job ids there. |
| `content/images.json` | Flat list of every web image with stage, service, hero flag and alt text (for galleries and filters). |
| `content/voice-guide.md` | How copy should sound. Follow it. |
| `data/images.csv` | Same as images.json, for humans reviewing in a spreadsheet. |
| `data/skipped.csv` | Instagram images deliberately left out (memes, team photos) or not downloaded. |

### Field rules
- `captions` and `file_original` are **internal reference only**. Never render them: they can contain street names and informal language. Use them to inform copy, rewritten per the voice guide.
- `scope` items are raw notes from captions; tidy them into readable bullet lists.
- `homeowner_goal` may be null. Don't fabricate one.
- `grouping` says how confident we are that several posts are the same job ("likely: ..." means unconfirmed). Fine to show grouped; don't claim it's one job in copy if it says "likely".

## Pages (v1)
1. **Home** — hero (pick from `services.json` heroes), one-line positioning, services grid (5), featured before/after slider, mini map teaser, process (4 steps from `site.json`), testimonials (only confirmed ones), CTA.
2. **Service pages** (`services.json`, 5 required + optional Commercial): intro, hero image, featured before/after slider (`featured_before_after` job), project grid of jobs whose `services` include the page id, the map filtered to that service, process, FAQ, CTA.
3. **Projects map** (`/projects/`): the full map (spec below) plus a filterable grid of all jobs (filter by service, has before/after).
4. **Project detail pages** (`/projects/[id]/`): title, neighbourhood (if any), date, goal, scope list, before / during / after galleries with lightbox, slider when both before and after exist, link to the original Instagram post(s), CTA. Generate one per job with at least one `after` image; others can stay in the grid only.
5. **About**: team, how they work, "not a design/build firm" note, commercial work as proof. Leave TODOs for team names/bios until confirmed.
6. **Contact / Book a consultation**: Netlify form (name, email, phone, neighbourhood, project type select matching the services, message, optional photo upload), phone, email, hours, service area list.

## The neighbourhood map (signature feature)
- One pin per neighbourhood from `neighbourhoods.json` (12 now). **Never** place pins at a street address or show anything more precise than the neighbourhood.
- Pin size or badge shows the number of jobs there.
- Clicking a pin opens a side panel (bottom sheet on mobile) listing that neighbourhood's jobs: title, date, primary service, hero thumbnail.
- Opening a job in the panel shows tabs **Before / During / After** (hide empty tabs) and a comparison slider when both before and after exist. Link to the full project page.
- Service filter chips above the map (All, Basements, Kitchens, Bathrooms, Decks & exterior, Whole home) that filter pins and panel contents.
- Only jobs with `map_ready: true` appear on the map (20 right now). Jobs with `neighbourhood: null` still appear in grids and service pages. Most 2021–2025 jobs are waiting on locations from the client, so the map will fill in as Tyler updates `projects.json` / `neighbourhoods.json`. Build so adding a neighbourhood is a data-only change.
- Coordinates in `neighbourhoods.json` are approximate centres. Fine for v1.
- Accessible: a "View as list" toggle that renders the same neighbourhood → jobs structure as plain HTML.

## SEO / GEO
- Unique `<title>` and meta description per page; descriptive, local ("Basement renovations in Etobicoke & the west GTA").
- JSON-LD: `GeneralContractor` (a `LocalBusiness` subtype) on every page with name, legal name, telephone, email, url, `areaServed` (from `site.json` service_area.core), openingHours, sameAs (socials). **No street address** (service-area business). Add `Service` schema on service pages and `FAQPage` where there are FAQs.
- Project pages: write specific, factual copy from `scope` and `homeowner_goal`: materials, rooms, problems solved. That specificity is what gets cited.
- Name, phone and email must be identical everywhere on the site (Tyler is aligning Google and Facebook to match).
- `sitemap.xml`, `robots.txt`, canonical URLs, Open Graph images (use the page hero `lg` image).
- Alt text is provided for every image. Use it.

## Brand
- Logo: `public/brand/logo-placeholder.png` is a low-res placeholder. Build so it's swappable for an SVG.
- Tagline: "From Concept To Creation".
- Visual direction TBD by Tyler. Default to clean, warm, photo-led: let the project photos carry the design.

## Netlify
- Build `npm run build`, publish `dist/`.
- Long cache headers for `/images/*` and `/video/*`.
- Form notifications go to the email in `site.json` (configured in the Netlify UI, not in code).

## Open items (don't block the build; leave TODOs)
- Neighbourhoods for 2021–2025 jobs (biggest gap; most of the best before/afters).
- Exact testimonial wording + permissions; Google reviews.
- Owner title, team names, start year, final service-area list.
- Vector logo and brand colours.
- 5 Instagram photos not yet downloaded (see `data/skipped.csv`).
