import React, { memo } from 'react';
import { GetStaticProps } from 'next';

import PageMeta from '../components/meta/PageMeta';
import { PageContentContainer } from '../components/layouts/Containers';
import RichPortableText from '../components/portable-text/RichPortableText';
import { ArticleContentContainer } from '../components/layouts/Containers';
import PageHero from '../components/hero/hero';

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
}) => (
  <>
    <PageMeta
      path={path}
      title={aboutData.seoTitle}
      description={aboutData.seoDescription}
      previewImage={aboutData.seoImage}
      structuredData={structuredData}
    />

    {/* TODO: Add hero header image to CMS */}
    <PageHero variant="short" className="bg-pink-medium">
      <PageContentContainer>
        <h1 className="type-display-1">{aboutData.heroTitle}</h1>
      </PageContentContainer>
    </PageHero>

    <ArticleContentContainer
      component={BasicSectionEl}
      className="pt-12 pb-16 xsm:pb-20 md:pt-16 md:pb-24 xl:pt-24 xl:pb-32"
    >
      <RichPortableText blocks={aboutData.content} />
    </ArticleContentContainer>
  </>
);

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
