import { Document } from '@contentful/rich-text-types';

import { ContentfulMedia, ContentfulAuthor } from '.';

export type ContentfulPageGeneric = {
  navLabel?: string;
  seoTitle: string;
  seoDescription: string;
};

export type ContentfulPageHome = ContentfulPageGeneric & {
  title: string;
  previewSharingImage: ContentfulMedia;
  heroImage: ContentfulMedia;
};

export type ContentfulPageAbout = ContentfulPageGeneric & {
  title: string;
  previewSharingImage: ContentfulMedia;
  aboutProjectSectionTitle: string;
  aboutProjectText: Document;
  aboutAuthorSectionTitle: string;
  author: ContentfulAuthor;
};

export type ContentfulPageCategory = ContentfulPageGeneric & {
  title: string;
};

export type ContentfulPageSearch = ContentfulPageGeneric & {
  title: string;
  previewSharingImage: ContentfulMedia;
  filtersTitle: string;
  categoryFilterTitle: string;
  tagFilterTitle: string;
};

export type ContentfulPageGallery = ContentfulPageGeneric & {
  title: string;
  previewSharingImage: ContentfulMedia;
  filtersTitle: string;
  categoryFilterTitle: string;
  tagFilterTitle: string;
};

export type ContentfulPagePost = ContentfulPageGeneric & {
  authorLabel: string;
};
