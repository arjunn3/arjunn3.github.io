// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://arjunn3.github.io',
  trailingSlash: 'always',
  build: { format: 'directory' },
  integrations: [
    sitemap({
      // the 404 page isn't a real page; match its exact path only
      filter: (page) => !['/404/', '/404'].includes(new URL(page).pathname),
    }),
  ],
});
