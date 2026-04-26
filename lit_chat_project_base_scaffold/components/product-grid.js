import { BaseComponent } from './base-component.js';
import { products } from '../assets/state.js';

class EcomProductGrid extends BaseComponent {
  static properties = {
    items: { type: Array },
    title: { type: String }
  };

  constructor() {
    super();
    this.items = products;
    this.title = 'Featured';
  }

  render() {
    const list = Array.isArray(this.items) ? this.items : [];
    return this.html`
      <section class="container mx-auto px-4 mt-10">
        <div class="flex items-center justify-between mb-4">
          <h2 class="font-semibold text-xl">${this.title}</h2>
          <a href="#/catalog" class="inline-flex items-center gap-1 text-sm text-brand-700 hover:text-brand-800">View all <i data-lucide="arrow-right" class="w-4 h-4"></i></a>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          ${list.map((p) => this.html`<ecom-product-card .product=${p}></ecom-product-card>`) }
        </div>
      </section>
    `;
  }
}

customElements.define('ecom-product-grid', EcomProductGrid);


