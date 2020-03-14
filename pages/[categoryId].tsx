import React from 'react';
import { NextComponentType, GetStaticProps, GetStaticPaths } from 'next';

import PageMeta from '../components/PageMeta';
import DefaultPageTransitionWrapper from '../components/page-transition-wrappers/Default';
import BlogPostPreview from '../components/blog-post/BlogPostPreview';

import { compileSingleRoute, compileDynamicItem } from '../scripts/compile-routes';
import routesConfig from '../routes-config';
import { CompiledRoute, SanityCategoryFull } from '../typings';

const PAGE_ROUTE = '/[categoryId]';

type CategoryProps = {
  categoryData: SanityCategoryFull;
  path: string;
};
const CategoryPage: NextComponentType<{}, CategoryProps, CategoryProps> = ({
  categoryData,
  path,
}) => (
  <>
    <PageMeta
      path={path}
      title={categoryData.seoTitle}
      description={categoryData.seoDescription}
      previewImage={categoryData.seoImage}
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
  const categoryRoute = routesConfig.find(({ route }) => route === PAGE_ROUTE);

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
    routeConfig: routesConfig.find(({ route }) => route === PAGE_ROUTE),
    dynamicItem: categoryData,
  });

  return {
    props: {
      categoryData,
      path: compiledCategoryItem.routeInfo.path,
    },
  };
};

export default CategoryPage;
