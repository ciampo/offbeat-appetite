/* eslint-disable @typescript-eslint/no-var-requires */
const { tagPreviewProjection } = require('./projections.js');

const tagType = 'tag';
const allTagsQuery = /* groq */ `*[_type == "${tagType}"] ${tagPreviewProjection}`;

module.exports = {
  tagType,
  allTagsQuery,
};
