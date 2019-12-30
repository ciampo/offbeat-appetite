import { Document } from '@contentful/rich-text-types';

import { ContentfulMedia } from '.';

export enum CONTENT_BLOCK_TYPES {
  RICH_TEXT = 'richTextBlock',
  RECIPE = 'recipeBlock',
  CAPTIONED_MEDIA = 'captionedMedia',
  MEDIA_SEPARATOR = 'mediaSeparatorBlock',
}

export enum INGREDIENT_UNITS {
  GRAM = 'gr',
  MILLILITRE = 'ml',
  TABLESPOON = 'tbsp',
  TEASPOON = 'tsp',
}

export type ContentfulRichTextBlock = {
  _contentType: CONTENT_BLOCK_TYPES.RICH_TEXT;
  text: Document;
};

// https://jsoneditoronline.org/?id=d9eff08da86f420aaeb523b54cf60ad2
export type ContentfulIngredient = {
  name: string;
  quantity: number;
  unit:
    | INGREDIENT_UNITS.GRAM
    | INGREDIENT_UNITS.MILLILITRE
    | INGREDIENT_UNITS.TABLESPOON
    | INGREDIENT_UNITS.TEASPOON
    | null;
};

export type ContentfulRecipeBlock = {
  _contentType: CONTENT_BLOCK_TYPES.RECIPE;
  preparationTime: number;
  cookingTime: number;
  numberOfServings: number;
  ingredients: ContentfulIngredient[];
  method: Document;
};

export type ContentfulCaptionedMediaBlock = {
  _contentType: CONTENT_BLOCK_TYPES.CAPTIONED_MEDIA;
  media: ContentfulMedia;
  caption?: string;
};

export type ContentfulMediaSeparatorBlock = {
  _contentType: CONTENT_BLOCK_TYPES.MEDIA_SEPARATOR;
};

export type ContentfulContentBlock =
  | ContentfulMediaSeparatorBlock
  | ContentfulCaptionedMediaBlock
  | ContentfulRecipeBlock
  | ContentfulRichTextBlock;
