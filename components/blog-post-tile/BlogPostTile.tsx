import React, { memo } from 'react';
import Link from 'next/link';

import AccessibleImage from '../media/AccessibleImage';
import Tag from '../tag/Tag';

import {
  blogPostTileVerticalResponsiveConfig,
  blogPostTileHorizontalResponsiveConfig,
} from '../media/image-responsive-configurations';

import { postDateToHumanString } from '../../scripts/utils';

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
  eagerLoadImage?: boolean;
};

const transformTransitionCommonClassName = 'transition-transform duration-300 ease-out transform';

const BlogPostTile: React.FC<BlogPostTileProps> = memo(
  ({
    postData,
    layoutVariant,
    shadowVariant,
    reversed = false,
    extended = false,
    eagerLoadImage = false,
    className,
  }) => (
    <Link href={postData.compiledRoute.page} as={postData.compiledRoute.path}>
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
            layoutVariant === 'horizontal' ? 'md:p-8 lg:px-16 xl:p-20' : 'xl:p-8',
            layoutVariant === 'horizontal'
              ? 'sm:w-1/2 sm:flex sm:flex-col sm:justify-center'
              : 'flex-1',
            reversed ? 'order-2 sm:order-1' : 'order-2',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          <dl className="text-gray-dark mb-3 md:mb-4 xl:mb-5 flex items-baseline">
            <dt className="sr-only">Category</dt>
            <dd className="type-tag">{postData.category.nameSingular}</dd>
            {extended && (
              <>
                <span aria-hidden="true" className="mx-2">
                  &middot;
                </span>
                <dt className="sr-only">Published on</dt>
                <dd className="type-footnote">{postDateToHumanString(postData.datePublished)}</dd>
              </>
            )}
          </dl>

          {layoutVariant === 'horizontal' ? (
            <>
              <h3 className="md:hidden type-heading-3 mb-1 max-w-ch-22">{postData.title}</h3>
              <h3 className="hidden md:block type-heading-2 max-w-ch-22">{postData.title}</h3>
            </>
          ) : (
            <h3 className="type-heading-3 mb-1">{postData.title}</h3>
          )}

          {layoutVariant === 'horizontal' && (
            <p
              className={[
                'hidden mt-6 md:mt-8 xl:mt-10 max-w-ch-32',
                extended ? 'md:block' : 'sm:block',
              ].join(' ')}
            >
              {postData.excerpt}
            </p>
          )}

          {extended && (
            <ul className="mt-4 sm:mt-6 md:mt-8 xl:mt-10 -mx-1" aria-label="Tags">
              {postData.tags.map(({ slug, name }) => (
                <li key={slug} className="inline-block mx-1 mt-1 xl:mt-2">
                  <Tag>{name}</Tag>
                </li>
              ))}
            </ul>
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
            reversed ? 'order-1 sm:order-2' : 'order-1',
            layoutVariant === 'horizontal' && 'sm:w-1/2',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          <AccessibleImage
            image={postData.previewImage}
            lazy={!eagerLoadImage}
            responsiveConfig={
              layoutVariant === 'horizontal'
                ? blogPostTileHorizontalResponsiveConfig
                : blogPostTileVerticalResponsiveConfig
            }
            className={[
              'relative w-full h-0',
              transformTransitionCommonClassName,
              'group-hover:will-change-transform group-hover:scale-105',
              'group-focus:will-change-transform group-focus:scale-105',
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
