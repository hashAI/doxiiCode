# Hero Nav Showcase Component

A modern, fully responsive hero section with integrated navigation, mobile menu, dual CTAs, and a large product showcase image. Perfect for ecommerce landing pages.

## Features

- **Fixed Navigation**: Sticky header with logo, menu items, and CTA button
- **Mobile Menu**: Slide-in mobile navigation with backdrop blur
- **Dual CTAs**: Primary and secondary call-to-action buttons
- **Hero Showcase**: Large responsive product image
- **Dark/Light Mode**: Full theme support
- **Responsive Design**: Mobile-first approach with breakpoints
- **Customizable**: Configure navigation items, CTAs, and content
- **Accessible**: Full ARIA labels and keyboard navigation
- **Event-Driven**: Custom events for all interactions

## Usage

### Basic Usage

```html
<hero-nav-showcase></hero-nav-showcase>
```

### With Custom Props

```html
<hero-nav-showcase
  theme="dark"
  logo-text="MyStore"
  nav-items='[{"label":"Home","href":"/"},{"label":"Shop","href":"/shop"}]'
  cta-primary-text="Shop Now"
  heading="Welcome to Our Store"
  hero-image="https://example.com/image.jpg"
></hero-nav-showcase>
```

### In JavaScript

```javascript
const hero = document.createElement('hero-nav-showcase');
hero.theme = 'light';
hero.logoText = 'TechHub';
hero.heading = 'Latest Technology';
hero.navItems = JSON.stringify([
  { label: 'Products', href: '/products' },
  { label: 'Support', href: '/support' }
]);
document.body.appendChild(hero);
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `theme` | string | `'light'` | Theme mode: 'light' or 'dark' |
| `logoText` | string | `'ShopElite'` | Logo text in navigation |
| `logoSvg` | string | `''` | Optional SVG markup for logo |
| `logoHref` | string | `'/'` | URL for logo link |
| `navItems` | string | JSON array | Navigation items (JSON string) |
| `ctaPrimaryText` | string | `'Start Shopping'` | Primary CTA button text |
| `ctaSecondaryText` | string | `'Watch Demo'` | Secondary CTA button text |
| `navCtaText` | string | `'Free Trial'` | Navigation CTA button text |
| `heading` | string | `'Premium Fashion...'` | Main heading (supports HTML) |
| `subheading` | string | `'Discover curated...'` | Subheading text |
| `heroImage` | string | Unsplash URL | Hero showcase image URL |
| `heroImageAlt` | string | `'Product showcase'` | Alt text for image |

## Events

### nav-click
Fired when a navigation item is clicked.

```javascript
hero.addEventListener('nav-click', (e) => {
  console.log('Navigation clicked:', e.detail);
  // { label: 'Shop', href: '/shop' }
});
```

### cta-primary-click
Fired when the primary CTA button is clicked.

```javascript
hero.addEventListener('cta-primary-click', (e) => {
  console.log('Primary CTA:', e.detail);
  // { text: 'Start Shopping', type: 'primary' }
});
```

### cta-secondary-click
Fired when the secondary CTA button is clicked.

```javascript
hero.addEventListener('cta-secondary-click', (e) => {
  console.log('Secondary CTA:', e.detail);
  // { text: 'Watch Demo', type: 'secondary' }
});
```

### nav-cta-click
Fired when the navigation CTA button is clicked.

```javascript
hero.addEventListener('nav-cta-click', (e) => {
  console.log('Nav CTA:', e.detail);
  // { text: 'Free Trial', type: 'nav-cta' }
});
```

### menu-toggle
Fired when the mobile menu is opened or closed.

```javascript
hero.addEventListener('menu-toggle', (e) => {
  console.log('Menu toggled:', e.detail);
  // { isOpen: true }
});
```

## Navigation Items Format

The `navItems` prop expects a JSON string with the following structure:

```json
[
  {
    "label": "Home",
    "href": "/"
  },
  {
    "label": "Shop",
    "href": "/shop"
  },
  {
    "label": "Collections",
    "href": "/collections"
  }
]
```

## Styling

The component uses Tailwind CSS utility classes and supports theme customization. All colors and spacing follow Tailwind's design system.

### Theme Colors

- **Light Mode**: 
  - Text: `slate-800`, `slate-700`, `slate-600`
  - Background: `white`, `slate-100`
  - Primary: `indigo-600`
  
- **Dark Mode**: 
  - Text: `slate-100`, `slate-200`, `slate-300`
  - Background: `slate-900`, `slate-800`
  - Primary: `indigo-500`

## Responsive Breakpoints

- **Mobile**: < 768px (mobile menu, single column)
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px (desktop navigation, two columns)
- **Large Desktop**: > 1280px (larger images)

## Accessibility

- Semantic HTML5 elements (`<nav>`, `<main>`, `<section>`)
- ARIA labels on all interactive elements
- Keyboard navigation support
- Focus management for mobile menu
- Alt text for images
- Proper heading hierarchy

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Examples

### Fashion Store

```html
<hero-nav-showcase
  theme="light"
  logo-text="FashionHub"
  heading="Trendy Styles<br>For Every Season"
  subheading="Shop the latest fashion trends with exclusive deals"
  hero-image="https://images.unsplash.com/photo-1441986300917-64674bd600d8"
></hero-nav-showcase>
```

### Tech Store (Dark Mode)

```html
<hero-nav-showcase
  theme="dark"
  logo-text="TechPro"
  nav-items='[{"label":"Laptops","href":"/laptops"},{"label":"Phones","href":"/phones"}]'
  heading="Next-Gen Technology<br>Available Now"
  cta-primary-text="Browse Products"
  hero-image="https://images.unsplash.com/photo-1468495244123-6c6c332eeece"
></hero-nav-showcase>
```

## Notes

- The component uses Google Fonts (Poppins)
- Icons are loaded from Lucide CDN
- Mobile menu uses CSS transforms for smooth animations
- Navigation is fixed at the top on scroll
- Component does not use Shadow DOM for Tailwind compatibility

## Version

1.0.0 - Initial release (2025-11-22)

