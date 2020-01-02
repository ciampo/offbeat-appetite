import React from 'react';
import { NextComponentType } from 'next';

import DefaultPageTransitionWrapper from '../components/page-transition-wrappers/Default';
import NewsletterSubcribe from '../components/forms/NewsletterSubscribe';

const Home: NextComponentType = () => (
  <DefaultPageTransitionWrapper>
    <h1>Home</h1>

    <NewsletterSubcribe />
  </DefaultPageTransitionWrapper>
);

export default Home;
