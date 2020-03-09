/* eslint-disable @typescript-eslint/no-var-requires */

const siteSettingsType = 'siteSettings';
const siteSettingsQuery = /* groq */ `*[_type == "${siteSettingsType}"] {
  _id,
  "categoriesOrder": categoriesOrder[]->slug.current,
  "navItems": navItems[]{
  	label,
  	"page": page->_type
	},
	"noIndexPages": noIndexPages[]->_type
}`;

module.exports = {
  siteSettingsType,
  siteSettingsQuery,
};
