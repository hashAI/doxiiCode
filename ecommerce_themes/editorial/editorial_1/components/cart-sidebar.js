import { BaseComponent } from './base-component.js';
import { cartStore } from '../assets/state.js';
import { navigate } from '../assets/router.js';
import { formatCurrency } from '../assets/utils.js';

class CartSidebar extends BaseComponent {
    static properties = {
        isOpen: { type: Boolean },
        cartState: { type: Object }
    };

    constructor() {
        super();
        this.isOpen = false;
        this.cartState = { items: [], subtotal: 0, tax: 0, total: 0, count: 0 };
        this.unsubscribe = null;
    }

    connectedCallback() {
        super.connectedCallback();
        this.unsubscribe = cartStore.subscribe((state) => {
            this.cartState = state;
        });

        window.addEventListener('cart:toggle', () => this.toggle());
        window.addEventListener('cart:open', () => this.open());
        window.addEventListener('cart:close', () => this.close());
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        });
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        if (this.unsubscribe) {
            this.unsubscribe();
        }
    }

    open() {
        this.isOpen = true;
        document.body.style.overflow = 'hidden';
    }

    close() {
        this.isOpen = false;
        document.body.style.overflow = '';
    }

    toggle() {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }

    updateQuantity(productId, quantity) {
        cartStore.update(productId, quantity);
    }

    removeItem(productId) {
        cartStore.remove(productId);
    }

    goToCheckout() {
        this.close();
        navigate('/checkout');
    }

    render() {
        const profileLinks = [
            { icon: 'package', label: 'Orders' },
            { icon: 'bookmark', label: 'Your Saves' },
            { icon: 'settings', label: 'Account' },
            { icon: 'user', label: 'Sign in' }
        ];

        return this.html`
            <!-- Backdrop -->
            <div
                class="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 transition-opacity duration-300 ${
                    this.isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                }"
                @click=${this.close}>
            </div>

            <!-- Sidebar Panel -->
            <div
                class="fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 transform transition-transform duration-300 ease-out ${
                    this.isOpen ? 'translate-x-0' : 'translate-x-full'
                }">

                <!-- Header with Close Button -->
                <div class="flex justify-end p-4">
                    <button 
                        @click=${this.close} 
                        class="p-2 text-apple-gray/60 hover:text-apple-gray transition-colors">
                        <svg class="w-5 h-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
                            <path d="M5 5l10 10M15 5l-10 10"/>
                        </svg>
                    </button>
                </div>

                <!-- Content -->
                <div class="px-8 pb-8 h-[calc(100%-60px)] overflow-y-auto">
                    ${this.cartState.items.length === 0 ? this.html`
                        <!-- Empty Bag State -->
                        <div class="mb-12">
                            <h2 class="text-3xl font-semibold text-apple-gray mb-4">
                                Your Bag is empty.
                            </h2>
                            <p class="text-gray-500">
                                <button class="text-apple-blue hover:underline">Sign in</button> 
                                to see if you have any saved items
                            </p>
                        </div>

                        <!-- My Profile Section -->
                        <div>
                            <h3 class="text-sm text-gray-400 mb-4">My Profile</h3>
                            <div class="space-y-1">
                                ${profileLinks.map(link => this.html`
                                    <button class="w-full flex items-center gap-4 py-3 text-left hover:bg-apple-lightgray rounded-xl px-3 -mx-3 transition-colors">
                                        <i data-lucide="${link.icon}" class="w-5 h-5 text-gray-400"></i>
                                        <span class="font-medium text-apple-gray">${link.label}</span>
                                    </button>
                                `)}
                            </div>
                        </div>
                    ` : this.html`
                        <!-- Bag with Items -->
                        <div class="mb-8">
                            <h2 class="text-3xl font-semibold text-apple-gray mb-2">
                                Your Bag
                            </h2>
                            <p class="text-gray-500 text-sm">
                                ${this.cartState.count} ${this.cartState.count === 1 ? 'item' : 'items'}
                            </p>
                        </div>

                        <!-- Cart Items -->
                        <div class="space-y-6 mb-8">
                            ${this.cartState.items.map(item => this.html`
                                <div class="flex gap-4 pb-6 border-b border-gray-100">
                                    <!-- Product Image -->
                                    <div class="w-20 h-20 bg-apple-lightgray rounded-xl flex-shrink-0 overflow-hidden">
                                        <img 
                                            src="${item.image}" 
                                            alt="${item.name}" 
                                            class="w-full h-full object-contain p-2">
                                    </div>

                                    <!-- Product Info -->
                                    <div class="flex-1 min-w-0">
                                        <div class="flex justify-between items-start gap-2">
                                            <h3 class="font-semibold text-apple-gray">${item.name}</h3>
                                            <button 
                                                @click=${() => this.removeItem(item.id)}
                                                class="text-apple-blue hover:underline text-sm flex-shrink-0">
                                                Remove
                                            </button>
                                        </div>
                                        
                                        <p class="text-lg font-semibold text-apple-gray mt-2">
                                            ${formatCurrency(item.price * item.quantity)}
                                        </p>

                                        <!-- Quantity Stepper -->
                                        <div class="flex items-center gap-3 mt-3">
                                            <button 
                                                @click=${() => this.updateQuantity(item.id, item.quantity - 1)}
                                                class="w-8 h-8 rounded-full bg-apple-lightgray hover:bg-gray-200 flex items-center justify-center transition-colors">
                                                <svg class="w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2">
                                                    <path d="M4 8h8"/>
                                                </svg>
                                            </button>
                                            <span class="font-medium w-6 text-center">${item.quantity}</span>
                                            <button 
                                                @click=${() => this.updateQuantity(item.id, item.quantity + 1)}
                                                class="w-8 h-8 rounded-full bg-apple-lightgray hover:bg-gray-200 flex items-center justify-center transition-colors">
                                                <svg class="w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2">
                                                    <path d="M8 4v8M4 8h8"/>
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            `)}
                        </div>

                        <!-- Summary -->
                        <div class="bg-apple-lightgray rounded-2xl p-6 mb-6">
                            <div class="space-y-3 mb-4">
                                <div class="flex justify-between text-sm">
                                    <span class="text-gray-600">Subtotal</span>
                                    <span class="text-apple-gray">${formatCurrency(this.cartState.subtotal)}</span>
                                </div>
                                <div class="flex justify-between text-sm">
                                    <span class="text-gray-600">Shipping</span>
                                    <span class="text-apple-gray">${this.cartState.shipping === 0 ? 'FREE' : formatCurrency(this.cartState.shipping)}</span>
                                </div>
                                <div class="flex justify-between text-sm">
                                    <span class="text-gray-600">Estimated tax</span>
                                    <span class="text-apple-gray">${formatCurrency(this.cartState.tax)}</span>
                                </div>
                            </div>
                            <div class="flex justify-between text-lg font-semibold pt-4 border-t border-gray-200">
                                <span class="text-apple-gray">Total</span>
                                <span class="text-apple-gray">${formatCurrency(this.cartState.total)}</span>
                            </div>
                        </div>

                        <!-- Checkout Button -->
                        <button 
                            @click=${this.goToCheckout} 
                            class="apple-button w-full mb-4">
                            Check Out
                        </button>

                        <!-- Continue Shopping -->
                        <button 
                            @click=${this.close}
                            class="w-full text-center text-apple-blue hover:underline py-2">
                            Continue Shopping
                        </button>

                        <!-- Apple Pay Badge -->
                        <div class="mt-8 pt-6 border-t border-gray-100">
                            <p class="text-xs text-gray-400 text-center mb-3">
                                Express checkout available
                            </p>
                            <div class="flex justify-center gap-3">
                                <div class="px-4 py-2 bg-black rounded-md text-white text-xs font-medium flex items-center gap-1">
                                    <svg class="w-4 h-4" viewBox="0 0 50 20" fill="currentColor">
                                        <path d="M10 0C4.5 0 0 4.5 0 10s4.5 10 10 10 10-4.5 10-10S15.5 0 10 0z"/>
                                    </svg>
                                    Pay
                                </div>
                            </div>
                        </div>
                    `}
                </div>
            </div>
        `;
    }
}

customElements.define('cart-sidebar', CartSidebar);
