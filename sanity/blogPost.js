/* eslint-disable @typescript-eslint/no-var-requires */
const {
  categoryPreviewProjection,
  personFullProjection,
  tagPreviewProjection,
  accessibleImageProjection,
  richPortabletextProjection,
} = require('./projections');

const { pageBlogPostQuery } = require('./pages.js');

const blogPostType = 'blogPost';
const allBlogPostsQuery = /* groq */ `*[_type == "${blogPostType}"] {
  _id,
  _updatedAt,
  "slug": slug.current,
  title,
  heroImage->${accessibleImageProjection},
  excerpt,
  content[] ${richPortabletextProjection},
  author->${personFullProjection},
	category->${categoryPreviewProjection},
  "tags":tags[]->${tagPreviewProjection},
  datePublished,
  keywords,
  "seoTitle": ${pageBlogPostQuery}[0].seoTitle,
  seoDescription,
  "seoImage": seoImage.asset->url,
}`;

function replaceBlogPostContent(blogPostItem, content) {
  return JSON.parse(
    JSON.stringify(content)
      .replace(/:blogPostTitle/g, blogPostItem.title)
      .replace(/:categoryName/g, blogPostItem.category.name)
  );
}

module.exports = {
  allBlogPostsQuery,
  blogPostType,
  replaceBlogPostContent,
};
