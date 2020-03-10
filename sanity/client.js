/* eslint-disable @typescript-eslint/no-var-requires */
const sanityClient = require('@sanity/client');

require('dotenv').config();

const DRAFT_PREFIX = 'drafts.';
const DRAFT_PREFIX_LENGTH = DRAFT_PREFIX.length;
const DRAFT_REGEX = new RegExp(`^${DRAFT_PREFIX}`);

/*

EXAMPLE USAGE
const query = `*[_type == "blogPost"] {title, _id}`;
sanityFetch(query).then((posts) => console.log(posts));



NOTE FROM SANITY SUPPORT:

Honestly, what you've implemented is probably the best option right now.
Just keep in mind that if you add a limit to the query,
you may end up not getting all the drafts within the same query.
One option would be to do something like:

{
  "drafts": *[_type == "blogPost" && _id in path('drafts.**')],
  "published": *[_type == "blogPost" && !(_id in path('drafts.**')] | order (_createdAt desc) | [0...100]
}

*/

// Setup sanity client.
const client = sanityClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: 'production',
  token: process.env.SANITY_READ_TOKEN || '',
  // Always use the freshest data (as we're going to save it to disk)
  useCdn: false,
});

async function sanityFetch(query) {
  // Sanity fetched results can contain the draft AND published version of a document.
  const docs = await client.fetch(query);

  // Drafts documents have their ID beginning with `draft.`
  const drafts = docs.filter((draft) => DRAFT_REGEX.test(draft._id));

  // For each found draft, search for the corresponding published doc, and remove it
  drafts.forEach((draft) => {
    const publishedDocIndex = docs.findIndex(
      (doc) => doc._id === draft._id.substring(DRAFT_PREFIX_LENGTH)
    );
    if (publishedDocIndex > -1) {
      docs.splice(publishedDocIndex, 1);
    }
  });

  return docs;
}

module.exports = { sanityFetch };
