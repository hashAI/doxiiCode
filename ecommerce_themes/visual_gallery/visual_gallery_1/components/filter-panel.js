import { BaseComponent } from './base-component.js';
import { productCategories, priceBrackets, productsStore } from '../assets/state.js';

class FilterPanel extends BaseComponent {
    static properties = {
        isOpen: { type: Boolean },
        categoryFilter: { type: String },
        priceFilter: { type: Number },
        brandFilter: { type: String },
        sortKey: { type: String }
    };

    constructor() {
        super();
        this.isOpen = false;
        this.categoryFilter = 'all';
        this.priceFilter = null;
        this.brandFilter = 'all';
        this.sortKey = 'relevance';
    }

    get brands() {
        const allBrands = new Set();
        productsStore.getAll().forEach(p => allBrands.add(p.brand));
        return Array.from(allBrands).sort();
    }

    connectedCallback() {
        super.connectedCallback();

        window.addEventListener('filter:open', () => {
            this.open();
        });

        // Listen for filter state from collections page
        window.addEventListener('filter:state', (e) => {
            if (e.detail) {
                this.categoryFilter = e.detail.category || 'all';
                this.priceFilter = e.detail.price || null;
                this.brandFilter = e.detail.brand || 'all';
                this.sortKey = e.detail.sort || 'relevance';
            }
        });

        this.keyHandler = (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        };
        document.addEventListener('keydown', this.keyHandler);
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        document.removeEventListener('keydown', this.keyHandler);
    }

    open() {
        this.isOpen = true;
        document.body.style.overflow = 'hidden';
    }

    close() {
        this.isOpen = false;
        document.body.style.overflow = '';
    }

    applyFilters() {
        window.dispatchEvent(new CustomEvent('filter:apply', {
            detail: {
                category: this.categoryFilter,
                price: this.priceFilter,
                brand: this.brandFilter,
                sort: this.sortKey
            }
        }));
        this.close();
    }

    clearFilters() {
        this.categoryFilter = 'all';
        this.priceFilter = null;
        this.brandFilter = 'all';
        this.sortKey = 'relevance';
        this.applyFilters();
    }

    get activeFiltersCount() {
        let count = 0;
        if (this.categoryFilter !== 'all') count++;
        if (this.priceFilter) count++;
        if (this.brandFilter !== 'all') count++;
        if (this.sortKey !== 'relevance') count++;
        return count;
    }

