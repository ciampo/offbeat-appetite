/* eslint-disable @typescript-eslint/no-var-requires */

const siteMiscContentQuery = /* groq */ `*[_type == "siteMiscContent"] {
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
};
