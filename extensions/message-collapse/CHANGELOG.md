# Changelog

All notable changes to the Message Collapser extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.1.0] - 2026-03-21

### Code Quality Improvements
- **Refactored** settings HTML template to use CSS classes instead of inline styles
- **Added** JSDoc comments to all major functions
- **Extracted** magic numbers into named constants (delays, durations, ranges)
- **Improved** error handling with detailed logging throughout

### Bug Fixes
- **Fixed** CSS gradient overlay positioning by adding `position: relative` to preview container
- **Fixed** character counting to use trimmed text content for accuracy
- **Fixed** settings validation to auto-correct out-of-range values

### New Features
- **Added** setting validation with user-friendly error messages
- **Added** CSS custom properties (variables) for easier theming customization
- **Added** ARIA attributes for accessibility (`aria-expanded`)
- **Added** smooth scroll-to-view when collapsing messages
- **Added** status message types (success, error, info) with colors

### Accessibility
- **Added** `prefers-reduced-motion` media query support
- **Added** `prefers-contrast: high` media query support
- **Added** focus-visible states for keyboard navigation
- **Added** print styles (collapse button hidden when printing)

### Styling Improvements
- **Merged** settings styles into `style.css` for single CSS file compatibility
- **Added** CSS variables for consistent theming
- **Improved** dark theme support with proper color contrasts
- **Enhanced** mobile responsive design for settings panel

### Documentation
- **Created** comprehensive README.md with installation and testing guides
- **Created** CHANGELOG.md with detailed version history
- **Updated** code comments and function documentation

---

## [1.0.9] - 2026-03-21

### Fixed
- Settings persistence - settings now correctly load after page refresh
- Input field character color changed to dark (#333) for visibility

### Improved
- `getSettings()` function now properly merges stored and default values
- `saveSettingsSync()` explicitly updates `extension_settings`

---

## [1.0.8] - 2026-03-21

### Fixed
- HTML template embedded in JS, resolved 404 path issues

### Improved
- Removed external HTML loading functions, simplified code
- Passed full self-check (syntax, paths, functionality, security)

---

## [1.0.7] - 2026-03-21

### Fixed
- Third-party extension path correction
- Removed dynamic import, switched to static import

---

## [1.0.6] - 2026-03-21

### Fixed
- Dynamic import causing [object Event] error

---

## [1.0.5] - 2026-03-21

### Added
- Static imports compliant with official SillyTavern specifications
- `auto_update` field in manifest

---

## [1.0.4] - 2026-03-21

### Changed
- HTML template separated into independent file

---

## [1.0.0] to [1.0.3] - 2026-03-20 to 2026-03-21

### Added
- Initial release with basic collapse functionality
- Configurable threshold and preview lines
- Theme-aware styling
- Settings panel UI

---

## Version History Summary

| Version | Date | Key Changes |
|---------|------|-------------|
| 1.1.0 | 2026-03-21 | Code quality, accessibility, validation |
| 1.0.9 | 2026-03-21 | Settings persistence fix |
| 1.0.8 | 2026-03-21 | HTML embedding |
| 1.0.7 | 2026-03-21 | Path fixes |
| 1.0.6 | 2026-03-21 | Import error fix |
| 1.0.5 | 2026-03-21 | Spec compliance |
| 1.0.4 | 2026-03-21 | Template separation |
| 1.0.0-1.0.3 | 2026-03-20/21 | Initial development |
