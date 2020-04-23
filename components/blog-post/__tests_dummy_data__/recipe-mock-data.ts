import { SanityRecipe } from '../../../typings';

export const testRecipeData: SanityRecipe = {
  _key: 'fd2e9198e08b',
  _type: 'recipe',
  calories: 40,
  category: 'Dessert',
  cookingTime: 12,
  cuisine: 'Asian',
  description: 'This recipe was written quickly to show the editor',
  diets: ['GlutenFreeDiet', 'HinduDiet'],
  ingredients: [
    {
      _key: '065ba0c414ed',
      name: 'Salt, a pinch',
      quantity: 0,
      unit: 'unitless',
    },
    {
      _key: '0bf10d5e0e59',
      name: 'butter',
      quantity: 30,
      unit: 'gr',
    },
  ],
  method: [
    {
      _key: 'bba5bea8b0e6',
      content: [
        {
          _key: '3df1bf2070b1',
          _type: 'block',
          children: [
            {
              _key: '3df1bf2070b10',
              _type: 'span',
              marks: [],
              text: 'Wash the veggies under fresh water, then chop finely',
            },
          ],
          markDefs: [],
          style: 'normal',
        },
      ],
      title: 'Prepare the veg',
    },
    {
      _key: 'ec1b6e6ee6ca',
      content: [
        {
          _key: '5fa0a7f2179c',
          _type: 'block',
          children: [
            {
              _key: '5fa0a7f2179c0',
              _type: 'span',
              marks: [],
              text: '',
            },
            {
              _key: '5fa0a7f2179c1',
              _type: 'span',
              marks: ['b10b3a7b9dd8'],
              text: 'Internal Link',
            },
            {
              _key: '5fa0a7f2179c2',
              _type: 'span',
              marks: [],
              text: '',
            },
          ],
          markDefs: [
            {
              _key: 'b10b3a7b9dd8',
              _type: 'internalLink',
              reference: {
                _id: '0b92dd45-79bc-42d3-beea-6ab886ec1914',
                category: {
                  slug: 'stories',
                },
                slug: 'test-story',
              },
            },
          ],
          style: 'normal',
        },
        {
          _key: '9274e5814a89',
          _type: 'block',
          children: [
            {
              _key: '9274e5814a890',
              _type: 'span',
              marks: [],
              text: '',
            },
          ],
          markDefs: [],
          style: 'normal',
        },
        {
          _key: 'dedc09d7d9e4',
          _type: 'block',
          children: [
            {
              _key: 'dedc09d7d9e40',
              _type: 'span',
              marks: [],
              text: '',
            },
            {
              _key: 'dedc09d7d9e41',
              _type: 'span',
              marks: ['7f1e8751d14c'],
              text: 'External Link',
            },
            {
              _key: 'dedc09d7d9e42',
              _type: 'span',
              marks: [],
              text: '',
            },
          ],
          markDefs: [
            {
              _key: '7f1e8751d14c',
              _type: 'link',
              blank: true,
              href: 'https://google.com',
            },
          ],
          style: 'normal',
        },
      ],
      title: 'Place the veg in the dish',
    },
  ],
  preparationTime: 30,
  servings: {
    quantity: 4,
    unit: 'Slices',
  },
  title: 'Random bear recipe',
};
