/**
 * Checkout Page - Professional Design
 * - Professional form styling
 * - Consistent design system
 * - Payment method selection
 */

import { BaseComponent } from '../components/base-component.js';
import { cartStore } from '../assets/state.js';
import { currency, validateEmail, showToast } from '../assets/utils.js';
import { navigate } from '../assets/router.js';

class PageCheckout extends BaseComponent {
    static properties = {
        formData: { type: Object },
        isProcessing: { type: Boolean },
        paymentMethod: { type: String }
    };

    constructor() {
        super();
        this.formData = {
            email: '',
            firstName: '',
            lastName: '',
            address: '',
            city: '',
            zip: '',
            country: 'US'
        };
        this.isProcessing = false;
        this.paymentMethod = 'card';
    }

    connectedCallback() {
        super.connectedCallback();
        if (cartStore.getCount() === 0) {
            showToast('Your cart is empty', 'warning');
            navigate('/catalog');
        }
    }

    handleInputChange(field, value) {
        this.formData = { ...this.formData, [field]: value };
    }

    async handleSubmit(e) {
        e.preventDefault();

        if (!validateEmail(this.formData.email)) {
            showToast('Please enter a valid email', 'error');
            return;
        }

        this.isProcessing = true;
        await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call

        showToast('Order placed successfully!', 'success');
        cartStore.clearCart();
        navigate('/');
        this.isProcessing = false;
    }

    render() {
        const state = cartStore.getState();

        return this.html`
            <div class="min-h-screen bg-primary-50 dark:bg-primary-900 py-8">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 class="text-3xl font-bold text-primary-900 dark:text-white mb-8">Checkout</h1>

                    <form @submit="${this.handleSubmit}" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <!-- Checkout Form -->
                        <div class="lg:col-span-2 space-y-6">
                            <!-- Contact Information -->
                            <div class="bg-white dark:bg-primary-800 rounded-lg p-6 border border-primary-200 dark:border-primary-700">
                                <h2 class="text-lg font-bold text-primary-900 dark:text-white mb-4">Contact Information</h2>
                                <input
                                    type="email"
                                    placeholder="Email"
                                    .value="${this.formData.email}"
                                    @input="${(e) => this.handleInputChange('email', e.target.value)}"
                                    class="input-field"
                                    required
                                />
                            </div>

                            <!-- Shipping Address -->
                            <div class="bg-white dark:bg-primary-800 rounded-lg p-6 border border-primary-200 dark:border-primary-700">
                                <h2 class="text-lg font-bold text-primary-900 dark:text-white mb-4">Shipping Address</h2>
                                <div class="space-y-4">
                                    <div class="grid grid-cols-2 gap-4">
                                        <input
                                            type="text"
                                            placeholder="First Name"
                                            .value="${this.formData.firstName}"
                                            @input="${(e) => this.handleInputChange('firstName', e.target.value)}"
                                            class="input-field"
                                            required
                                        />
                                        <input
                                            type="text"
                                            placeholder="Last Name"
                                            .value="${this.formData.lastName}"
                                            @input="${(e) => this.handleInputChange('lastName', e.target.value)}"
                                            class="input-field"
                                            required
                                        />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Address"
                                        .value="${this.formData.address}"
                                        @input="${(e) => this.handleInputChange('address', e.target.value)}"
                                        class="input-field"
                                        required
                                    />
                                    <div class="grid grid-cols-2 gap-4">
                                        <input
                                            type="text"
                                            placeholder="City"
                                            .value="${this.formData.city}"
                                            @input="${(e) => this.handleInputChange('city', e.target.value)}"
                                            class="input-field"
                                            required
                                        />
                                        <input
                                            type="text"
                                            placeholder="ZIP Code"
                                            .value="${this.formData.zip}"
                                            @input="${(e) => this.handleInputChange('zip', e.target.value)}"
                                            class="input-field"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <!-- Payment Method -->
                            <div class="bg-white dark:bg-primary-800 rounded-lg p-6 border border-primary-200 dark:border-primary-700">
                                <h2 class="text-lg font-bold text-primary-900 dark:text-white mb-4">Payment Method</h2>
                                <div class="grid grid-cols-3 gap-3">
                                    <button
                                        type="button"
                                        @click="${() => this.paymentMethod = 'card'}"
                                        class="payment-method ${this.paymentMethod === 'card' ? 'active' : ''}"
                                    >
                                        <i data-lucide="credit-card" width="20" height="20"></i>
                                        <span class="text-sm font-medium">Card</span>
                                    </button>
                                    <button
                                        type="button"
                                        @click="${() => this.paymentMethod = 'upi'}"
                                        class="payment-method ${this.paymentMethod === 'upi' ? 'active' : ''}"
                                    >
                                        <i data-lucide="smartphone" width="20" height="20"></i>
                                        <span class="text-sm font-medium">UPI</span>
                                    </button>
                                    <button
                                        type="button"
                                        @click="${() => this.paymentMethod = 'cod'}"
                                        class="payment-method ${this.paymentMethod === 'cod' ? 'active' : ''}"
                                    >
                                        <i data-lucide="banknote" width="20" height="20"></i>
                                        <span class="text-sm font-medium">COD</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <!-- Order Summary -->
                        <div class="bg-white dark:bg-primary-800 rounded-lg p-6 border border-primary-200 dark:border-primary-700 h-fit sticky top-24">
                            <h2 class="text-lg font-bold text-primary-900 dark:text-white mb-4">Order Summary</h2>
                            <div class="space-y-3 mb-6">
                                <div class="flex justify-between text-sm">
                                    <span class="text-primary-600 dark:text-primary-400">Subtotal</span>
                                    <span class="font-medium text-primary-900 dark:text-white">${currency(state.subtotal)}</span>
                                </div>
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
                                <div class="border-t border-primary-200 dark:border-primary-700 pt-3">
                                    <div class="flex justify-between">
                                        <span class="text-base font-bold text-primary-900 dark:text-white">Total</span>
                                        <span class="text-xl font-bold text-primary-900 dark:text-white">${currency(state.total)}</span>
                                    </div>
                                </div>
                            </div>
                            <button
                                type="submit"
                                class="w-full px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-semibold rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors duration-150 disabled:opacity-50"
                                ?disabled="${this.isProcessing}"
                            >
                                ${this.isProcessing ? 'Processing...' : 'Place Order'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <style>
                .input-field {
                    @apply w-full h-11 px-4 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white focus:border-transparent transition-all;
                }

                .payment-method {
                    @apply flex flex-col items-center gap-2 p-4 rounded-lg border-2 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 transition-all duration-150 cursor-pointer;
                }

                .payment-method.active {
                    @apply border-gray-900 dark:border-white bg-gray-50 dark:bg-gray-800;
                }
            </style>
        `;
    }
}

customElements.define('page-checkout', PageCheckout);