    render() {
        if (!this.isOpen) return '';

        return this.html`
            <!-- Backdrop -->
            <div
                @click=${this.close}
                class="fixed inset-0 z-[100] bg-noir-950/90 backdrop-blur-sm animate-fade-in">
            </div>

            <!-- Panel - Bottom sheet on mobile, side panel on desktop -->
            <div class="fixed z-[110] lg:top-0 lg:right-0 lg:bottom-0 lg:w-[400px] bottom-0 left-0 right-0 max-h-[85vh] lg:max-h-full bg-noir-900 border-t lg:border-t-0 lg:border-l border-gold-400/10 overflow-hidden animate-slide-up lg:animate-fade-in">
                <!-- Header -->
                <div class="sticky top-0 bg-noir-900 border-b border-noir-800 px-6 py-5 flex items-center justify-between">
                    <div>
                        <p class="text-[10px] text-gold-400 tracking-ultrawide uppercase mb-1">Refine</p>
                        <h2 class="text-xl font-display text-noir-50">
                            Filters
                            ${this.activeFiltersCount > 0 ? this.html`
                                <span class="text-gold-400 text-sm ml-2">(${this.activeFiltersCount} active)</span>
                            ` : ''}
                        </h2>
                    </div>
                    <button
                        @click=${this.close}
                        class="p-2 text-noir-400 hover:text-gold-400 transition-colors">
                        <i data-lucide="x" class="w-5 h-5"></i>
                    </button>
                </div>

                <!-- Content -->
                <div class="overflow-y-auto h-[calc(100%-140px)] px-6 py-6 space-y-8">
                    <!-- Sort -->
                    <div>
                        <h3 class="text-xs text-noir-400 tracking-ultrawide uppercase mb-4">Sort By</h3>
                        <div class="space-y-2">
                            ${[
                                { key: 'relevance', label: 'Relevance' },
                                { key: 'priceLow', label: 'Price: Low to High' },
                                { key: 'priceHigh', label: 'Price: High to Low' },
                                { key: 'ratingHigh', label: 'Highest Rated' },
                                { key: 'newest', label: 'New Arrivals' }
                            ].map(opt => this.html`
                                <button
                                    @click=${() => this.sortKey = opt.key}
                                    class="w-full flex items-center justify-between px-4 py-3 border ${this.sortKey === opt.key ? 'border-gold-400 bg-gold-400/5' : 'border-noir-700 hover:border-noir-600'} transition-all">
                                    <span class="text-sm ${this.sortKey === opt.key ? 'text-gold-400' : 'text-noir-200'}">${opt.label}</span>
                                    ${this.sortKey === opt.key ? this.html`
                                        <i data-lucide="check" class="w-4 h-4 text-gold-400"></i>
                                    ` : ''}
                                </button>
                            `)}
                        </div>
                    </div>

                    <!-- Categories -->
                    <div>
                        <h3 class="text-xs text-noir-400 tracking-ultrawide uppercase mb-4">Category</h3>
                        <div class="flex flex-wrap gap-2">
                            <button
                                @click=${() => this.categoryFilter = 'all'}
                                class="px-4 py-2 text-sm ${this.categoryFilter === 'all' ? 'bg-gold-400 text-noir-900' : 'border border-noir-700 text-noir-200 hover:border-gold-400/50'} transition-all">
                                All
                            </button>
                            ${productCategories.map(cat => this.html`
                                <button
                                    @click=${() => this.categoryFilter = cat.id}
                                    class="px-4 py-2 text-sm ${this.categoryFilter === cat.id ? 'bg-gold-400 text-noir-900' : 'border border-noir-700 text-noir-200 hover:border-gold-400/50'} transition-all">
                                    ${cat.name}
                                </button>
                            `)}
                        </div>
                    </div>

                    <!-- Price Range -->
                    <div>
                        <h3 class="text-xs text-noir-400 tracking-ultrawide uppercase mb-4">Price Range</h3>
                        <div class="grid grid-cols-2 gap-2">
                            <button
                                @click=${() => this.priceFilter = null}
                                class="px-4 py-3 text-sm ${!this.priceFilter ? 'bg-gold-400 text-noir-900' : 'border border-noir-700 text-noir-200 hover:border-gold-400/50'} transition-all">
                                All Prices
                            </button>
                            ${priceBrackets.filter(b => b.max).map(bracket => this.html`
                                <button
                                    @click=${() => this.priceFilter = bracket.max}
                                    class="px-4 py-3 text-sm ${this.priceFilter === bracket.max ? 'bg-gold-400 text-noir-900' : 'border border-noir-700 text-noir-200 hover:border-gold-400/50'} transition-all">
                                    ${bracket.label}
                                </button>
                            `)}
                        </div>
                    </div>

                    <!-- Brands -->
                    <div>
                        <h3 class="text-xs text-noir-400 tracking-ultrawide uppercase mb-4">Brand</h3>
                        <div class="max-h-48 overflow-y-auto space-y-1 scrollbar-hide">
                            <button
                                @click=${() => this.brandFilter = 'all'}
                                class="w-full flex items-center justify-between px-4 py-2 ${this.brandFilter === 'all' ? 'text-gold-400' : 'text-noir-300 hover:text-noir-100'} transition-colors">
                                <span class="text-sm">All Brands</span>
                                ${this.brandFilter === 'all' ? this.html`<i data-lucide="check" class="w-4 h-4"></i>` : ''}
                            </button>
                            ${this.brands.map(brand => this.html`
                                <button
                                    @click=${() => this.brandFilter = brand}
                                    class="w-full flex items-center justify-between px-4 py-2 ${this.brandFilter === brand ? 'text-gold-400' : 'text-noir-300 hover:text-noir-100'} transition-colors">
                                    <span class="text-sm">${brand}</span>
                                    ${this.brandFilter === brand ? this.html`<i data-lucide="check" class="w-4 h-4"></i>` : ''}
                                </button>
                            `)}
                        </div>
                    </div>
                </div>

                <!-- Footer -->
                <div class="absolute bottom-0 left-0 right-0 bg-noir-900 border-t border-noir-800 px-6 py-4 flex gap-3">
                    ${this.activeFiltersCount > 0 ? this.html`
                        <button
                            @click=${this.clearFilters}
                            class="flex-1 py-3 border border-noir-600 text-noir-300 hover:text-gold-400 hover:border-gold-400/50 text-sm tracking-wide transition-all">
                            Clear All
                        </button>
                    ` : ''}
                    <button
                        @click=${this.applyFilters}
                        class="flex-1 py-3 bg-gold-400 hover:bg-gold-500 text-noir-900 text-sm font-medium tracking-wide transition-colors touch-scale">
                        Apply Filters
                    </button>
                </div>
            </div>
        `;
    }
}

customElements.define('filter-panel', FilterPanel);
