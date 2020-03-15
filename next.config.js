/* eslint-disable @typescript-eslint/no-var-requires */
const withCSS = require('@zeit/next-css');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

require('dotenv').config();

const nextConfig = {
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

    // // From the 'with-polyfills' netx.js example.
    // const originalEntry = config.entry;
    // config.entry = async () => {
    //   const entries = await originalEntry();

    //   if (entries['main.js'] && !entries['main.js'].includes('./polyfills.js')) {
    //     entries['main.js'].unshift('./polyfills.js');
    //   }

    //   return entries;
    // };

    return config;
  },
  env: {
    GA: process.env.GA,
    CANONICAL_URL: process.env.CANONICAL_URL,
    IS_SUBMIT_FORM_ENABLED: process.env.IS_SUBMIT_FORM_ENABLED,
  },
};

module.exports = withBundleAnalyzer(withCSS(nextConfig));
