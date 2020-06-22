import React from 'react';
import Link from 'next/link';

import CaptionedImage from '../media/CaptionedImage';
import CaptionedVideo from '../media/CaptionedVideo';
import MediaGallery from '../media/MediaGallery';
import { contentFullWidthResponsiveConfig } from '../media/image-responsive-configurations';
import Recipe from '../blog-post/Recipe';

import {
  SanityMarkNode,
  SanityBlockType,
  SanityCaptionedImage,
  SanityCaptionedVideo,
  SanityMediaGallery,
  SanityRecipe,
} from '../../typings';

const linkClassName = 'border-b border-dashed border-gray-darker outline-none focus:border-solid';

const InternalLink: React.FC<SanityMarkNode> = ({ children, mark }) =>
  mark.routeInfo ? (
    <Link href={mark.routeInfo.page} as={mark.routeInfo.path}>
      <a className={linkClassName}>{children}</a>
    </Link>
  ) : (
    <span>{children}</span>
  );

const targetBlankProps = {
  target: '_blank',
  rel: 'noopener noreferrer',
};
const ExternalLink: React.FC<SanityMarkNode> = ({ children, mark }) => (
  <a
    href={mark.href as string}
    {...(mark.blank ? targetBlankProps : undefined)}
    className={linkClassName}
  >
    {children}
  </a>
);

const simpleSerializers = {
  // Serializers for marks - data that annotates a text child of a block.
  marks: {
    internalLink: InternalLink,
    link: ExternalLink,
  },
};

const blockNegativeMargin = '-mx-6 xsm:-mx-8 sm:-mx-12 md:-mx-16 xl:-mx-20';
const mediaBlockVerticalSpacing = 'my-8 md:my-10 xl:my-12';
const recipeBlockVerticalSpacing = 'my-16 md:my-20 xl:my-24';
const mediaBlockClassName = [mediaBlockVerticalSpacing, blockNegativeMargin].join(' ');
const recipeBlockClassName = [recipeBlockVerticalSpacing, blockNegativeMargin].join(' ');

const CaptionedImageWrapper: React.FC<SanityBlockType<SanityCaptionedImage>> = (props) => (
  <CaptionedImage
    {...props.node}
    responsiveConfig={contentFullWidthResponsiveConfig}
    className={mediaBlockClassName}
  />
);

const CaptionedVideoWrapper: React.FC<SanityBlockType<SanityCaptionedVideo>> = (props) => (
  <CaptionedVideo
    {...props.node}
    responsiveConfig={contentFullWidthResponsiveConfig}
    className={mediaBlockClassName}
  />
);

const MediaGalleryWrapper: React.FC<SanityBlockType<SanityMediaGallery>> = (props) => (
  <MediaGallery {...props.node} className={mediaBlockClassName} />
);

const RecipeWrapper: React.FC<SanityBlockType<SanityRecipe>> = (props) => (
  <Recipe className={recipeBlockClassName} recipe={props.node} />
);

const richSerializers = {
  marks: {
    ...simpleSerializers.marks,
  },
  types: {
    captionedImage: CaptionedImageWrapper,
    captionedVideo: CaptionedVideoWrapper,
    mediaGallery: MediaGalleryWrapper,
    recipe: RecipeWrapper,
  },
};

export { simpleSerializers, richSerializers };
