# Quick Start Guide - Product Gallery Components

## Installation

### Step 1: Import Component
Choose the component you need and import it:

```html
<script type="module">
  // Import one or more components
  import './component_library/components/product-gallery/gallery-hover-expand/gallery-hover-expand.js';
  import './component_library/components/product-gallery/gallery-grid/gallery-grid.js';
</script>
```

### Step 2: Use in HTML
Simply add the component tag:

```html
<gallery-hover-expand></gallery-hover-expand>
```

That's it! The component will render with default images and content.

## Customization

### Example 1: Custom Images
```html
<gallery-hover-expand 
  images='[
    "https://example.com/product1.jpg",
    "https://example.com/product2.jpg",
    "https://example.com/product3.jpg"
  ]'
  title="New Summer Collection"
  subtitle="Discover our latest arrivals for summer 2025">
</gallery-hover-expand>
```

### Example 2: Grid with Custom Items
```html
<gallery-grid 
  items='[
    {
      "url": "https://example.com/product1.jpg",
      "title": "Premium Headphones",
      "link": "/products/headphones"
    },
    {
      "url": "https://example.com/product2.jpg",
      "title": "Smart Watch",
      "link": "/products/watch"
    }
  ]'
  title="Featured Products"
  subtitle="Our best-selling items">
</gallery-grid>
```

### Example 3: Slider Configuration
```html
<gallery-slider-indicators 
  auto-slide-interval="5000"
  images='["url1.jpg", "url2.jpg", "url3.jpg"]'>
</gallery-slider-indicators>
```

## Event Handling

### Listen to Events
```javascript
// Get the component
const gallery = document.querySelector('gallery-hover-expand');

// Listen for image clicks
gallery.addEventListener('image-click', (e) => {
  const { index, url } = e.detail;
  console.log(`Image ${index} clicked:`, url);
  
  // Navigate to product page
  window.location.href = `/products/${index}`;
});
```

### All Available Events

| Component | Event | Detail |
|-----------|-------|--------|
| gallery-hover-expand | `image-click` | `{index, url}` |
| gallery-hover-simple | `image-click` | `{index, url}` |
| gallery-hover-content | `item-click` | `{index, item}` |
| gallery-slider-indicators | `slide-change` | `{index, url}` |
| gallery-slider-indicators | `indicator-click` | `{index}` |
| gallery-slider-buttons | `slide-change` | `{index, url}` |
| gallery-slider-buttons | `button-click` | `{direction, index}` |
| gallery-grid | `item-click` | `{index, item}` |
| gallery-grid | `link-click` | `{index, item}` |

## Real-World Examples

### E-commerce Homepage
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Store</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body>
  <!-- Hero Slider -->
  <gallery-slider-indicators 
    auto-slide-interval="4000">
  </gallery-slider-indicators>

  <!-- Shop by Category -->
  <gallery-hover-content
    title="Shop by Category"
    items='[
      {"url":"fashion.jpg", "title":"Fashion", "description":"Trending styles"},
      {"url":"tech.jpg", "title":"Tech", "description":"Latest gadgets"},
      {"url":"home.jpg", "title":"Home", "description":"Comfort living"}
    ]'>
  </gallery-hover-content>

  <!-- Featured Products -->
  <gallery-grid
    title="Featured Products"
    items='[
      {"url":"p1.jpg", "title":"Product 1", "link":"/product/1"},
      {"url":"p2.jpg", "title":"Product 2", "link":"/product/2"}
    ]'>
  </gallery-grid>

  <script type="module">
    import './components/product-gallery/gallery-slider-indicators/gallery-slider-indicators.js';
    import './components/product-gallery/gallery-hover-content/gallery-hover-content.js';
    import './components/product-gallery/gallery-grid/gallery-grid.js';

    // Handle category clicks
    document.querySelector('gallery-hover-content')
      .addEventListener('item-click', (e) => {
        window.location.href = `/category/${e.detail.item.title.toLowerCase()}`;
      });

    // Handle product clicks
    document.querySelector('gallery-grid')
      .addEventListener('item-click', (e) => {
        window.location.href = e.detail.item.link;
      });
  </script>
</body>
</html>
```

### Product Detail Page
```html
<!-- Related Products Carousel -->
<section>
  <h2>You May Also Like</h2>
  <gallery-slider-buttons
    images='[
      "related1.jpg",
      "related2.jpg",
      "related3.jpg"
    ]'>
  </gallery-slider-buttons>
</section>

