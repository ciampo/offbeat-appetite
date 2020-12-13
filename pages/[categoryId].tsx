import React from 'react';
import { GetStaticProps, GetStaticPaths } from 'next';

import PageMeta from '../components/meta/PageMeta';
import { PageContentContainer } from '../components/layouts/Containers';
import BlogPostTileList from '../components/blog-post-tile/BlogPostTileList';
import PageHero from '../components/hero/hero';

import routesConfig from '../routes-config';
import { compileSingleRoute, compileDynamicItem } from '../scripts/compile-routes';
import { generateWebpageStructuredData } from '../scripts/structured-data';

import {
  CompiledRoute,
  SanityCategoryFull,
  StructuredData,
  NextComponentTypeWithLayout,
} from '../typings';

const CATEGORY_PAGE_ROUTE = '/[categoryId]';

type CategoryProps = {
  categoryData: SanityCategoryFull;
  path: string;
  structuredData: StructuredData[];
};
const CategoryPage: NextComponentTypeWithLayout<CategoryProps> = ({
  categoryData,
  path,
  structuredData,
}) => (
  <>
    <PageMeta
      path={path}
      title={categoryData.seoTitle}
      description={categoryData.seoDescription}
      previewImage={categoryData.seoImage}
      structuredData={structuredData}
    />

    <PageHero variant="short" backgroundImage={categoryData.heroImage}>
      <PageContentContainer className="text-gray-white text-shadow text-center">
        <h1 className="type-display-1 mb-4 md:mb-5 xl:mb-6">{categoryData.title}</h1>
        <p>{categoryData.description}</p>
      </PageContentContainer>
    </PageHero>

    <PageContentContainer className="bg-inherit pt-12 pb-16 xsm:pb-20 md:pt-16 md:pb-24 xl:pt-24 xl:pb-32">
      {/* Title */}
      <h2 className="sr-only">All {categoryData.title} posts</h2>

      <BlogPostTileList
        postsData={categoryData.allBlogPosts}
        tileShadowVariant="lighter"
        tileLayoutVariant="horizontal"
        tileExtendedInfo={true}
      />
    </PageContentContainer>
  </>
);

export const getStaticPaths: GetStaticPaths = async () => {
  const categoryRoute = routesConfig.find(({ route }) => route === CATEGORY_PAGE_ROUTE);

  if (!categoryRoute) {
    return {
      paths: [],
      fallback: false,
    };
  }

  const allCategoriesData = await import(`../data/${categoryRoute.dynamicDataType}.json`).then(
    (m) => m.default
  );

  const compiledCategoryRoute: CompiledRoute = compileSingleRoute({
    routeConfig: categoryRoute,
    dynamicItemsData: allCategoriesData,
  });

  return {
    paths: compiledCategoryRoute.map(({ routeInfo }) => ({ params: routeInfo.query })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async (context) => {
  if (!context.params) {
    return { props: {} };
  }

  const categoryData: SanityCategoryFull = await import(
    `../data/categories/${context.params.categoryId}.json`
  ).then((m) => m.default);

  const compiledCategoryItem = compileDynamicItem({
    routeConfig: routesConfig.find(({ route }) => route === CATEGORY_PAGE_ROUTE),
    dynamicItem: categoryData,
  });

  if (!compiledCategoryItem) {
    return { props: {} };
  }
  const path = compiledCategoryItem.routeInfo.path;

  return {
    props: {
      categoryData,
      path,
      structuredData: [
        generateWebpageStructuredData({
          path,
          title: categoryData.seoTitle,
          description: categoryData.seoDescription,
          breadcrumbPages: [
            {
              path,
              title: categoryData.title,
            },
          ],
        }),
      ],
    },
  };
};

export default CategoryPage;
