import React from 'react';
import { NextComponentType, GetStaticProps, GetStaticPaths } from 'next';
import { useRouter } from 'next/router';

import routesConfig from '../../routes-config';
import { compileSingleRoute } from '../../scripts/compile-routes';
import DefaultPageTransitionWrapper from '../../components/page-transition-wrappers/Default';

type CompiledRoute = {
  routeInfo: {
    page: string;
    path: string;
    query: { [key: string]: string | string[] };
  };
}[];

type PageBlogPostProps = {
  title?: string;
};

const BlogPost: NextComponentType<{}, PageBlogPostProps, PageBlogPostProps> = ({ title }) => {
  const router = useRouter();
  if (title) {
    return (
      <DefaultPageTransitionWrapper>
        <h1>Post: {title}</h1>
        <p>{router.pathname}</p>
      </DefaultPageTransitionWrapper>
    );
  } else return null;
};

export const getStaticPaths: GetStaticPaths = async () => {
  const blogPostRoute = routesConfig.find(({ route }) => route === '/[categoryId]/[postId]');

  if (!blogPostRoute) {
    return {
      paths: [],
      fallback: false,
    };
  }

  const allBlogPostsData = await import(
    `../../data-sanity/${blogPostRoute.dynamicDataType}.json`
  ).then((m) => m.default);

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

  const blogPostData = await import(`../../data-sanity/posts/${context.params.postId}.json`).then(
    (m) => m.default
  );

  return {
    props: {
      title: blogPostData.title,
    },
  };
};

export default BlogPost;
