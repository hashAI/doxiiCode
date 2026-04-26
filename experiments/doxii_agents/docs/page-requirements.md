# Page Requirements

Required pages and must-have elements for DOXII e-commerce stores.

## Default Pages (Required)

Every e-commerce store MUST include these pages:

1. **Homepage** (`page-home.js`) - Landing page with hero, featured products
2. **Product Catalog** (`page-catalog.js`) - Browse all products with filters
3. **Product Detail** (`page-product.js`) - Individual product details
4. **Shopping Cart** (`page-cart.js`) - View and manage cart items
5. **Checkout** (`page-checkout.js`) - Complete purchase flow
6. **Wishlist** (`page-wishlist.js`) - Saved items
7. **404 Not Found** (`page-404.js`) - Error page

## Page Structure Template

All pages MUST follow this structure:

```javascript
import { BaseComponent } from '../components/base-component.js';
import { html } from 'lit';
import { router } from '../assets/router.js';

export class PageHome extends BaseComponent {
  createRenderRoot() {
    return this; // No shadow DOM for Tailwind
  }

  connectedCallback() {
    super.connectedCallback();
    // Page-specific setup (subscribe to stores, fetch data, etc.)
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    // Cleanup (unsubscribe, clear timers, etc.)
  }

  render() {
    return html`
      <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
        ${this.renderContent()}
      </div>
    `;
  }

  renderContent() {
    return html`
      <!-- Page content here -->
    `;
  }
}

customElements.define('page-home', PageHome);

// Register route
router.addRoute('/', 'page-home');
```

---

## 1. Homepage (`page-home.js`)

### Must-Haves

✅ **Hero Section**
- Large banner image (Epicsum)
- Headline and tagline
- Call-to-action button (e.g., "Shop Now")
- Background gradient or overlay

✅ **Featured Products**
- 4-8 featured products in grid
- Product cards with image, name, price
- "Add to Cart" and "Add to Wishlist" buttons

✅ **Categories Section** (Optional but recommended)
- Category cards with images
- Links to filtered catalog

✅ **Promotional Banners** (Optional)
- Sale announcements
- Special offers

✅ **Newsletter Signup** (Optional)
- Email capture form

### Example Structure
```javascript
renderContent() {
  return html`
    <!-- Hero Section -->
    <section class="hero-section" data-aos="fade-in">
      <div class="container mx-auto px-4 py-20 text-center">
        <h1 class="text-5xl font-bold mb-4">Welcome to ${this.storeName}</h1>
        <p class="text-xl mb-8">Discover amazing products</p>
        <button @click="${() => router.navigate('/catalog')}"
                class="bg-blue-600 text-white px-8 py-3 rounded-lg">
          Shop Now
        </button>
      </div>
    </section>

    <!-- Featured Products -->
    <section class="py-16">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold mb-8">Featured Products</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          ${this.featuredProducts.map(product => html`
            <product-card .product="${product}"></product-card>
          `)}
        </div>
      </div>
    </section>
  `;
}
```

---

## 2. Product Catalog (`page-catalog.js`)

### Must-Haves

✅ **Product Grid**
- Responsive grid (1 col mobile, 2 tablet, 3-4 desktop)
- Product cards with image, name, brand, price, rating

✅ **Filters** (Sidebar or Top)
- Category filter
- Price range filter
- Brand filter
- Rating filter
- In-stock only toggle

✅ **Sorting**
- Price: Low to High
- Price: High to Low
- Newest
- Rating
- Name (A-Z)

✅ **Search Bar**
- Real-time search
- Clear button

✅ **Pagination**
- Page numbers or Load More button
- Items per page selector (12, 24, 48)

✅ **Empty State**
- Show message when no products match filters

### Example Structure
```javascript
import { productFilters } from '../assets/product-filters.js';

connectedCallback() {
  super.connectedCallback();

  this.unsubscribe = productsStore.subscribe(() => {
    this.allProducts = productsStore.products;
    this.applyFilters();
  });

  this.allProducts = productsStore.products;
  this.applyFilters();
}

applyFilters() {
  let filtered = [...this.allProducts];

  // Apply category filter
  if (this.selectedCategory) {
    filtered = productFilters.filterByCategory(filtered, this.selectedCategory);
  }

  // Apply search
  if (this.searchQuery) {
    filtered = productFilters.search(filtered, this.searchQuery);
  }

  // Apply sorting
  filtered = productFilters.sort(filtered, this.sortBy);

  // Apply pagination
  this.totalPages = Math.ceil(filtered.length / this.itemsPerPage);
  this.filteredProducts = productFilters.paginate(filtered, this.currentPage, this.itemsPerPage);

  this.requestUpdate();
}

