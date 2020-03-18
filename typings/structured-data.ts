export type StructuredData = {
  ['@context']: string;
  ['@type']: string;
  [key: string]: string | object | StructuredData;
};

// export type ContentfulAuthorStructuredDataTemplate = {
//   ['@context']: string;
//   ['@type']: string;
//   name: string;
//   email: string;
//   sameAs: string;
//   description: string;
//   nationality: {
//     ['@type']: string;
//     address: {
//       ['@type']: string;
//       addressCountry: string;
//     };
//   };
// };

// export type ContentfulOrganisationStructuredDataTemplate = {
//   ['@context']: string;
//   ['@type']: string;
//   name: string;
//   url: string;
//   email: string;
//   founder: string;
//   logo: {
//     ['@type']: string;
//     url: string;
//     width: number;
//     height: number;
//   };
// };

// export type ContentfulWebsiteStructuredDataTemplate = {
//   ['@context']: string;
//   ['@type']: string;
//   url: string;
//   name: string;
//   publisher: string;
// };

// export type ContentfulWebpageStructuredDataTemplate = {
//   ['@context']: string;
//   ['@type']: string;
//   url: string;
//   name: string;
//   isPartOf: string;
//   inLanguage: string;
//   description: string;
// };

// export type ContentfulArticleStructuredDataTemplate = {
//   ['@context']: string;
//   ['@type']: string;
//   image: string;
//   author: string;
//   headline: string;
//   publisher: string;
//   dateModified: string;
//   datePublished: string;
// };

// export type ContentfulStructuredData = {
//   author: ContentfulAuthorStructuredDataTemplate;
//   organisation: ContentfulOrganisationStructuredDataTemplate;
//   website: ContentfulWebsiteStructuredDataTemplate;
//   webpage: ContentfulWebpageStructuredDataTemplate;
//   article: ContentfulArticleStructuredDataTemplate;
// };

export const placeholder = '';
