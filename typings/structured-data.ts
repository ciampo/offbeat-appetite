export type StructuredData = {
  ['@context']: string;
  ['@type']: string;
  [key: string]: string | object | StructuredData;
};
