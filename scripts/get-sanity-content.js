/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs');
const path = require('path');
const del = require('del');
const { promisify } = require('util');
const chalk = require('chalk');

const routesConfig = require('../routes-config.js');
const { compileSingleRoute } = require('./compile-routes.js');

const { sanityFetch } = require('./sanity-client');
const { allCategoriesQuery, categoryType } = require('../queries/category');
const { allBlogPostsQuery, blogPostType } = require('../queries/blogPost');
const { allTagsQuery, tagType } = require('../queries/tag');
const { siteSettingsQuery, siteSettingsType } = require('../queries/siteSettings');
const { siteMiscContentQuery, siteMiscContentType } = require('../queries/siteMiscContent');
const {
  pageHomeType,
  pageHomeQuery,
  pageAboutType,
  pageAboutQuery,
  pageSearchType,
  pageSearchQuery,
  pageGalleryType,
  pageGalleryQuery,
  pageThankYouType,
  pageThankYouQuery,
} = require('../queries/pages.js');

const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);
const existsAsync = promisify(fs.exists);
const mkdirAsync = promisify(fs.mkdir);

const ROOT_FOLDER = process.cwd();
const DATA_FOLDER = path.join(ROOT_FOLDER, 'data-sanity');

// TODO: swap placeholders (:category... :siteName...)
// Add base64 thumbs?
// Merge Page data with single items data? (although it brings duplication)

async function cleanDataFolder() {
  if (await existsAsync(DATA_FOLDER)) {
    // Using `del` as fs.rmdir can not delete folders recursively.
    await del(DATA_FOLDER);
  }

  await mkdirAsync(DATA_FOLDER, { recursive: true });
}

async function saveToFile(data, name) {
  const fileName = `${name}.json`;
  await writeFileAsync(path.join(DATA_FOLDER, fileName), JSON.stringify(data, null, 2));
  console.info(`${chalk.blue('Saved to disk:')} ${chalk.cyan(fileName)}`);
}

async function generateNavLinks() {
  const siteSettings = JSON.parse(
    await readFileAsync(path.join(DATA_FOLDER, `${siteSettingsType}.json`), {
      encoding: 'utf-8',
    })
  );
  const navLinks = [];

  siteSettings.navItems.forEach(({ label, page: pageType }) => {
    const matchingRoute = routesConfig.find(({ dataType }) => pageType === dataType);
    if (matchingRoute) {
      // Array of { routeInfo, content }
      const compiledSingleRoute = compileSingleRoute(matchingRoute, label);
      navLinks.push(
        ...compiledSingleRoute.map(({ routeInfo, content }) => ({
          label: content,
          href: routeInfo.path,
        }))
      );
    }
  });

  saveToFile(navLinks, 'navLinks');
}

async function generatePathsIndexConfig() {
  const siteSettings = JSON.parse(
    await readFileAsync(path.join(DATA_FOLDER, `${siteSettingsType}.json`), {
      encoding: 'utf-8',
    })
  );
  const indexedPaths = [];
  const excludedPaths = [];

  routesConfig.forEach((routeConfig) => {
    const compiledPaths = compileSingleRoute(routeConfig).map(({ path }) => path);
    if (siteSettings.noIndexPages.findIndex((pageType) => pageType === routeConfig.dataType) > -1) {
      excludedPaths.push(...compiledPaths);
    } else {
      indexedPaths.push(...compiledPaths);
    }
  });

  saveToFile({ indexedPaths, excludedPaths }, 'pathIndexConfig');
}

async function getData() {
  await cleanDataFolder();
  console.log(chalk.blue('Cleaned data folder'));

  console.log(chalk.blue('\nDownloading data from Sanity...'));
  await Promise.all(
    [
      {
        query: siteMiscContentQuery,
        onResultsFetched: (data) => saveToFile(data[0], siteMiscContentType),
      },
      {
        query: siteSettingsQuery,
        onResultsFetched: (data) => saveToFile(data[0], siteSettingsType),
      },
      {
        query: pageHomeQuery,
        onResultsFetched: (data) => saveToFile(data[0], pageHomeType),
      },
      {
        query: pageAboutQuery,
        onResultsFetched: (data) => saveToFile(data[0], pageAboutType),
      },
      {
        query: pageSearchQuery,
        onResultsFetched: (data) => saveToFile(data[0], pageSearchType),
      },
      {
        query: pageGalleryQuery,
        onResultsFetched: (data) => saveToFile(data[0], pageGalleryType),
      },
      {
        query: pageThankYouQuery,
        onResultsFetched: (data) => saveToFile(data[0], pageThankYouType),
      },
      {
        query: allBlogPostsQuery,
        onResultsFetched: (data) => saveToFile(data, blogPostType),
      },
      {
        query: allCategoriesQuery,
        // TODO: sort categories following siteSettings
        onResultsFetched: (data) => saveToFile(data, categoryType),
      },
      {
        query: allTagsQuery,
        onResultsFetched: (data) => saveToFile(data, tagType),
      },
    ].map(({ query, onResultsFetched }) => sanityFetch(query).then(onResultsFetched))
  );

  console.log(chalk.blue('\nProcessing data...'));
  // TODO: swap placeholders

  console.log(chalk.blue('\nGenerating derived data...'));
  // TODO: generate dynamic routes related shit
  await Promise.all([generateNavLinks(), generatePathsIndexConfig()]);
}

getData();
