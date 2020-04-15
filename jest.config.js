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
  coverageThreshold: {
    global: {
      statements: 4,
      branches: 5,
      functions: 4,
      lines: 4,
    },
    // Example for a single file
    './components/media/AccessibleImage.tsx': {
      statements: 68,
      branches: 64,
      functions: 100,
      lines: 68,
    },
  },
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
