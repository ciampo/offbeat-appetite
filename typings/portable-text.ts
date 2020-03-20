import { SanityRecipe } from './recipe';
import { SanityCaptionedImage, SanityCaptionedVideo, SanityMediaGallery } from './media';

export interface SanityMarkDefs {
  _key: string;
  _type: string;
  [key: string]: string;
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
    imageOptions: object;
  };
  isInline?: boolean;
  children: object[];
}

export type SanityRichPortableText = (
  | SanityBlock
  | SanityRecipe
  | SanityCaptionedImage
  | SanityCaptionedVideo
  | SanityMediaGallery
)[];
