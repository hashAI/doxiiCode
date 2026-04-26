/**
 * Product Detail Page - Professional Design
 * - Image gallery with multiple images
 * - Size and color variant selectors
 * - Detailed product information
 * - "You May Also Like" recommendations
 * - Professional layout inspired by Myntra/ASOS
 */

import { BaseComponent } from '../components/base-component.js';
import { productsStore, cartStore } from '../assets/state.js';
import { currency, showToast } from '../assets/utils.js';
import { navigate } from '../assets/router.js';

class PageProduct extends BaseComponent {
    static properties = {
        product: { type: Object },
        quantity: { type: Number },
        selectedImage: { type: Number },
        selectedSize: { type: String },
        selectedColor: { type: String },
        relatedProducts: { type: Array },
        isWishlisted: { type: Boolean }
    };

    constructor() {
        super();
        this.product = null;
        this.quantity = 1;
        this.selectedImage = 0;
        this.selectedSize = '';
        this.selectedColor = '';
        this.relatedProducts = [];
        this.isWishlisted = false;
    }

    connectedCallback() {
        super.connectedCallback();

        // Scroll to top when page loads
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Get product ID from route params
        const params = this.getParams();
        const productId = params.id;

        if (productId) {
            this.product = productsStore.getProductById(productId);
            if (this.product) {
                // Set default selected image
                this.selectedImage = 0;

                // Set default size if available
                if (this.product.variants?.sizes?.length > 0) {
                    this.selectedSize = this.product.variants.sizes[2] || this.product.variants.sizes[0]; // Default to M or first
                }

                // Set default color if available
                if (this.product.variants?.colors?.length > 0) {
                    this.selectedColor = this.product.variants.colors[0].value;
                }

                // Load related products
                if (this.product.relatedProducts) {
                    this.relatedProducts = this.product.relatedProducts
                        .map(id => productsStore.getProductById(id))
                        .filter(p => p);
                }
            }
        }

        if (!this.product) {
            showToast('Product not found', 'error');
            navigate('/catalog');
        }
    }

    handleAddToCart() {
        if (this.product && this.product.inStock) {
            // Validate size selection for clothing
            if (this.product.variants?.sizes && !this.selectedSize) {
                showToast('Please select a size', 'warning');
                return;
            }

            cartStore.addItem(this.product, this.quantity);
            showToast(`Added ${this.quantity} ${this.product.name} to cart!`, 'success');
        }
    }

    handleQuantityChange(delta) {
        this.quantity = Math.max(1, this.quantity + delta);
    }

    handleImageSelect(index) {
        this.selectedImage = index;
    }

    handleSizeSelect(size) {
        this.selectedSize = size;
    }

    handleColorSelect(color) {
        this.selectedColor = color;
    }

    handleWishlistToggle() {
        this.isWishlisted = !this.isWishlisted;
        showToast(
            this.isWishlisted ? 'Added to wishlist!' : 'Removed from wishlist',
            this.isWishlisted ? 'success' : 'info'
        );
    }

    getCurrentImage() {
        if (this.product.images && this.product.images.length > 0) {
            return this.product.images[this.selectedImage];
        }
        return this.product.image;
    }

    calculateDiscount() {
        if (!this.product.originalPrice) return null;
        return Math.round(((this.product.originalPrice - this.product.price) / this.product.originalPrice) * 100);
    }

