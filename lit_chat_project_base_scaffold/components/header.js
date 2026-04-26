import { BaseComponent } from './base-component.js';
import { navigate } from '../assets/router.js';
import { cartStore } from '../assets/state.js';

class EcomHeader extends BaseComponent {
  constructor() {
    super();
    this._unsubscribe = null;
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

  onCartClick() {
    document.dispatchEvent(new CustomEvent('cart:open'));
  }

  render() {
    const hash = window.location.hash || '#/';
    return this.html`
      <header class="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-gray-200">
        <div class="container mx-auto px-4">
          <div class="flex items-center justify-between h-16">
            <div class="flex items-center gap-3">
              <button class="flex items-center gap-2" @click=${() => navigate('/')}
                aria-label="Go to home">
                <i data-lucide="flower-2" class="w-6 h-6 text-brand-600"></i>
                <span class="font-bold text-lg tracking-tight">doxii</span>
              </button>
              <nav class="hidden md:flex items-center gap-6 ml-6 text-sm">
                <button class="hover:text-brand-600 ${hash==='#/'?'text-brand-700 font-medium':''}" @click=${() => navigate('/')}>Home</button>
                <button class="hover:text-brand-600 ${hash.startsWith('#/catalog')?'text-brand-700 font-medium':''}" @click=${() => navigate('/catalog')}>Catalog</button>
              </nav>
            </div>
            <div class="flex items-center gap-3">
              <button class="relative px-3 py-1 rounded-md hover:bg-gray-100" @click=${() => navigate('/catalog')}>
                <i data-lucide="search" class="w-5 h-5"></i>
              </button>
              <button class="relative px-3 py-1 rounded-md hover:bg-gray-100" @click=${() => this.onCartClick()} aria-label="Open cart">
                <i data-lucide="shopping-cart" class="w-5 h-5"></i>
                ${this.cartCount > 0 ? this.html`<span class="absolute -top-1 -right-1 bg-brand-600 text-white text-[10px] leading-none px-1.5 py-0.5 rounded-full">${this.cartCount}</span>` : this.nothing()}
              </button>
            </div>
          </div>
        </div>
      </header>
    `;
  }
}

customElements.define('ecom-header', EcomHeader);


