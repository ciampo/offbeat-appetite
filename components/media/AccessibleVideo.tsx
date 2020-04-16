import React from 'react';

import { SanityAccessibleVideo } from '../../typings';

/*
OLD STYLES
.video-player {
  @apply relative shadow-lg;
}

.video-player--paused {
  outline: 0.03rem solid var(--color-primary-lighter);
}

*/

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
