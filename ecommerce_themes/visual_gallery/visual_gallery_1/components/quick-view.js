import { BaseComponent } from './base-component.js';
import { cartStore, shortlistStore } from '../assets/state.js';
import { navigate } from '../assets/router.js';
import { showToast } from '../assets/utils.js';

class QuickView extends BaseComponent {
    static properties = {
        isOpen: { type: Boolean },
        product: { type: Object },
        quantity: { type: Number },
        isSaved: { type: Boolean }
    };

    constructor() {
        super();
        this.isOpen = false;
        this.product = null;
        this.quantity = 1;
        this.isSaved = false;
    }

    connectedCallback() {
        super.connectedCallback();

        window.addEventListener('quickview:open', (e) => {
            if (e.detail) {
                this.product = e.detail;
                this.quantity = 1;
                this.checkIfSaved();
                this.open();
            }
        });

        this.unsubscribeWishlist = shortlistStore.subscribe(() => {
            this.checkIfSaved();
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
        this.unsubscribeWishlist?.();
        document.removeEventListener('keydown', this.keyHandler);
    }

    checkIfSaved() {
        if (this.product) {
            const items = shortlistStore.getState().items;
            this.isSaved = items.some(item => item.id === this.product.id);
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

    incrementQuantity() {
        this.quantity++;
    }

    decrementQuantity() {
        if (this.quantity > 1) {
            this.quantity--;
        }
    }

    addToCart() {
        if (!this.product) return;
        cartStore.add(this.product, this.quantity);
        showToast({
            title: 'Added to cart',
            description: `${this.quantity}x ${this.product.name}`,
            variant: 'success'
        });
        this.close();
    }

    toggleWishlist() {
        if (!this.product) return;
        shortlistStore.toggle(this.product);
        showToast({
            title: this.isSaved ? 'Removed from collection' : 'Added to collection',
            variant: this.isSaved ? 'info' : 'success'
        });
    }

    viewFullDetails() {
        if (!this.product) return;
        this.close();
        navigate(`/product/${this.product.id}`);
    }

    render() {
        if (!this.isOpen || !this.product) return '';

        return this.html`
            <!-- Backdrop -->
            <div
                @click=${this.close}
                class="fixed inset-0 z-[100] bg-noir-950/90 backdrop-blur-sm animate-fade-in">
            </div>

            <!-- Panel -->
            <div class="quick-view-panel open z-[110] overflow-hidden">
                <!-- Mobile Handle -->
                <div class="lg:hidden w-12 h-1 bg-noir-600 rounded-full mx-auto mt-3"></div>

                <!-- Close Button (Desktop) -->
                <button
                    @click=${this.close}
                    class="hidden lg:flex absolute top-4 right-4 p-2 text-noir-400 hover:text-gold-400 transition-colors z-10">
                    <i data-lucide="x" class="w-5 h-5"></i>
                </button>

                <div class="p-6 lg:p-8 overflow-y-auto max-h-[80vh] lg:max-h-full">
                    <div class="flex flex-col lg:flex-row gap-6 lg:gap-8">
                        <!-- Image -->
                        <div class="lg:w-1/2">
                            <div class="aspect-square bg-noir-800 border border-noir-700 overflow-hidden">
                                <img
                                    src="${this.product.image}"
                                    alt="${this.product.name}"
                                    class="w-full h-full object-contain p-6"
                                />
                            </div>
                        </div>

                        <!-- Details -->
                        <div class="lg:w-1/2 flex flex-col">
                            <!-- Brand & Category -->
                            <div class="flex items-center gap-3 mb-2">
                                <p class="text-[10px] text-gold-400 tracking-ultrawide uppercase">${this.product.brand}</p>
                                <span class="w-1 h-1 bg-noir-600 rounded-full"></span>
                                <p class="text-[10px] text-noir-400 tracking-ultrawide uppercase">${this.product.category}</p>
                            </div>

                            <!-- Name -->
                            <h2 class="text-2xl lg:text-3xl font-display text-noir-50 mb-4">${this.product.name}</h2>

                            <!-- Rating -->
                            <div class="flex items-center gap-2 mb-4">
                                <div class="flex items-center">
                                    ${[...Array(5)].map((_, i) => this.html`
                                        <i data-lucide="star" class="w-4 h-4 ${i < Math.floor(this.product.rating || 0) ? 'text-gold-400 fill-gold-400' : 'text-noir-600'}"></i>
                                    `)}
                                </div>
                                <span class="text-sm text-noir-400">${this.product.rating} (${this.product.reviews} reviews)</span>
                            </div>

                            <!-- Price -->
                            <div class="flex items-baseline gap-3 mb-6">
                                <span class="text-3xl font-display text-gold-400">$${(this.product.price || 0).toFixed(2)}</span>
                                ${this.product.originalPrice && this.product.originalPrice > this.product.price ? this.html`
                                    <span class="text-lg text-noir-500 line-through">$${this.product.originalPrice.toFixed(2)}</span>
                                    <span class="text-sm text-green-400">Save $${(this.product.originalPrice - this.product.price).toFixed(2)}</span>
                                ` : ''}
                            </div>

                            <!-- Description -->
                            ${this.product.description ? this.html`
                                <p class="text-sm text-noir-300 leading-relaxed mb-6">${this.product.description}</p>
                            ` : ''}

                            <!-- Quantity -->
                            <div class="mb-6">
                                <p class="text-xs text-noir-400 tracking-wide uppercase mb-2">Quantity</p>
                                <div class="flex items-center border border-noir-700 w-fit">
                                    <button
                                        @click=${this.decrementQuantity}
                                        class="w-12 h-12 flex items-center justify-center text-noir-300 hover:text-gold-400 hover:bg-noir-800 transition-colors">
                                        <i data-lucide="minus" class="w-4 h-4"></i>
                                    </button>
                                    <span class="w-16 text-center text-lg font-medium text-noir-100">${this.quantity}</span>
                                    <button
                                        @click=${this.incrementQuantity}
                                        class="w-12 h-12 flex items-center justify-center text-noir-300 hover:text-gold-400 hover:bg-noir-800 transition-colors">
                                        <i data-lucide="plus" class="w-4 h-4"></i>
                                    </button>
                                </div>
                            </div>

                            <!-- Actions -->
                            <div class="mt-auto space-y-3">
                                <div class="flex gap-3">
                                    <button
                                        @click=${this.addToCart}
                                        class="flex-1 py-4 bg-gold-400 hover:bg-gold-500 text-noir-900 font-medium tracking-wide uppercase text-sm transition-colors touch-scale">
                                        Add to Cart
                                    </button>
                                    <button
                                        @click=${this.toggleWishlist}
                                        class="w-14 h-14 border ${this.isSaved ? 'border-gold-400 bg-gold-400/10' : 'border-noir-600 hover:border-gold-400'} flex items-center justify-center transition-all touch-scale">
                                        <i data-lucide="heart" class="w-5 h-5 ${this.isSaved ? 'fill-gold-400 text-gold-400' : 'text-noir-300'}"></i>
                                    </button>
                                </div>

                                <button
                                    @click=${this.viewFullDetails}
                                    class="w-full py-3 text-noir-300 hover:text-gold-400 text-sm tracking-wide transition-colors flex items-center justify-center gap-2">
                                    View Full Details
                                    <i data-lucide="arrow-right" class="w-4 h-4"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}

customElements.define('quick-view', QuickView);
