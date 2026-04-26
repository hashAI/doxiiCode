import { BaseComponent } from './base-component.js';
import { cartStore, shortlistStore } from '../assets/state.js';
import { EventBus } from '../assets/utils.js';

class BottomNav extends BaseComponent {
    static properties = {
        activeTab: { type: String },
        cartCount: { type: Number },
        favoritesCount: { type: Number }
    };

    constructor() {
        super();
        this.activeTab = this.getActiveTab();
        this.cartCount = cartStore.getCount();
        this.favoritesCount = 0;

        window.addEventListener('hashchange', () => {
            this.activeTab = this.getActiveTab();
            this.requestUpdate();
        });

        EventBus.on('cart:updated', () => {
            this.cartCount = cartStore.getCount();
            this.requestUpdate();
        });

        shortlistStore.subscribe(({ count }) => {
            this.favoritesCount = count;
            this.requestUpdate();
        });
    }

    getActiveTab() {
        const hash = window.location.hash.slice(1) || '/';
        if (hash === '/') {
            return 'home';
        } else if (hash.startsWith('/products') || hash.startsWith('/product')) {
            return 'shop';
        } else if (hash.startsWith('/search')) {
            return 'search';
        }
        return 'home';
    }

    openCart() {
        const cart = document.querySelector('cart-sidebar');
        if (cart) cart.open();
    }

    openFavorites() {
        window.dispatchEvent(new CustomEvent('favorites:open'));
    }

    render() {
        const tabs = [
            { id: 'home', label: 'Home', icon: 'home', path: '#/' },
            { id: 'shop', label: 'Shop', icon: 'grid-3x3', path: '#/products/eyeglasses' },
            { id: 'search', label: 'Search', icon: 'search', path: '#/search' },
            { id: 'favorites', label: 'Wishlist', icon: 'heart', action: 'favorites' },
            { id: 'cart', label: 'Cart', icon: 'shopping-bag', action: 'cart' }
        ];

        return this.html`
            <!-- Mobile Only Bottom Navigation -->
            <nav class="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-slate-800 z-40 pb-safe">
                <div class="flex items-center justify-around py-2">
                    ${tabs.map(tab => this.html`
                        ${tab.action ? this.html`
                            <button
                                @click=${() => tab.action === 'cart' ? this.openCart() : this.openFavorites()}
                                class="flex flex-col items-center gap-1 py-2 px-3 min-w-[56px] touch-feedback"
                            >
                                <div class="relative">
                                    <i
                                        data-lucide="${tab.icon}"
                                        class="w-5 h-5 text-gray-400 dark:text-gray-500"
                                    ></i>
                                    ${tab.action === 'cart' && this.cartCount > 0 ? this.html`
                                        <span class="absolute -top-1.5 -right-1.5 bg-brand-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                                            ${this.cartCount > 9 ? '9+' : this.cartCount}
                                        </span>
                                    ` : ''}
                                    ${tab.action === 'favorites' && this.favoritesCount > 0 ? this.html`
                                        <span class="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                                            ${this.favoritesCount > 9 ? '9+' : this.favoritesCount}
                                        </span>
                                    ` : ''}
                                </div>
                                <span class="text-[10px] font-medium text-gray-500 dark:text-gray-400">
                                    ${tab.label}
                                </span>
                            </button>
                        ` : this.html`
                            <a
                                href="${tab.path}"
                                class="flex flex-col items-center gap-1 py-2 px-3 min-w-[56px] touch-feedback"
                            >
                                <div class="relative">
                                    <i
                                        data-lucide="${tab.icon}"
                                        class="w-5 h-5 ${
                                            this.activeTab === tab.id
                                                ? 'text-brand-500'
                                                : 'text-gray-400 dark:text-gray-500'
                                        }"
                                    ></i>
                                    ${this.activeTab === tab.id ? this.html`
                                        <div class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-brand-500 rounded-full"></div>
                                    ` : ''}
                                </div>
                                <span class="text-[10px] font-medium ${
                                    this.activeTab === tab.id
                                        ? 'text-brand-500 font-semibold'
                                        : 'text-gray-500 dark:text-gray-400'
                                }">
                                    ${tab.label}
                                </span>
                            </a>
                        `}
                    `)}
                </div>
            </nav>

            <!-- Bottom padding for mobile content -->
            <div class="lg:hidden h-20"></div>
        `;
    }
}

customElements.define('bottom-nav', BottomNav);
