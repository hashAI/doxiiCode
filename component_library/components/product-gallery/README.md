# Product Gallery Components

## Overview
A collection of 7 production-ready product image gallery and slider components for e-commerce websites. Each component is built with Lit Web Components, styled with TailwindCSS, and supports both light and dark modes.

## Components

### 1. Gallery Hover Expand
**Element:** `<gallery-hover-expand>`  
**Use Case:** Product collection showcases, featured items

An elegant gallery where images smoothly expand to full width on hover while others shrink. Perfect for creating engaging product collection displays.

**Key Features:**
- Smooth expand animation on hover
- 6 images in horizontal layout (mobile: vertical stack)
- Perfect for seasonal collections or new arrivals

---

### 2. Gallery Hover Simple
**Element:** `<gallery-hover-simple>`  
**Use Case:** Clean product displays, minimalist showcases

A simple gallery with translate-up hover effect. Images lift slightly on hover, creating a clean and modern interaction.

**Key Features:**
- Subtle translate-up animation
- 4 images in flexible wrap layout
- Ideal for featured products or best sellers

---

### 3. Gallery Hover Content
**Element:** `<gallery-hover-content>`  
**Use Case:** Category navigation, collection showcases

Images expand on hover and reveal overlay content (title + description). Perfect for category browsing or storytelling.

**Key Features:**
- Text overlay revealed on hover
- Expand animation (desktop only)
- 3 items with rich content
- Great for "Shop by Category" sections

---

### 4. Gallery Slider Indicators
**Element:** `<gallery-slider-indicators>`  
**Use Case:** Hero sections, featured products carousel

Auto-sliding gallery with dot indicators. Users can click dots to jump to specific slides.

**Key Features:**
- Auto-slide with configurable interval (default: 3s)
- Dot navigation
- Smooth CSS transitions
- Pauses and resets on interaction
- Perfect for hero sections

---

### 5. Gallery Slider Buttons
**Element:** `<gallery-slider-buttons>`  
**Use Case:** Product carousels, manual navigation

Auto-sliding gallery with previous/next buttons. Provides both automatic and manual control.

**Key Features:**
- Auto-slide with prev/next buttons
- Resets timer on button click
- Responsive button sizing
- Window resize handling
- Great for product detail galleries

---

### 6. Gallery Grid
**Element:** `<gallery-grid>`  
**Use Case:** Product catalogs, search results

Responsive grid layout with hover overlay showing product title and "Show More" link.

**Key Features:**
- Responsive: 1-4 columns based on screen size
- Hover overlay with title + link
- SVG icon integration
- 8 items default
- Perfect for product listing pages

---

### 7. Gallery Marquee Testimonials
**Element:** `<gallery-marquee-testimonials>`  
**Use Case:** Customer testimonials, social proof, reviews

Infinite scrolling marquee displaying customer testimonials in two rows with opposite scroll directions. Perfect for showcasing social proof and building trust.

**Key Features:**
- Seamless infinite scroll animation
- Two rows (one left-to-right, one right-to-left)
- Pause on hover
- Verified customer badges
- Social media (Twitter/X) integration
- Configurable animation speed
- 5 testimonials default
- Perfect for homepage trust sections

---

## Common Features (All Components)

✅ **Dark Mode Support**: Full support for light and dark themes  
✅ **Mobile Responsive**: Optimized for all screen sizes  
✅ **Accessibility**: ARIA labels, keyboard navigation  
✅ **E-commerce Ready**: Designed specifically for online stores  
✅ **Customizable**: Props for images, titles, and content  
✅ **Event Emitters**: Custom events for interactions  
✅ **No Shadow DOM**: TailwindCSS works directly  
✅ **CDN Ready**: All dependencies from CDN  

## Tech Stack
- **Lit Web Components** (v3.2.1)
- **TailwindCSS** (utility classes)
- **Google Fonts** (Poppins)
- **Pure JavaScript** (ES6+)

## Installation

### 1. Import the Component
```html
<script type="module">
  import './components/product-gallery/gallery-hover-expand/gallery-hover-expand.js';
</script>
```

### 2. Use in HTML
```html
<gallery-hover-expand></gallery-hover-expand>
```

### 3. Customize with Props
```html
<gallery-hover-expand 
  images='["url1", "url2", "url3"]'
  title="New Arrivals"
  subtitle="Check out our latest products">
</gallery-hover-expand>
```

## Events

All components emit custom events for interactions:

```javascript
const gallery = document.querySelector('gallery-hover-expand');

gallery.addEventListener('image-click', (e) => {
  console.log('Image clicked:', e.detail);
  // Navigate to product page
});
```

## Grid Behavior (Gallery Grid)

| Screen Size | Columns |
|------------|---------|
| Mobile (< 640px) | 1 |
| Small (640px+) | 2 |
| Medium (768px+) | 3 |
| Large (1024px+) | 4 |

## E-commerce Use Cases

### Homepage
- Hero sections (Slider Indicators, Slider Buttons)
- Featured collections (Hover Expand, Hover Content)
- New arrivals (Hover Simple, Grid)
- Customer testimonials (Marquee Testimonials)
- Social proof sections (Marquee Testimonials)

### Category Pages
- Category navigation (Hover Content)
- Product listings (Grid)
- Featured items (Hover Simple)

### Product Pages
- Related products (Grid)
- Image carousels (Slider Buttons)
- Collection showcases (Hover Expand)
- Customer reviews (Marquee Testimonials)

## Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance
- Lazy loading images
- CSS-based animations (no JS animation libraries)
- Efficient event handling
- Minimal re-renders with Lit

## Accessibility Features
- ARIA labels and roles
- Keyboard navigation support
- Focus states
- Screen reader friendly
- Semantic HTML

## Dark Mode Implementation
All components automatically detect and respond to dark mode via Tailwind's `dark:` classes. They use:
- `dark:bg-gray-900` for backgrounds
- `dark:text-gray-100` for text
- `dark:bg-gray-600` for secondary elements

## Customization

### Colors
Components use Tailwind utility classes. To customize colors, modify the component's render method or override with custom CSS.

### Fonts
Default: Poppins (loaded from Google Fonts CDN)  
To change: Override the font-family in component styles

### Timing (Sliders)
```html
<gallery-slider-indicators auto-slide-interval="5000">
</gallery-slider-indicators>
```

## Component Size
Each component is ~3-5KB (minified), ensuring fast load times.

## Roadmap
- [ ] Add lightbox/modal view for full-screen images
- [ ] Add touch swipe support for mobile sliders
- [ ] Add lazy loading optimization
- [ ] Add animation variations
- [ ] Add more layout options

## Contributing
When adding new gallery components:
1. Follow the existing structure
2. Include README.md
3. Create preview.js
4. Update component-catalog.json
5. Test dark mode
6. Test mobile responsiveness
7. Add accessibility features

## Support
For issues or questions, refer to individual component README files in each directory.

---

**Total Components**: 7  
**Category**: product-gallery  
**Last Updated**: November 22, 2025  
**Version**: 1.1.0

