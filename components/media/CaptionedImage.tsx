import React from 'react';

import AccessibleImage from './AccessibleImage';
import { AccessibleImageResponsiveConfig } from './image-responsive-configurations';

import { SanityCaptionedImage } from '../../typings';

type CaptionedImageProps = SanityCaptionedImage & {
  responsiveConfig: AccessibleImageResponsiveConfig;
  [key: string]: unknown;
};
const CaptionedImage: React.FC<CaptionedImageProps> = ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _type,
  image,
  responsiveConfig,
  caption,
  ...props
}) =>
  caption ? (
    <div {...props}>
      <figure className="oba-stack-tiny">
        <AccessibleImage image={image} lazy={true} responsiveConfig={responsiveConfig} />
        <figcaption>{caption}</figcaption>
      </figure>
    </div>
  ) : (
    <AccessibleImage image={image} lazy={true} responsiveConfig={responsiveConfig} {...props} />
  );

export default CaptionedImage;
