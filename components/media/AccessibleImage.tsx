import React from 'react';

import { SanityAccessibleImage } from '../../typings';

type AccessibleImageProps = {
  image: SanityAccessibleImage;
  lazy?: boolean;
};
const AccessibleImage: React.FC<AccessibleImageProps> = ({ image, lazy, ...props }) => (
  <img alt={image.alt} src={image.url} loading={lazy ? 'lazy' : undefined} {...props} />
);

export default AccessibleImage;
