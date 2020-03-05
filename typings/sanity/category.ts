import { SanityImage } from './common';

export type BlogPostPreview = {
  slug: string;
  title: string;
  excerpt: string;
  previewImage: SanityImage;
};

export type SanityCategory = {
  _id: string;
  name: string;
  slug: string;
  seoImage: string;
  featuredBlogPosts: BlogPostPreview[];
  allBlogPosts: BlogPostPreview[];
};