    render() {
        if (!this.product) {
            return this.html`<div class="min-h-screen flex items-center justify-center">Loading...</div>`;
        }

        const currentImage = this.getCurrentImage();
        const hasImages = this.product.images && this.product.images.length > 1;

        return this.html`
            <div class="min-h-screen bg-primary-50 dark:bg-primary-900 py-8">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <!-- Breadcrumb -->
                    <nav class="mb-6 text-sm">
                        <ol class="flex items-center space-x-2 text-primary-600 dark:text-primary-400">
                            <li><a href="#/" class="hover:text-primary-900 dark:hover:text-white transition-colors">Home</a></li>
                            <li><i data-lucide="chevron-right" width="14" height="14"></i></li>
                            <li><a href="#/catalog" class="hover:text-primary-900 dark:hover:text-white transition-colors">Shop</a></li>
                            <li><i data-lucide="chevron-right" width="14" height="14"></i></li>
                            <li class="text-primary-900 dark:text-white font-medium">${this.product.name}</li>
                        </ol>
                    </nav>

                    <!-- Product Details Grid -->
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-16">
                        <!-- Image Gallery -->
                        <div class="space-y-4">
                            <!-- Main Image -->
                            <div class="bg-white dark:bg-primary-800 rounded-lg overflow-hidden border border-primary-200 dark:border-primary-700">
                                <img
                                    src="${currentImage}"
                                    alt="${this.product.name}"
                                    class="w-full aspect-square object-cover"
                                />
                            </div>

                            <!-- Thumbnail Gallery -->
                            ${hasImages ? this.html`
                                <div class="grid grid-cols-4 gap-3">
                                    ${this.product.images.map((img, index) => this.html`
                                        <button
                                            @click="${() => this.handleImageSelect(index)}"
                                            class="bg-white dark:bg-primary-800 rounded-lg overflow-hidden border-2 transition-all duration-150 ${
                                                this.selectedImage === index
                                                    ? 'border-primary-900 dark:border-white'
                                                    : 'border-primary-200 dark:border-primary-700 hover:border-primary-400'
                                            }"
                                        >
                                            <img
                                                src="${img}"
                                                alt="${this.product.name} - Image ${index + 1}"
                                                class="w-full aspect-square object-cover"
                                            />
                                        </button>
                                    `)}
                                </div>
                            ` : ''}
                        </div>

                        <!-- Product Info -->
                        <div class="space-y-6">
                            <div class="bg-white dark:bg-primary-800 rounded-lg p-6 border border-primary-200 dark:border-primary-700">
                                <!-- Category -->
                                <p class="text-sm text-primary-500 dark:text-primary-400 uppercase tracking-wide font-medium mb-2">
                                    ${this.product.category}
                                </p>

                                <!-- Name -->
                                <h1 class="text-3xl font-bold text-primary-900 dark:text-white mb-4">${this.product.name}</h1>

                                <!-- Rating & Reviews -->
                                <div class="flex items-center gap-4 mb-6 pb-6 border-b border-primary-200 dark:border-primary-700">
                                    <div class="flex items-center gap-1">
                                        ${[...Array(5)].map((_, i) => {
                                            const filled = i < Math.floor(this.product.rating);
                                            return this.html`
                                                <i
                                                    data-lucide="star"
                                                    width="16"
                                                    height="16"
                                                    class="${filled ? 'fill-amber-400 text-amber-400' : 'text-primary-300 dark:text-primary-600'}"
                                                ></i>
                                            `;
                                        })}
                                    </div>
                                    <span class="text-sm text-primary-600 dark:text-primary-400">
                                        ${this.product.rating} (${this.product.reviews} reviews)
                                    </span>
                                </div>

                                <!-- Price -->
                                <div class="mb-6">
                                    <span class="text-3xl font-bold text-primary-900 dark:text-white">
                                        ${currency(this.product.price)}
                                    </span>
                                </div>

                                <!-- Color Selection -->
                                ${this.product.variants?.colors ? this.html`
                                    <div class="mb-6">
                                        <h3 class="text-sm font-semibold text-primary-900 dark:text-white mb-3">
                                            Color: <span class="font-normal text-primary-600 dark:text-primary-400">${this.selectedColor}</span>
                                        </h3>
                                        <div class="flex gap-2">
                                            ${this.product.variants.colors.map(color => this.html`
                                                <button
                                                    @click="${() => this.handleColorSelect(color.value)}"
                                                    class="w-10 h-10 rounded-full border-2 transition-all duration-150 ${
                                                        this.selectedColor === color.value
                                                            ? 'border-primary-900 dark:border-white scale-110'
                                                            : 'border-primary-300 dark:border-primary-600 hover:scale-105'
                                                    }"
                                                    style="background-color: ${color.hex}"
                                                    title="${color.name}"
                                                ></button>
                                            `)}
                                        </div>
                                    </div>
                                ` : ''}

                                <!-- Size Selection -->
                                ${this.product.variants?.sizes ? this.html`
                                    <div class="mb-6">
                                        <h3 class="text-sm font-semibold text-primary-900 dark:text-white mb-3">
                                            Size: <span class="font-normal text-primary-600 dark:text-primary-400">${this.selectedSize || 'Select'}</span>
                                        </h3>
                                        <div class="flex flex-wrap gap-2">
                                            ${this.product.variants.sizes.map(size => this.html`
                                                <button
                                                    @click="${() => this.handleSizeSelect(size)}"
                                                    class="px-4 py-2 rounded-lg border font-medium text-sm transition-all duration-150 ${
                                                        this.selectedSize === size
                                                            ? 'border-primary-900 dark:border-white bg-primary-900 dark:bg-white text-white dark:text-primary-900'
                                                            : 'border-primary-300 dark:border-primary-600 text-primary-700 dark:text-primary-300 hover:border-primary-500'
                                                    }"
                                                >
                                                    ${size}
                                                </button>
                                            `)}
                                        </div>
                                    </div>
                                ` : ''}

                                <!-- Stock Status -->
                                <div class="mb-6">
                                    ${this.product.inStock
                                        ? this.html`
                                            <div class="flex items-center gap-2 text-accent-600 dark:text-accent-400">
                                                <i data-lucide="check-circle" width="18" height="18"></i>
                                                <span class="text-sm font-medium">In Stock</span>
                                            </div>
                                        `
                                        : this.html`
                                            <div class="flex items-center gap-2 text-red-600 dark:text-red-400">
                                                <i data-lucide="x-circle" width="18" height="18"></i>
                                                <span class="text-sm font-medium">Out of Stock</span>
                                            </div>
                                        `
                                    }
                                </div>

                                <!-- Action Buttons - Myntra Style -->
                                ${this.product.inStock
                                    ? this.html`
                                        <div class="flex gap-3 mb-6">
                                            <!-- Wishlist Button -->
                                            <button
                                                @click="${this.handleWishlistToggle}"
                                                class="flex items-center justify-center gap-2 px-6 py-3.5 border-2 ${
                                                    this.isWishlisted
                                                        ? 'border-accent-500 bg-accent-50 dark:bg-accent-900/20'
                                                        : 'border-gray-300 dark:border-gray-600'
                                                } rounded transition-colors hover:border-accent-500"
                                                aria-label="Add to wishlist"
                                            >
                                                <i
                                                    data-lucide="heart"
                                                    width="20"
                                                    height="20"
                                                    class="${this.isWishlisted ? 'fill-accent-500 text-accent-500' : 'text-gray-900 dark:text-gray-100'}"
                                                ></i>
                                                <span class="font-medium text-gray-900 dark:text-white">WISHLIST</span>
                                            </button>

