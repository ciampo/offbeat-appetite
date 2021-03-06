import { SanityAccessibleImage } from '.';

export type SanityPersonPreview = {
  _id: string;
  name: string;
  image: SanityAccessibleImage;
};

export type SanityPersonFull = SanityPersonPreview & {
  country: string;
  email: string;
  urls: string[];
  bio: string;
};
