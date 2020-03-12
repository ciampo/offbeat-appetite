import React from 'react';
import { NextComponentType, GetStaticProps, GetStaticPaths } from 'next';

import routesConfig from '../routes-config';
import { compileSingleRoute } from '../scripts/compile-routes';
import DefaultPageTransitionWrapper from '../components/page-transition-wrappers/Default';
import BlogPostPreview from '../components/blog-post/BlogPostPreview';

import { CompiledRoute, SanityCategoryFull } from '../typings';

const Category: NextComponentType<{}, SanityCategoryFull, SanityCategoryFull> = (categoryData) => {
  const { title, allBlogPosts } = categoryData;

  return (
    <DefaultPageTransitionWrapper>
      <h1>{title}</h1>
      <p>All posts:</p>
      <ul>
        {allBlogPosts.map((blogPostData) => (
          <li key={blogPostData._id}>
            <BlogPostPreview blogPostData={blogPostData} />
          </li>
        ))}
      </ul>
    </DefaultPageTransitionWrapper>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const categoryRoute = routesConfig.find(({ route }) => route === '/[categoryId]');

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

  return {
    props: {
      ...categoryData,
    },
  };
};

export default Category;
