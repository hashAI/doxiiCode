# Common Patterns and Infrastructure

Common patterns, utilities, and pre-built infrastructure APIs for DOXII e-commerce stores.

## Mobile-First Responsive Design

### Breakpoints (Tailwind)
```javascript
// Mobile:  default (< 640px)
// Tablet:  sm: (≥ 640px)
// Desktop: md: (≥ 768px)
//          lg: (≥ 1024px)
//          xl: (≥ 1280px)
```

### Responsive Grid
```javascript
html`
  <!-- 1 col mobile, 2 tablet, 3 desktop, 4 large -->
  <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
    ${products.map(p => html`<product-card .product="${p}"></product-card>`)}
  </div>
`;
```

### Touch Targets
```javascript
// CRITICAL: Minimum 44px × 44px for mobile touch
html`
  <button class="min-h-[44px] min-w-[44px] px-6 py-3 text-base">
    Click Me
  </button>

  <a href="/cart" class="flex items-center gap-2 min-h-[44px] px-4">
    <i data-lucide="shopping-cart"></i>
    Cart
  </a>
`;
```

### Mobile Navigation

#### Hamburger Menu Pattern
```javascript
export class HeaderMain extends BaseComponent {
  static properties = {
    mobileMenuOpen: { type: Boolean }
  };

  constructor() {
    super();
    this.mobileMenuOpen = false;
  }

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;

    // Prevent body scroll when menu open
    if (this.mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  render() {
    return html`
      <header class="bg-white dark:bg-gray-800 shadow-md">
        <div class="container mx-auto px-4 py-4 flex items-center justify-between">
          <!-- Logo -->
          <a href="/" class="text-2xl font-bold">Store</a>

          <!-- Desktop Nav (hidden on mobile) -->
          <nav class="hidden sm:flex gap-6">
            <a href="/">Home</a>
            <a href="/catalog">Shop</a>
            <a href="/cart">Cart</a>
          </nav>

          <!-- Mobile Hamburger (visible on mobile only) -->
          <button @click="${this.toggleMobileMenu}"
                  class="block sm:hidden p-2 min-h-[44px] min-w-[44px]">
            <i data-lucide="${this.mobileMenuOpen ? 'x' : 'menu'}"></i>
          </button>
        </div>

        <!-- Mobile Menu Overlay -->
        ${this.renderMobileMenu()}
      </header>
    `;
  }

  renderMobileMenu() {
    if (!this.mobileMenuOpen) return '';

    return html`
      <!-- Backdrop -->
      <div class="fixed inset-0 bg-black bg-opacity-50 z-40 sm:hidden"
           @click="${this.toggleMobileMenu}"></div>

      <!-- Slide-in Menu -->
      <nav class="fixed top-0 right-0 h-full w-64 bg-white dark:bg-gray-800 z-50 p-6 sm:hidden">
        <button @click="${this.toggleMobileMenu}"
                class="absolute top-4 right-4 p-2">
          <i data-lucide="x"></i>
        </button>

        <ul class="space-y-4 mt-12">
          <li><a href="/" class="block py-3 text-lg">Home</a></li>
          <li><a href="/catalog" class="block py-3 text-lg">Shop</a></li>
          <li><a href="/cart" class="block py-3 text-lg">Cart</a></li>
          <li><a href="/wishlist" class="block py-3 text-lg">Wishlist</a></li>
        </ul>
      </nav>
    `;
  }
}
```

---

## Dark Mode

### Implementation Pattern
```javascript
html`
  <!-- Container -->
  <div class="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">

    <!-- Headers -->
    <h1 class="text-gray-900 dark:text-white">Title</h1>
    <h2 class="text-gray-800 dark:text-gray-100">Subtitle</h2>

    <!-- Body Text -->
    <p class="text-gray-700 dark:text-gray-300">Content</p>
    <span class="text-gray-600 dark:text-gray-400">Caption</span>

    <!-- Borders -->
    <div class="border border-gray-200 dark:border-gray-700">...</div>

    <!-- Buttons -->
    <button class="bg-blue-600 hover:bg-blue-700 text-white">Primary</button>
    <button class="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600">
      Secondary
    </button>

    <!-- Cards -->
    <div class="bg-white dark:bg-gray-800 shadow-md dark:shadow-lg">
      <p class="text-gray-700 dark:text-gray-300">Card content</p>
    </div>
  </div>
`;
```

### Dark Mode Toggle
```javascript
import { toggleTheme } from '../assets/utils.js';

html`
  <button @click="${toggleTheme}"
          class="p-2 rounded-lg bg-gray-200 dark:bg-gray-700">
    <i data-lucide="sun" class="dark:hidden"></i>
    <i data-lucide="moon" class="hidden dark:block"></i>
  </button>
`;
```

---

## Animations

### AOS (Scroll Animations)

```javascript
// Initialize in app.js
import AOS from 'https://cdn.jsdelivr.net/npm/aos@2.3.4/dist/aos.js';

document.addEventListener('DOMContentLoaded', () => {
  AOS.init({
    duration: 800,
    once: true,
    offset: 100
  });
});
```

