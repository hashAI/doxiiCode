# Hero Centered Leaders

E-commerce hero section with centered content layout and horizontal scrolling image gallery.

## Features

- ✅ Dual theme support (light/dark)
- ✅ Gradient background (light: multi-tone, dark: gray gradient)
- ✅ Centered content layout
- ✅ Mobile menu with smooth transitions
- ✅ Announcement badge with icon
- ✅ Single centered CTA button
- ✅ Login and signup buttons in navigation
- ✅ Horizontal scrolling image gallery (5 images)
- ✅ Hover effects on images (translate animation)
- ✅ Mobile-first responsive design
- ✅ Poppins font family
- ✅ Theme toggle functionality

## Usage

```html
<hero-centered-leaders></hero-centered-leaders>
```

## Customization

The component accepts a `config` property for customization:

```javascript
const hero = document.querySelector('hero-centered-leaders');
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
            login: 'Login',
            signup: 'Sign up'
        },
        images: ['url1', 'url2', 'url3', 'url4', 'url5'] // 5 product images
    }
};
```

## Events

- `nav-click` - When a navigation item is clicked
- `nav-cta-login-click` - When login CTA is clicked
- `nav-cta-signup-click` - When signup CTA is clicked
- `cta-primary-click` - When primary CTA (Browse Products) is clicked
- `menu-toggle` - When mobile menu is toggled
- `theme-changed` - When theme is toggled

## Theme Control

```javascript
const hero = document.querySelector('hero-centered-leaders');
hero.theme = 'dark'; // or 'light'
```

## E-commerce Use Cases

- Product landing pages
- Brand showcase websites
- Fashion and lifestyle stores
- Creative marketplaces
- Professional portfolios with products
- Modern e-commerce homepages
- Digital product stores
- Curated collections
- Premium brand sites
- SaaS product pages
- Subscription services

