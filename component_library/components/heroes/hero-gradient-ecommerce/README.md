# Hero Gradient Ecommerce

Modern e-commerce hero section with gradient backgrounds, fixed navigation, mobile menu, announcement bar, and trust indicators.

## Features

- **Dual Theme Support**: Seamlessly switch between light and dark modes
- **Gradient Backgrounds**: Beautiful gradient backgrounds with grid pattern (light mode) and purple blur effect (dark mode)
- **Fixed Navigation**: Backdrop blur navigation that stays fixed at the top
- **Mobile Menu**: Responsive hamburger menu with smooth slide animations
- **Announcement Bar**: Top banner for important announcements or promotions
- **Trust Indicators**: Checkmark badges to build credibility
- **Dual CTAs**: Primary and secondary call-to-action buttons
- **Smooth Animations**: Hover effects and transitions throughout
- **Poppins Font**: Clean, modern typography
- **Mobile-First**: Fully responsive design for all devices
- **Theme Toggle**: Built-in theme switcher

## Usage

```html
<hero-gradient-ecommerce theme="light"></hero-gradient-ecommerce>
```

### Attributes

- `theme` - Set to "light" or "dark" (default: "light")

## Events

The component emits the following custom events:

### nav-click
Fired when a navigation item is clicked.
```javascript
component.addEventListener('nav-click', (e) => {
    console.log('Navigation clicked:', e.detail.item);
    // e.detail = { item: { label: 'Shop', href: '/shop' } }
});
```

### cta-primary-click
Fired when the primary CTA button is clicked.
```javascript
component.addEventListener('cta-primary-click', (e) => {
    console.log('Primary CTA clicked:', e.detail);
    // e.detail = { action: 'start-trial' }
});
```

### cta-secondary-click
Fired when the secondary CTA button is clicked.
```javascript
component.addEventListener('cta-secondary-click', (e) => {
    console.log('Secondary CTA clicked:', e.detail);
    // e.detail = { action: 'view-pricing' } or { action: 'watch-demo' }
});
```

### menu-toggle
Fired when the mobile menu is toggled.
```javascript
component.addEventListener('menu-toggle', (e) => {
    console.log('Menu toggled:', e.detail.open);
    // e.detail = { open: true/false }
});
```

### theme-changed
Fired when the theme is changed.
```javascript
component.addEventListener('theme-changed', (e) => {
    console.log('Theme changed to:', e.detail.theme);
    // e.detail = { theme: 'light'/'dark' }
});
```

## Customization

The component can be customized by modifying the `config` property:

```javascript
const component = document.querySelector('hero-gradient-ecommerce');
component.config = {
    brandName: 'YourBrand',
    announcement: {
        badge: 'Special Offer',
        text: 'Get 50% off for the first month'
    },
    navigation: [
        { label: 'Home', href: '/' },
        { label: 'Products', href: '/products' },
        { label: 'About', href: '/about' }
    ],
    hero: {
        badge: {
            label: 'NEW',
            text: 'Try our new features today'
        },
        title: {
            light: 'Your custom title here',
            dark: 'Your dark mode title',
            darkHighlight: 'highlighted text'
        },
        subtitle: 'Your subtitle text',
        cta: {
            primary: 'Get Started',
            secondary: {
                light: 'Learn More',
                dark: 'Watch Video'
            }
        },
        trustIndicators: [
            'Free shipping',
            'Money-back guarantee',
            '24/7 support'
        ],
        image: {
            light: 'your-light-image-url.jpg',
            dark: 'your-dark-image-url.jpg'
        }
    }
};
```

## Dependencies

- **Lit 3.2.1+**: Web component framework
- **TailwindCSS**: Utility-first CSS framework
- **Poppins Font**: From Google Fonts
- **Lucide Icons**: Icon library

All dependencies are auto-loaded from CDN.

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Accessibility

- Semantic HTML structure
- ARIA labels on interactive elements
- Keyboard navigation support
- Focus states on all interactive elements
- Responsive text sizing

## Mobile Optimization

- Mobile-first responsive design
- Touch-friendly interactive elements
- Optimized for small screens
- Hamburger menu for mobile navigation
- Flexible layout that adapts to screen size

## Performance

- Lazy-loaded fonts
- Optimized images
- Minimal JavaScript
- No heavy dependencies
- Efficient rendering with Lit

## Use Cases

- E-commerce homepages
- Online store landing pages
- SaaS product pages
- Fashion and apparel stores
- Electronics retailers
- Lifestyle brand websites
- Modern marketplace platforms
- Tech product launches
- Premium brand showcases
- Startup landing pages
- Subscription service pages

## Testing

Open `test-hero-gradient-ecommerce.html` in a browser to test the component.

## License

MIT
