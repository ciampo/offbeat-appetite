/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs');
const path = require('path');
const del = require('del');
const { promisify } = require('util');
const chalk = require('chalk');

const routesConfig = require('../routes-config.js');
const { compileSingleRoute, compileDynamicItem } = require('./compile-routes.js');

const { sanityFetch } = require('../sanity/client');
const { allCategoriesQuery, categoryType, replaceCategoryContent } = require('../sanity/category');
const {
  allBlogPostsQuery,
  allBlogPostPreviewsQuery,
  blogPostType,
  replaceBlogPostContent,
} = require('../sanity/blogPost');
const { allTagsQuery, tagType } = require('../sanity/tag');
const { siteSettingsQuery, siteSettingsType } = require('../sanity/siteSettings');
const { siteMiscContentQuery, siteMiscContentType } = require('../sanity/siteMiscContent');
const {
  pageHomeType,
  pageHomeQuery,
  pageAboutType,
  pageAboutQuery,
  pageSearchType,
  pageSearchQuery,
  pageCategoryType,
  pageCategoryQuery,
  pageThankYouType,
  pageThankYouQuery,
} = require('../sanity/pages.js');

const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);
const existsAsync = promisify(fs.exists);
const mkdirAsync = promisify(fs.mkdir);

const CATEGORIES_FOLDERNAME = 'categories';
const POSTS_FOLDERNAME = 'posts';
const ROOT_FOLDER = process.cwd();
const DATA_FOLDER = path.join(ROOT_FOLDER, 'data');
const POSTS_FOLDER = path.join(DATA_FOLDER, POSTS_FOLDERNAME);
const CATEGORIES_FOLDER = path.join(DATA_FOLDER, CATEGORIES_FOLDERNAME);
const BLOGPOST_PAGE_ROUTE = '/[categoryId]/[postId]';
const CATEGORY_PAGE_ROUTE = '/[categoryId]';

const blogPostRoute = routesConfig.find(({ route }) => route === BLOGPOST_PAGE_ROUTE);
const categoryRoute = routesConfig.find(({ route }) => route === CATEGORY_PAGE_ROUTE);
const homeRoute = routesConfig.find(({ route }) => route === '/');
const aboutRoute = routesConfig.find(({ route }) => route === '/about');

let siteName;
let categoriesOrder;

let previewBlogPostsData;

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
  // Categories
  const categoryRoute = routesConfig.find(({ dataType }) => dataType === pageCategoryType);
  const categoryPage = JSON.parse(
    await readFileAsync(path.join(DATA_FOLDER, `${categoryRoute.dataType}.json`), {
      encoding: 'utf-8',
    })
  );
  const categoryItems = JSON.parse(
    await readFileAsync(path.join(DATA_FOLDER, `${categoryRoute.dynamicDataType}.json`), {
      encoding: 'utf-8',
    })
  );
  const compiledCategories = compileSingleRoute({
    routeConfig: categoryRoute,
    dynamicItemsData: categoryItems,
  });

  // Home page
  const homeRoute = routesConfig.find(({ dataType }) => dataType === pageHomeType);
  // const homePage = JSON.parse(
  //   await readFileAsync(path.join(DATA_FOLDER, `${homeRoute.dataType}.json`), {
  //     encoding: 'utf-8',
  //   })
  // );

  // About page
  const aboutRoute = routesConfig.find(({ dataType }) => dataType === pageAboutType);
  const aboutPage = JSON.parse(
    await readFileAsync(path.join(DATA_FOLDER, `${aboutRoute.dataType}.json`), {
      encoding: 'utf-8',
    })
  );

  // Search page
  const searchRoute = routesConfig.find(({ dataType }) => dataType === pageSearchType);
  const searchPage = JSON.parse(
    await readFileAsync(path.join(DATA_FOLDER, `${searchRoute.dataType}.json`), {
      encoding: 'utf-8',
    })
  );

  const navLinks = {
    beforeLogo: [
      ...compiledCategories.map(({ routeInfo }) => {
        const categoryItem = categoryItems.find(({ slug }) => slug === routeInfo.query.categoryId);

        return {
          href: routeInfo.page,
          as: routeInfo.path,
          label: replaceCategoryContent(categoryItem, categoryPage.title),
        };
      }),
    ],
    logo: [
      {
        href: homeRoute.route,
        label: 'Home',
      },
    ],
    afterLogo: [
      {
        href: aboutRoute.route,
        label: aboutPage.title,
      },
      {
        href: searchRoute.route,
        label: searchPage.title,
      },
    ],
  };

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
    let dynamicItemsData = null;
    if (routeConfig.dynamicDataType) {
      dynamicItemsData = JSON.parse(
        fs.readFileSync(path.join(DATA_FOLDER, `${routeConfig.dynamicDataType}.json`), {
          encoding: 'utf8',
        })
      );
    }
    const compiledPaths = compileSingleRoute({
      routeConfig,
      dynamicItemsData,
    }).map(({ routeInfo }) => routeInfo.path);

    if (siteSettings.noIndexPages.findIndex((pageType) => pageType === routeConfig.dataType) > -1) {
      excludedPaths.push(...compiledPaths);
    } else {
      indexedPaths.push(...compiledPaths);
    }
  });

  saveToFile({ indexedPaths, excludedPaths }, 'pathIndexConfig');
}

