import { SanityAccessibleImage, SanityPersonPreview, SanityTag, SanityCategoryPreview } from '.';

export type SanityBlogPostPreview = {
  _id: string;
  slug: string;
  title: string;
  excerpt: string;
  author: SanityPersonPreview;
  category: SanityCategoryPreview;
  tags: SanityTag[];
  datePublished: string;
  previewImage: SanityAccessibleImage;
};

export type SanityBlogPost = {
  _id: string;
  title: string;
  author: {
    slug: string;
    name: string;
  };
  category: {
    slug: string;
    name: string;
  };
};
