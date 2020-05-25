import React from 'react';
import { useRouter } from 'next/router';

import SimplePortableText from '../portable-text/SimplePortableText';
import { ArticleContentContainer } from '../layouts/Containers';
import { stringifyRecipeIngredient, joinUrl } from '../../scripts/utils';

import {
  recipePrepTimeLabel,
  recipeCookTimeLabel,
  recipeTimeUnitLabel,
  recipeServingsLabel,
  recipeIngredientsSectionTitle,
  recipeMethodSectionTitle,
  recipeDescriptionSectionTitle,
  recipeInformationSectionTitle,
} from '../../data/siteMiscContent.json';

import { SanityRecipe } from '../../typings';
import { AllSharingButtons } from '../sharing/sharing-links';

import { socialShareLabel } from '../../data/siteMiscContent.json';

const RecipeMethodStep: React.FC = ({ children }) => <li>{children}</li>;

const RecipeSectionTitle: React.FC<{ text: string }> = ({ text }) => (
  <h3 className="mt-6 md:mt-8 font-bold text-xl lg:text-2xl">{text}</h3>
);

type RecipeProps = {
  recipe: SanityRecipe;
};
const Recipe: React.FC<RecipeProps> = ({ recipe, ...props }) => {
  const { asPath } = useRouter();

  return (
    <article
      data-testid="recipe-wrapper"
      id="recipe"
      className="overflow-full-bleed-x py-16 md:py-20 xl:py-24 bg-gray-200"
      {...props}
    >
      <ArticleContentContainer>
        {/* Title */}
        <h2 className="font-bold text-2xl text-center xl:text-3xl">{recipe.title}</h2>

        {/* Rating */}
        <p className="text-center mt-2 md:mt-4">TODO: non-interactive star rating</p>

        {/* Sharing */}
        <aside className="mt-6 md:mt-8 flex flex-col items-center justify-center">
          <p>{socialShareLabel.replace(':platformName', '').trim()}</p>
          <div className="flex flex-wrap justify-center">
            <AllSharingButtons
              link={joinUrl(
                process.env.NEXT_PUBLIC_CANONICAL_URL as string,
                `${asPath.split(/[?#]/)[0]}#recipe`
              )}
              message={recipe.title}
              className="mx-px mt-1 3xsm:mx-1 sm:mt-2"
            />
          </div>
        </aside>

        {/* Info panel (serving / prep + cooking times) */}
        <section className="mt-8 md:mt-10">
          <h3 className="sr-only">{recipeInformationSectionTitle}</h3>
          <dl className="flex flex-wrap mx-auto border-gray-200 bg-white rounded-sm ">
            {[
              {
                title: recipeServingsLabel,
                quantity: recipe.servings.quantity,
                unit: recipe.servings.unit,
              },
              {
                title: recipePrepTimeLabel,
                quantity: recipe.preparationTime,
                unit: recipeTimeUnitLabel,
              },
              {
                title: recipeCookTimeLabel,
                quantity: recipe.cookingTime,
                unit: recipeTimeUnitLabel,
              },
            ].map(({ title, quantity, unit }, index, array) => (
              <React.Fragment key={`instruction-box-${index}`}>
                <dt
                  className={[
                    'pt-4 px-2 2xsm:pt-6 xsm:pt-8 xsm:px-4 md:pt-6 font-medium uppercase text-center',
                    index === array.length - 1 && '2xsm:border-l-2',
                    index > 0 && 'border-t-2 md:border-t-0 md:border-l-2',
                    index > 0
                      ? // Side by side on 2xsm screen
                        `w-full 2xsm:w-1/2 2xsm:order-${index + 2} md:w-1/3 md:order-${index + 1}`
                      : // Full bleed on 2xsm screen
                        `w-full 2xsm:order-${index + 1} md:w-1/3 md:order-${index + 1}`,
                  ]
                    .filter(Boolean)
                    .join(' ')}
                >
                  {title}
                </dt>
                <dd
                  data-testid={`recipe-info-detail-${index}`}
                  className={[
                    'flex items-end justify-center md:flex-col md:items-center',
                    'pt-1 px-2 pb-4 2xsm:pt-2 2xsm:pb-6 xsm:pt-3 xsm:px-4 xsm:pb-8 md:pt-4 md:pb-6',
                    index === array.length - 1 && '2xsm:border-l-2',
                    index > 0 && 'md:border-l-2',
                    index > 0
                      ? // Side by side on 2xsm screen
                        `w-full 2xsm:w-1/2 2xsm:order-${
                          index + 2 + array.length
                        } md:w-1/3 md:order-${index + 1 + array.length}`
                      : // Full bleed on 2xsm screen
                        `w-full 2xsm:order-${index + 2} md:w-1/3 md:order-${
                          index + 1 + array.length
                        }`,
                  ]
                    .filter(Boolean)
                    .join(' ')}
                >
                  <span className="text-3xl leading-none">{quantity}</span>
                  <span className="text-sm text-center lowercase ml-2 md:ml-0">{unit}</span>
                </dd>
              </React.Fragment>
            ))}
          </dl>
        </section>

        {/* Description  */}
        <section className="mt-6 md:mt-8">
          <h3 className="sr-only">{recipeDescriptionSectionTitle}</h3>
          <p>{recipe.description}</p>
        </section>

        {/* Ingredients  */}
        <section className="mt-6 md:mt-8">
          <RecipeSectionTitle text={recipeIngredientsSectionTitle} />
          <ul data-testid="recipe-ingredients-list">
            {recipe.ingredients.map((ingredient) => (
              <li key={ingredient._key}>{stringifyRecipeIngredient(ingredient)}</li>
            ))}
          </ul>
        </section>

        {/* Method  */}
        <section className="mt-6 md:mt-8">
          <RecipeSectionTitle text={recipeMethodSectionTitle} />
          <ol data-testid="recipe-method-list">
            {recipe.method.map(({ content, _key }) => (
              <SimplePortableText
                key={_key}
                customSerializers={{ container: RecipeMethodStep }}
                blocks={content}
              />
            ))}
          </ol>
        </section>

        {/* TODO: Rating */}
      </ArticleContentContainer>
    </article>
  );
};

export default Recipe;
