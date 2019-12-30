import React from 'react';
import { NextComponentType } from 'next';

import DefaultPageTransitionWrapper from '../components/page-transition-wrappers/Default';

const Gallery: NextComponentType = () => (
  <DefaultPageTransitionWrapper>
    <h1>Gallery</h1>
  </DefaultPageTransitionWrapper>
);

export default Gallery;
