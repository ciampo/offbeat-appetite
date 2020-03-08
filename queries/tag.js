const tagType = 'tag';
const allTagsQuery = /* groq */ `*[_type == "${tagType}"] {
  _id,
  name,
  "slug": slug.current
}`;

module.exports = {
  tagType,
  allTagsQuery,
};
