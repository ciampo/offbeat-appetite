import React from 'react';
import { NextComponentType, GetStaticProps } from 'next';

import PageMeta from '../components/PageMeta';
import SimplePortableText from '../components/portable-text/SimplePortableText';
import DefaultPageTransitionWrapper from '../components/page-transition-wrappers/Default';

import { generateWebpageStructuredData } from '../scripts/structured-data';

import { SanityPageAbout, StructuredData } from '../typings';

type AboutProps = {
  aboutData: SanityPageAbout;
  path: string;
  webpageStructuredData: StructuredData;
};
const AboutPage: NextComponentType<{}, AboutProps, AboutProps> = ({
  aboutData,
  path,
  webpageStructuredData,
}) => (
  <>
    <PageMeta
      path={path}
      title={aboutData.seoTitle}
      description={aboutData.seoDescription}
      previewImage={aboutData.seoImage}
      webPageStructuredData={webpageStructuredData}
    />

    <DefaultPageTransitionWrapper>
      <h1>{aboutData.title}</h1>

      <SimplePortableText blocks={aboutData.content} />
    </DefaultPageTransitionWrapper>
  </>
);

export const getStaticProps: GetStaticProps = async () => {
  const path = '/about';
  const aboutData = await import(`../data/pageAbout.json`).then((m) => m.default);

  return {
    props: {
      aboutData,
      path,
      webpageStructuredData: generateWebpageStructuredData({
        path,
        title: aboutData.seoTitle,
        description: aboutData.seoDescription,
        breadcrumbPages: [
          {
            path,
            title: aboutData.title,
          },
        ],
      }),
    },
  };
};
export default AboutPage;
