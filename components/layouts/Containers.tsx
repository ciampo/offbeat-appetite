import * as React from 'react';

type DefaultContainerElementProps = {
  className: string;
};
const DefaultContainerElement: React.FC<DefaultContainerElementProps> = (props) => (
  <div {...props}></div>
);

type PageContainerProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component?: React.FC<any>;
  className?: string;
  [key: string]: unknown;
};

export const PageContentContainer: React.FC<PageContainerProps> = ({
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

type ArticleContainerProps = PageContainerProps & {
  internalWrapperClassName?: string;
};

export const ArticleContentContainer: React.FC<ArticleContainerProps> = ({
  component,
  className,
  internalWrapperClassName,
  ...props
}) => (
  <PageContentContainer component={component} className={className}>
    <div
      {...props}
      className={['w-full mx-auto max-w-lg md:max-w-xl xl:max-w-3xl', internalWrapperClassName]
        .filter(Boolean)
        .join(' ')}
      data-testid="layout-article-container"
    />
  </PageContentContainer>
);
