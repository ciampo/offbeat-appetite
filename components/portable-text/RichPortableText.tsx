import React from 'react';

import GenericPortableText from './GenericPortableText';
import { richSerializers } from './serializers';

import { SanityRichPortableText } from '../../typings';

type RichPortableTextProps = {
  blocks: SanityRichPortableText;
  customSerializers?: object;
};
const RichPortableText: React.FC<RichPortableTextProps> = ({ blocks, customSerializers }) => (
  <GenericPortableText serializers={{ ...richSerializers, ...customSerializers }} blocks={blocks} />
);

export default RichPortableText;
