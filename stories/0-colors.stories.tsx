import React from 'react';

import { sharedTheme } from '../tailwind.shared';

import '../styles/index.css';

export default {
  title: 'Colors',
};

type ColorWatchProps = { tailwindColor: string };
const ColorSwatch: React.FC<ColorWatchProps> = ({ tailwindColor }) => (
  <li>
    <div className={`w-32 h-16 bg-${tailwindColor}`}></div>
    <h3 className="text-xs">{tailwindColor}</h3>
  </li>
);

export const Swatch: React.FC = () => (
  <ul className="space-y-8">
    {Object.entries(sharedTheme.colors).map(([colorFamily, colors]) => (
      <li className="space-y-4" key={colorFamily}>
        <h2 className="text-2xl">{colorFamily}</h2>
        <ul className="flex">
          {Object.keys(colors).map((colorVariation) => (
            <ColorSwatch key={colorVariation} tailwindColor={`${colorFamily}-${colorVariation}`} />
          ))}
        </ul>
      </li>
    ))}
  </ul>
);
