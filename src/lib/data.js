import site from '../../content/site.json';
import services from '../../content/services.json';
import projects from '../../content/projects.json';
import neighbourhoods from '../../content/neighbourhoods.json';
import areas from '../../content/areas.json';
import faqs from '../../content/faqs.json';
import guides from '../../content/guides.json';

export { site, services, projects, neighbourhoods, areas, faqs, guides };

export const biz = site.business;
export const SITE_URL = 'https://muddyyorkcontracting.com';

/** The five marketed service pages (Commercial is shown as proof on About). */
export const mainServices = services.filter((s) => s.id !== 'commercial');
export const serviceById = Object.fromEntries(services.map((s) => [s.id, s]));
export const serviceLabel = (id) =>
  ({
    basements: 'Basements',
    kitchens: 'Kitchens',
    bathrooms: 'Bathrooms',
    'decks-exterior': 'Decks & exterior',
    'whole-home': 'Whole home',
    commercial: 'Commercial',
    mixed: 'Mixed',
  })[id] ?? id;

export const nbById = Object.fromEntries(neighbourhoods.map((n) => [n.id, n]));
export const projectById = Object.fromEntries(projects.map((p) => [p.id, p]));

/** Projects that get their own detail page (need at least one finished photo). */
export const hasPage = (p) => (p.images.after?.length ?? 0) > 0;
export const pagedProjects = projects.filter(hasPage);

export const projectUrl = (p) => (hasPage(p) ? `/projects/${p.id}/` : null);

/** Newest first. */
export const byDateDesc = (a, b) => (b.date_end || b.date_start).localeCompare(a.date_end || a.date_start);

export const fmtDate = (iso) => {
  if (!iso) return '';
  const [y, m] = iso.split('-');
  return new Date(Number(y), Number(m) - 1, 1).toLocaleDateString('en-CA', { month: 'long', year: 'numeric' });
};
export const year = (iso) => (iso ? iso.slice(0, 4) : '');

/** Card image: hero, else first after, else anything. */
export const cardImage = (p) =>
  p.hero_image ?? p.images.after?.[0] ?? p.images.detail?.[0] ?? p.images.during?.[0] ?? p.images.before?.[0];

/** Before/after pair for the slider, or null. */
export const beforeAfterPair = (p) => {
  const b = p.images.before?.[0];
  const a = p.hero_image && p.images.after?.some((x) => x.lg === p.hero_image.lg) ? p.hero_image : p.images.after?.at(-1);
  return b && a ? { before: b, after: a } : null;
};

/** Small images are ≤720px wide; srcset widths. */
export const smW = (img) => Math.min(720, img.w);
export const srcset = (img) => `${img.sm} ${smW(img)}w, ${img.lg} ${img.w}w`;

/** Neighbourhood → map-ready jobs, computed from projects so adding data is all that's needed. */
export function mapData() {
  const groups = {};
  for (const p of projects) {
    if (!p.map_ready || !p.neighbourhood || !nbById[p.neighbourhood]) continue;
    (groups[p.neighbourhood] ??= []).push(p);
  }
  return Object.entries(groups)
    .map(([id, list]) => {
      const n = nbById[id];
      return {
        id,
        name: n.name,
        area: n.area,
        lat: n.lat,
        lng: n.lng,
        jobs: list.sort(byDateDesc).map((p) => ({
          id: p.id,
          title: p.title,
          date: fmtDate(p.date_end || p.date_start),
          service: p.primary_service,
          services: p.services,
          serviceLabel: serviceLabel(p.primary_service),
          thumb: cardImage(p)?.sm,
          thumbAlt: cardImage(p)?.alt ?? '',
          url: projectUrl(p),
          stages: Object.fromEntries(
            ['before', 'during', 'after'].map((s) => [s, (p.images[s] ?? []).map((i) => ({ sm: i.sm, lg: i.lg, alt: i.alt }))]),
          ),
          pair: (() => {
            const pr = beforeAfterPair(p);
            return pr ? { before: pr.before.lg, after: pr.after.lg, beforeAlt: pr.before.alt, afterAlt: pr.after.alt } : null;
          })(),
        })),
      };
    })
    .sort((a, b) => b.jobs.length - a.jobs.length);
}

/** Tidy raw caption-derived scope notes into readable bullets. */
export function scopeBullets(p) {
  const out = [];
  const push = (t) => {
    t = t.trim().replace(/\s+/g, ' ').replace(/[.!]+$/, '');
    if (t) out.push(t.charAt(0).toUpperCase() + t.slice(1));
  };
  for (const raw of p.scope ?? []) {
    for (const clause of raw.split(/;/)) {
      const [lead, rest] = clause.includes(':') ? clause.split(/:(.*)/s) : [null, clause];
      if (lead) push(lead);
      // split on commas that aren't inside parentheses
      let depth = 0, cur = '';
      for (const ch of rest) {
        if (ch === '(') depth++;
        if (ch === ')') depth--;
        if (ch === ',' && depth === 0) { push(cur); cur = ''; } else cur += ch;
      }
      push(cur);
    }
  }
  return [...new Set(out)];
}

export const telHref = `tel:${biz.phone.e164}`;
export const mailHref = `mailto:${biz.email.value}`;
