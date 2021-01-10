import * as React from 'react';
import { axe } from 'jest-axe';
import { render, fireEvent } from 'offbeat-appetite-render';

import AccessibleVideo from '../AccessibleVideo';

import { testVideo, testResponsiveConfig } from '../__tests_dummy_data__/mock-data';

// Spy on console.warn
let spiedVideoPause: jest.SpyInstance;

beforeAll(() => {
  spiedVideoPause = jest.spyOn(window.HTMLMediaElement.prototype, 'play').mockImplementation(
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    () => new Promise(() => {})
  );
});

afterAll(() => {
  spiedVideoPause.mockRestore();
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('AccessibleVideo', () => {
  test('renders with a valid configuration', async () => {
    const { getByRole, getByTitle, getByTestId, container } = render(
      <AccessibleVideo video={testVideo} responsiveConfig={testResponsiveConfig} />
    );

    const videoEl = getByTitle(testVideo.alt);
    const imageEl = getByRole('img');
    const playButton = getByRole('button');
    const wrapperEl = getByTestId('video-wrapper');
    const imageWrapperEl = getByTestId('image-wrapper');

    expect(wrapperEl).toBeInTheDocument();
    expect(wrapperEl).toHaveAttribute('class', 'relative');

    expect(imageEl).toBeInTheDocument();
    expect(imageWrapperEl.className).not.toMatch('invisible');
    expect(imageEl).toHaveAttribute('loading', 'lazy');

    expect(videoEl).toBeInTheDocument();
    expect(videoEl).toHaveAttribute('tabindex', '-1');

    expect(playButton).toBeInTheDocument();
    expect(playButton).toHaveTextContent(new RegExp(`play.*${testVideo.alt}`, 'i'));

    // CLick button = play
    fireEvent.click(playButton);

    expect(playButton).not.toBeInTheDocument();

    expect(imageEl).toBeInTheDocument();
    expect(imageWrapperEl.className).toMatch('invisible');

    expect(videoEl).toBeInTheDocument();

    expect(spiedVideoPause).toHaveBeenCalledTimes(1);
    expect(videoEl).toHaveAttribute('tabindex', '0');

    const axeResults = await axe(container);
    expect(axeResults).toHaveNoViolations();
  });

  test('correctly applies a given classname', () => {
    const testClassname = 'test-classname';
    const { getByTestId } = render(
      <AccessibleVideo
        video={testVideo}
        responsiveConfig={testResponsiveConfig}
        className={testClassname}
      />
    );

    expect(getByTestId('video-wrapper')).toHaveAttribute('class', testClassname);
  });
});
