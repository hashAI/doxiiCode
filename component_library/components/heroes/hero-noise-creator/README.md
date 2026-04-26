# Hero Noise Creator

E-commerce hero section with noise background texture, centered layout, email signup form, and community badge.

## Features

- ✅ Dual theme support (light/dark)
- ✅ Noise texture background
- ✅ Centered content layout
- ✅ Email signup form with validation
- ✅ Community badge with user avatars
- ✅ Berkshire Swash decorative font for title
- ✅ Poppins font for body text
- ✅ Mobile-first responsive design
- ✅ Theme toggle functionality
- ✅ Smooth animations

## Usage

```html
<hero-noise-creator></hero-noise-creator>
```

## Customization

The component accepts a `config` property for customization:

```javascript
const hero = document.querySelector('hero-noise-creator');
hero.config = {
    brandName: 'ShopHub',
    logo: {
        svg: '...', // SVG markup
        text: 'ShopHub'
    },
    hero: {
        badge: {
            text: 'Join community of 1m+ founders',
            users: ['url1', 'url2', 'url3'] // User avatar URLs
        },
        title: 'Empowering shoppers...',
        subtitle: 'Flexible filters...',
        announcement: 'Secure your spot early...',
        cta: {
            nav: 'Sign up',
            email: 'Early access'
        },
        emailPlaceholder: 'Enter email address'
    }
};
```

## Events

- `nav-cta-click` - When navigation CTA (Sign up) is clicked
- `email-submit` - When email form is submitted (includes email in detail)
- `theme-changed` - When theme is toggled

## Theme Control

```javascript
const hero = document.querySelector('hero-noise-creator');
hero.theme = 'dark'; // or 'light'
```

## E-commerce Use Cases

- SaaS product pages
- Email capture landing pages
- Early access signup pages
- Creator economy platforms
- Premium membership sites
- Community-driven marketplaces
- Subscription e-commerce
- Startup product launches

