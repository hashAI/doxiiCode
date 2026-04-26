import { BaseComponent } from './base-component.js';
import { shortlistStore, cartStore } from '../assets/state.js';
import { navigate } from '../assets/router.js';
import { showToast } from '../assets/utils.js';

class PrivateCollection extends BaseComponent {
    static properties = {
        isOpen: { type: Boolean },
        favorites: { type: Array },
        viewMode: { type: String }
    };

    constructor() {
        super();
        this.isOpen = false;
        this.favorites = [];
        this.viewMode = 'grid'; // 'grid' or 'list'
    }

    connectedCallback() {
        super.connectedCallback();

        this.unsubscribe = shortlistStore.subscribe((state) => {
            this.favorites = state.items;
        });

        window.addEventListener('collection:open', () => {
            this.open();
        });

        window.addEventListener('favorites:open', () => {
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

    removeItem(productId, e) {
        e?.stopPropagation();
        shortlistStore.remove(productId);
        showToast({ title: 'Removed from collection', variant: 'info' });
    }

    addToCart(product, e) {
        e?.stopPropagation();
        cartStore.add(product, 1);
        showToast({
            title: 'Added to cart',
            description: product.name,
            variant: 'success'
        });
    }

    addAllToCart() {
        this.favorites.forEach(product => {
            cartStore.add(product, 1);
        });
        showToast({
            title: 'All items added to cart',
            description: `${this.favorites.length} items`,
            variant: 'success'
        });
    }

    viewProduct(productId) {
        this.close();
        navigate(`/product/${productId}`);
    }

    toggleViewMode() {
        this.viewMode = this.viewMode === 'grid' ? 'list' : 'grid';
    }

    render() {
        if (!this.isOpen) return '';

        return this.html`
            <!-- Full-screen Gallery Overlay -->
            <div class="fixed inset-0 z-[100] bg-noir-950 overflow-y-auto animate-fade-in">
                <!-- Header -->
                <header class="fixed top-0 left-0 right-0 z-10 bg-noir-950/90 backdrop-blur-sm border-b border-noir-800">
                    <div class="max-w-[1600px] mx-auto px-6 lg:px-12 py-5">
                        <div class="flex items-center justify-between">
                            <!-- Title -->
                            <div>
                                <p class="text-[10px] text-gold-400 tracking-ultrawide uppercase mb-1">Personal</p>
                                <h1 class="text-2xl lg:text-3xl font-display text-noir-50">
                                    Private Collection
                                    <span class="text-gold-400/60 text-xl">(${this.favorites.length})</span>
                                </h1>
                            </div>

                            <!-- Actions -->
                            <div class="flex items-center gap-4">
                                <!-- View Toggle (Desktop) -->
                                <div class="hidden lg:flex items-center border border-noir-700">
                                    <button
                                        @click=${() => this.viewMode = 'grid'}
                                        class="p-2.5 ${this.viewMode === 'grid' ? 'bg-noir-700 text-gold-400' : 'text-noir-400 hover:text-noir-100'} transition-colors">
                                        <i data-lucide="grid-3x3" class="w-4 h-4"></i>
                                    </button>
                                    <button
                                        @click=${() => this.viewMode = 'list'}
                                        class="p-2.5 ${this.viewMode === 'list' ? 'bg-noir-700 text-gold-400' : 'text-noir-400 hover:text-noir-100'} transition-colors">
                                        <i data-lucide="list" class="w-4 h-4"></i>
                                    </button>
                                </div>

                                <!-- Add All to Cart -->
                                ${this.favorites.length > 0 ? this.html`
                                    <button
                                        @click=${this.addAllToCart}
                                        class="hidden lg:flex items-center gap-2 px-5 py-2.5 border border-gold-400/30 hover:border-gold-400 hover:bg-gold-400/5 text-noir-100 text-sm transition-all">
                                        <i data-lucide="shopping-bag" class="w-4 h-4"></i>
                                        Add All to Cart
                                    </button>
                                ` : ''}

                                <!-- Close -->
                                <button
                                    @click=${this.close}
                                    class="p-2.5 text-noir-400 hover:text-gold-400 transition-colors">
                                    <i data-lucide="x" class="w-5 h-5"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </header>

                <!-- Content -->
                <div class="pt-24 pb-32 min-h-screen">
                    ${this.favorites.length === 0 ? this.html`
                        <!-- Empty State -->
                        <div class="flex flex-col items-center justify-center min-h-[60vh] text-center px-8">
                            <div class="relative mb-8">
                                <div class="w-32 h-32 border border-gold-400/20 flex items-center justify-center">
                                    <i data-lucide="heart" class="w-12 h-12 text-gold-400/30"></i>
                                </div>
                                <div class="absolute -top-4 -right-4 w-8 h-8 border border-noir-700"></div>
                                <div class="absolute -bottom-4 -left-4 w-8 h-8 border border-noir-700"></div>
                            </div>
                            <h2 class="text-2xl font-display text-noir-100 mb-3">Your collection awaits</h2>
                            <p class="text-noir-400 mb-10 max-w-sm">
                                Save your favorite items to create your personal collection
                            </p>
                            <button
                                @click=${() => { this.close(); navigate('/products/all'); }}
                                class="px-10 py-4 border border-gold-400 text-gold-400 hover:bg-gold-400 hover:text-noir-900 tracking-wide uppercase text-sm transition-all touch-scale">
                                Explore Collection
                            </button>
                        </div>
                    ` : this.html`
                        <!-- Gallery Grid -->
                        <div class="max-w-[1600px] mx-auto px-6 lg:px-12">
                            ${this.viewMode === 'grid' ? this.html`
                                <!-- Grid View -->
                                <div class="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
                                    ${this.favorites.map((item, index) => this.html`
                                        <div
                                            class="group relative bg-noir-900 border border-noir-800 hover:border-gold-400/30 transition-all duration-500 product-card cursor-pointer opacity-0 animate-fade-in"
                                            style="animation-delay: ${index * 0.05}s"
                                            @click=${() => this.viewProduct(item.id)}>

                                            <!-- Image -->
                                            <div class="aspect-portrait relative overflow-hidden bg-noir-900 img-reveal">
                                                <img
                                                    src="${item.image}"
                                                    alt="${item.name}"
                                                    class="w-full h-full object-contain p-4 lg:p-6"
                                                />

                                                <!-- Overlay Actions -->
                                                <div class="absolute inset-0 bg-noir-950/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                                                    <button
                                                        @click=${(e) => this.addToCart(item, e)}
                                                        class="w-12 h-12 bg-gold-400 hover:bg-gold-500 text-noir-900 flex items-center justify-center transition-colors">
                                                        <i data-lucide="shopping-bag" class="w-5 h-5"></i>
                                                    </button>
                                                    <button
                                                        @click=${(e) => this.removeItem(item.id, e)}
                                                        class="w-12 h-12 border border-noir-100 hover:border-red-400 hover:text-red-400 text-noir-100 flex items-center justify-center transition-colors">
                                                        <i data-lucide="trash-2" class="w-5 h-5"></i>
                                                    </button>
                                                </div>

                                                <!-- Index Number -->
                                                <div class="absolute top-4 left-4 text-[10px] text-noir-500 font-medium">
                                                    ${String(index + 1).padStart(2, '0')}
                                                </div>
                                            </div>

                                            <!-- Details -->
                                            <div class="p-4 lg:p-5 border-t border-noir-800">
                                                <p class="text-[10px] text-noir-500 tracking-wide uppercase mb-1">${item.brand || item.category}</p>
                                                <h3 class="text-sm lg:text-base font-display text-noir-100 leading-tight line-clamp-2 group-hover:text-gold-400 transition-colors">
                                                    ${item.name}
                                                </h3>
                                                <div class="mt-3 flex items-baseline gap-2">
                                                    <span class="text-lg font-display text-gold-400">$${(item.price || 0).toFixed(2)}</span>
                                                    ${item.originalPrice && item.originalPrice > item.price ? this.html`
                                                        <span class="text-xs text-noir-500 line-through">$${item.originalPrice.toFixed(2)}</span>
                                                    ` : ''}
                                                </div>
                                            </div>
                                        </div>
                                    `)}
                                </div>
                            ` : this.html`
                                <!-- List View -->
                                <div class="space-y-4">
                                    ${this.favorites.map((item, index) => this.html`
                                        <div
                                            class="group flex gap-6 bg-noir-900 border border-noir-800 hover:border-gold-400/30 p-4 lg:p-6 transition-all cursor-pointer opacity-0 animate-fade-in"
                                            style="animation-delay: ${index * 0.05}s"
                                            @click=${() => this.viewProduct(item.id)}>

                                            <!-- Index -->
                                            <div class="hidden lg:flex w-12 items-start justify-center text-noir-600 font-display text-xl">
                                                ${String(index + 1).padStart(2, '0')}
                                            </div>

                                            <!-- Image -->
                                            <div class="w-24 h-24 lg:w-32 lg:h-32 flex-shrink-0 bg-noir-800 border border-noir-700 overflow-hidden">
                                                <img
                                                    src="${item.image}"
                                                    alt="${item.name}"
                                                    class="w-full h-full object-contain p-2"
                                                />
                                            </div>

                                            <!-- Details -->
                                            <div class="flex-1 flex flex-col lg:flex-row lg:items-center lg:gap-8">
                                                <div class="flex-1 min-w-0">
                                                    <p class="text-[10px] text-noir-500 tracking-wide uppercase mb-1">${item.brand || item.category}</p>
                                                    <h3 class="text-lg font-display text-noir-100 leading-tight line-clamp-2 group-hover:text-gold-400 transition-colors">
                                                        ${item.name}
                                                    </h3>
                                                    <div class="mt-2 flex items-center gap-2">
                                                        ${[...Array(5)].map((_, i) => this.html`
                                                            <i data-lucide="star" class="w-3 h-3 ${i < Math.floor(item.rating || 0) ? 'text-gold-400 fill-gold-400' : 'text-noir-600'}"></i>
                                                        `)}
                                                        <span class="text-xs text-noir-500">(${item.reviews || 0})</span>
                                                    </div>
                                                </div>

                                                <!-- Price -->
                                                <div class="mt-3 lg:mt-0 lg:text-right">
                                                    <span class="text-xl font-display text-gold-400">$${(item.price || 0).toFixed(2)}</span>
                                                    ${item.originalPrice && item.originalPrice > item.price ? this.html`
                                                        <p class="text-xs text-noir-500 line-through">$${item.originalPrice.toFixed(2)}</p>
                                                    ` : ''}
                                                </div>

                                                <!-- Actions -->
                                                <div class="hidden lg:flex items-center gap-2 ml-8">
                                                    <button
                                                        @click=${(e) => this.addToCart(item, e)}
                                                        class="px-6 py-2.5 bg-gold-400 hover:bg-gold-500 text-noir-900 text-sm font-medium transition-colors">
                                                        Add to Cart
                                                    </button>
                                                    <button
                                                        @click=${(e) => this.removeItem(item.id, e)}
                                                        class="p-2.5 border border-noir-700 hover:border-red-400 text-noir-400 hover:text-red-400 transition-colors">
                                                        <i data-lucide="trash-2" class="w-4 h-4"></i>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    `)}
                                </div>
                            `}
                        </div>

                        <!-- Mobile: Add All to Cart -->
                        <div class="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-noir-950/95 backdrop-blur-sm border-t border-noir-800">
                            <button
                                @click=${this.addAllToCart}
                                class="w-full py-4 bg-gold-400 hover:bg-gold-500 text-noir-900 font-medium tracking-wide uppercase text-sm transition-colors touch-scale flex items-center justify-center gap-2">
                                <i data-lucide="shopping-bag" class="w-4 h-4"></i>
                                Add All to Cart (${this.favorites.length})
                            </button>
                        </div>
                    `}
                </div>

                <!-- Decorative -->
                <div class="fixed bottom-8 left-8 hidden lg:flex items-center gap-4">
                    <div class="w-12 h-px bg-gold-400/30"></div>
                    <p class="text-[10px] text-noir-500 tracking-ultrawide uppercase">Private Collection</p>
                </div>
            </div>
        `;
    }
}

customElements.define('private-collection', PrivateCollection);
