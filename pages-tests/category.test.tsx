import React from 'react';
import { axe } from 'jest-axe';
import { render } from 'offbeat-appetite-render';

import CategoryPage from '../pages/[categoryId]';
import categoryData from '../data/categories/recipes.json';
import { generateWebpageStructuredData } from '../scripts/structured-data';

import routesConfig from '../routes-config';
import { compileDynamicItem } from '../scripts/compile-routes';

describe('Category Page', () => {
  test('it renders', async () => {
    const compiledCategoryItem = compileDynamicItem({
      routeConfig: routesConfig.find(({ route }) => route === '/[categoryId]'),
      dynamicItem: categoryData,
    });

    if (!compiledCategoryItem) {
      return;
    }
    const path = compiledCategoryItem.routeInfo.path;

    const pageProps = {
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
    };
    const { container } = render(<CategoryPage {...pageProps} />);

    expect(await axe(container)).toHaveNoViolations();

    // TODO: use mock data and add more tests
  });
});
