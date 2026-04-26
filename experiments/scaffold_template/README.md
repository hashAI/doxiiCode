# DOXII E-commerce Scaffold Template

A complete, production-ready e-commerce scaffold built with **Lit** web components and **TailwindCSS**. This template runs directly in the browser with no build tools required.

## Features

### 🎨 Design System
- **Dark/Light Mode** - Automatic theme switching with localStorage persistence
- **Responsive Design** - Mobile-first, works on all devices
- **Custom Tailwind Config** - Professional color palette and animations
- **CSS Variables** - Easy theming and customization

### 🛍️ E-commerce Features
- **Product Catalog** - Grid view with filtering and sorting
- **Product Details** - Full product pages with image galleries
- **Shopping Cart** - Persistent cart with localStorage
- **Checkout Flow** - Complete checkout process
- **Category Filtering** - Filter products by category
- **Search** - Search products by name/description

### 📱 Components
- **Header** - Sticky header with search, cart, theme toggle
- **Footer** - Company info, links, social media
- **Mobile Menu** - Slide-out navigation drawer
- **Cart Drawer** - Slide-out cart with totals
- **Product Cards** - Beautiful product display with ratings
- **Newsletter** - Email subscription form

### 📄 Pages
- **Home** - Hero, featured products, categories
- **Catalog** - Full product grid with filters
- **Product Detail** - Single product view
- **Cart** - Full cart page
- **Checkout** - Checkout form
- **About** - Company information
- **Contact** - Contact form

## Technology Stack

- **Lit 3.2.1** - Web components via CDN
- **TailwindCSS** - Utility-first CSS via CDN
- **Lucide Icons** - Beautiful icon set
- **AOS** - Scroll animations
- **Pure JavaScript** - No build tools, runs in browser

## File Structure

```
scaffold_template/
├── index.html                 # Entry point
├── assets/
│   ├── app.js                # Application bootstrap
│   ├── router.js             # SPA routing
│   ├── state.js              # Global state management
│   └── utils.js              # Utility functions
├── components/
│   ├── base-component.js     # Base Lit component
│   ├── header.js             # Header with nav
│   ├── footer.js             # Footer
│   ├── mobile-menu.js        # Mobile drawer menu
│   ├── cart-drawer.js        # Cart drawer
│   ├── hero.js               # Hero section
│   ├── product-card.js       # Product card
│   ├── product-grid.js       # Product grid
│   ├── category-filter.js    # Category filter
│   └── newsletter.js         # Newsletter signup
└── pages/
    ├── page-home.js          # Home page
    ├── page-catalog.js       # Catalog page
    ├── page-product.js       # Product detail
    ├── page-cart.js          # Cart page
    ├── page-checkout.js      # Checkout
    ├── page-about.js         # About page
    └── page-contact.js       # Contact page
```

## Usage

### Quick Start

1. **Open `index.html` in a browser** - That's it! No installation required.

2. **Or use a local server** (recommended for development):
   ```bash
   python -m http.server 8080
   # or
   npx serve
   ```

3. **Navigate to** `http://localhost:8080`

### Testing the Myntra-Inspired Design

The scaffold template now features a **Myntra-inspired UX design**. To test it:

1. **Start the local server**:
   ```bash
   cd experiments/scaffold_template
   python3 -m http.server 8080
   ```

2. **Open in browser**: Navigate to `http://localhost:8080`

3. **Test different viewports**:
   - **Mobile**: Resize browser to 375px width or use DevTools mobile emulation
   - **Tablet**: Resize to 768px width
   - **Desktop**: Use full-width browser (1920px recommended)

4. **Key features to test**:
   - ✅ Desktop horizontal navigation menu
   - ✅ Context-aware bottom navigation (changes per page)
   - ✅ Mobile menu with promo banner
   - ✅ Catalog page with sidebar filters (desktop) and bottom sheet (mobile)
   - ✅ Category grid with pink overlays
   - ✅ Sort and filter functionality
   - ✅ Responsive design across all breakpoints

5. **Navigate between pages**:
   - Home → Catalog → Product → Cart → Checkout → Contact

6. **Mobile-specific testing**:
   - Tap bottom navigation items
   - Open mobile menu from hamburger icon
   - Test filter and sort bottom sheets on catalog page
   - Verify bottom nav changes on different pages

See `MYNTRA_DESIGN_IMPLEMENTATION.md` for detailed design documentation.

### For Agents

Agents should copy this entire scaffold structure to create new projects:

```python
# In architect agent
import shutil

# Copy scaffold to new project
scaffold_path = "experiments/scaffold_template"
project_path = f"test_output/{chat_id}"
shutil.copytree(scaffold_path, project_path)

# Then customize as needed
```

## Customization

### Brand Colors

Edit the Tailwind config in `index.html`:

```javascript
tailwind.config = {
    theme: {
        extend: {
            colors: {
                primary: { /* your colors */ },
                secondary: { /* your colors */ },
                accent: { /* your colors */ }
            }
        }
    }
}
```

### Products

Edit `assets/state.js` to add/modify products:

```javascript
export const productsStore = {
    products: [
        // Add your products here
    ]
}
```

### Pages

Add new pages by:
1. Creating a new page component in `pages/`
2. Importing it in `assets/app.js`
3. Adding a route in the `setRoutes()` call

## Key Features

### Dark/Light Mode
- Automatic detection of system preference
- Manual toggle via header button
- Persists across sessions

### Cart Management
- Add/remove items
- Update quantities
- LocalStorage persistence
- Real-time updates across components

### Routing
- Hash-based SPA routing
- Dynamic parameters (`:id`)
- Query string support
- Programmatic navigation

### State Management
- Reactive cart store
- Subscription pattern
- LocalStorage integration
- Global event bus

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT - Free to use and modify
