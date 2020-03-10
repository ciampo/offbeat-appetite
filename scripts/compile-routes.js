/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs');
const path = require('path');

const ROOT_FOLDER = process.cwd();
const DATA_FOLDER = path.join(ROOT_FOLDER, 'data-sanity');

function compileDynamicItem({ dynamicItem, routeConfig, content = '' }) {
  const { route, generateParams, replaceContent = () => ({}) } = routeConfig;

  // Generate dynamic route (replace query params).
  let dynamicRoute = route;
  const dynamicParams = generateParams(dynamicItem);
  for (const [paramKey, paramValue] of Object.entries(dynamicParams)) {
    dynamicRoute = dynamicRoute.replace(`[${paramKey}]`, paramValue);
  }

  // Generate dynamic content (replace content placeholders).
  let replacedContent = JSON.stringify(content);
  const dynamicContent = replaceContent(dynamicItem);
  for (const [paramKey, paramValue] of Object.entries(dynamicContent)) {
    const replaceRegex = new RegExp(`:${paramKey}`, 'g');
    replacedContent = replacedContent.replace(replaceRegex, paramValue);
  }

  return {
    routeInfo: { page: route, path: dynamicRoute, query: dynamicParams },
    content: JSON.parse(replacedContent),
  };
}

function compileStaticItem({ routeConfig, content = '' }) {
  return {
    routeInfo: { page: routeConfig.route, path: routeConfig.route, query: {} },
    content,
  };
}

// Returns an array of objects of type:
//
// {
//   routeInfo: {
//     page: string,
//     path: string, // for non-dynamic routes, page === path
//     query: dynamicParams  // for non-dynamic routes, query is {}
//   },
//   content: replacedContent,
// }
function compileSingleRoute({ routeConfig, content = '', dynamicItemsData = null }) {
  const { generateParams, dynamicDataType } = routeConfig;
  if (generateParams && dynamicDataType) {
    // If `dynamicItems` are not provided, read them from disk.
    const dynamicItems =
      dynamicItemsData ||
      JSON.parse(
        fs.readFileSync(path.join(DATA_FOLDER, `${dynamicDataType}.json`), {
          encoding: 'utf8',
        })
      );

    return dynamicItems.map((dynamicItem) =>
      compileDynamicItem({
        routeConfig,
        dynamicItem,
        content,
      })
    );
  } else {
    // Simple
    return [compileStaticItem({ routeConfig, content })];
  }
}

module.exports = {
  compileDynamicItem,
  compileSingleRoute,
};