renderContent() {
  return html`
    <div class="container mx-auto px-4 py-8">
      <div class="flex flex-col lg:flex-row gap-8">
        <!-- Filters Sidebar -->
        <aside class="lg:w-1/4">${this.renderFilters()}</aside>

        <!-- Products Grid -->
        <main class="lg:w-3/4">
          ${this.renderSearchBar()}
          ${this.renderSortDropdown()}
          ${this.renderProductGrid()}
          ${this.renderPagination()}
        </main>
      </div>
    </div>
  `;
}
```

---

## 3. Product Detail (`page-product.js`)

### Must-Haves

✅ **Product Images**
- Main image (large, high-res)
- Thumbnail gallery (optional)
- Image zoom on hover (optional)

✅ **Product Info**
- Name (h1)
- Brand
- Price (large, prominent)
- Rating (stars + review count)
- Stock status (In Stock / Out of Stock)
- Description (2-3 paragraphs)

✅ **Actions**
- Quantity selector (- / number / +)
- Add to Cart button (large, primary color)
- Add to Wishlist button
- Share buttons (optional)

✅ **Related Products** (Optional but recommended)
- 4-6 related products based on category
- Horizontal scroll or grid

### Example Structure
```javascript
connectedCallback() {
  super.connectedCallback();

  // Get product ID from route params
  const productId = router.getParams().id;
  this.product = productsStore.products.find(p => p.id === productId);

  if (!this.product) {
    router.navigate('/404');
  }
}

handleAddToCart() {
  cartStore.addItem(this.product, this.quantity);
  showToast(`${this.product.name} added to cart`, 'success');
}

renderContent() {
  if (!this.product) return html`<div>Loading...</div>`;

  return html`
    <div class="container mx-auto px-4 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <!-- Product Image -->
        <div>
          <img src="${this.product.image}"
               alt="${this.product.name}"
               class="w-full rounded-lg shadow-lg" />
        </div>

        <!-- Product Info -->
        <div>
          <h1 class="text-4xl font-bold mb-2">${this.product.name}</h1>
          <p class="text-gray-600 mb-4">${this.product.brand}</p>
          <p class="text-3xl font-bold text-blue-600 mb-4">$${this.product.price}</p>

          <div class="flex items-center mb-4">
            <div class="flex text-yellow-400">
              ${this.renderStars(this.product.rating)}
            </div>
            <span class="ml-2 text-gray-600">${this.product.reviews} reviews</span>
          </div>

          <p class="mb-6">${this.product.description}</p>

          <!-- Quantity + Actions -->
          <div class="flex items-center gap-4 mb-6">
            <div class="flex items-center border rounded">
              <button @click="${() => this.decreaseQty()}" class="px-4 py-2">-</button>
              <span class="px-4 py-2">${this.quantity}</span>
              <button @click="${() => this.increaseQty()}" class="px-4 py-2">+</button>
            </div>

            <button @click="${this.handleAddToCart}"
                    class="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg">
              Add to Cart
            </button>

            <button @click="${() => wishlistStore.add(this.product)}"
                    class="px-4 py-3 border rounded-lg">
              <i data-lucide="heart"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Related Products -->
      ${this.renderRelatedProducts()}
    </div>
  `;
}
```

---

## 4. Shopping Cart (`page-cart.js`)

### Must-Haves

✅ **Cart Items List**
- Product image (thumbnail)
- Name, brand, price
- Quantity selector
- Subtotal (price × quantity)
- Remove button

✅ **Cart Summary**
- Subtotal
- Tax (optional)
- Shipping (optional)
- Total (bold, large)

✅ **Actions**
- Continue Shopping button
- Proceed to Checkout button (disabled if cart empty)

✅ **Empty State**
- Message: "Your cart is empty"
- "Continue Shopping" button

### Example Structure
```javascript
connectedCallback() {
  super.connectedCallback();

  this.unsubscribe = cartStore.subscribe(() => {
    this.cartItems = cartStore.items;
    this.total = cartStore.getTotal();
    this.requestUpdate();
  });

  this.cartItems = cartStore.items;
  this.total = cartStore.getTotal();
}

