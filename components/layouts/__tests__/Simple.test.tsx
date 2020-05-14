import React from 'react';
import { axe } from 'jest-axe';
import { render } from 'offbeat-appetite-render';

import SimpleLayout from '../Simple';

const sampleContentText = 'test content';
const SampleContent: React.FC = () => <div>{sampleContentText}</div>;

describe('SimpleLayout', () => {
  test('renders with a valid configuration', async () => {
    const { getByText, getByTestId, container } = render(
      <SimpleLayout>
        <SampleContent />
      </SimpleLayout>
    );

    expect(getByText(sampleContentText)).toBeInTheDocument();
    expect(getByTestId('simple-layout-main-content')).toBeInTheDocument();
    expect(getByTestId('simple-layout-main-content')).toHaveAttribute('tabindex', '-1');
    expect(getByTestId('simple-layout-main-content')).toHaveAttribute('id', 'content');
    expect(getByTestId('simple-layout-main-content').className).toMatch('outline-none');

    expect(await axe(container)).toHaveNoViolations();
  });
});
