import React from 'react';
import { NextComponentType } from 'next';

import DefaultPageTransitionWrapper from '../../components/page-transition-wrappers/Default';

const Post: NextComponentType = () => (
  <DefaultPageTransitionWrapper>
    <h1>Post</h1>
  </DefaultPageTransitionWrapper>
);

export default Post;
