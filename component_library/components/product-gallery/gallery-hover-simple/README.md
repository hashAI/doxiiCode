# Gallery Hover Simple Component

## Overview
A clean and simple product image gallery with a subtle translate-up hover effect. Perfect for showcasing products with minimal distraction.

## Features
- **Simple Hover Effect**: Images lift up smoothly on hover
- **Mobile Responsive**: Adapts beautifully to all screen sizes
- **Dark Mode Support**: Full support for light and dark themes
- **Customizable Content**: Configure images, title, and subtitle
- **Accessibility**: Keyboard navigation and ARIA labels
- **E-commerce Ready**: Perfect for product listings

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `images` | Array | 4 product images | Array of image URLs to display |
| `title` | String | "Explore Our Products" | Gallery title |
| `subtitle` | String | Description text | Gallery subtitle/description |

## Events

| Event | Detail | Description |
|-------|--------|-------------|
| `image-click` | `{index, url}` | Fired when an image is clicked |

## Usage

### Basic Usage
```html
<gallery-hover-simple></gallery-hover-simple>
```

### Custom Configuration
```html
<gallery-hover-simple 
  images='["url1", "url2", "url3", "url4"]'
  title="Featured Items"
  subtitle="Our handpicked selection">
</gallery-hover-simple>
```

## E-commerce Use Cases
- Product category displays
- Featured products section
- Best sellers showcase
- Sale items display
- Brand collections
- Minimalist product grids