```javascript
// Use in components
html`
  <div data-aos="fade-up">Fade up</div>
  <div data-aos="fade-down">Fade down</div>
  <div data-aos="fade-left">Fade left</div>
  <div data-aos="fade-right">Fade right</div>
  <div data-aos="zoom-in">Zoom in</div>
  <div data-aos="flip-up">Flip up</div>

  <!-- With delay and duration -->
  <div data-aos="fade-up" data-aos-delay="200" data-aos-duration="1000">
    Delayed fade
  </div>
`;
```

### GSAP (Complex Animations)
```javascript
import { gsap } from 'https://cdn.jsdelivr.net/npm/gsap@3/index.js';

connectedCallback() {
  super.connectedCallback();

  // Animate on mount
  gsap.from(this.querySelector('.hero'), {
    opacity: 0,
    y: 50,
    duration: 1,
    ease: 'power3.out'
  });
}

handleClick() {
  // Animate on interaction
  gsap.to(this.querySelector('.card'), {
    scale: 1.05,
    duration: 0.3,
    ease: 'power2.out'
  });
}
```

---

## Images (Epicsum)

### Image URL Format
```
http://194.238.23.194/epicsum/media/{type}/{query}?size={size}&index={index}
```

**Parameters:**
- `type`: `image` or `video`
- `query`: Search term (e.g., "laptop", "shoes", "phone")
- `size`: `720` or `1000` (pixels)
- `index`: `0` to `5` (6 variations per query)

### Common Queries by Category

```javascript
const imageQueries = {
  electronics: ['laptop', 'smartphone', 'tablet', 'headphones', 'camera', 'smartwatch'],
  clothing: ['shoes', 'shirt', 'dress', 'jacket', 'jeans', 'sneakers'],
  home: ['chair', 'lamp', 'sofa', 'table', 'plant', 'cushion'],
  sports: ['running shoes', 'basketball', 'yoga mat', 'dumbbell', 'bicycle'],
  beauty: ['perfume', 'lipstick', 'skincare', 'makeup', 'cosmetics']
};
```

### Product Image Examples
```javascript
const products = [
  {
    id: '1',
    name: 'Gaming Laptop',
    image: 'http://194.238.23.194/epicsum/media/image/laptop?size=720&index=0',
    // ...
  },
  {
    id: '2',
    name: 'Wireless Headphones',
    image: 'http://194.238.23.194/epicsum/media/image/headphones?size=720&index=1',
    // ...
  },
  {
    id: '3',
    name: 'Running Shoes',
    image: 'http://194.238.23.194/epicsum/media/image/running%20shoes?size=720&index=0',
    // ...
  }
];
```

### Hero/Banner Images
```javascript
// Use size=1000 for hero images
const heroImage = 'http://194.238.23.194/epicsum/media/image/shopping?size=1000&index=0';
const bannerImage = 'http://194.238.23.194/epicsum/media/image/ecommerce?size=1000&index=2';
```

---

## Infrastructure APIs

### State Management (`assets/state.js`)

```javascript
import { productsStore } from '../assets/state.js';

// Read products
const allProducts = productsStore.products;

// Subscribe to changes
connectedCallback() {
  super.connectedCallback();

  this.unsubscribe = productsStore.subscribe(() => {
    this.products = productsStore.products;
    this.requestUpdate();
  });

  this.products = productsStore.products;
}

disconnectedCallback() {
  super.disconnectedCallback();
  this.unsubscribe?.();
}
```

### Cart Store (`assets/cart.js`)

```javascript
import { cartStore } from '../assets/cart.js';

// Add item
cartStore.addItem(product, quantity = 1);

// Update quantity
cartStore.updateQuantity(productId, newQuantity);

// Remove item
cartStore.removeItem(productId);

// Clear cart
cartStore.clear();

// Get total
const total = cartStore.getTotal();

// Get item count
const count = cartStore.getItemCount();

// Subscribe to changes
this.unsubscribe = cartStore.subscribe(() => {
  this.cartItems = cartStore.items;
  this.cartTotal = cartStore.getTotal();
  this.requestUpdate();
});
```

### Wishlist Store (`assets/wishlist.js`)

```javascript
import { wishlistStore } from '../assets/wishlist.js';

// Add to wishlist
wishlistStore.add(product);

// Remove from wishlist
wishlistStore.remove(productId);

// Check if in wishlist
const isInWishlist = wishlistStore.has(productId);

// Move to cart
wishlistStore.moveToCart(productId);

// Subscribe
this.unsubscribe = wishlistStore.subscribe(() => {
  this.wishlistItems = wishlistStore.items;
  this.requestUpdate();
});
```

### Router (`assets/router.js`)

