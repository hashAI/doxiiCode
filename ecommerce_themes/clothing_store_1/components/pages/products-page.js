import { BaseComponent } from '../../components/base-component.js';
import { productsStore } from '../../assets/state.js';
import '../ui/product-card.js';

class ProductsPage extends BaseComponent {
    static properties = {
        search: { state: true },
        category: { state: true },
        price: { state: true }
    };

    constructor() {
        super();
        this.search = '';
        this.category = '';
        this.price = 'all';
    }

    connectedCallback() {
        super.connectedCallback?.();
        const query = this.getQuery();
        if (query?.category) {
            this.category = query.category;
        }
    }

    get filteredProducts() {
        return productsStore.products.filter(product => {
            const matchesSearch = this.search
                ? product.name.toLowerCase().includes(this.search.toLowerCase()) ||
                  product.description.toLowerCase().includes(this.search.toLowerCase())
                : true;

            const matchesCategory = this.category ? product.category === this.category : true;

            let matchesPrice = true;
            if (this.price === 'under-150') {
                matchesPrice = product.price < 150;
            } else if (this.price === '150-250') {
                matchesPrice = product.price >= 150 && product.price <= 250;
            } else if (this.price === '250-plus') {
                matchesPrice = product.price > 250;
            }

            return matchesSearch && matchesCategory && matchesPrice;
        });
    }

    render() {
        const categories = productsStore.getCategories();
        return this.html`
            <section class="mx-auto max-w-6xl px-6 py-8 space-y-10">
                <div class="space-y-4" data-aos="fade-up">
                    <p class="text-xs uppercase tracking-[0.4em] text-ink-400">Collections</p>
                    <h1 class="text-4xl font-display">Tailored edits for every moment.</h1>
                    <p class="text-ink-500 max-w-2xl">
                        Filter by category, fabric, and investment level to compose your wardrobe narrative.
                    </p>
                </div>

                <div class="space-y-8 lg:grid lg:gap-8 lg:grid-cols-[280px,1fr] lg:space-y-0">
                    <aside class="border border-ink-100 dark:border-ink-800 rounded-3xl p-6 space-y-6" data-aos="fade-right">
                        <div>
                            <p class="text-xs uppercase tracking-[0.4em] text-ink-400 mb-3">Search</p>
                            <div class="relative">
                                <i data-lucide="search" class="absolute left-4 top-1/2 -translate-y-1/2 text-ink-400 w-4 h-4"></i>
                                <input
                                    type="text"
                                    class="w-full pl-11 pr-4 py-3 rounded-full border border-ink-100 dark:border-ink-800 bg-transparent"
                                    placeholder="Tailored, knit, cashmere..."
                                    .value=${this.search}
                                    @input=${event => this.search = event.target.value}
                                >
                            </div>
                        </div>

                        <div>
                            <p class="text-xs uppercase tracking-[0.4em] text-ink-400 mb-3">Category</p>
                            <div class="flex flex-wrap gap-2">
                                <button
                                    class=${this.filterChipClass('')}
                                    @click=${() => this.category = ''}
                                >All</button>
                                ${categories.map(cat => this.html`
                                    <button class=${this.filterChipClass(cat)} @click=${() => this.category = cat}>
                                        ${cat}
                                    </button>
                                `)}
                            </div>
                        </div>

                        <div>
                            <p class="text-xs uppercase tracking-[0.4em] text-ink-400 mb-3">Investment</p>
                            <div class="space-y-2">
                                ${[
                                    { label: 'All pieces', value: 'all' },
                                    { label: 'Under $150', value: 'under-150' },
                                    { label: '$150 - $250', value: '150-250' },
                                    { label: '$250+', value: '250-plus' }
                                ].map(option => this.html`
                                    <label class="flex items-center gap-3">
                                        <input
                                            type="radio"
                                            name="price"
                                            value="${option.value}"
                                            ?checked=${this.price === option.value}
                                            @change=${() => this.price = option.value}
                                        >
                                        <span>${option.label}</span>
                                    </label>
                                `)}
                            </div>
                        </div>
                    </aside>

                    <div class="space-y-6" data-aos="fade-left">
                        <div class="flex items-center justify-between text-sm text-ink-500">
                            <p>${this.filteredProducts.length} pieces curated</p>
                        </div>
                        <div class="grid gap-6 sm:grid-cols-2">
                            ${this.filteredProducts.map(product => this.html`
                                <product-card data-product=${JSON.stringify(product)}></product-card>
                            `)}
                        </div>
                    </div>
                </div>
            </section>
        `;
    }

    filterChipClass(value) {
        return [
            'px-4 py-2 rounded-full border text-sm',
            this.category === value
                ? 'border-ink-900 bg-ink-900 text-white'
                : 'border-ink-200 hover:border-ink-900'
        ].join(' ');
    }
}

customElements.define('products-page', ProductsPage);

