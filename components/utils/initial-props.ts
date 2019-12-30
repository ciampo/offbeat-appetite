import { ContentfulPageGeneric } from '../../typings';

export const initialContentfulMedia = {
  title: 'Sample image',
  file: {
    url: '',
    contentType: '',
    fileName: '',
    details: {
      size: -1,
      image: {
        width: -1,
        height: -1,
      },
    },
  },
};

export const initialDefaultPageProps: ContentfulPageGeneric = {
  navLabel: undefined,
  seoTitle: 'title',
  seoDescription: '',
};
