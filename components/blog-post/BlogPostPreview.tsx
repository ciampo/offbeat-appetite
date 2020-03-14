import React from 'react';
import Link from 'next/link';

import { AccessibleImage } from '../media/image';

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
      <a>
        <p>{blogPostData.title}</p>
        <p>{blogPostData.excerpt}</p>
        <AccessibleImage image={blogPostData.previewImage} />
      </a>
    </Link>
  );
};

export default BlogPostPreview;
