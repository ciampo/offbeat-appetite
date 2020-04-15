const dev = process.env.NODE_ENV !== 'production';

module.exports = {
  plugins: [
    'stylelint',
    'postcss-easy-import',
    'tailwindcss',
    [
      '@fullhuman/postcss-purgecss',
      dev
        ? false
        : {
            content: ['./pages/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
            defaultExtractor: (content) => content.match(/[\w-/:]+(?<!:)/g) || [],
          },
    ],
    'postcss-flexbugs-fixes',
    [
      'postcss-preset-env',
      {
        autoprefixer: {
          flexbox: 'no-2009',
        },
        stage: 3,
        features: {
          'custom-properties': false,
        },
      },
    ],
    ['cssnano', dev ? false : true],
    ['postcss-reporter', { clearReportedMessages: true }],
  ],
};
