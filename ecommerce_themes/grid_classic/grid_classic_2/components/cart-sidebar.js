import { BaseComponent } from './base-component.js';
import { cartStore } from '../assets/state.js';
import { formatCurrency } from '../assets/utils.js';

class CartSidebar extends BaseComponent {
    static properties = {
        isOpen: { type: Boolean },
        cartState: { type: Object }
    };

    constructor() {
        super();
        this.isOpen = false;
        this.cartState = { items: [], subtotal: 0, deliveryFee: 0, total: 0, count: 0 };
    }

    connectedCallback() {
        super.connectedCallback();
        this.unsubscribe = cartStore.subscribe((state) => {
            this.cartState = state;
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

    updateQuantity(productId, delta) {
        const item = this.cartState.items.find(i => i.id === productId);
        if (item) {
            cartStore.update(productId, item.quantity + delta);
        }
    }

    removeItem(productId) {
        cartStore.remove(productId);
    }

    render() {
        return this.html`
            <div class="fixed inset-y-0 right-0 w-full max-w-md bg-white dark:bg-gray-800 shadow-2xl transform transition-transform duration-300 z-50 ${this.isOpen ? 'translate-x-0' : 'translate-x-full'}">
                <div class="flex flex-col h-full">
                    <!-- Header -->
                    <div class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                        <h2 class="text-lg font-bold dark:text-white">My Cart (${this.cartState.count})</h2>
                        <button @click=${this.close} class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg touch-feedback">
                            <i data-lucide="x" class="w-5 h-5 dark:text-gray-300"></i>
                        </button>
                    </div>

                    <!-- Cart Items -->
                    <div class="flex-1 overflow-y-auto p-4 space-y-3">
                        ${this.cartState.items.length === 0 ? this.html`
                            <div class="flex flex-col items-center justify-center h-full text-center py-12">
                                <i data-lucide="shopping-cart" class="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4"></i>
                                <p class="text-gray-500 dark:text-gray-400 font-medium">Your cart is empty</p>
                                <p class="text-sm text-gray-400 dark:text-gray-500 mt-1">Add products to get started</p>
                            </div>
                        ` : this.cartState.items.map(item => this.html`
                            <div class="flex gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                                <img src="${item.image}" alt="${item.name}" class="w-16 h-16 rounded-lg object-cover">
                                <div class="flex-1">
                                    <h3 class="font-medium text-sm dark:text-white">${item.name}</h3>
                                    <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">${item.unit}</p>
                                    <div class="flex items-center justify-between mt-2">
                                        <p class="font-bold text-sm dark:text-white">${formatCurrency(item.price)}</p>
                                        <div class="flex items-center gap-2 bg-white dark:bg-gray-800 border border-primary-200 dark:border-primary-700 rounded-lg">
                                            <button
                                                @click=${() => this.updateQuantity(item.id, -1)}
                                                class="px-3 py-1 text-primary-500 dark:text-primary-400 font-bold touch-feedback">
                                                −
                                            </button>
                                            <span class="font-semibold text-sm px-2 dark:text-white">${item.quantity}</span>
                                            <button
                                                @click=${() => this.updateQuantity(item.id, 1)}
                                                class="px-3 py-1 text-primary-500 dark:text-primary-400 font-bold touch-feedback">
                                                +
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        `)}
                    </div>

                    <!-- Footer -->
                    ${this.cartState.items.length > 0 ? this.html`
                        <div class="border-t border-gray-200 dark:border-gray-700 p-4 space-y-3">
                            <div class="space-y-2 text-sm">
                                <div class="flex justify-between">
                                    <span class="text-gray-600 dark:text-gray-400">Subtotal</span>
                                    <span class="font-medium dark:text-white">${formatCurrency(this.cartState.subtotal)}</span>
                                </div>
                                <div class="flex justify-between">
                                    <span class="text-gray-600 dark:text-gray-400">Delivery Fee</span>
                                    <span class="font-medium ${this.cartState.deliveryFee === 0 ? 'text-green-600 dark:text-green-400' : 'dark:text-white'}">
                                        ${this.cartState.deliveryFee === 0 ? 'FREE' : formatCurrency(this.cartState.deliveryFee)}
                                    </span>
                                </div>
                                ${this.cartState.subtotal < 199 && this.cartState.subtotal > 0 ? this.html`
                                    <p class="text-xs text-primary-500 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30 px-3 py-2 rounded-lg">
                                        Add ${formatCurrency(199 - this.cartState.subtotal)} more for free delivery
                                    </p>
                                ` : ''}
                            </div>
                            <div class="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-gray-700">
                                <span class="font-bold text-lg dark:text-white">Total</span>
                                <span class="font-bold text-lg text-primary-500 dark:text-primary-400">${formatCurrency(this.cartState.total)}</span>
                            </div>
                            <button class="w-full bg-primary-500 text-white py-4 rounded-xl font-bold text-base touch-feedback hover:bg-primary-600 transition-colors">
                                Proceed to Checkout
                            </button>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }
}

customElements.define('cart-sidebar', CartSidebar);
