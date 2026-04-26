import { BaseComponent } from '../base-component.js';
import { productsStore, productCategories, shortlistStore, priceBrackets, cartStore } from '../../assets/state.js';
import { navigate } from '../../assets/router.js';
import { showToast } from '../../assets/utils.js';

class ProductsPage extends BaseComponent {
    static properties = {
        products: { type: Array },
        categoryFilter: { type: String },
        priceFilter: { type: Number },
        brandFilter: { type: String },
        sortKey: { type: String },
        shortlistIds: { type: Array },
        showSortSheet: { type: Boolean },
        showPriceSheet: { type: Boolean },
        showBrandSheet: { type: Boolean },
        showFilterSheet: { type: Boolean },
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
        this.showSortSheet = false;
        this.showPriceSheet = false;
        this.showBrandSheet = false;
        this.showFilterSheet = false;
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
        this.overlayHandler = () => {
            this.closeAllSheets();
        };
        document.getElementById('overlay')?.addEventListener('click', this.overlayHandler);

        this.resizeHandler = () => {
            this.isDesktop = window.innerWidth >= 1024;
        };
        window.addEventListener('resize', this.resizeHandler);
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        this.unsubscribe?.();
        document.getElementById('overlay')?.removeEventListener('click', this.overlayHandler);
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
            default:
                list = list;
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

    toggleShortlist(product) {
        shortlistStore.toggle(product);
        const isAdded = this.shortlistIds.includes(product.id);
        showToast({
            title: isAdded ? 'Removed from favorites' : 'Added to favorites',
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

    closeAllSheets() {
        this.showSortSheet = false;
        this.showPriceSheet = false;
        this.showBrandSheet = false;
        this.showFilterSheet = false;
        const overlay = document.getElementById('overlay');
        overlay?.classList.add('hidden');
        document.body.style.overflow = '';
    }

    toggleSortSheet() {
        this.closeAllSheets();
        this.showSortSheet = true;
        document.getElementById('overlay')?.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    togglePriceSheet() {
        this.closeAllSheets();
        this.showPriceSheet = true;
        document.getElementById('overlay')?.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    toggleBrandSheet() {
        this.closeAllSheets();
        this.showBrandSheet = true;
        document.getElementById('overlay')?.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    toggleFilterSheet() {
        this.closeAllSheets();
        this.showFilterSheet = true;
        document.getElementById('overlay')?.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    clearAllFilters() {
        this.categoryFilter = 'all';
        this.priceFilter = null;
        this.brandFilter = 'all';
        this.sortKey = 'relevance';
        showToast({ title: 'Filters cleared', variant: 'info' });
    }

    renderSortOption(key, label) {
        const isActive = this.sortKey === key;
        return this.html`
            <button
                @click=${() => { this.sortKey = key; this.closeAllSheets(); }}
                class="flex items-center justify-between w-full py-3 px-4 rounded-xl text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition ${isActive ? 'bg-primary-50 dark:bg-primary-900/20' : ''}">
                <span class="text-base text-gray-800 dark:text-gray-200">${label}</span>
                <span class="w-5 h-5 border rounded-full flex items-center justify-center ${isActive ? 'border-primary-700 bg-primary-700' : 'border-gray-300'}">
                    ${isActive ? this.html`<span class="w-2 h-2 rounded-full bg-white block"></span>` : ''}
                </span>
            </button>
        `;
    }

    renderProductCard(product) {
        const isSaved = this.shortlistIds.includes(product.id);
        return this.html`
            <div class="bg-white rounded-3xl shadow-card overflow-hidden desktop-hover cursor-pointer" @click=${() => navigate(`/product/${product.id}`)}>
                <div class="p-3 bg-gradient-to-br from-gray-50 to-white relative">
                    <img src="${product.image}" alt="${product.name}" class="w-full h-44 lg:h-56 object-contain">
                    <button
                        @click=${(e) => { e.stopPropagation(); this.toggleShortlist(product); }}
                        class="absolute top-3 right-3 w-10 h-10 rounded-full bg-white shadow-card flex items-center justify-center touch-feedback hover:scale-110 transition">
                        <i data-lucide="heart" class="w-5 h-5 ${isSaved ? 'fill-accent-500 text-accent-500' : 'text-gray-500'}"></i>
                    </button>
                    ${product.badge ? this.html`
                        <div class="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-600 text-white shadow">
                            ${product.badge}
                        </div>
                    ` : ''}
                </div>
                <div class="px-4 pb-4 space-y-2">
                    <h3 class="text-lg font-bold leading-tight line-clamp-2">${product.name}</h3>
                    <p class="text-sm text-gray-600">${product.brand}</p>
                    <div class="flex items-baseline gap-3">
                        <p class="text-2xl font-black text-primary-800">$${product.price.toFixed(2)}</p>
                        ${product.originalPrice > product.price ? this.html`<p class="text-sm font-semibold text-gray-400 line-through">$${product.originalPrice.toFixed(2)}</p>` : ''}
                    </div>
                    <div class="flex flex-wrap gap-2 text-xs text-gray-600">
                        <span class="px-3 py-1 bg-gray-100 rounded-full">${product.size}</span>
                        ${product.shade ? this.html`<span class="px-3 py-1 bg-gray-100 rounded-full">${product.shade}</span>` : ''}
                        <span class="px-3 py-1 bg-gray-100 rounded-full">${product.category}</span>
                    </div>
                    <div class="flex items-center gap-2 text-sm text-gray-700">
                        <div class="flex items-center gap-1">
                            <i data-lucide="star" class="w-4 h-4 text-amber-500 fill-amber-500"></i>
                            <span class="font-semibold">${product.rating}</span>
                            <span class="text-gray-500">(${product.reviews})</span>
                        </div>
                        ${product.certified ? this.html`
                            <span class="ml-auto inline-flex items-center gap-1 text-purple-700 text-xs font-semibold">
                                <i data-lucide="shield-check" class="w-4 h-4"></i> Certified
                            </span>
                        ` : ''}
                    </div>
                    <button
                        @click=${(e) => this.addToCart(product, e)}
                        class="w-full py-2.5 rounded-xl bg-accent-500 hover:bg-accent-600 text-white font-bold text-sm touch-feedback transition">
                        Add to Cart
                    </button>
                </div>
            </div>
        `;
    }

    renderDesktopSidebar() {
        return this.html`
            <aside class="hidden lg:block w-72 flex-shrink-0">
                <div class="sticky top-48 space-y-6">
                    <!-- Sort -->
                    <div class="bg-white rounded-2xl shadow-card p-5 space-y-3">
                        <h3 class="font-bold text-gray-900 flex items-center gap-2">
                            <i data-lucide="arrow-up-down" class="w-4 h-4 text-purple-500"></i>
                            Sort By
                        </h3>
                        <div class="space-y-1">
                            ${[
                                { key: 'relevance', label: 'Relevance' },
                                { key: 'priceLow', label: 'Price: Low to High' },
                                { key: 'priceHigh', label: 'Price: High to Low' },
                                { key: 'ratingHigh', label: 'Highest Rated' },
                                { key: 'popular', label: 'Most Popular' },
                                { key: 'newest', label: 'New Arrivals' }
                            ].map(opt => this.html`
                                <button
                                    @click=${() => this.sortKey = opt.key}
                                    class="w-full text-left px-3 py-2 rounded-lg text-sm transition ${this.sortKey === opt.key ? 'bg-primary-50 text-primary-700 font-semibold' : 'text-gray-600 hover:bg-gray-50'}">
                                    ${opt.label}
                                </button>
                            `)}
                        </div>
                    </div>

                    <!-- Categories -->
                    <div class="bg-white rounded-2xl shadow-card p-5 space-y-3">
                        <h3 class="font-bold text-gray-900 flex items-center gap-2">
                            <i data-lucide="grid-3x3" class="w-4 h-4 text-purple-500"></i>
                            Categories
                        </h3>
                        <div class="space-y-1">
                            <button
                                @click=${() => this.categoryFilter = 'all'}
                                class="w-full text-left px-3 py-2 rounded-lg text-sm transition ${this.categoryFilter === 'all' ? 'bg-primary-50 text-primary-700 font-semibold' : 'text-gray-600 hover:bg-gray-50'}">
                                All Categories
                            </button>
                            ${productCategories.map(cat => this.html`
                                <button
                                    @click=${() => this.categoryFilter = cat.id}
                                    class="w-full text-left px-3 py-2 rounded-lg text-sm transition flex items-center gap-2 ${this.categoryFilter === cat.id ? 'bg-primary-50 text-primary-700 font-semibold' : 'text-gray-600 hover:bg-gray-50'}">
                                    <i data-lucide="${cat.icon}" class="w-4 h-4"></i>
                                    ${cat.name}
                                </button>
                            `)}
                        </div>
                    </div>

                    <!-- Price Range -->
                    <div class="bg-white rounded-2xl shadow-card p-5 space-y-3">
                        <h3 class="font-bold text-gray-900 flex items-center gap-2">
                            <i data-lucide="dollar-sign" class="w-4 h-4 text-purple-500"></i>
                            Price Range
                        </h3>
                        <div class="space-y-1">
                            <button
                                @click=${() => this.priceFilter = null}
                                class="w-full text-left px-3 py-2 rounded-lg text-sm transition ${!this.priceFilter ? 'bg-primary-50 text-primary-700 font-semibold' : 'text-gray-600 hover:bg-gray-50'}">
                                All Prices
                            </button>
                            ${priceBrackets.filter(b => b.max).map(bracket => this.html`
                                <button
                                    @click=${() => this.priceFilter = bracket.max}
                                    class="w-full text-left px-3 py-2 rounded-lg text-sm transition ${this.priceFilter === bracket.max ? 'bg-primary-50 text-primary-700 font-semibold' : 'text-gray-600 hover:bg-gray-50'}">
                                    ${bracket.label}
                                </button>
                            `)}
                        </div>
                    </div>

                    <!-- Brands -->
                    <div class="bg-white rounded-2xl shadow-card p-5 space-y-3">
                        <h3 class="font-bold text-gray-900 flex items-center gap-2">
                            <i data-lucide="sparkles" class="w-4 h-4 text-purple-500"></i>
                            Brands
                        </h3>
                        <div class="space-y-1 max-h-60 overflow-y-auto">
                            <button
                                @click=${() => this.brandFilter = 'all'}
                                class="w-full text-left px-3 py-2 rounded-lg text-sm transition ${this.brandFilter === 'all' ? 'bg-primary-50 text-primary-700 font-semibold' : 'text-gray-600 hover:bg-gray-50'}">
                                All Brands
                            </button>
                            ${this.brands.map(brand => this.html`
                                <button
                                    @click=${() => this.brandFilter = brand}
                                    class="w-full text-left px-3 py-2 rounded-lg text-sm transition ${this.brandFilter === brand ? 'bg-primary-50 text-primary-700 font-semibold' : 'text-gray-600 hover:bg-gray-50'}">
                                    ${brand}
                                </button>
                            `)}
                        </div>
                    </div>

                    ${this.activeFiltersCount > 0 ? this.html`
                        <button
                            @click=${this.clearAllFilters}
                            class="w-full py-3 text-sm font-semibold text-primary-700 flex items-center justify-center gap-2 bg-primary-50 rounded-xl hover:bg-primary-100 transition">
                            <i data-lucide="x-circle" class="w-4 h-4"></i>Clear all filters
                        </button>
                    ` : ''}
                </div>
            </aside>
        `;
    }

    render() {
        const currentCategory = productCategories.find(c => c.id === this.categoryFilter);
        
        return this.html`
            <div class="pb-24 lg:pb-12 bg-gray-50">
                <div class="max-w-[1440px] mx-auto px-4 lg:px-8 pt-3 lg:pt-6">
                    <!-- Hero Banner -->
                    <div class="rounded-[22px] lg:rounded-[28px] overflow-hidden shadow-card mb-6">
                        <div class="relative h-40 lg:h-56 bg-gradient-to-r from-[#2D0B52] via-[#4a1c7a] to-[#2D0B52]">
                            <div class="absolute inset-0 opacity-30" style="background-image: radial-gradient(circle at 30% 20%, rgba(255,182,193,0.4) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(147,112,219,0.3) 0%, transparent 50%);"></div>
                            <div class="relative h-full flex items-center justify-center text-center p-6">
                                <div>
                                    <p class="text-pink-300 text-xs lg:text-sm font-bold uppercase tracking-wider mb-2">Premium Products</p>
                                    <h1 class="text-2xl lg:text-4xl font-black text-white">${currentCategory ? currentCategory.name : 'All Products'}</h1>
                                    <p class="text-white/70 text-sm lg:text-base mt-2">${this.filteredProducts.length} products available</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="lg:flex lg:gap-8">
                        <!-- Desktop Sidebar -->
                        ${this.renderDesktopSidebar()}

                        <!-- Main Content -->
                        <div class="flex-1 space-y-4 lg:space-y-6">
                            <!-- Mobile Filters bar -->
                            <div class="lg:hidden space-y-3">
                                <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                    <button
                                        @click=${this.toggleFilterSheet}
                                        class="flex items-center justify-between px-4 py-3 bg-white rounded-2xl shadow-card text-sm font-semibold touch-feedback ${this.activeFiltersCount > 0 ? 'ring-2 ring-primary-500' : ''}">
                                        <span class="flex items-center gap-2">
                                            <i data-lucide="filter" class="w-4 h-4"></i>Filter
                                            ${this.activeFiltersCount > 0 ? this.html`<span class="px-1.5 py-0.5 bg-primary-600 text-white rounded-full text-xs">${this.activeFiltersCount}</span>` : ''}
                                        </span>
                                    </button>
                                    <button
                                        @click=${this.toggleSortSheet}
                                        class="flex items-center justify-between px-4 py-3 bg-white rounded-2xl shadow-card text-sm font-semibold touch-feedback">
                                        <span class="flex items-center gap-2"><i data-lucide="arrow-up-down" class="w-4 h-4"></i>Sort</span>
                                    </button>
                                    <button
                                        @click=${this.togglePriceSheet}
                                        class="flex items-center justify-between px-4 py-3 bg-white rounded-2xl shadow-card text-sm font-semibold touch-feedback ${this.priceFilter ? 'ring-2 ring-primary-500' : ''}">
                                        <span class="flex items-center gap-2"><i data-lucide="dollar-sign" class="w-4 h-4"></i>Price</span>
                                    </button>
                                    <button
                                        @click=${this.toggleBrandSheet}
                                        class="flex items-center justify-between px-4 py-3 bg-white rounded-2xl shadow-card text-sm font-semibold touch-feedback ${this.brandFilter && this.brandFilter !== 'all' ? 'ring-2 ring-primary-500' : ''}">
                                        <span class="flex items-center gap-2"><i data-lucide="sparkles" class="w-4 h-4"></i>Brand</span>
                                    </button>
                                </div>
                                ${this.activeFiltersCount > 0 ? this.html`
                                    <button
                                        @click=${this.clearAllFilters}
                                        class="w-full py-2 text-sm font-semibold text-primary-700 flex items-center justify-center gap-2">
                                        <i data-lucide="x-circle" class="w-4 h-4"></i>Clear all filters
                                    </button>
                                ` : ''}
                            </div>

                            <!-- Desktop header bar -->
                            <div class="hidden lg:flex items-center justify-between bg-white rounded-2xl shadow-card p-4">
                                <div class="flex items-center gap-4">
                                    <span class="text-gray-600">Showing <strong class="text-gray-900">${this.filteredProducts.length}</strong> products</span>
                                    ${this.activeFiltersCount > 0 ? this.html`
                                        <span class="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm font-medium">
                                            ${this.activeFiltersCount} filter${this.activeFiltersCount > 1 ? 's' : ''} applied
                                        </span>
                                    ` : ''}
                                </div>
                                <div class="flex items-center gap-2 text-sm text-gray-600">
                                    <span>Sort:</span>
                                    <span class="font-semibold text-primary-700">${
                                        this.sortKey === 'relevance' ? 'Relevance' :
                                        this.sortKey === 'priceLow' ? 'Price: Low to High' :
                                        this.sortKey === 'priceHigh' ? 'Price: High to Low' :
                                        this.sortKey === 'ratingHigh' ? 'Highest Rated' :
                                        this.sortKey === 'popular' ? 'Most Popular' : 'New Arrivals'
                                    }</span>
                                </div>
                            </div>

                            <!-- Category pills -->
                            <div class="flex gap-2 overflow-x-auto lg:overflow-visible lg:flex-wrap scrollbar-hide pb-1">
                                <button
                                    @click=${() => { this.categoryFilter = 'all'; }}
                                    class="flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition ${this.categoryFilter === 'all' ? 'bg-primary-600 text-white' : 'bg-white text-primary-800 shadow-card hover:bg-primary-50'}">
                                    All
                                </button>
                                ${productCategories.map(category => this.html`
                                    <button
                                        @click=${() => { this.categoryFilter = category.id; }}
                                        class="flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition ${this.categoryFilter === category.id ? 'bg-primary-600 text-white' : 'bg-white text-primary-800 shadow-card hover:bg-primary-50'}">
                                        ${category.name}
                                    </button>
                                `)}
                            </div>

                            <!-- Product Grid -->
                            <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
                                ${this.filteredProducts.map(product => this.renderProductCard(product))}
                            </div>

                            ${this.filteredProducts.length === 0 ? this.html`
                                <div class="text-center py-16 bg-white rounded-2xl shadow-card">
                                    <i data-lucide="search-x" class="w-16 h-16 mx-auto text-gray-300 mb-4"></i>
                                    <h3 class="text-xl font-bold text-gray-900 mb-2">No products found</h3>
                                    <p class="text-gray-500 mb-4">Try adjusting your filters to see more results</p>
                                    <button @click=${this.clearAllFilters} class="px-6 py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition">
                                        Clear Filters
                                    </button>
                                </div>
                            ` : ''}
                        </div>
                    </div>
                </div>

                <!-- Mobile Bottom Sheets -->
                
                <!-- Sort sheet -->
                <div class="bottom-sheet lg:rounded-2xl ${this.showSortSheet ? 'open' : ''}" style="max-height: 65vh;">
                    <div class="bottom-sheet-handle"></div>
                    <div class="p-5 space-y-2">
                        <div class="flex items-center justify-between mb-2">
                            <h3 class="text-lg font-bold text-gray-900 dark:text-white">Sort By</h3>
                            <button @click=${this.closeAllSheets} class="lg:block hidden p-2 hover:bg-gray-100 rounded-lg">
                                <i data-lucide="x" class="w-5 h-5"></i>
                            </button>
                        </div>
                        ${this.renderSortOption('relevance', 'Relevance (Default)')}
                        ${this.renderSortOption('priceLow', 'Price - Low to High')}
                        ${this.renderSortOption('priceHigh', 'Price - High to Low')}
                        ${this.renderSortOption('ratingHigh', 'Highest Rated')}
                        ${this.renderSortOption('popular', 'Most Popular')}
                        ${this.renderSortOption('newest', 'New Arrivals')}
                    </div>
                </div>

                <!-- Price sheet -->
                <div class="bottom-sheet lg:rounded-2xl ${this.showPriceSheet ? 'open' : ''}" style="max-height: 65vh;">
                    <div class="bottom-sheet-handle"></div>
                    <div class="p-5 space-y-3">
                        <div class="flex items-center justify-between mb-2">
                            <h3 class="text-lg font-bold text-gray-900 dark:text-white">Price Range</h3>
                            <button @click=${this.closeAllSheets} class="lg:block hidden p-2 hover:bg-gray-100 rounded-lg">
                                <i data-lucide="x" class="w-5 h-5"></i>
                            </button>
                        </div>
                        <button
                            @click=${() => { this.priceFilter = null; this.closeAllSheets(); }}
                            class="flex items-center justify-between w-full py-3 px-4 rounded-xl ${!this.priceFilter ? 'bg-primary-50 border-2 border-primary-500' : 'bg-gray-50 hover:bg-gray-100'} text-left transition">
                            <span class="font-semibold text-gray-800">All Prices</span>
                            ${!this.priceFilter ? this.html`<i data-lucide="check" class="w-5 h-5 text-primary-700"></i>` : ''}
                        </button>
                        ${priceBrackets.filter(b => b.max).map(bracket => this.html`
                            <button
                                @click=${() => { this.priceFilter = bracket.max; this.closeAllSheets(); }}
                                class="flex items-center justify-between w-full py-3 px-4 rounded-xl ${this.priceFilter === bracket.max ? 'bg-primary-50 border-2 border-primary-500' : 'bg-gray-50 hover:bg-gray-100'} text-left touch-feedback transition">
                                <span class="font-semibold text-gray-800">${bracket.label}</span>
                                ${this.priceFilter === bracket.max ? this.html`<i data-lucide="check" class="w-5 h-5 text-primary-700"></i>` : ''}
                            </button>
                        `)}
                    </div>
                </div>

                <!-- Brand sheet -->
                <div class="bottom-sheet lg:rounded-2xl ${this.showBrandSheet ? 'open' : ''}" style="max-height: 65vh; overflow-y: auto;">
                    <div class="bottom-sheet-handle"></div>
                    <div class="p-5 space-y-3">
                        <div class="flex items-center justify-between mb-2">
                            <h3 class="text-lg font-bold text-gray-900 dark:text-white">Filter by Brand</h3>
                            <button @click=${this.closeAllSheets} class="lg:block hidden p-2 hover:bg-gray-100 rounded-lg">
                                <i data-lucide="x" class="w-5 h-5"></i>
                            </button>
                        </div>
                        <button
                            @click=${() => { this.brandFilter = 'all'; this.closeAllSheets(); }}
                            class="flex items-center justify-between w-full py-3 px-4 rounded-xl ${this.brandFilter === 'all' ? 'bg-primary-50 border-2 border-primary-500' : 'bg-gray-50 hover:bg-gray-100'} text-left touch-feedback transition">
                            <span class="font-semibold text-gray-800">All Brands</span>
                            ${this.brandFilter === 'all' ? this.html`<i data-lucide="check" class="w-5 h-5 text-primary-700"></i>` : ''}
                        </button>
                        ${this.brands.map(brand => this.html`
                            <button
                                @click=${() => { this.brandFilter = brand; this.closeAllSheets(); }}
                                class="flex items-center justify-between w-full py-3 px-4 rounded-xl ${this.brandFilter === brand ? 'bg-primary-50 border-2 border-primary-500' : 'bg-gray-50 hover:bg-gray-100'} text-left touch-feedback transition">
                                <span class="font-semibold text-gray-800">${brand}</span>
                                ${this.brandFilter === brand ? this.html`<i data-lucide="check" class="w-5 h-5 text-primary-700"></i>` : ''}
                            </button>
                        `)}
                    </div>
                </div>

                <!-- All Filters sheet -->
                <div class="bottom-sheet lg:rounded-2xl ${this.showFilterSheet ? 'open' : ''}" style="max-height: 80vh; overflow-y: auto;">
                    <div class="bottom-sheet-handle"></div>
                    <div class="p-5 space-y-5">
                        <div class="flex items-center justify-between">
                            <h3 class="text-lg font-bold text-gray-900 dark:text-white">All Filters</h3>
                            <div class="flex items-center gap-2">
                                <button @click=${this.clearAllFilters} class="text-sm font-semibold text-primary-700">Clear all</button>
                                <button @click=${this.closeAllSheets} class="lg:block hidden p-2 hover:bg-gray-100 rounded-lg">
                                    <i data-lucide="x" class="w-5 h-5"></i>
                                </button>
                            </div>
                        </div>

                        <!-- Category -->
                        <div class="space-y-2">
                            <h4 class="font-bold text-gray-900 dark:text-white">Category</h4>
                            <div class="flex flex-wrap gap-2">
                                <button
                                    @click=${() => { this.categoryFilter = 'all'; }}
                                    class="px-4 py-2 rounded-full text-sm font-semibold transition ${this.categoryFilter === 'all' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}">
                                    All
                                </button>
                                ${productCategories.map(category => this.html`
                                    <button
                                        @click=${() => { this.categoryFilter = category.id; }}
                                        class="px-4 py-2 rounded-full text-sm font-semibold transition ${this.categoryFilter === category.id ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}">
                                        ${category.name}
                                    </button>
                                `)}
                            </div>
                        </div>

                        <!-- Price -->
                        <div class="space-y-2">
                            <h4 class="font-bold text-gray-900 dark:text-white">Price Range</h4>
                            <div class="grid grid-cols-2 gap-2">
                                ${priceBrackets.slice(0, 6).map(bracket => this.html`
                                    <button
                                        @click=${() => { this.priceFilter = bracket.max; }}
                                        class="py-2.5 rounded-xl text-sm font-semibold transition ${this.priceFilter === bracket.max ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}">
                                        ${bracket.label}
                                    </button>
                                `)}
                            </div>
                        </div>

                        <!-- Brand -->
                        <div class="space-y-2">
                            <h4 class="font-bold text-gray-900 dark:text-white">Brand</h4>
                            <div class="grid grid-cols-2 gap-2">
                                ${this.brands.slice(0, 8).map(brand => this.html`
                                    <button
                                        @click=${() => { this.brandFilter = brand; }}
                                        class="py-2.5 rounded-xl text-sm font-semibold transition ${this.brandFilter === brand ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}">
                                        ${brand}
                                    </button>
                                `)}
                            </div>
                        </div>

                        <button
                            @click=${this.closeAllSheets}
                            class="w-full py-4 rounded-xl bg-primary-700 text-white font-bold text-base touch-feedback hover:bg-primary-800 transition">
                            Apply Filters
                        </button>
                    </div>
                </div>
            </div>
        `;
    }
}

customElements.define('products-page', ProductsPage);
