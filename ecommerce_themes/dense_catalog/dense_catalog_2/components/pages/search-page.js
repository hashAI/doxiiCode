import { BaseComponent } from '../base-component.js';
import { productsStore, cartStore, shortlistStore } from '../../assets/state.js';
import { formatCurrency, showToast, debounce } from '../../assets/utils.js';

class SearchPage extends BaseComponent {
    static properties = {
        searchQuery: { type: String },
        results: { type: Array },
        recentSearches: { type: Array },
        isSearching: { type: Boolean }
    };

    constructor() {
        super();
        this.searchQuery = '';
        this.results = [];
        this.recentSearches = this.loadRecentSearches();
        this.isSearching = false;
        this.debouncedSearch = debounce(() => this.performSearch(), 300);
    }

    connectedCallback() {
        super.connectedCallback();
        // Focus the search input after render
        setTimeout(() => {
            const input = this.querySelector('input[type="search"]');
            if (input) input.focus();
        }, 100);
    }

    loadRecentSearches() {
        try {
            const data = localStorage.getItem('store-recent-searches');
            return data ? JSON.parse(data) : [];
        } catch {
            return [];
        }
    }

    saveRecentSearch(query) {
        if (!query.trim()) return;
        const searches = [query, ...this.recentSearches.filter(s => s !== query)].slice(0, 8);
        this.recentSearches = searches;
        localStorage.setItem('store-recent-searches', JSON.stringify(searches));
    }

    clearRecentSearches() {
        this.recentSearches = [];
        localStorage.removeItem('store-recent-searches');
        this.requestUpdate();
    }

    handleInput(e) {
        this.searchQuery = e.target.value;
        if (this.searchQuery.length >= 2) {
            this.isSearching = true;
            this.debouncedSearch();
        } else {
            this.results = [];
            this.isSearching = false;
        }
        this.requestUpdate();
    }

    performSearch() {
        this.results = productsStore.search(this.searchQuery);
        this.isSearching = false;
        if (this.searchQuery.trim()) {
            this.saveRecentSearch(this.searchQuery.trim());
        }
        this.requestUpdate();
    }

    handleSubmit(e) {
        e.preventDefault();
        if (this.searchQuery.trim()) {
            this.performSearch();
        }
    }

    searchFromRecent(query) {
        this.searchQuery = query;
        this.performSearch();
    }

    addToCart(product, event) {
        event.preventDefault();
        event.stopPropagation();
        cartStore.add(product, 1);
        showToast({
            title: 'Added to Cart',
            message: `${product.name} has been added to your cart`,
            variant: 'success'
        });
    }

