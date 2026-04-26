/**
 * Filter Bar Component - Myntra Style Bottom Bar
 * - Fixed bottom bar with Sort and Filter buttons
 * - Mobile-first design
 */

import { BaseComponent } from './base-component.js';

class EcomFilterBar extends BaseComponent {
    static properties = {
        showSortMenu: { type: Boolean },
        showFilterMenu: { type: Boolean },
        sortOption: { type: String }
    };

    constructor() {
        super();
        this.showSortMenu = false;
        this.showFilterMenu = false;
        this.sortOption = 'recommended';
    }

    toggleSortMenu() {
        this.showSortMenu = !this.showSortMenu;
        this.showFilterMenu = false;
        if (this.showSortMenu) {
            document.body.classList.add('drawer-open');
        } else {
            document.body.classList.remove('drawer-open');
        }
    }

    toggleFilterMenu() {
        this.showFilterMenu = !this.showFilterMenu;
        this.showSortMenu = false;
        if (this.showFilterMenu) {
            document.body.classList.add('drawer-open');
        } else {
            document.body.classList.remove('drawer-open');
        }
    }

    handleSortChange(option) {
        this.sortOption = option;
        this.dispatchEvent(new CustomEvent('sort-change', {
            detail: { sortOption: option },
            bubbles: true,
            composed: true
        }));
        this.toggleSortMenu();
    }

    handleFilterClick() {
        this.dispatchEvent(new CustomEvent('filter-click', {
            bubbles: true,
            composed: true
        }));
        this.toggleFilterMenu();
    }

    render() {
        return this.html`
            <!-- Fixed Bottom Bar -->
            <div class="fixed bottom-0 left-0 right-0 z-30 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 md:hidden">
                <div class="flex">
                    <!-- Sort Button -->
                    <button
                        @click="${this.toggleSortMenu}"
                        class="flex-1 flex items-center justify-center gap-2 py-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                        <i data-lucide="arrow-up-down" width="20" height="20" class="text-gray-900 dark:text-gray-100"></i>
                        <span class="text-sm font-medium text-gray-900 dark:text-gray-100">SORT</span>
                    </button>

                    <!-- Divider -->
                    <div class="w-px bg-gray-200 dark:bg-gray-800"></div>

                    <!-- Filter Button -->
                    <button
                        @click="${this.toggleFilterMenu}"
                        class="flex-1 flex items-center justify-center gap-2 py-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                        <i data-lucide="filter" width="20" height="20" class="text-gray-900 dark:text-gray-100"></i>
                        <span class="text-sm font-medium text-gray-900 dark:text-gray-100">FILTER</span>
                    </button>
                </div>
            </div>

            <!-- Sort Menu Overlay -->
            ${this.showSortMenu ? this.html`
                <div class="fixed inset-0 z-40 bg-black/50" @click="${this.toggleSortMenu}"></div>
                <div class="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 rounded-t-2xl animate-slide-up max-h-[70vh] overflow-y-auto">
                    <!-- Header -->
                    <div class="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 py-4 flex items-center justify-between">
                        <h3 class="text-lg font-bold text-gray-900 dark:text-white">Sort By</h3>
                        <button @click="${this.toggleSortMenu}" class="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
                            <i data-lucide="x" width="24" height="24" class="text-gray-900 dark:text-white"></i>
                        </button>
                    </div>

                    <!-- Sort Options -->
                    <div class="px-4 py-2">
                        ${this.renderSortOption('recommended', 'Recommended', 'Best products for you')}
                        ${this.renderSortOption('popularity', 'Popularity', 'Most popular items')}
                        ${this.renderSortOption('price-low', 'Price: Low to High', 'Cheapest first')}
                        ${this.renderSortOption('price-high', 'Price: High to Low', 'Most expensive first')}
                        ${this.renderSortOption('newest', 'Newest First', 'Latest arrivals')}
                        ${this.renderSortOption('rating', 'Customer Rating', 'Highest rated')}
                        ${this.renderSortOption('discount', 'Better Discount', 'Best deals')}
                    </div>
                </div>
            ` : ''}

            <!-- Filter Menu Overlay -->
            ${this.showFilterMenu ? this.html`
                <div class="fixed inset-0 z-40 bg-black/50" @click="${this.toggleFilterMenu}"></div>
                <div class="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 rounded-t-2xl animate-slide-up max-h-[80vh] overflow-y-auto">
                    <!-- Header -->
                    <div class="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 py-4 flex items-center justify-between">
                        <h3 class="text-lg font-bold text-gray-900 dark:text-white">Filters</h3>
                        <button @click="${this.toggleFilterMenu}" class="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
                            <i data-lucide="x" width="24" height="24" class="text-gray-900 dark:text-white"></i>
                        </button>
                    </div>

                    <!-- Filter Content -->
                    <div class="p-4">
                        <p class="text-sm text-gray-600 dark:text-gray-400 text-center py-8">
                            Filter functionality will be implemented here
                        </p>
                    </div>

                    <!-- Apply Button -->
                    <div class="sticky bottom-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 p-4">
                        <button
                            @click="${this.handleFilterClick}"
                            class="w-full py-3 bg-accent-500 hover:bg-accent-600 text-white font-medium rounded-lg transition-colors"
                        >
                            APPLY
                        </button>
                    </div>
                </div>
            ` : ''}

            <style>
                @keyframes slide-up {
                    from {
                        transform: translateY(100%);
                    }
                    to {
                        transform: translateY(0);
                    }
                }

                .animate-slide-up {
                    animation: slide-up 0.3s ease-out;
                }
            </style>
        `;
    }

    renderSortOption(value, label, description) {
        const isSelected = this.sortOption === value;
        return this.html`
            <button
                @click="${() => this.handleSortChange(value)}"
                class="w-full flex items-start justify-between py-4 border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
                <div class="flex-1 text-left">
                    <div class="text-sm font-medium text-gray-900 dark:text-white ${isSelected ? 'text-accent-500' : ''}">
                        ${label}
                    </div>
                    <div class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        ${description}
                    </div>
                </div>
                ${isSelected ? this.html`
                    <i data-lucide="check" width="20" height="20" class="text-accent-500 flex-shrink-0 ml-2"></i>
                ` : ''}
            </button>
        `;
    }
}

customElements.define('ecom-filter-bar', EcomFilterBar);
