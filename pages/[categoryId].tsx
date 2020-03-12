import React from 'react';
import { NextComponentType, GetStaticProps, GetStaticPaths } from 'next';
import { useRouter } from 'next/router';

import routesConfig from '../routes-config';
import { compileSingleRoute } from '../scripts/compile-routes';
import DefaultPageTransitionWrapper from '../components/page-transition-wrappers/Default';

// type RouteConfig = {
//   route: string;
//   dataType: string;
//   dynamicDataType?: string;
//   generateParams?: (arg0: object) => { [key: string]: string };
// };

type CompiledRoute = {
  routeInfo: {
    page: string;
    path: string;
    query: { [key: string]: string | string[] };
  };
}[];

type PageCategoryProps = {
  categoryTitle?: string;
};

const Category: NextComponentType<{}, PageCategoryProps, PageCategoryProps> = ({
  categoryTitle,
}) => {
  const router = useRouter();
  if (categoryTitle) {
    return (
      <DefaultPageTransitionWrapper>
        <h1>Category: {categoryTitle}</h1>
        <p>{router.pathname}</p>
      </DefaultPageTransitionWrapper>
    );
  } else return null;
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
      categoryTitle: categoryData.title,
    },
  };
};

export default Category;
