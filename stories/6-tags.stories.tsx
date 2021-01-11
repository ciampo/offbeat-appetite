import * as React from 'react';
import { withKnobs, text } from '@storybook/addon-knobs';

import Tag from '../components/tag/Tag';

import '../styles/index.css';

export default {
  title: 'Tags',
  decorators: [withKnobs],
};

export const Tags: React.FC = () => (
  <div className="p-8 space-y-4">
    <Tag>{text('Tag text', 'Example tag')}</Tag>
  </div>
);
