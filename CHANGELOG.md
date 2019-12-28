# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Changelog

<!--
## [X.Y.X] - YYYY-MM-DD

### Added

for new features.

### Changed

for changes in existing functionality.

### Deprecated

for soon-to-be removed features.

### Removed

for now removed features.

### Fixed

for any bug fixes.

### Security

in case of vulnerabilities.
-->

## [1.2.1] - 2019-12-28

### Removed

- Removed all PropTypes (see release [1.2.0])

### Fixed

- Allow contentful images and videos in img/media CSP rules
- eslintrc indentation

## [1.2.0] - 2019-12-28

### Added

- Structured Data snippets
- Twitter card meta tags

### Changed

- Update VSCode settings
- More robust, crossbrowser native video player
- Lazy images start the download of a new image earlier
- Social sharing image for each page, instead of a global one

### Removed

- Removed PropTypes eslint validation and any PropTypes in the project, as they are redundant with TypeScript

### Fixed

- Disable native scroll restoration
- Custom Rich Text Renderer, with list styles and asset links

## [1.1.0] - 2019-12-14

### Added

- tailwind utilities and shared configuration
- lazy loading image component
- rich contentful text
- nav items animation while page is loading

### Changed

- new `routes-config` configuration
- more advanced netlify headers
- more advanced contentful data loader, adds base64 thumbnail strings too
- more subtle page transitions

### Fixed

- page jump in between page transitions
- better typescript types / react proptypes compatibility

## [1.0.0] - 2019-11-17

### Added

- Next.js template project MVP

[Unreleased]: https://github.com/ciampo/_nextjs-template/compare/v1.2.1...HEAD
[1.2.1]: https://github.com/ciampo/_nextjs-template/compare/v1.2.0...v1.2.1
[1.2.0]: https://github.com/ciampo/_nextjs-template/compare/v1.1.0...v1.2.0
[1.1.0]: https://github.com/ciampo/_nextjs-template/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/ciampo/_nextjs-template/releases/tag/v1.0.0
