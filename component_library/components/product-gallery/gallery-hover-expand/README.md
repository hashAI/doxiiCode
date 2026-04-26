# Gallery Hover Expand Component

## Overview
An elegant product image gallery with a horizontal expand-on-hover effect. When users hover over an image, it smoothly expands to full width while other images shrink, creating an engaging interactive experience.

## Features
- **Smooth Expand Animation**: Images expand to full width on hover with smooth transitions
- **Mobile Responsive**: Stacks vertically on mobile, horizontal expansion on desktop
- **Dark Mode Support**: Full support for light and dark themes
- **Customizable Content**: Configure images, title, and subtitle
- **Accessibility**: Keyboard navigation and ARIA labels
- **E-commerce Ready**: Perfect for product showcases and collections

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `images` | Array | 6 product images | Array of image URLs to display |
| `title` | String | "Our Latest Collection" | Gallery title |
| `subtitle` | String | Description text | Gallery subtitle/description |

## Events

| Event | Detail | Description |
|-------|--------|-------------|
| `image-click` | `{index, url}` | Fired when an image is clicked |

## Usage

### Basic Usage
```html
<gallery-hover-expand></gallery-hover-expand>
```

### Custom Images
```html
<gallery-hover-expand 
  images='["https://example.com/img1.jpg", "https://example.com/img2.jpg"]'
  title="New Arrivals"
  subtitle="Check out our latest products">
</gallery-hover-expand>
```

### With Event Listeners
```javascript
const gallery = document.querySelector('gallery-hover-expand');
gallery.addEventListener('image-click', (e) => {
  console.log('Image clicked:', e.detail);
  // Navigate to product page or open lightbox
});
```

## Styling
The component uses Tailwind CSS and supports dark mode automatically. It uses the Poppins font family from Google Fonts.

## Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Requires ES6+ support

## E-commerce Use Cases
- Product collection showcases
- Category browsing
- Featured items display
- Brand storytelling
- Seasonal collections
- New arrivals section

