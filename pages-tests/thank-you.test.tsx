import * as React from 'react';
import { axe } from 'jest-axe';
import { render } from '../test/offbeat-appetite-render';

import ThankYouPage from '../pages/thank-you';
import thankYouData from '../data/pageThankYou.json';

describe('Thank You Page', () => {
  test('it renders', async () => {
    const path = '/thank-you';
    const pageProps = {
      thankYouData,
      path,
    };
    const { container } = render(<ThankYouPage {...pageProps} />);

    expect(await axe(container)).toHaveNoViolations();

    // TODO: use mock data and add more tests
  }, 15000);
});
