import sanityClient from '@sanity/client';

const client = sanityClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
  dataset: 'production',
  token: process.env.NEXT_PUBLIC_SANITY_READ_TOKEN_CLIENT_SIDE || '',
  // Always use the freshest data (as we're going to save it to disk)
  useCdn: false,
  ignoreBrowserTokenWarning: true,
});

export const getPostReviews = async (postId: string): Promise<{ reviews: number[] }> =>
  await client.fetch(`*[_id == "${postId}"] {"reviews": coalesce(reviews[], [])}[0]`);
