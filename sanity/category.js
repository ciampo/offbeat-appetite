/* eslint-disable @typescript-eslint/no-var-requires */
const { blogPostPreviewProjection } = require('./projections');
const { pageCategoryQuery } = require('./pages.js');

const categoryType = 'category';

const allCategoriesQuery = /* groq */ `*[_type == "${categoryType}"] {
  _id,
  name,
  "slug": slug.current,
  "featuredBlogPosts": featured[] {
  	"post": *[_type == "blogPost" && (_id == ^._ref || _id == "drafts." + ^._ref)] ${blogPostPreviewProjection},
	}.post,
  "allBlogPosts": *[_type == "blogPost" && (category._ref == ^._id || 'drafts.' + category._ref == ^._id)] ${blogPostPreviewProjection} | order(datePublished desc),
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
