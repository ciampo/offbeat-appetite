import React from 'react';
import { NextComponentType } from 'next';

import DefaultPageTransitionWrapper from '../components/page-transition-wrappers/Default';

const Search: NextComponentType = () => (
  <DefaultPageTransitionWrapper>
    <h1>Search</h1>
  </DefaultPageTransitionWrapper>
);

export default Search;
