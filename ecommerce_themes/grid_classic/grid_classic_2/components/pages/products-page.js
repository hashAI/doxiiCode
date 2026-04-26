import { BaseComponent } from '../base-component.js';
import { productsStore, categoriesMeta, cartStore } from '../../assets/state.js';
import { navigate } from '../../assets/router.js';
import { formatCurrency, showToast, getImageUrl } from '../../assets/utils.js';

class ProductsPage extends BaseComponent {
    static properties = {
        products: { type: Array },
        category: { type: Object },
        subcategories: { type: Array },
        selectedSubcategory: { type: String },
        cartItems: { type: Object },
        showFilters: { type: Boolean },
        sortBy: { type: String },
        priceRange: { type: String },
        inStockOnly: { type: Boolean },
        minRating: { type: String }
    };

    constructor() {
        super();
        this.products = [];
        this.category = null;
        this.subcategories = [];
        this.selectedSubcategory = 'All';
        this.cartItems = {};
        this.showFilters = false;
        this.sortBy = 'popular';
        this.priceRange = 'all';
        this.inStockOnly = false;
        this.minRating = 'any';
    }

    connectedCallback() {
        super.connectedCallback();
        const params = this.getParams();
        const categoryId = params.category;

        this.category = categoriesMeta.find(c => c.id === categoryId);
        if (this.category) {
            this.products = productsStore.getByCategory(this.category.name);
            const subs = productsStore.getSubcategories(this.category.name);
            this.subcategories = ['All', ...subs];
        }

        this.unsubscribe = cartStore.subscribe((state) => {
            this.cartItems = state.items.reduce((acc, item) => {
                acc[item.id] = item.quantity;
                return acc;
            }, {});
        });

        this.overlayHandler = () => {
            if (this.showFilters) {
                this.toggleFilters();
            }
        };
        document.getElementById('overlay')?.addEventListener('click', this.overlayHandler);
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        this.unsubscribe?.();
        document.getElementById('overlay')?.removeEventListener('click', this.overlayHandler);
    }

    get filteredProducts() {
        let list = this.selectedSubcategory === 'All'
            ? [...this.products]
            : this.products.filter(p => p.subcategory === this.selectedSubcategory);

        // Availability
        if (this.inStockOnly) {
            list = list.filter((p) => p.inStock !== false);
        }

        // Rating filter
        if (this.minRating !== 'any') {
            const threshold = parseFloat(this.minRating);
            list = list.filter((p) => (p.rating || 0) >= threshold);
        }

        // Price filter
        list = list.filter((p) => {
            switch (this.priceRange) {
                case 'under50':
                    return p.price < 50;
                case '50to100':
                    return p.price >= 50 && p.price <= 100;
                case '100to200':
                    return p.price > 100 && p.price <= 200;
                case '200plus':
                    return p.price > 200;
                default:
                    return true;
            }
        });

        // Sorting
        list.sort((a, b) => {
            switch (this.sortBy) {
                case 'lowToHigh':
                    return a.price - b.price;
                case 'highToLow':
                    return b.price - a.price;
                case 'newest':
                    return (b.id || 0) - (a.id || 0);
                default:
                    // popular: fallback to rating then reviews
                    const ratingDiff = (b.rating || 0) - (a.rating || 0);
                    if (ratingDiff !== 0) return ratingDiff;
                    return (b.reviews || 0) - (a.reviews || 0);
            }
        });

        return list;
    }

    addToCart(product) {
        cartStore.add(product, 1);
        showToast({
            title: 'Added to cart',
            message: `${product.name} added successfully`,
            variant: 'success'
        });
    }

    updateQuantity(product, delta) {
        const currentQty = this.cartItems[product.id] || 0;
        const newQty = currentQty + delta;

        if (newQty <= 0) {
            cartStore.remove(product.id);
        } else {
            cartStore.update(product.id, newQty);
        }
    }

    toggleFilters() {
        this.showFilters = !this.showFilters;
        if (this.showFilters) {
            document.getElementById('overlay')?.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        } else {
            document.getElementById('overlay')?.classList.add('hidden');
            document.body.style.overflow = '';
        }
    }

    setSort(sortKey) {
        this.sortBy = sortKey;
        this.requestUpdate();
    }

    setPriceRange(rangeKey) {
        this.priceRange = rangeKey;
        this.requestUpdate();
    }

    setSubcategory(sub) {
        this.selectedSubcategory = sub;
        this.requestUpdate();
    }

    setAvailability(flag) {
        this.inStockOnly = flag;
        this.requestUpdate();
    }