    toggleWishlist(product, event) {
        event.preventDefault();
        event.stopPropagation();
        shortlistStore.toggle(product);
        const isInWishlist = shortlistStore.getState().items.find(item => item.id === product.id);
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

    render() {
        const trendingCategories = [
            { label: 'Eyeglasses', icon: 'glasses', href: '#/products/eyeglasses' },
            { label: 'Sunglasses', icon: 'sun', href: '#/products/sunglasses' },
            { label: 'Contact Lenses', icon: 'eye', href: '#/products/contact-lenses' },
            { label: 'Accessories', icon: 'briefcase', href: '#/products/accessories' }
        ];

        return this.html`
            <div class="min-h-screen bg-gray-50 dark:bg-slate-900">
                <!-- Search Header -->
                <div class="sticky top-[108px] lg:top-[156px] z-30 bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800 shadow-sm">
                    <div class="container-desktop py-4">
                        <form @submit=${(e) => this.handleSubmit(e)} class="flex items-center gap-3">
                            <a href="#/" class="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl lg:hidden">
                                <i data-lucide="arrow-left" class="w-5 h-5 text-gray-600 dark:text-gray-300"></i>
                            </a>
                            <div class="flex-1 relative">
                                <i data-lucide="search" class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"></i>
                                <input
                                    type="search"
                                    placeholder="Search for products..."
                                    .value=${this.searchQuery}
                                    @input=${(e) => this.handleInput(e)}
                                    class="w-full pl-12 pr-4 py-3 bg-gray-100 dark:bg-slate-800 rounded-xl border-2 border-transparent focus:border-brand-500 focus:bg-white dark:focus:bg-slate-700 outline-none transition-all text-navy-900 dark:text-white"
                                >
                                ${this.searchQuery ? this.html`
                                    <button
                                        type="button"
                                        @click=${() => { this.searchQuery = ''; this.results = []; this.requestUpdate(); }}
                                        class="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 dark:hover:bg-slate-600 rounded-full"
                                    >
                                        <i data-lucide="x" class="w-4 h-4 text-gray-500"></i>
                                    </button>
                                ` : ''}
                            </div>
                            <button type="submit" class="hidden lg:flex items-center gap-2 px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-xl font-semibold transition-colors">
                                <i data-lucide="search" class="w-4 h-4"></i>
                                <span>Search</span>
                            </button>
                        </form>
                    </div>
                </div>

                <div class="container-desktop py-6 lg:py-10">
                    ${this.searchQuery.length >= 2 ? this.html`
                        <!-- Search Results -->
                        ${this.isSearching ? this.html`
                            <div class="flex items-center justify-center py-12">
                                <div class="animate-spin w-8 h-8 border-3 border-brand-500 border-t-transparent rounded-full"></div>
                            </div>
                        ` : this.html`
                            <div class="mb-4">
                                <p class="text-sm text-gray-500 dark:text-gray-400">
                                    ${this.results.length} results for "<span class="font-semibold text-navy-900 dark:text-white">${this.searchQuery}</span>"
                                </p>
                            </div>

                            ${this.results.length === 0 ? this.html`
                                <div class="flex flex-col items-center justify-center py-16 text-center">
                                    <div class="w-24 h-24 bg-gray-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
                                        <i data-lucide="search-x" class="w-12 h-12 text-gray-400"></i>
                                    </div>
                                    <h3 class="text-xl font-semibold text-navy-900 dark:text-white mb-2">No results found</h3>
                                    <p class="text-gray-500 dark:text-gray-400 mb-6 max-w-md">
                                        We couldn't find any products matching your search. Try different keywords or browse our categories.
                                    </p>
                                    <a href="#/" class="inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors">
                                        <i data-lucide="arrow-left" class="w-4 h-4"></i>
                                        <span>Back to Home</span>
                                    </a>
                                </div>
                            ` : this.html`
                                <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
                                    ${this.results.map(product => this.html`
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
                                                <button
                                                    @click=${(e) => this.toggleWishlist(product, e)}
                                                    class="absolute top-3 right-3 w-9 h-9 bg-white/90 dark:bg-slate-800/90 backdrop-blur rounded-full flex items-center justify-center hover:bg-white dark:hover:bg-slate-700 transition-colors shadow-sm"
                                                >
                                                    <i data-lucide="heart" class="w-4 h-4 ${this.isInWishlist(product.id) ? 'fill-red-500 text-red-500' : 'text-gray-600 dark:text-gray-400'}"></i>
                                                </button>
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
                                                    <span class="text-xs text-gray-400">(${product.reviews?.toLocaleString() || 0})</span>
                                                </div>
                                                <div class="flex items-center gap-2">
                                                    <span class="font-bold text-lg text-navy-900 dark:text-white">${formatCurrency(product.price)}</span>
                                                    ${product.originalPrice ? this.html`
                                                        <span class="text-sm text-gray-400 line-through">${formatCurrency(product.originalPrice)}</span>
                                                    ` : ''}
                                                </div>
                                            </div>
                                        </a>
                                    `)}
                                </div>
                            `}
                        `}
                    ` : this.html`
                        <!-- Initial State: Recent Searches & Categories -->
                        ${this.recentSearches.length > 0 ? this.html`
                            <div class="mb-8">
                                <div class="flex items-center justify-between mb-4">
                                    <h3 class="font-semibold text-navy-900 dark:text-white">Recent Searches</h3>
                                    <button
                                        @click=${() => this.clearRecentSearches()}
                                        class="text-sm text-gray-500 hover:text-brand-500 transition-colors"
                                    >
                                        Clear all
                                    </button>
                                </div>
                                <div class="flex flex-wrap gap-2">
                                    ${this.recentSearches.map(query => this.html`
                                        <button
                                            @click=${() => this.searchFromRecent(query)}
                                            class="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 rounded-xl text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors shadow-sm"
                                        >
                                            <i data-lucide="clock" class="w-4 h-4 text-gray-400"></i>
                                            <span>${query}</span>
                                        </button>
                                    `)}
                                </div>
                            </div>
                        ` : ''}

                        <div>
                            <h3 class="font-semibold text-navy-900 dark:text-white mb-4">Browse Categories</h3>
                            <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                ${trendingCategories.map(cat => this.html`
                                    <a
                                        href="${cat.href}"
                                        class="flex items-center gap-4 p-4 bg-white dark:bg-slate-800 rounded-2xl shadow-card hover:shadow-card-hover transition-all group"
                                    >
                                        <div class="w-12 h-12 bg-brand-50 dark:bg-brand-900/30 rounded-xl flex items-center justify-center group-hover:bg-brand-100 dark:group-hover:bg-brand-900/50 transition-colors">
                                            <i data-lucide="${cat.icon}" class="w-6 h-6 text-brand-500"></i>
                                        </div>
                                        <div>
                                            <span class="font-medium text-navy-900 dark:text-white">${cat.label}</span>
                                            <div class="flex items-center gap-1 text-xs text-gray-400 group-hover:text-brand-500 transition-colors">
                                                <span>Explore</span>
                                                <i data-lucide="arrow-right" class="w-3 h-3"></i>
                                            </div>
                                        </div>
                                    </a>
                                `)}
                            </div>
                        </div>
                    `}
                </div>

                <!-- Bottom spacing -->
                <div class="h-4 lg:h-12"></div>
            </div>
        `;
    }
}

customElements.define('search-page', SearchPage);
