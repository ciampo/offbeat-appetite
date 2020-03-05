/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs');
const path = require('path');
const del = require('del');
const { promisify } = require('util');
const chalk = require('chalk');

const routesConfig = require('../routes-config.js');

const { sanityFetch } = require('./sanity-client');
const { allCategoriesQuery } = require('../queries/category');
const { allBlogPostsQuery } = require('../queries/blogPost');
const { allTagsQuery } = require('../queries/tag');
const { siteSettingsQuery } = require('../queries/siteSettings');
const { siteMiscContentQuery } = require('../queries/siteMiscContent');
const {
  pageHomeQuery,
  pageAboutQuery,
  pageCategoryQuery,
  pageBlogPostQuery,
  pageSearchQuery,
  pageGalleryQuery,
  pageThankYouQuery,
} = require('../queries/pages.js');

const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);
const existsAsync = promisify(fs.exists);
const mkdirAsync = promisify(fs.mkdir);

const ROOT_FOLDER = process.cwd();
const DATA_FOLDER = path.join(ROOT_FOLDER, 'data-sanity');

// TODO: swap placeholders (:category... :siteName...)
// Create UI links
// Add base64 thumbs?
// Merge category page info?

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

const getData = async () => {
  await cleanDataFolder();
  console.log(chalk.blue('Cleaned data folder'));

  await Promise.all(
    [
      {
        query: siteMiscContentQuery,
        onResultsFetched: (data) => saveToFile(data[0], 'siteMiscContent'),
      },
      {
        query: siteSettingsQuery,
        onResultsFetched: (data) => saveToFile(data[0], 'siteSettings'),
      },
      {
        query: pageHomeQuery,
        onResultsFetched: (data) => saveToFile(data[0], 'pageHome'),
      },
      {
        query: pageAboutQuery,
        onResultsFetched: (data) => saveToFile(data[0], 'pageAbout'),
      },
      {
        query: pageCategoryQuery,
        onResultsFetched: (data) => saveToFile(data[0], 'pageCategory'),
      },
      {
        query: pageBlogPostQuery,
        onResultsFetched: (data) => saveToFile(data[0], 'pageBlogPost'),
      },
      {
        query: pageSearchQuery,
        onResultsFetched: (data) => saveToFile(data[0], 'pageSearch'),
      },
      {
        query: pageGalleryQuery,
        onResultsFetched: (data) => saveToFile(data[0], 'pageGallery'),
      },
      {
        query: pageThankYouQuery,
        onResultsFetched: (data) => saveToFile(data[0], 'pageThankYou'),
      },
      {
        query: allBlogPostsQuery,
        onResultsFetched: (data) => saveToFile(data, 'blogPost'),
      },
      {
        query: allCategoriesQuery,
        // TODO: sort categories following siteSettings
        onResultsFetched: (data) => saveToFile(data, 'category'),
      },
      {
        query: allTagsQuery,
        onResultsFetched: (data) => saveToFile(data, 'tag'),
      },
    ].map(({ query, onResultsFetched }) => sanityFetch(query).then(onResultsFetched))
  );
};

getData();
