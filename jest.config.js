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
  projects: ['./test/jest.eslint.js', './test/jest.client.js', './test/jest.server.js'],
  testPathIgnorePatterns: ['/node_modules/', '/.next/'],
};
