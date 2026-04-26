import { BaseComponent } from './base-component.js';
import { shortlistStore, cartStore } from '../assets/state.js';
import { showToast } from '../assets/utils.js';
import { navigate } from '../assets/router.js';

class FavoritesSidebar extends BaseComponent {
    static properties = {
        isOpen: { type: Boolean },
        favorites: { type: Array }
    };

    constructor() {
        super();
        this.isOpen = false;
        this.favorites = [];
    }

    connectedCallback() {
        super.connectedCallback();
        this.unsubscribe = shortlistStore.subscribe((state) => {
            this.favorites = state.items;
        });

        window.addEventListener('favorites:open', () => {
            this.open();
        });

        this.overlayClickHandler = () => {
            if (this.isOpen) this.close();
        };
        document.getElementById('overlay')?.addEventListener('click', this.overlayClickHandler);
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        this.unsubscribe?.();
        document.getElementById('overlay')?.removeEventListener('click', this.overlayClickHandler);
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

    removeFromFavorites(productId) {
        shortlistStore.remove(productId);
        showToast({ title: 'Removed from favorites', variant: 'info' });
    }

    addToCart(product, e) {
        e.stopPropagation();
        cartStore.add(product, 1);
        showToast({
            title: 'Added to Cart',
            message: product.name,
            variant: 'success'
        });
    }

    addAllToCart() {
        if (this.favorites.length === 0) return;
        this.favorites.forEach(product => {
            cartStore.add(product, 1);
        });
        showToast({
            title: 'Added to Cart',
            message: `${this.favorites.length} items added`,
            variant: 'success'
        });
        this.close();
    }

    viewProduct(productId) {
        this.close();
        navigate(`/product/${productId}`);
    }

    render() {
        return this.html`
            <div class="fixed inset-y-0 right-0 w-full max-w-md lg:max-w-lg bg-white dark:bg-gray-800 shadow-2xl transform transition-transform duration-300 z-50 ${this.isOpen ? 'translate-x-0' : 'translate-x-full'}">
                <div class="flex flex-col h-full">
                    <!-- Header -->
                    <div class="flex items-center justify-between p-4 lg:p-6 border-b border-gray-200 dark:border-gray-700">
                        <h2 class="text-lg lg:text-xl font-bold dark:text-white flex items-center gap-2">
                            <i data-lucide="heart" class="w-5 h-5 lg:w-6 lg:h-6 text-pink-500"></i>
                            My Favorites (${this.favorites.length})
                        </h2>
                        <button @click=${this.close} class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg touch-feedback transition">
                            <i data-lucide="x" class="w-5 h-5 lg:w-6 lg:h-6 dark:text-gray-300"></i>
                        </button>
                    </div>

                    <!-- Favorite Items -->
                    <div class="flex-1 overflow-y-auto p-4 lg:p-6 space-y-3 lg:space-y-4">
                        ${this.favorites.length === 0 ? this.html`
                            <div class="flex flex-col items-center justify-center h-full text-center py-12 lg:py-16">
                                <div class="w-20 h-20 lg:w-24 lg:h-24 rounded-full bg-pink-50 dark:bg-gray-700 flex items-center justify-center mb-4">
                                    <i data-lucide="heart" class="w-10 h-10 lg:w-12 lg:h-12 text-pink-300 dark:text-gray-600"></i>
                                </div>
                                <p class="text-gray-500 dark:text-gray-400 font-medium text-lg">No favorites yet</p>
                                <p class="text-sm text-gray-400 dark:text-gray-500 mt-1">Save products to your wishlist for later</p>
                                <button
                                    @click=${() => { this.close(); navigate('/products/all'); }}
                                    class="mt-4 px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-semibold touch-feedback transition">
                                    Start Shopping
                                </button>
                            </div>
                        ` : this.favorites.map(item => this.html`
                            <div @click=${() => this.viewProduct(item.id)} class="flex gap-3 lg:gap-4 p-3 lg:p-4 bg-gray-50 dark:bg-gray-700 rounded-xl lg:rounded-2xl cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 hover:shadow-md transition">
                                <img src="${item.images?.[0] || item.image || ''}" alt="${item.name}" class="w-20 h-20 lg:w-24 lg:h-24 rounded-lg lg:rounded-xl object-contain bg-white">
                                <div class="flex-1 space-y-1.5 lg:space-y-2">
                                    <h3 class="font-semibold text-sm lg:text-base dark:text-white leading-tight">${item.name}</h3>
                                    <p class="text-xs lg:text-sm text-gray-500 dark:text-gray-300">${item.brand || ''}</p>
                                    <div class="flex items-center gap-1 text-xs lg:text-sm">
                                        <i data-lucide="star" class="w-3 h-3 lg:w-4 lg:h-4 text-amber-500 fill-amber-500"></i>
                                        <span class="font-semibold">${item.rating || 0}</span>
                                    </div>
                                    <div class="flex items-baseline gap-2">
                                        <span class="text-lg lg:text-xl font-black text-primary-700 dark:text-primary-400">$${(item.price || 0).toFixed(2)}</span>
                                        ${item.originalPrice && item.originalPrice > item.price ? this.html`
                                            <span class="text-xs lg:text-sm text-gray-400 line-through">$${item.originalPrice.toFixed(2)}</span>
                                        ` : ''}
                                    </div>
                                    <div class="flex items-center gap-2 pt-1">
                                        <button
                                            @click=${(e) => this.addToCart(item, e)}
                                            class="flex-1 py-1.5 lg:py-2 rounded-lg bg-accent-500 hover:bg-accent-600 text-white text-xs lg:text-sm font-bold touch-feedback transition">
                                            Add to Cart
                                        </button>
                                        <button
                                            @click=${(e) => { e.stopPropagation(); this.removeFromFavorites(item.id); }}
                                            class="p-1.5 lg:p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg touch-feedback transition">
                                            <i data-lucide="trash-2" class="w-4 h-4 lg:w-5 lg:h-5 text-red-500"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        `)}
                    </div>

                    ${this.favorites.length > 0 ? this.html`
                        <div class="border-t border-gray-200 dark:border-gray-700 p-4 lg:p-6">
                            <button
                                @click=${this.addAllToCart}
                                class="w-full bg-gradient-to-r from-primary-600 to-purple-600 hover:opacity-90 text-white py-4 lg:py-5 rounded-xl lg:rounded-2xl font-bold text-base lg:text-lg touch-feedback transition shadow-lg shadow-primary-500/30 flex items-center justify-center gap-2">
                                <i data-lucide="shopping-bag" class="w-5 h-5"></i>
                                Add all to cart (${this.favorites.length})
                            </button>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }
}

customElements.define('favorites-sidebar', FavoritesSidebar);

