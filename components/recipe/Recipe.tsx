import React from 'react';

import { SanityRecipe } from '../../typings';

type RecipeProps = {
  recipe: SanityRecipe & {
    _key: string;
  };
};
const Recipe: React.FC<RecipeProps> = ({ recipe, ...props }) => (
  <article {...props}>
    <h2>{recipe.title}</h2>
    <p>{recipe.description}</p>
  </article>
);

export default Recipe;
