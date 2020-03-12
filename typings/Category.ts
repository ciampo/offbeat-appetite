import { SanityBlogPostPreview } from '.';

export type SanityCategoryPreview = {
  _id: string;
  name: string;
  slug: string;
};

export type SanityCategoryFull = SanityCategoryPreview & {
  featuredBlogPosts: SanityBlogPostPreview[];
  allBlogPosts: SanityBlogPostPreview[];
  title: string;
  seoDescription: string;
  seoTitle: string;
  seoImage: string;
};
