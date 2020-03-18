import { joinUrl } from './utils';
import { StructuredData, SanityPersonFull } from '../typings';

import siteMiscContentData from '../data/siteMiscContent.json';

function generatePersonStructuredData({
  name,
  email,
  homepage,
  bio,
  country,
}: SanityPersonFull): StructuredData {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name,
    email,
    sameAs: homepage,
    description: bio,
    nationality: {
      '@type': 'Country',
      address: {
        '@type': 'PostalAddress',
        addressCountry: country,
      },
    },
  };
}

type OrganisationData = {
  canonicalUrl: string;
  name: string;
  email: string;
  founder: SanityPersonFull;
};
function generateOrganisationStructuredData({
  canonicalUrl,
  name,
  email,
  founder,
}: OrganisationData): StructuredData {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    url: canonicalUrl,
    logo: {
      url: joinUrl(canonicalUrl, 'android-chrome-512x512.png'),
      ['@type']: 'ImageObject',
      width: '512',
      height: '512',
    },
    name,
    email,
    founder: generatePersonStructuredData(founder),
  };
}

type WebsiteData = {
  name: string;
  canonicalUrl: string;
  organisation: OrganisationData;
};
function generateWebsiteStructuredData({
  organisation,
  canonicalUrl,
  name,
}: WebsiteData): StructuredData {
  return {
    '@type': 'WebSite',
    '@context': 'https://schema.org',
    url: canonicalUrl,
    name,
    publisher: generateOrganisationStructuredData(organisation),
  };
}

type BreadcrumbPage = {
  title: string;
  path: string;
};
type WebpageData = {
  path: string;
  title: string;
  description: string;
  breadcrumbPages: BreadcrumbPage[];
};

export function generateWebpageStructuredData({
  path,
  title,
  description,
  breadcrumbPages,
}: WebpageData): StructuredData {
  const canonicalUrl = process.env.CANONICAL_URL || '';

  const toReturnBase = {
    '@type': 'WebPage',
    '@context': 'https://schema.org',
    url: joinUrl(canonicalUrl, path),
    name: title,
    isPartOf: generateWebsiteStructuredData({
      canonicalUrl,
      name: siteMiscContentData.siteName,
      organisation: {
        canonicalUrl,
        email: siteMiscContentData.organisationEmail,
        name: siteMiscContentData.siteName,
        founder: siteMiscContentData.organisationAuthor,
      },
    }),
    inLanguage: 'en',
    description,
  };

  if (breadcrumbPages.length) {
    return {
      ...toReturnBase,
      breadcrumb: {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: breadcrumbPages.map(({ title, path }, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: title,
          item: joinUrl(canonicalUrl, path),
        })),
      },
    };
  }

  return toReturnBase;
}
