import React from 'react';

import * as logos from '../components/icons/logos';
import * as social from '../components/icons/social';

import '../styles/index.css';

export default {
  title: 'Icons',
};

const groups = [
  {
    title: 'Logos',
    icons: logos,
  },
  {
    title: 'Social',
    icons: social,
  },
];

export const Palette: React.FC = () => (
  <ul className="space-y-8">
    {groups.map(({ title, icons }) => (
      <li className="space-y-4" key={title}>
        <h2 className="type-display-3">{title}</h2>
        <ul className="space-x-4">
          {Object.values(icons).map((Icon, index) => (
            <li key={index} className="bg-gray-lighter p-8 inline-block">
              <Icon className="h-16 w-auto" />
            </li>
          ))}
        </ul>
      </li>
    ))}
  </ul>
);
