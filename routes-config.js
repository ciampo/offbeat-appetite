/* eslint-disable @typescript-eslint/no-var-requires */

const {
  pageHomeType,
  pageAboutType,
  pageThankYouType,
  pageBlogPostType,
  pageCategoryType,
} = require('./queries/pages.js');
const { categoryType } = require('./queries/category');
const { blogPostType } = require('./queries/blogPost');

module.exports = [
  {
    route: '/',
    dataType: pageHomeType,
  },
  {
    route: '/about',
    dataType: pageAboutType,
  },
  {
    route: '/[categoryId]',
    dataType: pageCategoryType,
    dynamicDataType: categoryType,
    generateParams: (catItem) => ({ categoryId: catItem.slug }),
    replaceContent: (catItem) => ({
      categoryName: catItem.name,
    }),
  },
  {
    route: '/[categoryId]/[postId]',
    dataType: pageBlogPostType,
    dynamicDataType: blogPostType,
    generateParams: (postItem) => ({
      categoryId: postItem.category.slug,
      postId: postItem.slug,
    }),
    replaceContent: (postItem) => ({
      categoryName: postItem.category.name,
      blogPostTitle: postItem.title,
      blogPostExcerpt: postItem.excerpt,
    }),
  },
  {
    route: '/thanks',
    dataType: pageThankYouType,
  },
];
