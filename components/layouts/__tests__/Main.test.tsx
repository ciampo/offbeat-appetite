// @ts-ignore
import preloadAll from 'jest-next-dynamic';

import * as React from 'react';
import { axe } from 'jest-axe';
import { render } from '../../../test/offbeat-appetite-render';

import MainLayout from '../Main';

const sampleContentText = 'test content';
const SampleContent: React.FC = () => <div>{sampleContentText}</div>;

describe('MainLayout', () => {
  test('renders with a valid configuration', async () => {
    await preloadAll();

    const { getByText, getByTestId, container } = render(
      <MainLayout>
        <SampleContent />
      </MainLayout>
    );

    expect(getByText(sampleContentText)).toBeInTheDocument();
    expect(getByTestId('main-layout-main-content')).toBeInTheDocument();
    expect(getByTestId('main-layout-main-content')).toHaveAttribute('tabindex', '-1');
    expect(getByTestId('main-layout-main-content')).toHaveAttribute('id', 'site-content');
    expect(getByTestId('main-layout-main-content').className).toMatch('outline-none');

    expect(getByTestId('drawer-menu-wrapper')).toBeInTheDocument();

    expect(getByTestId('header-nav-wrapper')).toBeInTheDocument();
    expect(getByTestId('header-nav-wrapper')).toHaveAttribute('id', 'site-header');

    expect(getByTestId('site-footer-wrapper')).toBeInTheDocument();
    expect(getByTestId('site-footer-wrapper')).toHaveAttribute('id', 'site-footer');

    expect(getByTestId('subscribe-form-section-wrapper')).toBeInTheDocument();

    expect(await axe(container)).toHaveNoViolations();
  }, 10000);
});