    setRating(minRating) {
        this.minRating = minRating;
        this.requestUpdate();
    }

    clearFilters() {
        this.sortBy = 'popular';
        this.priceRange = 'all';
        this.selectedSubcategory = 'All';
        this.inStockOnly = false;
        this.minRating = 'any';
        this.showFilters = false;
        document.getElementById('overlay')?.classList.add('hidden');
        document.body.style.overflow = '';
    }

    render() {
        if (!this.category) {
            return this.html`<div class="p-4">Category not found</div>`;
        }

        return this.html`
            <div class="pb-20 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors">
                <!-- Breadcrumb -->
                <div class="bg-white dark:bg-gray-800 px-4 py-3 border-b border-gray-100 dark:border-gray-700 transition-colors">
                    <div class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                        <button @click=${() => navigate('/')} class="hover:text-gray-900 dark:hover:text-white touch-feedback">
                            Home
                        </button>
                        <i data-lucide="chevron-right" class="w-3 h-3"></i>
                        <span class="text-gray-900 dark:text-white font-medium truncate">${this.category.name}</span>
                        <i data-lucide="chevron-right" class="w-3 h-3"></i>
                    </div>
                </div>

                <!-- Top Picks Header with Sort -->
                <div class="bg-white dark:bg-gray-800 px-4 py-3 border-b border-gray-100 dark:border-gray-700 sticky top-[64px] z-20 transition-colors">
                    <div class="flex items-center justify-between">
                        <h2 class="text-xl font-bold text-gray-900 dark:text-white">
                            ${this.category?.name || 'Products'}
                        </h2>
                        <button
                            @click=${this.toggleFilters}
                            class="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-xl text-sm font-semibold touch-feedback transition-colors hover:bg-gray-200 dark:hover:bg-gray-600 dark:text-gray-200">
                            <i data-lucide="sliders-horizontal" class="w-4 h-4"></i>
                            Filters
                        </button>
                    </div>
                </div>

                <!-- SubcategoryTabs (Horizontal Scroll) -->
                ${this.subcategories.length > 1 ? this.html`
                    <div class="bg-white dark:bg-gray-800 px-4 py-3 border-b border-gray-100 dark:border-gray-700 sticky top-[120px] z-20 transition-colors">
                        <div class="flex gap-2 overflow-x-auto scrollbar-hide" style="-webkit-overflow-scrolling: touch;">
                            ${this.subcategories.map(sub => this.html`
                                <button
                                    @click=${() => { this.selectedSubcategory = sub; }}
                                    class="flex-shrink-0 px-5 py-2.5 rounded-full text-sm font-semibold transition-all touch-feedback
                                           ${this.selectedSubcategory === sub
                                             ? 'bg-primary-500 text-white shadow-md'
                                             : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'}">
                                    ${sub}
                                </button>
                            `)}
                        </div>
                    </div>
                ` : ''}

                <!-- Products Grid -->
                <div class="px-4 pt-4">
                    <!-- Banner (only for "All" subcategory) -->
                    ${this.selectedSubcategory === 'All' ? this.html`
                        <div class="mb-4">
                            <div class="bg-gradient-to-r from-gray-900 to-gray-700 rounded-2xl p-5 relative overflow-hidden">
                                <div class="relative z-10 max-w-[60%]">
                                    <p class="text-white/90 text-xs font-medium mb-1">Premium Grade</p>
                                    <h3 class="text-white font-bold text-lg mb-1">Spices</h3>
                                    <p class="text-white/80 text-xs mb-2">Authentic dishes deserve real spices</p>
                                    <p class="text-white font-bold text-base mb-2">UPTO 30% OFF</p>
                                    <button class="bg-white text-gray-900 px-3 py-1.5 rounded-lg font-bold text-xs touch-feedback">
                                        ORDER NOW
                                    </button>
                                </div>
                                <div class="absolute right-2 top-1/2 -translate-y-1/2">
                                    <img src="${getImageUrl('spice containers', 300, 0)}" alt="Spices" class="w-32 h-32 object-contain opacity-90">
                                </div>
                            </div>
                        </div>
                    ` : ''}

                    <!-- Product Grid (2 columns) -->
                    <div class="grid grid-cols-2 gap-3 pb-4">
                        ${this.filteredProducts.map(product => this.html`
                            <div class="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700 transition-colors"
                                 @click=${() => navigate(`/product/${product.id}`)}>
                                <!-- Product Image -->
                                <div class="relative bg-white dark:bg-gray-900 p-3 transition-colors">
                                    ${product.badge ? this.html`
                                        <div class="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-md font-semibold z-10">
                                            ${product.badge}
                                        </div>
                                    ` : ''}
                                    <img src="${product.image}" alt="${product.name}" class="w-full h-36 object-contain">
                                </div>

                                <!-- Product Info -->
                                <div class="px-3 pb-3">
                                    <h3 class="font-semibold text-sm leading-tight mb-1 line-clamp-2 min-h-[2.5rem] dark:text-gray-100">${product.name}</h3>
                                    <p class="text-xs text-gray-500 dark:text-gray-400 mb-2">${product.unit}</p>

                                    ${product.rating ? this.html`
                                        <div class="flex items-center gap-1 mb-2">
                                            <i data-lucide="star" class="w-3.5 h-3.5 fill-green-600 text-green-600"></i>
                                            <span class="text-xs font-bold text-gray-900 dark:text-gray-100">${product.rating}</span>
                                            <span class="text-xs text-gray-400 dark:text-gray-500">(${(product.reviews / 1000).toFixed(1)}k)</span>
                                        </div>
                                    ` : ''}

                                    <!-- Price & Add Button -->
                                    <div class="flex items-end justify-between gap-2">
                                        <div class="flex-1 min-w-0">
                                            <p class="font-bold text-base text-green-700 dark:text-green-400 mb-0.5">${formatCurrency(product.price)}</p>
                                            ${product.originalPrice ? this.html`
                                                <div class="flex flex-col">
                                                    <p class="text-xs text-gray-400 dark:text-gray-500 line-through">${formatCurrency(product.originalPrice)}</p>
                                                </div>
                                            ` : ''}
                                        </div>

                                        <div class="flex-shrink-0" @click=${(e) => e.stopPropagation()}>
                                            ${this.cartItems[product.id] ? this.html`
                                                <div class="flex items-center bg-primary-500 rounded-lg">
                                                    <button
                                                        @click=${() => this.updateQuantity(product, -1)}
                                                        class="px-2 py-1.5 text-white font-bold text-sm touch-feedback">
                                                        −
                                                    </button>
                                                    <span class="font-bold text-sm text-white px-2 min-w-[24px] text-center">${this.cartItems[product.id]}</span>
                                                    <button
                                                        @click=${() => this.updateQuantity(product, 1)}
                                                        class="px-2 py-1.5 text-white font-bold text-sm touch-feedback">
                                                        +
                                                    </button>
                                                </div>
                                            ` : this.html`
                                                <button
                                                    @click=${() => this.addToCart(product)}
                                                    class="bg-white dark:bg-gray-900 border-2 border-primary-500 dark:border-primary-400 text-primary-500 dark:text-primary-400 px-3 py-1.5 rounded-lg text-xs font-bold touch-feedback hover:bg-primary-50 dark:hover:bg-gray-800 transition-colors">
                                                    ADD
                                                </button>
                                            `}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        `)}
                    </div>

                    ${this.filteredProducts.length === 0 ? this.html`
                        <div class="flex flex-col items-center justify-center py-16 px-4">
                            <i data-lucide="package-x" class="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4"></i>
                            <p class="text-gray-500 dark:text-gray-300 font-medium">No products found</p>
                            <p class="text-sm text-gray-400 dark:text-gray-500 mt-1">Try selecting a different category</p>
                        </div>
                    ` : ''}
                </div>

                <!-- Filters Bottom Sheet -->
                <div class="bottom-sheet ${this.showFilters ? 'open' : ''}" style="max-height: 70vh;">
                    <div class="bottom-sheet-handle"></div>
                    <div class="p-4 overflow-y-auto" style="max-height: 65vh;">
                        <div class="flex items-center justify-between mb-4">
                            <h3 class="font-bold text-xl dark:text-white">Filters</h3>
                            <button @click=${this.toggleFilters} class="p-2 touch-feedback">
                                <i data-lucide="x" class="w-5 h-5 dark:text-gray-300"></i>
                            </button>
                        </div>

                        <!-- Sort By -->
                        <div class="mb-6">
                            <h4 class="font-semibold text-sm mb-3 dark:text-gray-100">Sort By</h4>
                            <div class="space-y-2">
                                ${[
                                    { key: 'popular', label: 'Popular' },
                                    { key: 'lowToHigh', label: 'Price: Low to High' },
                                    { key: 'highToLow', label: 'Price: High to Low' },
                                    { key: 'newest', label: 'Newest' }
                                ].map(option => this.html`
                                    <button
                                        @click=${() => this.setSort(option.key)}
                                        class="w-full flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-xl touch-feedback transition-colors hover:bg-gray-100 dark:hover:bg-gray-700">
                                        <span class="text-sm font-medium dark:text-gray-100">${option.label}</span>
                                        <i data-lucide="check" class="w-4 h-4 text-primary-500 ${this.sortBy === option.key ? '' : 'invisible'}"></i>
                                    </button>
                                `)}
                            </div>
                        </div>

                        <!-- Price Range -->
                        <div class="mb-6">
                            <h4 class="font-semibold text-sm mb-3 dark:text-gray-100">Price Range</h4>
                            <div class="grid grid-cols-2 gap-2">
                                ${[
                                    { key: 'under50', label: 'Under ₹50' },
                                    { key: '50to100', label: '₹50-₹100' },
                                    { key: '100to200', label: '₹100-₹200' },
                                    { key: '200plus', label: '₹200+' },
                                    { key: 'all', label: 'Any price' }
                                ].map(range => this.html`
                                    <button
                                        @click=${() => this.setPriceRange(range.key)}
                                        class="px-4 py-2 bg-gray-50 dark:bg-gray-800 rounded-xl text-sm font-medium touch-feedback hover:bg-primary-50 dark:hover:bg-gray-700 dark:text-gray-100 transition-colors border ${this.priceRange === range.key ? 'border-primary-500 text-primary-600 dark:text-primary-400' : 'border-transparent'}">
                                        ${range.label}
                                    </button>
                                `)}
                            </div>
                        </div>

                        <!-- Subcategory -->
                        ${this.subcategories.length > 1 ? this.html`
                        <div class="mb-6">
                            <h4 class="font-semibold text-sm mb-3 dark:text-gray-100">Subcategory</h4>
                            <div class="flex flex-wrap gap-2">
                                ${this.subcategories.map(sub => this.html`
                                    <button
                                        @click=${() => this.setSubcategory(sub)}
                                        class="px-4 py-2 rounded-full text-sm font-semibold touch-feedback transition-colors
                                               ${this.selectedSubcategory === sub
                                                 ? 'bg-primary-500 text-white'
                                                 : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'}">
                                        ${sub}
                                    </button>
                                `)}
                            </div>
                        </div>
                        ` : ''}

                        <!-- Availability -->
                        <div class="mb-6">
                            <h4 class="font-semibold text-sm mb-3 dark:text-gray-100">Availability</h4>
                            <div class="flex gap-2">
                                <button
                                    @click=${() => this.setAvailability(false)}
                                    class="px-4 py-2 rounded-lg text-sm font-semibold touch-feedback transition-colors
                                           ${!this.inStockOnly
                                             ? 'bg-primary-500 text-white'
                                             : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'}">
                                    All
                                </button>
                                <button
                                    @click=${() => this.setAvailability(true)}
                                    class="px-4 py-2 rounded-lg text-sm font-semibold touch-feedback transition-colors
                                           ${this.inStockOnly
                                             ? 'bg-primary-500 text-white'
                                             : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'}">
                                    In stock
                                </button>
                            </div>
                        </div>

                        <!-- Rating -->
                        <div class="mb-6">
                            <h4 class="font-semibold text-sm mb-3 dark:text-gray-100">Rating</h4>
                            <div class="flex flex-wrap gap-2">
                                ${[
                                    { key: 'any', label: 'Any' },
                                    { key: '4.5', label: '4.5+' },
                                    { key: '4.0', label: '4.0+' },
                                    { key: '3.5', label: '3.5+' }
                                ].map(r => this.html`
                                    <button
                                        @click=${() => this.setRating(r.key)}
                                        class="px-4 py-2 rounded-lg text-sm font-semibold touch-feedback transition-colors
                                               ${this.minRating === r.key
                                                 ? 'bg-primary-500 text-white'
                                                 : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'}">
                                        ${r.label}
                                    </button>
                                `)}
                            </div>
                        </div>

                        <!-- Apply Button -->
                        <div class="flex gap-3">
                            <button
                                @click=${this.clearFilters}
                                class="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 py-3 rounded-xl font-bold touch-feedback transition-colors hover:bg-gray-300 dark:hover:bg-gray-600">
                                Clear All
                            </button>
                            <button
                                @click=${this.toggleFilters}
                                class="flex-1 bg-primary-500 text-white py-3 rounded-xl font-bold touch-feedback hover:bg-primary-600 transition-colors">
                                Apply Filters
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}

customElements.define('products-page', ProductsPage);
