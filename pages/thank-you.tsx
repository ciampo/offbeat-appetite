import React, { useCallback } from 'react';
import { GetStaticProps } from 'next';

import PageMeta from '../components/meta/PageMeta';
import RichPortableText from '../components/portable-text/RichPortableText';

import { SanityPageThankYou, NextComponentTypeWithLayout } from '../typings';

type ThankYouProps = {
  thankYouData: SanityPageThankYou;
  path: string;
};

const ThankYouPage: NextComponentTypeWithLayout<ThankYouProps> = ({ thankYouData, path }) => {
  const onBackClick = useCallback((e) => {
    e.preventDefault();
    if (window && window.history && window.history.back) {
      window.history.back();
    }
  }, []);

  const onHomeClick = useCallback((e) => {
    e.preventDefault();
    if (window && window.location && window.location.replace) {
      window.location.replace('/');
    }
  }, []);

  return (
    <>
      <PageMeta
        path={path}
        title={thankYouData.seoTitle}
        description={thankYouData.seoDescription}
        previewImage={thankYouData.seoImage}
      />

      <header className="min-h-screen flex flex-col items-center justify-center text-center space-y-4 px-6 sm:px-8 md:px-12 xl:px-16">
        <h1 className="type-display-1">{thankYouData.title}</h1>

        <RichPortableText blocks={thankYouData.content} />

        <div className="flex space-x-4">
          <a href="/" onClick={onHomeClick}>
            Home
          </a>

          {process.browser && (
            <a href="/" onClick={onBackClick}>
              Back
            </a>
          )}
        </div>
      </header>
    </>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const path = '/thank-you';
  const thankYouData = await import(`../data/pageThankYou.json`).then((m) => m.default);

  return {
    props: {
      thankYouData,
      path,
    },
  };
};
export default ThankYouPage;
