/**
 * Category Filter Component
 * - Display category chips
 * - Filter products by category
 */

import { BaseComponent } from './base-component.js';
import { productsStore, filterStore } from '../assets/state.js';

class EcomCategoryFilter extends BaseComponent {
    static properties = {
        categories: { type: Array },
        selectedCategory: { type: String }
    };

    constructor() {
        super();
        this.categories = [];
        this.selectedCategory = null;
    }

    connectedCallback() {
        super.connectedCallback();
        this.categories = productsStore.getCategories();
        this.selectedCategory = filterStore.selectedCategory;
    }

    handleCategoryClick(category) {
        if (this.selectedCategory === category) {
            this.selectedCategory = null;
            filterStore.selectedCategory = null;
        } else {
            this.selectedCategory = category;
            filterStore.selectedCategory = category;
        }

        // Emit filter change event
        this.emit('filter:changed');
    }

    handleClearFilter() {
        this.selectedCategory = null;
        filterStore.selectedCategory = null;
        this.emit('filter:changed');
    }

    render() {
        return this.html`
            <div class="flex flex-wrap gap-2 items-center">
                <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Categories:
                </span>

                <!-- All Categories Button -->
                <button
                    @click="${this.handleClearFilter}"
                    class="category-chip ${!this.selectedCategory ? 'active' : ''}"
                >
                    All
                </button>

                <!-- Category Chips -->
                ${this.categories.map(category => this.html`
                    <button
                        @click="${() => this.handleCategoryClick(category)}"
                        class="category-chip ${this.selectedCategory === category ? 'active' : ''}"
                    >
                        ${category}
                    </button>
                `)}
            </div>

            <style>
                .category-chip {
                    @apply px-4 py-2 rounded-full text-sm font-medium transition-all;
                    @apply bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300;
                    @apply hover:bg-gray-200 dark:hover:bg-gray-700;
                }

                .category-chip.active {
                    @apply bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100;
                }
            </style>
        `;
    }
}

customElements.define('ecom-category-filter', EcomCategoryFilter);
