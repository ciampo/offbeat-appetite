import React from 'react';

import SimplePortableText from '../portable-text/SimplePortableText';
import { stringifyRecipeIngredient } from '../../scripts/utils';

import {
  recipePrepTimeLabel,
  recipeCookTimeLabel,
  recipeTimeUnitLabel,
  recipeServingsLabel,
  recipeIngredientsSectionTitle,
  recipeMethodSectionTitle,
} from '../../data/siteMiscContent.json';

import { SanityRecipe } from '../../typings';

const RecipeMethodStep: React.FC = ({ children }) => <li>{children}</li>;

type RecipeProps = {
  recipe: SanityRecipe & {
    _key: string;
  };
};
const Recipe: React.FC<RecipeProps> = ({ recipe, ...props }) => (
  <article {...props}>
    <h2>{recipe.title}</h2>
    <p>{recipe.description}</p>

    <dl>
      <dt className="font-bold mt-2">{recipePrepTimeLabel}</dt>
      <dl>
        {recipe.preparationTime} {recipeTimeUnitLabel}
      </dl>

      <dt className="font-bold mt-2">{recipeCookTimeLabel}</dt>
      <dl>
        {recipe.cookingTime} {recipeTimeUnitLabel}
      </dl>

      <dt className="font-bold mt-2">{recipeServingsLabel}</dt>
      <dt>
        {recipe.servings.quantity} {recipe.servings.unit}
      </dt>
    </dl>

    <h3>{recipeIngredientsSectionTitle}</h3>
    <ul>
      {recipe.ingredients.map((ingredient) => (
        <li key={ingredient._key}>{stringifyRecipeIngredient(ingredient)}</li>
      ))}
    </ul>

    <h3>{recipeMethodSectionTitle}</h3>
    {/* Title and method */}
    {/* {recipe.method.map(({ content, title }) => (
      <>
        <h4>{title}</h4>
        <SimplePortableText blocks={content} />
      </>
    ))} */}

    {/* Hidden title and method */}
    {/* {recipe.method.map(({ content, title }) => (
      <>
        <h4 className="sr-only">{title}</h4>
        <SimplePortableText blocks={content} />
      </>
    ))} */}

    {/* All method steps into same block */}
    {/* <SimplePortableText
      blocks={recipe.method.reduce((array: SanityBlock[], step) => [...array, ...step.content], [])}
    /> */}

    <ol>
      {recipe.method.map(({ content }) => (
        <>
          <SimplePortableText
            customSerializers={{ container: RecipeMethodStep }}
            blocks={content}
          />
        </>
      ))}
    </ol>
  </article>
);

export default Recipe;
