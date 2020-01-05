module.exports = [
  {
    route: '/',
    headerNav: true,
    contentfulPageData: 'page-home',
  },
  {
    route: '/about',
    headerNav: true,
    contentfulPageData: 'page-about',
  },
  {
    route: '/[categoryId]',
    headerNav: true,
    contentfulPageData: 'page-category',
    dynamicRoute: {
      contentfulItemsData: 'categories',
      params: {
        // Replace "[categoryId]" with the slugs form Contentful
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
    headerNav: false,
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
    headerNav: true,
    contentfulPageData: 'page-search',
  },
  {
    route: '/thanks',
    headerNav: false,
    noIndex: true,
    contentfulPageData: 'page-thanks',
  },
  // {
  //   route: '/gallery',
  //   headerNav: true,
  //   contentfulPageData: 'page-gallery',
  // },
];
