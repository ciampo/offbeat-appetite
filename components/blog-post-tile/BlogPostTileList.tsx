import React, { memo } from 'react';

import BlogPostTile, { BlogPostTileShadowVariant, BlogPostTileLayoutVariant } from './BlogPostTile';
import { SanityBlogPostPreview } from '../../typings';

type BlogPostTileListProps = {
  postsData: SanityBlogPostPreview[];
  tileLayoutVariant: BlogPostTileLayoutVariant;
  tileShadowVariant: BlogPostTileShadowVariant;
  showOnlyFirstRow?: boolean;
  className?: string;
  tileClassName?: string;
};
const BlogPostTileList: React.FC<BlogPostTileListProps> = memo(
  ({
    postsData,
    className,
    tileLayoutVariant,
    tileShadowVariant,
    tileClassName,
    showOnlyFirstRow,
  }) => (
    <ul
      className={[
        'bg-inherit',
        'space-y-6',
        tileLayoutVariant === 'vertical'
          ? 'sm:space-y-0 sm:grid sm:grid-cols-2 md:grid-cols-3 sm:gap-6 md:gap-8 xl:gap-12'
          : 'md:space-y-12 xl:space-y-16',
        tileLayoutVariant === 'horizontal' && 'sm:px-8 md:px-12 xl:px-16',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {postsData.map((postData, index) => (
        <li
          key={postData._id}
          className={[
            showOnlyFirstRow &&
              tileLayoutVariant === 'vertical' &&
              index === 2 &&
              'sm:sr-only md:not-sr-only',
            showOnlyFirstRow && tileLayoutVariant === 'vertical' && index > 2 && 'sm:sr-only',
            showOnlyFirstRow && tileLayoutVariant === 'horizontal' && index > 0 && 'sm:sr-only',
            'sm:flex-1 sm:flex-shrink-0',
            'bg-inherit',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          <BlogPostTile
            postData={postData}
            shadowVariant={tileShadowVariant}
            layoutVariant={tileLayoutVariant}
            reversed={tileLayoutVariant === 'horizontal' && index % 2 !== 0}
            extended={true}
            className={['h-full max-w-xs mx-auto sm:max-w-none', tileClassName].join(' ')}
          />
        </li>
      ))}
    </ul>
  )
);
BlogPostTileList.displayName = 'memo(BlogPostTileList)';

export default BlogPostTileList;
