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
    aspectRatio: { none: 0, square: [1, 1], '16/9': [16, 9], '4/3': [4, 3], '21/9': [21, 9] },
  },
  variants: {
    zIndex: ['responsive', 'focus'],
    borderStyle: ['responsive', 'focus'],
    borderWidth: ['responsive', 'focus'],
    aspectRatio: ['responsive'],
    cursor: ['responsive', 'disabled'],
    inset: ['responsive', 'before', 'after'],
    opacity: ['responsive', 'hover', 'focus', 'before', 'after'],
    position: ['responsive', 'before', 'after'],
    width: ['responsive', 'before', 'after'],
    transitionProperty: ['responsive', 'before', 'after'],
    transitionTimingFunction: ['responsive', 'before', 'after'],
    transitionDuration: ['responsive', 'before', 'after'],
    transitionDelay: ['responsive', 'before', 'after'],
  },
  plugins: [
    require('tailwindcss-pseudo-elements'),
    require('tailwindcss-aspect-ratio'),
    function ({ addUtilities }) {
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
        '.ts-inherit': {
          transition: 'inherit',
        },
        // Filter
        '.filter-darker': {
          filter: 'brightness(0.7)',
        },
        // Text shadow
        '.text-shadow': {
          textShadow: '0 0 0.25rem rgba(0, 0, 0, 0.3)',
        },
        // Background
        '.bg-inherit': {
          background: 'inherit',
        },
        // Pseudo-elements
        '.empty-content': {
          content: "''",
        },
      };

      addUtilities(newUtilities, ['responsive', 'focus', 'before', 'after']);
    },
  ],
};
