import React, { CSSProperties } from 'react';

import CaptionedImage from './CaptionedImage';
import CaptionedVideo from './CaptionedVideo';
import {
  contentFullWidthResponsiveConfig,
  contentMediaGalleryResponsiveConfig,
} from './image-responsive-configurations';

import { SanityCaptionedImage, SanityCaptionedVideo, SanityMediaGallery } from '../../typings';

const MEDIA_GALLERY_ITEM_FORCED_RATIO = 1.25;

const MediaGallery: React.FC<SanityMediaGallery> = (props) => {
  const validItems = props.items.filter(({ _type }) => {
    return _type === 'captionedImage' || _type === 'captionedVideo';
  });
  const hasOddItems = validItems.length % 2 !== 0;
  return (
    <div data-testid="gallery-wrapper" className="xsm:grid xsm:grid-cols-2 xsm:gap-6">
      {validItems.map((mediaGalleryItem, itemIndex) => {
        const itemKey = `${mediaGalleryItem._type}-${itemIndex}`;
        const itemClassList = [];
        let forcedMediaStyles: CSSProperties | undefined;
        let responsiveConfig;

        if (hasOddItems && itemIndex === validItems.length - 1) {
          // If there is an odd number of items,
          // the last items stays on its own on the last row
          itemClassList.push('xsm:col-span-2');
          responsiveConfig = contentFullWidthResponsiveConfig;
        } else {
          // All other items, are laid out 2 by 2 for each row
          forcedMediaStyles = { paddingBottom: `${MEDIA_GALLERY_ITEM_FORCED_RATIO * 100}%` };
          responsiveConfig = contentMediaGalleryResponsiveConfig;
        }

        // All but first item have a margin top (mobile only)
        if (itemIndex > 0) {
          itemClassList.push('mt-8 xsm:mt-0');
        }

        return mediaGalleryItem._type === 'captionedImage' ? (
          <CaptionedImage
            key={itemKey}
            _type={mediaGalleryItem._type}
            image={(mediaGalleryItem as SanityCaptionedImage).image}
            caption={mediaGalleryItem.caption}
            responsiveConfig={responsiveConfig}
            className={itemClassList.join(' ').trim()}
            accessibleImageProps={
              forcedMediaStyles
                ? {
                    style: forcedMediaStyles,
                  }
                : undefined
            }
          />
        ) : (
          <CaptionedVideo
            key={itemKey}
            _type={mediaGalleryItem._type}
            video={(mediaGalleryItem as SanityCaptionedVideo).video}
            caption={mediaGalleryItem.caption}
            responsiveConfig={responsiveConfig}
            className={itemClassList.join(' ').trim()}
            accessibleVideoProps={
              forcedMediaStyles
                ? {
                    style: {
                      ...forcedMediaStyles,
                      height: 0,
                    },
                    absolutePositionedVideo: true,
                  }
                : undefined
            }
          />
        );
      })}
    </div>
  );
};

export default MediaGallery;
