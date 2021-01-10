import * as React from 'react';
import { axe } from 'jest-axe';
import { render } from 'offbeat-appetite-render';

import Tag from '../Tag';

const sampleContent = 'Test Tag Component';

describe('Tag', () => {
  test('renders with a valid configuration', async () => {
    const { getByText, container } = render(<Tag>{sampleContent}</Tag>);

    expect(getByText(sampleContent)).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });

  test('correctly adds custom classnames', async () => {
    const testClassname = 'test-classname test-classname-two';
    const { getByText, getByTestId, container } = render(
      <Tag className={testClassname}>{sampleContent}</Tag>
    );

    expect(getByText(sampleContent)).toBeInTheDocument();
    expect(getByTestId('tag-container').className).toMatch(testClassname);

    expect(await axe(container)).toHaveNoViolations();
  });
});
