import React, { memo } from 'react';

type TagProps = {};

const Tag: React.FC<TagProps> = memo(({ children }) => (
  <span className="inline-flex items-center px-2 h-6 xl:px-3 xl:h-7 type-tag text-gray-dark border rounded border-gray-dark">
    {children}
  </span>
));
Tag.displayName = 'memo(Tag)';

export default Tag;
