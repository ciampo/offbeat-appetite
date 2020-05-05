import React from 'react';

type DefaultContainerElementProps = {
  className: string;
};
const DefaultContainerElement: React.FC<DefaultContainerElementProps> = (props) => (
  <div {...props}></div>
);

type ContainerProps = {
  component?: (props: { [key: string]: unknown }) => JSX.Element;
  className?: string;
  [key: string]: unknown;
};

export const PageContentContainer: React.FC<ContainerProps> = ({
  component: Component = DefaultContainerElement,
  className,
  ...props
}) => (
  <Component
    {...props}
    className={['w-full max-w-6xl mx-auto px-6 xsm:px-8 sm:px-12 md:px-16 xl:px-20', className]
      .filter(Boolean)
      .join(' ')}
    data-testid="layout-page-container"
  />
);

export const ArticleContentContainer: React.FC<ContainerProps> = ({
  component,
  className,
  ...props
}) => (
  <PageContentContainer component={component} className={className}>
    <div
      {...props}
      className="w-full mx-auto max-w-lg md:max-w-xl xl:max-w-3xl"
      data-testid="layout-article-container"
    />
  </PageContentContainer>
);
