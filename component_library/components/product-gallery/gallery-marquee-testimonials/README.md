# Gallery Marquee Testimonials Component

## Overview
An infinite scrolling marquee component displaying customer testimonials in two rows. One row scrolls left to right, the other right to left, creating an engaging visual effect perfect for showcasing social proof.

## Features
- **Infinite Scroll**: Seamless continuous scrolling animation
- **Two Rows**: First row scrolls left-to-right, second row right-to-left
- **Pause on Hover**: Animation pauses when user hovers (configurable)
- **Mobile Responsive**: Optimized for all screen sizes
- **Dark Mode Support**: Full support for light and dark themes
- **Verified Badges**: Blue checkmark badges for authenticity
- **Social Links**: Twitter/X integration with links
- **Customizable Speed**: Adjust animation duration
- **Fade Edges**: Gradient fades on left and right edges
- **Accessibility**: Keyboard navigation and ARIA support
- **E-commerce Ready**: Perfect for customer reviews

## Features Details

### Animation
- CSS-based animation (no JavaScript calculations)
- GPU-accelerated with `transform-gpu`
- Configurable duration (default: 25 seconds)
- Reverse direction on second row
- Smooth, seamless loop

### Visual Effects
- Gradient fades on edges prevent abrupt cuts
- Hover shadow effects on cards
- Verified badge icons
- Social media integration

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `cards` | Array | 5 testimonials | Array of testimonial objects |
| `animationDuration` | Number | 25 | Animation duration in seconds |
| `pauseOnHover` | Boolean | true | Pause animation on hover |

### Card Object Structure
```typescript
{
  image: string,        // Profile image URL
  name: string,         // Customer name
  handle: string,       // Social handle (e.g., "@username")
  date: string,         // Review date
  testimonial: string   // Review text
}
```

## Events

| Event | Detail | Description |
|-------|--------|-------------|
| `card-click` | `{index, card}` | Fired when a testimonial card is clicked |
| `link-click` | `{index, card, platform}` | Fired when social link is clicked |

## Usage

### Basic Usage
```html
<gallery-marquee-testimonials></gallery-marquee-testimonials>
```

### Custom Testimonials
```html
<gallery-marquee-testimonials 
  cards='[
    {
      "image": "https://example.com/user1.jpg",
      "name": "John Doe",
      "handle": "@johndoe",
      "date": "June 2025",
      "testimonial": "Amazing products! Highly recommend."
    },
    {
      "image": "https://example.com/user2.jpg",
      "name": "Jane Smith",
      "handle": "@janesmith",
      "date": "July 2025",
      "testimonial": "Best customer service ever!"
    }
  ]'>
</gallery-marquee-testimonials>
```

### Custom Animation Speed
```html
<gallery-marquee-testimonials 
  animation-duration="30"
  pause-on-hover="false">
</gallery-marquee-testimonials>
```

