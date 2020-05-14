import React, { useEffect } from 'react';
import { NextComponentType, GetStaticProps, GetStaticPaths } from 'next';

import PageMeta from '../components/meta/PageMeta';
import DefaultPageTransitionWrapper from '../components/page-transition-wrappers/Default';
import BlogPostPreview from '../components/blog-post/BlogPostPreview';
import { useNavVariantDispatch } from '../components/nav/nav-variant-context';

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
}) => {
  const setVariant = useNavVariantDispatch();
  useEffect(() => {
    setVariant('solid');
  }, [setVariant]);

  return (
    <>
      <PageMeta
        path={path}
        title={categoryData.seoTitle}
        description={categoryData.seoDescription}
        previewImage={categoryData.seoImage}
        structuredData={structuredData}
      />

      <DefaultPageTransitionWrapper>
        <header className="mt-16 md:mt-20 xl:mt-24">
          <h1>{categoryData.title}</h1>
        </header>
        <p className="text-lg text-center">All posts:</p>
        <ul className="flex flex-wrap justify-center mt-6">
          {categoryData.allBlogPosts.map((blogPostData) => (
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
      </DefaultPageTransitionWrapper>
    </>
  );
};

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
