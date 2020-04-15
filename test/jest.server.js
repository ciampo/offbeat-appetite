module.exports = {
  ...require('./jest-common.js'),
  displayName: 'server',
  testEnvironment: 'node',
  testMatch: ['**/__server_tests__/**/*.js'],
};
