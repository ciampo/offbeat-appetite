import React, { memo, useEffect } from 'react';
import { GetStaticProps } from 'next';

import PageMeta from '../components/meta/PageMeta';
import RichPortableText from '../components/portable-text/RichPortableText';
import { ArticleContentContainer } from '../components/layouts/Containers';
import DefaultPageTransitionWrapper from '../components/page-transition-wrappers/Default';
import { useNavVariantDispatch } from '../components/nav/nav-variant-context';

import { generateWebpageStructuredData } from '../scripts/structured-data';

import { SanityPageAbout, StructuredData, NextComponentTypeWithLayout } from '../typings';

const BasicSectionEl: React.FC = memo((props) => <section {...props} />);
BasicSectionEl.displayName = 'memo(BasicSectionEl)';

type AboutProps = {
  aboutData: SanityPageAbout;
  path: string;
  structuredData: StructuredData[];
};
const AboutPage: NextComponentTypeWithLayout<AboutProps> = ({
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
        <header className="pt-40 pb-12 md:pt-48 md:pb-16 xl:pt-64 xl:pb-24">
          <h1 className="text-center type-display-1">{aboutData.heroTitle}</h1>
        </header>

        <ArticleContentContainer
          component={BasicSectionEl}
          className="pt-12 pb-16 xsm:pb-20 md:pt-16 md:pb-24 xl:pt-24 xl:pb-32"
        >
          <RichPortableText blocks={aboutData.content} />
        </ArticleContentContainer>
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
