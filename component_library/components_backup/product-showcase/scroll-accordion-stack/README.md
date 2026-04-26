# Scroll Accordion Stack

A sophisticated pinned scrolling accordion component that creates an immersive storytelling experience through smooth GSAP animations. Perfect for showcasing product features, benefits, and key selling points in an engaging, interactive format.

## Overview

The Scroll Accordion Stack component uses GSAP's ScrollTrigger and ScrollSmoother plugins to create a stunning visual effect where accordion cards pin to the viewport and progressively stack as the user scrolls. Text content smoothly collapses, creating a clean, modern aesthetic ideal for ecommerce feature showcases.

## Features

### Core Features
- ✨ **GSAP ScrollTrigger Pinning** - Cards pin to viewport during scroll
- 🎨 **ScrollSmoother Integration** - Buttery-smooth scrolling experience
- 📦 **Card Stacking Effects** - Progressive stacking animation
- 🌓 **Dark/Light Theme Support** - Automatic theme switching with custom events
- 📱 **Fully Responsive** - Optimized for mobile, tablet, and desktop
- ♿ **Accessibility First** - ARIA labels, keyboard navigation, reduced motion support

### Animation Features
- Automatic text collapse on scroll
- Smooth margin reduction for stacking
- Stagger timing for progressive reveals
- Gradient background transitions
- Hover effects with depth

### Customization
- Configurable items array
- Theme switching via attributes
- Custom gradient backgrounds per card
- Adjustable spacing and sizing
- Event-driven interactions

## Installation

```bash
# The component is a self-contained ES module
import './scroll-accordion-stack.js';
```

Or use directly in HTML:

```html
<script type="module" src="path/to/scroll-accordion-stack.js"></script>
```

## Usage

### Basic Usage

```html
<scroll-accordion-stack></scroll-accordion-stack>
```

### With Custom Content

```html
<scroll-accordion-stack id="features"></scroll-accordion-stack>

<script>
  const accordion = document.querySelector('#features');
  accordion.items = [
    {
      title: 'Premium Quality',
      description: 'Our products are crafted with the finest materials...'
    },
    {
      title: 'Fast Shipping',
      description: 'Lightning-fast delivery to your doorstep...'
    },
    // Add more items...
  ];
</script>
```

### With Dark Theme

```html
<scroll-accordion-stack theme="dark"></scroll-accordion-stack>
```

### Programmatic Theme Toggle

```javascript
const accordion = document.querySelector('scroll-accordion-stack');

// Toggle theme
accordion.theme = 'dark'; // or 'light'

// Listen for theme changes
accordion.addEventListener('theme-changed', (e) => {
  console.log('New theme:', e.detail.theme);
});
```

## Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `items` | `Array` | `[4 default items]` | Array of accordion items with `title` and `description` |
| `theme` | `String` | `'light'` | Theme variant: `'light'` or `'dark'` |

### Items Structure

```javascript
{
  title: String,      // Main heading for the accordion item
  description: String // Detailed description text
}
```

## Events

The component dispatches several custom events:

### `accordion-item-focus`

Fired when an accordion item comes into focus during scroll.

```javascript
element.addEventListener('accordion-item-focus', (e) => {
  console.log('Focused item:', e.detail.index);
  console.log('Item data:', e.detail.item);
});
```

**Event Detail:**
- `index` (Number): Zero-based index of the focused item
- `item` (Object): The item data object

### `accordion-item-collapse`

Fired when accordion items collapse during animation.

```javascript
element.addEventListener('accordion-item-collapse', (e) => {
  console.log('Items collapsed');
});
```

### `accordion-item-activated`

Fired when a user clicks on an item or activates it with keyboard (Enter/Space).

```javascript
element.addEventListener('accordion-item-activated', (e) => {
  console.log('Activated item:', e.detail.index);
  console.log('Item data:', e.detail.item);
});
```

**Event Detail:**
- `index` (Number): Zero-based index of the activated item
- `item` (Object): The item data object

### `theme-changed`

Fired when the theme is toggled.

```javascript
element.addEventListener('theme-changed', (e) => {
  console.log('New theme:', e.detail.theme);
});
```

**Event Detail:**
- `theme` (String): The new theme value ('light' or 'dark')

## Styling

The component uses CSS custom properties for easy theming:

