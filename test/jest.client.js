module.exports = {
  ...require('./jest-common.js'),
  displayName: 'client',
  testEnvironment: 'jsdom', // Extend the "expect" assertions
  setupFilesAfterEnv: [
    'dotenv/config',
    '@testing-library/jest-dom/extend-expect',
    'jest-axe/extend-expect',
  ],
};
