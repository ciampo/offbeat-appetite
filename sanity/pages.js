/* eslint-disable @typescript-eslint/no-var-requires */
const {
  blogPostPreviewProjection,
  richPortabletextProjection,
  accessibleImageProjection,
} = require('./projections.js');

const pageHomeType = 'pageHome';
const pageHomeQuery = /* groq */ `*[_type == "${pageHomeType}"] {
  _id,
  title,
  subtitle,
  categorySections[] {
  	title,
	  category->{
      _id,
  		"slug": slug.current,
  		name,
  		"featuredBlogPosts": featured[]->${blogPostPreviewProjection},
		}
	},
  seoTitle,
  seoDescription,
  "seoImage": seoImage.asset->url,
}`;

const pageAboutType = 'pageAbout';
const pageAboutQuery = /* groq */ `*[_type == "${pageAboutType}"] {
  _id,
  title,
  heroTitle,
  content[] ${richPortabletextProjection},
  seoTitle,
  seoDescription,
  "seoImage": seoImage.asset->url,
}`;

const pageCategoryType = 'pageCategory';
const pageCategoryQuery = /* groq */ `*[_type == "${pageCategoryType}"] {
  _id,
  title,
  seoTitle,
  seoDescription,
}`;

const pageBlogPostType = 'pageBlogPost';
const pageBlogPostQuery = /* groq */ `*[_type == "${pageBlogPostType}"] {
  _id,
  seoTitle,
  seoDescription,
}`;

const pageSearchType = 'pageSearch';
const pageSearchQuery = /* groq */ `*[_type == "${pageSearchType}"] {
  _id,
  title,
  tagFilterTitle,
  categoryFilterTitle,
  seoTitle,
  seoDescription,
  "seoImage": seoImage.asset->url,
}`;

const pageGalleryType = 'pageGallery';
const pageGalleryQuery = /* groq */ `*[_type == "${pageGalleryType}"] {
  _id,
  title,
  images[]->${accessibleImageProjection},
  seoTitle,
  seoDescription,
  "seoImage": seoImage.asset->url,
}`;

const pageThankYouType = 'pageThankYou';
const pageThankYouQuery = /* groq */ `*[_type == "pageThankYou"] {
  _id,
  title,
  content[] ${richPortabletextProjection},
  seoTitle,
  seoDescription,
  "seoImage": seoImage.asset->url,
}`;

module.exports = {
  pageHomeType,
  pageHomeQuery,
  pageAboutType,
  pageAboutQuery,
  pageCategoryType,
  pageCategoryQuery,
  pageBlogPostType,
  pageBlogPostQuery,
  pageSearchType,
  pageSearchQuery,
  pageGalleryType,
  pageGalleryQuery,
  pageThankYouType,
  pageThankYouQuery,
};
