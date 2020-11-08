/* eslint-disable @typescript-eslint/no-var-requires */

const { personFullProjection, accessibleImageProjection } = require('./projections');

const siteMiscContentType = 'siteMiscContent';
const siteMiscContentQuery = /* groq */ `*[_type == "${siteMiscContentType}"] {
  _id,
  authorLabel,
  recipeCookTimeLabel,
  recipeDescriptionSectionTitle,
  recipeInformationSectionTitle,
  recipeIngredientsSectionTitle,
  recipeMethodSectionTitle,
  recipePrepTimeLabel,
  recipeTimeUnitLabel,
  recipeServingsLabel,
  siteName,
  organisationEmail,
  organisationEmailLabel,
  organisationAuthor->${personFullProjection},
  socialLinks[] {
    ...,
    "platform": platform[0],
  },
  socialShareLabel,
  subscribeFormTitle,
  subscribeFormNameInputLabel,
  subscribeFormEmailInputLabel,
  subscribeFormSubmitButtonLabel,
  subscribeFormSubmitButtonLabelSubmitting,
  subscribeFormMessageDisabled,
  subscribeFormMessageSuccess,
  subscribeFormMessageError,
  subscribeModalTitle,
  subscribeModalDescription,
  subscribeModalImage->${accessibleImageProjection},
  subscribeModalCTAButton,
}`;

module.exports = {
  siteMiscContentQuery,
  siteMiscContentType,
};
