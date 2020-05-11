import React from 'react';
import { axe } from 'jest-axe';
import { render } from 'offbeat-appetite-render';

import BlogPostPage from '../pages/[categoryId]/[postId]';
import testRecipeData from '../data/posts/test-recipe.json';
import {
  generateWebpageStructuredData,
  generateArticleStructuredData,
} from '../scripts/structured-data';

import routesConfig from '../routes-config';
import { compileDynamicItem } from '../scripts/compile-routes';
import { SanityBlogPostFull } from '../typings';

const blogPostData = testRecipeData as SanityBlogPostFull;

beforeAll(() => {
  process.env = Object.assign(process.env);
});

describe('Post Page', () => {
  test('it renders', async () => {
    const compiledBlogPostItem = compileDynamicItem({
      routeConfig: routesConfig.find(({ route }) => route === '/[categoryId]/[postId]'),
      dynamicItem: blogPostData,
    });

    const path = compiledBlogPostItem.routeInfo.path;

    const compiledCategoryItem = compileDynamicItem({
      routeConfig: routesConfig.find(({ route }) => route === '/[categoryId]'),
      dynamicItem: await import(`../data/categories/${blogPostData.category.slug}.json`).then(
        (m) => m.default
      ),
    });

    const pageProps = {
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
    };
    const { container } = render(<BlogPostPage {...pageProps} />, {
      router: { asPath: '/recipes/egg-in-coffee-behind-vietnam-s-egg-coffee-recipe' },
    });

    expect(await axe(container)).toHaveNoViolations();

    // TODO: use mock data and add more tests
  }, 10000);
});
