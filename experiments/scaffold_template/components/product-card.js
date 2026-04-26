/**
 * Product Card Component - Professional Minimal Design
 * - Clean, minimal product cards
 * - Professional styling
 * - Subtle hover effects
 */

import { BaseComponent } from './base-component.js';
import { cartStore } from '../assets/state.js';
import { currency, showToast } from '../assets/utils.js';
import { navigate } from '../assets/router.js';

class EcomProductCard extends BaseComponent {
    static properties = {
        product: { type: Object }
    };

    constructor() {
        super();
        this.product = null;
    }

    connectedCallback() {
        super.connectedCallback();
        // Read product from attribute
        this.product = this.readJsonAttr('data-product');
    }

    handleAddToCart(e) {
        e.stopPropagation();
        if (this.product) {
            cartStore.addItem(this.product, 1);
            showToast(`${this.product.name} added to cart!`, 'success', 2000);
        }
    }

    handleCardClick() {
        if (this.product) {
            navigate(`/product/${this.product.id}`);
        }
    }

    calculateDiscount() {
        if (!this.product || !this.product.originalPrice) return null;
        const discount = Math.round(((this.product.originalPrice - this.product.price) / this.product.originalPrice) * 100);
        return discount > 0 ? discount : null;
    }

    render() {
        if (!this.product) {
            return this.html`<div class="text-gray-500">No product data</div>`;
        }

        const discount = this.calculateDiscount();

        return this.html`
            <div
                @click="${this.handleCardClick}"
                class="group bg-white dark:bg-gray-800 cursor-pointer"
            >
                <!-- Image -->
                <div class="relative aspect-[3/4] overflow-hidden bg-gray-100 dark:bg-gray-700">
                    <img
                        src="${this.product.image}"
                        alt="${this.product.name}"
                        class="w-full h-full object-cover"
                        loading="lazy"
                    />

                    <!-- AD Badge (Top Right) -->
                    ${this.product.featured
                        ? this.html`
                            <div class="absolute top-2 right-2 px-2 py-0.5 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 text-xs font-medium rounded">
                                AD
                            </div>
                        `
                        : ''
                    }
                </div>

                <!-- Content -->
                <div class="py-3">
                    <!-- Brand Name -->
                    <h3 class="text-base font-bold text-gray-900 dark:text-white mb-1">
                        ${this.product.brand || this.product.name.split(' ')[0]}
                    </h3>

                    <!-- Product Description -->
                    <p class="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-1">
                        ${this.product.description || this.product.name}
                    </p>

                    <!-- Price & Discount -->
                    <div class="flex items-center gap-2 mb-2">
                        <span class="text-sm font-bold text-gray-900 dark:text-white">
                            ${currency(this.product.price)}
                        </span>
                        ${this.product.originalPrice ? this.html`
                            <span class="text-sm text-gray-500 dark:text-gray-400 line-through">
                                ${currency(this.product.originalPrice)}
                            </span>
                            ${discount ? this.html`
                                <span class="text-xs font-medium text-orange-500">
                                    (${discount}% OFF)
                                </span>
                            ` : ''}
                        ` : ''}
                    </div>

                    <!-- Rating -->
                    ${this.product.rating ? this.html`
                        <div class="flex items-center gap-1.5">
                            <div class="flex items-center gap-1 px-1.5 py-0.5 bg-green-600 rounded">
                                <span class="text-xs font-medium text-white">${this.product.rating.toFixed(1)}</span>
                                <i data-lucide="star" width="10" height="10" class="fill-white text-white"></i>
                            </div>
                            ${this.product.reviews ? this.html`
                                <span class="text-xs text-gray-500 dark:text-gray-400">
                                    ${this.product.reviews}
                                </span>
                            ` : ''}
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }
}

customElements.define('ecom-product-card', EcomProductCard);
