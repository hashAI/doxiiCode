import { BaseComponent } from '../../components/base-component.js';
import { productsStore } from '../../assets/state.js';
import '../ui/product-card.js';

class ProductsPage extends BaseComponent {
    static properties = {
        search: { state: true },
        category: { state: true },
        priceMin: { state: true },
        priceMax: { state: true },
        sortBy: { state: true },
        viewMode: { state: true },
        showFilters: { state: true },
        selectedBrands: { state: true },
        minRating: { state: true },
        showMobileFilters: { state: true },
        filterSheetY: { state: true }
    };

    constructor() {
        super();
        this.search = '';
        this.category = '';
        this.priceMin = 0;
        this.priceMax = 10000;
        this.sortBy = 'featured';
        this.viewMode = 'grid';
        this.showFilters = true;
        this.selectedBrands = [];
        this.minRating = 0;
        this.showMobileFilters = false;
        this.filterSheetY = 0;
        this.startY = 0;
        this.isDragging = false;
    }

    connectedCallback() {
        super.connectedCallback?.();
        const query = this.getQuery();

        // First try to restore saved filter state, then override with URL params if present
        this.restoreFilterState();

        if (query?.category) {
            this.category = query.category;
        }
        if (query?.search) {
            this.search = decodeURIComponent(query.search);
        }

        // Restore scroll position after component renders
        requestAnimationFrame(() => {
            this.restoreScrollPosition();
        });

        // Save scroll position when user scrolls
        this.scrollHandler = this.saveScrollPosition.bind(this);
        window.addEventListener('scroll', this.scrollHandler, { passive: true });
    }

    disconnectedCallback() {
        super.disconnectedCallback?.();
        // Save state when navigating away
        this.saveScrollPosition();
        this.saveFilterState();
        window.removeEventListener('scroll', this.scrollHandler);
    }

    saveScrollPosition() {
        const scrollData = {
            x: window.scrollX,
            y: window.scrollY,
            timestamp: Date.now()
        };
        sessionStorage.setItem('collections-scroll-position', JSON.stringify(scrollData));
    }

    restoreScrollPosition() {
        try {
            const saved = sessionStorage.getItem('collections-scroll-position');
            if (saved) {
                const { x, y, timestamp } = JSON.parse(saved);
                // Only restore if saved within last 5 minutes
                if (Date.now() - timestamp < 5 * 60 * 1000) {
                    window.scrollTo(x, y);
                } else {
                    sessionStorage.removeItem('collections-scroll-position');
                }
            }
        } catch (error) {
            console.warn('Failed to restore scroll position:', error);
        }
    }

    saveFilterState() {
        const filterData = {
            search: this.search,
            category: this.category,
            priceMin: this.priceMin,
            priceMax: this.priceMax,
            sortBy: this.sortBy,
            viewMode: this.viewMode,
            selectedBrands: this.selectedBrands,
            minRating: this.minRating,
            timestamp: Date.now()
        };
        sessionStorage.setItem('collections-filter-state', JSON.stringify(filterData));
    }

    restoreFilterState() {
        try {
            const saved = sessionStorage.getItem('collections-filter-state');
            if (saved) {
                const data = JSON.parse(saved);
                // Only restore if saved within last 30 minutes
                if (Date.now() - data.timestamp < 30 * 60 * 1000) {
                    this.search = data.search || '';
                    this.category = data.category || '';
                    this.priceMin = data.priceMin ?? 0;
                    this.priceMax = data.priceMax ?? 10000;
                    this.sortBy = data.sortBy || 'featured';
                    this.viewMode = data.viewMode || 'grid';
                    this.selectedBrands = data.selectedBrands || [];
                    this.minRating = data.minRating ?? 0;
                } else {
                    sessionStorage.removeItem('collections-filter-state');
                }
            }
        } catch (error) {
            console.warn('Failed to restore filter state:', error);
        }
    }

