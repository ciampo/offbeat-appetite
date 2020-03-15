import React from 'react';

import AccessibleVideo from './AccessibleVideo';

import { SanityCaptionedVideo } from '../../typings';

type CaptionedVideoProps = SanityCaptionedVideo & {};
const CaptionedVideo: React.FC<CaptionedVideoProps> = ({ video, caption }) =>
  caption ? (
    <figure>
      <AccessibleVideo video={video} />
      <figcaption>{caption}</figcaption>
    </figure>
  ) : (
    <AccessibleVideo video={video} />
  );

export default CaptionedVideo;
