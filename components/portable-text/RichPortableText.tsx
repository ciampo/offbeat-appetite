import React from 'react';

import GenericPortableText from './GenericPortableText';
import { richSerializers } from './serializers';

import { SanityBlock } from '../../typings';

type RichPortableTextProps = {
  blocks: SanityBlock[];
};
const RichPortableText: React.FC<RichPortableTextProps> = ({ blocks }) => (
  <GenericPortableText serializers={richSerializers} blocks={blocks} />
);

export default RichPortableText;
