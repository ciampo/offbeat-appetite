/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const { defaults } = require('jest-config');

module.exports = {
  rootDir: path.join(__dirname, '..'),
  moduleDirectories: [...defaults.moduleDirectories, __dirname],
  moduleNameMapper: {
    '^.+\\.module\\.(css|sass|scss)$': 'identity-obj-proxy',
    '\\.css$': require.resolve('./style-mock.js'),
  },
};
