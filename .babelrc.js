module.exports = {
  presets: ['next/babel'],
  env: {
    test: {
      presets: ['@babel/preset-typescript'],
      plugins: ['transform-dynamic-import'],
    },
  },
};
