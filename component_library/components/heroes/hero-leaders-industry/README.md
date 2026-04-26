# Hero Leaders Industry

E-commerce hero section designed for showcasing industry leaders and professionals with product grid layout.

## Features

- ✅ Dual theme support (light/dark)
- ✅ Gradient background (light: multi-color, dark: gray gradient)
- ✅ Mobile menu with smooth transitions
- ✅ Announcement badge with icon
- ✅ Dual CTA buttons (primary and secondary)
- ✅ Login and signup buttons in navigation
- ✅ Product image grid (2x2 layout)
- ✅ Hover effects on images (scale animation)
- ✅ Mobile-first responsive design
- ✅ Poppins font family
- ✅ Theme toggle functionality

## Usage

```html
<hero-leaders-industry></hero-leaders-industry>
```

## Customization

The component accepts a `config` property for customization:

```javascript
const hero = document.querySelector('hero-leaders-industry');
hero.config = {
    brandName: 'ShopHub',
    logo: {
        url: 'https://...', // Logo image URL
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
            icon: 'arrow-right' // Lucide icon name
        },
        title: 'Preferred choice of shoppers in',
        titleHighlight: 'every category',
        subtitle: 'Learn why professionals trust our marketplace...',
        cta: {
            primary: 'Browse Products',
            secondary: 'Get Started',
            login: 'Login',
            signup: 'Sign up'
        },
        images: ['url1', 'url2', 'url3', 'url4'] // 4 product images for grid
    }
};
```

## Events

- `nav-click` - When a navigation item is clicked
- `nav-cta-login-click` - When login CTA is clicked
- `nav-cta-signup-click` - When signup CTA is clicked
- `cta-primary-click` - When primary CTA (Browse Products) is clicked
- `cta-secondary-click` - When secondary CTA (Get Started) is clicked
- `menu-toggle` - When mobile menu is toggled
- `theme-changed` - When theme is toggled

## Theme Control

```javascript
const hero = document.querySelector('hero-leaders-industry');
hero.theme = 'dark'; // or 'light'
```

## E-commerce Use Cases

- Professional marketplace platforms
- Industry-specific e-commerce sites
- B2B product showcases
- Premium brand websites
- Fashion and apparel stores
- Tech product platforms
- Luxury goods marketplaces
- Business solution websites
- Corporate e-commerce
- Professional service platforms

