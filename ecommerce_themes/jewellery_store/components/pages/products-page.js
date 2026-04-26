import { BaseComponent } from '../base-component.js';
import { productsStore, productCategories, shortlistStore, priceBrackets, cartStore } from '../../assets/state.js';
import { navigate } from '../../assets/router.js';
import { showToast, getImageUrl } from '../../assets/utils.js';

class ProductsPage extends BaseComponent {
    static properties = {
        products: { type: Array },
        categoryFilter: { type: String },
        priceFilter: { type: Number },
        brandFilter: { type: String },
        sortKey: { type: String },
        shortlistIds: { type: Array },
        viewMode: { type: String },
        isDesktop: { type: Boolean }
    };

    constructor() {
        super();
        this.products = productsStore.getAll();
        this.categoryFilter = 'all';
        this.priceFilter = null;
        this.brandFilter = 'all';
        this.sortKey = 'relevance';
        this.shortlistIds = [];
        this.viewMode = 'grid';
        this.isDesktop = window.innerWidth >= 1024;
    }

    get brands() {
        const allBrands = new Set();
        this.products.forEach(p => allBrands.add(p.brand));
        return Array.from(allBrands).sort();
    }

    connectedCallback() {
        super.connectedCallback();
        const params = this.getParams();
        this.categoryFilter = params?.category && params.category !== 'all' ? params.category : 'all';

        this.unsubscribe = shortlistStore.subscribe((state) => {
            this.shortlistIds = state.items.map(item => item.id);
        });

        // Listen for filter apply events
        window.addEventListener('filter:apply', (e) => {
            if (e.detail) {
                this.categoryFilter = e.detail.category || 'all';
                this.priceFilter = e.detail.price || null;
                this.brandFilter = e.detail.brand || 'all';
                this.sortKey = e.detail.sort || 'relevance';
            }
        });

        this.resizeHandler = () => {
            this.isDesktop = window.innerWidth >= 1024;
        };
        window.addEventListener('resize', this.resizeHandler);

        // Broadcast current filter state when opening filter panel
        window.addEventListener('filter:open', () => {
            window.dispatchEvent(new CustomEvent('filter:state', {
                detail: {
                    category: this.categoryFilter,
                    price: this.priceFilter,
                    brand: this.brandFilter,
                    sort: this.sortKey
                }
            }));
        });
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        this.unsubscribe?.();
        window.removeEventListener('resize', this.resizeHandler);
    }

    get filteredProducts() {
        let list = [...this.products];

        if (this.categoryFilter !== 'all') {
            list = list.filter(product => product.productType === this.categoryFilter);
        }
        if (this.priceFilter) {
            list = list.filter(product => product.price <= this.priceFilter);
        }
        if (this.brandFilter && this.brandFilter !== 'all') {
            list = list.filter(product => product.brand === this.brandFilter);
        }

        switch (this.sortKey) {
            case 'priceLow':
                list.sort((a, b) => a.price - b.price);
                break;
            case 'priceHigh':
                list.sort((a, b) => b.price - a.price);
                break;
            case 'ratingHigh':
                list.sort((a, b) => b.rating - a.rating);
                break;
            case 'popular':
                list.sort((a, b) => b.reviews - a.reviews);
                break;
            case 'newest':
                list.sort((a, b) => (b.newArrival ? 1 : 0) - (a.newArrival ? 1 : 0));
                break;
        }
        return list;
    }

    get activeFiltersCount() {
        let count = 0;
        if (this.categoryFilter !== 'all') count++;
        if (this.priceFilter) count++;
        if (this.brandFilter && this.brandFilter !== 'all') count++;
        return count;
    }

    toggleShortlist(product, e) {
        e?.stopPropagation();
        shortlistStore.toggle(product);
        const isAdded = this.shortlistIds.includes(product.id);
        showToast({
            title: isAdded ? 'Removed from collection' : 'Added to collection',
            variant: isAdded ? 'info' : 'success'
        });
    }

