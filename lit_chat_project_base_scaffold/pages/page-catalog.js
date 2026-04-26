import { BaseComponent } from '../components/base-component.js';
import { products } from '../assets/state.js';

class PageCatalog extends BaseComponent {
  static properties = {
    query: { type: String },
    filtered: { type: Array },
    category: { type: String }
  };

  constructor() {
    super();
    this.query = '';
    this.filtered = products;
    this.category = 'All';
  }

  onSearch(e) {
    this.query = e.target.value;
    const q = this.query.toLowerCase();
    this.applyFilters();
  }

  onCategory(cat) {
    this.category = cat;
    this.applyFilters();
  }

  applyFilters() {
    const q = this.query.toLowerCase();
    this.filtered = products.filter(p => {
      const matchesQuery = p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
      const matchesCat = this.category === 'All' ? true : p.category === this.category;
      return matchesQuery && matchesCat;
    });
  }

  render() {
    const cats = ['All', ...Array.from(new Set(products.map(p => p.category)))];
    return this.html`
      <section class="container mx-auto px-4 mt-8">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <h1 class="text-2xl font-semibold">Catalog</h1>
          <div class="relative w-full md:w-80">
            <i data-lucide="search" class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
            <input type="text" placeholder="Search products..." class="w-full pl-9 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500" @input=${(e) => this.onSearch(e)} />
          </div>
        </div>
        <div class="mt-4 flex flex-wrap gap-2">
          ${cats.map(cat => this.html`
            <button class="px-3 py-1.5 rounded-full border ${this.category===cat?'bg-brand-600 text-white border-brand-600':'bg-white hover:bg-gray-50'}" @click=${() => this.onCategory(cat)}>
              ${cat}
            </button>
          `)}
        </div>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
          ${this.filtered.map(p => this.html`<ecom-product-card .product=${p}></ecom-product-card>`) }
        </div>
      </section>
    `;
  }
}

customElements.define('page-catalog', PageCatalog);


