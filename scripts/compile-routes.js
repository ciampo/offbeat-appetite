/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs');
const path = require('path');

const ROOT_FOLDER = process.cwd();
const DATA_FOLDER = path.join(ROOT_FOLDER, 'data-sanity');

function compileSingleRoute({ route, dynamicRoute = {} }) {
  // console.log(routeConfig);
  const { dynamicDataType, routeParams } = dynamicRoute;

  if (dynamicRoute && dynamicDataType && routeParams) {
    const dynamicItems = JSON.parse(
      fs.readFileSync(path.join(DATA_FOLDER, `${dynamicDataType}.json`), {
        encoding: 'utf8',
      })
    );

    return dynamicItems.map((dynamicItem) => {
      let itemRoute = route;
      const queryParams = {};

      // For each dynamic route parameter, replace the placeholder
      // in the original route and store the query parameters
      for (const [pattern, replacerFn] of Object.entries(routeParams)) {
        const replacementValue = replacerFn(dynamicItem);
        itemRoute = itemRoute.replace(`[${pattern}]`, replacementValue);
        queryParams[pattern] = replacementValue;
      }

      return { path: itemRoute, query: queryParams };
    });
  } else {
    // Simple
    return [{ path: route }];
  }
}

function compileAllRoutes(routesConfig) {
  const allRoutes = {};

  for (const routeConfig of routesConfig) {
    allRoutes[routeConfig.route] = {};
    for (const { path, query } of compileSingleRoute(routeConfig)) {
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
