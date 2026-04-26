# Dense Catalog Theme - Template 2

A modern, high-density e-commerce catalog theme optimized for functional browsing of large product inventories. Features grid/list view toggles, comprehensive filters, and a clean, professional design.

## Category: `dense_catalog`

This theme is designed for stores that need:
- High SKU/functional browsing
- List or tight grid view options
- Specs visible early (ratings, colors, descriptions)
- Bulk-friendly UX with filter persistence
- Optimized for users who want "something fast and functional"

## Placeholders for Customization

When using this template as a base for a new store, replace the following placeholders:

### Store Identity Placeholders

| Placeholder | Location | Description | Example |
|-------------|----------|-------------|---------|
| `{{STORE_NAME}}` | Header, Footer, Title | Store/Brand name | "VisionPro Eyewear" |
| `{{STORE_TAGLINE}}` | Footer | Short store tagline | "See the world clearly" |
| `{{PHONE_NUMBER}}` | Header, Footer | Customer service phone | "1-800-555-0123" |
| `{{EMAIL_ADDRESS}}` | Footer | Support email address | "support@example.com" |
| `{{STORE_ADDRESS}}` | Footer | Physical store address | "123 Main St, City, ST 12345" |

### Files Containing Placeholders

1. **`index.html`**
   - `<title>` tag - Store name and description
   - Meta description
   - Theme color (brand color)

2. **`components/app-header.js`**
   - Store logo/name in header
   - Phone number display
   - Navigation categories

3. **`components/app-footer.js`**
   - `{{STORE_NAME}}` - Brand name
   - `{{STORE_TAGLINE}}` - Brand tagline
   - `{{PHONE_NUMBER}}` - Contact phone
   - `{{EMAIL_ADDRESS}}` - Contact email
   - `{{STORE_ADDRESS}}` - Store address
   - Social media links

4. **`assets/state.js`**
   - `categoriesMeta` - Product categories and descriptions
   - Product data (images, prices, names)
   - Currency format settings

### Customization Steps

1. **Brand Identity**
   - Replace placeholder values with your brand info
   - Update the favicon in `index.html`
   - Change brand colors in Tailwind config (`tailwind.config` in index.html)

2. **Categories**
   - Update `categoriesMeta` in `assets/state.js` with your product categories
   - Each category needs: `label`, `description`, `image`, `emoji`

3. **Products**
   - Replace sample products in `assets/state.js` with real product data
   - Each product needs: `id`, `name`, `description`, `price`, `images[]`, `category`, `rating`, `reviews`
   - Optional: `originalPrice`, `discount`, `colors[]`, `colorHex[]`, `sizes[]`, `productType[]`

4. **Colors/Theming**
   - Primary brand color: Update `brand` colors in Tailwind config
   - Accent colors: Update `navy`, `gold` color palettes
   - Dark mode: Colors automatically adapt

5. **Images**
   - Replace placeholder images with real product images
   - Recommended: 800x800px for product images
   - Use `getImageUrl()` helper or direct URLs

### File Structure

```
dense_catalog_2/
├── index.html              # Main HTML, Tailwind config, global styles
├── README.md               # This file
├── assets/
│   ├── app.js             # App initialization, routing
│   ├── state.js           # State management, product data, stores
│   ├── router.js          # Hash-based routing
│   └── utils.js           # Utility functions, toast, helpers
└── components/
    ├── base-component.js  # Base class for all components
    ├── app-header.js      # Header with navigation, search, cart
    ├── app-footer.js      # Footer with links and contact info
    ├── bottom-nav.js      # Mobile bottom navigation
    ├── cart-sidebar.js    # Shopping cart sidebar
    ├── favorites-sidebar.js # Wishlist sidebar
    ├── side-menu.js       # Mobile side menu
    ├── location-selector.js # Location/delivery selector
    └── pages/
        ├── home-page.js         # Home page with hero, categories, featured
        ├── products-page.js     # Product listing with filters
        ├── product-details-page.js # Individual product page
        └── search-page.js       # Search functionality
```

### Features

- **Responsive Design**: Mobile-first, works on all devices
- **Dark Mode**: Automatic system preference detection
- **Product Filters**: Sort by price, popularity, frame shape
- **Grid/List View**: Toggle between compact and detailed views
- **Search**: Full-text product search with recent searches
- **Cart & Wishlist**: Persistent shopping cart and favorites
- **Location Selector**: Delivery location management
- **Toast Notifications**: User feedback for actions

### Tech Stack

- Vanilla JS with Web Components (LitElement-style)
- Tailwind CSS (via CDN)
- Lucide Icons
- AOS (Animate on Scroll)
- GSAP (animations)

### Usage by LLMs

When adapting this template:

1. **Keep the component architecture** - Components are modular and self-contained
2. **Update state.js first** - This contains all product data and categories
3. **Replace placeholders systematically** - Search for `{{` to find all placeholders
4. **Test on mobile** - The theme is mobile-first
5. **Maintain the color system** - Use Tailwind classes for consistency

### Currency & Locale

By default, the theme uses USD currency. To change:

1. Open `assets/utils.js`
2. Update the `formatCurrency` function:
```javascript
export function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD', // Change to your currency
        minimumFractionDigits: 0
    }).format(amount);
}
```

### Adding New Categories

1. In `assets/state.js`, add to `categoriesMeta`:
```javascript
'new-category': {
    label: 'New Category',
    description: 'Description of the category',
    image: 'https://example.com/category-image.jpg',
    emoji: '🆕'
}
```

2. Add products with `category: 'new-category'` to the products array

### Adding New Product Fields

Products support these fields:

```javascript
{
    id: 'unique-id',
    name: 'Product Name',
    description: 'Product description',
    price: 99.99,
    originalPrice: 149.99, // Optional, for sale items
    discount: 33, // Optional, percentage off
    images: ['url1', 'url2'], // Array of image URLs
    category: 'category-id',
    subcategory: 'optional-subcategory',
    rating: 4.5,
    reviews: 1234,
    colors: ['Black', 'Blue'], // Optional
    colorHex: ['#000', '#00f'], // Optional, matches colors array
    sizes: ['S', 'M', 'L'], // Optional
    productType: ['Type A', 'Type B'], // Optional
    powered: true, // Optional, shows "POWERED" badge
    // Add any custom fields as needed
}
```
