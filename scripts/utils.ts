import { SanityIngredient } from '../typings';

export const joinUrl = (a: string, b = ''): string =>
  a.replace(/\/+$/, '') + (b ? '/' + b.replace(/^\/+/, '') : '');

export const slugify = (text: string): string =>
  text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w-]+/g, '') // Remove all non-word chars
    .replace(/--+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, ''); // Trim - from end of text

export const customEaseOut = [0.175, 0.85, 0.42, 0.96];

export const arrayUnique = <T>(array: Array<T>): Array<T> => Array.from(new Set(array));

export const arraySortNumberAsc = (array: number[]): number[] => {
  const copy = array.slice(0);
  copy.sort((r1, r2) => {
    if (r1 > r2) {
      return 1;
    } else if (r1 < r2) {
      return -1;
    } else {
      return 0;
    }
  });
  return copy;
};

export function stringifyRecipeQuantity({ unit, quantity }: SanityIngredient): string {
  const numberString: string = quantity === 0 ? '' : `${quantity}`;
  const unitString: string = quantity !== 0 && unit !== 'unitless' ? unit : '';

  return `${numberString}${unitString}`;
}

export function stringifyRecipeIngredient(ingredient: SanityIngredient): string {
  const quantityString: string = stringifyRecipeQuantity(ingredient);
  const spaceString: string = ingredient.quantity === 0 ? '' : ' ';

  return `${quantityString}${spaceString}${ingredient.name}`;
}

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];
export function postDateToHumanString(date: string): string {
  const [year, month, day] = date.split('-');
  return `${Number(day)} ${months[Number(month) - 1]} ${year}`;
}

// https://www.sanity.io/docs/image-urls
export function sanitySimpleImageUrl({
  imageBaseSrc,
  width,
  height,
}: {
  imageBaseSrc: string;
  width: number;
  height: number;
}): string {
  return `${imageBaseSrc}?fm=jpg&w=${width}&h=${height}&fit=crop&crop=center`;
}
