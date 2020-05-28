import React, { MouseEvent } from 'react';
import { GetStaticProps } from 'next';

import { NextComponentTypeWithLayout } from '../typings';

import PageMeta from '../components/meta/PageMeta';

// Home Page
type Custom404Props = {
  homeSeoImage: string;
};
const Custom404: NextComponentTypeWithLayout<Custom404Props> = ({ homeSeoImage }) => {
  const onHomeClick = (e: MouseEvent): void => {
    e.preventDefault();
    if (window && window.location && window.location.replace) {
      window.location.replace('/');
    }
  };

  return (
    <>
      <PageMeta
        title="404: Page not found"
        description="The page could not be found"
        path="/404"
        previewImage={homeSeoImage}
      />

      <header className="min-h-screen flex flex-col items-center justify-center text-center space-y-4">
        <h1 className="type-display-2">Page not found</h1>
        <a href="/" onClick={onHomeClick}>
          Home
        </a>
      </header>
    </>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const homeData = await import(`../data/pageHome.json`).then((m) => m.default);

  return {
    props: {
      homeSeoImage: homeData.seoImage,
    },
  };
};

export default Custom404;
