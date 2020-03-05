const allTagsQuery = /* groq */ `*[_type == "tag"] {
  _id,
  name,
  "slug": slug.current
}`;

module.exports = {
  allTagsQuery,
};
