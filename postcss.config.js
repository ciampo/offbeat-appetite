const dev = process.env.NODE_ENV !== 'production';

module.exports = {
  plugins: {
    stylelint: {},
    'postcss-easy-import': {},
    tailwindcss: {},
    ...(dev
      ? {}
      : {
          '@fullhuman/postcss-purgecss': {
            content: ['./pages/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
            defaultExtractor: (content) => content.match(/[\w-/:]+(?<!:)/g) || [],
          },
        }),
    'postcss-flexbugs-fixes': {},
    'postcss-preset-env': {
      autoprefixer: {
        flexbox: 'no-2009',
      },
      stage: 3,
      features: {
        'custom-properties': false,
      },
    },

    ...(dev ? {} : { cssnano: {} }),
    'postcss-reporter': { clearReportedMessages: true },
  },
};
