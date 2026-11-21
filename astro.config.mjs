import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Draft pages (cost guides waiting on real prices) stay out of the sitemap.
const DRAFT_PATHS = ['/guides/'];

export default defineConfig({
  site: 'https://muddyyorkcontracting.com',
  trailingSlash: 'always',
  build: { format: 'directory' },
  integrations: [
    sitemap({
      filter: (page) => !DRAFT_PATHS.some((p) => page.includes(p)) && !page.includes('/thanks/'),
    }),
  ],
});
