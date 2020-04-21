import React from 'react';
import { NextComponentType, GetStaticProps } from 'next';

import PageMeta from '../components/PageMeta';
import DefaultPageTransitionWrapper from '../components/page-transition-wrappers/Default';
import NewsletterSubscribe, {
  NewsletterSubscribeVariant,
} from '../components/forms/NewsletterSubscribe';
import BlogPostPreview from '../components/blog-post/BlogPostPreview';
import AccessibleImage from '../components/media/AccessibleImage';
import { fullBleedImageResponsiveConfig } from '../components/media/image-responsive-configurations';

import { generateWebpageStructuredData } from '../scripts/structured-data';

import { SanityPageHome, SanityPageHomeCategorySection, StructuredData } from '../typings';

// Home Category Section
type HomeCategorySectionProps = {
  categorySectionData: SanityPageHomeCategorySection;
};
const HomeCategorySection: React.FC<HomeCategorySectionProps> = ({ categorySectionData }) => (
  <section className="py-8">
    <h2 className="text-2xl text-center">{categorySectionData.title}</h2>
    <ul className="flex justify-center mt-6">
      {categorySectionData.category.featuredBlogPosts.map((blogPostData) => (
        <li
          key={blogPostData._id}
          style={{
            maxWidth: '400px',
          }}
        >
          <BlogPostPreview blogPostData={blogPostData} />
        </li>
      ))}
    </ul>
  </section>
);

// Home Page
type HomeProps = {
  homeData: SanityPageHome;
  path: string;
  structuredData: StructuredData[];
};
const HomePage: NextComponentType<{}, HomeProps, HomeProps> = ({
  homeData,
  path,
  structuredData,
}) => (
  <>
    <PageMeta
      path={path}
      title={homeData.seoTitle}
      description={homeData.seoDescription}
      previewImage={homeData.seoImage}
      structuredData={structuredData}
    />

    <DefaultPageTransitionWrapper>
      <section className="relative h-screen min-h-hero max-h-hero">
        <div className="absolute text-center text-white z-10 text-shadow oba-transform-translate-center">
          <h1 className="text-4xl font-bold">{homeData.title}</h1>
          <p className="text-xl mt-8">{homeData.subtitle}</p>
        </div>

        <AccessibleImage
          image={homeData.heroImage}
          responsiveConfig={fullBleedImageResponsiveConfig}
          className="z-0 absolute inset-0 w-full h-full filter-darker"
          style={{
            paddingBottom: '0',
          }}
        />
      </section>

      <ul>
        {homeData.categorySections.map((categorySectionData, index) => (
          <li key={`${index}-${categorySectionData.category._id}`}>
            <HomeCategorySection categorySectionData={categorySectionData} />
          </li>
        ))}
      </ul>

      <NewsletterSubscribe variant={NewsletterSubscribeVariant.horizontal} formInstance="home" />
    </DefaultPageTransitionWrapper>
  </>
);

export const getStaticProps: GetStaticProps = async () => {
  const path = '/';
  const homeData = await import(`../data/pageHome.json`).then((m) => m.default);

  return {
    props: {
      homeData,
      path,
      structuredData: [
        generateWebpageStructuredData({
          path,
          title: homeData.seoTitle,
          description: homeData.seoDescription,
          breadcrumbPages: [],
        }),
      ],
    },
  };
};
export default HomePage;
