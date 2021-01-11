import * as React from 'react';

type DefaultButtonContainerProps = {
  disabled?: boolean;
  className?: string;
  typeClassName?: string;
  paddingClassName?: string;
  sizeClassName?: string;
  additionalHover?: 'underline' | 'scaleUp';
  shadow?: boolean;
  disableTransitions?: boolean;
  onClick?: (event: React.MouseEvent) => void;
  [key: string]: unknown;
};
const DefaultButtonContainer: React.FC<DefaultButtonContainerProps> = React.forwardRef<
  HTMLButtonElement | null,
  DefaultButtonContainerProps
>((props, forwardedRef) => <button {...props} ref={forwardedRef}></button>);
DefaultButtonContainer.displayName = 'forwardRef(DefaultButtonContainer)';

type ButtonBaseProps = DefaultButtonContainerProps & {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component?: React.FC<any>;
};

type ButtonBasePropsWithBorder = ButtonBaseProps & {
  border?: boolean;
};

const ButtonBase: React.FC<ButtonBaseProps> = React.forwardRef(
  (
    {
      className,
      typeClassName = 'type-heading-2',
      paddingClassName = 'px-4 xl:h-12 xl:px-6',
      sizeClassName = 'h-10',
      additionalHover,
      shadow = false,
      disableTransitions = false,
      component: Component = DefaultButtonContainer,
      ...props
    },
    forwardedRef
  ) => (
    <Component
      {...props}
      className={[
        'flex items-center rounded underline-under contain-l-p',
        'disabled:cursor-not-allowed disabled:bg-gray-medium disabled:text-gray-dark disabled:opacity-50 disabled:shadow-none focus:outline-none',
        !disableTransitions && 'transition-bg-color-transform duration-200 ease-out',
        additionalHover === 'underline' && 'hover:underline',
        additionalHover === 'scaleUp' && 'hover:will-change-transform transform hover:scale-105',
        shadow && 'hover:shadow-md focus:shadow-md',
        paddingClassName,
        sizeClassName,
        typeClassName,
        className,
      ].join(' ')}
      ref={forwardedRef}
    />
  )
);
ButtonBase.displayName = 'forwardRef(ButtonBase)';

export const ButtonOlive: React.FC<ButtonBaseProps> = React.forwardRef(
  ({ className, ...props }, forwardedRef) => (
    <ButtonBase
      {...props}
      className={[
        'bg-olive-darker text-gray-white border border-olive-darker',
        'hover:bg-olive-dark',
        'focus:bg-olive-dark',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      ref={forwardedRef}
    />
  )
);
ButtonOlive.displayName = 'forwardRef(ButtonOlive)';

export const ButtonTransparent: React.FC<ButtonBaseProps> = React.forwardRef(
  ({ className, ...props }, forwardedRef) => (
    <ButtonBase
      {...props}
      className={[
        'bg-gray-white bg-opacity-0 text-gray-white border border-transparent',
        'hover:bg-opacity-15',
        'focus:bg-opacity-15',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      ref={forwardedRef}
    />
  )
);
ButtonTransparent.displayName = 'forwardRef(ButtonTransparent)';

export const ButtonOliveInverted: React.FC<ButtonBasePropsWithBorder> = React.forwardRef(
  ({ border = false, className, ...props }, forwardedRef) => (
    <ButtonBase
      {...props}
      className={[
        // Default
        'bg-inherit text-olive-darker',
        border && 'border border-olive-darker',
        // Hover
        border ? 'hover:bg-olive-darker hover:text-gray-white' : 'hover:bg-olive-light',
        // Focus
        border ? 'focus:bg-olive-darker focus:text-gray-white' : 'focus:bg-olive-light',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      ref={forwardedRef}
    />
  )
);
ButtonOliveInverted.displayName = 'forwardRef(ButtonOliveInverted);';

export const ButtonPink: React.FC<ButtonBaseProps> = React.forwardRef(
  ({ className, ...props }, forwardedRef) => (
    <ButtonBase
      {...props}
      className={[
        'bg-pink-darker text-gray-white border border-pink-darker',
        'hover:bg-pink-dark',
        'focus:bg-pink-dark',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      ref={forwardedRef}
    />
  )
);
ButtonPink.displayName = 'forwardRef(ButtonPink)';

export const ButtonSharing: React.FC<ButtonBaseProps> = React.forwardRef(
  ({ className, ...props }, forwardedRef) => (
    <ButtonBase
      {...props}
      className={[
        'bg-transparent text-gray-dark',
        'hover:text-gray-white',
        'focus:text-gray-white',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      ref={forwardedRef}
    />
  )
);
ButtonSharing.displayName = 'forwardRef(ButtonSharing)';
