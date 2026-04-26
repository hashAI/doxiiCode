import { BaseComponent } from '../base-component.js';
import { productsStore, cartStore, shortlistStore, frameShapes, categoriesMeta } from '../../assets/state.js';
import { formatCurrency, showToast, showOverlay, hideOverlay, getImageUrl } from '../../assets/utils.js';

class ProductsPage extends BaseComponent {
    static properties = {
        products: { type: Array },
        category: { type: String },
        sortBy: { type: String },
        showSortSheet: { type: Boolean },
        showFilterSheet: { type: Boolean },
        viewMode: { type: String },
        selectedShape: { type: String }
    };

    constructor() {
        super();
        this.products = [];
        this.category = '';
        this.sortBy = 'recommended';
        this.showSortSheet = false;
        this.showFilterSheet = false;
        this.viewMode = 'grid';
        this.selectedShape = 'all';
    }

    connectedCallback() {
        super.connectedCallback();
        const params = this.getParams();
        this.category = params.category || 'eyeglasses';
        this.loadProducts();
    }

    loadProducts() {
        this.products = productsStore.getByCategory(this.category);
        this.applySorting();
    }

    applySorting() {
        switch (this.sortBy) {
            case 'bestsellers':
                this.products.sort((a, b) => b.reviews - a.reviews);
                break;
            case 'new-arrivals':
                this.products.sort((a, b) => b.id.localeCompare(a.id));
                break;
            case 'price-low-high':
                this.products.sort((a, b) => a.price - b.price);
                break;
            case 'price-high-low':
                this.products.sort((a, b) => b.price - a.price);
                break;
            default:
                break;
        }
        this.requestUpdate();
    }

    openSortSheet() {
        this.showSortSheet = true;
        showOverlay(() => this.closeSortSheet());
        this.requestUpdate();
    }

    closeSortSheet() {
        this.showSortSheet = false;
        hideOverlay();
        this.requestUpdate();
    }

    selectSort(sortBy) {
        this.sortBy = sortBy;
        this.applySorting();
        this.closeSortSheet();
    }

    openFilterSheet() {
        this.showFilterSheet = true;
        showOverlay(() => this.closeFilterSheet());
        this.requestUpdate();
    }

    closeFilterSheet() {
        this.showFilterSheet = false;
        hideOverlay();
        this.requestUpdate();
    }

    selectShape(shape) {
        this.selectedShape = shape;
        if (shape === 'all') {
            this.loadProducts();
        } else {
            this.products = productsStore.getBySubcategory(this.category, shape);
            this.applySorting();
        }
        this.closeFilterSheet();
    }

    addToCart(product, event) {
        event.preventDefault();
        event.stopPropagation();

        cartStore.add(product, 1);
        showToast({
            title: 'Added to cart',
            message: `${product.name} added successfully`,
            variant: 'success'
        });
    }

    toggleWishlist(product, event) {
        event.preventDefault();
        event.stopPropagation();

        shortlistStore.toggle(product);
        const isInWishlist = this.isInWishlist(product.id);
        showToast({
            title: isInWishlist ? 'Added to Wishlist' : 'Removed from Wishlist',
            message: product.name,
            variant: 'info'
        });
        this.requestUpdate();
    }

    isInWishlist(productId) {
        return shortlistStore.getState().items.find(item => item.id === productId);
    }

    toggleViewMode() {
        this.viewMode = this.viewMode === 'grid' ? 'list' : 'grid';
        this.requestUpdate();
    }

