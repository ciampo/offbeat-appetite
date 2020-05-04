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
    className="oba-portable-text space-y-8 xl:space-y-16"
    renderContainerOnSingleChild={true}
    serializers={serializers}
    blocks={blocks}
  />
);

export default GenericPortableText;
