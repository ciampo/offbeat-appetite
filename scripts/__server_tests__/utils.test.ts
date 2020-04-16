import { SanityIngredient } from '../../typings';

import {
  slugify,
  joinUrl,
  arrayUnique,
  arraySortNumberAsc,
  stringifyRecipeIngredient,
} from '../utils';

test('slugufy', () => {
  expect(
    slugify(
      'Everything is LowerCase, All sp3ci@l characters are removed, and Spaces    become hyphens. ANd the whole thing is trimmed!! '
    )
  ).toBe(
    'everything-is-lowercase-all-sp3cil-characters-are-removed-and-spaces-become-hyphens-and-the-whole-thing-is-trimmed'
  );
});

test('joinUrl', () => {
  const firstPath = 'first';
  const secondPath = 'second';

  expect(joinUrl(firstPath)).toBe(firstPath);
  expect(joinUrl(`${firstPath}/`)).toBe(firstPath);
  expect(joinUrl(firstPath, secondPath)).toBe(`${firstPath}/${secondPath}`);
  expect(joinUrl(`${firstPath}/`, secondPath)).toBe(`${firstPath}/${secondPath}`);
  expect(joinUrl(firstPath, `/${secondPath}`)).toBe(`${firstPath}/${secondPath}`);
  expect(joinUrl(`${firstPath}/`, `/${secondPath}`)).toBe(`${firstPath}/${secondPath}`);
});

test('arrayUnique', () => {
  expect(arrayUnique(['1', 1, 'One', '1'])).toMatchObject(['1', 1, 'One']);
});

test('arraySortNumberAsc', () => {
  expect(arraySortNumberAsc([1, 10, -20, 1, 2, 5999, 43])).toMatchObject([
    -20,
    1,
    1,
    2,
    10,
    43,
    5999,
  ]);
});

test('stringifyRecipeIngredient', () => {
  const ingNoQuantityNoUnit: SanityIngredient = {
    _key: 'test',
    name: 'test ingredient',
    unit: 'unitless',
    quantity: 0,
  };
  const ingQuantityNoUnit: SanityIngredient = {
    _key: 'test',
    name: 'test ingredient',
    unit: 'unitless',
    quantity: 10,
  };
  const ingNoQuantityWithUnit: SanityIngredient = {
    _key: 'test',
    name: 'test ingredient',
    unit: 'gr',
    quantity: 0,
  };
  const ingQuantityWithUnit: SanityIngredient = {
    _key: 'test',
    name: 'test ingredient',
    unit: 'gr',
    quantity: 100,
  };

  expect(stringifyRecipeIngredient(ingNoQuantityNoUnit)).toBe(ingNoQuantityNoUnit.name);

  expect(stringifyRecipeIngredient(ingQuantityNoUnit)).toBe(
    `${ingQuantityNoUnit.quantity} ${ingQuantityNoUnit.name}`
  );
  expect(stringifyRecipeIngredient(ingNoQuantityWithUnit)).toBe(ingNoQuantityNoUnit.name);

  expect(stringifyRecipeIngredient(ingQuantityWithUnit)).toBe(
    `${ingQuantityWithUnit.quantity}${ingQuantityWithUnit.unit} ${ingQuantityWithUnit.name}`
  );
});
