import sanityClient from '@sanity/client';

const client = sanityClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
  dataset: 'production',
  token: process.env.NEXT_PUBLIC_SANITY_READ_TOKEN_CLIENT_SIDE || '',
  useCdn: false,
  ignoreBrowserTokenWarning: true,
});

type BlogPostRating = {
  rating: number;
};
export const getPostReviews = async (postId: string): Promise<BlogPostRating[]> =>
  await client.fetch(`*[_type == "blogPostRating" && post._ref == "${postId}" ]`);

const TEXT_MATCHERS = [
  'title',
  'excerpt',
  'content[].children[].text',
  'content[].ingredients[].name',
  'content[].method[].title',
  'content[].method[].content[].children[].text',
  'content[].caption',
  // 'content[].image->image.alt',
  // 'content[].video->video.alt',
];

console.log('TODO: remove * from search query');
export const getPostsByText = async (searchTerm: string): Promise<{ _id: string }[]> =>
  await client.fetch(
    `*[_type == "blogPost" && ( ${TEXT_MATCHERS.map(
      (matcher) => `${matcher} match "*${searchTerm}*"`
    ).join(' || ')} )] { _id }`
  );
