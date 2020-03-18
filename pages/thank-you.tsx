import React from 'react';
import { NextComponentType, GetStaticProps } from 'next';

import PageMeta from '../components/PageMeta';
import SimplePortableText from '../components/portable-text/SimplePortableText';
import DefaultPageTransitionWrapper from '../components/page-transition-wrappers/Default';

import { generateWebpageStructuredData } from '../scripts/structured-data';

import { SanityPageThankYou, StructuredData } from '../typings';

type ThankYouProps = {
  thankYouData: SanityPageThankYou;
  path: string;
  webpageStructuredData: StructuredData;
};
const ThankYouPage: NextComponentType<{}, ThankYouProps, ThankYouProps> = ({
  thankYouData,
  path,
  webpageStructuredData,
}) => (
  <>
    <PageMeta
      path={path}
      title={thankYouData.seoTitle}
      description={thankYouData.seoDescription}
      previewImage={thankYouData.seoImage}
      webPageStructuredData={webpageStructuredData}
    />

    <DefaultPageTransitionWrapper>
      <h1>{thankYouData.title}</h1>

      <SimplePortableText blocks={thankYouData.content} />
    </DefaultPageTransitionWrapper>
  </>
);

export const getStaticProps: GetStaticProps = async () => {
  const path = '/thank-you';
  const thankYouData = await import(`../data/pageThankYou.json`).then((m) => m.default);

  return {
    props: {
      thankYouData,
      path,
      webpageStructuredData: generateWebpageStructuredData({
        path,
        title: thankYouData.seoTitle,
        description: thankYouData.seoDescription,
        breadcrumbPages: [],
      }),
    },
  };
};
export default ThankYouPage;
