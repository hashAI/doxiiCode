# E-commerce Infrastructure Template

This directory contains **universal infrastructure files** that are copied to all generated e-commerce stores.

## What's Included

### Core Infrastructure (Business-Agnostic)
These files work for any e-commerce store without modification:

#### **HTML Template**
- **`index.html`**: Universal HTML template with correct CDN script loading order
  - Pre-configured with all required CDN links (Tailwind, AOS, Lucide)
  - Placeholder comments for customization ({{STORE_NAME}}, {{STORE_DESCRIPTION}})
  - Correct script loading sequence to prevent errors
  - Dark mode enabled by default
  - Ready for business-specific customization

#### **Navigation & Routing**
- **`assets/router.js`**: Hash-based SPA router with dynamic parameters, query strings, and 404 handling

#### **UI & Utilities**
- **`assets/utils.js`**: Essential utilities
  - Animation management (AOS)
  - Icon initialization (Lucide)
  - Currency formatting
  - Toast notifications
  - Theme management (dark/light mode)
  - Drawer controls
  - Local storage helpers
  - Debouncing
  - Form validation basics
  - Date/number formatting

#### **State Management**
- **`assets/state.js`**: State management template (REQUIRES CUSTOMIZATION)
  - `productsStore`: Product catalog with search/filter methods (products array is EMPTY by default)
  - `cartStore`: Shopping cart with subscription pattern and localStorage persistence
  - `preferencesStore`: User preferences (theme, currency, locale)
  - `filterStore`: Catalog filtering state with apply/reset methods
  - `eventBus`: Cross-component event communication
  - **IMPORTANT**: You MUST populate `productsStore.products` with your actual products!

#### **E-commerce Features**
- **`assets/cart.js`**: Complete cart management system
  - Add/remove/update items
  - Calculate totals (subtotal, tax, shipping, discount)
  - Coupon/discount application
  - Cart validation
  - LocalStorage persistence
  - Reactive events for UI updates
  - Cart merging (for login scenarios)

- **`assets/wishlist.js`**: Wishlist/favorites management
  - Add/remove items
  - Move items to cart
  - Price tracking & alerts
  - Stock status monitoring
  - Wishlist statistics
  - Share wishlists
  - LocalStorage persistence

- **`assets/product-filters.js`**: Universal product filtering & sorting
  - Price range filtering
  - Category filtering
  - Generic attribute filtering
  - Search functionality
  - Multiple sort options (price, name, rating, newest, etc.)
  - Filter combinations
  - Pagination
  - URL state synchronization
  - Filter statistics

- **`assets/analytics.js`**: Event tracking system
  - E-commerce events (view product, add to cart, purchase, etc.)
  - User interaction tracking
  - Session management
  - Local analytics storage
  - Google Analytics integration
  - Facebook Pixel integration
  - Custom provider support
  - Conversion funnel tracking

- **`assets/validators.js`**: Comprehensive form validation
  - Email validation
  - Phone validation (US & international)
  - Password strength checking
  - Credit card validation (Luhn algorithm)
  - CVV & expiry date validation
  - Address validation
  - Zip code validation (US & Canada)
  - Name validation
  - Number/quantity validation
  - Real-time validation helpers
  - Form validation class

#### **Components**
- **`components/base-component.js`**: Base Lit component class (no Shadow DOM)

## API Reference

### State Management API (`state.js`)

**IMPORTANT**: `state.js` is a template that MUST be customized for each store.

```javascript
import {
    productsStore,
    cartStore,
    preferencesStore,
    filterStore,
    eventBus
} from './assets/state.js';

// ============================================
// Products Store (CUSTOMIZE THE PRODUCTS ARRAY!)
// ============================================
// By default, productsStore.products is an EMPTY array
// You MUST populate it with your actual products

productsStore.products = [
    {
        id: 1,
        name: 'Product Name',
        price: 99.99,
        category: 'Category',
        image: 'https://...',
        description: 'Short description',
        rating: 4.5,
        reviews: 100,
        inStock: true,
        // Add business-specific fields as needed
    },
    // ... more products
];

// Use product store methods
const product = productsStore.getProductById(1);
const featuredProducts = productsStore.getFeaturedProducts();
const searchResults = productsStore.searchProducts('query');
const categories = productsStore.getCategories();

// ============================================
// Cart Store (Reactive with localStorage)
// ============================================
// Subscribe to cart updates (returns unsubscribe function)
const unsubscribe = cartStore.subscribe(state => {
    console.log('Cart:', state.items);
    console.log('Total:', state.total);
    console.log('Count:', state.count);
});

// Cart operations
cartStore.addItem(product, quantity);
cartStore.removeItem(productId);
cartStore.updateQuantity(productId, newQuantity);
cartStore.clearCart();

// Cart getters
const count = cartStore.getCount();
const total = cartStore.getTotal();
const subtotal = cartStore.getSubtotal();
const hasProduct = cartStore.hasItem(productId);

// ============================================
// Preferences Store
// ============================================
preferencesStore.set('theme', 'dark');
const theme = preferencesStore.get('theme');
const allPrefs = preferencesStore.getAll();

// ============================================
// Filter Store
// ============================================
filterStore.selectedCategory = 'electronics';
filterStore.searchQuery = 'wireless';
filterStore.sortBy = 'price-low';
filterStore.setPriceRange({ min: 50, max: 200 });
filterStore.setRating(4);

const filteredProducts = filterStore.applyFilters(productsStore.products);

filterStore.clearAllFilters();

// ============================================
// Event Bus
// ============================================
eventBus.on('product:added', (data) => {
    console.log('Product added:', data);
});

eventBus.emit('product:added', { productId: 1 });

eventBus.off('product:added', callback);
```

