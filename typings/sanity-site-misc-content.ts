import { SanityPersonFull, SanityAccessibleImage } from '.';

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
  recipeDescriptionSectionTitle: string;
  recipeInformationSectionTitle: string;
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
  subscribeFormTitle: string;
  subscribeFormNameInputLabel: string;
  subscribeFormEmailInputLabel: string;
  subscribeFormSubmitButtonLabel: string;
  subscribeFormSubmitButtonLabelSubmitting: string;
  subscribeFormMessageDisabled: string;
  subscribeFormMessageSuccess: string;
  subscribeFormMessageError: string;
  subscribeModalTitle: string;
  subscribeModalDescription: string;
  subscribeModalImage: SanityAccessibleImage;
  subscribeModalCTAButton: string;
};
