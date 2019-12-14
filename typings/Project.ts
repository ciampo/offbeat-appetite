import { ContentfulMedia } from './contentful';

export type ContentfulApiProject = {
  title: string;
  slug: string;
  date: string;
  widePictures?: {
    source: ContentfulMedia;
  }[];
  narrowPictures?: {
    source: ContentfulMedia;
  }[];
};
