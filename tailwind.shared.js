// Repeating a few variables (even if they are the same as the default config)
// because it saves a huge amount of space in the front end code
// compared to importing the whole config + config parser
const screens = {
  '2xsm': '400px',
  xsm: '480px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
};

const sharedTheme = {
  screens,
  spacing: {
    // '0': '0',
    // '1': '0.25rem',
    // '2': '0.5rem',
    // '3': '0.75rem',
    // '4': '1rem',
    // '5': '1.25rem',
    '6': '1.5rem',
    // '8': '2rem',
    // '10': '2.5rem',
    // '12': '3rem',
    // '16': '4rem',
    // '20': '5rem',
    // '24': '6rem',
    // '32': '8rem',
    // '40': '10rem',
    // '48': '12rem',
    // '56': '14rem',
    // '64': '16rem',
    // px: '1px',
  },
  maxWidth: {
    // none: 'none',
    // xs: '20rem',
    // sm: '24rem',
    // md: '28rem',
    lg: '32rem',
    xl: '36rem',
    '2xl': '42rem',
    '3xl': '48rem',
    // '4xl': '56rem',
    // '5xl': '64rem',
    // '6xl': '72rem',
    // full: '100%',
    'screen-xsm': screens.xsm,
    'screen-sm': screens.sm,
    'screen-md': screens.md,
    'screen-lg': screens.lg,
    'screen-xl': screens.xl,
  },
};

module.exports = {
  sharedTheme,
};
