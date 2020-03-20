import React from 'react';

import GenericPortableText from './GenericPortableText';
import { richSerializers } from './serializers';

import { SanityRichPortableText } from '../../typings';

type RichPortableTextProps = {
  blocks: SanityRichPortableText;
};
const RichPortableText: React.FC<RichPortableTextProps> = ({ blocks }) => (
  <GenericPortableText serializers={richSerializers} blocks={blocks} />
);

export default RichPortableText;
