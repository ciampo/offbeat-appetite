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
            content: ['./pages/**/*.{js,tsx}', './components/**/*.{js,tsx}'],
            defaultExtractor: (content) => content.match(/[\w-:/]+(?<!:)/g) || [],
          },
    ],
    'autoprefixer',
    ['cssnano', dev ? false : true],
    ['postcss-reporter', { clearReportedMessages: true }],
  ],
};