### Cart API (`cart.js`)

```javascript
import {
    addToCart,
    removeFromCart,
    updateCartItemQuantity,
    calculateTotal,
    applyCoupon
} from './assets/cart.js';

// Add product to cart
addToCart(product, quantity, variant);

// Calculate cart total with tax, shipping, discount
const totals = calculateTotal({
    taxRate: 0.08,
    coupons: availableCoupons,
    shippingMethods: shippingOptions
});

// Apply coupon
applyCoupon('SAVE20', availableCoupons);

// Listen to cart changes
onCartUpdate((event) => {
    console.log('Cart updated:', event.cart);
});
```

### Wishlist API (`wishlist.js`)

```javascript
import {
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    isInWishlist,
    moveToCart
} from './assets/wishlist.js';

// Add to wishlist
addToWishlist(product);

// Check if in wishlist
if (isInWishlist(productId)) {
    // Show heart icon filled
}

// Move item to cart
moveToCart(productId, quantity);
```

### Product Filters API (`product-filters.js`)

```javascript
import {
    applyFilters,
    sortProducts,
    searchProducts,
    filterByPriceRange
} from './assets/product-filters.js';

// Apply multiple filters at once
const filtered = applyFilters(products, {
    minPrice: 50,
    maxPrice: 200,
    categories: ['electronics', 'accessories'],
    inStock: true,
    minRating: 4,
    search: 'wireless',
    sortBy: 'price',
    order: 'asc'
});

// Filter state management with URL sync
import { FilterState } from './assets/product-filters.js';

const filterState = new FilterState();
filterState.setFilter('category', 'electronics');
const urlParams = filterState.toURLParams(); // For URL updates
```

### Analytics API (`analytics.js`)

```javascript
import {
    trackProductView,
    trackAddToCart,
    trackPurchase,
    setupGoogleAnalytics
} from './assets/analytics.js';

// Setup Google Analytics
setupGoogleAnalytics('G-XXXXXXXXXX');

// Track product view
trackProductView(product);

// Track add to cart
trackAddToCart(product, quantity);

// Track purchase
trackPurchase({
    id: orderId,
    total: 199.99,
    items: cartItems
});
```

### Validators API (`validators.js`)

```javascript
import {
    validateEmail,
    validateCreditCard,
    validatePassword,
    FormValidator
} from './assets/validators.js';

// Single field validation
const emailCheck = validateEmail('user@example.com');
if (!emailCheck.valid) {
    console.error(emailCheck.error);
}

// Credit card validation
const cardCheck = validateCreditCard('4532123456789012');
console.log(cardCheck.type); // 'visa'

// Form validation
const validator = new FormValidator({
    email: [validateEmail],
    password: [(val) => validatePassword(val, { minLength: 8 })],
    phone: [validatePhone]
});

const result = validator.validateAll(formData);
if (!result.valid) {
    console.error(result.errors);
}
```

## What's NOT Included

Everything else should be **generated by the Architect agent** based on the specific business type:

- **`assets/app.js`**: Component imports and route definitions
- **All page files**: Custom layouts for home, catalog, product, cart, checkout, etc.
- **All UI components**: Custom header, footer, product cards, filters, etc.

**Note**: The following files ARE included but require customization:
- `index.html`: Placeholders for store name, colors, fonts, component names
- `assets/state.js`: Empty products array - MUST be populated with actual products

## Philosophy

**Infrastructure-First Generation**: The Architect agent should:
1. Use this infrastructure as the foundation (pre-copied to working directory)
2. Read infrastructure files to understand available APIs and patterns
3. Customize `state.js` and `index.html` as needed
4. Generate custom files (pages, components, app.js) from scratch for unique store experiences

**Goal**: Every store should be unique and functional - no breaking mistakes, maximum creativity.

## Benefits

✅ **No Duplication**: Write once, use everywhere
✅ **Consistent Behavior**: Cart, wishlist, filters work the same across all stores
✅ **Well-Tested**: Infrastructure code is thoroughly tested
✅ **Easy Updates**: Update one file, all stores benefit
✅ **Agent-Friendly**: Clear APIs reduce hallucination errors
✅ **Performance**: Optimized utilities for fast page loads
