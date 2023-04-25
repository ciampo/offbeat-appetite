import * as React from 'react';
// import { axe } from 'jest-axe';
import { render } from '../../../test/offbeat-appetite-render';

import MediaGallery from '../MediaGallery';

import {
  testMediaGalleryEven,
  testMediaGalleryOdd,
  testMediaGalleryLastInvalid,
} from '../__tests_dummy_data__/mock-data';
import { SanityCaptionedImage, SanityCaptionedVideo } from '../../../typings';

// - test with invalid object
//    - renders null

describe('MediaGallery', () => {
  test('renders with a valid configuration with an odd amount of items', async () => {
    const { getByTestId, getAllByTestId } = render(
      <MediaGallery _type={testMediaGalleryOdd._type} items={testMediaGalleryOdd.items} />
    );

    const wrapperEl = getByTestId('gallery-wrapper');

    expect(wrapperEl).toBeInTheDocument();
    expect(wrapperEl.childElementCount).toBe(testMediaGalleryOdd.items.length);

    const captionedImageWrapperEls = getAllByTestId('captioned-image-wrapper');
    const firstCaptionedImageWrapperEl = captionedImageWrapperEls[0];
    const secondCaptionedImageWrapperEl = captionedImageWrapperEls[1];
    const lastCaptionedImageWrapperEl = captionedImageWrapperEls.slice(-1)[0];

    // Last item spans across 2 cols, but other items don't (done)
    expect(firstCaptionedImageWrapperEl.className).not.toMatch('xsm:col-span-2');
    expect(lastCaptionedImageWrapperEl.className).toMatch('xsm:col-span-2');

    // All but first item have margin top (which gets removed on desktop)
    expect(firstCaptionedImageWrapperEl.className).not.toMatch('mt-8 xsm:mt-0');
    expect(secondCaptionedImageWrapperEl.className).toMatch('mt-8 xsm:mt-0');
    expect(lastCaptionedImageWrapperEl.className).toMatch('mt-8 xsm:mt-0');

    const imageWrapperEls = getAllByTestId('image-wrapper');

    // Forced ratio applied to all but last item
    for (let i = 0; i++; i < imageWrapperEls.length) {
      if (i === imageWrapperEls.length - 1) {
        expect(imageWrapperEls[i].style.paddingBottom).toBe(
          `${parseFloat(
            (
              100 /
              (testMediaGalleryOdd.items.slice(-1)[0] as SanityCaptionedImage).image.asset.metadata
                .dimensions.aspectRatio
            ).toFixed(3)
          )}%`
        );
      } else {
        expect(imageWrapperEls[i].style.paddingBottom).toBe('125%');
      }
    }

    // const axeResults = await axe(container);
    // expect(axeResults).toHaveNoViolations();
  });

  test('renders with a valid configuration with an even amount of items', async () => {
    const { getByTestId, getAllByTestId } = render(
      <MediaGallery _type={testMediaGalleryEven._type} items={testMediaGalleryEven.items} />
    );

    const wrapperEl = getByTestId('gallery-wrapper');

    expect(wrapperEl).toBeInTheDocument();
    expect(wrapperEl.childElementCount).toBe(testMediaGalleryEven.items.length);

    const captionedImageWrapperEls = getAllByTestId('captioned-image-wrapper');
    const firstCaptionedImageWrapperEl = captionedImageWrapperEls[0];
    const secondCaptionedImageWrapperEl = captionedImageWrapperEls[1];
    const lastCaptionedImageWrapperEl = captionedImageWrapperEls.slice(-1)[0];

    // No item spans across 2 cols, but other items don't (done)
    expect(firstCaptionedImageWrapperEl.className).not.toMatch('xsm:col-span-2');
    expect(lastCaptionedImageWrapperEl.className).not.toMatch('xsm:col-span-2');

    // All but first item have margin top (which gets removed on desktop)
    expect(firstCaptionedImageWrapperEl.className).not.toMatch('mt-8 xsm:mt-0');
    expect(secondCaptionedImageWrapperEl.className).toMatch('mt-8 xsm:mt-0');
    expect(lastCaptionedImageWrapperEl.className).toMatch('mt-8 xsm:mt-0');

    const imageWrapperEls = getAllByTestId('image-wrapper');

    // Forced ratio applied to all items
    for (let i = 0; i++; i < imageWrapperEls.length) {
      expect(imageWrapperEls[i].style.paddingBottom).toBe('125%');
    }
    // TODO: restore axe tests, understand why it takes so long
    // const axeResults = await axe(container);
    // expect(axeResults).toHaveNoViolations();
  });

  test("doesn't render invalid items", async () => {
    const { getByTestId } = render(
      <MediaGallery
        _type={testMediaGalleryEven._type}
        items={
          (testMediaGalleryLastInvalid.items as unknown) as (
            | SanityCaptionedImage
            | SanityCaptionedVideo
          )[]
        }
      />
    );

    const wrapperEl = getByTestId('gallery-wrapper');

    expect(wrapperEl).toBeInTheDocument();
    expect(wrapperEl.childElementCount).toBe(testMediaGalleryEven.items.length - 1);
  });
});
