import React from 'react';
import { NextComponentType, GetStaticProps } from 'next';

import PageMeta from '../components/PageMeta';
import DefaultPageTransitionWrapper from '../components/page-transition-wrappers/Default';
import NewsletterSubcribe, {
  NewsletterSubcribeVariant,
} from '../components/forms/NewsletterSubscribe';
import BlogPostPreview from '../components/blog-post/BlogPostPreview';
import AccessibleImage from '../components/media/AccessibleImage';

import { generateWebpageStructuredData } from '../scripts/structured-data';

import { SanityPageHome, SanityPageHomeCategorySection, StructuredData } from '../typings';

// Home Category Section
type HomeCategorySectionProps = {
  categorySectionData: SanityPageHomeCategorySection;
};
const HomeCategorySection: React.FC<HomeCategorySectionProps> = ({ categorySectionData }) => (
  <>
    <h2>{categorySectionData.title}</h2>
    <ul>
      {categorySectionData.category.featuredBlogPosts.map((blogPostData) => (
        <li key={blogPostData._id}>
          <BlogPostPreview blogPostData={blogPostData} />
        </li>
      ))}
    </ul>
  </>
);

// Home Page
type HomeProps = {
  homeData: SanityPageHome;
  path: string;
  webpageStructuredData: StructuredData;
};
const HomePage: NextComponentType<{}, HomeProps, HomeProps> = ({
  homeData,
  path,
  webpageStructuredData,
}) => (
  <>
    <PageMeta
      path={path}
      title={homeData.seoTitle}
      description={homeData.seoDescription}
      previewImage={homeData.seoImage}
      webPageStructuredData={webpageStructuredData}
    />

    <DefaultPageTransitionWrapper>
      <h1>{homeData.title}</h1>
      <p>{homeData.subtitle}</p>

      <AccessibleImage image={homeData.heroImage} />

      <ul>
        {homeData.categorySections.map((categorySectionData, index) => (
          <li key={`${index}-${categorySectionData.category._id}`}>
            <HomeCategorySection categorySectionData={categorySectionData} />
          </li>
        ))}
      </ul>

      <NewsletterSubcribe
        variant={NewsletterSubcribeVariant.horizontal}
        formInstance="subcribe-home"
      />
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
      webpageStructuredData: generateWebpageStructuredData({
        path,
        title: homeData.seoTitle,
        description: homeData.seoDescription,
        breadcrumbPages: [],
      }),
    },
  };
};
export default HomePage;
