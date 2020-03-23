import React from 'react';

import styles from './portable-text.module.css';

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
    className={`${styles.portableText} leading-relaxed text-base font-thin lg:text-lg`}
    renderContainerOnSingleChild={true}
    serializers={serializers}
    blocks={blocks}
  />
);

export default GenericPortableText;
