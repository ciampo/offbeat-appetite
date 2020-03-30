import { SanityAsset } from '@sanity/image-url/lib/types/types';

export type SanityAccessibleImage = {
  alt: string;
  asset: SanityAsset & {
    metadata: {
      dimensions: {
        aspectRatio: number;
        height: number;
        width: number;
      };
      palette: {
        dominant: {
          background: string;
          foreground: string;
        };
      };
    };
  };
  hotspot?: {
    height: number;
    width: number;
    x: number;
    y: number;
  };
};

export type SanityCaptionedImage = {
  _type: string;
  image: SanityAccessibleImage;
  caption?: string;
};

export type SanityAccessibleVideo = {
  url: string;
  alt: string;
  poster: string;
};

export type SanityCaptionedVideo = {
  _type: string;
  video: SanityAccessibleVideo;
  caption?: string;
};

export type SanityMediaGallery = {
  _type: string;
  items: (SanityCaptionedImage | SanityCaptionedVideo)[];
};
