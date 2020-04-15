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

  expect(container).toMatchInlineSnapshot(`
    <div>
      <div
        class="relative w-full h-0"
        style="background-color: rgb(195, 179, 167); padding-bottom: 56.25%;"
      >
        <img
          alt="The best koala in town "
          class="absolute top-0 left-0 w-full h-full object-cover"
          height="720"
          sizes="(min-width: 1024px) calc(48rem - 2 * 1.5rem),(min-width: 672px) calc(42rem - 2 * 1.5rem),calc(100vw - 2 * 1.5rem)"
          src="https://cdn.sanity.io/images//production/673168dce625d591c39090208482ae76210f3b2f-1280x720.jpg?w=327&fit=crop&auto=format"
          srcset="https://cdn.sanity.io/images//production/673168dce625d591c39090208482ae76210f3b2f-1280x720.jpg?w=327&fit=crop&auto=format 327w, https://cdn.sanity.io/images//production/673168dce625d591c39090208482ae76210f3b2f-1280x720.jpg?w=624&fit=crop&auto=format 624w, https://cdn.sanity.io/images//production/673168dce625d591c39090208482ae76210f3b2f-1280x720.jpg?w=654&fit=crop&auto=format 654w, https://cdn.sanity.io/images//production/673168dce625d591c39090208482ae76210f3b2f-1280x720.jpg?w=720&fit=crop&auto=format 720w, https://cdn.sanity.io/images//production/673168dce625d591c39090208482ae76210f3b2f-1280x720.jpg?w=1248&fit=crop&auto=format 1248w, https://cdn.sanity.io/images//production/673168dce625d591c39090208482ae76210f3b2f-1280x720.jpg?w=1440&fit=crop&auto=format 1440w"
          style="object-position: 62.601626016259985% 28.66215316957439%;"
          width="1280"
        />
      </div>
    </div>
  `);
});
