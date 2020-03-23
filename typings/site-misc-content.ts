import { SanityPersonFull } from '.';

export type SanitySocialPlatform = 'instagram' | 'facebook' | 'pinterest';

export type SanitySocialLink = {
  _key: string;
  url: string;
  label: string;
  platform: SanitySocialPlatform;
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
  organisationEmailLabel: string;
  organisationAuthor: SanityPersonFull;
  socialLinks: SanitySocialLink[];
  socialShareLabel: string;
  subscribeEmailLabel: string;
  subscribeNameLabel: string;
  subscribeSubmitLabel: string;
};
