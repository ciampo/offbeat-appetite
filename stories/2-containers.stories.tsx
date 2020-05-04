import React from 'react';

import { ArticleContentContainer, PageContentContainer } from '../components/layouts/Containers';

import '../styles/index.css';

export default {
  title: 'Containers',
};

export const Containers: React.FC = () => (
  <>
    <PageContentContainer>
      <div className="py-8 bg-pink-light">Content</div>
    </PageContentContainer>
    <ArticleContentContainer>
      <div className="py-8 bg-olive-light">Article</div>
    </ArticleContentContainer>
  </>
);
