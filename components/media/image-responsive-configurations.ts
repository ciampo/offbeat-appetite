import { sharedTheme as twTheme } from '../../tailwind.shared';

// =============================================================================
// UTILITIES
// =============================================================================
function unitless(numberWithUnit: string): number {
  return parseFloat(numberWithUnit);
}

function remToPx(rem: string): number {
  return unitless(rem) * 16;
}

function pxToRem(px: string): number {
  return unitless(px) / 16;
}

function sortBreakpoints({
  // unit,
  // sorting = 'asc',
  breakpoints,
  addDoubleRes,
}: {
  breakpoints: string[];
  addDoubleRes?: boolean;
  // unit?: string;
  // sorting?: 'asc' | 'desc';
}): (string | number)[] {
  let numbers = breakpoints.map((s: string) => parseInt(s, 10));

  if (addDoubleRes) {
    numbers = Array.from(
      new Set(numbers.reduce((arr, bp: number) => [...arr, bp, bp * 2], [] as number[]))
    );
  }

  return (
    numbers
      // If in need of sorting ASC or DES
      // .sort((x, y) => (sorting === 'asc' ? (x > y ? 1 : -1) : x < y ? 1 : -1))
      // If in need of adding a UNIT
      // .map((n) => (unit ? `${n}${unit}` : n))
      // =======================================
      // Simplified version
      // Sort ASC
      .sort((x, y) => (x > y ? 1 : -1))
  );
}

// =============================================================================
// LAYOUT VARS
// =============================================================================

const pagePadding = {
  initial: {
    px: remToPx(twTheme.spacing['6']),
    rem: unitless(twTheme.spacing['6']),
  },
  xsm: {
    px: remToPx(twTheme.spacing['8']),
    rem: unitless(twTheme.spacing['8']),
  },
  sm: {
    px: remToPx(twTheme.spacing['12']),
    rem: unitless(twTheme.spacing['12']),
  },
  md: {
    px: remToPx(twTheme.spacing['16']),
    rem: unitless(twTheme.spacing['16']),
  },
  xl: {
    px: remToPx(twTheme.spacing['20']),
    rem: unitless(twTheme.spacing['20']),
  },
};

const articleContainerMaxWidth = {
  xsm: {
    px: remToPx(twTheme.maxWidth.lg),
    rem: unitless(twTheme.maxWidth.lg),
  },
  md: {
    px: remToPx(twTheme.maxWidth.xl),
    rem: unitless(twTheme.maxWidth.xl),
  },
  xl: {
    px: remToPx(twTheme.maxWidth['3xl']),
    rem: unitless(twTheme.maxWidth['3xl']),
  },
};

// =============================================================================
// PRESETS
// =============================================================================

export type AccessibleImageSizeConfig = {
  queryMinWidth?: string;
  width: string;
};

export type AccessibleImageResponsiveConfig = {
  exports: number[];
  sizes: AccessibleImageSizeConfig[];
  forceRatio?: number;
};

// Used in full bleed images (e.g. page hero)
export const fullBleedImageResponsiveConfig: AccessibleImageResponsiveConfig = {
  exports: sortBreakpoints({
    breakpoints: [
      '320',
      twTheme.screens.xsm,
      twTheme.screens.sm,
      twTheme.screens.md,
      twTheme.screens.lg,
      twTheme.screens.xl,
    ],
    addDoubleRes: false,
  }) as number[],
  sizes: [{ width: '100vw' }],
  forceRatio: 16 / 9,
};

// Used in blog post preview tiles
export const blogPostPreviewResponsiveConfig: AccessibleImageResponsiveConfig = {
  exports: sortBreakpoints({ breakpoints: ['320'] }) as number[],
  sizes: [{ width: `${pxToRem('320')}rem` }],
  forceRatio: 4 / 5,
};

// Used in blog post content for 100% wide images
export const contentFullWidthResponsiveConfig: AccessibleImageResponsiveConfig = {
  exports: sortBreakpoints({
    breakpoints: [
      `${375 - 2 * pagePadding.initial.px}`,
      `${articleContainerMaxWidth.xsm.px}`,
      `${articleContainerMaxWidth.md.px}`,
      `${articleContainerMaxWidth.xl.px}`,
    ],
    addDoubleRes: true,
  }) as number[],
  sizes: [
    {
      queryMinWidth: twTheme.maxWidth['screen-xl'],
      width: `${articleContainerMaxWidth.xl.rem}rem`,
    },
    {
      queryMinWidth: twTheme.maxWidth['screen-md'],
      width: `${articleContainerMaxWidth.md.rem}rem`,
    },
    {
      queryMinWidth: `${articleContainerMaxWidth.xsm.px + 2 * pagePadding.xsm.px}px`,
      width: `${articleContainerMaxWidth.xsm.rem}rem`,
    },
    {
      queryMinWidth: twTheme.maxWidth['screen-xsm'],
      width: `calc(100vw - ${2 * pagePadding.xsm.rem}rem)`,
    },
    {
      width: `calc(100vw - ${2 * pagePadding.initial.rem}rem)`,
    },
  ],
};

// Used in blog post media gallery

const mediaGripGap = {
  initial: pagePadding.initial,
};

export const contentMediaGalleryResponsiveConfig: AccessibleImageResponsiveConfig = {
  exports: sortBreakpoints({
    breakpoints: [
      `${375 - 2 * pagePadding.initial.px}`,
      `${parseFloat(twTheme.maxWidth['screen-xsm']) - 2 * pagePadding.initial.px}`,
      `${(articleContainerMaxWidth.xsm.px - mediaGripGap.initial.px) / 2}`,
      `${(articleContainerMaxWidth.md.px - mediaGripGap.initial.px) / 2}`,
      `${(articleContainerMaxWidth.xl.px - mediaGripGap.initial.px) / 2}`,
    ],
    addDoubleRes: true,
  }) as number[],
  sizes: [
    {
      queryMinWidth: twTheme.maxWidth['screen-xl'],
      width: `${(articleContainerMaxWidth.xl.rem - mediaGripGap.initial.rem) / 2}rem`,
    },
    {
      queryMinWidth: twTheme.maxWidth['screen-md'],
      width: `${(articleContainerMaxWidth.md.rem - mediaGripGap.initial.rem) / 2}rem`,
    },
    {
      queryMinWidth: `${articleContainerMaxWidth.xsm.px + 2 * pagePadding.xsm.px}px`,
      width: `${(articleContainerMaxWidth.xsm.rem - mediaGripGap.initial.rem) / 2}rem`,
    },
    {
      queryMinWidth: twTheme.maxWidth['screen-xsm'],
      width: `calc((100vw - ${2 * pagePadding.xsm.rem + mediaGripGap.initial.rem}rem) / 2)`,
    },
    {
      width: `calc(100vw - 2 * ${pagePadding.initial.rem}rem)`,
    },
  ],
  forceRatio: 4 / 5,
};
