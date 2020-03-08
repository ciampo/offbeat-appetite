/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs');
const path = require('path');

const ROOT_FOLDER = process.cwd();
const DATA_FOLDER = path.join(ROOT_FOLDER, 'data-sanity');

function compileSingleRoute({ route, dynamicRoute = {} }, content) {
  const { dynamicDataType, routeParams, contentParams } = dynamicRoute;

  if (dynamicRoute && dynamicDataType && routeParams && contentParams) {
    const dynamicItems = JSON.parse(
      fs.readFileSync(path.join(DATA_FOLDER, `${dynamicDataType}.json`), {
        encoding: 'utf8',
      })
    );

    return dynamicItems.map((dynamicItem) => {
      let replacedContent = JSON.stringify(content || '');
      let itemRoute = route;
      const queryParams = {};

      // For each dynamic route parameter, replace the placeholder
      // in the original route and store the query parameters
      for (const [pattern, replacerFn] of Object.entries(routeParams)) {
        const replacementValue = replacerFn(dynamicItem);
        itemRoute = itemRoute.replace(`[${pattern}]`, replacementValue);
        queryParams[pattern] = replacementValue;
      }

      for (const [pattern, replacerFn] of Object.entries(contentParams)) {
        const replacementValue = replacerFn(dynamicItem);
        replacedContent = replacedContent.replace(`:${pattern}`, replacementValue);
      }

      return {
        routeInfo: { path: itemRoute, query: queryParams },
        content: JSON.parse(replacedContent),
      };
    });
  } else {
    // Simple
    return [
      {
        routeInfo: { path: route },
        content,
      },
    ];
  }
}

function compileAllRoutes(routesConfig) {
  const allRoutes = {};

  for (const routeConfig of routesConfig) {
    allRoutes[routeConfig.route] = {};
    for (const { routeInfo } of compileSingleRoute(routeConfig)) {
      const { path, query } = routeInfo;
      allRoutes[routeConfig.route][path] = { page: routeConfig.route };
      if (query) {
        allRoutes[routeConfig.route][path] = {
          ...allRoutes[routeConfig.route][path],
          query,
        };
      }
    }
  }

  return allRoutes;
}

module.exports = {
  compileSingleRoute,
  compileAllRoutes,
};
