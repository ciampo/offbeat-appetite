import React from 'react';
import { axe } from 'jest-axe';
import { render } from 'offbeat-appetite-render';

import Card from '../Card';

const SampleContainerComponent = (props: { [key: string]: unknown }): JSX.Element => (
  <div {...props} data-testid="sample-container-component"></div>
);
const sampleContent = 'Test Card Component';

describe('Card', () => {
  test('renders with a valid configuration', async () => {
    const { getByText, getByTestId, container, rerender } = render(<Card>{sampleContent}</Card>);

    expect(getByText(sampleContent)).toBeInTheDocument();
    expect(getByTestId('card-container').className).toMatch(/shadow-neu-light(\s|$)/);

    expect(await axe(container)).toHaveNoViolations();

    rerender(<Card shadowVariant="lighter">{sampleContent}</Card>);

    expect(getByTestId('card-container').className).toMatch(/shadow-neu-lighter(\s|$)/);
    expect(await axe(container)).toHaveNoViolations();
  });

  test('renders with a custom component', async () => {
    const { getByText, getByTestId, queryByTestId, container } = render(
      <Card component={SampleContainerComponent}>{sampleContent}</Card>
    );

    expect(getByText(sampleContent)).toBeInTheDocument();
    expect(getByTestId('sample-container-component')).toBeInTheDocument();
    expect(queryByTestId('card-container')).not.toBeInTheDocument();

    expect(await axe(container)).toHaveNoViolations();
  });

  test('correctly adds custom classnames', async () => {
    const testClassname = 'test-classname test-classname-two';
    const { getByText, getByTestId, container } = render(
      <Card className={testClassname}>{sampleContent}</Card>
    );

    expect(getByText(sampleContent)).toBeInTheDocument();
    expect(getByTestId('card-container').className).toMatch(testClassname);

    expect(await axe(container)).toHaveNoViolations();
  });
});
