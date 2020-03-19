import React from 'react';
import Head from 'next/head';

import { joinUrl } from '../scripts/utils';
import {
  ORGANISATION_FOUNDER_STRUCTURED_DATA,
  ORGANISATION_STRUCTURED_DATA,
  WEBSITE_STRUCTURED_DATA,
} from '../scripts/structured-data';

import { StructuredData } from '../typings';

interface PageMetaProps {
  title: string;
  description: string;
  path: string;
  previewImage?: string;
  structuredData?: StructuredData[];
}

const PageMeta: React.FC<PageMetaProps> = ({
  title,
  description,
  path,
  previewImage,
  structuredData,
}) => (
  <Head>
    <meta name="viewport" content="width=device-width,initial-scale=1" key="viewport" />

    <title key="page-title">{title}</title>
    <meta key="page-description" name="description" content={description} />

    {/* og:tags */}
    <meta key="page-og-title" property="og:title" content={title} />
    <meta key="page-og-description" property="og:description" content={description} />
    {previewImage && (
      <meta key="page-og-image" property="og:image" content={`https:${previewImage}`} />
    )}
    {process.env.CANONICAL_URL && (
      <meta
        key="page-og-url"
        property="og:url"
        content={joinUrl(process.env.CANONICAL_URL, path)}
      />
    )}

    {/* Twitter card */}
    <meta name="twitter:title" content={title} />
    <meta name="twitter:description" content={description} />
    {previewImage && (
      <meta key="page-twitter-image" name="twitter:image" content={`https:${previewImage}`} />
    )}

    {/* Structured data */}
    {structuredData && (
      <script
        type="application/ld+json"
        key="structured-data"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@graph': [
              ORGANISATION_FOUNDER_STRUCTURED_DATA,
              ORGANISATION_STRUCTURED_DATA,
              WEBSITE_STRUCTURED_DATA,
              ...structuredData,
            ],
          }),
        }}
      />
    )}
  </Head>
);

export default PageMeta;
