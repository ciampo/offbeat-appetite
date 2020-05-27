// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import preloadAll from 'jest-next-dynamic';

import React from 'react';
import { axe } from 'jest-axe';
import { render } from 'offbeat-appetite-render';

import SimpleLayout from '../Simple';

const sampleContentText = 'test content';
const SampleContent: React.FC = () => <div>{sampleContentText}</div>;

describe('SimpleLayout', () => {
  test('renders with a valid configuration', async () => {
    await preloadAll();

    const { getByText, getByTestId, queryByTestId, container } = render(
      <SimpleLayout>
        <SampleContent />
      </SimpleLayout>
    );

    expect(getByText(sampleContentText)).toBeInTheDocument();
    expect(getByTestId('simple-layout-main-content')).toBeInTheDocument();
    expect(getByTestId('simple-layout-main-content')).toHaveAttribute('tabindex', '-1');
    expect(getByTestId('simple-layout-main-content')).toHaveAttribute('id', 'content');
    expect(getByTestId('simple-layout-main-content').className).toMatch('outline-none');

    expect(getByTestId('drawer-menu-wrapper')).toBeInTheDocument();
    expect(getByTestId('header-nav-wrapper')).toBeInTheDocument();
    expect(getByTestId('site-footer-wrapper')).toBeInTheDocument();
    expect(queryByTestId('subscribe-form-section-wrapper')).not.toBeInTheDocument();

    expect(await axe(container)).toHaveNoViolations();
  }, 10000);
});
