import {
  SanityAccessibleImage,
  SanityPersonFull,
  SanityPersonPreview,
  SanityTag,
  SanityCategoryPreview,
  SanityRichPortableText,
} from '.';

export type SanityBlogPostBase = {
  _id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: SanityCategoryPreview;
  tags: SanityTag[];
  datePublished: string;
};

export type SanityBlogPostPreview = SanityBlogPostBase & {
  author: SanityPersonPreview;
  previewImage: SanityAccessibleImage;
};

export type SanityBlogPostFull = SanityBlogPostBase & {
  author: SanityPersonFull;
  _updatedAt: string;
  heroImage: SanityAccessibleImage;
  content: SanityRichPortableText;
  keywords: string[];
  seoTitle: string;
  seoDescription: string;
  seoImage: string;
};
