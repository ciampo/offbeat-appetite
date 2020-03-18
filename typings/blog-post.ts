import {
  SanityAccessibleImage,
  SanityPersonFull,
  SanityTag,
  SanityCategoryPreview,
  SanityBlock,
} from '.';

export type SanityBlogPostBase = {
  _id: string;
  slug: string;
  title: string;
  excerpt: string;
  author: SanityPersonFull;
  category: SanityCategoryPreview;
  tags: SanityTag[];
  datePublished: string;
};

export type SanityBlogPostPreview = SanityBlogPostBase & {
  previewImage: SanityAccessibleImage;
};

export type SanityBlogPostFull = SanityBlogPostBase & {
  heroImage: SanityAccessibleImage;
  content: SanityBlock[];
  seoTitle: string;
  seoDescription: string;
  seoImage: string;
};
