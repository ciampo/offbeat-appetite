import React from 'react';

import AccessibleImage from './AccessibleImage';

import { SanityCaptionedImage } from '../../typings';

type CaptionedImageProps = SanityCaptionedImage & {
  lazy?: boolean;
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