    addToCart(product, e) {
        e.stopPropagation();
        cartStore.add(product, 1);
        showToast({
            title: 'Added to cart',
            description: product.name,
            variant: 'success'
        });
    }

    openQuickView(product, e) {
        e.stopPropagation();
        window.dispatchEvent(new CustomEvent('quickview:open', { detail: product }));
    }

    openFilters() {
        window.dispatchEvent(new CustomEvent('filter:open'));
    }

    clearAllFilters() {
        this.categoryFilter = 'all';
        this.priceFilter = null;
        this.brandFilter = 'all';
        this.sortKey = 'relevance';
        showToast({ title: 'Filters cleared', variant: 'info' });
    }

    renderProductCard(product, index) {
        const isSaved = this.shortlistIds.includes(product.id);

        return this.html`
            <div
                class="group relative bg-noir-900/50 border border-noir-800 hover:border-gold-400/30 transition-all duration-500 product-card cursor-pointer opacity-0 animate-fade-in"
                style="animation-delay: ${Math.min(index * 0.05, 0.5)}s"
                @click=${() => navigate(`/product/${product.id}`)}>

                <!-- Image Container -->
                <div class="aspect-portrait relative overflow-hidden bg-noir-900 img-reveal">
                    <img
                        src="${product.image}"
                        alt="${product.name}"
                        class="w-full h-full object-contain p-4 lg:p-8"
                    />

                    <!-- Hover Overlay -->
                    <div class="absolute inset-0 bg-noir-950/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-3">
                        <button
                            @click=${(e) => this.openQuickView(product, e)}
                            class="px-6 py-2.5 bg-gold-400 hover:bg-gold-500 text-noir-900 text-sm font-medium tracking-wide uppercase transition-colors">
                            Quick View
                        </button>
                        <div class="flex gap-2">
                            <button
                                @click=${(e) => this.addToCart(product, e)}
                                class="w-10 h-10 border border-noir-100 hover:border-gold-400 hover:bg-gold-400/10 text-noir-100 hover:text-gold-400 flex items-center justify-center transition-all">
                                <i data-lucide="shopping-bag" class="w-4 h-4"></i>
                            </button>
                            <button
                                @click=${(e) => this.toggleShortlist(product, e)}
                                class="w-10 h-10 border ${isSaved ? 'border-gold-400 bg-gold-400/10' : 'border-noir-100 hover:border-gold-400'} text-noir-100 hover:text-gold-400 flex items-center justify-center transition-all">
                                <i data-lucide="heart" class="w-4 h-4 ${isSaved ? 'fill-gold-400 text-gold-400' : ''}"></i>
                            </button>
                        </div>
                    </div>

                    <!-- Badge -->
                    ${product.badge ? this.html`
                        <div class="absolute top-4 left-4 px-3 py-1 bg-gold-400 text-noir-900 text-[10px] font-medium tracking-wide uppercase">
                            ${product.badge}
                        </div>
                    ` : ''}

                    <!-- Index Number -->
                    <div class="absolute bottom-4 right-4 text-[10px] text-noir-600 font-mono">
                        ${String(index + 1).padStart(2, '0')}
                    </div>
                </div>

                <!-- Details -->
                <div class="p-4 lg:p-5 border-t border-noir-800/50">
                    <p class="text-[10px] text-noir-500 tracking-ultrawide uppercase mb-1">${product.brand}</p>
                    <h3 class="text-sm lg:text-base font-display text-noir-100 leading-tight line-clamp-2 group-hover:text-gold-400 transition-colors min-h-[2.5rem]">
                        ${product.name}
                    </h3>

                    <!-- Rating -->
                    <div class="mt-2 flex items-center gap-1.5">
                        <div class="flex items-center gap-0.5">
                            ${[...Array(5)].map((_, i) => this.html`
                                <i data-lucide="star" class="w-3 h-3 ${i < Math.floor(product.rating) ? 'text-gold-400 fill-gold-400' : 'text-noir-700'}"></i>
                            `)}
                        </div>
                        <span class="text-[10px] text-noir-500">(${product.reviews})</span>
                    </div>

                    <!-- Price -->
                    <div class="mt-3 flex items-baseline gap-2">
                        <span class="text-lg font-display text-gold-400">$${product.price.toFixed(2)}</span>
                        ${product.originalPrice > product.price ? this.html`
                            <span class="text-xs text-noir-600 line-through">$${product.originalPrice.toFixed(2)}</span>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
    }