```css
scroll-accordion-stack {
  --bg-gradient-start: #5c2fa6;
  --bg-gradient-end: #5a36c0;
  --accordion-1: linear-gradient(200deg, rgb(29, 145, 252) 13.57%, rgb(90, 54, 192) 98.38%);
  --accordion-2: linear-gradient(200deg, rgb(242, 136, 133) 13.57%, rgb(233, 79, 102) 98.38%);
  --accordion-3: linear-gradient(200deg, rgb(101, 187, 118) 13.57%, rgb(70, 111, 171) 98.38%);
  --accordion-4: linear-gradient(200deg, #c215d1 13.57%, #9813a1 98.38%);
  --text-primary: rgb(255, 255, 255);
  --text-secondary: rgba(255, 255, 255, 0.7);
  --shadow-color: rgba(0, 0, 0, 0.3);
  --title-shadow: rgba(0, 0, 0, 0.1);
}
```

### Custom Gradient Example

```html
<style>
  scroll-accordion-stack {
    --accordion-1: linear-gradient(200deg, #ff6b6b 0%, #ee5a6f 100%);
    --accordion-2: linear-gradient(200deg, #4ecdc4 0%, #44a08d 100%);
  }
</style>
```

## Accessibility

The component includes comprehensive accessibility features:

- **ARIA Labels**: All interactive elements have appropriate ARIA labels
- **Keyboard Navigation**: Full keyboard support (Enter, Space keys)
- **Focus Management**: Visible focus indicators on all interactive elements
- **Reduced Motion**: Respects `prefers-reduced-motion` media query
- **Semantic HTML**: Uses proper semantic elements and roles
- **Screen Reader Support**: Descriptive labels for assistive technologies

### Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Tab` | Navigate between accordion items |
| `Enter` or `Space` | Activate focused accordion item |

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Dependencies

All dependencies are automatically loaded from CDN:

- **Lit 3.2.1** - Web components framework
- **GSAP 3.12.5** - Animation engine
- **ScrollTrigger Plugin** - Scroll-based animations
- **ScrollSmoother Plugin** - Smooth scrolling

## Performance

- **Lazy Loading**: GSAP libraries load asynchronously
- **Optimized Animations**: GPU-accelerated transforms
- **Shadow DOM**: Encapsulated styles prevent conflicts
- **Cleanup**: Proper cleanup of animations on disconnect

## Use Cases

### Ecommerce
- Product feature showcases
- Service benefits sections
- Trust indicator highlights
- Shipping & returns information

### Marketing
- Value proposition displays
- Key selling points
- Brand story sections
- Process explanations

### Corporate
- Company values
- Team highlights
- Service offerings
- About us sections

## Examples

### Custom 4-Item Accordion

```javascript
const accordion = document.querySelector('scroll-accordion-stack');
accordion.items = [
  {
    title: 'Free Worldwide Shipping',
    description: 'Get free shipping on all orders over $50 to any location worldwide. No hidden fees, no surprises.'
  },
  {
    title: '30-Day Returns',
    description: 'Not satisfied? Return any item within 30 days for a full refund. No questions asked.'
  },
  {
    title: 'Secure Payments',
    description: '256-bit SSL encryption protects your payment information. We support all major payment methods.'
  },
  {
    title: '24/7 Support',
    description: 'Our customer support team is available around the clock to help with any questions or concerns.'
  }
];
```

### With Event Tracking

```javascript
const accordion = document.querySelector('scroll-accordion-stack');

accordion.addEventListener('accordion-item-focus', (e) => {
  // Track analytics
  gtag('event', 'accordion_view', {
    item_index: e.detail.index,
    item_title: e.detail.item.title
  });
});

accordion.addEventListener('accordion-item-activated', (e) => {
  // Handle user interaction
  showModal(e.detail.item);
});
```

## Troubleshooting

### Animations Not Working

If animations aren't working, ensure:
1. The component has sufficient scroll height (add spacer elements)
2. GSAP libraries loaded successfully (check console)
3. No conflicting scroll libraries

### ScrollSmoother Issues

ScrollSmoother may have limitations in Shadow DOM. The component gracefully degrades to standard scrolling if ScrollSmoother fails to initialize.

### Theme Not Switching

Ensure you're setting the `theme` attribute:

```javascript
// Correct
element.setAttribute('theme', 'dark');
element.theme = 'dark';

// Incorrect
element.theme = true; // Should be 'dark' or 'light'
```

## License

MIT License - see LICENSE file for details

## Credits

Original design concept inspired by modern scroll-based storytelling patterns. Adapted for ecommerce use cases with enhanced accessibility and theming.

## Support

For issues, questions, or contributions, please refer to the main component library documentation.
