import React, { memo } from 'react';

type DefaultContainerElementProps = {
  className: string;
};
const DefaultContainerElement: React.FC<DefaultContainerElementProps> = (props) => (
  <div {...props}></div>
);

type ContainerProps = {
  component?: (props: { [key: string]: unknown }) => JSX.Element;
  shadowVariant?: 'light' | 'lighter';
  className?: string;
  [key: string]: unknown;
};

const Card: React.FC<ContainerProps> = memo(
  ({
    component: Component = DefaultContainerElement,
    shadowVariant = 'light',
    className,
    ...props
  }) => (
    <Component
      {...props}
      className={[
        'bg-inherit rounded-md',
        shadowVariant === 'light' ? 'shadow-neu-light' : 'shadow-neu-lighter',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      data-testid="card-container"
    />
  )
);
Card.displayName = 'memo(Card)';

export default Card;
