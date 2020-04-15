# The Offbeat Appetite website

[![Netlify Status](https://api.netlify.com/api/v1/badges/8a466cb6-4eef-463d-81be-18240576884d/deploy-status)](https://app.netlify.com/sites/offbeatappetite/deploys)

[![Build Status](https://travis-ci.org/ciampo/offbeat-appetite.svg?branch=master)](https://travis-ci.org/ciampo/offbeat-appetite)

TL;DR:

- [Sanity](https://sanity.io) as Headless CMS
  ([repo here](https://github.com/ciampo/offbeat-appetite-sanity))
- [Next.js](https://nextjs.org/) as Static Site Generator
- [Netlify](https://www.netlify.com/) as Static Site Hosting

## 🛠 Setup

- install `node` glolbally
- install `yarn` glolbally
- set up Sanity, Netlify and Google Analytics
- copy `.env.example` and rename it to `env`. Add the correct values for the env variables.
- add the same env variables to Netlify
- `yarn install`

## 📝 Main scripts

### `yarn dev`

Starts the application in development mode (hot-code reloading, error reporting, etc)

### `yarn data`

Pulls data from Sanity (make sure you added env variables both into a `.env` and into your Netlify
project)

### `yarn static`

Builds the app in production mode and exports it as static site ready to be hosted on Netlify.

### `yarn serve:static`

Serves the static site. The application should be compiled with `yarn static` first.

## 💬 Other scripts

### `yarn build`

Compiles the application for production deployment (SSR).

### `yarn serve:ssr`

Starts and serves the application in production mode. The application should be compiled with
`yarn build` first.

### `yarn analyze`

Builds the app and opens 2 graphs in the browser showing the app's bundle composition.

### `yarn test`

Lints scripts and styles.

### `yarn test:fix`

Lints scripts and styles, and tries to auto-fix any errors.

## ⚖️ Staging vs Production deploys

The [`staging`](https://app.netlify.com/sites/offbeatappetite-staging) and
[`production`](https://app.netlify.com/sites/offbeatappetite) sites **are hosted on Netlify and are
both _static sites_**. Both projects are deployed via a CI/CD pipeline triggered by new commits to
the master branch on this repo.

There are a few differences between the staging and production sites:

| Feature (via env variables) | Dev (local) | Staging  | Production |
| :-------------------------: | :---------: | :------: | :--------: |
|      Google Analytics       |   staging   | staging  |    prod    |
|       Subscribe Form        |   enabled   | disabled |  enabled   |
|   Sanity Token for drafts   |     Yes     |   Yes    |     No     |
|        Canonical URL        |    prod     | staging  |    prod    |

## 👻 Contributors

- [Marco Ciampini](https://github.com/ciampo)
- [Marie Claire Tonna](https://github.com/mctonna)
