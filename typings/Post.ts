import {
  ContentfulAuthor,
  ContentfulCategory,
  ContentfulContentBlock,
  ContentfulMedia,
  ContentfulTag,
} from '.';

type ContentfulPostCommon = {
  title: string;
  slug: string;
  tileImage: ContentfulMedia;
  featured: boolean;
};

export type ContentfulPostEssential = ContentfulPostCommon & {
  category: {
    name: string;
    slug: string;
  };
};

export type ContentfulPost = ContentfulPostCommon & {
  _updatedAt: string;
  category: ContentfulCategory;
  author: ContentfulAuthor;
  datePublished: string;
  tags: ContentfulTag[];
  heroImage: ContentfulMedia;
  content: ContentfulContentBlock[];
  seoTitle: string;
  seoDescription: string;
  previewSharingImage: ContentfulMedia;
};
