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
    route: '/post/[id]',
    // parentRoute: '/posts',
    contentfulPageData: 'page-project',
    dynamicRoute: {
      contentfulItemsData: 'personal-projects',
      params: {
        // Replace "[id]" with the slug of the contentful item
        // and pass the slug to the router query under the "id" key.
        id: (contentItem) => contentItem.slug,
      },
    },
  },
];
