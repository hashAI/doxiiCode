# Component Design Guide

How to design and build custom Lit Web Components for DOXII e-commerce stores.

## Base Component Pattern

All custom components MUST extend `BaseComponent`:

```javascript
import { BaseComponent } from '../components/base-component.js';

export class ProductCard extends BaseComponent {
  static properties = {
    product: { type: Object },
    compact: { type: Boolean }
  };

  constructor() {
    super();
    this.product = null;
    this.compact = false;
  }

  // CRITICAL: Disable shadow DOM for Tailwind
  createRenderRoot() {
    return this;
  }

  render() {
    if (!this.product) return html`<div>Loading...</div>`;

    return html`
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
        <img src="${this.product.image}" alt="${this.product.name}"
             class="w-full h-48 object-cover rounded" />
        <h3 class="text-lg font-semibold mt-2">${this.product.name}</h3>
        <p class="text-gray-600 dark:text-gray-300">$${this.product.price}</p>
      </div>
    `;
  }
}

customElements.define('product-card', ProductCard);
```

## Component Structure

### 1. Imports
```javascript
import { BaseComponent } from '../components/base-component.js';
import { html } from 'lit';
import { cartStore } from '../assets/cart.js';
import { showToast } from '../assets/utils.js';
```

### 2. Properties
```javascript
static properties = {
  // Data properties
  product: { type: Object },
  products: { type: Array },

  // UI state
  isOpen: { type: Boolean },
  isLoading: { type: Boolean },

  // Configuration
  variant: { type: String }, // 'compact' | 'full'
  showPrice: { type: Boolean }
};
```

### 3. Constructor
```javascript
constructor() {
  super();

  // Initialize all properties with defaults
  this.product = null;
  this.isOpen = false;
  this.variant = 'full';
}
```

### 4. Lifecycle Methods
```javascript
connectedCallback() {
  super.connectedCallback();

  // Subscribe to stores, add event listeners
  this.unsubscribe = cartStore.subscribe(() => this.requestUpdate());
}

disconnectedCallback() {
  super.disconnectedCallback();

  // Cleanup: unsubscribe, remove listeners
  this.unsubscribe?.();
}
```

### 5. Event Handlers
```javascript
handleAddToCart(product) {
  cartStore.addItem(product);
  showToast(`${product.name} added to cart`, 'success');

  // Dispatch custom event for parent components
  this.dispatchEvent(new CustomEvent('item-added', {
    detail: { product },
    bubbles: true,
    composed: true
  }));
}
```

### 6. Render Method
```javascript
render() {
  return html`
    <div class="component-root">
      ${this.renderHeader()}
      ${this.renderContent()}
      ${this.renderFooter()}
    </div>
  `;
}

// Helper render methods
renderHeader() {
  return html`<header>...</header>`;
}
```

## Naming Conventions

### Component Files
- **kebab-case**: `product-card.js`, `header-main.js`, `cart-item.js`
- **Prefix patterns**: `header-*`, `footer-*`, `product-*`, `cart-*`

### Tag Names
```javascript
// ✅ GOOD
customElements.define('product-card', ProductCard);
customElements.define('header-main', HeaderMain);
customElements.define('cart-item', CartItem);

// ❌ BAD
customElements.define('ProductCard', ProductCard); // Not kebab-case
customElements.define('product_card', ProductCard); // Underscore not allowed
```

### Class Names
```javascript
// ✅ GOOD
export class ProductCard extends BaseComponent {}
export class HeaderMain extends BaseComponent {}

// ❌ BAD
export class productCard extends BaseComponent {} // Not PascalCase
export class Product_Card extends BaseComponent {} // Underscore not convention
```

## Styling with Tailwind

### Responsive Design (Mobile-First)
```javascript
// Mobile first, then larger screens
html`
  <div class="
    w-full p-4           <!-- Mobile: full width, padding 4 -->
    sm:w-1/2 sm:p-6      <!-- Tablet: half width, padding 6 -->
    lg:w-1/3 lg:p-8      <!-- Desktop: third width, padding 8 -->
  ">
    ...
  </div>
`;
```

### Dark Mode Support
```javascript
html`
  <div class="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
    <h2 class="text-gray-800 dark:text-gray-100">Title</h2>
    <p class="text-gray-600 dark:text-gray-300">Content</p>
  </div>
`;
```

