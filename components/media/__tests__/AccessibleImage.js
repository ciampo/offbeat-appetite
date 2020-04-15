import React from 'react';
import { render } from '@testing-library/react';
import AccessibleImage from '../AccessibleImage';
import { contentFullWidthResponsiveConfig } from '../sizes-presets';

const testImage = {
  _type: 'image',
  alt: 'The best koala in town ',
  asset: {
    _id: 'image-673168dce625d591c39090208482ae76210f3b2f-1280x720-jpg',
    assetId: '673168dce625d591c39090208482ae76210f3b2f',
    extension: 'jpg',
    metadata: {
      dimensions: {
        aspectRatio: 1.7777777777777777,
        height: 720,
        width: 1280,
      },
      palette: {
        dominant: {
          background: '#c3b3a7',
          foreground: '#000',
        },
      },
    },
    url:
      'https://cdn.sanity.io/images/gpe6axmm/production/673168dce625d591c39090208482ae76210f3b2f-1280x720.jpg',
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
    height: 0.3345485056274047,
    width: 0.1666666666666658,
    x: 0.6260162601625998,
    y: 0.2866215316957439,
  },
};

test('renders', () => {
  const { container, getByRole } = render(
    <AccessibleImage image={testImage} responsiveConfig={contentFullWidthResponsiveConfig} />
  );

  expect(getByRole('img')).toHaveAttribute('alt', testImage.alt);

  expect(container).toMatchSnapshot();
});
