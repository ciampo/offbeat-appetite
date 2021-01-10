import * as React from 'react';
import { axe } from 'jest-axe';
import { render } from 'offbeat-appetite-render';

import { ArticleContentContainer, PageContentContainer } from '../Containers';

const SampleContainerComponent: React.FC = (props) => (
  <div {...props} data-testid="sample-container-component"></div>
);
const sampleContent = 'Test Container Layout Components';

describe('PageContentContainer', () => {
  test('renders with a valid configuration', async () => {
    const { getByText, getByTestId, container } = render(
      <PageContentContainer>{sampleContent}</PageContentContainer>
    );

    expect(getByText(sampleContent)).toBeInTheDocument();
    expect(getByTestId('layout-page-container')).toBeInTheDocument();

    const axeResults = await axe(container);
    expect(axeResults).toHaveNoViolations();
  });

  test('renders with a custom component', async () => {
    const { getByText, getByTestId, queryByTestId, container } = render(
      <PageContentContainer component={SampleContainerComponent}>
        {sampleContent}
      </PageContentContainer>
    );

    expect(getByText(sampleContent)).toBeInTheDocument();
    expect(getByTestId('sample-container-component')).toBeInTheDocument();
    expect(queryByTestId('layout-page-container')).not.toBeInTheDocument();

    const axeResults = await axe(container);
    expect(axeResults).toHaveNoViolations();
  });

  test('correctly adds custom classnames', async () => {
    const testClassname = 'test-classname test-classname-two';
    const { getByText, getByTestId, container } = render(
      <PageContentContainer className={testClassname}>{sampleContent}</PageContentContainer>
    );

    expect(getByText(sampleContent)).toBeInTheDocument();
    expect(getByTestId('layout-page-container').className).toMatch(testClassname);

    const axeResults = await axe(container);
    expect(axeResults).toHaveNoViolations();
  });
});

describe('ArticleContentContainer', () => {
  test('renders with a valid configuration', async () => {
    const { getByText, getByTestId, container } = render(
      <ArticleContentContainer>{sampleContent}</ArticleContentContainer>
    );

    expect(getByText(sampleContent)).toBeInTheDocument();
    expect(getByTestId('layout-page-container')).toBeInTheDocument();
    expect(getByTestId('layout-article-container')).toBeInTheDocument();

    const axeResults = await axe(container);
    expect(axeResults).toHaveNoViolations();
  });

  test('renders with a custom component', async () => {
    const { getByText, getByTestId, queryByTestId, container } = render(
      <ArticleContentContainer component={SampleContainerComponent}>
        {sampleContent}
      </ArticleContentContainer>
    );

    expect(getByText(sampleContent)).toBeInTheDocument();
    expect(getByTestId('sample-container-component')).toBeInTheDocument();
    expect(getByTestId('layout-article-container')).toBeInTheDocument();
    expect(queryByTestId('layout-page-container')).not.toBeInTheDocument();

    const axeResults = await axe(container);
    expect(axeResults).toHaveNoViolations();
  });

  test('correctly adds custom classnames', async () => {
    const testClassname = 'test-classname test-classname-two';
    const { getByText, getByTestId, container } = render(
      <ArticleContentContainer className={testClassname}>{sampleContent}</ArticleContentContainer>
    );

    expect(getByText(sampleContent)).toBeInTheDocument();
    expect(getByTestId('layout-page-container').className).toMatch(testClassname);

    const axeResults = await axe(container);
    expect(axeResults).toHaveNoViolations();
  });
});
