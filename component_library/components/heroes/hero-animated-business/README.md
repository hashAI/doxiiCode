# Hero Animated Business

E-commerce hero section with animated navigation hover effects, gradient background, dual CTAs, and product image gallery.

## Features

- ✅ Dual theme support (light/dark)
- ✅ Animated navigation with slide-up hover effect
- ✅ Gradient background (dark mode with SVG pattern)
- ✅ Mobile menu with backdrop
- ✅ Dual CTA buttons (primary and secondary)
- ✅ Announcement badge with link
- ✅ Product image gallery with hover effects
- ✅ Glassmorphic button effects (dark mode)
- ✅ Mobile-first responsive design
- ✅ Poppins font family
- ✅ Theme toggle functionality

## Usage

```html
<hero-animated-business></hero-animated-business>
```

## Customization

The component accepts a `config` property for customization:

```javascript
const hero = document.querySelector('hero-animated-business');
hero.config = {
    brandName: 'ShopHub',
    logo: {
        svg: '...', // SVG markup
        text: 'ShopHub'
    },
    navigation: [
        { label: 'Products', href: '/products' },
        { label: 'Collections', href: '/collections' },
        // ...
    ],
    hero: {
        badge: {
            text: 'Explore how we help grow brands.',
            linkText: 'Read more'
        },
        title: 'Solutions to Elevate Your Shopping Experience',
        subtitle: 'Unlock amazing products...',
        cta: {
            primary: 'Get Started',
            secondary: 'Learn More'
        },
        images: ['url1', 'url2', ...] // Product showcase images
    }
};
```

## Events

- `nav-click` - When a navigation item is clicked
- `cta-primary-click` - When primary CTA (Get Started) is clicked
- `cta-secondary-click` - When secondary CTA (Learn More/Contact) is clicked
- `menu-toggle` - When mobile menu is toggled
- `theme-changed` - When theme is toggled

## Theme Control

```javascript
const hero = document.querySelector('hero-animated-business');
hero.theme = 'dark'; // or 'light'
```

## E-commerce Use Cases

- Tech product landing pages
- Fashion and lifestyle brands
- Modern marketplace platforms
- SaaS product showcases
- Digital product stores
- Premium brand websites
- Startup landing pages
- Creative agency portfolios
- Product launch pages
- Business solution platforms

