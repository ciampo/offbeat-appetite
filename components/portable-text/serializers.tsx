import * as React from 'react';

import CaptionedImage from '../media/CaptionedImage';
import CaptionedVideo from '../media/CaptionedVideo';
import MediaGallery from '../media/MediaGallery';
import { contentFullWidthResponsiveConfig } from '../media/image-responsive-configurations';
import Recipe from '../blog-post/Recipe';
import { InternalLink, ExternalLink } from './Links';

import {
  SanityMarkNode,
  SanityBlockType,
  SanityCaptionedImage,
  SanityCaptionedVideo,
  SanityMediaGallery,
  SanityRecipe,
  SanityInternalLink,
} from '../../typings';

const InternalLinkWrapper: React.FC<SanityMarkNode> = ({ children, mark }) => (
  <InternalLink internalLink={mark.reference as SanityInternalLink}>{children}</InternalLink>
);

const ExternalLinkWrapper: React.FC<SanityMarkNode> = ({ children, mark }) => {
  const variableProps: {
    rel: string[];
    target?: '_blank';
  } = { rel: [], target: undefined };

  if (mark.blank) {
    variableProps.target = '_blank';
    variableProps.rel = [...variableProps.rel, 'noopener', 'noreferrer'];
  }
  if (mark.nofollow) {
    variableProps.rel = [...variableProps.rel, 'nofollow'];
  }

  return (
    <ExternalLink
      href={mark.href as string}
      target={variableProps.target}
      rel={variableProps.rel.length > 0 ? variableProps.rel.join(' ') : undefined}
    >
      {children}
    </ExternalLink>
  );
};

const simpleSerializers = {
  // Serializers for marks - data that annotates a text child of a block.
  marks: {
    internalLink: InternalLinkWrapper,
    link: ExternalLinkWrapper,
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
