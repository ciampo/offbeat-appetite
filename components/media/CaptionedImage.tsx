import React from 'react';

import AccessibleImage from './AccessibleImage';
import { AccessibleImageResponsiveConfig } from './sizes-presets';

import { SanityCaptionedImage } from '../../typings';

type CaptionedImageProps = SanityCaptionedImage & {
  lazy?: boolean;
  responsiveConfig: AccessibleImageResponsiveConfig;
  [key: string]: unknown;
};
const CaptionedImage: React.FC<CaptionedImageProps> = ({
  image,
  lazy,
  responsiveConfig,
  caption,
  ...props
}) =>
  caption ? (
    <figure {...props}>
      <AccessibleImage image={image} lazy={lazy} responsiveConfig={responsiveConfig} />
      <figcaption>{caption}</figcaption>
    </figure>
  ) : (
    <AccessibleImage image={image} lazy={lazy} responsiveConfig={responsiveConfig} />
  );

export default CaptionedImage;
