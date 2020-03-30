// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import resolveConfig from 'tailwindcss/resolveConfig';
import tailwindConfig from '../../tailwind.config';

// This twTheme import (instead of the whole tailwind config) enables
// massive savings in terms of bundle size are achieved by
// not importing tailwind's config directly.
const { theme: twTheme } = resolveConfig(tailwindConfig);
// console.log(twTheme);

function remToPx(rem: string): number {
  return parseFloat(rem) * 16;
}

function pxToRem(px: string): number {
  return parseFloat(px) / 16;
}

const sectionPaddingH = twTheme.spacing['6'];
const sectionPaddingHPx = remToPx(sectionPaddingH);
// const maxWidthXs = twTheme.maxWidth.xs;
// const maxWidthXsPx = remToPx(maxWidthXs);

export type AccessibleImageSizeConfig = {
  queryMinWidth?: string;
  width: string;
};

export type AccessibleImageResponsiveConfig = {
  exports: number[];
  sizes: AccessibleImageSizeConfig[];
  forceRatio?: number;
};

function sortBreakpoints({
  breakpoints,
  sorting = 'asc',
  unit,
  addDoubleRes,
}: {
  breakpoints: string[];
  sorting?: 'asc' | 'desc';
  unit?: string;
  addDoubleRes?: boolean;
}): (string | number)[] {
  let numbers = breakpoints.map((s: string) => parseInt(s, 10));

  if (addDoubleRes) {
    numbers = Array.from(
      new Set(numbers.reduce((arr, bp: number) => [...arr, bp, bp * 2], [] as number[]))
    );
  }

  return (
    numbers
      // sort asc/desc
      .sort((x, y) => (sorting === 'asc' ? (x > y ? 1 : -1) : x < y ? 1 : -1))
      // potentially add the unit
      .map((n) => (unit ? `${n}${unit}` : n))
  );
}

// =============================================================================
// PRESETS
// =============================================================================

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
    addDoubleRes: true,
  }) as number[],
  sizes: [{ width: '100vw' }],
};

// Used in blog post preview tiles
export const blogPostPreviewResponsiveConfig: AccessibleImageResponsiveConfig = {
  exports: sortBreakpoints({ breakpoints: ['320'] }) as number[],
  sizes: [{ width: `${pxToRem('320')}rem` }],
  forceRatio: 3 / 2,
};

// Used in blog post content for 100% wide images
export const contentFullWidthResponsiveConfig: AccessibleImageResponsiveConfig = {
  exports: sortBreakpoints({
    breakpoints: [
      `${375 - 2 * sectionPaddingHPx}`,
      `${remToPx(twTheme.maxWidth['2xl']) - 2 * sectionPaddingHPx}`,
      `${remToPx(twTheme.maxWidth['3xl']) - 2 * sectionPaddingHPx}`,
    ],
    addDoubleRes: true,
  }) as number[],
  sizes: [
    {
      queryMinWidth: twTheme.maxWidth['screen-lg'],
      width: `calc(${twTheme.maxWidth['3xl']} - 2 * ${sectionPaddingH})`,
    },
    {
      queryMinWidth: `${remToPx(twTheme.maxWidth['2xl'])}px`,
      width: `calc(${twTheme.maxWidth['2xl']} - 2 * ${sectionPaddingH})`,
    },
    {
      width: `calc(100vw - 2 * ${sectionPaddingH})`,
    },
  ],
  forceRatio: 1,
};
