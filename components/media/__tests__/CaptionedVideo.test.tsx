import * as React from 'react';
// import { axe } from 'jest-axe';
import { render } from '../../../test/offbeat-appetite-render';

import CaptionedVideo from '../CaptionedVideo';

import {
  testCaptionedVideoWithCaption,
  testCaptionedVideoNoCaption,
  testResponsiveConfig,
} from '../__tests_dummy_data__/mock-data';

describe('CaptionedVideo', () => {
  test('renders with a valid configuration', async () => {
    const { getByRole, getByText, getByTitle, rerender } = render(
      <CaptionedVideo {...testCaptionedVideoWithCaption} responsiveConfig={testResponsiveConfig} />
    );

    const captionEl = getByText(testCaptionedVideoWithCaption.caption);
    const figureEl = getByRole('figure');

    expect(figureEl).toBeInTheDocument();
    expect(figureEl).toHaveClass('space-y-2 xl:space-y-4');

    expect(captionEl).toBeInTheDocument();

    expect(getByTitle(testCaptionedVideoWithCaption.video.alt)).toBeInTheDocument();

    // TODO: restore axe tests, understand why it takes so long
    // expect(await axe(container)).toHaveNoViolations();

    rerender(
      <CaptionedVideo {...testCaptionedVideoNoCaption} responsiveConfig={testResponsiveConfig} />
    );

    expect(figureEl).not.toBeInTheDocument();
    expect(captionEl).not.toBeInTheDocument();
    expect(getByTitle(testCaptionedVideoWithCaption.video.alt)).toBeInTheDocument();

    // expect(await axe(container)).toHaveNoViolations();
  }, 10000);
});
