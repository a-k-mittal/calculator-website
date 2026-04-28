# Multi-Function Calculator

A fully responsive, offline-capable calculator website with a beautiful neumorphism design and nature-inspired color scheme.

## Features

### 🧮 Scientific Calculator
- Basic operations: +, −, ×, ÷
- Trigonometric functions: sin, cos, tan (in degrees)
- Powers and roots: √, x², xⁿ
- Factorial: n!
- Percentage: %
- Parentheses for complex expressions

### 📏 Length Converter
- Meter, Centimeter, Millimeter
- Kilometer, Mile
- Inch, Foot, Yard

### 💱 Currency Converter
- Real-time exchange rates via ExchangeRate-API
- Supports: USD, EUR, GBP, JPY, INR
- Offline fallback with cached/default rates
- Auto-refresh every hour

### ⚖️ Weight Converter
- Kilogram, Gram, Milligram

### 💰 Finance Calculators
- **Compound Interest**: Calculate growth with customizable compounding frequency
- **SIP Calculator**: Systematic Investment Plan returns with growth visualization
- **Lump Sum Calculator**: One-time investment projections
- **EMI Calculator**: Loan EMI with amortization schedule (yearly/monthly breakdown)
- Indian currency formatting (₹1,00,000)
- Interactive Chart.js visualizations
- Collapsible chart and amortization sections

## Design Features
- **Neumorphism UI** - Soft 3D raised/pressed elements
- **Nature-inspired colors** - Forest green and earth tones
- **Dark/Light theme toggle** - Respects system preference
- **Fully responsive** - Works on all device sizes
- **PWA support** - Install as an app, works offline

## Getting Started

### Option 1: Open Directly
Simply open `index.html` in a modern web browser.

### Option 2: Local Server (Recommended for PWA)
```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve

# Using PHP
php -S localhost:8000
```

Then visit `http://localhost:8000`

## Deployment to GitHub Pages

### Prerequisites
- A GitHub account ([Sign up free](https://github.com/signup))
- Git installed on your computer ([Download Git](https://git-scm.com/downloads))

### Step-by-Step Deployment Guide

#### Step 1: Create a GitHub Repository

1. Go to [github.com](https://github.com) and sign in
2. Click the **+** icon in the top-right corner → **New repository**
3. Configure your repository:
   - **Repository name**: `calculator-website` (or any name you prefer)
   - **Description**: "Multi-function calculator with scientific operations and unit converters"
   - **Visibility**: Public (required for free GitHub Pages)
   - ❌ Do NOT initialize with README (we already have one)
4. Click **Create repository**

#### Step 2: Initialize Git and Push Code

Open a terminal/command prompt in your project folder and run:

```bash
# Navigate to your project folder
cd C:\Users\mittaa8\Documents\calculator-website

# Initialize Git repository
git init

# Add all files to staging
git add .

# Create initial commit
git commit -m "Initial commit: Multi-function calculator"

# Add your GitHub repository as remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/calculator-website.git

# Push to GitHub
git branch -M main
git push -u origin main
```

#### Step 3: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** (tab at the top)
3. Scroll down to **Pages** in the left sidebar
4. Under **Source**, select:
   - **Branch**: `main`
   - **Folder**: `/ (root)`
5. Click **Save**

#### Step 4: Access Your Live Site

After a few minutes, your site will be live at:
```
https://YOUR_USERNAME.github.io/calculator-website/
```

You can find the exact URL in the **Pages** settings section.

### Updating Your Site

After making changes, push updates to GitHub:

```bash
git add .
git commit -m "Description of changes"
git push
```

GitHub Pages will automatically rebuild and deploy within 1-2 minutes.

### Custom Domain (Optional)

To use your own domain (e.g., `calculator.yourdomain.com`):

1. In repository **Settings → Pages**, enter your custom domain
2. Add these DNS records with your domain provider:
   - **A Record**: Point to `185.199.108.153`
   - **A Record**: Point to `185.199.109.153`
   - **A Record**: Point to `185.199.110.153`
   - **A Record**: Point to `185.199.111.153`
   - Or **CNAME**: Point to `YOUR_USERNAME.github.io`
3. Wait for DNS propagation (up to 24-48 hours)
4. Check "Enforce HTTPS" for security

### Troubleshooting

| Issue | Solution |
|-------|----------|
| 404 error | Ensure `index.html` is in the root folder |
| Site not updating | Clear browser cache or wait a few minutes |
| PWA not installing | Must be served over HTTPS (GitHub Pages does this automatically) |
| Currency API not working | Check browser console; API may be blocked by CORS on custom domains |

## PWA Icons

All required PNG icons are included in the `icons/` folder:
- icon-72.png, icon-96.png, icon-128.png, icon-144.png
- icon-152.png, icon-192.png, icon-384.png, icon-512.png

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 11+
- Edge 79+

## Technologies Used

- HTML5
- CSS3 (Custom Properties, Flexbox, Grid)
- Vanilla JavaScript (ES6+)
- Chart.js 4.4.1 for financial visualizations
- Service Worker for offline support
- ExchangeRate-API for currency data

## License

MIT License - Feel free to use and modify!
