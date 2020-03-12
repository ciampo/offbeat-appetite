/* eslint-disable @typescript-eslint/no-var-requires */

const fs = require('fs');
const path = require('path');
require('dotenv').config();

const ROOT_FOLDER = process.cwd();
const DATA_FOLDER = path.join(ROOT_FOLDER, 'data');
const PUBLIC_FOLDER = path.join(ROOT_FOLDER, 'public');

const { excludedPaths } = JSON.parse(
  fs.readFileSync(path.join(DATA_FOLDER, 'pathIndexConfig.json'))
);

const robotsString = `User-agent: *

${
  excludedPaths.length === 0
    ? 'Allow: /'
    : excludedPaths.map((route) => `Disallow: ${route}`).join('\n')
}

Sitemap: ${process.env.CANONICAL_URL}/sitemap.xml`;

fs.writeFileSync(path.join(PUBLIC_FOLDER, 'robots.txt'), robotsString, { encoding: 'utf8' });
