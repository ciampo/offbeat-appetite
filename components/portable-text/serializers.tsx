import React from 'react';
import Link from 'next/link';

// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import BlockContent from '@sanity/block-content-to-react';

import CaptionedImage from '../media/CaptionedImage';
import CaptionedVideo from '../media/CaptionedVideo';
import MediaGallery from '../media/MediaGallery';
import { contentFullWidthResponsiveConfig } from '../media/image-responsive-configurations';
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
  SanityBlock,
} from '../../typings';

const classNames = {
  h2: 'font-bold text-2xl mt-6 lg:text-3xl',
  h3: 'font-bold text-xl mt-4 lg:text-2xl',
  h4: 'font-bold mt-2',
  a: 'border-b border-dashed border-primary outline-none focus:border-solid',
};

const InternalLink: React.FC<SanityMarkNode> = ({ children, mark }) => {
  // TODO: consider moving this swap in the data
  const { routeInfo } = compileDynamicItem({
    routeConfig: routesConfig.find(({ route }) => route === '/[categoryId]/[postId]'),
    dynamicItem: mark.reference,
  });

  return (
    <Link href={routeInfo.page} as={routeInfo.path} scroll={false}>
      <a className={classNames.a}>{children}</a>
    </Link>
  );
};

const targetBlankProps = {
  target: '_blank',
  rel: 'noopener noreferrer',
};
const ExternalLink: React.FC<SanityMarkNode> = ({ children, mark }) => (
  <a href={mark.href} {...(mark.blank ? targetBlankProps : undefined)} className={classNames.a}>
    {children}
  </a>
);

type BlockRendererProps = {
  node: SanityBlock;
};
const BlockRenderer: React.FC<BlockRendererProps> = (props) => {
  const { style = 'normal' } = props.node;

  if (style === 'h2' || style === 'h3' || style === 'h4') {
    return React.createElement(style, { className: classNames[style] }, props.children);
  }

  // Fall back to default handling
  return BlockContent.defaultSerializers.types.block(props);
};

// Default serializers:
// https://github.com/sanity-io/block-content-to-hyperscript/blob/master/src/serializers.js
const simpleSerializers = {
  // Serializers for marks - data that annotates a text child of a block.
  marks: {
    internalLink: InternalLink,
    link: ExternalLink,
  },
  types: {
    block: BlockRenderer,
  },
};

const CaptionedImageWrapper: React.FC<SanityBlockType<SanityCaptionedImage>> = (props) => (
  <CaptionedImage {...props.node} responsiveConfig={contentFullWidthResponsiveConfig} />
);

const CaptionedVideoWrapper: React.FC<SanityBlockType<SanityCaptionedVideo>> = (props) => (
  <CaptionedVideo {...props.node} responsiveConfig={contentFullWidthResponsiveConfig} />
);

const MediaGalleryWrapper: React.FC<SanityBlockType<SanityMediaGallery>> = (props) => (
  <MediaGallery {...props.node} />
);

const RecipeWrapper: React.FC<SanityBlockType<SanityRecipe>> = (props) => (
  <Recipe recipe={props.node} />
);

const richSerializers = {
  marks: {
    ...simpleSerializers.marks,
  },
  types: {
    ...simpleSerializers.types,
    captionedImage: CaptionedImageWrapper,
    captionedVideo: CaptionedVideoWrapper,
    mediaGallery: MediaGalleryWrapper,
    recipe: RecipeWrapper,
  },
};

export { simpleSerializers, richSerializers };
