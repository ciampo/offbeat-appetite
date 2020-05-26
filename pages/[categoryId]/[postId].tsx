import React, { useEffect } from 'react';
import { GetStaticProps, GetStaticPaths } from 'next';

import PageMeta from '../../components/meta/PageMeta';
import AccessibleImage from '../../components/media/AccessibleImage';
import { fullBleedImageResponsiveConfig } from '../../components/media/image-responsive-configurations';
import RichPortableText from '../../components/portable-text/RichPortableText';
import DefaultPageTransitionWrapper from '../../components/page-transition-wrappers/Default';
import { ArticleContentContainer } from '../../components/layouts/Containers';
import { useNavVariantDispatch } from '../../components/nav/nav-variant-context';

import routesConfig from '../../routes-config';
import { compileSingleRoute, compileDynamicItem } from '../../scripts/compile-routes';
import {
  generateWebpageStructuredData,
  generateArticleStructuredData,
} from '../../scripts/structured-data';

import {
  CompiledRoute,
  SanityBlogPostFull,
  StructuredData,
  NextComponentTypeWithLayout,
} from '../../typings';

const BLOG_POST_PAGE_ROUTE = '/[categoryId]/[postId]';

type PageBlogPostProps = {
  blogPostData: SanityBlogPostFull;
  path: string;
  structuredData: StructuredData[];
};
const BlogPost: NextComponentTypeWithLayout<PageBlogPostProps> = ({
  blogPostData,
  path,
  structuredData,
}) => {
  const setVariant = useNavVariantDispatch();
  useEffect(() => {
    setVariant('transparent');
  }, [setVariant]);

  return (
    <>
      <PageMeta
        path={path}
        title={blogPostData.seoTitle}
        description={blogPostData.seoDescription}
        previewImage={blogPostData.seoImage}
        structuredData={structuredData}
      />

      <DefaultPageTransitionWrapper>
        <header className="relative contain-l-p flex items-center py-32 sm:py-40 md:py-48 xl:py-64 min-h-hero-m sm:min-h-hero-t xl:min-h-hero-d">
          <ArticleContentContainer
            className="relative z-10"
            internalWrapperClassName="flex flex-col items-center text-gray-white text-shadow text-center"
          >
            <h1 className="order-2 type-display-1 mt-2 md:mt-4 xl:mt-6">{blogPostData.title}</h1>
            <p className="type-eyebrow order-1">
              <span aria-hidden="true" className="pr-1">
                —
              </span>
              {blogPostData.category.name}
              <span aria-hidden="true" className="pl-1">
                —
              </span>
            </p>
            <p className="order-3 type-body-large italic mt-12 md:mt-16 xl:mt-20 max-w-ch-40">
              {blogPostData.excerpt}
            </p>
          </ArticleContentContainer>

          <AccessibleImage
            image={blogPostData.heroImage}
            responsiveConfig={fullBleedImageResponsiveConfig}
            className="z-0 absolute inset-0 w-full h-full"
            darker={true}
            style={{
              paddingBottom: '0',
            }}
          />
        </header>

        <ArticleContentContainer
          component={(props): JSX.Element => <section {...props}></section>}
          className="pt-12 pb-16 xsm:pb-20 md:pt-16 md:pb-24 xl:pt-24 xl:pb-32"
        >
          <RichPortableText blocks={blogPostData.content} />
        </ArticleContentContainer>
      </DefaultPageTransitionWrapper>
    </>
  );
};

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
