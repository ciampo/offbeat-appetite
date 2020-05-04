import React, { memo } from 'react';

import AccessibleImage from './AccessibleImage';
import { AccessibleImageResponsiveConfig } from './image-responsive-configurations';

import { SanityCaptionedImage } from '../../typings';

type CaptionedImageProps = SanityCaptionedImage & {
  responsiveConfig: AccessibleImageResponsiveConfig;
  accessibleImageProps?: {
    [key: string]: unknown;
  };
  [key: string]: unknown;
};
const CaptionedImage: React.FC<CaptionedImageProps> = ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _type,
  image,
  caption,
  responsiveConfig,
  accessibleImageProps,
  ...props
}) => (
  <div {...props} data-testid="captioned-image-wrapper">
    {caption ? (
      <figure className="space-y-2 xl:space-y-4">
        <AccessibleImage
          {...accessibleImageProps}
          image={image}
          lazy={true}
          responsiveConfig={responsiveConfig}
        />
        <figcaption>{caption}</figcaption>
      </figure>
    ) : (
      <AccessibleImage
        {...accessibleImageProps}
        image={image}
        lazy={true}
        responsiveConfig={responsiveConfig}
      />
    )}
  </div>
);

const MemoizedCaptionedImage = memo(CaptionedImage);
export default MemoizedCaptionedImage;
