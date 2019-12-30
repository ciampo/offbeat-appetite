import React from 'react';
import { NextComponentType } from 'next';

import DefaultPageTransitionWrapper from '../components/page-transition-wrappers/Default';

const Home: NextComponentType = () => (
  <DefaultPageTransitionWrapper>
    <h1>Home</h1>
  </DefaultPageTransitionWrapper>
);

export default Home;