renderContent() {
  if (this.cartItems.length === 0) {
    return this.renderEmptyCart();
  }

  return html`
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold mb-8">Shopping Cart</h1>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Cart Items -->
        <div class="lg:col-span-2">
          ${this.cartItems.map(item => this.renderCartItem(item))}
        </div>

        <!-- Cart Summary -->
        <div class="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg h-fit">
          <h2 class="text-xl font-bold mb-4">Order Summary</h2>
          <div class="space-y-2 mb-4">
            <div class="flex justify-between">
              <span>Subtotal</span>
              <span>$${this.total.toFixed(2)}</span>
            </div>
            <div class="flex justify-between">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div class="border-t pt-2 flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>$${this.total.toFixed(2)}</span>
            </div>
          </div>

          <button @click="${() => router.navigate('/checkout')}"
                  class="w-full bg-blue-600 text-white py-3 rounded-lg">
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  `;
}
```

---

## 5. Checkout (`page-checkout.js`)

### Must-Haves

✅ **Shipping Information**
- Full name
- Email
- Address (street, city, state, zip)
- Phone number

✅ **Payment Method** (UI only, no real payment)
- Credit card option
- PayPal option (placeholder)
- Billing address (same as shipping checkbox)

✅ **Order Review**
- List of items
- Quantities and prices
- Total

✅ **Place Order Button**
- Large, prominent
- Show confirmation after click

### Example Structure
```javascript
renderContent() {
  return html`
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold mb-8">Checkout</h1>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Checkout Form -->
        <div class="lg:col-span-2">
          <form @submit="${this.handleSubmit}">
            <!-- Shipping Info -->
            <section class="mb-8">
              <h2 class="text-xl font-bold mb-4">Shipping Information</h2>
              ${this.renderShippingForm()}
            </section>

            <!-- Payment Method -->
            <section class="mb-8">
              <h2 class="text-xl font-bold mb-4">Payment Method</h2>
              ${this.renderPaymentForm()}
            </section>

            <button type="submit"
                    class="w-full bg-blue-600 text-white py-3 rounded-lg text-lg font-semibold">
              Place Order
            </button>
          </form>
        </div>

        <!-- Order Summary -->
        <div class="lg:col-span-1">
          ${this.renderOrderSummary()}
        </div>
      </div>
    </div>
  `;
}
```

---

## 6. Wishlist (`page-wishlist.js`)

### Must-Haves

✅ **Wishlist Items**
- Product cards similar to catalog
- Remove button
- Move to Cart button

✅ **Empty State**
- Message: "Your wishlist is empty"
- "Browse Products" button

### Example Structure
```javascript
connectedCallback() {
  super.connectedCallback();

  this.unsubscribe = wishlistStore.subscribe(() => {
    this.wishlistItems = wishlistStore.items;
    this.requestUpdate();
  });

  this.wishlistItems = wishlistStore.items;
}

renderContent() {
  if (this.wishlistItems.length === 0) {
    return this.renderEmptyWishlist();
  }

  return html`
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold mb-8">My Wishlist</h1>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        ${this.wishlistItems.map(product => html`
          <div class="relative">
            <product-card .product="${product}"></product-card>
            <button @click="${() => wishlistStore.remove(product.id)}"
                    class="absolute top-2 right-2 bg-white rounded-full p-2">
              <i data-lucide="x"></i>
            </button>
          </div>
        `)}
      </div>
    </div>
  `;
}
```

---

## 7. 404 Not Found (`page-404.js`)

### Must-Haves

✅ **Error Message**
- "404" large number
- "Page Not Found" message
- Friendly description

✅ **Navigation**
- "Go to Homepage" button
- Search bar (optional)
- Popular pages links (optional)

### Example
```javascript
renderContent() {
  return html`
    <div class="container mx-auto px-4 py-20 text-center">
      <h1 class="text-9xl font-bold text-gray-300">404</h1>
      <h2 class="text-3xl font-bold mb-4">Page Not Found</h2>
      <p class="text-gray-600 mb-8">The page you're looking for doesn't exist.</p>
      <button @click="${() => router.navigate('/')}"
              class="bg-blue-600 text-white px-8 py-3 rounded-lg">
        Go to Homepage
      </button>
    </div>
  `;
}
```

---

## Mobile Navigation

### Must-Haves

✅ **Hamburger Menu** (visible on mobile only)
- Toggle button (top-right or top-left)
- Full-screen or slide-in menu
- Close button (X)

✅ **Menu Items**
- Home
- Shop/Catalog
- Cart (with badge count)
- Wishlist
- User Account (optional)

### Example
```javascript
// In header component
renderMobileMenu() {
  return html`
    <!-- Hamburger Button -->
    <button @click="${() => this.toggleMobileMenu()}"
            class="block sm:hidden p-2">
      <i data-lucide="${this.mobileMenuOpen ? 'x' : 'menu'}"></i>
    </button>

    <!-- Mobile Menu Overlay -->
    ${this.mobileMenuOpen ? html`
      <div class="fixed inset-0 bg-black bg-opacity-50 z-40"
           @click="${() => this.toggleMobileMenu()}"></div>
      <nav class="fixed top-0 right-0 h-full w-64 bg-white dark:bg-gray-800 z-50 p-6">
        <button @click="${() => this.toggleMobileMenu()}"
                class="absolute top-4 right-4">
          <i data-lucide="x"></i>
        </button>

        <ul class="space-y-4 mt-12">
          <li><a href="/" class="block py-2">Home</a></li>
          <li><a href="/catalog" class="block py-2">Shop</a></li>
          <li><a href="/cart" class="block py-2">Cart (${this.cartCount})</a></li>
          <li><a href="/wishlist" class="block py-2">Wishlist</a></li>
        </ul>
      </nav>
    ` : ''}
  `;
}
```
