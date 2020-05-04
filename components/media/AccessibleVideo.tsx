import React, { useState, useCallback, useRef } from 'react';

import { SanityAccessibleVideo } from '../../typings';
import { AccessibleImageResponsiveConfig } from './image-responsive-configurations';
import AccessibleImage from './AccessibleImage';

type AccessibleVideoProps = {
  video: SanityAccessibleVideo;
  responsiveConfig: AccessibleImageResponsiveConfig;
  className?: string;
};
const AccessibleVideo: React.FC<AccessibleVideoProps> = ({
  video,
  responsiveConfig,
  className = 'relative',
  ...props
}) => {
  const [isVideoInitialised, setVideoInitialised] = useState(false);
  const videoEl = useRef<HTMLVideoElement>(null);

  const onThumbnailClick = useCallback(() => {
    setVideoInitialised(true);
    (videoEl.current as HTMLVideoElement).play();
    (videoEl.current as HTMLVideoElement).focus();
  }, []);

  return (
    <div className={className} data-testid="video-wrapper">
      <video
        {...props}
        ref={videoEl}
        controls
        preload="metadata"
        playsInline
        src={video.url}
        title={video.alt}
        className="z-0 absolute inset-0 h-full w-full object-cover"
        tabIndex={isVideoInitialised ? 0 : -1}
      />
      <AccessibleImage
        image={video.poster}
        responsiveConfig={responsiveConfig}
        className={[isVideoInitialised && 'invisible', 'z-10 filter-darker']
          .filter(Boolean)
          .join(' ')}
        lazy={true}
      />
      {!isVideoInitialised && (
        <button
          className={[
            'z-20 absolute inset-0 w-full h-full',
            'flex items-center justify-center',
            'text-0 text-white cursor-pointer',
            'focus:outline-none focus:text-gray-lighter',
          ].join(' ')}
          onClick={onThumbnailClick}
        >
          Play the video {video.alt}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            viewBox="0 0 48 48"
            className="fill-current w-20 h-20 pointer-events-none"
          >
            <path d="M24 4C12.95 4 4 12.95 4 24s8.95 20 20 20 20-8.95 20-20S35.05 4 24 4zm-4 29V15l12 9-12 9z" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default AccessibleVideo;
