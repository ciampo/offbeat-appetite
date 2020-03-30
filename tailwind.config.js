/* eslint-disable @typescript-eslint/no-var-requires */
const { sharedTheme } = require('./tailwind.shared.js');

module.exports = {
  theme: {
    extend: {
      screens: {
        ...sharedTheme.screens,
        xsm: '480px',
      },
      spacing: {
        ...sharedTheme.spacing,
      },
      colors: {
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        background: 'var(--color-background)',
      },
      maxWidth: {
        ...sharedTheme.maxWidth,
        '1/4': '25%',
        '1/2': '50%',
        '3/4': '75%',
      },
      minHeight: {
        hero: '25rem',
      },
      maxHeight: {
        hero: '50rem',
      },
    },
    aspectRatio: {
      square: [1, 1],
      '16/9': [16, 9],
      '4/3': [4, 3],
      '21/9': [21, 9],
    },
  },
  variants: {
    zIndex: ['responsive', 'focus'],
    borderStyle: ['responsive', 'focus'],
    borderWidth: ['responsive', 'focus'],
  },
  plugins: [
    require('tailwindcss-aspect-ratio')(),
    function({ addUtilities }) {
      const newUtilities = {
        // Contain
        '.contain-s': {
          contain: 'strict',
        },
        '.contain-l-p': {
          contain: 'layout paint',
        },
        '.contain-p': {
          contain: 'paint',
        },
        '.contain-l': {
          contain: 'layout',
        },
        // Transition
        '.ts-tf-custom': {
          transitionTimingFunction: 'cubic-bezier(0.175, 0.85, 0.42, 0.96)',
        },
        '.ts-tf-eo': {
          transitionTimingFunction: 'ease-out',
        },
        '.ts-tf-ei': {
          transitionTimingFunction: 'ease-in',
        },
        '.ts-d-100': {
          transitionDuration: '0.1s',
        },
        '.ts-d-150': {
          transitionDuration: '0.15s',
        },
        '.ts-d-200': {
          transitionDuration: '0.2s',
        },
        '.ts-d-300': {
          transitionDuration: '0.3s',
        },
        '.ts-d-500': {
          transitionDuration: '0.5s',
        },
        '.ts-p-o': {
          transitionProperty: 'opacity',
        },
        '.ts-p-t': {
          transitionProperty: 'transform',
        },
        '.ts-p-o-t': {
          transitionProperty: 'opacity, transform',
        },
        '.ts-inherit': {
          transition: 'inherit',
        },
        // Transform
        '.tf-scale-up': {
          transform: 'scale(1.05)',
        },
        '.tf-scale-down': {
          transform: 'scale(0.96)',
        },
        '.tf-none': {
          transform: 'none',
        },
        '.filter-darker': {
          filter: 'brightness(0.7)',
        },
        '.text-shadow': {
          textShadow: '0 0 0.25rem rgba(0, 0, 0, 0.3)',
        },
      };

      addUtilities(newUtilities, ['responsive', 'focus']);
    },
  ],
};