function augmentBlogPostWithCompiledRoute(blogPost) {
  const compiledBlogPostRoute = compileDynamicItem({
    routeConfig: blogPostRoute,
    dynamicItem: blogPost,
  });

  return {
    ...blogPost,
    compiledRoute: compiledBlogPostRoute.routeInfo,
  };
}

function compilePortableTextInternalLinks(subTree) {
  if (typeof subTree !== 'object') {
    return;
  }

  function compileInternalLink(internalLinkObj) {
    let routeConfig;
    if (internalLinkObj._type === 'blogPost') {
      routeConfig = blogPostRoute;
    } else if (internalLinkObj._type === 'category') {
      routeConfig = categoryRoute;
    } else if (internalLinkObj._type === 'pageHome') {
      routeConfig = homeRoute;
    } else if (internalLinkObj._type === 'pageAbout') {
      routeConfig = aboutRoute;
    }

    if (!routeConfig) {
      return;
    }

    const compiledBlogPostRoute = compileDynamicItem({
      routeConfig,
      dynamicItem: internalLinkObj,
    });

    if (compiledBlogPostRoute) {
      internalLinkObj.routeInfo = compiledBlogPostRoute.routeInfo;
    }
  }

  if (Array.isArray(subTree)) {
    subTree.forEach(compilePortableTextInternalLinks);
  } else if (Object.prototype.hasOwnProperty.call(subTree, 'markDefs')) {
    subTree.markDefs.forEach((markDef) => {
      if (markDef._type === 'internalLink') {
        // Internal links in portable text
        compileInternalLink(markDef.reference);
      }
    });
  } else if (Object.prototype.hasOwnProperty.call(subTree, 'ingredients')) {
    subTree.ingredients.forEach((ingredient) => {
      if (Object.prototype.hasOwnProperty.call(ingredient, 'internalLink')) {
        // Internal links in recipe ingredients
        compileInternalLink(ingredient.internalLink);
      }
    });
  } else {
    Object.values(subTree).forEach(compilePortableTextInternalLinks);
  }
}

