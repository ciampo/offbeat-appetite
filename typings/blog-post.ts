import {
  SanityAccessibleImage,
  SanityPersonFull,
  SanityTag,
  SanityCategoryPreview,
  SanityRichPortableText,
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
  _updatedAt: string;
  heroImage: SanityAccessibleImage;
  content: SanityRichPortableText;
  keywords: string[];
  seoTitle: string;
  seoDescription: string;
  seoImage: string;
};
