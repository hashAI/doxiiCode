/**
 * Catalog Page
 * - Product grid with all products
 * - Category filtering
 * - Search
 * - Sorting
 */

import { BaseComponent } from '../components/base-component.js';
import { productsStore, filterStore } from '../assets/state.js';
import { getQueryParam } from '../assets/utils.js';

class PageCatalog extends BaseComponent {
    static properties = {
        products: { type: Array },
        filteredProducts: { type: Array },
        sortBy: { type: String }
    };

    constructor() {
        super();
        this.products = [];
        this.filteredProducts = [];
        this.sortBy = 'featured';
    }

    connectedCallback() {
        super.connectedCallback();

        // Get all products
        this.products = productsStore.products;

        // Check for search query
        const searchQuery = getQueryParam('search');
        if (searchQuery) {
            filterStore.searchQuery = searchQuery;
        }

        this.applyFilters();
    }

    applyFilters() {
        filterStore.sortBy = this.sortBy;
        this.filteredProducts = filterStore.applyFilters(this.products);
    }

    handleFilterChanged() {
        this.applyFilters();
    }

    handleSortChange(e) {
        this.sortBy = e.detail ? e.detail.sortOption : e.target.value;
        this.applyFilters();
    }

    render() {
        return this.html`
            <div class="min-h-screen bg-white dark:bg-gray-900 pb-24 md:pb-8">
                <!-- Breadcrumbs - Desktop Only -->
                <div class="hidden md:block border-b border-gray-200 dark:border-gray-800">
                    <div class="max-w-7xl mx-auto px-4 py-3">
                        <div class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <a href="#/" class="hover:text-gray-900 dark:hover:text-white">Home</a>
                            <i data-lucide="chevron-right" width="16" height="16"></i>
                            <span class="text-gray-900 dark:text-white font-medium">Catalog</span>
                        </div>
                    </div>
                </div>

                <!-- Header - Mobile -->
                <div class="md:hidden border-b border-gray-200 dark:border-gray-800 px-4 py-4">
                    <h1 class="text-lg font-bold text-gray-900 dark:text-white">
                        All Products
                    </h1>
                    <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        ${this.filteredProducts.length} Items
                    </p>
                </div>

                <div class="md:grid md:grid-cols-[240px_1fr] md:gap-6 max-w-7xl mx-auto px-0 md:px-4">
                    <!-- Sidebar Filters - Desktop Only -->
                    <div class="hidden md:block sticky top-24 h-fit">
                        <div class="py-6 space-y-6">
                            <!-- Filters Header -->
                            <div class="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-4">
                                <h2 class="text-sm font-bold uppercase text-gray-900 dark:text-white">Filters</h2>
                                <button class="text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:underline font-medium transition-colors">Clear All</button>
                            </div>

                            <!-- Category Filter -->
                            <ecom-category-filter
                                @filter:changed="${this.handleFilterChanged}"
                            ></ecom-category-filter>

                            <!-- Price Range -->
                            <div class="border-b border-gray-200 dark:border-gray-800 pb-4">
                                <h3 class="text-sm font-bold uppercase text-gray-900 dark:text-white mb-3">Price</h3>
                                <div class="space-y-2">
                                    ${this.renderFilterOption('Under ₹500')}
                                    ${this.renderFilterOption('₹500 - ₹1000')}
                                    ${this.renderFilterOption('₹1000 - ₹2000')}
                                    ${this.renderFilterOption('₹2000 - ₹5000')}
                                    ${this.renderFilterOption('Above ₹5000')}
                                </div>
                            </div>

                            <!-- Rating Filter -->
                            <div class="border-b border-gray-200 dark:border-gray-800 pb-4">
                                <h3 class="text-sm font-bold uppercase text-gray-900 dark:text-white mb-3">Rating</h3>
                                <div class="space-y-2">
                                    ${this.renderFilterOption('4★ & above')}
                                    ${this.renderFilterOption('3★ & above')}
                                    ${this.renderFilterOption('2★ & above')}
                                </div>
                            </div>

                            <!-- Discount Filter -->
                            <div class="border-b border-gray-200 dark:border-gray-800 pb-4">
                                <h3 class="text-sm font-bold uppercase text-gray-900 dark:text-white mb-3">Discount</h3>
                                <div class="space-y-2">
                                    ${this.renderFilterOption('70% and above')}
                                    ${this.renderFilterOption('60% and above')}
                                    ${this.renderFilterOption('50% and above')}
                                    ${this.renderFilterOption('40% and above')}
                                    ${this.renderFilterOption('30% and above')}
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Main Content -->
                    <div class="py-0 md:py-6">
                        <!-- Sort Bar - Desktop -->
                        <div class="hidden md:flex items-center justify-between mb-6 pb-4 border-b border-gray-200 dark:border-gray-800">
                            <div class="text-sm font-medium text-gray-600 dark:text-gray-400">
                                <span class="font-bold text-gray-900 dark:text-white">${this.filteredProducts.length}</span> items found
                            </div>
                            
                            <div class="flex items-center gap-2">
                                <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Sort by:</span>
                                <select
                                    @change="${this.handleSortChange}"
                                    .value="${this.sortBy}"
                                    class="px-3 py-1.5 text-sm text-gray-900 dark:text-gray-100 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white transition-all cursor-pointer"
                                >
                                    <option value="recommended">Recommended</option>
                                    <option value="popularity">What's New</option>
                                    <option value="price-low">Price: Low to High</option>
                                    <option value="price-high">Price: High to Low</option>
                                    <option value="rating">Customer Rating</option>
                                    <option value="discount">Better Discount</option>
                                </select>
                            </div>
                        </div>

                        <!-- Product Grid -->
                        <ecom-product-grid
                            data-products='${JSON.stringify(this.filteredProducts)}'
                            columns="4"
                        ></ecom-product-grid>
                    </div>
                </div>

                <!-- Mobile Filter Bar (Fixed at Bottom) -->
                <ecom-filter-bar
                    @sort-change="${this.handleSortChange}"
                ></ecom-filter-bar>
            </div>
        `;
    }

    renderFilterOption(label) {
        return this.html`
            <label class="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" class="w-4 h-4 rounded border-2 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-gray-900 dark:focus:ring-white focus:ring-offset-0 transition-all cursor-pointer" />
                <span class="text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">${label}</span>
            </label>
        `;
    }
}

customElements.define('page-catalog', PageCatalog);
