import React, { useEffect } from 'react';
import { NextComponentType, GetStaticProps } from 'next';

import PageMeta from '../components/meta/PageMeta';
import SimplePortableText from '../components/portable-text/SimplePortableText';
import DefaultPageTransitionWrapper from '../components/page-transition-wrappers/Default';
import { useNavVariantDispatch } from '../components/nav/nav-variant-context';

import { SanityPageThankYou } from '../typings';

type ThankYouProps = {
  thankYouData: SanityPageThankYou;
  path: string;
};
const ThankYouPage: NextComponentType<{}, ThankYouProps, ThankYouProps> = ({
  thankYouData,
  path,
}) => {
  const setVariant = useNavVariantDispatch();
  useEffect(() => {
    setVariant('solid');
  }, [setVariant]);

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
      </DefaultPageTransitionWrapper>
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
