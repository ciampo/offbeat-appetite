/* eslint-disable @typescript-eslint/no-var-requires */

const siteSettingsQuery = /* groq */ `*[_type == "siteSettings"] {
  _id,
  canonicalUrl,
  "categoriesOrder": categoriesOrder[]->slug.current,
  "navItems": navItems[]{
  	label,
  	"page": page->_type
	},
	"noIndexPages": noIndexPages[]->_type
}`;

module.exports = {
  siteSettingsQuery,
};
