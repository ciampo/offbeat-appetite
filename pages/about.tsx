import React, { useEffect } from 'react';
import { NextComponentType, GetStaticProps } from 'next';

import PageMeta from '../components/meta/PageMeta';
import SimplePortableText from '../components/portable-text/SimplePortableText';
import DefaultPageTransitionWrapper from '../components/page-transition-wrappers/Default';
import { useNavVariantDispatch } from '../components/nav/nav-variant-context';

import { generateWebpageStructuredData } from '../scripts/structured-data';

import { SanityPageAbout, StructuredData } from '../typings';

type AboutProps = {
  aboutData: SanityPageAbout;
  path: string;
  structuredData: StructuredData[];
};
const AboutPage: NextComponentType<{}, AboutProps, AboutProps> = ({
  aboutData,
  path,
  structuredData,
}) => {
  const setVariant = useNavVariantDispatch();
  useEffect(() => {
    setVariant('solid');
  }, [setVariant]);

  return (
    <>
      <PageMeta
        path={path}
        title={aboutData.seoTitle}
        description={aboutData.seoDescription}
        previewImage={aboutData.seoImage}
        structuredData={structuredData}
      />

      <DefaultPageTransitionWrapper>
        <h1>{aboutData.title}</h1>

        <SimplePortableText blocks={aboutData.content} />
      </DefaultPageTransitionWrapper>
    </>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const path = '/about';
  const aboutData = await import(`../data/pageAbout.json`).then((m) => m.default);

  return {
    props: {
      aboutData,
      path,
      structuredData: [
        generateWebpageStructuredData({
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
      ],
    },
  };
};
export default AboutPage;
