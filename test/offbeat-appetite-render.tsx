import React, { ReactElement } from 'react';

import { NextRouter } from 'next/router';
import { RouterContext } from 'next/dist/next-server/lib/router-context';
import { render as rtlRender, RenderOptions, RenderResult } from '@testing-library/react';

import { NavVariantProvider } from '../components/nav/nav-variant-context';
import { SharingImageProvider } from '../components/meta/sharing-image-context';
import { PostReviewsProvider } from '../components/blog-post/blog-post-reviews-context';

interface AugmentedRenderOptions extends RenderOptions {
  router?: Partial<NextRouter>;
}

const emptyRouter: NextRouter = {
  route: '',
  pathname: '',
  basePath: '',
  query: {},
  asPath: '',
  push: async () => true,
  replace: async () => true,
  reload: () => null,
  back: () => null,
  prefetch: async () => undefined,
  beforePopState: () => null,
  isFallback: false,
  events: {
    on: (): null => null,
    off: (): null => null,
    emit: (): null => null,
  },
};

function render(ui: ReactElement, options: AugmentedRenderOptions = {}): RenderResult {
  const { router, ...otherOptions } = options;

  const Wrapper: React.FC = ({ children }) => (
    <RouterContext.Provider
      value={{
        ...emptyRouter,
        ...router,
      }}
    >
      <SharingImageProvider>
        <NavVariantProvider>
          <PostReviewsProvider>{children}</PostReviewsProvider>
        </NavVariantProvider>
      </SharingImageProvider>
    </RouterContext.Provider>
  );

  return rtlRender(ui, { wrapper: Wrapper, ...otherOptions });
}

export * from '@testing-library/react';
// override the built-in render with our own
export { render };
