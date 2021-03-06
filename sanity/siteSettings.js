/* eslint-disable @typescript-eslint/no-var-requires */

const siteSettingsType = 'siteSettings';
const siteSettingsQuery = /* groq */ `*[_type == "${siteSettingsType}"] {
  _id,
  "categoriesOrder": categoriesOrder[]->slug.current,
	"noIndexPages": noIndexPages[]->_type
}`;

module.exports = {
  siteSettingsType,
  siteSettingsQuery,
};
