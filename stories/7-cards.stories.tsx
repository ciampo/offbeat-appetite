import React from 'react';

import Card from '../components/card/Card';

import '../styles/index.css';

export default {
  title: 'Cards',
};

const CardComponent = (props: { [key: string]: unknown }): JSX.Element => (
  <article {...props} id="test" />
);

export const Cards: React.FC = () => (
  <div>
    <div className="p-8 bg-gray-lighter">
      <Card shadowVariant="lighter" className="h-32 p-6">
        Card 1
      </Card>
    </div>
    <div className="p-8 bg-gray-light">
      <Card component={CardComponent} shadowVariant="light" className="h-32 p-6">
        Card 2
      </Card>
    </div>
  </div>
);
