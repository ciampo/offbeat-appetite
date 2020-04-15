// const {defaults} = require('jest-config');

module.exports = {
  // moduleFileExtensions: [...defaults.moduleFileExtensions, 'ts', 'tsx'],
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '\\.module\\.css$': 'identity-obj-proxy',
    '\\.css$': require.resolve('./test/style-mock.js'),
  },
  // Extend the "expect" assertions
  setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect'],
};
