/* eslint-disable @typescript-eslint/no-var-requires */

const fs = require('fs');
const path = require('path');
require('dotenv').config();

const ROOT_FOLDER = process.cwd();
const DATA_FOLDER = path.join(ROOT_FOLDER, 'data');
const PUBLIC_FOLDER = path.join(ROOT_FOLDER, 'public');

// Read pre-compiled list of routes
const { indexedPaths } = JSON.parse(
  fs.readFileSync(path.join(DATA_FOLDER, 'pathIndexConfig.json'))
);

// Format current date to `YYYY-MM-DD` format.
const now = new Date();
const formattedDateTime = [
  `${now.getUTCFullYear()}`,
  `${now.getUTCMonth() + 1}`.padStart(2, '0'),
  `${now.getUTCDate()}`.padStart(2, '0'),
].join('-');

const sitemapString = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${indexedPaths
    .map(
      (url) => `<url>
  <loc>${process.env.CANONICAL_URL}${url}</loc>
  <lastmod>${formattedDateTime}</lastmod>
  <priority>${url === '/' ? '1.0' : '0.5'}</priority>
</url>`
    )
    .join('\n  ')}
</urlset>`;

fs.writeFileSync(path.join(PUBLIC_FOLDER, 'sitemap.xml'), sitemapString, { encoding: 'utf8' });
