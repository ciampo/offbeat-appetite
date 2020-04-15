/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const { defaults } = require('jest-config');

module.exports = {
  // moduleFileExtensions: [...defaults.moduleFileExtensions, 'ts', 'tsx'],
  collectCoverageFrom: [
    '**/{components,pages,functions,sanity,scripts}/**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/.next/**',
    '!**/out/**',
  ],
  testEnvironment: 'jsdom',
  moduleDirectories: [...defaults.moduleDirectories, path.join(__dirname, 'test')],
  moduleNameMapper: {
    '^.+\\.module\\.(css|sass|scss)$': 'identity-obj-proxy',
    '\\.css$': require.resolve('./test/style-mock.js'),
  },
  // Extend the "expect" assertions
  setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect'],
  testPathIgnorePatterns: ['/node_modules/', '/.next/'],
};