### Touch Targets (Mobile)
```javascript
// Minimum 44px × 44px for touch targets
html`
  <button class="
    min-h-[44px] min-w-[44px]  <!-- Minimum touch target -->
    px-6 py-3                  <!-- Comfortable padding -->
    text-base font-medium       <!-- Readable text -->
  ">
    Add to Cart
  </button>
`;
```

## State Management

### Reading State
```javascript
import { productsStore } from '../assets/state.js';

connectedCallback() {
  super.connectedCallback();

  // Subscribe to store updates
  this.unsubscribe = productsStore.subscribe(() => {
    this.products = productsStore.products;
    this.requestUpdate(); // Trigger re-render
  });

  // Initial load
  this.products = productsStore.products;
}

disconnectedCallback() {
  super.disconnectedCallback();
  this.unsubscribe?.(); // Cleanup
}
```

### Writing State (Cart, Wishlist)
```javascript
import { cartStore } from '../assets/cart.js';
import { wishlistStore } from '../assets/wishlist.js';

handleAddToCart(product) {
  cartStore.addItem(product, quantity);
  showToast(`${product.name} added to cart`, 'success');
}

handleAddToWishlist(product) {
  wishlistStore.add(product);
  showToast(`${product.name} added to wishlist`, 'success');
}
```

## Icons (Lucide)

```javascript
import { ensureIcons } from '../assets/utils.js';

updated() {
  ensureIcons(); // Re-initialize icons after update
}

render() {
  return html`
    <button>
      <i data-lucide="shopping-cart" class="w-5 h-5"></i>
      Add to Cart
    </button>
    <i data-lucide="heart"></i>
    <i data-lucide="user"></i>
    <i data-lucide="search"></i>
  `;
}
```

## Animations

### AOS (Scroll Animations)
```javascript
html`
  <div
    data-aos="fade-up"
    data-aos-duration="800"
    data-aos-delay="200"
  >
    Content here
  </div>
`;
```

### GSAP (Complex Animations)
```javascript
import { gsap } from 'https://cdn.jsdelivr.net/npm/gsap@3/index.js';

connectedCallback() {
  super.connectedCallback();

  // Animate on mount
  gsap.from(this, {
    opacity: 0,
    y: 20,
    duration: 0.5
  });
}
```

## Critical Dos and Don'ts

### ✅ DO

- **Always extend BaseComponent**: `class MyComponent extends BaseComponent {}`
- **Disable shadow DOM**: `createRenderRoot() { return this; }`
- **Use Tailwind only**: No custom CSS files
- **Mobile-first responsive**: Start with mobile, scale up
- **Dark mode support**: Always include `dark:` variants
- **Touch targets 44px+**: For mobile usability
- **Subscribe and cleanup**: Use `connectedCallback` / `disconnectedCallback`
- **Show feedback**: Use `showToast()` for user actions
- **Initialize icons**: Call `ensureIcons()` after render
- **Kebab-case naming**: `product-card`, not `ProductCard` or `product_card`

### ❌ DON'T

- **Don't use shadow DOM**: Breaks Tailwind styling
- **Don't write custom CSS**: Use Tailwind utilities only
- **Don't forget cleanup**: Always unsubscribe in `disconnectedCallback`
- **Don't hardcode colors**: Use Tailwind color utilities with dark mode
- **Don't skip mobile**: Always test responsive behavior
- **Don't use small touch targets**: Minimum 44px for buttons/links
- **Don't forget icons**: Initialize `lucide.createIcons()` or `ensureIcons()`
- **Don't mutate props directly**: Use reactive properties
- **Don't mix naming**: Stick to kebab-case for tags, PascalCase for classes

## Common Component Types

### Header Components
```javascript
// header-main.js, header-minimal.js, header-sticky.js
- Logo/brand
- Navigation (desktop + mobile hamburger)
- Search bar (optional)
- Cart icon with count badge
- User menu
- Dark mode toggle
```

### Footer Components
```javascript
// footer-main.js, footer-minimal.js
- Links (About, Contact, Privacy, Terms)
- Social media icons
- Newsletter signup (optional)
- Copyright notice
```

### Product Components
```javascript
// product-card.js, product-grid.js, product-detail.js
- Product image
- Name, brand, price
- Rating and reviews
- Add to cart button
- Add to wishlist button
- Stock status
```

### Form Components
```javascript
// form-input.js, form-select.js, form-checkbox.js
- Label
- Input/select/checkbox
- Validation state
- Error message
- Help text
```
