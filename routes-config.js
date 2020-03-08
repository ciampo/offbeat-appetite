/* eslint-disable @typescript-eslint/no-var-requires */

const {
  pageHomeType,
  pageAboutType,
  pageCategoryType,
  pageBlogPostType,
  // pageSearchType,
  // pageGalleryType,
  pageThankYouType,
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
    dynamicRoute: {
      dynamicDataType: categoryType,
      routeParams: {
        // Replace "[categoryId]" with the slugs form CMS data
        // Pass the "categoryId" param to the router.
        categoryId: (categoryItem) => categoryItem.slug,
      },
      contentParams: {
        // Replace ":categoryName" in the page data (for titles, seo fields..)
        categoryName: (categoryItem) => categoryItem.name,
      },
    },
  },
  {
    route: '/[categoryId]/[postId]',
    dataType: pageBlogPostType,
    dynamicRoute: {
      dynamicDataType: blogPostType,
      routeParams: {
        // Replace "[categoryId]" and "[postId]" with the slugs form CMS data
        // Replace ":categoryId" and and ":postId" in the page data (for titles, seo fields..)
        // Pass the "categoryId" and "postId" params to the router.
        categoryId: (postItem) => postItem.category.slug,
        postId: (postItem) => postItem.slug,
      },
      contentParams: {
        // Replace ":categoryName" in the page data (for titles, seo fields..)
        categoryName: (postItem) => postItem.category.name,
        blogPostTitle: (postItem) => postItem.title,
        blogPostExcerpt: (postItem) => postItem.excerpt,
      },
    },
  },
  {
    route: '/thanks',
    dataType: pageThankYouType,
  },
  // Search and Gallery Pages are disabled for now
  // {
  //   route: '/search',
  //   dataType: pageSearchType,
  // },
  // {
  //   route: '/gallery',
  //   dataType: pageGalleryType,
  // },
];
