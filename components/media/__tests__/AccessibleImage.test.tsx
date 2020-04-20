import React, { CSSProperties } from 'react';
import { axe } from 'jest-axe';
import { render } from 'offbeat-appetite-render';

import AccessibleImage from '../AccessibleImage';

import {
  testImage,
  testImageWithHotspot,
  testResponsiveConfig,
  testResponsiveConfigWithRatio,
  testResponsiveConfigInvalidSizes,
  testResponsiveConfigEmptySizes,
  testResponsiveConfigEmptyExports,
} from '../__tests_dummy_data__/mock-data';

// Spy on console.warn
let spiedConsoleWarn: jest.SpyInstance;

beforeAll(() => {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  spiedConsoleWarn = jest.spyOn(console, 'warn').mockImplementation(() => {});
});

afterAll(() => {
  spiedConsoleWarn.mockRestore();
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('AccessibleImage', () => {
  test('renders with a valid configuration', async () => {
    const { getByRole, getByTestId, container } = render(
      <AccessibleImage image={testImage} responsiveConfig={testResponsiveConfig} />
    );

    const wrapperEl = getByTestId('image-wrapper');
    const imageEl = getByRole('img') as HTMLImageElement;

    expect(imageEl).toHaveAttribute('alt', testImage.alt);
    expect(imageEl).toHaveAttribute('width', `${testImage.asset.metadata.dimensions.width}`);
    expect(imageEl).toHaveAttribute('height', `${testImage.asset.metadata.dimensions.height}`);

    expect(imageEl.style.objectPosition).toBe('50% 50%');

    expect(wrapperEl).toHaveAttribute('class', 'relative w-full h-0');

    expect(wrapperEl.style.backgroundColor).toBe(
      testImage.asset.metadata.palette.dominant.background
    );
    expect(wrapperEl.style.paddingBottom).toBe(
      `${parseFloat((100 / testImage.asset.metadata.dimensions.aspectRatio).toFixed(3))}%`
    );

    expect(imageEl.src).toMatch(
      new RegExp(`w=${testResponsiveConfig.exports[0]}&fit=crop&auto=format$`)
    );

    expect(imageEl.srcset.split(',')).toHaveLength(testResponsiveConfig.exports.length);

    const axeResults = await axe(container);
    expect(axeResults).toHaveNoViolations();
  });

  test('takes apply a forced ratio from the configuration', () => {
    const { getByRole, getByTestId } = render(
      <AccessibleImage image={testImage} responsiveConfig={testResponsiveConfigWithRatio} />
    );

    const wrapperEl = getByTestId('image-wrapper');
    const imageEl = getByRole('img') as HTMLImageElement;

    expect(imageEl).toHaveAttribute(
      'height',
      `${Math.round(
        testImage.asset.metadata.dimensions.width / testResponsiveConfigWithRatio.forceRatio
      )}`
    );

    expect(wrapperEl.style.paddingBottom).toBe(
      `${parseFloat((100 / testResponsiveConfigWithRatio.forceRatio).toFixed(3))}%`
    );
  });

  test('adds the loading="lazy" attribute', () => {
    const { getByRole, rerender } = render(
      <AccessibleImage image={testImage} responsiveConfig={testResponsiveConfig} />
    );

    expect(getByRole('img')).not.toHaveAttribute('loading');

    rerender(
      <AccessibleImage image={testImage} responsiveConfig={testResponsiveConfig} lazy={true} />
    );
    expect(getByRole('img')).toHaveAttribute('loading', 'lazy');

    rerender(<AccessibleImage image={testImage} responsiveConfig={testResponsiveConfig} />);
    expect(getByRole('img')).not.toHaveAttribute('loading');
  });

  test("has a custom object-position to match the image's hotspot", () => {
    const { getByRole } = render(
      <AccessibleImage image={testImageWithHotspot} responsiveConfig={testResponsiveConfig} />
    );

    const imageEl = getByRole('img') as HTMLImageElement;

    expect(imageEl.style.objectPosition).toBe(
      `${testImageWithHotspot.hotspot.x * 100}% ${testImageWithHotspot.hotspot.y * 100}%`
    );
  });

  test('correctly applies a given classname', () => {
    const testClassname = 'test-classname';
    const { getByTestId } = render(
      <AccessibleImage
        image={testImageWithHotspot}
        responsiveConfig={testResponsiveConfig}
        className={testClassname}
      />
    );

    expect(getByTestId('image-wrapper')).toHaveAttribute('class', testClassname);
  });

  test('correctly applies given styles', () => {
    const testStyles: CSSProperties = {
      position: 'fixed',
      backgroundColor: 'tomato',
    };
    const { getByTestId } = render(
      <AccessibleImage
        image={testImageWithHotspot}
        responsiveConfig={testResponsiveConfig}
        style={testStyles}
      />
    );

    const wrapperEl = getByTestId('image-wrapper');

    expect(wrapperEl.style.position).toBe(testStyles.position);
    expect(wrapperEl.style.backgroundColor).toBe(testStyles.backgroundColor);
    expect(wrapperEl.style.paddingBottom).toBe(
      `${parseFloat((100 / testImage.asset.metadata.dimensions.aspectRatio).toFixed(3))}%`
    );
  });

  test("doesn't render with an invalid sizes configuration", () => {
    const { queryByRole, queryByTestId } = render(
      <AccessibleImage image={testImage} responsiveConfig={testResponsiveConfigInvalidSizes} />
    );

    expect(queryByTestId('image-wrapper')).not.toBeInTheDocument();
    expect(queryByRole('img')).not.toBeInTheDocument();

    expect(console.warn).toHaveBeenCalledTimes(1);
  });

  test("doesn't render with an empty sizes configuration", () => {
    const { queryByRole, queryByTestId } = render(
      <AccessibleImage image={testImage} responsiveConfig={testResponsiveConfigEmptySizes} />
    );

    expect(queryByTestId('image-wrapper')).not.toBeInTheDocument();
    expect(queryByRole('img')).not.toBeInTheDocument();

    expect(console.warn).toHaveBeenCalledTimes(1);
  });

  test("doesn't render with an empty exports configuration", () => {
    const { queryByRole, queryByTestId } = render(
      <AccessibleImage image={testImage} responsiveConfig={testResponsiveConfigEmptyExports} />
    );

    expect(queryByTestId('image-wrapper')).not.toBeInTheDocument();
    expect(queryByRole('img')).not.toBeInTheDocument();

    expect(console.warn).toHaveBeenCalledTimes(1);
  });
});
