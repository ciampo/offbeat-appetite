import { SanityCategoryPreview, SanityBlogPostPreview, SanityRichPortableText } from '.';

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
  seoDescription: string;
  seoImage: string;
  seoTitle: string;
};

export type SanityPageAbout = {
  _id: string;
  title: string;
  heroTitle: string;
  content: SanityRichPortableText;
  seoDescription: string;
  seoImage: string;
  seoTitle: string;
};

export type SanityPageThankYou = {
  _id: string;
  title: string;
  content: SanityRichPortableText;
  seoDescription: string;
  seoImage: string;
  seoTitle: string;
};
