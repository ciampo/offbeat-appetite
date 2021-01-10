import * as React from 'react';
import { axe } from 'jest-axe';
import { render } from 'offbeat-appetite-render';

import AccessibleImage from '../AccessibleImage';

import * as responsiveConfigs from '../image-responsive-configurations';

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

// TODO: `darker` prop

describe('AccessibleImage', () => {
  test('renders with a valid configuration', async () => {
    const { getByRole, getByTestId, container, queryByTestId } = render(
      <AccessibleImage image={testImage} responsiveConfig={testResponsiveConfig} />
    );

    const wrapperEl = getByTestId('image-wrapper');
    const imageEl = getByRole('img') as HTMLImageElement;

    expect(queryByTestId('image-scrim')).not.toBeInTheDocument();

    expect(imageEl).toHaveAttribute('alt', testImage.alt);
    expect(imageEl).toHaveAttribute('width', `${testImage.asset.metadata.dimensions.width}`);
    expect(imageEl).toHaveAttribute('height', `${testImage.asset.metadata.dimensions.height}`);

    expect(imageEl.style.objectPosition).toBe('50% 50%');

    expect(wrapperEl.className).toMatch('relative w-full h-0');

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

    expect(getByTestId('image-wrapper').className).toMatch(testClassname);
  });

  test('correctly applies given styles', () => {
    const testStyles: React.CSSProperties = {
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

  test('adds a dark overlay via the `darker` props', () => {
    const { queryByTestId } = render(
      <AccessibleImage image={testImage} responsiveConfig={testResponsiveConfig} darker />
    );

    expect(queryByTestId('image-scrim')).toBeInTheDocument();
    expect(queryByTestId('image-scrim')).toHaveAttribute('aria-hidden', 'true');
    expect(queryByTestId('image-scrim')?.className).toMatch(
      'absolute inset-0 bg-black bg-opacity-35 pointer-events-none'
    );
  });
});

describe('Responsive configurations', () => {
  for (const [configName, configOptions] of Object.entries(responsiveConfigs)) {
    test(configName, async () => {
      expect(configOptions.exports).not.toHaveLength(0);
      expect(configOptions.sizes).not.toHaveLength(0);

      const sortedUniqueExports: number[] = Array.from(
        new Set<number>(JSON.parse(JSON.stringify(configOptions.exports)))
      );
      sortedUniqueExports.sort((a, b) => a - b);
      expect(configOptions.exports).toMatchObject(sortedUniqueExports);

      let sizeConfigIndex = 0;
      for (const sizeConfig of configOptions.sizes) {
        expect(sizeConfig).toHaveProperty('width');

        // Last sizes should not have `queryMinWidth`
        if (sizeConfigIndex === configOptions.sizes.length - 1) {
          expect(sizeConfig).not.toHaveProperty('queryMinWidth');
        } else {
          expect(sizeConfig).toHaveProperty('queryMinWidth');
        }

        // Nice to have: check that the sizes are sorted according to the value
        // of queryMinWidth (hard to do since it's a CSS string)

        sizeConfigIndex++;
      }

      const { container } = render(
        <AccessibleImage image={testImage} responsiveConfig={configOptions} />
      );

      const axeResults = await axe(container);
      expect(axeResults).toHaveNoViolations();

      expect(console.warn).not.toHaveBeenCalled();
    });
  }
});
