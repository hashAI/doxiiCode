import { BaseComponent } from '../components/base-component.js';
import { getProductById, cartStore } from '../assets/state.js';
import { currency } from '../assets/utils.js';

class PageProduct extends BaseComponent {
  static properties = { pid: { type: String }, product: { type: Object }, qty: { type: Number } };
  constructor() {
    super();
    this.pid = null;
    this.product = null;
    this.qty = 1;
  }
  connectedCallback() {
    super.connectedCallback();
    const params = this.readJsonAttr('data-params', {});
    this.pid = params?.id;
    this.product = getProductById(this.pid);
  }
  addToCart() { if (this.product) cartStore.add(this.product.id, this.qty); document.dispatchEvent(new CustomEvent('cart:open')); }
  qtyDelta(d) { this.qty = Math.max(1, this.qty + d); this.requestUpdate(); }
  render() {
    const p = this.product;
    if (!p) return this.html`<section class="container mx-auto px-4 py-16">Not found.</section>`;
    return this.html`
      <section class="container mx-auto px-4 py-10 grid md:grid-cols-2 gap-8">
        <div class="aspect-square rounded-lg overflow-hidden border bg-white" data-aos="fade-right">
          <img class="w-full h-full object-cover" src="${p.image}" alt="${p.name}" />
        </div>
        <div data-aos="fade-left">
          <h1 class="text-2xl md:text-3xl font-semibold">${p.name}</h1>
          <div class="mt-2 text-gray-600">${p.category}</div>
          <div class="mt-4 text-xl font-bold">${currency(p.price)}</div>
          <p class="mt-4 text-gray-700">${p.description}</p>
          <div class="mt-6 flex items-center gap-3">
            <div class="flex items-center gap-2 border rounded-md"> 
              <button class="px-3 py-2" @click=${() => this.qtyDelta(-1)}>-</button>
              <span class="w-8 text-center">${this.qty}</span>
              <button class="px-3 py-2" @click=${() => this.qtyDelta(1)}>+</button>
            </div>
            <button class="inline-flex items-center gap-2 px-5 py-3 rounded-md bg-brand-600 text-white hover:bg-brand-700" @click=${() => this.addToCart()}>
              <i data-lucide="shopping-cart" class="w-4 h-4"></i> Add to cart
            </button>
          </div>
        </div>
      </section>
      <section class="container mx-auto px-4 mt-10">
        <h2 class="font-semibold text-xl mb-4">You may also like</h2>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <ecom-product-card .product=${getProductById('p-1')}></ecom-product-card>
          <ecom-product-card .product=${getProductById('p-2')}></ecom-product-card>
          <ecom-product-card .product=${getProductById('p-3')}></ecom-product-card>
          <ecom-product-card .product=${getProductById('p-4')}></ecom-product-card>
        </div>
      </section>
    `;
  }
}

customElements.define('page-product', PageProduct);