                                            <!-- Add to Bag Button -->
                                            <button
                                                @click="${this.handleAddToCart}"
                                                class="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-accent-500 hover:bg-accent-600 text-white font-bold rounded transition-colors"
                                            >
                                                <i data-lucide="shopping-bag" width="20" height="20"></i>
                                                <span>ADD TO BAG</span>
                                            </button>
                                        </div>
                                    `
                                    : ''
                                }
                            </div>

                            <!-- Product Details Accordion -->
                            <div class="bg-white dark:bg-primary-800 rounded-lg border border-primary-200 dark:border-primary-700 divide-y divide-primary-200 dark:divide-primary-700">
                                <!-- Description -->
                                <div class="p-6">
                                    <h3 class="text-sm font-semibold text-primary-900 dark:text-white mb-3 uppercase tracking-wide">Description</h3>
                                    <p class="text-sm text-primary-600 dark:text-primary-300 leading-relaxed">
                                        ${this.product.descriptionLong || this.product.description}
                                    </p>
                                </div>

                                <!-- Features -->
                                ${this.product.features ? this.html`
                                    <div class="p-6">
                                        <h3 class="text-sm font-semibold text-primary-900 dark:text-white mb-3 uppercase tracking-wide">Features</h3>
                                        <ul class="space-y-2">
                                            ${this.product.features.map(feature => this.html`
                                                <li class="flex items-start gap-2 text-sm text-primary-600 dark:text-primary-300">
                                                    <i data-lucide="check" width="16" height="16" class="text-accent-500 mt-0.5 flex-shrink-0"></i>
                                                    <span>${feature}</span>
                                                </li>
                                            `)}
                                        </ul>
                                    </div>
                                ` : ''}

                                <!-- Materials & Care -->
                                ${this.product.materials || this.product.care ? this.html`
                                    <div class="p-6">
                                        <h3 class="text-sm font-semibold text-primary-900 dark:text-white mb-3 uppercase tracking-wide">Materials & Care</h3>
                                        ${this.product.materials ? this.html`
                                            <p class="text-sm text-primary-600 dark:text-primary-300 mb-2">
                                                <span class="font-medium">Materials:</span> ${this.product.materials}
                                            </p>
                                        ` : ''}
                                        ${this.product.care ? this.html`
                                            <p class="text-sm text-primary-600 dark:text-primary-300">
                                                <span class="font-medium">Care:</span> ${this.product.care}
                                            </p>
                                        ` : ''}
                                    </div>
                                ` : ''}
                            </div>
                        </div>
                    </div>

                    <!-- You May Also Like -->
                    ${this.relatedProducts.length > 0 ? this.html`
                        <div class="mt-16">
                            <h2 class="text-2xl font-bold text-primary-900 dark:text-white mb-6">You May Also Like</h2>
                            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
                                ${this.relatedProducts.map(product => this.html`
                                    <ecom-product-card .product="${product}" data-product="${JSON.stringify(product)}"></ecom-product-card>
                                `)}
                            </div>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }
}

customElements.define('page-product', PageProduct);
