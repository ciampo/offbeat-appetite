import React, { memo } from 'react';
import Link from 'next/link';

import AccessibleImage from '../media/AccessibleImage';
import {
  blogPostTileVerticalResponsiveConfig,
  blogPostTileHorizontalResponsiveConfig,
} from '../media/image-responsive-configurations';

import { SanityBlogPostPreview } from '../../typings';

export type BlogPostTileShadowVariant = 'light' | 'lighter';
export type BlogPostTileLayoutVariant = 'horizontal' | 'vertical';
export type BlogPostTileProps = {
  postData: SanityBlogPostPreview;
  layoutVariant: BlogPostTileLayoutVariant;
  shadowVariant: BlogPostTileShadowVariant;
  reversed?: boolean;
  extended?: boolean;
  className?: string;
};

const transformTransitionCommonClassName = 'transition-transform duration-300 ease-out transform';

const BlogPostTile: React.FC<BlogPostTileProps> = memo(
  ({ postData, layoutVariant, shadowVariant, reversed = false, className }) => (
    <Link href={postData.compiledRoute.page} as={postData.compiledRoute.path} scroll={false}>
      <a
        className={[
          'group flex flex-col rounded overflow-hidden contain-l-p outline-none bg-inherit',
          layoutVariant === 'horizontal' && 'sm:flex-row',
          shadowVariant === 'light' ? 'shadow-neu-light' : 'shadow-neu-lighter',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {/* Content wrapper */}
        <div
          className={[
            'relative w-full p-6',
            layoutVariant === 'horizontal' ? 'md:p-12 xl:p-16' : 'xl:p-8',
            layoutVariant === 'horizontal'
              ? 'sm:w-1/2 sm:flex sm:flex-col sm:justify-center'
              : 'flex-1',
            reversed ? 'order-1' : 'order-2',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          <p className="type-tag text-gray-dark mb-3 md:mb-4 xl:mb-5">{postData.category.name}</p>
          <p
            className={[
              'type-heading-3 mb-1 pr-4 md:pr-6',
              layoutVariant === 'horizontal' && 'sm:hidden',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            {postData.title}
          </p>
          {layoutVariant === 'horizontal' && (
            <>
              <p className="hidden sm:block type-heading-2 pr-4 md:pr-6">{postData.title}</p>
              <p className="hidden sm:block mt-5 md:mt-6 xl:mt-8">{postData.excerpt}</p>
            </>
          )}
          {/* Hover/focus line */}
          <span
            className={[
              'absolute z-0 top-full inset-x-0 h-1 bg-olive-dark',
              transformTransitionCommonClassName,
              'group-hover:-translate-y-1 group-focus:-translate-y-1',
            ]
              .filter(Boolean)
              .join(' ')}
            aria-hidden="true"
          ></span>
        </div>
        {/* Image wrapper */}
        <div
          className={[
            'relative w-full overflow-hidden',
            reversed ? 'order-2' : 'order-1',
            layoutVariant === 'horizontal' && 'sm:w-1/2',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          <AccessibleImage
            image={postData.previewImage}
            lazy={true}
            responsiveConfig={
              layoutVariant === 'horizontal'
                ? blogPostTileHorizontalResponsiveConfig
                : blogPostTileVerticalResponsiveConfig
            }
            className={[
              'relative w-full h-0',
              transformTransitionCommonClassName,
              'group-hover:scale-105 group-focus:scale-105',
            ]
              .filter(Boolean)
              .join(' ')}
          />
        </div>
      </a>
    </Link>
  )
);
BlogPostTile.displayName = 'memo(BlogPostTile)';

export default BlogPostTile;
