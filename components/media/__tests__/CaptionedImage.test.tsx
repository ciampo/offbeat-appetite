import React from 'react';
import { axe } from 'jest-axe';
import { render } from 'offbeat-appetite-render';

import CaptionedImage from '../CaptionedImage';

import {
  testCaptionedImageWithCaption,
  testCaptionedImageNoCaption,
  testResponsiveConfig,
} from '../__tests_dummy_data__/mock-data';

describe('CaptionedImage', () => {
  test('renders with a valid configuration', async () => {
    const { getByRole, getByText, getByAltText, rerender, container } = render(
      <CaptionedImage {...testCaptionedImageWithCaption} responsiveConfig={testResponsiveConfig} />
    );

    const captionEl = getByText(testCaptionedImageWithCaption.caption);
    const figureEl = getByRole('figure');

    expect(figureEl).toBeInTheDocument();
    expect(figureEl).toHaveClass('oba-stack-tiny');

    expect(captionEl).toBeInTheDocument();

    expect(getByAltText(testCaptionedImageWithCaption.image.alt)).toBeInTheDocument();

    expect(await axe(container)).toHaveNoViolations();

    rerender(
      <CaptionedImage {...testCaptionedImageNoCaption} responsiveConfig={testResponsiveConfig} />
    );

    expect(figureEl).not.toBeInTheDocument();
    expect(captionEl).not.toBeInTheDocument();
    expect(getByAltText(testCaptionedImageWithCaption.image.alt)).toBeInTheDocument();

    expect(await axe(container)).toHaveNoViolations();
  });
});
