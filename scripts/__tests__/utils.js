/**
 * @jest-environment node
 */

import { slugify } from '../utils';

test('slugufy', () => {
  expect(slugify('Name Middle Name Family Name')).toBe('name-middle-name-family-name');
});
