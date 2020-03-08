/* eslint-disable @typescript-eslint/no-var-requires */

const siteMiscContentType = 'siteMiscContent';
const siteMiscContentQuery = /* groq */ `*[_type == "${siteMiscContentType}"] {
  _id,
  authorLabel,
  recipeBlockTitle,
  recipeCookTimeLabel,
  recipeIngredientsSectionTitle,
  recipeMethodSectionTitle,
  recipePrepTimeLabel,
  recipeTimeUnitLabel,
  siteName,
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
