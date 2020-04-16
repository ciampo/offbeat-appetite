import React from 'react';

// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import BlockContent from '@sanity/block-content-to-react';

import { SanityBlock, SanityRichPortableText } from '../../typings';

type GenericPortableTextProps = {
  blocks: SanityBlock[] | SanityRichPortableText;
  serializers: object;
};
const GenericPortableText: React.FC<GenericPortableTextProps> = ({ blocks, serializers }) => (
  <BlockContent
    className="generic-portable-text"
    renderContainerOnSingleChild={true}
    serializers={serializers}
    blocks={blocks}
  />
);

export default GenericPortableText;
