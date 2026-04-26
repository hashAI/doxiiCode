/**
 * Cart Drawer Component
 * - Slide-in cart from right side
 * - Cart items list with quantity controls
 * - Cart totals
 * - Checkout button
 */

import { BaseComponent } from './base-component.js';
import { cartStore } from '../assets/state.js';
import { closeDrawer } from '../assets/utils.js';
import { currency } from '../assets/utils.js';
import { navigate } from '../assets/router.js';

class EcomCartDrawer extends BaseComponent {
    static properties = {
        cartItems: { type: Array },
        cartTotal: { type: Number },
        cartCount: { type: Number }
    };

    constructor() {
        super();
        this.cartItems = [];
        this.cartTotal = 0;
        this.cartCount = 0;
        this.unsubscribe = null;
    }

    connectedCallback() {
        super.connectedCallback();

        // Subscribe to cart changes
        this.unsubscribe = cartStore.subscribe((state) => {
            this.cartItems = state.items;
            this.cartTotal = state.total;
            this.cartCount = state.count;
        });

        // Initial state
        const state = cartStore.getState();
        this.cartItems = state.items;
        this.cartTotal = state.total;
        this.cartCount = state.count;
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        if (this.unsubscribe) this.unsubscribe();
    }

    handleClose() {
        closeDrawer('cart-drawer');
    }

    handleBackdropClick(e) {
        if (e.target === e.currentTarget) {
            this.handleClose();
        }
    }

    handleRemoveItem(productId) {
        cartStore.removeItem(productId);
    }

    handleUpdateQuantity(productId, quantity) {
        if (quantity < 1) {
            cartStore.removeItem(productId);
        } else {
            cartStore.updateQuantity(productId, quantity);
        }
    }

    handleCheckout() {
        this.handleClose();
        navigate('/checkout');
    }

    handleViewCart() {
        this.handleClose();
        navigate('/cart');
    }

    render() {
        const state = cartStore.getState();

        return this.html`
            <!-- Backdrop -->
            <div
                id="cart-drawer"
                class="drawer fixed inset-0 z-50 hidden"
                @click="${this.handleBackdropClick}"
            >
                <div class="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>

                <!-- Drawer Panel -->
                <div class="drawer-panel absolute top-0 right-0 bottom-0 w-96 max-w-[90vw] bg-white dark:bg-gray-900 shadow-xl transform translate-x-full transition-transform duration-300 ease-out flex flex-col">

                    <!-- Header -->
                    <div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
                        <h2 class="text-2xl font-bold">Shopping Cart</h2>
                        <button
                            @click="${this.handleClose}"
                            class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            aria-label="Close cart"
                        >
                            <i data-lucide="x" class="text-gray-700 dark:text-gray-300"></i>
                        </button>
                    </div>

                    <!-- Cart Items -->
                    <div class="flex-1 overflow-y-auto p-6">
                        ${this.cartItems.length === 0
                            ? this.html`
                                <div class="flex flex-col items-center justify-center h-full text-center">
                                    <i data-lucide="shopping-cart" width="64" height="64" class="text-gray-300 dark:text-gray-700 mb-4"></i>
                                    <h3 class="text-lg font-semibold mb-2">Your cart is empty</h3>
                                    <p class="text-gray-600 dark:text-gray-400 mb-6">
                                        Add some products to get started!
                                    </p>
                                    <button
                                        @click="${() => { this.handleClose(); navigate('/catalog'); }}"
                                        class="btn-primary"
                                    >
                                        Shop Now
                                    </button>
                                </div>
                            `
                            : this.html`
                                <div class="space-y-4">
                                    ${this.cartItems.map(item => this.html`
                                        <div class="flex gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                            <img
                                                src="${item.image}"
                                                alt="${item.name}"
                                                class="w-20 h-20 object-cover rounded-lg"
                                            />
                                            <div class="flex-1 min-w-0">
                                                <h3 class="font-semibold text-sm mb-1 truncate">${item.name}</h3>
                                                <p class="text-primary-600 dark:text-primary-400 font-bold">
                                                    ${currency(item.price)}
                                                </p>

                                                <!-- Quantity Controls -->
                                                <div class="flex items-center gap-2 mt-2">
                                                    <button
                                                        @click="${() => this.handleUpdateQuantity(item.id, item.quantity - 1)}"
                                                        class="w-7 h-7 rounded flex items-center justify-center bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                                                        aria-label="Decrease quantity"
                                                    >
                                                        <i data-lucide="minus" width="14" height="14"></i>
                                                    </button>
                                                    <span class="w-8 text-center font-medium">${item.quantity}</span>
                                                    <button
                                                        @click="${() => this.handleUpdateQuantity(item.id, item.quantity + 1)}"
                                                        class="w-7 h-7 rounded flex items-center justify-center bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                                                        aria-label="Increase quantity"
                                                    >
                                                        <i data-lucide="plus" width="14" height="14"></i>
                                                    </button>
                                                    <button
                                                        @click="${() => this.handleRemoveItem(item.id)}"
                                                        class="ml-auto text-red-500 hover:text-red-600 transition-colors"
                                                        aria-label="Remove item"
                                                    >
                                                        <i data-lucide="trash-2" width="16" height="16"></i>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    `)}
                                </div>
                            `
                        }
                    </div>

                    <!-- Footer with Totals -->
                    ${this.cartItems.length > 0
                        ? this.html`
                            <div class="border-t border-gray-200 dark:border-gray-800 p-6 space-y-4">
                                <!-- Totals -->
                                <div class="space-y-2">
                                    <div class="flex justify-between text-sm">
                                        <span class="text-gray-600 dark:text-gray-400">Subtotal</span>
                                        <span class="font-medium">${currency(state.subtotal)}</span>
                                    </div>
                                    <div class="flex justify-between text-sm">
                                        <span class="text-gray-600 dark:text-gray-400">Tax</span>
                                        <span class="font-medium">${currency(state.tax)}</span>
                                    </div>
                                    <div class="flex justify-between text-sm">
                                        <span class="text-gray-600 dark:text-gray-400">Shipping</span>
                                        <span class="font-medium">
                                            ${state.shipping === 0 ? 'FREE' : currency(state.shipping)}
                                        </span>
                                    </div>
                                    <div class="border-t border-gray-200 dark:border-gray-700 pt-2 mt-2">
                                        <div class="flex justify-between">
                                            <span class="font-bold text-lg">Total</span>
                                            <span class="font-bold text-lg text-primary-600 dark:text-primary-400">
                                                ${currency(state.total)}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <!-- Action Buttons -->
                                <div class="space-y-2">
                                    <button
                                        @click="${this.handleCheckout}"
                                        class="w-full btn-primary"
                                    >
                                        Proceed to Checkout
                                    </button>
                                    <button
                                        @click="${this.handleViewCart}"
                                        class="w-full btn-secondary"
                                    >
                                        View Cart
                                    </button>
                                </div>

                                ${state.subtotal < 100
                                    ? this.html`
                                        <div class="text-xs text-center text-gray-600 dark:text-gray-400">
                                            Add ${currency(100 - state.subtotal)} more for FREE shipping!
                                        </div>
                                    `
                                    : ''
                                }
                            </div>
                        `
                        : ''
                    }
                </div>
            </div>

            <style>
                .drawer.open {
                    display: block;
                }

                .drawer.open .drawer-panel {
                    transform: translateX(0);
                }

                .btn-primary {
                    @apply px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-medium;
                }

                .btn-secondary {
                    @apply px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium;
                }
            </style>
        `;
    }
}

customElements.define('ecom-cart-drawer', EcomCartDrawer);