    toggleBrand(brand) {
        if (this.selectedBrands.includes(brand)) {
            this.selectedBrands = this.selectedBrands.filter(b => b !== brand);
        } else {
            this.selectedBrands = [...this.selectedBrands, brand];
        }
        this.saveFilterState();
    }

    clearFilters() {
        this.search = '';
        this.category = '';
        this.priceMin = 0;
        this.priceMax = 10000;
        this.selectedBrands = [];
        this.minRating = 0;
        this.sortBy = 'featured';
        this.saveFilterState();
    }

    toggleMobileFilters() {
        this.showMobileFilters = !this.showMobileFilters;
        if (this.showMobileFilters) {
            document.body.style.overflow = 'hidden';
            this.filterSheetY = 0;
        } else {
            document.body.style.overflow = '';
        }
    }

    handleTouchStart(e) {
        this.startY = e.touches[0].clientY;
        this.isDragging = true;
    }

    handleTouchMove(e) {
        if (!this.isDragging) return;

        const currentY = e.touches[0].clientY;
        const diff = currentY - this.startY;

        if (diff > 0) {
            this.filterSheetY = Math.min(diff, 100);
        }
    }

    handleTouchEnd() {
        if (this.filterSheetY > 50) {
            this.toggleMobileFilters();
        }
        this.filterSheetY = 0;
        this.isDragging = false;
    }

    get filteredProducts() {
        let products = productsStore.products.filter(product => {
            const matchesSearch = this.search
                ? product.name.toLowerCase().includes(this.search.toLowerCase()) ||
                  product.description.toLowerCase().includes(this.search.toLowerCase())
                : true;

            const matchesCategory = this.category ? product.category === this.category : true;
            const matchesPrice = product.price >= this.priceMin && product.price <= this.priceMax;
            const matchesBrand = this.selectedBrands.length === 0 ||
                this.selectedBrands.includes(product.brand || 'Other');
            const matchesRating = (product.rating || 0) >= this.minRating;

            return matchesSearch && matchesCategory && matchesPrice && matchesBrand && matchesRating;
        });

        // Sort products
        switch (this.sortBy) {
            case 'price-low':
                products.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                products.sort((a, b) => b.price - a.price);
                break;
            case 'rating':
                products.sort((a, b) => (b.rating || 0) - (a.rating || 0));
                break;
            case 'newest':
                products.sort((a, b) => (b.id || 0) - (a.id || 0));
                break;
            default:
                break;
        }

        return products;
    }

    get availableBrands() {
        const brands = new Set();
        productsStore.products.forEach(product => {
            brands.add(product.brand || 'Other');
        });
        return Array.from(brands).sort();
    }

    get activeFiltersCount() {
        let count = 0;
        if (this.category) count++;
        if (this.selectedBrands.length > 0) count += this.selectedBrands.length;
        if (this.minRating > 0) count++;
        if (this.priceMin > 0 || this.priceMax < 10000) count++;
        return count;
    }

    removeFilter(type, value = null) {
        switch (type) {
            case 'category':
                this.category = '';
                break;
            case 'brand':
                this.selectedBrands = this.selectedBrands.filter(b => b !== value);
                break;
            case 'rating':
                this.minRating = 0;
                break;
            case 'price':
                this.priceMin = 0;
                this.priceMax = 10000;
                break;
        }
        this.saveFilterState();
    }

    updateSearch(value) {
        this.search = value;
        this.saveFilterState();
    }

    updateCategory(value) {
        this.category = value;
        this.saveFilterState();
    }

    updatePriceMin(value) {
        this.priceMin = Number(value);
        this.saveFilterState();
    }

    updatePriceMax(value) {
        this.priceMax = Number(value);
        this.saveFilterState();
    }

    updatePriceRange(min, max) {
        this.priceMin = min;
        this.priceMax = max;
        this.saveFilterState();
    }

    updateRating(value) {
        this.minRating = value;
        this.saveFilterState();
    }

    updateSort(value) {
        this.sortBy = value;
        this.saveFilterState();
    }

