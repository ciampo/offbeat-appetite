/* eslint-disable @typescript-eslint/no-var-requires */
const withCSS = require('@zeit/next-css');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

require('dotenv').config();

const routesConfig = require('./routes-config.js');
const { compileAllRoutes } = require('./scripts/compile-routes.js');

const nextConfig = {
  exportPathMap() {
    const pathMap = {};

    // Compile all routes (i.e, transform dynamic routes into all of the
    // available real routes, given the data coming from the CMS)
    const allCompiledRoutes = compileAllRoutes(routesConfig);

    for (const singlePathCompiledRoutes of Object.values(allCompiledRoutes)) {
      for (const [path, compiledRoute] of Object.entries(singlePathCompiledRoutes)) {
        pathMap[path] = compiledRoute;
      }
    }

    return pathMap;
  },
  webpack(config, options) {
    // From preact netx.js example
    if (options.isServer) {
      config.externals = ['react', 'react-dom', ...config.externals];
    }

    // From preact netx.js example
    config.resolve.alias = {
      ...config.resolve.alias,
      react: 'preact/compat',
      react$: 'preact/compat',
      'react-dom': 'preact/compat',
      'react-dom$': 'preact/compat',
    };

    config.module.rules.push({
      test: /\.(js|ts|tsx)$/,
      exclude: /node_modules/,
      loader: 'eslint-loader',
      options: {
        fix: true,
      },
    });

    // From the 'with-polyfills' netx.js example.
    const originalEntry = config.entry;
    config.entry = async () => {
      const entries = await originalEntry();

      if (entries['main.js'] && !entries['main.js'].includes('./polyfills.js')) {
        entries['main.js'].unshift('./polyfills.js');
      }

      return entries;
    };

    return config;
  },
  env: {
    GA: process.env.GA,
    CANONICAL_URL: process.env.CANONICAL_URL,
    IS_SUBMIT_FORM_ENABLED: process.env.IS_SUBMIT_FORM_ENABLED,
  },
  experimental: {
    polyfillsOptimization: true,
  },
};

module.exports = withBundleAnalyzer(withCSS(nextConfig));
