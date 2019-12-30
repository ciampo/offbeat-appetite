module.exports = [
  {
    route: '/',
    contentfulPageData: 'page-home',
  },
  {
    route: '/about',
    contentfulPageData: 'page-about',
  },
  {
    route: '/[categoryId]',
    contentfulPageData: 'page-category',
    dynamicRoute: {
      contentfulItemsData: 'categories',
      params: {
        // Replace "[categoryId]" and "[categoryName]" with the slugs form Contentful
        // Replace ":categoryId" and ":categoryName" in the page data (for titles, seo fields..)
        // Pass the "categoryId" param to the router.
        categoryId: (categoryItem) => categoryItem.slug,
        categoryName: (categoryItem) => categoryItem.name,
      },
    },
  },
  {
    route: '/[categoryId]/[postId]',
    contentfulPageData: 'page-blog-post',
    dynamicRoute: {
      contentfulItemsData: 'posts',
      params: {
        // Replace "[categoryId]" and "[postId]" with the slugs form Contentful
        // Replace ":categoryId" and and ":postId" in the page data (for titles, seo fields..)
        // Pass the "categoryId" and "postId" params to the router.
        categoryId: (postItem) => postItem.category.slug,
        postId: (postItem) => postItem.slug,
      },
    },
  },
  {
    route: '/search',
    contentfulPageData: 'page-search',
  },
  {
    route: '/gallery',
    contentfulPageData: 'page-gallery',
  },
];
