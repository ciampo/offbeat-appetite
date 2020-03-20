import { SanityBlock } from '.';

export type SanityIngredientUnit = 'kg' | 'ml' | 'l' | 'unitless';

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
  unit: SanityIngredientUnit;
};

export type SanityServings = {
  quantity: number;
  unit: string;
};

export type SanityRecipe = {
  _type: string;
  title: string;
  description: string;
  preparationTime: number;
  cookingTime: number;
  servings: SanityServings;
  ingredients: SanityIngredient[];
  method: {
    title: string;
    content: SanityBlock[];
  };
  cuisine: string;
  category: string;
  calories: number;
  diets?: SanityDiet[];
};