<script type="module">
  import './components/product-gallery/gallery-slider-buttons/gallery-slider-buttons.js';

  document.querySelector('gallery-slider-buttons')
    .addEventListener('slide-change', (e) => {
      console.log('Viewing related product:', e.detail.index);
      // Track analytics
    });
</script>
```

### Category Page
```html
<!-- Product Grid -->
<gallery-grid
  title="All Products"
  items='[
    {"url":"p1.jpg", "title":"Product 1", "link":"/product/1"},
    {"url":"p2.jpg", "title":"Product 2", "link":"/product/2"},
    {"url":"p3.jpg", "title":"Product 3", "link":"/product/3"}
  ]'>
</gallery-grid>

<script type="module">
  import './components/product-gallery/gallery-grid/gallery-grid.js';

  const grid = document.querySelector('gallery-grid');
  
  // Handle "Show More" clicks
  grid.addEventListener('link-click', (e) => {
    e.preventDefault();
    window.location.href = e.detail.item.link;
  });
</script>
```

## Styling & Theming

### Dark Mode
All components support dark mode automatically:

```html
<!-- Toggle dark mode -->
<script>
  document.documentElement.classList.toggle('dark');
</script>
```

### Custom Colors
Components use Tailwind classes. To customize:

```javascript
// Modify component after initialization
const gallery = document.querySelector('gallery-hover-expand');
gallery.shadowRoot.querySelector('.bg-white').classList.add('bg-blue-50');
```

Or better, fork the component and modify the Tailwind classes directly.

## Props Reference

### Gallery Hover Expand
```typescript
{
  images: string[],      // Array of image URLs
  title: string,         // Gallery title
  subtitle: string       // Gallery subtitle
}
```

### Gallery Hover Simple
```typescript
{
  images: string[],      // Array of image URLs
  title: string,         // Gallery title
  subtitle: string       // Gallery subtitle
}
```

### Gallery Hover Content
```typescript
{
  items: Array<{         // Array of items
    url: string,         // Image URL
    title: string,       // Item title
    description: string  // Item description
  }>,
  title: string,         // Gallery title
  subtitle: string       // Gallery subtitle
}
```

### Gallery Slider Indicators
```typescript
{
  images: string[],           // Array of image URLs
  autoSlideInterval: number,  // Interval in ms (default: 3000)
  autoSlide: boolean          // Enable auto-slide (default: true)
}
```

### Gallery Slider Buttons
```typescript
{
  images: string[],           // Array of image URLs
  autoSlideInterval: number,  // Interval in ms (default: 3000)
  autoSlide: boolean          // Enable auto-slide (default: true)
}
```

### Gallery Grid
```typescript
{
  items: Array<{         // Array of items
    url: string,         // Image URL
    title: string,       // Item title
    link: string         // Item link
  }>,
  title: string,         // Gallery title
  subtitle: string,      // Gallery subtitle
  columns: number        // Grid columns (handled by responsive classes)
}
```

## Performance Tips

### 1. Lazy Loading
Images use `loading="lazy"` by default (except first visible).

### 2. Optimize Images
Use appropriate image sizes:
- Grid items: 600x800px
- Slider images: 1200x600px
- Hover galleries: 800x800px

### 3. Reduce Auto-Slide Interval
For better performance on mobile:
```html
<gallery-slider-indicators auto-slide-interval="5000">
</gallery-slider-indicators>
```

### 4. Limit Number of Images
- Sliders: 5-7 images max
- Grids: Use pagination for 20+ items
- Hover galleries: 3-6 items optimal

## Troubleshooting

### Component Not Rendering
1. Check import path is correct
2. Ensure TailwindCSS is loaded
3. Check browser console for errors

### Dark Mode Not Working
1. Add `dark` class to `<html>` element:
   ```javascript
   document.documentElement.classList.add('dark');
   ```

### Events Not Firing
1. Ensure event listener is added after component is loaded:
   ```javascript
   customElements.whenDefined('gallery-hover-expand').then(() => {
     const gallery = document.querySelector('gallery-hover-expand');
     gallery.addEventListener('image-click', handler);
   });
   ```

### Images Not Loading
1. Check image URLs are accessible
2. Check CORS headers for external images
3. Use absolute URLs or correct relative paths

## Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Next Steps
- Explore individual component READMEs for detailed documentation
- Check `test-gallery-components.html` for live examples
- Customize components for your brand
- Integrate with your backend API

## Support
For issues or questions:
1. Check component-specific README files
2. Review `INTEGRATION_SUMMARY.md`
3. Check browser console for errors

---

**Version**: 1.0.0  
**Last Updated**: November 22, 2025  
**Components**: 6 production-ready gallery components