    render() {
        const categoryMeta = categoriesMeta[this.category] || { label: this.category, emoji: '👓' };

        const sortOptions = [
            { id: 'recommended', label: 'Recommended' },
            { id: 'bestsellers', label: 'Bestsellers' },
            { id: 'new-arrivals', label: 'New Arrivals' },
            { id: 'price-low-high', label: 'Price: Low to High' },
            { id: 'price-high-low', label: 'Price: High to Low' }
        ];

        return this.html`
            <div class="min-h-screen bg-gray-50 dark:bg-slate-900">
                <!-- Hero Banner -->
                <div class="relative bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900 overflow-hidden">
                    <div class="absolute inset-0 opacity-20">
                        <img src="${getImageUrl(this.category, 1200, 0)}" alt="${categoryMeta.label}" class="w-full h-full object-cover">
                    </div>
                    <div class="relative container-desktop py-8 lg:py-16">
                        <div class="flex items-center gap-2 text-brand-400 text-sm mb-2">
                            <a href="#/" class="hover:text-brand-300 transition-colors">Home</a>
                            <i data-lucide="chevron-right" class="w-4 h-4"></i>
                            <span class="text-white">${categoryMeta.label}</span>
                        </div>
                        <div class="flex items-center gap-4 mb-4">
                            <span class="text-4xl lg:text-5xl">${categoryMeta.emoji}</span>
                            <h1 class="font-display text-3xl lg:text-5xl font-bold text-white">${categoryMeta.label}</h1>
                        </div>
                        <p class="text-gray-300 max-w-xl">${categoryMeta.description}</p>
                    </div>
                </div>

                <!-- Filter Bar -->
                <div class="sticky top-[108px] lg:top-[156px] z-30 bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800 shadow-sm">
                    <div class="container-desktop py-3">
                        <div class="flex items-center justify-between gap-4">
                            <!-- Left: Filters -->
                            <div class="flex items-center gap-3">
                                <!-- Mobile Filter Button -->
                                <button
                                    @click=${() => this.openFilterSheet()}
                                    class="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-gray-100 dark:bg-slate-800 rounded-xl text-sm font-medium touch-feedback"
                                >
                                    <i data-lucide="sliders-horizontal" class="w-4 h-4"></i>
                                    <span>Filters</span>
                                </button>

                                <!-- Desktop Filters -->
                                <div class="hidden lg:flex items-center gap-2">
                                    <span class="text-sm text-gray-500 dark:text-gray-400 mr-2">Frame Shape:</span>
                                    <button
                                        @click=${() => this.selectShape('all')}
                                        class="px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                                            this.selectedShape === 'all'
                                                ? 'bg-navy-900 dark:bg-brand-500 text-white'
                                                : 'bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700'
                                        }"
                                    >All</button>
                                    ${frameShapes.slice(0, 5).map(shape => this.html`
                                        <button
                                            @click=${() => this.selectShape(shape.id)}
                                            class="px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                                                this.selectedShape === shape.id
                                                    ? 'bg-navy-900 dark:bg-brand-500 text-white'
                                                    : 'bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700'
                                            }"
                                        >${shape.label}</button>
                                    `)}
                                </div>
                            </div>

                            <!-- Right: Sort & View -->
                            <div class="flex items-center gap-3">
                                <span class="text-sm text-gray-500 dark:text-gray-400 hidden lg:inline">${this.products.length} products</span>

                                <!-- Sort Dropdown (Desktop) -->
                                <div class="hidden lg:block relative group">
                                    <button class="flex items-center gap-2 px-4 py-2.5 bg-gray-100 dark:bg-slate-800 rounded-xl text-sm font-medium hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors">
                                        <i data-lucide="arrow-up-down" class="w-4 h-4"></i>
                                        <span>${sortOptions.find(o => o.id === this.sortBy)?.label}</span>
                                        <i data-lucide="chevron-down" class="w-4 h-4"></i>
                                    </button>
                                    <div class="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-gray-100 dark:border-slate-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                                        ${sortOptions.map(option => this.html`
                                            <button
                                                @click=${() => this.selectSort(option.id)}
                                                class="w-full px-4 py-3 text-left text-sm hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors first:rounded-t-xl last:rounded-b-xl ${
                                                    this.sortBy === option.id ? 'text-brand-500 font-semibold' : 'text-gray-700 dark:text-gray-300'
                                                }"
                                            >
                                                ${option.label}
                                            </button>
                                        `)}
                                    </div>
                                </div>

                                <!-- Mobile Sort Button -->
                                <button
                                    @click=${() => this.openSortSheet()}
                                    class="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-gray-100 dark:bg-slate-800 rounded-xl text-sm font-medium touch-feedback"
                                >
                                    <i data-lucide="arrow-up-down" class="w-4 h-4"></i>
                                    <span>Sort</span>
                                </button>

                                <!-- View Mode Toggle (Desktop) -->
                                <div class="hidden lg:flex items-center gap-1 bg-gray-100 dark:bg-slate-800 rounded-xl p-1">
                                    <button
                                        @click=${() => { this.viewMode = 'grid'; this.requestUpdate(); }}
                                        class="p-2 rounded-lg transition-colors ${this.viewMode === 'grid' ? 'bg-white dark:bg-slate-700 shadow-sm' : 'hover:bg-gray-200 dark:hover:bg-slate-700'}"
                                    >
                                        <i data-lucide="grid-3x3" class="w-4 h-4"></i>
                                    </button>
                                    <button
                                        @click=${() => { this.viewMode = 'list'; this.requestUpdate(); }}
                                        class="p-2 rounded-lg transition-colors ${this.viewMode === 'list' ? 'bg-white dark:bg-slate-700 shadow-sm' : 'hover:bg-gray-200 dark:hover:bg-slate-700'}"
                                    >
                                        <i data-lucide="list" class="w-4 h-4"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Products Grid -->
                <div class="container-desktop py-6 lg:py-10">
                    ${this.products.length === 0 ? this.html`
                        <div class="flex flex-col items-center justify-center py-20 text-center">
                            <div class="w-24 h-24 bg-gray-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
                                <i data-lucide="glasses" class="w-12 h-12 text-gray-400 dark:text-gray-600"></i>
                            </div>
                            <h3 class="text-xl font-semibold text-navy-900 dark:text-white mb-2">No products found</h3>
                            <p class="text-gray-500 dark:text-gray-400 mb-6">Try adjusting your filters or browse other categories</p>
                            <a href="#/" class="inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors">
                                <i data-lucide="arrow-left" class="w-4 h-4"></i>
                                <span>Back to Home</span>
                            </a>
                        </div>
                    ` : this.html`
                        ${this.viewMode === 'grid' ? this.html`
                            <!-- Grid View -->
                            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
                                ${this.products.map(product => this.html`
                                    <a
                                        href="#/product/${product.id}"
                                        class="product-card group bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-card"
                                    >
                                        <div class="relative aspect-square bg-gray-100 dark:bg-slate-700 overflow-hidden">
                                            <img
                                                src="${product.images[0]}"
                                                alt="${product.name}"
                                                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            >
                                            ${product.discount ? this.html`
                                                <span class="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg">
                                                    ${product.discount}% OFF
                                                </span>
                                            ` : ''}
                                            ${product.powered ? this.html`
                                                <span class="absolute top-3 ${product.discount ? 'left-20' : 'left-3'} bg-brand-500 text-white text-xs font-bold px-2 py-1 rounded-lg">
                                                    POWERED
                                                </span>
                                            ` : ''}
                                            <button
                                                @click=${(e) => this.toggleWishlist(product, e)}
                                                class="absolute top-3 right-3 w-9 h-9 bg-white/90 dark:bg-slate-800/90 backdrop-blur rounded-full flex items-center justify-center hover:bg-white dark:hover:bg-slate-700 transition-colors shadow-sm"
                                            >
                                                <i data-lucide="heart" class="w-4 h-4 ${this.isInWishlist(product.id) ? 'fill-red-500 text-red-500' : 'text-gray-600 dark:text-gray-400'}"></i>
                                            </button>

                                            <!-- Quick Add (Desktop) -->
                                            <div class="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity hidden lg:block">
                                                <button
                                                    @click=${(e) => this.addToCart(product, e)}
                                                    class="w-full bg-white text-navy-900 py-2.5 rounded-xl font-semibold text-sm hover:bg-brand-500 hover:text-white transition-colors"
                                                >
                                                    Add to Cart
                                                </button>
                                            </div>
                                        </div>
                                        <div class="p-4">
                                            <h3 class="font-semibold text-sm lg:text-base text-navy-900 dark:text-white line-clamp-2 mb-2">${product.name}</h3>
                                            <div class="flex items-center gap-2 mb-2">
                                                <div class="flex items-center gap-1 text-yellow-500">
                                                    <i data-lucide="star" class="w-3.5 h-3.5 fill-current"></i>
                                                    <span class="text-xs font-semibold">${product.rating}</span>
                                                </div>
                                                <span class="text-xs text-gray-400">(${product.reviews.toLocaleString()})</span>
                                            </div>
                                            <div class="flex items-center gap-2">
                                                <span class="font-bold text-lg text-navy-900 dark:text-white">${formatCurrency(product.price)}</span>
                                                ${product.originalPrice ? this.html`
                                                    <span class="text-sm text-gray-400 line-through">${formatCurrency(product.originalPrice)}</span>
                                                ` : ''}
                                            </div>
                                            ${product.colors ? this.html`
                                                <div class="flex items-center gap-1 mt-3">
                                                    ${product.colors.slice(0, 4).map((_, i) => this.html`
                                                        <div class="w-4 h-4 rounded-full border border-gray-200 dark:border-slate-600" style="background-color: ${product.colorHex?.[i] || '#ccc'}"></div>
                                                    `)}
                                                    ${product.colors.length > 4 ? this.html`
                                                        <span class="text-xs text-gray-400 ml-1">+${product.colors.length - 4}</span>
                                                    ` : ''}
                                                </div>
                                            ` : ''}
                                        </div>
                                    </a>
                                `)}
                            </div>
                        ` : this.html`
                            <!-- List View (Desktop) -->
                            <div class="space-y-4">
                                ${this.products.map(product => this.html`
                                    <a
                                        href="#/product/${product.id}"
                                        class="product-card group flex gap-6 bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-card p-4 lg:p-6"
                                    >
                                        <div class="relative w-40 lg:w-52 shrink-0">
                                            <div class="aspect-square bg-gray-100 dark:bg-slate-700 rounded-xl overflow-hidden">
                                                <img
                                                    src="${product.images[0]}"
                                                    alt="${product.name}"
                                                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                >
                                            </div>
                                            ${product.discount ? this.html`
                                                <span class="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg">
                                                    ${product.discount}% OFF
                                                </span>
                                            ` : ''}
                                        </div>
                                        <div class="flex-1 py-2">
                                            <div class="flex items-start justify-between gap-4">
                                                <div>
                                                    <h3 class="font-semibold text-lg text-navy-900 dark:text-white mb-2">${product.name}</h3>
                                                    <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">${product.description}</p>
                                                    <div class="flex items-center gap-3 mb-4">
                                                        <div class="flex items-center gap-1 text-yellow-500">
                                                            <i data-lucide="star" class="w-4 h-4 fill-current"></i>
                                                            <span class="font-semibold">${product.rating}</span>
                                                        </div>
                                                        <span class="text-sm text-gray-400">(${product.reviews.toLocaleString()} reviews)</span>
                                                    </div>
                                                    ${product.colors ? this.html`
                                                        <div class="flex items-center gap-2">
                                                            <span class="text-sm text-gray-500">Colors:</span>
                                                            ${product.colors.slice(0, 6).map((color, i) => this.html`
                                                                <div class="w-6 h-6 rounded-full border-2 border-white shadow" style="background-color: ${product.colorHex?.[i] || '#ccc'}" title="${color}"></div>
                                                            `)}
                                                        </div>
                                                    ` : ''}
                                                </div>
                                                <div class="text-right">
                                                    <div class="flex items-center gap-2 mb-2">
                                                        <span class="font-bold text-2xl text-navy-900 dark:text-white">${formatCurrency(product.price)}</span>
                                                        ${product.originalPrice ? this.html`
                                                            <span class="text-gray-400 line-through">${formatCurrency(product.originalPrice)}</span>
                                                        ` : ''}
                                                    </div>
                                                    ${product.discount ? this.html`
                                                        <span class="text-sm text-green-600 font-semibold">Save ${product.discount}%</span>
                                                    ` : ''}
                                                </div>
                                            </div>
                                            <div class="flex items-center gap-3 mt-4">
                                                <button
                                                    @click=${(e) => this.addToCart(product, e)}
                                                    class="flex-1 bg-navy-900 dark:bg-brand-500 hover:bg-navy-800 dark:hover:bg-brand-600 text-white py-3 rounded-xl font-semibold transition-colors"
                                                >
                                                    Add to Cart
                                                </button>
                                                <button
                                                    @click=${(e) => this.toggleWishlist(product, e)}
                                                    class="w-12 h-12 bg-gray-100 dark:bg-slate-700 rounded-xl flex items-center justify-center hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
                                                >
                                                    <i data-lucide="heart" class="w-5 h-5 ${this.isInWishlist(product.id) ? 'fill-red-500 text-red-500' : 'text-gray-600 dark:text-gray-400'}"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </a>
                                `)}
                            </div>
                        `}
                    `}
                </div>

                <!-- Sort Sheet (Mobile) -->
                <div class="bottom-sheet ${this.showSortSheet ? 'open' : ''}">
                    <div class="bottom-sheet-handle"></div>
                    <div class="p-6">
                        <div class="flex items-center justify-between mb-6">
                            <h3 class="text-lg font-bold text-navy-900 dark:text-white">Sort By</h3>
                            <button @click=${() => this.closeSortSheet()} class="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg">
                                <i data-lucide="x" class="w-5 h-5"></i>
                            </button>
                        </div>
                        <div class="space-y-1">
                            ${sortOptions.map(option => this.html`
                                <button
                                    @click=${() => this.selectSort(option.id)}
                                    class="w-full flex items-center gap-3 p-4 hover:bg-gray-50 dark:hover:bg-slate-700 rounded-xl transition-colors text-left"
                                >
                                    <div class="w-5 h-5 rounded-full border-2 ${this.sortBy === option.id ? 'border-brand-500 bg-brand-500' : 'border-gray-300'} flex items-center justify-center">
                                        ${this.sortBy === option.id ? this.html`
                                            <div class="w-2 h-2 bg-white rounded-full"></div>
                                        ` : ''}
                                    </div>
                                    <span class="font-medium ${this.sortBy === option.id ? 'text-brand-500' : 'text-navy-900 dark:text-white'}">${option.label}</span>
                                </button>
                            `)}
                        </div>
                    </div>
                </div>

                <!-- Filter Sheet (Mobile) -->
                <div class="bottom-sheet ${this.showFilterSheet ? 'open' : ''}">
                    <div class="bottom-sheet-handle"></div>
                    <div class="p-6">
                        <div class="flex items-center justify-between mb-6">
                            <h3 class="text-lg font-bold text-navy-900 dark:text-white">Filter by Shape</h3>
                            <button @click=${() => this.closeFilterSheet()} class="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg">
                                <i data-lucide="x" class="w-5 h-5"></i>
                            </button>
                        </div>
                        <div class="grid grid-cols-3 gap-3 mb-6">
                            <button
                                @click=${() => this.selectShape('all')}
                                class="flex flex-col items-center gap-2 p-4 rounded-xl transition-colors ${
                                    this.selectedShape === 'all'
                                        ? 'bg-brand-50 dark:bg-brand-900/30 border-2 border-brand-500'
                                        : 'bg-gray-100 dark:bg-slate-700 border-2 border-transparent'
                                }"
                            >
                                <i data-lucide="grid-3x3" class="w-8 h-8 ${this.selectedShape === 'all' ? 'text-brand-500' : 'text-gray-500'}"></i>
                                <span class="text-sm font-medium ${this.selectedShape === 'all' ? 'text-brand-500' : 'text-navy-900 dark:text-white'}">All</span>
                            </button>
                            ${frameShapes.map(shape => this.html`
                                <button
                                    @click=${() => this.selectShape(shape.id)}
                                    class="flex flex-col items-center gap-2 p-4 rounded-xl transition-colors ${
                                        this.selectedShape === shape.id
                                            ? 'bg-brand-50 dark:bg-brand-900/30 border-2 border-brand-500'
                                            : 'bg-gray-100 dark:bg-slate-700 border-2 border-transparent'
                                    }"
                                >
                                    <img src="${shape.image}" alt="${shape.label}" class="w-12 h-8 object-contain">
                                    <span class="text-sm font-medium ${this.selectedShape === shape.id ? 'text-brand-500' : 'text-navy-900 dark:text-white'}">${shape.label}</span>
                                </button>
                            `)}
                        </div>
                        <button
                            @click=${() => this.closeFilterSheet()}
                            class="w-full bg-navy-900 dark:bg-brand-500 text-white py-4 rounded-xl font-semibold"
                        >
                            Apply Filters
                        </button>
                    </div>
                </div>

                <!-- Bottom spacing for mobile -->
                <div class="h-4 lg:h-12"></div>
            </div>
        `;
    }
}

customElements.define('products-page', ProductsPage);
