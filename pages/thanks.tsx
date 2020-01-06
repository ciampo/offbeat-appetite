import React from 'react';
import { NextComponentType } from 'next';

import DefaultPageTransitionWrapper from '../components/page-transition-wrappers/Default';

const Thanks: NextComponentType = () => (
  <DefaultPageTransitionWrapper>
    {/* TODO: get from contentful */}
    <h1>Thank you for subscribing! You should receive an email from us shortly.</h1>
  </DefaultPageTransitionWrapper>
);

export default Thanks;
