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

const tagPreviewProjection = /* groq */ `{
  _id,
  name,
  "slug": slug.current
}`;

const personPreviewProjection = /* groq */ `{
  _id,
  name,
  image->${accessibleImageProjection},
}`;

const personFullProjection = /* groq */ `{
  _id,
  name,
  image->${accessibleImageProjection},
  country,
  email,
  homepage,
  bio[] ${simplePortabletextProjection},
}`;

const blogPostPreviewProjection = /* groq */ `{
  _id,
  "slug": slug.current,
  title,
  excerpt,
  author->${personPreviewProjection},
  category->${categoryPreviewProjection},
  "tags":tags[]->${tagPreviewProjection},
  datePublished,
  previewImage->${accessibleImageProjection},
}`;

module.exports = {
  simplePortabletextProjection,
  blogPostPreviewProjection,
  categoryPreviewProjection,
  tagPreviewProjection,
  personPreviewProjection,
  personFullProjection,
  accessibleImageProjection,
};
