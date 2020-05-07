import React, { memo } from 'react';

type ButtonBaseProps = {
  disabled?: boolean;
  className?: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  [key: string]: unknown;
};

const ButtonBase: React.FC<ButtonBaseProps> = ({ className, ...props }) => (
  <button
    {...props}
    className={[
      'flex items-center h-10 px-4 xl:h-12 xl:px-6 rounded type-heading-4',
      'disabled:cursor-not-allowed disabled:bg-gray-medium disabled:text-gray-dark disabled:opacity-50 disabled:shadow-none',
      className,
    ].join(' ')}
  />
);

export const ButtonNeutral: React.FC<ButtonBaseProps> = memo(({ className, ...props }) => (
  <ButtonBase
    {...props}
    className={[
      'bg-inherit text-gray-dark border border-gray-dark',
      'hover:shadow-md hover:bg-gray-light hover:text-gray-darker',
      'focus:shadow-md focus:bg-gray-light focus:text-gray-darker focus:button-outline-neutral',
      className,
    ]
      .filter(Boolean)
      .join(' ')}
  />
));
ButtonNeutral.displayName = 'memo(ButtonNeutral)';

export const ButtonOlive: React.FC<ButtonBaseProps> = memo(({ className, ...props }) => (
  <ButtonBase
    {...props}
    className={[
      'bg-olive-darker text-gray-white',
      'hover:shadow-md hover:bg-olive-dark',
      'focus:shadow-md focus:bg-olive-dark focus:button-outline-olive',
      className,
    ]
      .filter(Boolean)
      .join(' ')}
  />
));
ButtonOlive.displayName = 'memo(ButtonOlive)';

export const ButtonPink: React.FC<ButtonBaseProps> = memo(({ className, ...props }) => (
  <ButtonBase
    {...props}
    className={[
      'bg-pink-darker text-gray-white',
      'hover:shadow-md hover:bg-pink-dark',
      'focus:shadow-md focus:bg-pink-dark focus:button-outline-pink',
      className,
    ]
      .filter(Boolean)
      .join(' ')}
  />
));
ButtonPink.displayName = 'memo(ButtonPink)';