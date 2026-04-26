# Gallery Grid Component

## Overview
A responsive grid-based product image gallery with hover overlay containing titles and "Show More" links. Perfect for product listings and portfolio showcases.

## Features
- **Responsive Grid**: Automatically adjusts columns based on screen size
- **Hover Overlay**: Reveals product title and link on hover
- **Dark Mode Support**: Full support for light and dark themes
- **Customizable Items**: Configure images, titles, and links
- **Icon Integration**: Includes SVG icons for links
- **Accessibility**: Full keyboard navigation and ARIA support
- **E-commerce Ready**: Perfect for product catalogs

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | Array | 8 product items | Array of `{url, title, link}` objects |
| `title` | String | "Our Latest Products" | Gallery title |
| `subtitle` | String | Description text | Gallery subtitle/description |
| `columns` | Number | 4 | Number of grid columns (handled by responsive classes) |

## Events

| Event | Detail | Description |
|-------|--------|-------------|
| `item-click` | `{index, item}` | Fired when an item is clicked |
| `link-click` | `{index, item}` | Fired when "Show More" link is clicked |

## Usage

### Basic Usage
```html
<gallery-grid></gallery-grid>
```

### Custom Items
```html
<gallery-grid 
  items='[
    {"url":"img1.jpg", "title":"Product 1", "link":"#product-1"},
    {"url":"img2.jpg", "title":"Product 2", "link":"#product-2"}
  ]'
  title="Featured Products">
</gallery-grid>
```

### With Event Listeners
```javascript
const gallery = document.querySelector('gallery-grid');
gallery.addEventListener('link-click', (e) => {
  console.log('Show more clicked:', e.detail.item);
  // Navigate to product detail page
});
```

## Grid Behavior
- **Mobile (< 640px)**: 1 column
- **Small (640px+)**: 2 columns
- **Medium (768px+)**: 3 columns
- **Large (1024px+)**: 4 columns

## E-commerce Use Cases
- Product catalog pages
- Category listings
- New arrivals grid
- Best sellers showcase
- Sale items display
- Search results
- Collection browsing
- Portfolio showcases

