module.exports = {
  stories: ['../stories/**/*.stories.tsx'],
  addons: [
    {
      name: '@storybook/preset-typescript',
      options: {},
    },
    ,
    '@storybook/addon-actions',
    '@storybook/addon-links',
    '@storybook/addon-knobs',
  ],
  webpackFinal: async (config) => {
    // do mutation to the config

    return config;
  },
};
