const accessibleImageProjection = /* groq */ `{
  "url": image.asset->url,
  "alt": image.alt,
}`;

const simplePortabletextProjection = /* groq */ `{
  ...,
  "markDefs": markDefs[]{
    ...,
    _type == "internalLink" => {
      "reference": reference->{
        _id,
        "slug": slug.current,
        "categorySlug": category->slug.current,
      }
    },
  }
}`;

const categoryPreviewProjection = /* groq */ `{
  _id,
  name,
  "slug": slug.current
}`;

const personPreviewProjection = /* groq */ `{
  _id,
  name,
  image->${accessibleImageProjection},
}`;

const blogPostPreviewProjection = /* groq */ `{
  _id,
  "slug": slug.current,
  title,
  excerpt,
  datePublished,
  author->${personPreviewProjection},
  previewImage->${accessibleImageProjection},
  category->${categoryPreviewProjection},
}`;

module.exports = {
  simplePortabletextProjection,
  blogPostPreviewProjection,
  categoryPreviewProjection,
  personPreviewProjection,
  accessibleImageProjection,
};
