import React, { CSSProperties } from 'react';

import CaptionedImage from './CaptionedImage';
import CaptionedVideo from './CaptionedVideo';
import {
  contentFullWidthResponsiveConfig,
  contentMediaGalleryResponsiveConfig,
} from './image-responsive-configurations';

const MEDIA_GALLERY_ITEM_FORCED_RATIO = 1.25;

import { SanityCaptionedImage, SanityCaptionedVideo, SanityMediaGallery } from '../../typings';

const MediaGallery: React.FC<SanityMediaGallery> = (props) => (
  <div className="xsm:grid xsm:grid-cols-2 xsm:gap-6">
    {props.items.map((mediaGalleryItem, itemIndex) => {
      const itemClassList = [];
      const forcedMediaStyles: CSSProperties = {};
      let responsiveConfig;

      if (itemIndex === props.items.length - 1 && props.items.length % 2 !== 0) {
        // If there is an odd number of items,
        // the last items stays on its own on the last row
        itemClassList.push('xsm:col-span-2');
        responsiveConfig = contentFullWidthResponsiveConfig;
      } else {
        // All other items, are laid out 2 by 2 for each row
        forcedMediaStyles.paddingBottom = `${MEDIA_GALLERY_ITEM_FORCED_RATIO * 100}%`;
        responsiveConfig = contentMediaGalleryResponsiveConfig;
      }

      // First 2 items have not margin top
      if (itemIndex > 0) {
        itemClassList.push('mt-8 xsm:mt-0');
      }

      if (mediaGalleryItem._type === 'captionedImage') {
        return (
          <CaptionedImage
            _type={mediaGalleryItem._type}
            image={(mediaGalleryItem as SanityCaptionedImage).image}
            caption={mediaGalleryItem.caption}
            responsiveConfig={responsiveConfig}
            className={itemClassList.join(' ').trim()}
            accessibleImageProps={{
              style: forcedMediaStyles,
            }}
          />
        );
      }

      if (mediaGalleryItem._type === 'captionedVideo') {
        return (
          <CaptionedVideo
            _type={mediaGalleryItem._type}
            video={(mediaGalleryItem as SanityCaptionedVideo).video}
            caption={mediaGalleryItem.caption}
            responsiveConfig={responsiveConfig}
            className={itemClassList.join(' ').trim()}
            accessibleVideoProps={{
              style: {
                ...forcedMediaStyles,
                height: 0,
              },
              absolutePositionedVideo: true,
            }}
          />
        );
      }

      return null;
    })}
  </div>
);

export default MediaGallery;
