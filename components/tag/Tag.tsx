import React, { memo } from 'react';

type TagProps = {
  className?: string;
};

const Tag: React.FC<TagProps> = memo(({ children, className }) => (
  <span
    className={[
      'inline-flex items-center px-1 py-1 xl:px-3 xl:py-2',
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
