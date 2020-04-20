import React from 'react';
import Link from 'next/link';

import AccessibleImage from '../media/AccessibleImage';
import { blogPostPreviewResponsiveConfig } from '../media/image-responsive-configurations';

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
    <Link
      href={compiledBlogPostRoute.routeInfo.page}
      as={compiledBlogPostRoute.routeInfo.path}
      scroll={false}
    >
      <a className="flex flex-col">
        <p className="text-lg font-bold order-2">{blogPostData.title}</p>
        <p className="order-3">{blogPostData.excerpt}</p>
        <AccessibleImage
          image={blogPostData.previewImage}
          lazy={true}
          responsiveConfig={blogPostPreviewResponsiveConfig}
          className="relative w-full h-0 order-1"
        />
      </a>
    </Link>
  );
};

export default BlogPostPreview;
