import React from 'react';
import { NextComponentType, GetStaticProps, GetStaticPaths } from 'next';

import PageMeta from '../components/PageMeta';
import DefaultPageTransitionWrapper from '../components/page-transition-wrappers/Default';
import BlogPostPreview from '../components/blog-post/BlogPostPreview';

import routesConfig from '../routes-config';
import { compileSingleRoute, compileDynamicItem } from '../scripts/compile-routes';
import { generateWebpageStructuredData } from '../scripts/structured-data';

import { CompiledRoute, SanityCategoryFull, StructuredData } from '../typings';

const CATEGORY_PAGE_ROUTE = '/[categoryId]';

type CategoryProps = {
  categoryData: SanityCategoryFull;
  path: string;
  structuredData: StructuredData[];
};
const CategoryPage: NextComponentType<{}, CategoryProps, CategoryProps> = ({
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

    <DefaultPageTransitionWrapper>
      <h1>{categoryData.title}</h1>
      <p>All posts:</p>
      <ul>
        {categoryData.allBlogPosts.map((blogPostData) => (
          <li key={blogPostData._id}>
            <BlogPostPreview blogPostData={blogPostData} />
          </li>
        ))}
      </ul>
    </DefaultPageTransitionWrapper>
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

  const categoryData = await import(`../data/categories/${context.params.categoryId}.json`).then(
    (m) => m.default
  );

  const compiledCategoryItem = compileDynamicItem({
    routeConfig: routesConfig.find(({ route }) => route === CATEGORY_PAGE_ROUTE),
    dynamicItem: categoryData,
  });
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
