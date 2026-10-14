import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { site } from './src/data/site.js';

export default defineConfig({
  site: site.url,
  build: {
    format: 'file',
    inlineStylesheets: 'never',
  },
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/demos/'),
      serialize: (item) => ({
        ...item,
        url: item.url.endsWith('/') ? item.url : `${item.url}.html`,
      }),
    }),
  ],
  devToolbar: { enabled: false },
});
