import React from 'react';

import AccessibleImage from './AccessibleImage';

import { SanityAccessibleImage } from '../../typings';

type CaptionedImageProps = {
  image: SanityAccessibleImage;
  lazy?: boolean;
  caption?: string;
};
const CaptionedImage: React.FC<CaptionedImageProps> = ({ image, lazy, caption }) =>
  caption ? (
    <figure>
      <AccessibleImage image={image} lazy={lazy} />
      <figcaption>{caption}</figcaption>
    </figure>
  ) : (
    <AccessibleImage image={image} lazy={lazy} />
  );

export default CaptionedImage;
