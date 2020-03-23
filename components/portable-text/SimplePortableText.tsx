import React from 'react';

import GenericPortableText from './GenericPortableText';
import { simpleSerializers } from './serializers';

import { SanityBlock } from '../../typings';

type SimplePortableTextProps = {
  blocks: SanityBlock[];
  customSerializers?: object;
};
const SimplePortableText: React.FC<SimplePortableTextProps> = ({
  blocks,
  customSerializers = {},
}) => (
  <GenericPortableText
    serializers={{ ...simpleSerializers, ...customSerializers }}
    blocks={blocks}
  />
);

export default SimplePortableText;
