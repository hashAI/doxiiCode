import { BaseComponent } from './base-component.js';
import { cartStore } from '../assets/state.js';
import { showToast } from '../assets/utils.js';
import { navigate } from '../assets/router.js';

class JewelryBoxCart extends BaseComponent {
    static properties = {
        isOpen: { type: Boolean },
        cart: { type: Object },
        activeItem: { type: Number }
    };

    constructor() {
        super();
        this.isOpen = false;
        this.cart = { items: [], count: 0, total: 0 };
        this.activeItem = 0;
    }

    connectedCallback() {
        super.connectedCallback();

        this.unsubscribe = cartStore.subscribe((state) => {
            this.cart = state;
        });

        window.addEventListener('cart:open', () => {
            this.open();
        });

        this.keyHandler = (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        };
        document.addEventListener('keydown', this.keyHandler);
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        this.unsubscribe?.();
        document.removeEventListener('keydown', this.keyHandler);
    }

    open() {
        this.isOpen = true;
        document.body.style.overflow = 'hidden';
    }

    close() {
        this.isOpen = false;
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

    viewProduct(productId) {
        this.close();
        navigate(`/product/${productId}`);
    }

    checkout() {
        if (this.cart.items.length === 0) return;
        showToast({
            title: 'Proceeding to checkout',
            description: 'Secure checkout experience',
            variant: 'success'
        });
        this.close();
    }

    render() {
        if (!this.isOpen) return '';

        return this.html`
            <!-- Backdrop -->
            <div
                @click=${this.close}
                class="fixed inset-0 z-[100] bg-noir-950/90 backdrop-blur-sm transition-opacity duration-300">
            </div>

            <!-- Modal -->
            <div class="fixed inset-4 lg:inset-auto lg:top-1/2 lg:left-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 lg:w-full lg:max-w-2xl lg:max-h-[85vh] z-[110] flex flex-col bg-noir-800 border border-gold-400/20 overflow-hidden animate-scale-in">
                <!-- Header -->
                <div class="relative px-6 py-5 border-b border-gold-400/10 bg-gradient-to-r from-noir-800 via-noir-800 to-noir-900">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-[10px] text-gold-400 tracking-ultrawide uppercase mb-1">Your Selection</p>
                            <h2 class="text-xl lg:text-2xl font-display text-noir-50">
                                Collection Box
                                <span class="text-gold-400 text-lg">(${this.cart.count})</span>
                            </h2>
                        </div>
                        <button
                            @click=${this.close}
                            class="p-2 text-noir-400 hover:text-gold-400 transition-colors">
                            <i data-lucide="x" class="w-5 h-5"></i>
                        </button>
                    </div>

                    <!-- Decorative line -->
                    <div class="absolute bottom-0 left-6 right-6 h-px line-gold"></div>
                </div>

                <!-- Cart Items -->
                <div class="flex-1 overflow-y-auto">
                    ${this.cart.items.length === 0 ? this.html`
                        <!-- Empty State -->
                        <div class="flex flex-col items-center justify-center h-full min-h-[300px] text-center px-8 py-12">
                            <div class="w-20 h-20 border border-gold-400/20 flex items-center justify-center mb-6 animate-float">
                                <i data-lucide="gem" class="w-8 h-8 text-gold-400/50"></i>
                            </div>
                            <p class="text-lg font-display text-noir-100 mb-2">Your collection box is empty</p>
                            <p class="text-sm text-noir-400 mb-8 max-w-xs">Discover our curated collection of fine pieces</p>
                            <button
                                @click=${() => { this.close(); navigate('/products/all'); }}
                                class="px-8 py-3 border border-gold-400 text-gold-400 hover:bg-gold-400 hover:text-noir-900 text-sm tracking-wide uppercase transition-all touch-scale">
                                Explore Collection
                            </button>
                        </div>
                    ` : this.html`
                        <!-- Items List -->
                        <div class="divide-y divide-noir-700/50">
                            ${this.cart.items.map((item, index) => this.html`
                                <div class="p-6 hover:bg-noir-700/20 transition-colors group">
                                    <div class="flex gap-5">
                                        <!-- Product Image -->
                                        <button
                                            @click=${() => this.viewProduct(item.id)}
                                            class="relative w-24 h-24 lg:w-28 lg:h-28 flex-shrink-0 bg-noir-900 border border-noir-700 overflow-hidden img-reveal">
                                            <img
                                                src="${item.image}"
                                                alt="${item.name}"
                                                class="w-full h-full object-contain p-2"
                                            />
                                        </button>

                                        <!-- Details -->
                                        <div class="flex-1 flex flex-col min-w-0">
                                            <button
                                                @click=${() => this.viewProduct(item.id)}
                                                class="text-left">
                                                <p class="text-xs text-noir-400 tracking-wide uppercase mb-1">${item.brand || ''}</p>
                                                <h3 class="text-base font-display text-noir-100 leading-tight line-clamp-2 group-hover:text-gold-400 transition-colors">
                                                    ${item.name}
                                                </h3>
                                            </button>

                                            <!-- Price -->
                                            <div class="mt-2 flex items-baseline gap-2">
                                                <span class="text-lg font-display text-gold-400">$${(item.price || 0).toFixed(2)}</span>
                                                ${item.originalPrice && item.originalPrice > item.price ? this.html`
                                                    <span class="text-xs text-noir-500 line-through">$${item.originalPrice.toFixed(2)}</span>
                                                ` : ''}
                                            </div>

                                            <!-- Quantity & Remove -->
                                            <div class="mt-auto pt-3 flex items-center justify-between">
                                                <div class="flex items-center border border-noir-600">
                                                    <button
                                                        @click=${() => this.updateQuantity(item.id, item.quantity - 1)}
                                                        class="w-8 h-8 flex items-center justify-center text-noir-300 hover:text-gold-400 hover:bg-noir-700 transition-colors">
                                                        <i data-lucide="minus" class="w-3 h-3"></i>
                                                    </button>
                                                    <span class="w-10 text-center text-sm font-medium text-noir-100">${item.quantity}</span>
                                                    <button
                                                        @click=${() => this.updateQuantity(item.id, item.quantity + 1)}
                                                        class="w-8 h-8 flex items-center justify-center text-noir-300 hover:text-gold-400 hover:bg-noir-700 transition-colors">
                                                        <i data-lucide="plus" class="w-3 h-3"></i>
                                                    </button>
                                                </div>
                                                <button
                                                    @click=${() => this.removeItem(item.id)}
                                                    class="p-2 text-noir-400 hover:text-red-400 transition-colors">
                                                    <i data-lucide="trash-2" class="w-4 h-4"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            `)}
                        </div>
                    `}
                </div>

                <!-- Footer -->
                ${this.cart.items.length > 0 ? this.html`
                    <div class="border-t border-gold-400/10 bg-noir-900 px-6 py-5">
                        <!-- Subtotal -->
                        <div class="flex items-center justify-between mb-2">
                            <span class="text-sm text-noir-300">Subtotal</span>
                            <span class="text-lg font-display text-noir-100">$${this.cart.total.toFixed(2)}</span>
                        </div>

                        <!-- Shipping -->
                        <div class="flex items-center justify-between mb-4 pb-4 border-b border-noir-700">
                            <span class="text-sm text-noir-400">Shipping</span>
                            <span class="text-sm text-gold-400 flex items-center gap-1.5">
                                <i data-lucide="truck" class="w-3.5 h-3.5"></i>
                                Complimentary
                            </span>
                        </div>

                        <!-- Total -->
                        <div class="flex items-center justify-between mb-6">
                            <span class="text-base text-noir-100">Total</span>
                            <span class="text-2xl font-display text-gold-400">$${this.cart.total.toFixed(2)}</span>
                        </div>

                        <!-- Checkout Button -->
                        <button
                            @click=${this.checkout}
                            class="w-full py-4 bg-gold-400 hover:bg-gold-500 text-noir-900 font-medium tracking-wide uppercase text-sm transition-colors touch-scale">
                            Proceed to Checkout
                        </button>

                        <!-- Continue Shopping -->
                        <button
                            @click=${this.close}
                            class="w-full mt-3 py-3 text-noir-300 hover:text-gold-400 text-sm tracking-wide transition-colors">
                            Continue Shopping
                        </button>

                        <!-- Trust Badge -->
                        <div class="mt-4 flex items-center justify-center gap-4 text-noir-500">
                            <div class="flex items-center gap-1.5 text-[10px] tracking-wide uppercase">
                                <i data-lucide="shield-check" class="w-3 h-3"></i>
                                Secure
                            </div>
                            <div class="w-px h-3 bg-noir-700"></div>
                            <div class="flex items-center gap-1.5 text-[10px] tracking-wide uppercase">
                                <i data-lucide="gem" class="w-3 h-3"></i>
                                Certified
                            </div>
                            <div class="w-px h-3 bg-noir-700"></div>
                            <div class="flex items-center gap-1.5 text-[10px] tracking-wide uppercase">
                                <i data-lucide="package" class="w-3 h-3"></i>
                                Insured
                            </div>
                        </div>
                    </div>
                ` : ''}
            </div>
        `;
    }
}

customElements.define('jewelry-box-cart', JewelryBoxCart);
