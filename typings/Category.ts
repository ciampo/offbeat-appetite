import { ContentfulMedia } from '.';

export type ContentfulCategory = {
  name: string;
  slug: string;
  order: number;
  previewSharingImage: ContentfulMedia;
};
