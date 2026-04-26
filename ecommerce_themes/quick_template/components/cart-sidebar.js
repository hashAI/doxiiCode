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
            <div class="fixed inset-y-0 right-0 w-full max-w-md lg:max-w-lg bg-white dark:bg-stone-900 shadow-hover transform transition-transform duration-300 z-50 ${this.isOpen ? 'translate-x-0' : 'translate-x-full'}">
                <div class="flex flex-col h-full">
                    <!-- Header -->
                    <div class="flex items-center justify-between p-5 lg:p-6 border-b border-sand-200 dark:border-stone-700 bg-gradient-to-r from-cream-100 via-rose-50 to-cream-100 dark:from-stone-900 dark:via-stone-800 dark:to-stone-900">
                        <h2 class="text-lg lg:text-xl font-display font-semibold text-sand-900 dark:text-cream-50 flex items-center gap-2.5">
                            <div class="w-10 h-10 rounded-xl bg-rose-500 dark:bg-rose-600 flex items-center justify-center">
                                <i data-lucide="shopping-bag" class="w-5 h-5 text-white"></i>
                            </div>
                            <span>Your Cart <span class="text-rose-500 dark:text-rose-400">(${this.cart.count})</span></span>
                        </h2>
                        <button @click=${this.close} class="p-2.5 hover:bg-sand-200 dark:hover:bg-stone-800 rounded-xl touch-feedback transition">
                            <i data-lucide="x" class="w-5 h-5 text-sand-900 dark:text-cream-100"></i>
                        </button>
                    </div>

                    <!-- Cart Items -->
                    <div class="flex-1 overflow-y-auto p-5 lg:p-6 space-y-4 bg-cream-50 dark:bg-stone-950">
                        ${this.cart.items.length === 0 ? this.html`
                            <div class="flex flex-col items-center justify-center h-full text-center py-16">
                                <div class="w-24 h-24 rounded-full bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center mb-4">
                                    <i data-lucide="shopping-bag" class="w-12 h-12 text-rose-400 dark:text-rose-500"></i>
                                </div>
                                <p class="text-sand-900 dark:text-cream-100 font-semibold text-lg mb-1">Your cart is empty</p>
                                <p class="text-sm text-sand-600 dark:text-cream-400">Discover our beautiful collection</p>
                                <button @click=${() => { this.close(); window.location.hash = '/products/all'; }} class="mt-6 px-6 py-3 bg-gradient-to-r from-rose-400 to-rose-500 dark:from-rose-500 dark:to-rose-600 hover:shadow-rose text-white font-semibold rounded-2xl transition shadow-soft">
                                    Explore Collection
                                </button>
                            </div>
                        ` : this.cart.items.map(item => this.html`
                            <div class="flex gap-4 p-4 bg-white dark:bg-stone-900 rounded-2xl border border-sand-200 dark:border-stone-700 hover:shadow-soft transition">
                                <img src="${item.image}" alt="${item.name}" class="w-24 h-24 rounded-xl object-contain bg-cream-50 dark:bg-stone-800">
                                <div class="flex-1 space-y-2">
                                    <h3 class="font-semibold text-sand-900 dark:text-cream-100 leading-tight">${item.name}</h3>
                                    <p class="text-xs text-sand-600 dark:text-cream-400">${item.brand || ''}</p>
                                    <div class="flex items-baseline gap-2">
                                        <span class="text-lg font-bold text-rose-500 dark:text-rose-400">$${(item.price || 0).toFixed(2)}</span>
                                        ${item.originalPrice && item.originalPrice > item.price ? this.html`
                                            <span class="text-xs text-sand-400 dark:text-stone-500 line-through">$${item.originalPrice.toFixed(2)}</span>
                                        ` : ''}
                                    </div>
                                    <div class="flex items-center gap-2 pt-1">
                                        <div class="flex items-center gap-2 bg-sand-100 dark:bg-stone-800 rounded-xl p-1 border border-sand-200 dark:border-stone-700">
                                            <button
                                                @click=${() => this.updateQuantity(item.id, item.quantity - 1)}
                                                class="w-8 h-8 rounded-lg bg-white dark:bg-stone-700 hover:bg-rose-100 dark:hover:bg-rose-900/30 flex items-center justify-center touch-feedback transition">
                                                <i data-lucide="minus" class="w-3.5 h-3.5 text-sand-900 dark:text-cream-100"></i>
                                            </button>
                                            <span class="w-8 text-center font-semibold text-sand-900 dark:text-cream-100">${item.quantity}</span>
                                            <button
                                                @click=${() => this.updateQuantity(item.id, item.quantity + 1)}
                                                class="w-8 h-8 rounded-lg bg-white dark:bg-stone-700 hover:bg-rose-100 dark:hover:bg-rose-900/30 flex items-center justify-center touch-feedback transition">
                                                <i data-lucide="plus" class="w-3.5 h-3.5 text-sand-900 dark:text-cream-100"></i>
                                            </button>
                                        </div>
                                        <button
                                            @click=${() => this.removeItem(item.id)}
                                            class="ml-auto p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg touch-feedback transition">
                                            <i data-lucide="trash-2" class="w-4 h-4 text-red-500 dark:text-red-400"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        `)}
                    </div>

                    ${this.cart.items.length > 0 ? this.html`
                        <div class="border-t border-sand-200 dark:border-stone-700 p-5 lg:p-6 space-y-4 bg-white dark:bg-stone-900">
                            <div class="flex items-center justify-between">
                                <span class="text-sand-700 dark:text-cream-300">Subtotal:</span>
                                <span class="text-2xl font-bold text-sand-900 dark:text-cream-100">$${this.cart.total.toFixed(2)}</span>
                            </div>
                            <div class="flex items-center justify-between text-sm">
                                <span class="text-sand-600 dark:text-cream-400">Shipping:</span>
                                <span class="text-rose-500 dark:text-rose-400 font-semibold flex items-center gap-1">
                                    <i data-lucide="truck" class="w-4 h-4"></i> Free
                                </span>
                            </div>
                            <div class="border-t border-sand-200 dark:border-stone-700 pt-4 flex items-center justify-between">
                                <span class="text-lg font-semibold text-sand-900 dark:text-cream-100">Total:</span>
                                <span class="text-3xl font-bold text-rose-500 dark:text-rose-400">$${this.cart.total.toFixed(2)}</span>
                            </div>
                            <button
                                @click=${this.checkout}
                                class="w-full bg-gradient-to-r from-rose-400 to-rose-500 dark:from-rose-500 dark:to-rose-600 hover:shadow-rose text-white py-4 rounded-2xl font-semibold text-base touch-feedback transition shadow-soft">
                                Proceed to Checkout
                            </button>
                            <p class="text-center text-xs text-sand-600 dark:text-cream-400 flex items-center justify-center gap-2">
                                <i data-lucide="shield-check" class="w-3 h-3"></i>
                                Secure & Insured Shipping
                            </p>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }
}

customElements.define('cart-sidebar', CartSidebar);
