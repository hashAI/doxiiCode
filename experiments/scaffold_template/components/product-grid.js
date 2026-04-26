/**
 * Product Grid Component
 * - Displays products in a responsive grid
 * - Accepts array of products
 */

import { BaseComponent } from './base-component.js';

class EcomProductGrid extends BaseComponent {
    static properties = {
        products: { type: Array },
        columns: { type: Number }
    };

    constructor() {
        super();
        this.products = [];
        this.columns = 3; // Default 3 columns
    }

    connectedCallback() {
        super.connectedCallback();
        this.products = this.readJsonAttr('data-products', []);
        this.columns = parseInt(this.getAttribute('columns') || '3');
    }

    getGridClass() {
        switch (this.columns) {
            case 2:
                return 'grid-cols-1 sm:grid-cols-2';
            case 3:
                return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
            case 4:
                return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
            default:
                return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
        }
    }

    render() {
        if (!this.products || this.products.length === 0) {
            return this.html`
                <div class="text-center py-12">
                    <i data-lucide="package-x" width="64" height="64" class="mx-auto text-gray-300 dark:text-gray-700 mb-4"></i>
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">No products found</h3>
                    <p class="text-gray-600 dark:text-gray-400">Try adjusting your filters or search criteria</p>
                </div>
            `;
        }

        return this.html`
            <div class="grid ${this.getGridClass()} gap-6">
                ${this.products.map(product => this.html`
                    <ecom-product-card
                        data-product='${JSON.stringify(product)}'
                    ></ecom-product-card>
                `)}
            </div>
        `;
    }
}

customElements.define('ecom-product-grid', EcomProductGrid);
