import React, { memo } from 'react';

import CaptionedImage from './CaptionedImage';
import CaptionedVideo from './CaptionedVideo';
import {
  contentFullWidthResponsiveConfig,
  contentMediaGalleryResponsiveConfig,
} from './image-responsive-configurations';

import { SanityCaptionedImage, SanityCaptionedVideo, SanityMediaGallery } from '../../typings';

const MediaGallery: React.FC<SanityMediaGallery> = ({ items }) => (
  <div data-testid="gallery-wrapper" className="xsm:grid xsm:grid-cols-2 xsm:gap-6">
    {items
      // Keep only items of type captionedImage or captionedVideo
      .filter(({ _type }) => _type === 'captionedImage' || _type === 'captionedVideo')
      .map((mediaGalleryItem, itemIndex, itemsArray) => {
        const isLastOddItem = itemsArray.length % 2 !== 0 && itemIndex === itemsArray.length - 1;

        const mediaComponentProps = {
          key: `${mediaGalleryItem._type}-${itemIndex}`,
          className: [
            // The last odd item stays on its own on the last row
            isLastOddItem && 'xsm:col-span-2',
            // All but first item have a margin top (mobile only)
            itemIndex > 0 && 'mt-8 xsm:mt-0',
          ]
            .filter(Boolean)
            .join(' '),
          responsiveConfig: isLastOddItem
            ? contentFullWidthResponsiveConfig
            : contentMediaGalleryResponsiveConfig,
        };

        return mediaGalleryItem._type === 'captionedImage' ? (
          <CaptionedImage
            {...mediaComponentProps}
            {...(mediaGalleryItem as SanityCaptionedImage)}
          />
        ) : (
          <CaptionedVideo
            {...mediaComponentProps}
            {...(mediaGalleryItem as SanityCaptionedVideo)}
          />
        );
      })}
  </div>
);

const MemoizedMediaGallery = memo(MediaGallery);

export default MemoizedMediaGallery;
