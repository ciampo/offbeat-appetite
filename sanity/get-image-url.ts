import imageUrlBuilder from '@sanity/image-url';
import { SanityImageSource } from '@sanity/image-url/lib/types/types';
import { ImageUrlBuilder } from '@sanity/image-url/lib/types/builder';

const builder = imageUrlBuilder({
  dataset: 'production',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID as string,
});

// https://github.com/sanity-io/image-url
export function urlFor(source: SanityImageSource): ImageUrlBuilder {
  return builder.image(source);
}
