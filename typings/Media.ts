export type SanityAccessibleImage = {
  url: string;
  alt: string;
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
  items: (SanityCaptionedImage | SanityCaptionedVideo)[];
};