### With Event Listeners
```javascript
const marquee = document.querySelector('gallery-marquee-testimonials');

// Handle card clicks
marquee.addEventListener('card-click', (e) => {
  console.log('Testimonial clicked:', e.detail);
  // Open testimonial detail modal
});

// Handle social link clicks
marquee.addEventListener('link-click', (e) => {
  console.log('Social link clicked:', e.detail);
  // Track social media click
  window.open(`https://x.com/${e.detail.card.handle}`, '_blank');
});
```

## Styling

### Animation Speed
Control how fast the marquee scrolls:
- **Slow**: 40-50 seconds (more readable)
- **Medium**: 25-30 seconds (default)
- **Fast**: 15-20 seconds (more dynamic)

```html
<!-- Slow scroll -->
<gallery-marquee-testimonials animation-duration="40">
</gallery-marquee-testimonials>
```

### Card Count
The component automatically doubles the cards array for seamless looping. Recommended:
- **Minimum**: 3-4 cards
- **Optimal**: 5-7 cards
- **Maximum**: 10-12 cards (performance consideration)

### Gradient Fade Width
The edge fades are responsive:
- Mobile: 20px (`w-20`)
- Desktop: 32px (`w-32`, adjustable to `w-40`)

## E-commerce Use Cases

### Homepage
- Customer testimonials section
- Social proof display
- Trust indicators
- Review highlights

### Product Pages
- Product-specific reviews
- Customer feedback
- Rating showcase
- Before/after testimonials

### Category Pages
- Category-specific reviews
- Expert recommendations
- Influencer testimonials

### Checkout/Cart
- Trust signals
- Security testimonials
- Shipping reviews
- Return policy feedback

## Best Practices

### Content
1. **Keep testimonials concise**: 1-2 sentences ideal
2. **Use real names and photos**: Builds authenticity
3. **Include dates**: Shows recency
4. **Verify badges**: Only for verified customers
5. **Mix positive aspects**: Quality, service, speed, etc.

### Performance
1. **Optimize images**: Use 200x200px profile images
2. **Limit card count**: 5-10 cards optimal
3. **Consider animation duration**: Slower = more readable
4. **Use lazy loading**: Images load as needed

### Accessibility
1. **Provide alt text** for profile images
2. **Enable keyboard navigation** for cards
3. **Ensure color contrast** for text
4. **Add ARIA labels** for actions

## Customization

### Change Animation Direction
Both rows scroll in opposite directions by default. To change:
```css
.marquee-reverse {
  animation-direction: reverse;
}
```

### Disable Hover Pause
```html
<gallery-marquee-testimonials pause-on-hover="false">
</gallery-marquee-testimonials>
```

### Custom Card Styling
The cards use Tailwind classes. Fork the component to customize:
- Background: `bg-white dark:bg-gray-800`
- Border: `border border-gray-100 dark:border-gray-700`
- Shadow: `shadow hover:shadow-lg`
- Width: `w-72` (288px)

## Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance Notes
- Uses CSS `@keyframes` for smooth animation
- GPU-accelerated with `transform-gpu`
- No JavaScript animation loops
- Minimal re-renders with Lit
- Efficient event handling

## Accessibility Features
- ✅ Keyboard navigation (Tab, Enter)
- ✅ ARIA labels for links
- ✅ Focus states
- ✅ Screen reader friendly
- ✅ Semantic HTML
- ✅ Alt text for images

## SEO Benefits
- Displays customer testimonials (social proof)
- Links to social profiles
- Fresh, dated content
- Names and handles for authority

## Integration Examples

### With Product Data
```javascript
// Fetch testimonials from API
fetch('/api/testimonials')
  .then(res => res.json())
  .then(testimonials => {
    const marquee = document.querySelector('gallery-marquee-testimonials');
    marquee.cards = testimonials;
  });
```

### With Analytics
```javascript
const marquee = document.querySelector('gallery-marquee-testimonials');

marquee.addEventListener('card-click', (e) => {
  // Track with Google Analytics
  gtag('event', 'testimonial_click', {
    customer_name: e.detail.card.name,
    testimonial_date: e.detail.card.date
  });
});
```

### Dynamic Loading
```javascript
// Load testimonials based on page/product
const productId = '123';
const marquee = document.querySelector('gallery-marquee-testimonials');

fetch(`/api/testimonials?product=${productId}`)
  .then(res => res.json())
  .then(data => {
    marquee.cards = data.testimonials;
  });
```

## Troubleshooting

### Animation is choppy
- Ensure GPU acceleration: `transform-gpu` class
- Reduce card count
- Optimize images (compress, resize)

### Cards not displaying
- Check image URLs are accessible
- Verify cards array format
- Check browser console for errors

### Dark mode not working
- Add `dark` class to `<html>` element
- Ensure Tailwind dark mode is configured

## Advanced Usage

### Multiple Rows
To add more rows, extend the component:
```javascript
// Add a third row in the render method
// Copy row structure and adjust animation
```

### Variable Speed Rows
```css
/* Different speed for each row */
#row1 .marquee-inner {
  animation-duration: 25s;
}
#row2 .marquee-inner {
  animation-duration: 30s;
}
```

### Responsive Animation
```css
/* Slower on mobile for readability */
@media (max-width: 768px) {
  .marquee-inner {
    animation-duration: 35s !important;
  }
}
```

## Related Components
- `gallery-grid` - Static testimonial grid
- `gallery-hover-content` - Category showcases
- Product detail components with reviews

---

**Use Case**: Customer testimonials, social proof, reviews showcase  
**Complexity**: Medium  
**Mobile Friendly**: ✅ Yes  
**Dark Mode**: ✅ Yes  
**Accessibility**: ✅ Full support

