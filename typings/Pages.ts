import {
  SanityAccessibleImage,
  SanityCategoryPreview,
  SanityBlogPostPreview,
  SanityBlock,
} from '.';

export type SanityPageHomeCategorySection = {
  title: string;
  category: SanityCategoryPreview & {
    featuredBlogPosts: SanityBlogPostPreview[];
  };
};

export type SanityPageHome = {
  _id: string;
  title: string;
  subtitle: string;
  categorySections: SanityPageHomeCategorySection[];
  heroImage: SanityAccessibleImage;
  seoDescription: string;
  seoImage: string;
  seoTitle: string;
};

export type SanityPageAbout = {
  _id: string;
  title: string;
  content: SanityBlock[];
  seoDescription: string;
  seoImage: string;
  seoTitle: string;
};
