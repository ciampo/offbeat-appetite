/* eslint-disable @typescript-eslint/no-var-requires */
const defaultTheme = require('tailwindcss/defaultTheme');
const { sharedTheme } = require('./tailwind.shared.js');

const neuShadow = {
  offset: '0.325rem',
  blur: '1rem',
};

module.exports = {
  theme: {
    extend: {
      boxShadow: {
        'inner-currentcolor': 'inset 0 0 0.25rem currentcolor',
        'neu-lighter': [
          `-${neuShadow.offset} -${neuShadow.offset} ${neuShadow.blur} #fff`,
          `${neuShadow.offset} ${neuShadow.offset} ${neuShadow.blur} rgba(221, 221, 221, 0.8)`,
        ].join(','),
        'neu-light': [
          `-${neuShadow.offset} -${neuShadow.offset} ${neuShadow.blur} rgba(255, 255, 255, 0.8)`,
          `${neuShadow.offset} ${neuShadow.offset} ${neuShadow.blur} #ddd`,
        ].join(','),
      },
      fontSize: {
        '0': '0',
      },
      lineHeight: {
        none: 1,
        tight: 1.25,
        snug: 1.375,
        normal: 1.5,
        relaxed: 1.625,
        loose: 2,
      },
      spacing: {
        ...sharedTheme.spacing,
      },
      colors: {
        ...sharedTheme.colors,
        gray: {
          ...defaultTheme.colors.gray,
          ...sharedTheme.colors.gray,
        },
        pink: {
          ...defaultTheme.colors.pink,
          ...sharedTheme.colors.pink,
        },
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
    fontFamily: {
      display: ['Yeseva One', 'cursive'],
      body: ['Raleway', 'sans-serif'],
    },
    fontSize: {
      xs: '.75rem',
      sm: '.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '2rem',
      '4xl': '2.75rem',
      '5xl': '3.75rem',
      '6xl': '4.75rem',
    },
    letterSpacing: {
      tightest: '-.03em',
      tighter: '-.02em',
      tight: '-.01em',
      normal: '0',
      wide: '.02em',
      wider: '.05em',
      widest: '.1em',
    },
    screens: sharedTheme.screens,
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
    backgroundColor: ['responsive', 'hover', 'focus', 'before', 'after', 'disabled'],
    borderStyle: ['responsive', 'focus'],
    borderWidth: ['responsive', 'focus'],
    boxShadow: ['responsive', 'hover', 'focus', 'disabled'],
    cursor: ['responsive', 'disabled'],
    height: ['responsive', 'before', 'after'],
    inset: ['responsive', 'before', 'after'],
    opacity: ['responsive', 'hover', 'focus', 'before', 'after', 'disabled'],
    position: ['responsive', 'before', 'after'],
    textColor: ['responsive', 'hover', 'focus', 'disabled'],
    transformOrigin: ['responsive', 'before', 'after'],
    transitionProperty: ['responsive', 'before', 'after'],
    transitionTimingFunction: ['responsive', 'before', 'after'],
    transitionDuration: ['responsive', 'before', 'after'],
    transitionDelay: ['responsive', 'before', 'after'],
    width: ['responsive', 'before', 'after'],
    zIndex: ['responsive', 'focus', 'before', 'after'],
  },
  corePlugins: {
    container: false,
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
        '.oba-overflow-full-bleed-x': {
          left: '50%',
          right: '50%',
          marginLeft: '-50vw',
          marginRight: '-50vw',
          position: 'relative',
          width: '100vw',
        },
        // Transform
        '.oba-transform-translate-center': {
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        },
        // Outline
        '.button-outline-olive': {
          outline: `${sharedTheme.colors.olive.dark} solid 0.125rem`,
          outlineOffset: '0.25rem',
        },
        '.button-outline-pink': {
          outline: `${sharedTheme.colors.pink.dark} solid 0.125rem`,
          outlineOffset: '0.25rem',
        },
        '.button-outline-neutral': {
          outline: `${sharedTheme.colors.gray.dark} solid 0.125rem`,
          outlineOffset: '0.25rem',
        },
      };

      addUtilities(newUtilities, ['responsive', 'focus', 'hover', 'before', 'after']);
    },
  ],
  purge: {
    content: ['./pages/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  },
};
