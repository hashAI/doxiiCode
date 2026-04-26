# Hero Grid Gradient Network

Modern e-commerce hero section with grid pattern gradient background, mobile menu, app download CTAs, and social proof elements.

## Features

- ✅ Dual theme support (light/dark)
- ✅ Grid pattern with gradient background
- ✅ Fixed navigation with mobile menu
- ✅ App store download buttons (iOS & Android)
- ✅ User avatars with star ratings
- ✅ Social proof indicators
- ✅ Mobile-first responsive design
- ✅ Smooth animations and transitions
- ✅ Poppins font family
- ✅ Theme toggle functionality

## Usage

```html
<hero-grid-gradient-network></hero-grid-gradient-network>
```

## Customization

The component accepts a `config` property for customization:

```javascript
const hero = document.querySelector('hero-grid-gradient-network');
hero.config = {
    brandName: 'ShopHub',
    logo: {
        svg: '...', // SVG markup
        text: 'ShopHub'
    },
    navigation: [
        { label: 'Home', href: '/' },
        { label: 'Products', href: '/products' },
        // ...
    ],
    hero: {
        title: 'Grow your shopping network...',
        subtitle: 'Discover amazing products...',
        cta: {
            nav: 'Contact us',
            appStore: 'Download on App Store',
            playStore: 'Get it on Google Play'
        },
        image: 'https://...',
        rating: {
            stars: 5,
            text: 'Used by 1,000+ shoppers'
        },
        users: ['url1', 'url2', ...] // User avatar URLs
    }
};
```

## Events

- `nav-click` - When a navigation item is clicked
- `nav-cta-click` - When navigation CTA is clicked
- `cta-app-store-click` - When App Store button is clicked
- `cta-play-store-click` - When Play Store button is clicked
- `menu-toggle` - When mobile menu is toggled
- `theme-changed` - When theme is toggled

## Theme Control

```javascript
const hero = document.querySelector('hero-grid-gradient-network');
hero.theme = 'dark'; // or 'light'
```

## E-commerce Use Cases

- Online retail homepages
- Mobile app download landing pages
- Fashion and apparel stores
- Electronics retailers
- Lifestyle brand websites
- Social shopping platforms
- Marketplace platforms

