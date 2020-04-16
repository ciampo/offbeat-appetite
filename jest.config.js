module.exports = {
  ...require('./test/jest-common.js'),
  collectCoverageFrom: [
    '**/{components,pages,functions,sanity,scripts}/**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/.next/**',
    '!**/out/**',
    '!**/__tests__/**',
  ],
  coverageThreshold: {
    global: {
      statements: 6,
      branches: 15,
      functions: 5,
      lines: 5,
    },
  },
  projects: ['./test/jest.eslint.js', './test/jest.client.js', './test/jest.server.js'],
  testPathIgnorePatterns: ['/node_modules/', '/.next/'],
};
