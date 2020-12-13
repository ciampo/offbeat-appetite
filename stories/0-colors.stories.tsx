import React from 'react';

import { sharedTheme } from '../tailwind.shared';

import '../styles/index.css';

export default {
  title: 'Colors',
};

type ColorWatchProps = { tailwindColor: string };
const Color: React.FC<ColorWatchProps> = ({ tailwindColor }) => (
  <li className="space-y-2">
    <div className={`w-40 h-16 bg-${tailwindColor}`}></div>
    <h3 className="type-tag text-gray-dark">{tailwindColor}</h3>
  </li>
);

export const Palette: React.FC = () => (
  <ul className="space-y-8">
    {Object.entries(sharedTheme.colors).map(([colorFamily, colors]) => (
      <li className="space-y-4" key={colorFamily}>
        <h2 className="type-display-3">{colorFamily}</h2>
        <ul className="flex">
          {Object.keys(colors).map((colorVariation) => (
            <Color key={colorVariation} tailwindColor={`${colorFamily}-${colorVariation}`} />
          ))}
        </ul>
      </li>
    ))}
  </ul>
);
