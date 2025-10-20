import * as React from 'react';
import { axe } from 'jest-axe';

import Recipe from '../Recipe';
import { render } from '../../../test/offbeat-appetite-render';

import { joinUrl } from '../../../scripts/utils';

import {
  recipePrepTimeLabel,
  recipeCookTimeLabel,
  recipeTimeUnitLabel,
  recipeServingsLabel,
  recipeIngredientsSectionTitle,
  recipeMethodSectionTitle,
  recipeDescriptionSectionTitle,
  recipeInformationSectionTitle,
  socialShareLabel,
} from '../../../data/siteMiscContent.json';

import { testRecipeData } from '../__tests_dummy_data__/recipe-mock-data';

test('Recipe renders correctly', async () => {
  const testRouterPath = 'test-recipe-url';
  const fullPageUrl = joinUrl(process.env.NEXT_PUBLIC_CANONICAL_URL as string, testRouterPath);
  const { container, getByText, getAllByText, getByTestId } = render(
    <Recipe recipe={testRecipeData} />,
    {
      router: {
        asPath: testRouterPath,
      },
    }
  );

  [
    testRecipeData.title,
    recipeIngredientsSectionTitle,
    recipeMethodSectionTitle,
    recipeDescriptionSectionTitle,
    recipeInformationSectionTitle,
  ].forEach((text) => expect(getByText(text, { exact: true })).toBeInTheDocument());

  // Check correct flex order and cell width
  expect(getByText(recipeServingsLabel, { exact: true }).className).toMatch(
    /w-full.*2xsm:order-1.*md:w-1\/3.*md:order-1/
  );
  expect(getByTestId('recipe-info-detail-0').className).toMatch(
    /w-full.*2xsm:order-2.*md:w-1\/3.*md:order-4/
  );
  expect(getByText(recipePrepTimeLabel, { exact: true }).className).toMatch(
    /w-full.*2xsm:w-1\/2.*2xsm:order-3.*md:w-1\/3.*md:order-2/
  );
  expect(getByTestId('recipe-info-detail-1').className).toMatch(
    /w-full.*2xsm:w-1\/2.*2xsm:order-6.*md:w-1\/3.*md:order-5/
  );
  expect(getByText(recipeCookTimeLabel, { exact: true }).className).toMatch(
    /w-full.*2xsm:w-1\/2.*2xsm:order-4.*md:w-1\/3.*md:order-3/
  );
  expect(getByTestId('recipe-info-detail-2').className).toMatch(
    /w-full.*2xsm:w-1\/2.*2xsm:order-7.*md:w-1\/3.*md:order-6/
  );

  // Number of list items
  expect(getByTestId('recipe-ingredients-list').childElementCount).toBe(
    testRecipeData.ingredients.length
  );
  expect(getByTestId('recipe-method-list').childElementCount).toBe(testRecipeData.method.length);

  // Remaining recipe data
  expect(getAllByText(recipeTimeUnitLabel, { exact: true })).toHaveLength(2);
  expect(getByText(testRecipeData.servings.unit, { exact: true })).toBeInTheDocument();
  expect(getByText(testRecipeData.description, { exact: true })).toBeInTheDocument();

  // Sharing links have correct sharing URL
  const linkLabel = getAllByText(new RegExp(socialShareLabel.replace(':platformName', '')))[0];
  expect(linkLabel.closest('a')?.href).toMatch(encodeURIComponent(`${fullPageUrl}#recipe`));
  expect(getByTestId('recipe-wrapper')).toHaveAttribute('id', 'recipe');

  expect(
    await axe(container, {
      rules: {
        'aria-allowed-attr': { enabled: false },
      },
    })
  ).toHaveNoViolations();
});
