import React from 'react';
import { NextComponentType } from 'next';

import DefaultPageTransitionWrapper from '../components/page-transition-wrappers/Default';

const Category: NextComponentType = () => (
  <DefaultPageTransitionWrapper>
    <h1>Category</h1>
  </DefaultPageTransitionWrapper>
);

export default Category;
