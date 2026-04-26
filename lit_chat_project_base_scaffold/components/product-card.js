import { BaseComponent } from './base-component.js';
import { currency } from '../assets/utils.js';
import { navigate } from '../assets/router.js';
import { cartStore } from '../assets/state.js';

class EcomProductCard extends BaseComponent {
  static properties = {
    product: { type: Object }
  };

  constructor() {
    super();
    this.product = null;
  }

  addToCart(e) {
    e.stopPropagation();
    if (!this.product) return;
    cartStore.add(this.product.id, 1);
    document.dispatchEvent(new CustomEvent('cart:open'));
  }

  openDetail() {
    if (!this.product) return;
    navigate(`/product/${this.product.id}`);
  }

  render() {
    const p = this.product;
    if (!p) return this.nothing();
    return this.html`
      <article class="group rounded-lg border border-gray-200 overflow-hidden bg-white shadow-card" data-aos="fade-up">
        <div class="relative aspect-square overflow-hidden">
          <img src="${p.image}" alt="${p.name}" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" @click=${() => this.openDetail()} />
          ${p.badge ? this.html`<span class="absolute top-2 left-2 bg-white/90 backdrop-blur px-2 py-0.5 rounded text-xs font-medium">${p.badge}</span>` : this.nothing()}
          <button class="absolute bottom-2 right-2 inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-brand-600 text-white text-sm hover:bg-brand-700" @click=${(e) => this.addToCart(e)}>
            <i data-lucide="shopping-bag" class="w-4 h-4"></i> Add
          </button>
        </div>
        <div class="p-3">
          <h3 class="font-medium line-clamp-1">${p.name}</h3>
          <div class="mt-1 flex items-center justify-between text-sm text-gray-600">
            <span>${p.category}</span>
            <span class="font-semibold text-gray-900">${currency(p.price)}</span>
          </div>
          <div class="mt-2 flex items-center gap-1 text-amber-500">
            <i data-lucide="star" class="w-4 h-4 fill-amber-500 stroke-amber-500"></i>
            <span class="text-xs text-gray-600">${p.rating}</span>
          </div>
        </div>
      </article>
    `;
  }
}

customElements.define('ecom-product-card', EcomProductCard);


