import { joinUrl } from './utils';
import { StructuredData, SanityPersonFull, SanityBlogPostFull } from '../typings';

import siteMiscContentData from '../data/siteMiscContent.json';

const canonicalUrl = process.env.CANONICAL_URL || '';

export const GRAPH_IDS = {
  AUTHOR: '#author',
  FOUNDER: '#founder',
  ORGANISATION: '#organisation',
  WEBSITE: '#website',
  WEBPAGE: '#webpage',
};

type PersonData = {
  person: SanityPersonFull;
  role: string;
};
function generatePersonStructuredData({ person, role }: PersonData): StructuredData {
  const { name, email, urls, bio, country } = person;
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': role,
    name,
    email,
    sameAs: urls.map((url) => url),
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

export const ORGANISATION_FOUNDER_STRUCTURED_DATA: StructuredData = generatePersonStructuredData({
  person: siteMiscContentData.organisationAuthor,
  role: GRAPH_IDS.FOUNDER,
});

export const ORGANISATION_STRUCTURED_DATA: StructuredData = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': GRAPH_IDS.ORGANISATION,
  url: canonicalUrl,
  sameAs: siteMiscContentData.socialLinks.map(({ url }) => url),
  logo: {
    url: joinUrl(canonicalUrl, 'android-chrome-512x512.png'),
    ['@type']: 'ImageObject',
    width: '512',
    height: '512',
  },
  name: siteMiscContentData.siteName,
  email: siteMiscContentData.organisationEmail,
  founder: {
    '@id': GRAPH_IDS.FOUNDER,
  },
};

export const WEBSITE_STRUCTURED_DATA: StructuredData = {
  '@type': 'WebSite',
  '@context': 'https://schema.org',
  '@id': GRAPH_IDS.WEBSITE,
  url: canonicalUrl,
  name: siteMiscContentData.siteName,
  publisher: {
    '@id': GRAPH_IDS.ORGANISATION,
  },
};

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
  const toReturnBase = {
    '@type': 'WebPage',
    '@context': 'https://schema.org',
    '@id': GRAPH_IDS.WEBPAGE,
    url: joinUrl(canonicalUrl, path),
    name: title,
    isPartOf: {
      '@id': GRAPH_IDS.WEBSITE,
    },
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

function generateArticleAuthorStructuredData(person: SanityPersonFull): StructuredData {
  return generatePersonStructuredData({
    person,
    role: GRAPH_IDS.AUTHOR,
  });
}

type ArticleData = {
  blogPostData: SanityBlogPostFull;
  path: string;
};
export function generateArticleStructuredData({
  blogPostData,
  path,
}: ArticleData): StructuredData[] {
  return [
    generateArticleAuthorStructuredData(blogPostData.author),
    {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: blogPostData.title,
      alternativeHeadline: blogPostData.excerpt,
      url: joinUrl(canonicalUrl, path),
      inLanguage: 'en',
      // IMAGE TODO:
      // - resize / reformat
      // - add size info
      // - prepare more than one with different ratios
      image: blogPostData.seoImage,
      datePublished: blogPostData.datePublished,
      dateModified: blogPostData._updatedAt.split('T')[0],
      articleSection: blogPostData.category.name,
      keywords: blogPostData.tags.map(({ name }) => name).join(', '),
      author: {
        '@id': GRAPH_IDS.AUTHOR,
      },
      publisher: {
        '@id': GRAPH_IDS.ORGANISATION,
      },
      mainEntityOfPage: {
        '@id': GRAPH_IDS.WEBPAGE,
      },
    },
  ];
}