function addRelatedPosts(blogPostsContent) {
  const matchingBlogPosts = {};

  for (const currentBlogPost of blogPostsContent) {
    matchingBlogPosts[currentBlogPost._id] = {};

    for (const otherBlogPost of blogPostsContent) {
      if (otherBlogPost._id === currentBlogPost._id) {
        continue;
      }

      for (const cbpTag of currentBlogPost.tags) {
        for (const obpTag of otherBlogPost.tags) {
          if (cbpTag._id === obpTag._id) {
            if (!(otherBlogPost._id in matchingBlogPosts[currentBlogPost._id])) {
              const matchingPreviewBlogPostObject = previewBlogPostsData.find(
                (pbp) => otherBlogPost._id === pbp._id
              );

              matchingBlogPosts[currentBlogPost._id][otherBlogPost._id] = {
                data: matchingPreviewBlogPostObject,
                count: 0,
              };
            }

            matchingBlogPosts[currentBlogPost._id][otherBlogPost._id].count += 1;
          }
        }
      }
    }
  }

  for (const currentBlogPost of blogPostsContent) {
    const relatedBlogPosts = Object.values(matchingBlogPosts[currentBlogPost._id])
      // Sort by higher number of matching tags, and by more recently published in case of draw
      .sort((a, b) => {
        if (b.count !== a.count) {
          return b.count - a.count;
        }

        return new Date(b.data.datePublished) - new Date(a.data.datePublished);
      })
      .slice(0, 3)
      .map((obj) => augmentBlogPostWithCompiledRoute(obj.data));

    currentBlogPost.relatedBlogPosts = relatedBlogPosts;
  }
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
        onResultsFetched: async (data) => {
          for (const categorySection of data[0].categorySections) {
            categorySection.category.featuredBlogPosts = categorySection.category.featuredBlogPosts.map(
              augmentBlogPostWithCompiledRoute
            );
          }

          await saveToFile(data[0], pageHomeType);
        },
      },
      {
        query: pageAboutQuery,
        onResultsFetched: async (data) => {
          compilePortableTextInternalLinks(data[0].content);
          await saveToFile(data[0], pageAboutType);
        },
      },
      {
        query: pageSearchQuery,
        onResultsFetched: async (data) => {
          await saveToFile(data[0], pageSearchType);
        },
      },
      {
        query: pageCategoryQuery,
        onResultsFetched: async (data) => await saveToFile(data[0], pageCategoryType),
      },
      {
        query: pageThankYouQuery,
        onResultsFetched: async (data) => {
          compilePortableTextInternalLinks(data[0].content);
          await saveToFile(data[0], pageThankYouType);
        },
      },
      {
        query: allBlogPostPreviewsQuery,
        onResultsFetched: async (allBlogPostsPreviewData) => {
          previewBlogPostsData = allBlogPostsPreviewData;

          const replacedBlogPostPreviewsContent = allBlogPostsPreviewData
            .map((blogPostItem) => replaceBlogPostContent(blogPostItem, blogPostItem))
            .map(augmentBlogPostWithCompiledRoute);

          await saveToFile(replacedBlogPostPreviewsContent, `${blogPostType}Preview`);
        },
      },
      {
        query: allBlogPostsQuery,
        onResultsFetched: async (allBlogPostsData) => {
          const replacedBlogPostsContent = allBlogPostsData.map((blogPostItem) => {
            const blogPostTransformedContent = replaceBlogPostContent(blogPostItem, blogPostItem);
            compilePortableTextInternalLinks(blogPostTransformedContent.content);

            blogPostTransformedContent.comments = {
              count: 0,
            };

            return blogPostTransformedContent;
          });

          addRelatedPosts(replacedBlogPostsContent);

          for (const blogPostData of replacedBlogPostsContent) {
            await saveToFile(blogPostData, path.join(POSTS_FOLDERNAME, blogPostData.slug));
          }

          await saveToFile(replacedBlogPostsContent, blogPostType);
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
          const replacedCategoriesContent = allCategoriesData.map((catItem) =>
            replaceCategoryContent(catItem, catItem)
          );

          for (const categoryData of replacedCategoriesContent) {
            // Augment the data with compiled route
            // Make sure it's at least an empty array
            categoryData.featuredBlogPosts = [].concat(...categoryData.featuredBlogPosts);
            categoryData.featuredBlogPosts = []
              .concat(...categoryData.featuredBlogPosts)
              .map(augmentBlogPostWithCompiledRoute);
            categoryData.allBlogPosts = categoryData.allBlogPosts.map(
              augmentBlogPostWithCompiledRoute
            );

            await saveToFile(categoryData, path.join(CATEGORIES_FOLDERNAME, categoryData.slug));
          }

          await saveToFile(replacedCategoriesContent, categoryType);
        },
      },
      {
        query: allTagsQuery,
        onResultsFetched: async (data) => await saveToFile(data, tagType),
      },
    ].map(({ query, onResultsFetched }) => sanityFetch(query).then(onResultsFetched))
  );

  console.log(chalk.blue('\nGenerating derived data...'));
  await Promise.all([generateNavLinks(), generatePathsIndexConfig()]);
}

getData();
