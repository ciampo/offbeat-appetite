/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');

module.exports = {
  rootDir: path.join(__dirname, '..'),
  displayName: 'eslint',
  runner: 'jest-runner-eslint',
  testMatch: ['<rootDir>/**/*.[jt]s?(x)'],
};
