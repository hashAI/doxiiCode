/**
 * Cart Page - Professional Design
 * - Full cart view with checkout
 * - Clickable cart items
 * - Discount coupon functionality
 */

import { BaseComponent } from '../components/base-component.js';
import { cartStore } from '../assets/state.js';
import { currency, showToast } from '../assets/utils.js';
import { navigate } from '../assets/router.js';

class PageCart extends BaseComponent {
    static properties = {
        cartItems: { type: Array },
        couponCode: { type: String },
        discount: { type: Number },
        couponApplied: { type: Boolean }
    };

    constructor() {
        super();
        this.cartItems = [];
        this.couponCode = '';
        this.discount = 0;
        this.couponApplied = false;
        this.unsubscribe = null;

        // Sample coupons (in real app, validate on backend)
        this.validCoupons = {
            'SAVE10': { discount: 0.10, type: 'percentage', description: '10% off' },
            'SAVE20': { discount: 0.20, type: 'percentage', description: '20% off' },
            'FLAT50': { discount: 50, type: 'fixed', description: '$50 off' }
        };
    }

    connectedCallback() {
        super.connectedCallback();
        this.unsubscribe = cartStore.subscribe((state) => {
            this.cartItems = state.items;
        });
        this.cartItems = cartStore.getState().items;
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        if (this.unsubscribe) this.unsubscribe();
    }

    handleUpdateQuantity(productId, quantity) {
        cartStore.updateQuantity(productId, quantity);
    }

    handleRemoveItem(productId) {
        cartStore.removeItem(productId);
    }

    handleCheckout() {
        navigate('/checkout');
    }

    handleItemClick(productId) {
        navigate(`/product/${productId}`);
    }

    handleApplyCoupon() {
        const code = this.couponCode.toUpperCase().trim();

        if (!code) {
            showToast('Please enter a coupon code', 'warning');
            return;
        }

        const coupon = this.validCoupons[code];

        if (coupon) {
            this.couponApplied = true;

            if (coupon.type === 'percentage') {
                this.discount = cartStore.getSubtotal() * coupon.discount;
            } else {
                this.discount = coupon.discount;
            }

            showToast(`Coupon applied! ${coupon.description}`, 'success');
        } else {
            showToast('Invalid coupon code', 'error');
            this.couponApplied = false;
            this.discount = 0;
        }
    }

    handleRemoveCoupon() {
        this.couponCode = '';
        this.couponApplied = false;
        this.discount = 0;
        showToast('Coupon removed', 'success');
    }

    getTotalWithDiscount() {
        const state = cartStore.getState();
        return Math.max(0, state.total - this.discount);
    }

