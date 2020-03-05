/* eslint-disable @typescript-eslint/no-var-requires */
const {
  blogPostPreviewProjection,
  simplePortabletextProjection,
  accessibleImageProjection,
} = require('./projections.js');

const pageHomeQuery = /* groq */ `*[_type == "pageHome"] {
  _id,
  title,
  subtitle,
  heroImage->${accessibleImageProjection},
  categorySections[] {
  	title,
	  category->{
  		"slug": slug.current,
  		name,
  		"featuredBlogPosts": featured[]->${blogPostPreviewProjection},
		}
	},
  seoTitle,
  seoDescription,
  "seoImage": seoImage.asset->url,
}`;

const pageAboutQuery = /* groq */ `*[_type == "pageAbout"] {
  _id,
  title,
  content[] ${simplePortabletextProjection},
  seoTitle,
  seoDescription,
  "seoImage": seoImage.asset->url,
}`;

const pageCategoryQuery = /* groq */ `*[_type == "pageCategory"] {
  _id,
  title,
  seoTitle,
  seoDescription,
}`;

const pageBlogPostQuery = /* groq */ `*[_type == "pageBlogPost"] {
  _id,
  seoTitle,
  seoDescription,
}`;

const pageSearchQuery = /* groq */ `*[_type == "pageSearch"] {
  _id,
  title,
  tagFilterTitle,
  categoryFilterTitle,
  seoTitle,
  seoDescription,
  "seoImage": seoImage.asset->url,
}`;

const pageGalleryQuery = /* groq */ `*[_type == "pageGallery"] {
  _id,
  title,
  images[]->${accessibleImageProjection},
  seoTitle,
  seoDescription,
  "seoImage": seoImage.asset->url,
}`;

const pageThankYouQuery = /* groq */ `*[_type == "pageThankYou"] {
  _id,
  title,
  content[] ${simplePortabletextProjection},
  seoTitle,
  seoDescription,
  "seoImage": seoImage.asset->url,
}`;

module.exports = {
  pageHomeQuery,
  pageAboutQuery,
  pageCategoryQuery,
  pageBlogPostQuery,
  pageSearchQuery,
  pageGalleryQuery,
  pageThankYouQuery,
};
