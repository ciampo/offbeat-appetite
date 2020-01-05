/* eslint-disable @typescript-eslint/no-var-requires */

const fs = require('fs');
const path = require('path');
require('dotenv').config();

const routesConfig = require('../routes-config.js');

const ROOT_FOLDER = process.cwd();
const PUBLIC_FOLDER = path.join(ROOT_FOLDER, 'public');

const noIndexRoutes = routesConfig.filter((rc) => rc.noIndex);

const robotsString = `User-agent: *

${
  noIndexRoutes.length === 0
    ? 'Allow: /'
    : noIndexRoutes.map((rc) => `Disallow: ${rc.route}`).join('\n')
}

Sitemap: ${process.env.CANONICAL_URL}/sitemap.xml`;

fs.writeFileSync(path.join(PUBLIC_FOLDER, 'robots.txt'), robotsString, { encoding: 'utf8' });
