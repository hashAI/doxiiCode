import { BaseComponent } from './base-component.js';
import { cartStore } from '../assets/state.js';
import { formatCurrency, EventBus, showOverlay, hideOverlay } from '../assets/utils.js';

class CartSidebar extends BaseComponent {
    static properties = {
        isOpen: { type: Boolean },
        items: { type: Array },
        total: { type: Number }
    };

    constructor() {
        super();
        this.isOpen = false;
        this.items = cartStore.getItems();
        this.total = cartStore.getTotal();

        this.boundUpdate = () => this.updateCart();
        EventBus.on('cart:updated', this.boundUpdate);
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        EventBus.off('cart:updated', this.boundUpdate);
    }

    updateCart() {
        this.items = cartStore.getItems();
        this.total = cartStore.getTotal();
        this.requestUpdate();
    }

    open() {
        this.isOpen = true;
        showOverlay(() => this.close());
        this.requestUpdate();
    }

    close() {
        this.isOpen = false;
        hideOverlay();
        this.requestUpdate();
    }

    updateQuantity(productId, delta) {
        const item = this.items.find(i => i.id === productId);
        if (item) {
            cartStore.updateQuantity(productId, item.quantity + delta);
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
                        <h2 class="text-lg font-bold dark:text-white">My Cart (${this.items.length})</h2>
                        <button @click=${this.close} class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg touch-feedback">
                            <i data-lucide="x" class="w-5 h-5 dark:text-gray-300"></i>
                        </button>
                    </div>

                    <!-- Cart Items -->
                    <div class="flex-1 overflow-y-auto p-4 space-y-3">
                        ${this.items.length === 0 ? this.html`
                            <div class="flex flex-col items-center justify-center h-full text-center py-12">
                                <i data-lucide="shopping-bag" class="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4"></i>
                                <p class="text-gray-500 dark:text-gray-400 font-medium">Your cart is empty</p>
                                <p class="text-sm text-gray-400 dark:text-gray-500 mt-1">Add products to get started</p>
                            </div>
                        ` : this.items.map(item => this.html`
                            <div class="flex gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                                <img src="${item.images[0]}" alt="${item.name}" class="w-20 h-20 rounded-lg object-cover">
                                <div class="flex-1">
                                    <h3 class="font-medium text-sm dark:text-white line-clamp-2">${item.name}</h3>
                                    ${item.selectedColor ? this.html`
                                        <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Color: ${item.selectedColor}</p>
                                    ` : ''}
                                    ${item.selectedSize ? this.html`
                                        <p class="text-xs text-gray-500 dark:text-gray-400">Size: ${item.selectedSize}</p>
                                    ` : ''}
                                    <div class="flex items-center justify-between mt-2">
                                        <p class="font-bold text-sm dark:text-white">${formatCurrency(item.price)}</p>
                                        <div class="flex items-center gap-2 bg-white dark:bg-gray-800 border border-primary-200 dark:border-primary-700 rounded-lg">
                                            <button
                                                @click=${() => this.updateQuantity(item.id, -1)}
                                                class="px-3 py-1 text-primary-900 dark:text-primary-400 font-bold touch-feedback">
                                                −
                                            </button>
                                            <span class="font-semibold text-sm px-2 dark:text-white">${item.quantity}</span>
                                            <button
                                                @click=${() => this.updateQuantity(item.id, 1)}
                                                class="px-3 py-1 text-primary-900 dark:text-primary-400 font-bold touch-feedback">
                                                +
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    @click=${() => this.removeItem(item.id)}
                                    class="self-start p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded touch-feedback">
                                    <i data-lucide="trash-2" class="w-4 h-4 text-red-500"></i>
                                </button>
                            </div>
                        `)}
                    </div>

                    <!-- Footer with Checkout -->
                    ${this.items.length > 0 ? this.html`
                        <div class="border-t border-gray-200 dark:border-gray-700 p-4 space-y-3">
                            <div class="flex justify-between text-sm">
                                <span class="text-gray-600 dark:text-gray-400">Subtotal</span>
                                <span class="font-semibold dark:text-white">${formatCurrency(this.total)}</span>
                            </div>
                            ${cartStore.needsDeliveryFee() ? this.html`
                                <div class="flex justify-between text-sm">
                                    <span class="text-gray-600 dark:text-gray-400">Delivery</span>
                                    <span class="font-semibold dark:text-white">${formatCurrency(50)}</span>
                                </div>
                            ` : this.html`
                                <div class="flex items-center gap-2 text-xs text-green-600 dark:text-green-400">
                                    <i data-lucide="check-circle" class="w-4 h-4"></i>
                                    <span>Free delivery on orders above ${formatCurrency(1000)}</span>
                                </div>
                            `}
                            <div class="flex justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                                <span class="font-bold dark:text-white">Total</span>
                                <span class="font-bold text-lg text-primary-900 dark:text-primary-400">
                                    ${formatCurrency(this.total + (cartStore.needsDeliveryFee() ? 50 : 0))}
                                </span>
                            </div>
                            <button class="w-full bg-primary-900 dark:bg-primary-700 text-white py-3 rounded-xl font-semibold hover:bg-primary-800 dark:hover:bg-primary-600 transition-colors touch-feedback">
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
