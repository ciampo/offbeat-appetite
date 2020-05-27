import React, { MouseEvent } from 'react';
import { NextComponentTypeWithLayout } from '../typings';

import SimpleLayout from '../components/layouts/Simple';
import PageMeta from '../components/meta/PageMeta';
import DefaultPageTransitionWrapper from '../components/page-transition-wrappers/Default';

const Custom404: NextComponentTypeWithLayout = () => {
  const onHomeClick = (e: MouseEvent): void => {
    e.preventDefault();
    if (window && window.location && window.location.replace) {
      window.location.replace('/');
    }
  };

  return (
    <>
      <PageMeta title="404: Page not found" description="The page could not be found" path="/404" />

      <DefaultPageTransitionWrapper>
        <header className="min-h-screen flex flex-col items-center justify-center text-center space-y-4">
          <h1 className="type-display-2">Page not found</h1>
          <a href="/" onClick={onHomeClick}>
            Home
          </a>
        </header>
      </DefaultPageTransitionWrapper>
    </>
  );
};
Custom404.Layout = SimpleLayout;

export default Custom404;
