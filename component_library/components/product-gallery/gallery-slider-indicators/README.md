# Gallery Slider Indicators Component

## Overview
An auto-sliding product image gallery with dot indicators. Perfect for hero sections or featured product showcases.

## Features
- **Auto-Slide**: Automatically transitions between slides
- **Dot Indicators**: Click dots to navigate to specific slides
- **Smooth Transitions**: CSS-based smooth slide transitions
- **Mobile Responsive**: Optimized for all screen sizes
- **Dark Mode Support**: Full support for light and dark themes
- **Pause on Interaction**: Auto-slide pauses when user interacts
- **Accessibility**: ARIA labels and keyboard navigation
- **E-commerce Ready**: Perfect for featured products

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
| `indicator-click` | `{index}` | Fired when indicator is clicked |

## Usage

### Basic Usage
```html
<gallery-slider-indicators></gallery-slider-indicators>
```

### Custom Configuration
```html
<gallery-slider-indicators 
  images='["url1", "url2", "url3"]'
  auto-slide-interval="5000">
</gallery-slider-indicators>
```

### With Event Listeners
```javascript
const slider = document.querySelector('gallery-slider-indicators');
slider.addEventListener('slide-change', (e) => {
  console.log('Slide changed to:', e.detail.index);
});
```

## E-commerce Use Cases
- Hero sections
- Featured products carousel
- Promotional banners
- Product launch showcases
- Seasonal campaigns
- Flash sale highlights

