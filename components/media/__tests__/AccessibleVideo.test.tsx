import React from 'react';
import { axe } from 'jest-axe';
import { render, fireEvent } from 'offbeat-appetite-render';

import AccessibleVideo from '../AccessibleVideo';

const testVideo = {
  alt: 'Test video',
  poster: {
    _type: 'image',
    alt: '',
    asset: {
      _id: 'image-c7f3d2a5bfbf870f958d2d3ca704e0840d25f61e-3200x1800-png',
      assetId: 'c7f3d2a5bfbf870f958d2d3ca704e0840d25f61e',
      extension: 'png',
      metadata: {
        dimensions: {
          aspectRatio: 1.7777777777777777,
          height: 1800,
          width: 3200,
        },
        palette: {
          dominant: {
            background: '#cccccc',
            foreground: '#000',
          },
        },
      },
      url:
        'https://cdn.sanity.io/images/gpe6axmm/production/c7f3d2a5bfbf870f958d2d3ca704e0840d25f61e-3200x1800.png',
    },
    crop: {
      _type: 'sanity.imageCrop',
      bottom: 0,
      left: 0,
      right: 0,
      top: 0,
    },
    hotspot: {
      _type: 'sanity.imageHotspot',
      height: 0.3534635879218468,
      width: 0.23199999999999932,
      x: 0.36399999999999993,
      y: 0.2868561278863231,
    },
  },
  url:
    'https://cdn.sanity.io/files/gpe6axmm/production/2ffd447ced3e0a04edcdd3975c4b638f16df2f7f.mp4',
};

const testResponsiveConfig = {
  exports: [320, 480, 840],
  sizes: [
    {
      queryMinWidth: '600px',
      width: '32rem',
    },
    {
      width: '100vw',
    },
  ],
};

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

    expect(wrapperEl).toBeInTheDocument();
    expect(wrapperEl).toHaveAttribute('class', 'relative overflow-hidden');

    expect(imageEl).toBeInTheDocument();
    expect(imageEl).toHaveAttribute('loading', 'lazy');

    expect(videoEl).toBeInTheDocument();
    expect(videoEl).toHaveAttribute('tabindex', '-1');
    expect(videoEl).toHaveAttribute('poster', testVideo.poster.asset.url);

    expect(playButton).toBeInTheDocument();
    expect(playButton).toHaveTextContent(new RegExp(`play.*${testVideo.alt}`, 'i'));

    // CLick button = play
    fireEvent.click(playButton);

    expect(playButton).not.toBeInTheDocument();
    expect(spiedVideoPause).toHaveBeenCalledTimes(1);
    expect(videoEl).toHaveAttribute('tabindex', '0');
    expect(wrapperEl).toHaveAttribute('class', 'relative');

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

    expect(getByTestId('video-wrapper')).toHaveAttribute(
      'class',
      `${testClassname} overflow-hidden`
    );
  });
});
