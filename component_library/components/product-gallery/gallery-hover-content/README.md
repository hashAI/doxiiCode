# Gallery Hover Content Component

## Overview
A product image gallery with text overlay revealed on hover. Shows titles and descriptions over images, perfect for category showcases or featured collections.

## Features
- **Content Overlay**: Shows title and description on hover with smooth fade-in
- **Expand on Hover**: Images expand when hovered (desktop only)
- **Mobile Responsive**: Optimized layout for all devices
- **Dark Mode Support**: Full support for light and dark themes
- **Customizable Items**: Configure images, titles, and descriptions
- **Accessibility**: Full keyboard navigation support
- **E-commerce Ready**: Perfect for category navigation

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | Array | 3 category items | Array of `{url, title, description}` objects |
| `title` | String | "Shop By Category" | Gallery title |
| `subtitle` | String | Description text | Gallery subtitle/description |

## Events

| Event | Detail | Description |
|-------|--------|-------------|
| `item-click` | `{index, item}` | Fired when an item is clicked |

## Usage

### Basic Usage
```html
<gallery-hover-content></gallery-hover-content>
```

### Custom Items
```html
<gallery-hover-content 
  items='[
    {"url":"img1.jpg", "title":"Electronics", "description":"Latest gadgets"},
    {"url":"img2.jpg", "title":"Fashion", "description":"Trending styles"}
  ]'
  title="Product Categories">
</gallery-hover-content>
```

## E-commerce Use Cases
- Category navigation
- Collection showcases
- Brand story sections
- Featured departments
- Seasonal categories
- Promotional sections

