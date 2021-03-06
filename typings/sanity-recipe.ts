import { SanityBlock, SanityInternalLink } from '.';

export type SanityIngredientUnit = 'gr' | 'kg' | 'ml' | 'l' | 'unitless';

export type SanityDiet =
  | 'DiabeticDiet'
  | 'GlutenFreeDiet'
  | 'HalalDiet'
  | 'HinduDiet'
  | 'KosherDiet'
  | 'LowCalorieDiet'
  | 'LowFatDiet'
  | 'LowLactoseDiet'
  | 'LowSaltDiet'
  | 'VeganDiet'
  | 'VegetarianDiet';

export type SanityIngredient = {
  _key: string;
  name: string;
  quantity: number;
  internalLink?: SanityInternalLink;
  externalLink?: string;
  unit: SanityIngredientUnit;
};

export type SanityServings = {
  quantity: number;
  unit: string;
};

export type SanityRecipeMethodStep = {
  _key: string;
  title: string;
  content: SanityBlock[];
};

export type SanityRecipe = {
  _key: string;
  _type: string;
  title: string;
  description: string;
  preparationTime: number;
  cookingTime: number;
  servings: SanityServings;
  ingredients: SanityIngredient[];
  method: SanityRecipeMethodStep[];
  cuisine: string;
  category: string;
  calories: number;
  diets?: SanityDiet[];
};
