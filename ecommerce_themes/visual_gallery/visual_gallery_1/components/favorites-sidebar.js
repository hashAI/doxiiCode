import { BaseComponent } from './base-component.js';
import { shortlistStore, cartStore } from '../assets/state.js';
import { navigate } from '../assets/router.js';
import { showToast } from '../assets/utils.js';

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
        shortlistStore.remove(productId);
        showToast({ title: 'Removed from wishlist', variant: 'info' });
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
            description: `${this.favorites.length} pieces added`,
            variant: 'success'
        });
    }

    viewProduct(productId) {
        this.close();
        navigate(`/product/${productId}`);
    }

    render() {
        return this.html`
            <div class="fixed inset-y-0 right-0 w-full max-w-md lg:max-w-lg bg-white dark:bg-stone-900 shadow-hover transform transition-transform duration-300 z-50 ${this.isOpen ? 'translate-x-0' : 'translate-x-full'}">
                <div class="flex flex-col h-full">
                    <!-- Header -->
                    <div class="flex items-center justify-between p-5 lg:p-6 border-b border-sand-200 dark:border-stone-700 bg-gradient-to-r from-cream-100 via-rose-50 to-cream-100 dark:from-stone-900 dark:via-stone-800 dark:to-stone-900">
                        <h2 class="text-lg lg:text-xl font-display font-semibold text-sand-900 dark:text-cream-50 flex items-center gap-2.5">
                            <div class="w-10 h-10 rounded-xl bg-rose-500 dark:bg-rose-600 flex items-center justify-center">
                                <i data-lucide="heart" class="w-5 h-5 text-white"></i>
                            </div>
                            <span>Wishlist <span class="text-rose-500 dark:text-rose-400">(${this.favorites.length})</span></span>
                        </h2>
                        <button @click=${this.close} class="p-2.5 hover:bg-sand-200 dark:hover:bg-stone-800 rounded-xl touch-feedback transition">
                            <i data-lucide="x" class="w-5 h-5 text-sand-900 dark:text-cream-100"></i>
                        </button>
                    </div>

                    <!-- Favorites Items -->
                    <div class="flex-1 overflow-y-auto p-5 lg:p-6 space-y-4 bg-cream-50 dark:bg-stone-950">
                        ${this.favorites.length === 0 ? this.html`
                            <div class="flex flex-col items-center justify-center h-full text-center py-16">
                                <div class="w-24 h-24 rounded-full bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center mb-4">
                                    <i data-lucide="heart" class="w-12 h-12 text-rose-400 dark:text-rose-500"></i>
                                </div>
                                <p class="text-sand-900 dark:text-cream-100 font-semibold text-lg mb-1">Your wishlist is empty</p>
                                <p class="text-sm text-sand-600 dark:text-cream-400">Save your favorite pieces here</p>
                                <button @click=${() => { this.close(); window.location.hash = '/products/all'; }} class="mt-6 px-6 py-3 bg-gradient-to-r from-rose-400 to-rose-500 dark:from-rose-500 dark:to-rose-600 hover:shadow-rose text-white font-semibold rounded-2xl transition shadow-soft">
                                    Explore Collection
                                </button>
                            </div>
                        ` : this.favorites.map(item => this.html`
                            <div
                                @click=${() => this.viewProduct(item.id)}
                                class="flex gap-4 p-4 bg-white dark:bg-stone-900 rounded-2xl border border-sand-200 dark:border-stone-700 cursor-pointer hover:shadow-soft transition">
                                <img src="${item.image}" alt="${item.name}" class="w-24 h-24 rounded-xl object-contain bg-cream-50 dark:bg-stone-800">
                                <div class="flex-1 space-y-2">
                                    <h3 class="font-semibold text-sand-900 dark:text-cream-100 leading-tight">${item.name}</h3>
                                    <p class="text-xs text-sand-600 dark:text-cream-400">${item.brand || ''}</p>
                                    <div class="flex items-center gap-1">
                                        ${[...Array(5)].map((_, i) => this.html`
                                            <i data-lucide="star" class="w-3 h-3 ${i < Math.floor(item.rating || 0) ? 'text-amber-500 fill-amber-500' : 'text-sand-300 dark:text-stone-600'}"></i>
                                        `)}
                                        <span class="text-xs text-sand-600 dark:text-cream-400 ml-1">${item.rating || 0}</span>
                                    </div>
                                    <div class="flex items-baseline gap-2">
                                        <span class="text-lg font-bold text-rose-500 dark:text-rose-400">$${(item.price || 0).toFixed(2)}</span>
                                        ${item.originalPrice && item.originalPrice > item.price ? this.html`
                                            <span class="text-xs text-sand-400 dark:text-stone-500 line-through">$${item.originalPrice.toFixed(2)}</span>
                                        ` : ''}
                                    </div>
                                    <div class="flex items-center gap-2 pt-1">
                                        <button
                                            @click=${(e) => this.addToCart(item, e)}
                                            class="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 bg-gradient-to-r from-rose-400 to-rose-500 dark:from-rose-500 dark:to-rose-600 text-white rounded-xl text-sm font-semibold touch-feedback hover:shadow-rose transition">
                                            <i data-lucide="shopping-bag" class="w-4 h-4"></i>
                                            Add to Cart
                                        </button>
                                        <button
                                            @click=${(e) => { e.stopPropagation(); this.removeItem(item.id); }}
                                            class="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg touch-feedback transition">
                                            <i data-lucide="trash-2" class="w-4 h-4 text-red-500 dark:text-red-400"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        `)}
                    </div>

                    ${this.favorites.length > 0 ? this.html`
                        <div class="border-t border-sand-200 dark:border-stone-700 p-5 lg:p-6 space-y-4 bg-white dark:bg-stone-900">
                            <button
                                @click=${this.addAllToCart}
                                class="w-full bg-gradient-to-r from-rose-400 to-rose-500 dark:from-rose-500 dark:to-rose-600 hover:shadow-rose text-white py-4 rounded-2xl font-semibold text-base touch-feedback transition shadow-soft flex items-center justify-center gap-2">
                                <i data-lucide="shopping-bag" class="w-5 h-5"></i>
                                Add All to Cart (${this.favorites.length})
                            </button>
                            <p class="text-center text-xs text-sand-600 dark:text-cream-400 flex items-center justify-center gap-2">
                                <i data-lucide="gem" class="w-3 h-3"></i>
                                ${this.favorites.length} ${this.favorites.length === 1 ? 'piece' : 'pieces'} saved
                            </p>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }
}

customElements.define('favorites-sidebar', FavoritesSidebar);
