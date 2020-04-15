import React from 'react';
import { render } from 'offbeat-appetite-render';

import AccessibleImage from '../AccessibleImage';
import { contentFullWidthResponsiveConfig } from '../sizes-presets';

import { heroImage as homePageHeroImage } from '../../../data/pageHome.json';

test('renders', () => {
  const { getByRole } = render(
    <AccessibleImage
      image={homePageHeroImage}
      responsiveConfig={contentFullWidthResponsiveConfig}
    />
  );

  expect(getByRole('img')).toHaveAttribute('alt', homePageHeroImage.alt);
});
