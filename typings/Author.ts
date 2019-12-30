import { Document } from '@contentful/rich-text-types';

import { ContentfulMedia } from '.';

export type ContentfulAuthor = {
  name: string;
  slug: string;
  picture: ContentfulMedia;
  url: string;
  email: string;
  description: Document;
  countryCode: string;
};
