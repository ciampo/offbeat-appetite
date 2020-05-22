import React, { useEffect, memo } from 'react';
import { GetStaticProps } from 'next';

import PageMeta from '../components/meta/PageMeta';
import { PageContentContainer } from '../components/layouts/Containers';
import DefaultPageTransitionWrapper from '../components/page-transition-wrappers/Default';
import { OALogoFull } from '../components/icons';
import { useNavVariantDispatch } from '../components/nav/nav-variant-context';
import BlogPostTileList from '../components/blog-post-tile/BlogPostTileList';

import routesConfig from '../routes-config';
import { compileSingleRoute } from '../scripts/compile-routes';
import { generateWebpageStructuredData } from '../scripts/structured-data';

import {
  SanityPageHome,
  SanityPageHomeCategorySection,
  StructuredData,
  NextComponentTypeWithLayout,
} from '../typings';

const BLOGPOST_PAGE_ROUTE = '/[categoryId]/[postId]';

// Home Category Section
type HomeCategorySectionProps = {
  categorySectionData: SanityPageHomeCategorySection;
  even: boolean;
};
const HomeCategorySection: React.FC<HomeCategorySectionProps> = memo(
  ({ categorySectionData, even }) => (
    <section
      className={['py-16 md:py-20 xl:py-24', even ? 'bg-gray-lighter' : 'bg-gray-light']
        .filter(Boolean)
        .join(' ')}
    >
      <PageContentContainer className="space-y-10 md:space-y-12 xl:space-y-16 bg-inherit">
        {/* Title */}
        <h2 className="type-display-2 flex justify-center">
          <span className="mr-3" aria-hidden="true">
            —
          </span>
          {categorySectionData.title}
          <span className="ml-3" aria-hidden="true">
            —
          </span>
        </h2>
        {/* Tiles */}
        <BlogPostTileList
          tileShadowVariant={even ? 'lighter' : 'light'}
          tileLayoutVariant={
            categorySectionData.category.featuredBlogPosts.length === 1 ? 'horizontal' : 'vertical'
          }
          postsData={categorySectionData.category.featuredBlogPosts}
        />
        {/* See more link */}
        <a href="#">TODO see more</a>
      </PageContentContainer>
    </section>
  )
);
HomeCategorySection.displayName = 'memo(HomeCategorySection)';

// Home Page
type HomeProps = {
  homeData: SanityPageHome;
  path: string;
  structuredData: StructuredData[];
};
const HomePage: NextComponentTypeWithLayout<HomeProps> = ({ homeData, path, structuredData }) => {
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
              className="w-56 xsm:w-64 sm:w-72 md:w-80 lg:w-88 xl:w-96"
            />
          </h1>
          <p className="type-eyebrow">{homeData.subtitle}</p>
        </header>
        {homeData.categorySections.map((categorySectionData, index) => (
          <HomeCategorySection
            key={categorySectionData.category._id}
            categorySectionData={categorySectionData}
            even={index % 2 === 0}
          />
        ))}
      </DefaultPageTransitionWrapper>
    </>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const path = '/';
  const homeData = await import(`../data/pageHome.json`).then((m) => m.default);

  for (const categorySection of homeData.categorySections) {
    categorySection.category.featuredBlogPosts = categorySection.category.featuredBlogPosts.map(
      (blogPost) => {
        const blogPostRoute = routesConfig.find(({ route }) => route === BLOGPOST_PAGE_ROUTE);
        const compiledBlogPostRoute = compileSingleRoute({
          routeConfig: blogPostRoute,
          dynamicItemsData: [blogPost],
        })[0];

        return {
          ...blogPost,
          compiledRoute: compiledBlogPostRoute.routeInfo,
        };
      }
    );
  }

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
