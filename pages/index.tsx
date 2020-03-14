import React from 'react';
import { NextComponentType, GetStaticProps } from 'next';

import PageMeta from '../components/PageMeta';
import DefaultPageTransitionWrapper from '../components/page-transition-wrappers/Default';
import NewsletterSubcribe, {
  NewsletterSubcribeVariant,
} from '../components/forms/NewsletterSubscribe';
import BlogPostPreview from '../components/blog-post/BlogPostPreview';
import AccessibleImage from '../components/media/AccessibleImage';

import { SanityPageHome, SanityPageHomeCategorySection } from '../typings';

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
};
const HomePage: NextComponentType<{}, HomeProps, HomeProps> = ({ homeData }) => (
  <>
    <PageMeta
      path="/"
      title={homeData.seoTitle}
      description={homeData.seoDescription}
      previewImage={homeData.seoImage}
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
  const homeData = await import(`../data/pageHome.json`).then((m) => m.default);

  return {
    props: {
      homeData,
    },
  };
};
export default HomePage;
