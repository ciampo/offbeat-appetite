/* eslint-disable @typescript-eslint/no-var-requires */
const {
  categoryPreviewProjection,
  personPreviewProjection,
  tagPreviewProjection,
  accessibleImageProjection,
  richPortabletextProjection,
} = require('./projections');

const { pageBlogPostQuery } = require('./pages.js');

const blogPostType = 'blogPost';
const allBlogPostsQuery = /* groq */ `*[_type == "${blogPostType}"] {
  _id,
  "slug": slug.current,
  title,
  heroImage->${accessibleImageProjection},
  excerpt,
  content[] ${richPortabletextProjection},
  author->${personPreviewProjection},
	category->${categoryPreviewProjection},
  "tags":tags[]->${tagPreviewProjection},
  datePublished,
  "seoTitle": ${pageBlogPostQuery}[0].seoTitle,
  "seoDescription": ${pageBlogPostQuery}[0].seoDescription,
  "seoImage": seoImage.asset->url,
}`;

function replaceBlogPostContent(blogPostItem, content) {
  return JSON.parse(
    JSON.stringify(content)
      .replace(/:blogPostTitle/g, blogPostItem.title)
      .replace(/:blogPostExcerpt/g, blogPostItem.excerpt)
      .replace(/:categoryName/g, blogPostItem.category.name)
  );
}

module.exports = {
  allBlogPostsQuery,
  blogPostType,
  replaceBlogPostContent,
};
