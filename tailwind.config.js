/* eslint-disable @typescript-eslint/no-var-requires */
const defaultTheme = require('tailwindcss/defaultTheme');
const { sharedTheme } = require('./tailwind.shared.js');

module.exports = {
  theme: {
    extend: {
      fontSize: {
        '0': '0',
      },
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
    // Aspect Ratio Plugin
    aspectRatio: { none: 0, square: [1, 1], '16/9': [16, 9], '4/3': [4, 3], '21/9': [21, 9] },
    // Animation Plugin
    animations: {
      loadinglink: {
        '0%': {
          transform: 'translateX(0%) scaleX(0)',
        },
        '30%': {
          transform: 'translateX(0%) scaleX(1)',
        },
        '60%': {
          transform: 'translateX(100%) scaleX(0)',
        },
        '100%': {
          transform: 'translateX(100%) scaleX(0)',
        },
      },
    },
    animationTimingFunction: {
      default: 'ease',
      linear: 'linear',
      ease: 'ease',
      'ease-in': 'ease-in',
      'ease-out': defaultTheme.transitionTimingFunction.out,
      'ease-in-out': 'ease-in-out',
    },
  },
  variants: {
    animations: ['responsive', 'before', 'after'],
    animationDuration: ['responsive', 'before', 'after'],
    animationTimingFunction: ['responsive', 'before', 'after'],
    animationIterationCount: ['responsive', 'before', 'after'],
    aspectRatio: ['responsive'],
    backgroundColor: ['responsive', 'hover', 'focus', 'before', 'after'],
    borderStyle: ['responsive', 'focus'],
    borderWidth: ['responsive', 'focus'],
    cursor: ['responsive', 'disabled'],
    height: ['responsive', 'before', 'after'],
    inset: ['responsive', 'before', 'after'],
    opacity: ['responsive', 'hover', 'focus', 'before', 'after'],
    position: ['responsive', 'before', 'after'],
    transformOrigin: ['responsive', 'before', 'after'],
    transitionProperty: ['responsive', 'before', 'after'],
    transitionTimingFunction: ['responsive', 'before', 'after'],
    transitionDuration: ['responsive', 'before', 'after'],
    transitionDelay: ['responsive', 'before', 'after'],
    width: ['responsive', 'before', 'after'],
    zIndex: ['responsive', 'focus', 'before', 'after'],
  },
  plugins: [
    require('tailwindcss-animations'),
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
        '.delay-100': {
          transitionDelay: '100ms',
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
        '.bg-current': {
          backgroundColor: 'currentColor',
        },
        // Pseudo-elements
        '.empty-content': {
          content: "''",
        },
        // Positioning
        '.inset-fill-parent-with-overflow': {
          top: '-100vh',
          left: '-100vh',
          width: '200vw',
          height: '200vh',
        },
        // Transform
        '.transform-translate-center': {
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        },
      };

      addUtilities(newUtilities, ['responsive', 'focus', 'before', 'after']);
    },
  ],
};
