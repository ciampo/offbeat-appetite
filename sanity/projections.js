const accessibleImageProjection = /* groq */ `{
  "url": image.asset->url,
  "alt": image.alt,
}`;

const captionedImageProjection = /* groq */ `{
  _type,
  caption,
  image->${accessibleImageProjection}
}`;

const accessibleVideoProjection = /* groq */ `{
  "url": video.asset->url,
  "alt": video.alt,
  "poster": video.poster.asset->url,
}`;

const captionedVideoProjection = /* groq */ `{
  _type,
  caption,
  video->${accessibleVideoProjection}
}`;

const simplePortabletextProjection = /* groq */ `{
  ...,
  "markDefs": markDefs[]{
    ...,
    _type == "internalLink" => {
      "reference": reference->{
        _id,
        "slug": slug.current,
        "category": category->{
          "slug": slug.current,
        },
      },
    },
  }
}`;

const richPortabletextProjection = /* groq */ `{
  ...,
  _type == "captionedImage" => ${captionedImageProjection},
  _type == "captionedVideo" => ${captionedVideoProjection},
  _type == "mediaGallery" => {
    ...,
    items[] {
      _type == "captionedImage" => ${captionedImageProjection},
      _type == "captionedVideo" => ${captionedVideoProjection},
    },
  },
  "markDefs": markDefs[]{
    ...,
    _type == "internalLink" => {
      "reference": reference->{
        _id,
        "slug": slug.current,
        "category": category->{
          "slug": slug.current,
        }
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
  richPortabletextProjection,
  blogPostPreviewProjection,
  categoryPreviewProjection,
  tagPreviewProjection,
  personPreviewProjection,
  personFullProjection,
  accessibleImageProjection,
  accessibleVideoProjection,
};
