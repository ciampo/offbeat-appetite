import React from 'react';

import AccessibleVideo from './AccessibleVideo';

import { SanityCaptionedVideo } from '../../typings';
import { AccessibleImageResponsiveConfig } from './sizes-presets';

type CaptionedVideoProps = SanityCaptionedVideo & {
  responsiveConfig: AccessibleImageResponsiveConfig;
};
const CaptionedVideo: React.FC<CaptionedVideoProps> = ({ caption, ...props }) =>
  caption ? (
    <figure>
      <AccessibleVideo {...props} />
      <figcaption>{caption}</figcaption>
    </figure>
  ) : (
    <AccessibleVideo {...props} />
  );

export default CaptionedVideo;
