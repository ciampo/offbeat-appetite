/* eslint-disable @typescript-eslint/no-var-requires */
const { blogPostPreviewProjection } = require('./projections');
const { pageCategoryQuery } = require('./pages.js');

const categoryType = 'category';

// TODO: allBlogPost needs to overlayDrafts
const allCategoriesQuery = /* groq */ `*[_type == "${categoryType}"] {
  _id,
  name,
  "slug": slug.current,
  "featuredBlogPosts": featured[]->${blogPostPreviewProjection} | order(datePublished desc),
  "allBlogPosts": *[_type == "blogPost" && references(^._id)] ${blogPostPreviewProjection} | order(datePublished desc),
  "title": ${pageCategoryQuery}[0].title,
  "seoDescription": ${pageCategoryQuery}[0].seoDescription,
  "seoTitle": ${pageCategoryQuery}[0].seoTitle,
  "seoImage": seoImage.asset->url,
}`;

function replaceCategoryContent(categoryItem, content) {
  return JSON.parse(JSON.stringify(content).replace(/:categoryName/g, categoryItem.name));
}

module.exports = {
  allCategoriesQuery,
  categoryType,
  replaceCategoryContent,
};
