import React from 'react';

import { SanityAccessibleVideo } from '../../typings';

type AccessibleVideoProps = {
  video: SanityAccessibleVideo;
};
const AccessibleVideo: React.FC<AccessibleVideoProps> = ({ video, ...props }) => (
  // TODO: advanced poster (w/ lazy, responsive image)
  <video
    controls
    preload="auto"
    playsInline
    src={video.url}
    title={video.alt}
    poster={video.poster}
    {...props}
  />
);

export default AccessibleVideo;
