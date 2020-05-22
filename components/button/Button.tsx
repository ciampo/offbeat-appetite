import React, { memo } from 'react';

type DefaultButtonContainerProps = {
  disabled?: boolean;
  className?: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  [key: string]: unknown;
};
const DefaultButtonContainer: React.FC<DefaultButtonContainerProps> = (props) => (
  <button {...props}></button>
);

type ButtonBaseProps = DefaultButtonContainerProps & {
  component?: (props: { [key: string]: unknown }) => JSX.Element;
};
const ButtonBase: React.FC<ButtonBaseProps> = ({
  className,
  component: Component = DefaultButtonContainer,
  ...props
}) => (
  <Component
    {...props}
    className={[
      'flex items-center h-10 px-4 xl:h-12 xl:px-6 rounded type-heading-4',
      'disabled:cursor-not-allowed disabled:bg-gray-medium disabled:text-gray-dark disabled:opacity-50 disabled:shadow-none focus:outline-none',
      className,
    ].join(' ')}
  />
);

export const ButtonNeutral: React.FC<ButtonBaseProps> = memo(({ className, ...props }) => (
  <ButtonBase
    {...props}
    className={[
      'bg-inherit text-gray-dark border border-gray-dark',
      'hover:shadow-md hover:bg-gray-dark hover:text-gray-light',
      'focus:shadow-md focus:bg-gray-dark focus:text-gray-light',
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
      'focus:shadow-md focus:bg-olive-dark',
      className,
    ]
      .filter(Boolean)
      .join(' ')}
  />
));
ButtonOlive.displayName = 'memo(ButtonOlive)';

export const ButtonOliveNeutral: React.FC<ButtonBaseProps> = memo(({ className, ...props }) => (
  <ButtonBase
    {...props}
    className={[
      'bg-inherit text-olive-darker border border-olive-darker',
      'hover:shadow-md hover:bg-olive-dark hover:text-gray-lighter',
      'focus:shadow-md focus:bg-olive-dark focus:text-gray-lighter',
      className,
    ]
      .filter(Boolean)
      .join(' ')}
  />
));
ButtonOliveNeutral.displayName = 'memo(ButtonOliveNeutral)';

export const ButtonOliveInverted: React.FC<ButtonBaseProps> = memo(({ className, ...props }) => (
  <ButtonBase
    {...props}
    className={[
      'bg-gray-white text-olive-darker',
      'hover:shadow-md hover:bg-olive-light',
      'focus:shadow-md focus:bg-olive-light',
      className,
    ]
      .filter(Boolean)
      .join(' ')}
  />
));
ButtonOliveInverted.displayName = 'memo(ButtonOliveInverted)';

export const ButtonTransparent: React.FC<ButtonBaseProps> = memo(({ className, ...props }) => (
  <ButtonBase
    {...props}
    className={[
      'bg-inherit text-gray-white underline-under',
      'hover:underline',
      'focus:underline',
      className,
    ]
      .filter(Boolean)
      .join(' ')}
  />
));
ButtonTransparent.displayName = 'memo(ButtonTransparent)';

export const ButtonPink: React.FC<ButtonBaseProps> = memo(({ className, ...props }) => (
  <ButtonBase
    {...props}
    className={[
      'bg-pink-darker text-gray-white',
      'hover:shadow-md hover:bg-pink-dark',
      'focus:shadow-md focus:bg-pink-dark',
      className,
    ]
      .filter(Boolean)
      .join(' ')}
  />
));
ButtonPink.displayName = 'memo(ButtonPink)';
