/* eslint-disable @typescript-eslint/no-var-requires */

const { personFullProjection } = require('./projections');

const siteMiscContentType = 'siteMiscContent';
const siteMiscContentQuery = /* groq */ `*[_type == "${siteMiscContentType}"] {
  _id,
  authorLabel,
  recipeCookTimeLabel,
  recipeIngredientsSectionTitle,
  recipeMethodSectionTitle,
  recipePrepTimeLabel,
  recipeTimeUnitLabel,
  recipeServingsLabel,
  siteName,
  organisationEmail,
  organisationAuthor->${personFullProjection},
  socialLinksLabel,
  socialShareLabel,
  subscribeEmailLabel,
  subscribeNameLabel,
  subscribeSubmitLabel,
}`;

module.exports = {
  siteMiscContentQuery,
  siteMiscContentType,
};
