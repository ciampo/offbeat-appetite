# Netx.js Template Project

This is a template for a next.js project. Features:

- `Next.js`
- `yarn`
- typescript
- bundle analyzer used to help debugging code splitting modules
- `preact` used instead of `react` for smaller bundles
- styles written in CSS. Using `tailwind` (+ `autoprefixer`, `cssnano`, `purgecss`)
- styles linted by `stylelint`
- scripts linted by `eslint` / `prettier` / `tsc`
- git `hooks` (including pre-{commit, push} linting)
- page transitions (using `framer-motion`)
- get `contentful` data script (with sample typings)
- project wise variables stored in `.env`
- ie11 support w/ polyfills
- google analytics
- seo: comprehensive meta tags, favicons, webmanifest, preview sharing image, sitemap.xml,  robots.txt
- enhanced security `HTTP` headers (including CSP)
- app structure (w header nav, footer, main and alternative page layout)

## 🛠 Setup

- install `node` glolbally
- install `yarn` glolbally
- set up Contentful, Netlify and Google Analytics
- copy `.env.example` and rename it to `env`. Add the correct values for the env variables.
- add the same env variables to Netlify
- `yarn install`

## 📝 Main scripts

### `yarn dev`

Starts the application in development mode (hot-code reloading, error reporting, etc)

### `yarn data`

Pulls data from contentful (make sure you added env variables both into a `.env` and into your Netlify project)

### `yarn static`

Builds the app in production mode and exports it as static site ready to be hosted on Netlify.

### `yarn serve:static`

Serves the static site. The application should be compiled with `yarn static` first.

## 💬 Other scripts

### `yarn build`

Compiles the application for production deployment (SSR).

### `yarn serve:ssr`

Starts and serves the application in production mode. The application should be compiled with `yarn build` first.

### `yarn analyze`

Builds the app and opens 2 graphs in the browser showing the app's bundle composition.

### `yarn test`

Lints scripts and styles.

### `yarn test:fix`

Lints scripts and styles, and tries to auto-fix any errors.

## 👻 Contributors

- [Marco Ciampini](https://github.com/ciampo)
