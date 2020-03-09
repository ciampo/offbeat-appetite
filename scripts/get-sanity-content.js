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

const CATEGORIES_FOLDERNAME = 'categories';
const POSTS_FOLDERNAME = 'posts';
const ROOT_FOLDER = process.cwd();
const DATA_FOLDER = path.join(ROOT_FOLDER, 'data-sanity');
const POSTS_FOLDER = path.join(DATA_FOLDER, POSTS_FOLDERNAME);
const CATEGORIES_FOLDER = path.join(DATA_FOLDER, CATEGORIES_FOLDERNAME);

let siteName;
let categoriesOrder;

async function cleanDataFolder() {
  if (await existsAsync(DATA_FOLDER)) {
    // Using `del` as fs.rmdir can not delete folders recursively.
    await del(DATA_FOLDER);
  }

  await mkdirAsync(DATA_FOLDER, { recursive: true });
  await mkdirAsync(POSTS_FOLDER, { recursive: true });
  await mkdirAsync(CATEGORIES_FOLDER, { recursive: true });
}

async function saveToFile(data, name) {
  const fileName = `${name}.json`;
  let dataAsString = JSON.stringify(data, null, 2);
  if (siteName) {
    dataAsString = dataAsString.replace(/:siteName/g, siteName);
  }
  await writeFileAsync(path.join(DATA_FOLDER, fileName), dataAsString);
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
  // First, download siteSettings and siteMiscContent as they contain some data
  // used in processing the rest of the downloaded content (siteName and categoriesOrder)
  await Promise.all(
    [
      {
        query: siteMiscContentQuery,
        onResultsFetched: async (data) => {
          siteName = data[0].siteName;
          await saveToFile(data[0], siteMiscContentType);
        },
      },
      {
        query: siteSettingsQuery,
        onResultsFetched: async (data) => {
          categoriesOrder = data[0].categoriesOrder;
          await saveToFile(data[0], siteSettingsType);
        },
      },
    ].map(({ query, onResultsFetched }) => sanityFetch(query).then(onResultsFetched))
  );

  // Then, download all other data and swap placeholder content as needed.
  await Promise.all(
    [
      {
        query: siteSettingsQuery,
        onResultsFetched: async (data) => await saveToFile(data[0], siteSettingsType),
      },
      {
        query: pageHomeQuery,
        onResultsFetched: async (data) => await saveToFile(data[0], pageHomeType),
      },
      {
        query: pageAboutQuery,
        onResultsFetched: async (data) => await saveToFile(data[0], pageAboutType),
      },
      {
        query: pageSearchQuery,
        onResultsFetched: async (data) => await saveToFile(data[0], pageSearchType),
      },
      {
        query: pageGalleryQuery,
        onResultsFetched: async (data) => await saveToFile(data[0], pageGalleryType),
      },
      {
        query: pageThankYouQuery,
        onResultsFetched: async (data) => await saveToFile(data[0], pageThankYouType),
      },
      {
        query: allBlogPostsQuery,
        onResultsFetched: async (allBlogPostsData) => {
          const allBlogPostsReplacedData = [];

          // TODO: sort
          for (const blogPostData of allBlogPostsData) {
            const replacedData = JSON.parse(
              JSON.stringify(blogPostData)
                .replace(/:blogPostTitle/g, blogPostData.title)
                .replace(/:blogPostExcerpt/g, blogPostData.excerpt)
                .replace(/:categoryName/g, blogPostData.category.name)
            );
            allBlogPostsReplacedData.push(replacedData);
            await saveToFile(replacedData, path.join(POSTS_FOLDERNAME, blogPostData.slug));
          }

          await saveToFile(allBlogPostsReplacedData, blogPostType);
        },
      },
      {
        query: allCategoriesQuery,
        onResultsFetched: async (allCategoriesData) => {
          // Sorting according to SiteSettings.
          allCategoriesData.sort(
            (c1, c2) =>
              categoriesOrder.findIndex((cat) => cat === c1.slug) -
              categoriesOrder.findIndex((cat) => cat === c2.slug)
          );

          const allCategoriesReplacedData = [];
          for (const categoryData of allCategoriesData) {
            const replacedData = JSON.parse(
              JSON.stringify(categoryData).replace(/:categoryName/g, categoryData.name)
            );
            allCategoriesReplacedData.push(replacedData);
            await saveToFile(replacedData, path.join(CATEGORIES_FOLDERNAME, categoryData.slug));
          }

          await saveToFile(allCategoriesReplacedData, categoryType);
        },
      },
      {
        query: allTagsQuery,
        onResultsFetched: async (data) => await saveToFile(data, tagType),
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