    updateViewMode(value) {
        this.viewMode = value;
        this.saveFilterState();
    }

    render() {
        const categories = productsStore.getCategories();
        return this.html`
            <section class="min-h-screen bg-slate-50 dark:bg-slate-900">
                <div class="mx-auto max-w-7xl px-4 py-8">
                    <!-- Header -->
                    <div class="mb-6">
                        <h1 class="text-3xl md:text-4xl font-bold mb-2">
                            ${this.category || this.search ?
                                (this.search ? `Search: "${this.search}"` : this.category) :
                                'All Products'}
                        </h1>
                        <p class="text-slate-600 dark:text-slate-400">
                            ${this.category ? `Browse our ${this.category.toLowerCase()} collection` : 'Discover our complete range of premium products'}
                        </p>
                    </div>

                    <!-- Toolbar -->
                    <div class="bg-white dark:bg-slate-800 rounded-xl p-3 sm:p-4 mb-4 space-y-3 sticky top-[104px] z-10 shadow-sm">
                        <!-- Search Bar - Full width on mobile -->
                        <div class="w-full">
                            <div class="relative">
                                <i data-lucide="search" class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"></i>
                                <input
                                    type="text"
                                    class="w-full pl-10 pr-4 py-3 bg-slate-100 dark:bg-slate-700 border-none rounded-xl outline-none touch-manipulation text-base"
                                    placeholder="Search products..."
                                    .value=${this.search}
                                    @input=${event => this.updateSearch(event.target.value)}
                                >
                            </div>
                        </div>

                        <!-- Filters & Sort Row -->
                        <div class="flex items-center gap-2">
                            <!-- Filter Button -->
                            <button
                                class="flex-1 sm:flex-initial px-4 py-3 rounded-xl border-2 ${this.activeFiltersCount > 0 ? 'border-blue-600 bg-blue-50 dark:bg-blue-950' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'} active:scale-95 transition-all touch-manipulation flex items-center justify-center gap-2 font-medium"
                                @click=${() => this.toggleMobileFilters()}
                            >
                                <i data-lucide="sliders-horizontal" class="w-5 h-5 ${this.activeFiltersCount > 0 ? 'text-blue-600' : ''}"></i>
                                <span class="text-sm sm:text-base">Filters</span>
                                ${this.activeFiltersCount > 0 ? this.html`
                                    <span class="min-w-[20px] h-5 px-1.5 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center font-bold">
                                        ${this.activeFiltersCount}
                                    </span>
                                ` : ''}
                            </button>

                            <!-- Sort Dropdown -->
                            <select
                                class="flex-1 sm:flex-initial px-3 sm:px-4 py-3 bg-white dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-700 rounded-xl outline-none cursor-pointer touch-manipulation font-medium text-sm sm:text-base"
                                .value=${this.sortBy}
                                @change=${e => this.updateSort(e.target.value)}
                            >
                                <option value="featured">Featured</option>
                                <option value="newest">Newest</option>
                                <option value="price-low">Price: Low → High</option>
                                <option value="price-high">Price: High → Low</option>
                                <option value="rating">Top Rated</option>
                            </select>

                            <!-- View Mode Toggle (Desktop) -->
                            <div class="hidden sm:flex gap-1 border-2 border-slate-200 dark:border-slate-700 rounded-xl p-1">
                                <button
                                    class="p-2 rounded-lg active:scale-95 transition ${this.viewMode === 'grid' ? 'bg-blue-600 text-white' : 'hover:bg-slate-100 dark:hover:bg-slate-700'}"
                                    @click=${() => this.updateViewMode('grid')}
                                    aria-label="Grid view"
                                >
                                    <i data-lucide="grid-3x3" class="w-5 h-5"></i>
                                </button>
                                <button
                                    class="p-2 rounded-lg active:scale-95 transition ${this.viewMode === 'list' ? 'bg-blue-600 text-white' : 'hover:bg-slate-100 dark:hover:bg-slate-700'}"
                                    @click=${() => this.updateViewMode('list')}
                                    aria-label="List view"
                                >
                                    <i data-lucide="list" class="w-5 h-5"></i>
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Active Filters Chips -->
                    ${this.activeFiltersCount > 0 ? this.html`
                        <div class="flex flex-wrap items-center gap-2 mb-4 px-1">
                            <span class="text-sm text-slate-600 dark:text-slate-400 font-medium">Active filters:</span>

                            ${this.category ? this.html`
                                <button
                                    class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium hover:bg-blue-200 dark:hover:bg-blue-800 active:scale-95 transition touch-manipulation"
                                    @click=${() => this.removeFilter('category')}
                                >
                                    ${this.category}
                                    <i data-lucide="x" class="w-3.5 h-3.5"></i>
                                </button>
                            ` : ''}

                            ${this.selectedBrands.map(brand => this.html`
                                <button
                                    class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-full text-sm font-medium hover:bg-purple-200 dark:hover:bg-purple-800 active:scale-95 transition touch-manipulation"
                                    @click=${() => this.removeFilter('brand', brand)}
                                >
                                    ${brand}
                                    <i data-lucide="x" class="w-3.5 h-3.5"></i>
                                </button>
                            `)}

                            ${this.minRating > 0 ? this.html`
                                <button
                                    class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 rounded-full text-sm font-medium hover:bg-yellow-200 dark:hover:bg-yellow-800 active:scale-95 transition touch-manipulation"
                                    @click=${() => this.removeFilter('rating')}
                                >
                                    ${this.minRating}+ ⭐
                                    <i data-lucide="x" class="w-3.5 h-3.5"></i>
                                </button>
                            ` : ''}

                            ${(this.priceMin > 0 || this.priceMax < 10000) ? this.html`
                                <button
                                    class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full text-sm font-medium hover:bg-green-200 dark:hover:bg-green-800 active:scale-95 transition touch-manipulation"
                                    @click=${() => this.removeFilter('price')}
                                >
                                    $${this.priceMin} - $${this.priceMax}
                                    <i data-lucide="x" class="w-3.5 h-3.5"></i>
                                </button>
                            ` : ''}

                            <button
                                class="inline-flex items-center gap-1 px-3 py-1.5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 text-sm font-medium underline active:scale-95 transition touch-manipulation"
                                @click=${() => this.clearFilters()}
                            >
                                Clear all
                            </button>
                        </div>
                    ` : ''}

                    <!-- Products Grid/List -->
                    <div class="mb-4 flex items-center justify-between">
                        <p class="text-sm text-slate-600 dark:text-slate-400">
                            <span class="font-semibold text-slate-900 dark:text-white">${this.filteredProducts.length}</span> products found
                        </p>
                    </div>

                    ${this.filteredProducts.length === 0 ? this.html`
                        <div class="bg-white dark:bg-slate-800 rounded-xl p-12 text-center">
                            <i data-lucide="inbox" class="w-16 h-16 mx-auto mb-4 text-slate-300"></i>
                            <h3 class="text-xl font-semibold mb-2">No products found</h3>
                            <p class="text-slate-500 dark:text-slate-400 mb-4">Try adjusting your filters or search term</p>
                            <button
                                class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 active:scale-95 transition font-semibold touch-manipulation"
                                @click=${() => this.clearFilters()}
                            >
                                Clear Filters
                            </button>
                        </div>
                    ` : this.html`
                        <div class="${this.viewMode === 'grid' ? 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6' : 'space-y-4'}">
                            ${this.filteredProducts.map(product => this.html`
                                <product-card
                                    data-product=${JSON.stringify(product)}
                                    data-view-mode=${this.viewMode}
                                ></product-card>
                            `)}
                        </div>
                    `}
                </div>

                <!-- Bottom Sheet Filter -->
                ${this.showMobileFilters ? this.renderMobileFilterSheet() : ''}
            </section>

            <style>
                @keyframes slideUp {
                    from {
                        transform: translateY(100%);
                    }
                    to {
                        transform: translateY(0);
                    }
                }
                .animate-slideUp {
                    animation: slideUp 0.3s ease-out;
                }
                .touch-manipulation {
                    touch-action: manipulation;
                }
            </style>
        `;
    }

