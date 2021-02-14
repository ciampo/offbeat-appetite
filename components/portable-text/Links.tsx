import * as React from 'react';
import Link from 'next/link';

import { SanityInternalLink } from '../../typings';

// const linkClassName = 'border-b border-dashed border-gray-darker outline-none focus:border-solid';
const linkClassName =
  'underline underline-dashed underline-thickness-1 underline-offset-2em outline-none hover:underline-solid focus:underline-solid focus:underline-thickness-2';

type InternalLinkProps = {
  internalLink?: SanityInternalLink;
  className?: string;
};
export const InternalLink: React.FC<InternalLinkProps> = ({ children, internalLink, className }) =>
  internalLink?.routeInfo ? (
    <Link href={internalLink.routeInfo.page} as={internalLink.routeInfo.path}>
      <a className={[linkClassName, className].filter(Boolean).join(' ')}>{children}</a>
    </Link>
  ) : (
    <span>{children}</span>
  );

type ExternalLinkProps = {
  href: string;
  rel?: string;
  target?: string;
  className?: string;
};
export const ExternalLink: React.FC<ExternalLinkProps> = ({ className, ...props }) => (
  <a {...props} className={[linkClassName, className].filter(Boolean).join(' ')} />
);