    render() {
        const currentCategory = productCategories.find(c => c.id === this.categoryFilter);

        return this.html`
            <div class="min-h-screen bg-noir-950 pb-28 lg:pb-12">
                <!-- Hero Section -->
                <section class="relative h-[40vh] lg:h-[50vh] overflow-hidden">
                    <!-- Background -->
                    <div class="absolute inset-0">
                        <img
                            src="${getImageUrl(currentCategory ? currentCategory.name + ' jewelry luxury' : 'luxury jewelry collection', 1500, 20)}"
                            alt=""
                            class="w-full h-full object-cover opacity-30"
                        />
                        <div class="absolute inset-0 bg-gradient-to-t from-noir-950 via-noir-950/80 to-noir-950/40"></div>
                    </div>

                    <!-- Content -->
                    <div class="relative h-full flex flex-col justify-end max-w-[1600px] mx-auto px-6 lg:px-12 pb-8 lg:pb-12">
                        <div class="space-y-3">
                            <p class="text-xs text-gold-400 tracking-ultrawide uppercase">Collection</p>
                            <h1 class="text-4xl lg:text-6xl xl:text-7xl font-display font-medium text-noir-50">
                                ${currentCategory ? currentCategory.name : 'All Pieces'}
                            </h1>
                            <p class="text-noir-300 max-w-lg">
                                ${this.filteredProducts.length} exquisite ${this.filteredProducts.length === 1 ? 'piece' : 'pieces'} in this collection
                            </p>
                        </div>
                    </div>
                </section>

                <!-- Filter Bar -->
                <section class="sticky top-16 lg:top-20 z-30 bg-noir-950/95 backdrop-blur-sm border-b border-noir-800/50">
                    <div class="max-w-[1600px] mx-auto px-6 lg:px-12 py-4">
                        <div class="flex items-center justify-between gap-4">
                            <!-- Left: Category Pills -->
                            <div class="flex-1 overflow-x-auto scrollbar-hide -mx-2 px-2">
                                <div class="flex gap-2">
                                    <button
                                        @click=${() => this.categoryFilter = 'all'}
                                        class="flex-shrink-0 px-4 py-2 text-sm ${this.categoryFilter === 'all' ? 'bg-gold-400 text-noir-900' : 'border border-noir-700 text-noir-300 hover:border-gold-400/50'} transition-all">
                                        All
                                    </button>
                                    ${productCategories.map(category => this.html`
                                        <button
                                            @click=${() => this.categoryFilter = category.id}
                                            class="flex-shrink-0 px-4 py-2 text-sm ${this.categoryFilter === category.id ? 'bg-gold-400 text-noir-900' : 'border border-noir-700 text-noir-300 hover:border-gold-400/50'} transition-all">
                                            ${category.name}
                                        </button>
                                    `)}
                                </div>
                            </div>

                            <!-- Right: Filter & View Toggle -->
                            <div class="flex items-center gap-3">
                                <!-- Active Filters Count -->
                                ${this.activeFiltersCount > 0 ? this.html`
                                    <button
                                        @click=${this.clearAllFilters}
                                        class="hidden lg:flex items-center gap-1.5 text-xs text-gold-400 hover:text-gold-300 transition-colors">
                                        <span>${this.activeFiltersCount} filter${this.activeFiltersCount > 1 ? 's' : ''}</span>
                                        <i data-lucide="x" class="w-3 h-3"></i>
                                    </button>
                                ` : ''}

                                <!-- Filter Button -->
                                <button
                                    @click=${this.openFilters}
                                    class="flex items-center gap-2 px-4 py-2 border ${this.activeFiltersCount > 0 ? 'border-gold-400 text-gold-400' : 'border-noir-700 text-noir-300 hover:border-gold-400/50'} text-sm transition-all">
                                    <i data-lucide="sliders-horizontal" class="w-4 h-4"></i>
                                    <span class="hidden sm:inline">Filters</span>
                                </button>

                                <!-- View Toggle (Desktop) -->
                                <div class="hidden lg:flex items-center border border-noir-700">
                                    <button
                                        @click=${() => this.viewMode = 'grid'}
                                        class="p-2.5 ${this.viewMode === 'grid' ? 'bg-noir-800 text-gold-400' : 'text-noir-400 hover:text-noir-100'} transition-colors">
                                        <i data-lucide="grid-3x3" class="w-4 h-4"></i>
                                    </button>
                                    <button
                                        @click=${() => this.viewMode = 'large'}
                                        class="p-2.5 ${this.viewMode === 'large' ? 'bg-noir-800 text-gold-400' : 'text-noir-400 hover:text-noir-100'} transition-colors">
                                        <i data-lucide="square" class="w-4 h-4"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- Products Grid -->
                <section class="max-w-[1600px] mx-auto px-6 lg:px-12 py-8 lg:py-12">
                    ${this.filteredProducts.length === 0 ? this.html`
                        <!-- Empty State -->
                        <div class="flex flex-col items-center justify-center py-20 text-center">
                            <div class="w-24 h-24 border border-gold-400/20 flex items-center justify-center mb-6">
                                <i data-lucide="search-x" class="w-10 h-10 text-gold-400/30"></i>
                            </div>
                            <h3 class="text-xl font-display text-noir-100 mb-2">No pieces found</h3>
                            <p class="text-noir-400 mb-8">Try adjusting your filters to see more results</p>
                            <button
                                @click=${this.clearAllFilters}
                                class="px-8 py-3 border border-gold-400 text-gold-400 hover:bg-gold-400 hover:text-noir-900 text-sm tracking-wide uppercase transition-all">
                                Clear All Filters
                            </button>
                        </div>
                    ` : this.html`
                        <!-- Grid -->
                        <div class="grid ${this.viewMode === 'large' ? 'grid-cols-1 lg:grid-cols-2 xl:grid-cols-3' : 'grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'} gap-4 lg:gap-6">
                            ${this.filteredProducts.map((product, index) => this.renderProductCard(product, index))}
                        </div>
                    `}
                </section>

                <!-- Bottom Info -->
                <section class="max-w-[1600px] mx-auto px-6 lg:px-12 py-12 border-t border-noir-800/50">
                    <div class="grid grid-cols-2 lg:grid-cols-4 gap-8">
                        ${[
                            { icon: 'gem', title: 'Certified Authentic', desc: 'GIA certified diamonds' },
                            { icon: 'truck', title: 'Complimentary Shipping', desc: 'Fully insured delivery' },
                            { icon: 'shield-check', title: 'Secure Packaging', desc: 'Elegant presentation' },
                            { icon: 'rotate-ccw', title: '30-Day Returns', desc: 'Hassle-free policy' }
                        ].map(item => this.html`
                            <div class="text-center lg:text-left">
                                <div class="inline-flex w-12 h-12 border border-gold-400/20 items-center justify-center mb-3">
                                    <i data-lucide="${item.icon}" class="w-5 h-5 text-gold-400"></i>
                                </div>
                                <h4 class="text-sm font-medium text-noir-100 mb-1">${item.title}</h4>
                                <p class="text-xs text-noir-500">${item.desc}</p>
                            </div>
                        `)}
                    </div>
                </section>
            </div>
        `;
    }
}

customElements.define('products-page', ProductsPage);
