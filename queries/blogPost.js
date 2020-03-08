/* eslint-disable @typescript-eslint/no-var-requires */
const { categoryPreviewProjection, personPreviewProjection } = require('./projections');

const blogPostType = 'blogPost';

const allBlogPostsQuery = /* groq */ `*[_type == "${blogPostType}"] {
  _id,
  title,
  "slug": slug.current,
  author->${personPreviewProjection},
	category->${categoryPreviewProjection}
}`;

module.exports = {
  allBlogPostsQuery,
  blogPostType,
};
