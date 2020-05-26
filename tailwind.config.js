/* eslint-disable @typescript-eslint/no-var-requires */
const defaultTheme = require('tailwindcss/defaultTheme');
const plugin = require('tailwindcss/plugin');
const { sharedTheme } = require('./tailwind.shared.js');

module.exports = {
  theme: {
    extend: {
      boxShadow: {
        'inner-currentcolor': 'inset 0 -0.125rem 0 currentcolor',
        'inner-pink-section': `inset 0 1.25rem 1.25rem -2rem ${sharedTheme.colors.pink.dark}`,
        'neu-lighter': '-.25rem -.25rem .5rem #fff, .125rem .125rem .7rem rgba(221, 221, 221, .7)',
        'neu-light': '-.125rem -.125rem .7rem #fff, .125rem .125rem .7rem #ddd',
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
        'ch-22': '22ch',
        'ch-32': '32ch',
      },
      minHeight: {
        hero: '25rem',
      },
      maxHeight: {
        hero: '50rem',
      },
      opacity: {
        '10': '0.1',
        '15': '0.15',
        '20': '0.2',
      },
    },
    fontFamily: {
      display: ['Yeseva One', 'sans-serif'],
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
      'loading-bar': {
        '0%': {
          transform: 'scaleX(0)',
        },
        '100%': {
          transform: 'scaleX(.95)',
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
    inset: ['responsive', 'before', 'after', 'focus'],
    margin: ['responsive', 'focus'],
    opacity: ['responsive', 'hover', 'focus', 'before', 'after', 'disabled'],
    padding: ['responsive', 'focus'],
    position: ['responsive', 'before', 'after', 'focus'],
    scale: ['responsive', 'hover', 'focus', 'group-hover', 'group-focus'],
    textColor: ['responsive', 'hover', 'focus', 'disabled'],
    transformOrigin: ['responsive', 'before', 'after'],
    transitionProperty: ['responsive', 'before', 'after'],
    transitionTimingFunction: ['responsive', 'before', 'after'],
    transitionDuration: ['responsive', 'before', 'after'],
    transitionDelay: ['responsive', 'before', 'after'],
    translate: ['responsive', 'hover', 'focus', 'group-hover', 'group-focus'],
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
    plugin(function ({ addUtilities, config }) {
      const scrollPaddingTopUtilities = Object.entries(config('theme.spacing')).map(
        ([key, value]) => {
          return {
            [`.scroll-pt-${key}`]: {
              scrollPaddingTop: value,
            },
          };
        }
      );

      addUtilities(scrollPaddingTopUtilities, ['responsive']);
    }),
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
        '.overflow-full-bleed-x': {
          left: '50%',
          right: '50%',
          marginLeft: '-50vw',
          marginRight: '-50vw',
          position: 'relative',
          width: '100vw',
        },
        // Transform
        '.transform-translate-center': {
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        },
        '.translate-z-0': {
          transform: 'translateZ(0)',
        },
        '.will-change-transform': {
          willChange: 'transform',
        },
        '.will-change-opacity': {
          willChange: 'opacity',
        },
        '.will-change-transform-opacity': {
          willChange: 'transform opacity',
        },
        // Outline
        '.nav-logo-outline': {
          outline: `${sharedTheme.colors.olive.dark} solid 0.5rem`,
        },
        // Text decorations
        '.underline-under': {
          textUnderlinePosition: 'under',
        },
        // Flexbox
        '.flex-break-column': {
          flexBasis: '100%',
          width: 0,
        },
        '.flex-break-row': {
          flexBasis: '100%',
          height: 0,
        },
        '.top-full': {
          top: '100%',
        },
      };

      addUtilities(newUtilities, ['responsive', 'focus', 'hover', 'before', 'after']);
    },
  ],
  purge: {
    content: ['./pages/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
    options: {
      // Order utilities used in the recipe dynamically
      whitelistPatterns: [/^(2xsm:|md:)?order-[1-7]$/],
    },
  },
};
