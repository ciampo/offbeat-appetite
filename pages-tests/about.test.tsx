import * as React from 'react';
import { axe } from 'jest-axe';
import { render } from '../test/offbeat-appetite-render';

import AboutPage from '../pages/about';
import aboutData from '../data/pageAbout.json';
import { generateWebpageStructuredData } from '../scripts/structured-data';

describe('About Page', () => {
  test('it renders', async () => {
    const path = '/';
    const pageProps = {
      aboutData,
      path,
      structuredData: [
        generateWebpageStructuredData({
          path,
          title: aboutData.seoTitle,
          description: aboutData.seoDescription,
          breadcrumbPages: [
            {
              path,
              title: aboutData.title,
            },
          ],
        }),
      ],
    };
    const { container } = render(<AboutPage {...pageProps} />);

    expect(await axe(container)).toHaveNoViolations();

    // TODO: use mock data and add more tests
  }, 15000);
});
