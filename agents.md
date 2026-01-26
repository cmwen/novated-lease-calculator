# Agents Documentation

This document provides guidance for AI agents working on the Novated Lease Calculator project.

## Project Overview

The Novated Lease Calculator is a Progressive Web App (PWA) designed to educate Australian users about novated leases and provide a basic calculator for estimating costs and savings.

## Architecture

### Technology Stack
- **Frontend Framework**: React 19 with TypeScript
- **Build Tool**: Vite 7
- **PWA Plugin**: vite-plugin-pwa with Workbox
- **Styling**: CSS with CSS Variables for theming
- **Deployment**: GitHub Pages via GitHub Actions

### Project Structure

```
/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions deployment workflow
├── public/
│   ├── pwa-192x192.svg        # PWA icon (192x192)
│   ├── pwa-512x512.svg        # PWA icon (512x512)
│   └── vite.svg               # Vite logo
├── src/
│   ├── components/
│   │   ├── Calculator.tsx     # Interactive calculator component
│   │   ├── Calculator.css
│   │   ├── Disclaimer.tsx     # Prominent disclaimer section
│   │   ├── Disclaimer.css
│   │   ├── InfoSection.tsx    # Educational content about novated leases
│   │   ├── InfoSection.css
│   │   ├── KeyLinks.tsx       # Links to official resources
│   │   ├── KeyLinks.css
│   │   ├── ThemeToggle.tsx    # Dark/light theme toggle
│   │   └── ThemeToggle.css
│   ├── App.tsx                # Main application component
│   ├── App.css
│   ├── index.css              # Global styles with theme variables
│   └── main.tsx               # Application entry point
├── index.html                 # HTML entry point
├── vite.config.ts            # Vite configuration with PWA settings
├── package.json              # Dependencies and scripts
├── README.md                 # User-facing documentation
└── agents.md                 # This file - agent documentation
```

## Key Features Implementation

### 1. PWA Support
- Configured in `vite.config.ts` using `vite-plugin-pwa`
- Service worker for offline support
- Manifest for installability
- Icons in SVG format for flexibility

### 2. Theme System
- CSS Variables in `src/index.css` define theme colors
- `[data-theme="dark"]` selector for dark mode
- Theme state managed in `App.tsx`
- User preference saved to localStorage
- Automatic detection of system preference

### 3. Calculator
- Located in `src/components/Calculator.tsx`
- Simplified calculations for educational purposes
- Estimates tax savings based on marginal tax rates
- Calculates annual and fortnightly costs
- All values formatted as Australian currency

### 4. Disclaimer
- Prominent placement at top of content
- Warning styling with red border and background
- Clear language about limitations
- Multiple bullet points for clarity

### 5. Educational Content
- `InfoSection.tsx` covers all aspects of novated leases
- Card-based layout for easy scanning
- Topics: basics, benefits, considerations, FBT, ideal users

### 6. Resource Links
- `KeyLinks.tsx` provides links to official Australian sites
- External links open in new tabs
- Hover effects for better UX
- Icons for visual appeal

## Development Guidelines

### Code Style
- TypeScript for type safety
- Functional React components with hooks
- CSS Modules pattern (separate CSS file per component)
- Descriptive variable and function names
- Comments for complex calculations

### Testing Locally
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Check code quality
```

### Building
The build process:
1. TypeScript compilation
2. Vite bundling and optimization
3. PWA manifest and service worker generation
4. Output to `dist/` directory

### Deployment
- Automatic via GitHub Actions on push to `main`
- Manual trigger available in Actions tab
- Base path configured as `/novated-lease-calculator/`
- Deployed to GitHub Pages

## Important Considerations

### Base Path
The application is deployed to a subpath on GitHub Pages. The base path is configured in `vite.config.ts`:
```typescript
base: '/novated-lease-calculator/'
```

This affects:
- Asset loading
- Routing (if added)
- Service worker scope

### Disclaimers
The application must always clearly indicate:
- It's for educational purposes only
- Not financial advice
- Calculations are simplified estimates
- Users should consult professionals

### Australian Context
All information is specific to Australia:
- Tax rates based on Australian tax brackets
- Links to Australian government websites
- Currency formatted as AUD
- Terminology specific to Australian novated leases

## Common Modifications

### Updating Calculator Logic
File: `src/components/Calculator.tsx`
- Update `calculateResults()` function
- Ensure calculations match latest tax rates
- Add comments explaining assumptions

### Adding New Features
1. Create component in `src/components/`
2. Create corresponding CSS file
3. Import and use in `App.tsx`
4. Update this documentation

### Changing Theme Colors
File: `src/index.css`
- Update CSS variables in `:root` (light theme)
- Update CSS variables in `[data-theme="dark"]` (dark theme)
- Test both themes thoroughly

### Adding Resource Links
File: `src/components/KeyLinks.tsx`
- Add to `links` array
- Include title, description, URL, and icon
- Verify link is to official Australian source

## Testing Checklist

Before deploying changes:
- [ ] Test in both light and dark themes
- [ ] Test on mobile, tablet, and desktop viewports
- [ ] Verify calculator produces reasonable results
- [ ] Check all external links work
- [ ] Test PWA installability
- [ ] Verify offline functionality
- [ ] Run `npm run lint`
- [ ] Run `npm run build` successfully
- [ ] Preview build with `npm run preview`

## Future Enhancements

Potential features for future development:
- More sophisticated calculator with FBT options
- Comparison tool for multiple vehicles
- Printable summary of calculations
- Integration with real vehicle pricing APIs
- More detailed educational content
- FAQs section
- Vehicle type selector (EV, petrol, etc.)
- Multiple lease provider comparisons

## Support and Issues

For questions or issues:
1. Check existing GitHub issues
2. Review this documentation
3. Check README.md for user-facing info
4. Create new issue if needed

## Version History

- **v1.0.0** (2026-01): Initial release
  - Basic calculator
  - Educational content
  - PWA support
  - Theme switching
  - GitHub Pages deployment
