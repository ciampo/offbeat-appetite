import React from 'react';

// @ts-ignore
import BlockContent from '@sanity/block-content-to-react';

import { SanityBlock, SanityRichPortableText } from '../../typings';

type GenericPortableTextProps = {
  blocks: SanityBlock[] | SanityRichPortableText;
  serializers: Record<string, unknown>;
};
const GenericPortableText: React.FC<GenericPortableTextProps> = ({ blocks, serializers }) => (
  <BlockContent
    className="portable-text"
    renderContainerOnSingleChild={true}
    serializers={serializers}
    blocks={blocks}
  />
);

export default GenericPortableText;
