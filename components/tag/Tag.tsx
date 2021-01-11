import * as React from 'react';

type TagProps = {
  className?: string;
};

const Tag: React.FC<TagProps> = React.memo(({ children, className }) => (
  <span
    className={[
      'inline-flex items-center px-1 py-1 xl:px-2 xl:py-1half',
      'type-tag text-gray-dark border rounded border-gray-dark',
      className,
    ]
      .filter(Boolean)
      .join(' ')}
    data-testid="tag-container"
  >
    {children}
  </span>
));
Tag.displayName = 'memo(Tag)';

export default Tag;
