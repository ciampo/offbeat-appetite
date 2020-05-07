import React, { useEffect } from 'react';
import { NextComponentType, GetStaticProps } from 'next';

import PageMeta from '../components/meta/PageMeta';
import DefaultPageTransitionWrapper from '../components/page-transition-wrappers/Default';
import NewsletterSubscribe, {
  NewsletterSubscribeVariant,
} from '../components/forms/NewsletterSubscribe';
import { OALogoFull } from '../components/icons';
import { useNavVariantDispatch } from '../components/nav/nav-variant-context';
import BlogPostPreview from '../components/blog-post/BlogPostPreview';

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
}) => {
  const setVariant = useNavVariantDispatch();
  useEffect(() => {
    setVariant('solid');
  }, [setVariant]);

  return (
    <>
      <PageMeta
        path={path}
        title={homeData.seoTitle}
        description={homeData.seoDescription}
        previewImage={homeData.seoImage}
        structuredData={structuredData}
      />

      <DefaultPageTransitionWrapper>
        <header
          className={[
            'flex flex-col items-center justify-center',
            'mt-16 md:mt-20 xl:mt-24',
            'py-4 xsm:py-8 md:py-12 lg:py-16 xl:py-20',
            'space-y-2 md:space-3 xl:space-y-4',
          ].join(' ')}
        >
          <h1>
            <OALogoFull
              aria-label={homeData.title}
              className="w-56 xsm:w-64 md:w-72 lg:w-80 xl:w-88"
            />
          </h1>
          <p className="type-eyebrow">{homeData.subtitle}</p>
        </header>
        <section>
          <ul>
            {homeData.categorySections.map((categorySectionData, index) => (
              <li key={`${index}-${categorySectionData.category._id}`}>
                <HomeCategorySection categorySectionData={categorySectionData} />
              </li>
            ))}
          </ul>
        </section>

        <NewsletterSubscribe variant={NewsletterSubscribeVariant.horizontal} formInstance="home" />
      </DefaultPageTransitionWrapper>
    </>
  );
};

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
