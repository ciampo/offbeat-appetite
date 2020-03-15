import React from 'react';
import { NextComponentType, GetStaticProps } from 'next';

import PageMeta from '../components/PageMeta';
import SimplePortableText from '../components/portable-text/SimplePortableText';
import DefaultPageTransitionWrapper from '../components/page-transition-wrappers/Default';

import { SanityPageAbout } from '../typings';

type HomeProps = {
  aboutData: SanityPageAbout;
};
const AboutPage: NextComponentType<{}, HomeProps, HomeProps> = ({ aboutData }) => (
  <>
    <PageMeta
      path="/about"
      title={aboutData.seoTitle}
      description={aboutData.seoDescription}
      previewImage={aboutData.seoImage}
    />

    <DefaultPageTransitionWrapper>
      <h1>{aboutData.title}</h1>

      <SimplePortableText blocks={aboutData.content} />
    </DefaultPageTransitionWrapper>
  </>
);

export const getStaticProps: GetStaticProps = async () => {
  const aboutData = await import(`../data/pageAbout.json`).then((m) => m.default);

  return {
    props: {
      aboutData,
    },
  };
};
export default AboutPage;
