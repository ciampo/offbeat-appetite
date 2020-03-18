import { SanityPersonFull } from '.';

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
  socialLinksLabel: string;
  socialShareLabel: string;
  subscribeEmailLabel: string;
  subscribeNameLabel: string;
  subscribeSubmitLabel: string;
};
