export const testImage = {
  _type: 'image',
  alt: 'A test image',
  asset: {
    _id: 'image-c7f3d2a5bfbf870f958d2d3ca704e0840d25f61e-3200x1800-png',
    assetId: 'c7f3d2a5bfbf870f958d2d3ca704e0840d25f61e',
    extension: 'png',
    metadata: {
      dimensions: {
        aspectRatio: 1.7777777777777777,
        height: 1800,
        width: 3200,
      },
      palette: {
        dominant: {
          background: 'rgb(20, 50, 230)',
          foreground: '#000',
        },
      },
    },
    url:
      'https://cdn.sanity.io/images/12345678/production/c7f3d2a5bfbf870f958d2d3ca704e0840d25f61e-3200x1800.png',
  },
};

export const testCaptionedImageNoCaption = {
  _type: 'captionedImage',
  // "caption": "Let's put a caption otherwise I'll go cray cray",
  image: testImage,
};

export const testCaptionedImageWithCaption = {
  ...testCaptionedImageNoCaption,
  caption: 'Test image caption',
};

export const testImageWithHotspot = {
  ...testImage,
  crop: {
    _type: 'sanity.imageCrop',
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
  },
  hotspot: {
    _type: 'sanity.imageHotspot',
    height: 0.3345485056274047,
    width: 0.1666666666666658,
    x: 0.3,
    y: 0.75,
  },
};

export const testVideo = {
  alt: 'Test video',
  poster: {
    _type: 'image',
    alt: '',
    asset: {
      _id: 'image-c7f3d2a5bfbf870f958d2d3ca704e0840d25f61e-3200x1800-png',
      assetId: 'c7f3d2a5bfbf870f958d2d3ca704e0840d25f61e',
      extension: 'png',
      metadata: {
        dimensions: {
          aspectRatio: 1.7777777777777777,
          height: 1800,
          width: 3200,
        },
        palette: {
          dominant: {
            background: '#cccccc',
            foreground: '#000',
          },
        },
      },
      url:
        'https://cdn.sanity.io/images/gpe6axmm/production/c7f3d2a5bfbf870f958d2d3ca704e0840d25f61e-3200x1800.png',
    },
    crop: {
      _type: 'sanity.imageCrop',
      bottom: 0,
      left: 0,
      right: 0,
      top: 0,
    },
    hotspot: {
      _type: 'sanity.imageHotspot',
      height: 0.3534635879218468,
      width: 0.23199999999999932,
      x: 0.36399999999999993,
      y: 0.2868561278863231,
    },
  },
  url:
    'https://cdn.sanity.io/files/gpe6axmm/production/2ffd447ced3e0a04edcdd3975c4b638f16df2f7f.mp4',
};

export const testCaptionedVideoNoCaption = {
  _type: 'captionedVideo',
  // "caption": "Let's put a caption otherwise I'll go cray cray",
  video: testVideo,
};

export const testCaptionedVideoWithCaption = {
  ...testCaptionedVideoNoCaption,
  caption: 'Test video caption',
};

export const testMediaGallery = {
  _key: 'fe7039f054c2',
  _type: 'mediaGallery',
  items: [
    testCaptionedImageWithCaption,
    testCaptionedVideoNoCaption,
    testCaptionedImageWithCaption,
  ],
};

export const testResponsiveConfig = {
  exports: [320, 480, 840],
  sizes: [
    {
      queryMinWidth: '600px',
      width: '32rem',
    },
    {
      width: '100vw',
    },
  ],
};

export const testResponsiveConfigWithRatio = {
  ...testResponsiveConfig,
  forceRatio: 4 / 3,
};

export const testResponsiveConfigInvalidSizes = {
  ...testResponsiveConfig,
  sizes: [
    {
      queryMinWidth: '600px',
      width: '32rem',
    },
    {
      queryMinWidth: '320px',
      width: '100vw',
    },
  ],
};

export const testResponsiveConfigEmptySizes = {
  ...testResponsiveConfig,
  sizes: [],
};

export const testResponsiveConfigEmptyExports = {
  ...testResponsiveConfig,
  exports: [],
};
