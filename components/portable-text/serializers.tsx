import React from 'react';
import Link from 'next/link';

import CaptionedImage from '../media/CaptionedImage';
import CaptionedVideo from '../media/CaptionedVideo';
import Recipe from '../recipe/Recipe';

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

const InternalLink: React.FC<SanityMarkNode> = ({ children, mark }) => {
  // TODO: consider moving this swap in the data
  const { routeInfo } = compileDynamicItem({
    routeConfig: routesConfig.find(({ route }) => route === '/[categoryId]/[postId]'),
    dynamicItem: mark.reference,
  });

  return (
    <Link href={routeInfo.page} as={routeInfo.path}>
      <a>{children}</a>
    </Link>
  );
};

const targetBlankProps = {
  target: '_blank',
  rel: 'noopener noreferrer',
};
const ExternalLink: React.FC<SanityMarkNode> = ({ children, mark }) => (
  <a href={mark.href} {...(mark.blank ? targetBlankProps : undefined)}>
    {children}
  </a>
);

// Default serializers:
// https://github.com/sanity-io/block-content-to-hyperscript/blob/master/src/serializers.js
const simpleSerializers = {
  // Serializers for marks - data that annotates a text child of a block.
  marks: {
    internalLink: InternalLink,
    link: ExternalLink,
  },
};

const CaptionedImageWrapper: React.FC<SanityBlockType<SanityCaptionedImage>> = (props) => (
  <CaptionedImage image={props.node.image} caption={props.node.caption} _type={props.node._type} />
);

const CaptionedVideoWrapper: React.FC<SanityBlockType<SanityCaptionedVideo>> = (props) => (
  <CaptionedVideo video={props.node.video} caption={props.node.caption} _type={props.node._type} />
);

const MediaGalleryWrapper: React.FC<SanityBlockType<SanityMediaGallery>> = (props) => (
  <div>
    {props.node.items.map((mediaGalleryItem) => {
      if (mediaGalleryItem._type === 'captionedImage') {
        const { image, _type, caption } = mediaGalleryItem as SanityCaptionedImage;
        return <CaptionedImage image={image} caption={caption} _type={_type} />;
      } else if (mediaGalleryItem._type === 'captionedVideo') {
        const { video, _type, caption } = mediaGalleryItem as SanityCaptionedVideo;
        return <CaptionedVideo video={video} caption={caption} _type={_type} />;
      }
    })}
  </div>
);

const RecipeWrapper: React.FC<SanityBlockType<SanityRecipe>> = (props) => (
  <Recipe recipe={props.node} />
);

const richSerializers = {
  ...simpleSerializers,
  types: {
    captionedImage: CaptionedImageWrapper,
    captionedVideo: CaptionedVideoWrapper,
    mediaGallery: MediaGalleryWrapper,
    recipe: RecipeWrapper,
  },
};

export { simpleSerializers, richSerializers };
