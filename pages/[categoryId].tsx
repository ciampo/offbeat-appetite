import React from 'react';
import { NextComponentType, NextPageContext } from 'next';

import routesConfig from '../routes-config';
import DefaultPageTransitionWrapper from '../components/page-transition-wrappers/Default';
import { initialDefaultPageProps } from '../components/utils/initial-props';
import { ContentfulCategory, ContentfulPageCategory } from '../typings';

type PageCategoryProps = ContentfulPageCategory & {
  path: string;
  category?: ContentfulCategory;
};

const Category: NextComponentType<{}, PageCategoryProps, PageCategoryProps> = ({ category }) =>
  category ? (
    <DefaultPageTransitionWrapper>
      <h1>{category.name}</h1>
    </DefaultPageTransitionWrapper>
  ) : null;

Category.getInitialProps = async ({
  pathname,
  query,
}: NextPageContext): Promise<PageCategoryProps> => {
  let toReturn: PageCategoryProps = {
    ...initialDefaultPageProps,
    title: '',
    path: pathname,
    category: undefined,
  };

  const routeConfig = routesConfig.find(({ route }) => route === pathname);

  if (
    routeConfig &&
    routeConfig.dynamicRoute &&
    routeConfig.dynamicRoute.contentfulItemsData &&
    routeConfig.dynamicRoute.params
  ) {
    const categoriesData: ContentfulCategory[] = await import(
      `../data/${routeConfig.dynamicRoute.contentfulItemsData}.json`
    ).then((m) => m.default);

    const currentCategory = categoriesData.find((item) => {
      let matchFound = true;

      for (const pattern of Object.keys(routeConfig.dynamicRoute.params)) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        const replacerFn = routeConfig.dynamicRoute.params[pattern];
        matchFound = matchFound && query[pattern] === replacerFn(item);
      }

      return matchFound;
    });

    if (currentCategory) {
      const categoriesPageData: ContentfulPageCategory = await import(
        `../data/${routeConfig.contentfulPageData}.json`
      ).then((m) => m.default);

      toReturn = {
        ...toReturn,
        ...categoriesPageData,
        category: currentCategory,
      };

      for (const pattern of Object.keys(routeConfig.dynamicRoute.params)) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        const replacerFn = routeConfig.dynamicRoute.params[pattern];
        toReturn.path = toReturn.path.replace(`[${pattern}]`, replacerFn(currentCategory));
      }
    }
  }

  return toReturn;
};

export default Category;
