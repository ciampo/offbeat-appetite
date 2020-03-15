import React from 'react';

import GenericPortableText from './GenericPortableText';
import { simpleSerializers } from './serializers';

import { SanityBlock } from '../../typings';

type SimplePortableTextProps = {
  blocks: SanityBlock[];
};
const SimplePortableText: React.FC<SimplePortableTextProps> = ({ blocks }) => (
  <GenericPortableText serializers={simpleSerializers} blocks={blocks} />
);

export default SimplePortableText;
