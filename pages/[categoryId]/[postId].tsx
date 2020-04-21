import React from 'react';
import { NextComponentType, GetStaticProps, GetStaticPaths } from 'next';

import PageMeta from '../../components/PageMeta';
import AccessibleImage from '../../components/media/AccessibleImage';
import { fullBleedImageResponsiveConfig } from '../../components/media/image-responsive-configurations';
import RichPortableText from '../../components/portable-text/RichPortableText';
import DefaultPageTransitionWrapper from '../../components/page-transition-wrappers/Default';

import routesConfig from '../../routes-config';
import { compileSingleRoute, compileDynamicItem } from '../../scripts/compile-routes';
import {
  generateWebpageStructuredData,
  generateArticleStructuredData,
} from '../../scripts/structured-data';

import { CompiledRoute, SanityBlogPostFull, StructuredData } from '../../typings';

const BLOG_POST_PAGE_ROUTE = '/[categoryId]/[postId]';

type PageBlogPostProps = {
  blogPostData: SanityBlogPostFull;
  path: string;
  structuredData: StructuredData[];
};
const BlogPost: NextComponentType<{}, PageBlogPostProps, PageBlogPostProps> = ({
  blogPostData,
  path,
  structuredData,
}) => (
  <>
    <PageMeta
      path={path}
      title={blogPostData.seoTitle}
      description={blogPostData.seoDescription}
      previewImage={blogPostData.seoImage}
      structuredData={structuredData}
    />

    <DefaultPageTransitionWrapper>
      <section className="relative h-screen min-h-hero max-h-hero">
        <div className="absolute text-center text-white z-10 text-shadow oba-transform-translate-center">
          <h1 className="flex flex-col-reverse items-center">
            <span className="text-4xl font-bold mt-4">{blogPostData.title}</span>
            <span>{blogPostData.category.name}</span>
          </h1>
          <p className="text-xl mt-8">{blogPostData.excerpt}</p>
        </div>

        <AccessibleImage
          image={blogPostData.heroImage}
          responsiveConfig={fullBleedImageResponsiveConfig}
          className="z-0 absolute inset-0 w-full h-full filter-darker"
          style={{
            paddingBottom: '0',
          }}
        />
      </section>

      <section className="oba-content-width mt-8">
        <RichPortableText blocks={blogPostData.content} />
      </section>
    </DefaultPageTransitionWrapper>
  </>
);

export const getStaticPaths: GetStaticPaths = async () => {
  const blogPostRoute = routesConfig.find(({ route }) => route === '/[categoryId]/[postId]');

  if (!blogPostRoute) {
    return {
      paths: [],
      fallback: false,
    };
  }

  const allBlogPostsData = await import(`../../data/${blogPostRoute.dynamicDataType}.json`).then(
    (m) => m.default
  );

  const compiledBlogPostRoute: CompiledRoute = compileSingleRoute({
    routeConfig: blogPostRoute,
    dynamicItemsData: allBlogPostsData,
  });

  return {
    paths: compiledBlogPostRoute.map(({ routeInfo }) => ({ params: routeInfo.query })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async (context) => {
  if (!context.params) {
    return { props: {} };
  }

  const blogPostData: SanityBlogPostFull = await import(
    `../../data/posts/${context.params.postId}.json`
  ).then((m) => m.default);

  const compiledBlogPostItem = compileDynamicItem({
    routeConfig: routesConfig.find(({ route }) => route === BLOG_POST_PAGE_ROUTE),
    dynamicItem: blogPostData,
  });

  const path = compiledBlogPostItem.routeInfo.path;

  const compiledCategoryItem = compileDynamicItem({
    routeConfig: routesConfig.find(({ route }) => route === '/[categoryId]'),
    dynamicItem: await import(`../../data/categories/${blogPostData.category.slug}.json`).then(
      (m) => m.default
    ),
  });

  return {
    props: {
      blogPostData,
      path,
      structuredData: [
        generateWebpageStructuredData({
          path,
          title: blogPostData.seoTitle,
          description: blogPostData.seoDescription,
          breadcrumbPages: [
            {
              path: compiledCategoryItem.routeInfo.path,
              title: blogPostData.category.name,
            },
            {
              path,
              title: blogPostData.title,
            },
          ],
        }),
        ...generateArticleStructuredData({ blogPostData, path }),
      ],
    },
  };
};

export default BlogPost;
