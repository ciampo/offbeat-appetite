import React from 'react';
import { axe } from 'jest-axe';
import { render } from 'offbeat-appetite-render';

import MediaGallery from '../MediaGallery';

import { testMediaGallery } from '../__tests_dummy_data__/mock-data';
// import { SanityCaptionedImage } from '../../../typings';

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

describe('MediaGallery', () => {
  test('renders with a valid configuration with an odd amount of items', async () => {
    const { getByTestId, getAllByTestId, container, debug } = render(
      <MediaGallery _type={testMediaGallery._type} items={testMediaGallery.items} />
    );

    const wrapperEl = getByTestId('gallery-wrapper');

    expect(wrapperEl).toBeInTheDocument();
    expect(wrapperEl.childElementCount).toBe(testMediaGallery.items.length);

    const captionedImageWrapperEls = getAllByTestId('captioned-image-wrapper');
    const firstCaptionedImageWrapperEl = captionedImageWrapperEls[0];
    const lastCaptionedImageWrapperEl = captionedImageWrapperEls.slice(-1)[0];

    expect(firstCaptionedImageWrapperEl.className).not.toMatch('xsm:col-span-2');
    expect(lastCaptionedImageWrapperEl.className).toMatch('xsm:col-span-2');

    // Check for:
    // - test with 3 items
    //    - last item spans across 2 cols, but other items don't (done)
    //    - forced ratio applied to all but last item
    //    - in case of video, forcedRatio + 0 height + absolute
    //    - first 2 items have no margin top

    // - test with 4 items
    //    - all items only occupy 1 col
    //    - all items have a ratio applied (incl video check)
    //    - first 2 items have no margin top

    // - test with invalid object
    //    - renders null

    const axeResults = await axe(container);
    expect(axeResults).toHaveNoViolations();
  });
});
