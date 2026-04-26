# Gallery Slider Buttons Component

## Overview
An auto-sliding product image gallery with previous/next navigation buttons. Provides manual control while maintaining auto-slide functionality.

## Features
- **Auto-Slide**: Automatically transitions between slides
- **Navigation Buttons**: Previous and next buttons for manual control
- **Smooth Transitions**: CSS-based smooth slide transitions
- **Mobile Responsive**: Buttons adapt to screen size
- **Dark Mode Support**: Full support for light and dark themes
- **Reset on Interaction**: Auto-slide resets when buttons are clicked
- **Accessibility**: ARIA labels and keyboard navigation
- **E-commerce Ready**: Perfect for product showcases

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `images` | Array | 5 product images | Array of image URLs to display |
| `autoSlideInterval` | Number | 3000 | Auto-slide interval in milliseconds |
| `autoSlide` | Boolean | true | Enable/disable auto-sliding |

## Events

| Event | Detail | Description |
|-------|--------|-------------|
| `slide-change` | `{index, url}` | Fired when slide changes |
| `button-click` | `{direction, index}` | Fired when navigation button is clicked |

## Usage

### Basic Usage
```html
<gallery-slider-buttons></gallery-slider-buttons>
```

### Custom Configuration
```html
<gallery-slider-buttons 
  images='["url1", "url2", "url3"]'
  auto-slide-interval="4000">
</gallery-slider-buttons>
```

### With Event Listeners
```javascript
const slider = document.querySelector('gallery-slider-buttons');
slider.addEventListener('button-click', (e) => {
  console.log('Button clicked:', e.detail.direction);
});
```

## E-commerce Use Cases
- Hero sections with manual control
- Product image carousels
- Featured collections
- Brand story slideshows
- Promotional banners
- Product detail galleries

