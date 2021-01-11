import * as React from 'react';

import '../styles/index.css';

export default {
  title: 'Typography',
};

const variants = [
  { name: 'display-1', breakpoints: ['m', 't', 'd'] },
  { name: 'display-2', breakpoints: ['m', 'd'] },
  { name: 'heading-1', breakpoints: ['m', 'd'] },
  { name: 'heading-2', breakpoints: ['m', 'd'] },
  { name: 'heading-3', breakpoints: ['m', 'd'] },
  { name: 'heading-4', breakpoints: ['m', 'd'] },
  { name: 'eyebrow', breakpoints: ['m', 't', 'd'] },
  { name: 'tag', breakpoints: ['m', 'd'] },
  { name: 'body-large', breakpoints: ['m', 'd'] },
  { name: 'body', breakpoints: ['m', 'd'] },
  { name: 'footnote', breakpoints: ['m', 'd'] },
];

export const Palette: React.FC = () => (
  <ul>
    {variants.map((typeVariant) => (
      <li key={typeVariant.name}>
        <ul className="flex">
          {typeVariant.breakpoints.map((breakpoint, index, array) => (
            <li
              key={breakpoint}
              className={[
                'p-4',
                `_type-${typeVariant.name}-${breakpoint}`,
                index === 0 && array.length == 2 ? 'w-2/3' : 'w-1/3',
              ].join(' ')}
            >
              <span className="flex items-center justify-center h-20 bg-gray-light">
                {typeVariant.name} - {breakpoint}
              </span>
            </li>
          ))}
        </ul>
      </li>
    ))}
  </ul>
);
