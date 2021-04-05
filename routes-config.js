/* eslint-disable @typescript-eslint/no-var-requires */

const {
  pageHomeType,
  pageAboutType,
  pageThankYouType,
  pageBlogPostType,
  pageCategoryType,
  pageSearchType,
} = require('./sanity/pages.js');
const { categoryType } = require('./sanity/category');
const { blogPostType } = require('./sanity/blogPost');

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
    route: '/search',
    dataType: pageSearchType,
  },
  {
    route: '/[categoryId]',
    dataType: pageCategoryType,
    dynamicDataType: categoryType,
    generateParams: (catItem) => ({ categoryId: catItem.slug }),
  },
  {
    route: '/[categoryId]/[postId]',
    dataType: pageBlogPostType,
    dynamicDataType: blogPostType,
    generateParams: (postItem) => ({
      categoryId: postItem.category.slug,
      postId: postItem.slug,
    }),
  },
  {
    route: '/thanks',
    dataType: pageThankYouType,
  },
];
