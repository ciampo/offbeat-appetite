// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import preloadAll from 'jest-next-dynamic';

import React from 'react';
import { axe } from 'jest-axe';
import { render } from 'offbeat-appetite-render';

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
    expect(getByTestId('main-layout-main-content')).toHaveAttribute('id', 'content');
    expect(getByTestId('main-layout-main-content').className).toMatch('outline-none');

    expect(getByTestId('drawer-menu-wrapper')).toBeInTheDocument();
    expect(getByTestId('header-nav-wrapper')).toBeInTheDocument();

    expect(await axe(container)).toHaveNoViolations();
  });
});
