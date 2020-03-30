import imageUrlBuilder from '@sanity/image-url';
import { SanityImageSource } from '@sanity/image-url/lib/types/types';
import { ImageUrlBuilder } from '@sanity/image-url/lib/types/builder';

const builder = imageUrlBuilder({
  dataset: 'production',
  projectId: process.env.SANITY_PROJECT_ID || '',
});

// https://github.com/sanity-io/image-url
export function urlFor(source: SanityImageSource): ImageUrlBuilder {
  return builder.image(source);
}
