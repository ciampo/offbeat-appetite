import React from 'react';
import { axe } from 'jest-axe';
import { render } from 'offbeat-appetite-render';

import HomePage from '../pages/index';
import homeData from '../data/pageHome.json';
import { generateWebpageStructuredData } from '../scripts/structured-data';

describe('Home Page', () => {
  test('it renders', async () => {
    const path = '/';
    const pageProps = {
      homeData,
      path,
      structuredData: [
        generateWebpageStructuredData({
          path,
          title: homeData.seoTitle,
          description: homeData.seoDescription,
          breadcrumbPages: [],
        }),
      ],
    };
    const { container } = render(<HomePage {...pageProps} />);

    expect(await axe(container)).toHaveNoViolations();

    // TODO: use mock data and add more tests
  }, 15000);
});
