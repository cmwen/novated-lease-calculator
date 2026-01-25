# Novated Lease Calculator

A comprehensive Progressive Web App (PWA) for learning about and calculating novated leases in Australia.

## 🚗 Features

- **Educational Content**: Complete guide to novated leases in Australia
- **Interactive Calculator**: Estimate potential tax savings and costs
- **Prominent Disclaimers**: Clear warnings about financial advice limitations
- **Key Resource Links**: Direct links to official Australian government resources
- **PWA Support**: Installable, works offline, fast loading
- **Theme Support**: Dark and light modes with automatic detection
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## 🌐 Live Demo

Visit the live application at: https://cmwen.github.io/novated-lease-calculator/

## 🛠️ Technology Stack

- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite 7
- **PWA**: vite-plugin-pwa with Workbox
- **Styling**: CSS with CSS Variables for theming
- **Deployment**: GitHub Pages via GitHub Actions

## 📦 Installation & Development

### Prerequisites

- Node.js 20 or higher
- npm

### Setup

```bash
# Clone the repository
git clone https://github.com/cmwen/novated-lease-calculator.git
cd novated-lease-calculator

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## 🚀 Deployment

The application automatically deploys to GitHub Pages when changes are pushed to the `main` branch.

### Manual Deployment

The GitHub Actions workflow `.github/workflows/deploy.yml` handles:
1. Building the application
2. Uploading artifacts
3. Deploying to GitHub Pages

To enable GitHub Pages:
1. Go to repository Settings > Pages
2. Set Source to "GitHub Actions"
3. Push to main branch or trigger workflow manually

## 📱 PWA Features

- **Installable**: Can be installed as a standalone app
- **Offline Support**: Service worker caches assets for offline use
- **Fast Loading**: Optimized assets and caching strategies
- **App-like Experience**: Standalone display mode
- **Theme Integration**: Respects system theme preferences

## 🎨 Theme Support

The application supports both light and dark themes:
- Automatic detection of system preference
- Manual toggle available in header
- Preference saved in localStorage
- Smooth transitions between themes

## 📊 Calculator Features

The calculator provides estimates for:
- Annual lease payments
- Running costs (fuel, maintenance, insurance)
- Estimated tax savings
- Net annual cost
- Fortnightly payment amounts

**Important**: The calculator provides simplified estimates for educational purposes only. Always consult with qualified professionals for actual calculations.

## ⚠️ Disclaimers

This application:
- Provides **educational information only**
- Does **not** constitute financial advice
- Uses **simplified calculations** for illustration
- Should **not** be the sole basis for financial decisions

Users should always:
- Consult qualified tax advisors
- Check with their employer
- Verify information with official sources
- Consider their individual circumstances

## 🔗 Key Resources

The app links to official Australian resources:
- Australian Taxation Office (ATO)
- Moneysmart (ASIC)
- Choice Consumer Advice
- Fair Work Ombudsman
- Green Vehicle Guide
- State registration services

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Contact

For questions or feedback, please open an issue on GitHub.

## 🙏 Acknowledgments

- Information sourced from official Australian government websites
- Built with modern web technologies
- Designed for Australian employees considering novated leases
