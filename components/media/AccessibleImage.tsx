import React from 'react';
import { urlFor } from '../../sanity/get-image-url';

import { AccessibleImageResponsiveConfig } from './sizes-presets';
import { SanityAccessibleImage } from '../../typings';

function generateUrl({
  image,
  width,
  forceRatio,
}: {
  image: SanityAccessibleImage;
  width: number;
  forceRatio?: number;
}): string {
  let builder = urlFor(image)
    // Serve WebP when possible
    .auto('format')
    // When specifying both width/height, crops the image to fit
    .fit('crop');

  if (forceRatio) {
    builder = builder.size(Math.round(width), Math.round(width / forceRatio));
  } else {
    builder = builder.width(Math.round(width));
  }

  return builder.url() || '';
}

type AccessibleImageProps = {
  image: SanityAccessibleImage;
  responsiveConfig: AccessibleImageResponsiveConfig;
  lazy?: boolean;
  className?: string;
  [key: string]: unknown;
};

const AccessibleImage: React.FC<AccessibleImageProps> = ({
  image,
  lazy,
  responsiveConfig: { exports, sizes, forceRatio },
  className,
  ...props
}) => {
  if (!exports.length || !sizes.length) {
    console.warn(
      `AccessibleImage needs valid options to be rendered [raw url: ${image.asset.url}]`
    );
    return null;
  }

  if (sizes[sizes.length - 1].queryMinWidth) {
    console.warn(
      'The last element of the sizes config should not have a `queryMinWidth` attribute'
    );
    return null;
  }

  return (
    <div
      {...props}
      className={`relative w-full h-0 ${className || ''}`}
      style={{
        // Fills the space when the image is lazily loaded
        backgroundColor: image.asset.metadata.palette.dominant.background,
        // Force aspect ratio (avoids layout shifting)
        paddingBottom: `${Math.round(
          100000 / (forceRatio || image.asset.metadata.dimensions.aspectRatio)
        ) / 1000}%`,
      }}
    >
      <img
        className="absolute top-0 left-0 w-full h-full object-cover"
        alt={image.alt}
        // Fallback src when srcset is not supported
        src={generateUrl({
          image,
          width: exports[0],
          forceRatio,
        })}
        srcSet={exports
          .map(
            (width) =>
              `${generateUrl({
                image,
                width,
                forceRatio,
              })} ${width}w`
          )
          .join(', ')}
        sizes={sizes
          .map(
            ({ width, queryMinWidth }) =>
              `${queryMinWidth ? `(min-width: ${queryMinWidth}) ` : ''}${width}`
          )
          .join(',')}
        // Lazy-loading related attributes
        loading={lazy ? 'lazy' : undefined}
        width={image.asset.metadata.dimensions.width}
        height={
          forceRatio
            ? Math.round(image.asset.metadata.dimensions.width / forceRatio)
            : image.asset.metadata.dimensions.height
        }
      />
    </div>
  );
};

export default AccessibleImage;
