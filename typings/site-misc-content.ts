import { SanityPersonFull } from '.';

export type SanitySocialLink = {
  _key: string;
  url: string;
  label: string;
};

export type SanitySiteMiscContent = {
  _id: string;
  authorLabel: string;
  recipeCookTimeLabel: string;
  recipeIngredientsSectionTitle: string;
  recipeMethodSectionTitle: string;
  recipePrepTimeLabel: string;
  recipeTimeUnitLabel: string;
  recipeServingsLabel: string;
  siteName: string;
  organisationEmail: string;
  organisationAuthor: SanityPersonFull;
  socialLinks: SanitySocialLink[];
  socialShareLabel: string;
  subscribeEmailLabel: string;
  subscribeNameLabel: string;
  subscribeSubmitLabel: string;
};