```javascript
import { router } from '../assets/router.js';

// Navigate programmatically
router.navigate('/catalog');
router.navigate(`/product/${productId}`);

// Get route params (in page component)
const params = router.getParams();
const productId = params.id; // From route: /product/:id

// Register route (in page component file)
customElements.define('page-home', PageHome);
router.addRoute('/', 'page-home');

customElements.define('page-product', PageProduct);
router.addRoute('/product/:id', 'page-product');
```

### Utilities (`assets/utils.js`)

```javascript
import {
  showToast,
  formatCurrency,
  toggleTheme,
  initAOS,
  ensureIcons
} from '../assets/utils.js';

// Show toast notification
showToast('Item added to cart', 'success'); // success | error | info | warning
showToast('Error occurred', 'error');

// Format currency
formatCurrency(1299.99); // "$1,299.99"
formatCurrency(49.5);    // "$49.50"

// Toggle dark mode
toggleTheme(); // Switches between light and dark

// Initialize AOS (called once in app.js)
initAOS();

// Ensure icons render (call after dynamic content updates)
updated() {
  ensureIcons();
}
```

### Product Filters (`assets/product-filters.js`)

```javascript
import { productFilters } from '../assets/product-filters.js';

// Filter by category
const electronics = productFilters.filterByCategory(products, 'electronics');

// Filter by price range
const inRange = productFilters.filterByPriceRange(products, 100, 500);

// Search
const results = productFilters.search(products, 'laptop');

// Sort
const sorted = productFilters.sort(products, 'price-asc'); // price-asc | price-desc | name | rating | newest

// Paginate
const page1 = productFilters.paginate(products, 1, 12); // page 1, 12 items per page
const page2 = productFilters.paginate(products, 2, 12); // page 2

// Chain filters
let filtered = [...products];
filtered = productFilters.filterByCategory(filtered, 'electronics');
filtered = productFilters.search(filtered, 'laptop');
filtered = productFilters.sort(filtered, 'price-asc');
const paged = productFilters.paginate(filtered, 1, 12);
```

---

## Validation

### ESLint Validation

```javascript
// Validate single file
const result = await validate_file_with_eslint('components/product-card.js');

if (result.error_count > 0) {
  console.log('Errors:', result.errors);
  // Fix errors before proceeding
}

// Validate entire project
const projectResult = await validate_project_with_eslint(context);

if (projectResult.error_count > 0) {
  console.log(`${projectResult.error_count} errors found`);
  // Fix all errors
}
```

### Form Validation

```javascript
validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

validateRequired(value) {
  return value && value.trim().length > 0;
}

handleSubmit(e) {
  e.preventDefault();

  const errors = [];

  if (!this.validateRequired(this.name)) {
    errors.push('Name is required');
  }

  if (!this.validateEmail(this.email)) {
    errors.push('Invalid email');
  }

  if (errors.length > 0) {
    showToast(errors.join(', '), 'error');
    return;
  }

  // Proceed with form submission
}
```

---

## Common Dos and Don'ts

### ✅ DO

- **Use Tailwind only** - No custom CSS files
- **Mobile-first responsive** - Always start with mobile layout
- **Dark mode everywhere** - Include `dark:` variants for all colors
- **Touch targets 44px+** - For all clickable elements
- **Subscribe and cleanup** - Always unsubscribe in `disconnectedCallback`
- **Show user feedback** - Use `showToast()` for actions
- **Initialize icons** - Call `ensureIcons()` after dynamic updates
- **Use infrastructure APIs** - Don't reinvent cart, wishlist, router
- **Epicsum for images** - Use provided image service for all product/hero images
- **Validate before completion** - Run ESLint and fix all errors

### ❌ DON'T

- **Don't use shadow DOM** - Breaks Tailwind (always `createRenderRoot() { return this; }`)
- **Don't write custom CSS** - Use Tailwind utilities
- **Don't forget cleanup** - Memory leaks from missing `unsubscribe()`
- **Don't hardcode colors** - Use Tailwind with dark mode support
- **Don't skip mobile** - Mobile users are majority
- **Don't use tiny buttons** - Frustrating on mobile
- **Don't forget icons init** - Lucide icons won't show
- **Don't reinvent state** - Use provided stores
- **Don't use random images** - Only Epicsum service
- **Don't skip validation** - ESLint errors will break production

---

## Performance Best Practices

### Lazy Load Components
```javascript
// Only import components when needed
if (this.showDetails) {
  import('../components/product-detail.js');
}
```

### Debounce Search
```javascript
handleSearchInput(e) {
  clearTimeout(this.searchTimeout);

  this.searchTimeout = setTimeout(() => {
    this.searchQuery = e.target.value;
    this.applyFilters();
  }, 300); // Wait 300ms after user stops typing
}
```

### Virtual Scrolling (for large lists)
```javascript
// Only render visible items
renderProductGrid() {
  const visibleProducts = this.filteredProducts.slice(
    this.scrollIndex,
    this.scrollIndex + this.visibleCount
  );

  return html`
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      ${visibleProducts.map(p => html`<product-card .product="${p}"></product-card>`)}
    </div>
  `;
}
```
