import * as React from 'react';

import BlogPostTile, { BlogPostTileShadowVariant, BlogPostTileLayoutVariant } from './BlogPostTile';
import { SanityBlogPostPreview } from '../../typings';

type BlogPostTileListProps = {
  postsData: SanityBlogPostPreview[];
  tileLayoutVariant: BlogPostTileLayoutVariant;
  tileShadowVariant: BlogPostTileShadowVariant;
  tileExtendedInfo?: boolean;
  showOnlyFirstRow?: boolean;
  className?: string;
  tileClassName?: string;
  eagerLoadFirstTileImage?: boolean;
};
const BlogPostTileList: React.FC<BlogPostTileListProps> = React.memo(
  ({
    postsData,
    className,
    tileLayoutVariant,
    tileShadowVariant,
    tileExtendedInfo,
    tileClassName,
    showOnlyFirstRow,
    eagerLoadFirstTileImage = false,
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
              'sm:hidden md:block',
            showOnlyFirstRow && tileLayoutVariant === 'vertical' && index > 2 && 'sm:hidden',
            showOnlyFirstRow && tileLayoutVariant === 'horizontal' && index > 0 && 'sm:hidden',
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
            extended={tileExtendedInfo}
            className={['h-full max-w-xs mx-auto sm:max-w-none', tileClassName].join(' ')}
            eagerLoadImage={eagerLoadFirstTileImage && index === 0}
          />
        </li>
      ))}
    </ul>
  )
);
BlogPostTileList.displayName = 'memo(BlogPostTileList)';

export default BlogPostTileList;
