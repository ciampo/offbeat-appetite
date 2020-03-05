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
