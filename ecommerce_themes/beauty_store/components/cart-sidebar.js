import { BaseComponent } from './base-component.js';
import { cartStore } from '../assets/state.js';
import { showToast } from '../assets/utils.js';

class CartSidebar extends BaseComponent {
    static properties = {
        isOpen: { type: Boolean },
        cart: { type: Object }
    };

    constructor() {
        super();
        this.isOpen = false;
        this.cart = { items: [], count: 0, total: 0 };
    }

    connectedCallback() {
        super.connectedCallback();
        this.unsubscribe = cartStore.subscribe((state) => {
            this.cart = state;
        });

        window.addEventListener('cart:open', () => {
            this.open();
        });

        document.getElementById('overlay')?.addEventListener('click', () => {
            this.close();
        });
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        this.unsubscribe?.();
    }

    open() {
        this.isOpen = true;
        document.getElementById('overlay')?.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    close() {
        this.isOpen = false;
        document.getElementById('overlay')?.classList.add('hidden');
        document.body.style.overflow = '';
    }

    removeItem(productId) {
        cartStore.remove(productId);
        showToast({ title: 'Removed from cart', variant: 'info' });
    }

    updateQuantity(productId, quantity) {
        if (quantity < 1) {
            this.removeItem(productId);
        } else {
            cartStore.updateQuantity(productId, quantity);
        }
    }

    checkout() {
        if (this.cart.items.length === 0) return;
        showToast({
            title: 'Checkout',
            description: 'Checkout functionality coming soon!',
            variant: 'success'
        });
        this.close();
    }

    render() {
        return this.html`
            <div class="fixed inset-y-0 right-0 w-full max-w-md lg:max-w-lg bg-white dark:bg-gray-800 shadow-2xl transform transition-transform duration-300 z-50 ${this.isOpen ? 'translate-x-0' : 'translate-x-full'}">
                <div class="flex flex-col h-full">
                    <!-- Header -->
                    <div class="flex items-center justify-between p-4 lg:p-6 border-b border-gray-200 dark:border-gray-700">
                        <h2 class="text-lg lg:text-xl font-bold dark:text-white flex items-center gap-2">
                            <i data-lucide="shopping-bag" class="w-5 h-5 lg:w-6 lg:h-6 text-purple-500"></i>
                            Shopping Cart (${this.cart.count})
                        </h2>
                        <button @click=${this.close} class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg touch-feedback transition">
                            <i data-lucide="x" class="w-5 h-5 lg:w-6 lg:h-6 dark:text-gray-300"></i>
                        </button>
                    </div>

                    <!-- Cart Items -->
                    <div class="flex-1 overflow-y-auto p-4 lg:p-6 space-y-3 lg:space-y-4">
                        ${this.cart.items.length === 0 ? this.html`
                            <div class="flex flex-col items-center justify-center h-full text-center py-12 lg:py-16">
                                <div class="w-20 h-20 lg:w-24 lg:h-24 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-4">
                                    <i data-lucide="shopping-bag" class="w-10 h-10 lg:w-12 lg:h-12 text-gray-300 dark:text-gray-600"></i>
                                </div>
                                <p class="text-gray-500 dark:text-gray-400 font-medium text-lg">Your cart is empty</p>
                                <p class="text-sm text-gray-400 dark:text-gray-500 mt-1">Add products to start shopping</p>
                                <button @click=${() => { this.close(); window.location.hash = '/products/all'; }} class="mt-4 px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition">
                                    Start Shopping
                                </button>
                            </div>
                        ` : this.cart.items.map(item => this.html`
                            <div class="flex gap-3 lg:gap-4 p-3 lg:p-4 bg-gray-50 dark:bg-gray-700 rounded-xl lg:rounded-2xl hover:shadow-md transition">
                                <img src="${item.image}" alt="${item.name}" class="w-20 h-20 lg:w-24 lg:h-24 rounded-lg lg:rounded-xl object-contain bg-white">
                                <div class="flex-1 space-y-1.5 lg:space-y-2">
                                    <h3 class="font-semibold text-sm lg:text-base dark:text-white leading-tight">${item.name}</h3>
                                    <p class="text-xs lg:text-sm text-gray-500 dark:text-gray-300">${item.brand || ''}</p>
                                    <div class="flex items-baseline gap-2">
                                        <span class="text-lg lg:text-xl font-black text-primary-700 dark:text-primary-400">$${(item.price || 0).toFixed(2)}</span>
                                        ${item.originalPrice && item.originalPrice > item.price ? this.html`
                                            <span class="text-xs lg:text-sm text-gray-400 line-through">$${item.originalPrice.toFixed(2)}</span>
                                        ` : ''}
                                    </div>
                                    <div class="flex items-center gap-2">
                                        <div class="flex items-center gap-2 bg-white dark:bg-gray-600 rounded-lg p-1">
                                            <button
                                                @click=${() => this.updateQuantity(item.id, item.quantity - 1)}
                                                class="w-7 h-7 lg:w-8 lg:h-8 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center touch-feedback hover:bg-gray-200 transition">
                                                <i data-lucide="minus" class="w-3.5 h-3.5 lg:w-4 lg:h-4"></i>
                                            </button>
                                            <span class="w-8 lg:w-10 text-center font-bold text-sm lg:text-base dark:text-white">${item.quantity}</span>
                                            <button
                                                @click=${() => this.updateQuantity(item.id, item.quantity + 1)}
                                                class="w-7 h-7 lg:w-8 lg:h-8 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center touch-feedback hover:bg-gray-200 transition">
                                                <i data-lucide="plus" class="w-3.5 h-3.5 lg:w-4 lg:h-4"></i>
                                            </button>
                                        </div>
                                        <button
                                            @click=${() => this.removeItem(item.id)}
                                            class="ml-auto p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg touch-feedback transition">
                                            <i data-lucide="trash-2" class="w-4 h-4 lg:w-5 lg:h-5 text-red-500"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        `)}
                    </div>

                    ${this.cart.items.length > 0 ? this.html`
                        <div class="border-t border-gray-200 dark:border-gray-700 p-4 lg:p-6 space-y-3 lg:space-y-4">
                            <div class="flex items-center justify-between">
                                <span class="text-gray-600 dark:text-gray-300">Subtotal:</span>
                                <span class="text-xl lg:text-2xl font-bold dark:text-white">$${this.cart.total.toFixed(2)}</span>
                            </div>
                            <div class="flex items-center justify-between text-sm lg:text-base">
                                <span class="text-gray-500 dark:text-gray-400">Shipping:</span>
                                <span class="text-green-600 dark:text-green-400 font-semibold flex items-center gap-1">
                                    <i data-lucide="truck" class="w-4 h-4"></i> FREE
                                </span>
                            </div>
                            <div class="border-t border-gray-200 dark:border-gray-700 pt-3 lg:pt-4 flex items-center justify-between">
                                <span class="text-lg lg:text-xl font-bold dark:text-white">Total:</span>
                                <span class="text-2xl lg:text-3xl font-black text-primary-700 dark:text-primary-400">$${this.cart.total.toFixed(2)}</span>
                            </div>
                            <button
                                @click=${this.checkout}
                                class="w-full bg-gradient-to-r from-accent-500 to-pink-500 hover:opacity-90 text-white py-4 lg:py-5 rounded-xl lg:rounded-2xl font-bold text-base lg:text-lg touch-feedback transition shadow-lg shadow-accent-500/30">
                                Proceed to Checkout
                            </button>
                            <p class="text-center text-xs lg:text-sm text-gray-500 flex items-center justify-center gap-2">
                                <i data-lucide="lock" class="w-3 h-3"></i>
                                Secure checkout powered by Stripe
                            </p>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }
}

customElements.define('cart-sidebar', CartSidebar);
