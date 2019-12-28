import { Document } from '@contentful/rich-text-types';

import { Meta } from './Meta';
import { ContentfulApiStructuredData } from './StructuredData';

export type ContentfulApiPageGeneric = {
  meta: Meta;
  navTitle?: string;
  structuredDataTemplate?: ContentfulApiStructuredData;
};

export type ContentfulApiPageHome = ContentfulApiPageGeneric & {
  pageTitle: string;
};

export type ContentfulApiPageAbout = ContentfulApiPageGeneric & {
  title: string;
  bio?: Document;
};

export type ContentfulApiPageProject = ContentfulApiPageGeneric & {
  mediaSectionTitle: string;
};
