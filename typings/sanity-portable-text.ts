import { SanityRecipe, SanityCaptionedImage, SanityCaptionedVideo, SanityMediaGallery } from '.';

export interface SanityInternalLink {
  _id: string;
  _type: 'blogPost' | 'category' | 'pageHome' | 'pageAbout';
  slug: string;
  category: {
    slug: string;
  };
  routeInfo?: {
    page: string;
    path: string;
  };
}

export interface SanityMarkDefs {
  _key: string;
  _type: string;
  reference?:
    | SanityInternalLink
    | {
        [key: string]: unknown;
      };
  [key: string]: unknown;
}

export interface SanityMarkNode {
  _type: string;
  _key: string;
  mark: SanityMarkDefs;
  markKey: string;
}

export interface SanityChildren {
  _key: string;
  _type: string;
  marks: string[];
  text: string;
}
export interface SanityBlock {
  _key: string;
  _type: string;
  children: SanityChildren[];
  level?: number;
  listItem?: string;
  markDefs: SanityMarkDefs[];
  style: string;
}

export interface SanityBlockType<T> {
  node: T & {
    _key: string;
    _type: string;
  };
  options: {
    imageOptions: Record<string, unknown>;
  };
  isInline?: boolean;
  children: Record<string, unknown>[];
}

export type SanityRichPortableText = (
  | SanityBlock
  | SanityRecipe
  | SanityCaptionedImage
  | SanityCaptionedVideo
  | SanityMediaGallery
)[];
