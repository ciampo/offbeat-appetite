import React from 'react';
import { NextComponentType } from 'next';

import DefaultPageTransitionWrapper from '../components/page-transition-wrappers/Default';
import NewsletterSubcribe, {
  NewsletterSubcribeVariant,
} from '../components/forms/NewsletterSubscribe';

const About: NextComponentType = () => (
  <DefaultPageTransitionWrapper>
    <h1>About</h1>
    <NewsletterSubcribe
      variant={NewsletterSubcribeVariant.vertical}
      formInstance="subcribe-about"
    />
  </DefaultPageTransitionWrapper>
);

export default About;
