import React from 'react';
import Link from 'next/link';

import CaptionedImage from '../media/CaptionedImage';
import CaptionedVideo from '../media/CaptionedVideo';
import MediaGallery from '../media/MediaGallery';
import { contentFullWidthResponsiveConfig } from '../media/image-responsive-configurations';
import Recipe from '../blog-post/Recipe';

import routesConfig from '../../routes-config';
import { compileDynamicItem } from '../../scripts/compile-routes';

import {
  SanityMarkNode,
  SanityBlockType,
  SanityCaptionedImage,
  SanityCaptionedVideo,
  SanityMediaGallery,
  SanityRecipe,
} from '../../typings';

const linkClassName = 'border-b border-dashed border-gray-darker outline-none focus:border-solid';

const InternalLink: React.FC<SanityMarkNode> = ({ children, mark }) => {
  // TODO: consider moving this swap in the data
  const { routeInfo } = compileDynamicItem({
    routeConfig: routesConfig.find(({ route }) => route === '/[categoryId]/[postId]'),
    dynamicItem: mark.reference,
  });

  return (
    <Link href={routeInfo.page} as={routeInfo.path} scroll={false}>
      <a className={linkClassName}>{children}</a>
    </Link>
  );
};

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

const CaptionedImageWrapper: React.FC<SanityBlockType<SanityCaptionedImage>> = (props) => (
  <CaptionedImage
    {...props.node}
    responsiveConfig={contentFullWidthResponsiveConfig}
    className="my-8 md:my-10 xl:my-16"
  />
);

const CaptionedVideoWrapper: React.FC<SanityBlockType<SanityCaptionedVideo>> = (props) => (
  <CaptionedVideo
    {...props.node}
    responsiveConfig={contentFullWidthResponsiveConfig}
    className="my-8 md:my-10 xl:my-16"
  />
);

const MediaGalleryWrapper: React.FC<SanityBlockType<SanityMediaGallery>> = (props) => (
  <MediaGallery {...props.node} className="my-8 md:my-10 xl:my-16" />
);

const RecipeWrapper: React.FC<SanityBlockType<SanityRecipe>> = (props) => (
  <Recipe recipe={props.node} />
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
