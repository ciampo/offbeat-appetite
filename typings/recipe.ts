import { SanityBlock } from '.';

export type SanityIngredientUnit = 'kg' | 'ml' | 'l' | 'unitless';

export type SanityIngredient = {
  _key: string;
  name: string;
  quantity: number;
  unit: SanityIngredientUnit;
};

export type SanityRecipe = {
  _type: string;
  title: string;
  description: string;
  cookingTime: number;
  preparationTime: number;
  servings: number;
  ingredients: SanityIngredient[];
  method: SanityBlock[];
};
