/* eslint-disable @typescript-eslint/no-var-requires */
const { categoryPreviewProjection, personPreviewProjection } = require('./projections');

const allBlogPostsQuery = /* groq */ `*[_type == "blogPost"] {
  _id,
  title,
  author->${personPreviewProjection},
	category->${categoryPreviewProjection}
}`;

module.exports = {
  allBlogPostsQuery,
};