    render() {
        const state = cartStore.getState();

        if (this.cartItems.length === 0) {
            return this.html`
                <div class="min-h-screen bg-primary-50 dark:bg-primary-900 py-12">
                    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div class="bg-white dark:bg-primary-800 rounded-lg p-12 text-center border border-primary-200 dark:border-primary-700">
                            <i data-lucide="shopping-cart" width="64" height="64" class="mx-auto text-primary-300 dark:text-primary-700 mb-4"></i>
                            <h2 class="text-2xl font-bold text-primary-900 dark:text-white mb-2">Your cart is empty</h2>
                            <p class="text-primary-600 dark:text-primary-400 mb-6">Add some products to get started!</p>
                            <a href="#/catalog" class="inline-block px-8 py-3 bg-primary-900 dark:bg-white text-white dark:text-primary-900 font-semibold rounded-lg hover:bg-primary-800 dark:hover:bg-primary-100 transition-colors">
                                Shop Now
                            </a>
                        </div>
                    </div>
                </div>
            `;
        }

        return this.html`
            <div class="min-h-screen bg-primary-50 dark:bg-primary-900 py-8">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 class="text-3xl font-bold text-primary-900 dark:text-white mb-8">Shopping Cart</h1>

                    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <!-- Cart Items -->
                        <div class="lg:col-span-2 space-y-4">
                            ${this.cartItems.map(item => this.html`
                                <div class="bg-white dark:bg-primary-800 rounded-lg p-4 border border-primary-200 dark:border-primary-700 transition-all duration-150 hover:shadow-md">
                                    <div class="flex gap-4">
                                        <!-- Clickable Image -->
                                        <button
                                            @click="${() => this.handleItemClick(item.id)}"
                                            class="flex-shrink-0 cursor-pointer group"
                                        >
                                            <img
                                                src="${item.image}"
                                                alt="${item.name}"
                                                class="w-20 h-20 md:w-24 md:h-24 object-cover rounded-lg border border-primary-200 dark:border-primary-700 group-hover:opacity-80 transition-opacity"
                                            />
                                        </button>

                                        <div class="flex-1 min-w-0">
                                            <!-- Clickable Name -->
                                            <button
                                                @click="${() => this.handleItemClick(item.id)}"
                                                class="text-left w-full hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                                            >
                                                <h3 class="font-semibold text-sm md:text-base text-primary-900 dark:text-white mb-1 line-clamp-2">
                                                    ${item.name}
                                                </h3>
                                            </button>
                                            <p class="text-lg font-bold text-primary-900 dark:text-white mb-3">
                                                ${currency(item.price)}
                                            </p>

                                            <!-- Quantity Controls -->
                                            <div class="flex items-center gap-3">
                                                <div class="flex items-center border border-primary-300 dark:border-primary-600 rounded-lg">
                                                    <button
                                                        @click="${() => this.handleUpdateQuantity(item.id, item.quantity - 1)}"
                                                        class="px-3 py-1.5 hover:bg-primary-100 dark:hover:bg-primary-700 transition-colors"
                                                        aria-label="Decrease quantity"
                                                    >
                                                        <i data-lucide="minus" width="14" height="14"></i>
                                                    </button>
                                                    <span class="px-4 py-1.5 font-medium text-sm border-x border-primary-300 dark:border-primary-600 min-w-[40px] text-center">
                                                        ${item.quantity}
                                                    </span>
                                                    <button
                                                        @click="${() => this.handleUpdateQuantity(item.id, item.quantity + 1)}"
                                                        class="px-3 py-1.5 hover:bg-primary-100 dark:hover:bg-primary-700 transition-colors"
                                                        aria-label="Increase quantity"
                                                    >
                                                        <i data-lucide="plus" width="14" height="14"></i>
                                                    </button>
                                                </div>

                                                <button
                                                    @click="${() => this.handleRemoveItem(item.id)}"
                                                    class="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 p-2 transition-colors"
                                                    aria-label="Remove item"
                                                >
                                                    <i data-lucide="trash-2" width="18" height="18"></i>
                                                </button>
                                            </div>
                                        </div>

                                        <!-- Item Total (Desktop) -->
                                        <div class="hidden md:flex flex-col justify-between items-end">
                                            <p class="text-lg font-bold text-primary-900 dark:text-white">
                                                ${currency(item.price * item.quantity)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            `)}
                        </div>

                        <!-- Order Summary -->
                        <div class="space-y-4">
                            <!-- Coupon Code -->
                            <div class="bg-white dark:bg-primary-800 rounded-lg p-6 border border-primary-200 dark:border-primary-700">
                                <h3 class="text-sm font-semibold text-primary-900 dark:text-white mb-3 uppercase tracking-wide">Discount Code</h3>

                                ${!this.couponApplied ? this.html`
                                    <div class="flex gap-2">
                                        <input
                                            type="text"
                                            placeholder="Enter coupon code"
                                            .value="${this.couponCode}"
                                            @input="${(e) => this.couponCode = e.target.value}"
                                            @keypress="${(e) => e.key === 'Enter' && this.handleApplyCoupon()}"
                                            class="flex-1 px-3 py-2 text-sm rounded-lg border border-primary-300 dark:border-primary-600 bg-white dark:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                        />
                                        <button
                                            @click="${this.handleApplyCoupon}"
                                            class="px-4 py-2 bg-primary-900 dark:bg-white text-white dark:text-primary-900 font-medium text-sm rounded-lg hover:bg-primary-800 dark:hover:bg-primary-100 transition-colors"
                                        >
                                            Apply
                                        </button>
                                    </div>
                                    <p class="text-xs text-primary-500 dark:text-primary-400 mt-2">
                                        Try: SAVE10, SAVE20, or FLAT50
                                    </p>
                                ` : this.html`
                                    <div class="flex items-center justify-between p-3 bg-accent-50 dark:bg-accent-900/20 rounded-lg border border-accent-200 dark:border-accent-800">
                                        <div class="flex items-center gap-2">
                                            <i data-lucide="tag" width="16" height="16" class="text-accent-600 dark:text-accent-400"></i>
                                            <span class="text-sm font-medium text-accent-900 dark:text-accent-100">${this.couponCode}</span>
                                        </div>
                                        <button
                                            @click="${this.handleRemoveCoupon}"
                                            class="text-accent-600 dark:text-accent-400 hover:text-accent-700 dark:hover:text-accent-300 transition-colors"
                                            aria-label="Remove coupon"
                                        >
                                            <i data-lucide="x" width="16" height="16"></i>
                                        </button>
                                    </div>
                                `}
                            </div>

                            <!-- Order Summary Card -->
                            <div class="bg-white dark:bg-primary-800 rounded-lg p-6 border border-primary-200 dark:border-primary-700 sticky top-24">
                                <h2 class="text-lg font-bold text-primary-900 dark:text-white mb-4">Order Summary</h2>

                                <div class="space-y-3 mb-6">
                                    <div class="flex justify-between text-sm">
                                        <span class="text-primary-600 dark:text-primary-400">Subtotal</span>
                                        <span class="font-medium text-primary-900 dark:text-white">${currency(state.subtotal)}</span>
                                    </div>

                                    ${this.discount > 0 ? this.html`
                                        <div class="flex justify-between text-sm text-accent-600 dark:text-accent-400">
                                            <span>Discount</span>
                                            <span class="font-medium">-${currency(this.discount)}</span>
                                        </div>
                                    ` : ''}

                                    <div class="flex justify-between text-sm">
                                        <span class="text-primary-600 dark:text-primary-400">Tax</span>
                                        <span class="font-medium text-primary-900 dark:text-white">${currency(state.tax)}</span>
                                    </div>

                                    <div class="flex justify-between text-sm">
                                        <span class="text-primary-600 dark:text-primary-400">Shipping</span>
                                        <span class="font-medium text-primary-900 dark:text-white">
                                            ${state.shipping === 0 ? 'FREE' : currency(state.shipping)}
                                        </span>
                                    </div>

                                    ${state.shipping > 0 && state.subtotal < 100 ? this.html`
                                        <p class="text-xs text-primary-500 dark:text-primary-400">
                                            Add ${currency(100 - state.subtotal)} more for free shipping
                                        </p>
                                    ` : ''}

                                    <div class="border-t border-primary-200 dark:border-primary-700 pt-3">
                                        <div class="flex justify-between">
                                            <span class="text-base font-bold text-primary-900 dark:text-white">Total</span>
                                            <span class="text-xl font-bold text-primary-900 dark:text-white">
                                                ${currency(this.getTotalWithDiscount())}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    @click="${this.handleCheckout}"
                                    class="w-full px-6 py-3 bg-primary-900 dark:bg-white text-white dark:text-primary-900 font-semibold rounded-lg hover:bg-primary-800 dark:hover:bg-primary-100 transition-colors duration-150 mb-3"
                                >
                                    Proceed to Checkout
                                </button>

                                <a
                                    href="#/catalog"
                                    class="block w-full px-6 py-3 text-center border border-primary-300 dark:border-primary-600 text-primary-700 dark:text-primary-300 font-medium rounded-lg hover:bg-primary-50 dark:hover:bg-primary-700 transition-colors duration-150"
                                >
                                    Continue Shopping
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}

customElements.define('page-cart', PageCart);
