/* eslint-disable @typescript-eslint/no-var-requires */

const { personFullProjection } = require('./projections');

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
}`;

module.exports = {
  siteMiscContentQuery,
  siteMiscContentType,
};
