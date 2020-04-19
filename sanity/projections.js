// const accessibleImageProjection = /* groq */ `{
//   "url": image.asset->url,
//   "alt": image.alt,
// }`;
const imageAssetProjection = /* groq */ `{
  _id,
  url,
  assetId,
  extension,
  metadata {
    dimensions {
      aspectRatio,
      height,
      width,
    },
    palette {
      dominant {
        background,
        foreground,
      },
    },
  },
}`;

const accessibleImageProjection = /* groq */ `{
  "_type": image._type,
  "asset": image.asset->${imageAssetProjection},
  "crop": image.crop,
  "hotspot": image.hotspot,
  "alt": image.alt,
}`;

const captionedImageProjection = /* groq */ `{
  _type,
  caption,
  image->${accessibleImageProjection},
}`;

const accessibleVideoProjection = /* groq */ `{
  "url": video.asset->url,
  "alt": video.alt,
  "poster": {
    "_type": video.poster._type,
    "asset": video.poster.asset->${imageAssetProjection},
    "crop": video.poster.crop,
    "hotspot": video.poster.hotspot,
    "alt": coalesce(video.poster.alt, ""),
  }
}`;

const captionedVideoProjection = /* groq */ `{
  _type,
  caption,
  video->${accessibleVideoProjection}
}`;

const portableTextCustomMarkDefProjection = /* groq */ `{
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
}`;

const simplePortabletextProjection = /* groq */ `{
  ...,
  "markDefs": markDefs[] ${portableTextCustomMarkDefProjection}
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
  _type == "recipe" => {
    ...,
    ingredients[] {
      ...,
      "unit": unit[0],
    },
    method[] {
      title,
      content[] ${simplePortabletextProjection},
    }
  },
  "markDefs": markDefs[] ${portableTextCustomMarkDefProjection},
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
  urls,
  bio,
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
