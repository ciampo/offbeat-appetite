import React from 'react';
import Link from 'next/link';

import routesConfig from '../../routes-config';
import { compileSingleRoute } from '../../scripts/compile-routes';

import { SanityBlogPostPreview } from '../../typings';

type BlogPostPreviewProps = {
  blogPostData: SanityBlogPostPreview;
};

const blogPostRoute = routesConfig.find(({ route }) => route === '/[categoryId]/[postId]');

const BlogPostPreview: React.FC<BlogPostPreviewProps> = ({ blogPostData }) => {
  const compiledBlogPostRoute = compileSingleRoute({
    routeConfig: blogPostRoute,
    dynamicItemsData: [blogPostData],
  })[0];

  return (
    <Link href={compiledBlogPostRoute.routeInfo.page} as={compiledBlogPostRoute.routeInfo.path}>
      {blogPostData.title}
    </Link>
  );
};

export default BlogPostPreview;
