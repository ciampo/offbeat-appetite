export type StructuredData = {
  ['@context']?: string;
  ['@type']?: string;
  [key: string]: unknown | StructuredData;
};
