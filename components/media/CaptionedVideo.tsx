import React from 'react';

import AccessibleVideo from './AccessibleVideo';
import { AccessibleImageResponsiveConfig } from './image-responsive-configurations';

import { SanityCaptionedVideo } from '../../typings';

type CaptionedVideoProps = SanityCaptionedVideo & {
  responsiveConfig: AccessibleImageResponsiveConfig;
  [key: string]: unknown;
};
const CaptionedVideo: React.FC<CaptionedVideoProps> = ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _type,
  video,
  caption,
  responsiveConfig,
  ...props
}) =>
  caption ? (
    <div {...props}>
      <figure className="oba-stack-tiny">
        <AccessibleVideo video={video} responsiveConfig={responsiveConfig} />
        <figcaption>{caption}</figcaption>
      </figure>
    </div>
  ) : (
    <AccessibleVideo video={video} responsiveConfig={responsiveConfig} />
  );

export default CaptionedVideo;
