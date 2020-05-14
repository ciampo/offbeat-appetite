import React, { useCallback } from 'react';
import { GetStaticProps } from 'next';

import SimpleLayout from '../components/layouts/Simple';
import PageMeta from '../components/meta/PageMeta';
import SimplePortableText from '../components/portable-text/SimplePortableText';
import DefaultPageTransitionWrapper from '../components/page-transition-wrappers/Default';

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

      <DefaultPageTransitionWrapper>
        <header className="mt-16 md:mt-20 xl:mt-24">
          <h1>{thankYouData.title}</h1>
        </header>

        <SimplePortableText blocks={thankYouData.content} />

        <a href="/" onClick={onHomeClick}>
          Home
        </a>

        {process.browser && (
          <a href="/" onClick={onBackClick}>
            Back
          </a>
        )}
      </DefaultPageTransitionWrapper>
    </>
  );
};
ThankYouPage.Layout = SimpleLayout;

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
