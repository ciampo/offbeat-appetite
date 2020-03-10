/* eslint-disable @typescript-eslint/no-var-requires */

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
