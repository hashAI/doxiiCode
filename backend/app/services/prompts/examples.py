"""
Code examples and patterns for the DOXII chat agent.
"""


class CodeExamples:
    """Contains code examples and patterns for different components."""

    @staticmethod
    def get_base_component_pattern() -> str:
        """Base component pattern for all custom elements."""
        return """### Base Component Pattern (components/base-component.js):
```javascript
import { LitElement, html, nothing } from 'https://cdn.jsdelivr.net/npm/lit@3.2.1/+esm';
import { ensureIcons, refreshAOS } from '../assets/utils.js';

export class BaseComponent extends LitElement {
  // Disable Shadow DOM so Tailwind utility classes apply
  createRenderRoot() { return this; }

  updated() {
    ensureIcons(this);
    refreshAOS();
  }

  // Read JSON passed via attribute like data-params
  readJsonAttr(name, fallback = null) {
    try { return JSON.parse(this.getAttribute(name) || 'null') ?? fallback; }
    catch { return fallback; }
  }

  html(strings, ...values) { return html(strings, ...values); }
  nothing() { return nothing; }
}

customElements.define('base-component', BaseComponent);
```"""

    @staticmethod
    def get_state_management_pattern() -> str:
        """State management pattern with cart functionality."""
        return """### State Management Pattern (assets/state.js):
```javascript
// GENERATE UNIQUE PRODUCT DATA based on the business context
// Vary product names, categories, prices based on the specific ecommerce site
// Use diverse image seeds for visual variety
export const products = [
  // CUSTOMIZE: Generate products relevant to the specific business/niche
  // Examples for different contexts:
  // Tech: 'Wireless Headphones', 'Smart Watch', 'Bluetooth Speaker'
  // Fashion: 'Summer Dress', 'Denim Jacket', 'Canvas Sneakers'
  // Home: 'Ceramic Vase', 'Wooden Table', 'LED Lamp'
  // Beauty: 'Organic Serum', 'Clay Mask', 'Lip Balm'
  // Use relevant categories, realistic pricing, and varied image seeds
];

export function getProductById(id) {
  return products.find(p => p.id === id);
}

// Cart store with localStorage persistence
const cartStorageKey = 'lit_ecom_cart_v1';
const subscribers = new Set();

export const cartStore = {
  items: (() => { try { return JSON.parse(localStorage.getItem(cartStorageKey) || '[]'); } catch { return []; } })(),

  subscribe(fn) {
    subscribers.add(fn);
    fn(this);
    return () => subscribers.delete(fn);
  },

  _notify() {
    try { localStorage.setItem(cartStorageKey, JSON.stringify(this.items)); } catch {}
    subscribers.forEach(fn => fn(this));
    document.dispatchEvent(new CustomEvent('cart:updated', { detail: this }));
  },

  add(productId, qty = 1) {
    const existing = this.items.find(i => i.productId === productId);
    if (existing) existing.qty += qty;
    else this.items.push({ productId, qty });
    this._notify();
  },

  remove(productId) {
    this.items = this.items.filter(i => i.productId !== productId);
    this._notify();
  },

  totalItems() { return this.items.reduce((sum, i) => sum + i.qty, 0); },
  totalPrice() { return this.items.reduce((sum, i) => sum + (getProductById(i.productId)?.price || 0) * i.qty, 0); }
};
```"""

    @staticmethod
    def get_router_pattern() -> str:
        """Router pattern for SPA navigation."""
        return """### Router Pattern (assets/router.js):
// Browser History API SPA router with :param support
const compiledRoutes = [];

function compile(path, component) {
  const names = [];
  const regex = new RegExp('^' + path.replace(/:[^/]+/g, m => {
    names.push(m.slice(1));
    return '([^/]+)';
  }) + '$');
  return { path, regex, names, component };
}

export function setRoutes(routes) {
  compiledRoutes.length = 0;
  routes.forEach(r => compiledRoutes.push(compile(r.path, r.component)));
  render();
}

export function navigate(path) {
  const urlPath = path.startsWith('/') ? path : '/' + path;
  history.pushState({}, '', urlPath);
  render();
}

export function render() {
  const pathname = window.location.pathname || '/';
  const match = compiledRoutes.find(r => pathname.match(r.regex));
  const mount = document.querySelector('#app');
  if (!mount) return;

  mount.innerHTML = '';
  const tag = match ? match.component : 'page-home';
  const el = document.createElement(tag);

  if (match) {
    const params = {};
    const matches = pathname.match(match.regex);
    match.names.forEach((name, i) => params[name] = matches[i + 1]);
    el.setAttribute('data-params', JSON.stringify(params));
  }

  mount.appendChild(el);
  document.dispatchEvent(new CustomEvent('route:changed'));
}

// handle back/forward navigation
window.addEventListener('popstate', render);

// handle initial load
document.addEventListener('DOMContentLoaded', render);
```"""

    @staticmethod
    def get_utilities_pattern() -> str:
        """Utilities pattern for common functions."""
        return """### Utilities Pattern (assets/utils.js):
```javascript
export function ensureIcons(container = document) {
  if (window.lucide?.createIcons) {
    window.lucide.createIcons({ nameAttr: 'data-lucide' });
  }
}

export function initAOS() {
  if (window.AOS) {
    window.AOS.init({
      duration: 800,
      easing: 'ease-out-cubic',
      once: true,
      offset: 100
    });
  }
}

export function refreshAOS() {
  if (window.AOS) window.AOS.refresh();
}
```"""

    @staticmethod
    def get_header_component_pattern() -> str:
        """Header component with cart integration."""
        return """### Header Component (components/header.js):
```javascript
import { BaseComponent } from './base-component.js';
import { navigate } from '../assets/router.js';
import { cartStore } from '../assets/state.js';

class EcomHeader extends BaseComponent {
  constructor() {
    super();
    this.cartCount = cartStore.totalItems();
  }

  connectedCallback() {
    super.connectedCallback();
    this._unsubscribe = cartStore.subscribe(() => {
      this.cartCount = cartStore.totalItems();
      this.requestUpdate();
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback?.();
    if (this._unsubscribe) this._unsubscribe();
  }

  render() {
    const hash = window.location.hash || '#/';
    return this.html`
      <header class="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-gray-200">
        <div class="container mx-auto px-4">
          <div class="flex items-center justify-between h-16">
            <button class="flex items-center gap-2" @click=${() => navigate('/')}>
              <i data-lucide="flower-2" class="w-6 h-6 text-brand-600"></i>
              <span class="font-bold text-lg">doxii</span>
            </button>
            <nav class="hidden md:flex gap-6">
              <button class="hover:text-brand-600 ${hash==='#/'?'text-brand-700 font-medium':''}" @click=${() => navigate('/')}>Home</button>
              <button class="hover:text-brand-600 ${hash.startsWith('#/catalog')?'text-brand-700 font-medium':''}" @click=${() => navigate('/catalog')}>Catalog</button>
            </nav>
            <button class="relative p-2 hover:bg-gray-100 rounded" @click=${() => document.dispatchEvent(new CustomEvent('cart:open'))}>
              <i data-lucide="shopping-cart" class="w-5 h-5"></i>
              ${this.cartCount > 0 ? this.html`<span class="absolute -top-1 -right-1 bg-brand-600 text-white text-xs px-1.5 py-0.5 rounded-full">${this.cartCount}</span>` : ''}
            </button>
          </div>
        </div>
      </header>
    `;
  }
}

customElements.define('ecom-header', EcomHeader);
```"""

    @staticmethod
    def get_product_card_pattern() -> str:
        """Product card component pattern."""
        return """### Product Card Component (components/product-card.js):
```javascript
import { BaseComponent } from './base-component.js';
import { navigate } from '../assets/router.js';
import { cartStore } from '../assets/state.js';

class ProductCard extends BaseComponent {
  static get properties() {
    return { product: { type: Object } };
  }

  render() {
    if (!this.product) return this.html`<div class="bg-gray-100 animate-pulse rounded-lg h-80"></div>`;

    const { id, name, price, rating, badge, image, category } = this.product;

    return this.html`
      <div class="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden group" data-aos="fade-up">
        <div class="relative overflow-hidden">
          <img src="${image}" alt="${name}" class="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300">
          ${badge ? this.html`<span class="absolute top-3 left-3 bg-brand-600 text-white px-2 py-1 text-xs font-medium rounded">${badge}</span>` : ''}
        </div>
        <div class="p-4">
          <div class="text-xs text-gray-500 mb-1">${category}</div>
          <h3 class="font-semibold text-gray-900 mb-2 line-clamp-2 cursor-pointer hover:text-brand-600"
              @click=${() => navigate(`/product/${id}`)}>${name}</h3>
          <div class="flex items-center gap-2 mb-3">
            <div class="flex text-yellow-400">
              ${Array(5).fill().map((_, i) => this.html`
                <i data-lucide="star" class="w-4 h-4 ${i < Math.floor(rating) ? 'fill-current' : ''}"></i>
              `)}
            </div>
            <span class="text-sm text-gray-600">${rating}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-lg font-bold text-gray-900">$${price.toFixed(2)}</span>
            <button class="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                    @click=${() => { cartStore.add(id); }}>
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('product-card', ProductCard);
```"""

    @staticmethod
    def get_app_bootstrap_pattern() -> str:
        """App bootstrap pattern."""
        return """### App Bootstrap (assets/app.js):
```javascript
import { initAOS, refreshAOS, ensureIcons } from './utils.js';
import { setRoutes } from './router.js';

// Import all components
import '../components/base-component.js';
import '../components/header.js';
import '../components/footer.js';
import '../components/hero.js';
import '../components/product-card.js';
import '../components/product-grid.js';
import '../components/cart-drawer.js';

// Import all pages
import '../pages/page-home.js';
import '../pages/page-catalog.js';
import '../pages/page-product.js';
import '../pages/page-cart.js';

document.addEventListener('DOMContentLoaded', () => {
  // Initialize vendors
  if (window.lucide?.createIcons) window.lucide.createIcons();
  initAOS();

  // Setup route change handler
  document.addEventListener('route:changed', () => {
    queueMicrotask(() => {
      ensureIcons();
      refreshAOS();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });

  // Define routes
  setRoutes([
    { path: '/', component: 'page-home' },
    { path: '/catalog', component: 'page-catalog' },
    { path: '/product/:id', component: 'page-product' },
    { path: '/cart', component: 'page-cart' }
  ]);
});
```"""

    @staticmethod
    def get_home_page_pattern() -> str:
        """Home page component pattern."""
        return """## Pages (pages/page-home.js):
```javascript
import { BaseComponent } from '../components/base-component.js';

class PageHome extends BaseComponent {
  render() {
    return this.html`
      <ecom-hero></ecom-hero>
      <ecom-product-grid title="Featured"></ecom-product-grid>
      <section class="container mx-auto px-4 mt-16 grid md:grid-cols-3 gap-6" data-aos="fade-up">
        <div class="p-6 rounded-lg border bg-white">
          <div class="flex items-center gap-2 font-semibold"><i data-lucide="truck" class="w-5 h-5 text-brand-600"></i> Free shipping</div>
          <p class="mt-2 text-sm text-gray-600">Enjoy free shipping on orders over $50 in the US.</p>
        </div>
        <div class="p-6 rounded-lg border bg-white">
          <div class="flex items-center gap-2 font-semibold"><i data-lucide="shield-check" class="w-5 h-5 text-brand-600"></i> Secure checkout</div>
          <p class="mt-2 text-sm text-gray-600">We use industry‑standard encryption to protect your data.</p>
        </div>
        <div class="p-6 rounded-lg border bg-white">
          <div class="flex items-center gap-2 font-semibold"><i data-lucide="refresh-ccw" class="w-5 h-5 text-brand-600"></i> Easy returns</div>
          <p class="mt-2 text-sm text-gray-600">30‑day return policy. Love it or your money back.</p>
        </div>
      </section>
    `;
  }
}

customElements.define('page-home', PageHome);
```"""