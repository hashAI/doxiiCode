# Component Library - Accurate Inventory

## Total Components: 11

### Heroes (2 components)
1. **motorcycle-landing** - Vibrant yellow gradient motorcycle landing page with hero bike showcase
   - Keywords: motorcycle, bike, automotive, yellow, gradient, landing
2. **hero-modern-purple** - Modern e-commerce hero with purple gradient, fixed nav, mobile menu
   - Keywords: modern, purple, gradient, hero, ecommerce, fixed-nav, mobile-menu

### Product Detail Pages (4 components)
3. **product-detail-elite** - Elegant product detail with expandable accordion (furniture/home decor)
   - Keywords: furniture, accordion, expandable, elegant, shipping
4. **product-detail-fashion** - Fashion-focused page with reviews, tabs, rating distribution
   - Keywords: fashion, reviews, ratings, tabs, clothing, apparel
5. **product-detail-sports** - Image-heavy page with vertical gallery & shipping calculator
   - Keywords: sports, outdoor, gallery, vertical, shipping, calculator
6. **product-detail-minimal** - Clean minimal page with pill-style selectors (luxury watches)
   - Keywords: minimal, luxury, watch, clean, elegant, sophisticated

### Product Showcase (3 components)
7. **luxury-product-showcase** - Full-page smooth scrolling gallery with GSAP and parallax
   - Keywords: luxury, showcase, smooth-scroll, parallax, GSAP, premium
8. **product-portfolio-showcase** - Creative portfolio-style with custom cursor and modals
   - Keywords: portfolio, creative, scroll, cursor, modal, immersive, artistic
9. **scroll-accordion-stack** - Pinned scrolling accordion with stacking animations
   - Keywords: accordion, scroll, stack, pinned, collapse, GSAP, features

### Interactive Carousels (2 components)
10. **scroll-card-carousel** - Scroll-based card carousel with drag support and seamless looping
    - Keywords: carousel, scroll, cards, stack, drag, swipe, loop, infinite
11. **interactive-3d-carousel** - Immersive 3D carousel with scroll navigation and reflection effects
    - Keywords: carousel, 3d, interactive, scroll, drag, rotation, reflection

## Usage Guidelines

### When to Use Component Library
✅ **USE LIBRARY** when you need:
- Hero sections → Use motorcycle-landing or hero-modern-purple
- Product detail pages → Use elite/fashion/sports/minimal variants
- Product showcases → Use luxury/portfolio/accordion variants
- Carousels → Use scroll-card or 3d variants

### When to Generate Custom Components
✅ **GENERATE CUSTOM** when you need:
- Basic components: headers, footers, navigation bars
- Simple elements: product cards, product grids, buttons
- Forms: newsletter signup, search bars, contact forms
- Utility components: breadcrumbs, badges, loading states
- Category displays, filters, cart drawers
- Any component type not in the library

## Search Examples

```python
# Finding components
get_component(ctx, "purple hero")           # → hero-modern-purple
get_component(ctx, "motorcycle")            # → motorcycle-landing
get_component(ctx, "luxury showcase")       # → luxury-product-showcase
get_component(ctx, "3d carousel")           # → interactive-3d-carousel
get_component(ctx, "fashion product")       # → product-detail-fashion
get_component(ctx, "minimal watch")         # → product-detail-minimal
get_component(ctx, "accordion stack")       # → scroll-accordion-stack
get_component(ctx, "scroll cards")          # → scroll-card-carousel
```

## Key Features

### All Components Include:
- ✅ Mobile-friendly and responsive
- ✅ Dark mode support
- ✅ Lit Web Components with Tailwind CSS
- ✅ Auto-fixed import paths
- ✅ Custom event emissions
- ✅ Production-ready code

### High Complexity Components (Advanced):
- luxury-product-showcase (GSAP ScrollTrigger, parallax)
- scroll-card-carousel (drag, infinite loop)
- product-portfolio-showcase (custom cursor, Splitting.js)
- interactive-3d-carousel (3D transforms, drag)
- scroll-accordion-stack (pinned scrolling)
- product-detail-fashion (reviews, tabs, ratings)
- product-detail-sports (shipping calculator)

### Medium Complexity Components:
- hero-modern-purple (mobile menu, navigation)
- motorcycle-landing (hero showcase)
- product-detail-elite (accordion)
- product-detail-minimal (pill selectors)

## Important Notes

1. **Limited Scope**: Only 11 components available - focus on heroes, product details, showcases, and carousels
2. **Generate When Missing**: For headers, footers, product cards, grids, filters, carts, etc. → generate custom
3. **Styling Only**: When using library components, only modify colors/spacing/fonts
4. **Behavior Preserved**: Never modify event handlers, state logic, or business rules
5. **Auto-Fixed Paths**: Import paths are automatically corrected - no manual fixes needed

