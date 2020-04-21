import React, { memo } from 'react';

import AccessibleVideo from './AccessibleVideo';
import { AccessibleImageResponsiveConfig } from './image-responsive-configurations';

import { SanityCaptionedVideo } from '../../typings';

type CaptionedVideoProps = SanityCaptionedVideo & {
  responsiveConfig: AccessibleImageResponsiveConfig;
  accessibleVideoProps?: {
    [key: string]: unknown;
  };
  [key: string]: unknown;
};
const CaptionedVideo: React.FC<CaptionedVideoProps> = ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _type,
  video,
  caption,
  responsiveConfig,
  accessibleVideoProps,
  ...props
}) => (
  <div {...props}>
    {caption ? (
      <figure className="oba-stack-tiny">
        <AccessibleVideo
          {...accessibleVideoProps}
          video={video}
          responsiveConfig={responsiveConfig}
        />
        <figcaption>{caption}</figcaption>
      </figure>
    ) : (
      <AccessibleVideo
        {...accessibleVideoProps}
        video={video}
        responsiveConfig={responsiveConfig}
      />
    )}
  </div>
);

const MemoizedCaptionedVideo = memo(CaptionedVideo);

export default MemoizedCaptionedVideo;
