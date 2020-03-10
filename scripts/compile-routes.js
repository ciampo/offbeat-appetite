/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs');
const path = require('path');

const ROOT_FOLDER = process.cwd();
const DATA_FOLDER = path.join(ROOT_FOLDER, 'data-sanity');

function compileDynamicItem({ dynamicItem, routeConfig }) {
  const { route, generateParams } = routeConfig;

  // Generate dynamic route (replace query params).
  let dynamicRoute = route;
  const dynamicParams = generateParams(dynamicItem);
  for (const [paramKey, paramValue] of Object.entries(dynamicParams)) {
    dynamicRoute = dynamicRoute.replace(`[${paramKey}]`, paramValue);
  }

  return {
    routeInfo: { page: route, path: dynamicRoute, query: dynamicParams },
  };
}

function compileStaticItem({ routeConfig }) {
  return {
    routeInfo: { page: routeConfig.route, path: routeConfig.route, query: {} },
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
function compileSingleRoute({ routeConfig, dynamicItemsData = null }) {
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
      })
    );
  } else {
    // Simple
    return [compileStaticItem({ routeConfig })];
  }
}

module.exports = {
  compileDynamicItem,
  compileSingleRoute,
};