    renderFilterSection(title, content) {
        return this.html`
            <div class="border-b border-slate-200 dark:border-slate-700 pb-5">
                <h4 class="text-base font-bold mb-4 text-slate-900 dark:text-white">${title}</h4>
                ${content}
            </div>
        `;
    }

    renderFiltersContent() {
        const categories = productsStore.getCategories();

        return this.html`
            <div class="space-y-5">
                <!-- Categories -->
                ${this.renderFilterSection('Category', this.html`
                    <div class="grid grid-cols-2 gap-2">
                        <button
                            class="px-4 py-3 rounded-xl text-sm font-medium transition touch-manipulation ${
                                this.category === ''
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                                    : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95'
                            }"
                            @click=${() => this.updateCategory('')}
                        >
                            All
                        </button>
                        ${categories.map(cat => this.html`
                            <button
                                class="px-4 py-3 rounded-xl text-sm font-medium transition touch-manipulation ${
                                    this.category === cat
                                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                                        : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95'
                                }"
                                @click=${() => this.updateCategory(cat)}
                            >
                                ${cat}
                            </button>
                        `)}
                    </div>
                `)}

                <!-- Price Range -->
                ${this.renderFilterSection('Price Range', this.html`
                    <div class="space-y-3">
                        <div class="grid grid-cols-2 gap-2">
                            ${[
                                { label: 'Under $100', min: 0, max: 100 },
                                { label: '$100-$500', min: 100, max: 500 },
                                { label: '$500-$1000', min: 500, max: 1000 },
                                { label: '$1000+', min: 1000, max: 10000 }
                            ].map(range => this.html`
                                <button
                                    class="px-4 py-3 rounded-xl text-sm font-medium transition touch-manipulation ${
                                        this.priceMin === range.min && this.priceMax === range.max
                                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                                            : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95'
                                    }"
                                    @click=${() => this.updatePriceRange(range.min, range.max)}
                                >
                                    ${range.label}
                                </button>
                            `)}
                        </div>
                        <div class="flex items-center gap-3">
                            <div class="flex-1">
                                <label class="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">Min Price</label>
                                <input
                                    type="number"
                                    placeholder="$0"
                                    class="w-full px-4 py-3 bg-slate-100 dark:bg-slate-800 rounded-xl border-none outline-none font-medium touch-manipulation"
                                    .value=${this.priceMin}
                                    @input=${e => this.updatePriceMin(e.target.value)}
                                >
                            </div>
                            <div class="flex-1">
                                <label class="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">Max Price</label>
                                <input
                                    type="number"
                                    placeholder="$10000"
                                    class="w-full px-4 py-3 bg-slate-100 dark:bg-slate-800 rounded-xl border-none outline-none font-medium touch-manipulation"
                                    .value=${this.priceMax}
                                    @input=${e => this.updatePriceMax(e.target.value)}
                                >
                            </div>
                        </div>
                    </div>
                `)}

                <!-- Brands -->
                ${this.renderFilterSection('Brand', this.html`
                    <div class="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto">
                        ${this.availableBrands.map(brand => this.html`
                            <button
                                class="px-4 py-3 rounded-xl text-sm font-medium transition touch-manipulation ${
                                    this.selectedBrands.includes(brand)
                                        ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                                        : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95'
                                }"
                                @click=${() => this.toggleBrand(brand)}
                            >
                                ${this.selectedBrands.includes(brand) ? '✓ ' : ''}${brand}
                            </button>
                        `)}
                    </div>
                `)}

                <!-- Rating -->
                ${this.renderFilterSection('Minimum Rating', this.html`
                    <div class="space-y-2">
                        ${[4, 3, 2, 1, 0].map(rating => this.html`
                            <button
                                class="w-full flex items-center justify-between px-4 py-3 rounded-xl font-medium transition touch-manipulation ${
                                    this.minRating === rating
                                        ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-900 dark:text-yellow-100 shadow-lg'
                                        : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95'
                                }"
                                @click=${() => this.updateRating(rating)}
                            >
                                <span class="text-sm">${rating > 0 ? `${rating}+ Stars` : 'All Ratings'}</span>
                                <div class="flex items-center gap-0.5">
                                    ${Array.from({ length: 5 }, (_, i) => this.html`
                                        <span class="text-base ${i < rating ? 'text-yellow-500' : 'text-slate-300 dark:text-slate-600'}">★</span>
                                    `)}
                                </div>
                            </button>
                        `)}
                    </div>
                `)}
            </div>
        `;
    }

    renderMobileFilterSheet() {
        return this.html`
            <!-- Overlay -->
            <div
                class="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 animate-fadeIn"
                @click=${() => this.toggleMobileFilters()}
            ></div>

            <!-- Bottom Sheet -->
            <div
                class="fixed inset-x-0 bottom-0 bg-white dark:bg-slate-900 rounded-t-3xl z-50 animate-slideUp max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"
                style="transform: translateY(${this.filterSheetY}px); transition: ${this.isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.32, 0.72, 0, 1)'};"
            >
                <!-- Handle Bar -->
                <div
                    class="w-full py-3 flex-shrink-0 touch-manipulation active:bg-slate-50 dark:active:bg-slate-800 transition"
                    @touchstart=${(e) => this.handleTouchStart(e)}
                    @touchmove=${(e) => this.handleTouchMove(e)}
                    @touchend=${() => this.handleTouchEnd()}
                >
                    <div class="w-12 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto"></div>
                </div>

                <!-- Header -->
                <div class="flex items-center justify-between px-6 pb-4 flex-shrink-0">
                    <div>
                        <h3 class="font-bold text-2xl mb-1">Filters</h3>
                        <p class="text-sm text-slate-500 dark:text-slate-400">
                            ${this.activeFiltersCount > 0 ? `${this.activeFiltersCount} active filter${this.activeFiltersCount > 1 ? 's' : ''}` : 'No filters applied'}
                        </p>
                    </div>
                    ${this.activeFiltersCount > 0 ? this.html`
                        <button
                            class="text-sm text-blue-600 hover:text-blue-700 active:scale-95 transition touch-manipulation px-4 py-2 font-semibold"
                            @click=${() => this.clearFilters()}
                        >
                            Clear All
                        </button>
                    ` : ''}
                </div>

                <!-- Filter Content with custom scrollbar -->
                <div class="flex-1 overflow-y-auto px-6 py-4 overscroll-contain" style="-webkit-overflow-scrolling: touch;">
                    ${this.renderFiltersContent()}
                    <!-- Bottom padding for comfortable scrolling -->
                    <div class="h-4"></div>
                </div>

                <!-- Apply Button - Fixed at bottom -->
                <div class="p-6 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex-shrink-0">
                    <div class="flex gap-3">
                        ${this.activeFiltersCount > 0 ? this.html`
                            <button
                                class="px-6 py-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl font-bold active:scale-95 transition touch-manipulation"
                                @click=${() => this.clearFilters()}
                            >
                                Reset
                            </button>
                        ` : ''}
                        <button
                            class="flex-1 px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-bold active:scale-95 transition touch-manipulation flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30"
                            @click=${() => this.toggleMobileFilters()}
                        >
                            <span>Show ${this.filteredProducts.length} Product${this.filteredProducts.length !== 1 ? 's' : ''}</span>
                            <i data-lucide="check" class="w-5 h-5"></i>
                        </button>
                    </div>
                </div>
            </div>

            <style>
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.2s ease-out;
                }
            </style>
        `;
    }
}

customElements.define('products-page', ProductsPage);
