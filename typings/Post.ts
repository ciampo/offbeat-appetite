import {
  ContentfulAuthor,
  ContentfulCategory,
  ContentfulContentBlock,
  ContentfulMedia,
  ContentfulTag,
} from '.';

export type ContentfulPost = {
  _updatedAt: string;
  title: string;
  slug: string;
  author: ContentfulAuthor;
  datePublished: string;
  featured: boolean;
  category: ContentfulCategory;
  tags: ContentfulTag[];
  heroImage: ContentfulMedia;
  content: ContentfulContentBlock[];
  tileImage: ContentfulMedia;
  seoTitle: string;
  seoDescription: string;
  previewSharingImage: ContentfulMedia;
};
