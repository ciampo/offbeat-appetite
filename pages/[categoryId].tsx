import React, { useEffect } from 'react';
import { GetStaticProps, GetStaticPaths } from 'next';

import PageMeta from '../components/meta/PageMeta';
import DefaultPageTransitionWrapper from '../components/page-transition-wrappers/Default';
import { PageContentContainer } from '../components/layouts/Containers';
import BlogPostTileList from '../components/blog-post-tile/BlogPostTileList';
import { useNavVariantDispatch } from '../components/nav/nav-variant-context';

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
const BLOGPOST_PAGE_ROUTE = '/[categoryId]/[postId]';

type CategoryProps = {
  categoryData: SanityCategoryFull;
  path: string;
  structuredData: StructuredData[];
};
const CategoryPage: NextComponentTypeWithLayout<CategoryProps> = ({
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
        <header className="mt-16 md:mt-20 xl:mt-24 py-20 md:py-24 xl:py-32">
          <h1 className="text-center type-display-1">{categoryData.title}</h1>
        </header>

        <PageContentContainer className="bg-inherit py-12 md:py-16 xl:py-24">
          {/* Title */}
          <h2 className="sr-only">All {categoryData.title} posts</h2>

          <BlogPostTileList
            postsData={categoryData.allBlogPosts}
            tileShadowVariant="lighter"
            tileLayoutVariant="horizontal"
          />
        </PageContentContainer>
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

  const categoryData: SanityCategoryFull = await import(
    `../data/categories/${context.params.categoryId}.json`
  ).then((m) => m.default);

  const compiledCategoryItem = compileDynamicItem({
    routeConfig: routesConfig.find(({ route }) => route === CATEGORY_PAGE_ROUTE),
    dynamicItem: categoryData,
  });
  const path = compiledCategoryItem.routeInfo.path;

  categoryData.allBlogPosts = categoryData.allBlogPosts.map((blogPost) => {
    const blogPostRoute = routesConfig.find(({ route }) => route === BLOGPOST_PAGE_ROUTE);
    const compiledBlogPostRoute = compileSingleRoute({
      routeConfig: blogPostRoute,
      dynamicItemsData: [blogPost],
    })[0];

    return {
      ...blogPost,
      compiledRoute: compiledBlogPostRoute.routeInfo,
    };
  });

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
