/* eslint-disable @typescript-eslint/no-var-requires */
const { blogPostPreviewProjection } = require('./projections');

// TODO: allBlogPost needs to overlayDrafts
const allCategoriesQuery = /* groq */ `*[_type == "category"] {
  _id,
  name,
  "slug": slug.current,
  "seoImage": seoImage.asset->url,
  "featuredBlogPosts": featured[]->${blogPostPreviewProjection} | order(datePublished desc),
  "allBlogPosts": *[_type == "blogPost" && references(^._id)] ${blogPostPreviewProjection} | order(datePublished desc)
}`;

module.exports = {
  allCategoriesQuery,
};
