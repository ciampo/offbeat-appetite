import React from 'react';

// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import BlockContent from '@sanity/block-content-to-react';

import { SanityBlock } from '../../typings';

type GenericPortableTextProps = {
  blocks: SanityBlock[];
  serializers: object;
};
const GenericPortableText: React.FC<GenericPortableTextProps> = ({ blocks, serializers }) => (
  <BlockContent
    className="portable-text-blocks"
    renderContainerOnSingleChild={true}
    serializers={serializers}
    blocks={blocks}
  />
);

export default GenericPortableText;
