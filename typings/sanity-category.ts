import { SanityBlogPostPreview, SanityAccessibleImage } from '.';

export type SanityCategoryPreview = {
  _id: string;
  name: string;
  nameSingular: string;
  description: string;
  slug: string;
};

export type SanityCategoryFull = SanityCategoryPreview & {
  heroImage: SanityAccessibleImage;
  featuredBlogPosts: SanityBlogPostPreview[];
  allBlogPosts: SanityBlogPostPreview[];
  title: string;
  seoDescription: string;
  seoTitle: string;
  seoImage: string;
};
