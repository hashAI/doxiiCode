import { BaseComponent } from './base-component.js';
import { navigate, getCurrentRoute } from '../assets/router.js';
import { shortlistStore, cartStore } from '../assets/state.js';

class BottomNav extends BaseComponent {
    static properties = {
        activeTab: { type: String },
        favoritesCount: { type: Number },
        cartCount: { type: Number }
    };

    constructor() {
        super();
        this.activeTab = 'home';
        this.favoritesCount = 0;
        this.cartCount = 0;
        this.lastRoute = null;
    }

    connectedCallback() {
        super.connectedCallback();
        this.handleRouteChange = (event) => {
            this.updateActiveTab(event?.detail);
        };
        window.addEventListener('route:changed', this.handleRouteChange);
        this.updateActiveTab(getCurrentRoute());

        this.unsubscribeFavorites = shortlistStore.subscribe((state) => {
            this.favoritesCount = state.count;
        });

        this.unsubscribeCart = cartStore.subscribe((state) => {
            this.cartCount = state.count;
        });
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        window.removeEventListener('route:changed', this.handleRouteChange);
        this.unsubscribeFavorites?.();
        this.unsubscribeCart?.();
    }

    updateActiveTab(routeDetail) {
        const route = routeDetail || getCurrentRoute();
        const path = route?.path || window.location.hash.slice(1) || '/';
        if (path.startsWith('/products')) this.activeTab = 'buy';
        else if (path.startsWith('/product')) this.activeTab = 'buy';
        else if (path.startsWith('/search')) this.activeTab = 'buy';
        else this.activeTab = 'home';
    }

    handleNavClick(tab, path) {
        this.activeTab = tab;
        if (tab === 'favorites') {
            window.dispatchEvent(new CustomEvent('favorites:open'));
            return;
        }
        if (tab === 'cart') {
            window.dispatchEvent(new CustomEvent('cart:open'));
            return;
        }
        if (tab === 'deals') {
            navigate('/products/all');
            return;
        }
        navigate(path);
    }

    renderNavItem(id, icon, label, path, badgeCount = 0) {
        const isActiveTab = this.activeTab === id;
        return this.html`
            <button
                @click=${() => this.handleNavClick(id, path)}
                class="relative flex-1 flex flex-col items-center justify-center gap-0.5 py-1.5 touch-feedback transition-all"
            >
                <div class="relative px-3 py-1.5 rounded-xl transition-all ${isActiveTab ? 'bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/40 dark:to-pink-900/40' : ''}">
                    <i
                        data-lucide="${icon}"
                        class="w-5 h-5 transition-colors ${isActiveTab ? 'text-purple-600 dark:text-purple-400' : 'text-gray-400 dark:text-gray-500'}"
                        style="${isActiveTab ? 'stroke-width: 2.5' : 'stroke-width: 2'}"
                    ></i>
                    ${badgeCount > 0 ? this.html`
                        <span class="absolute -top-1 -right-1 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold shadow-sm">
                            ${badgeCount > 9 ? '9+' : badgeCount}
                        </span>
                    ` : ''}
                </div>
                <span class="text-[10px] font-semibold transition-colors ${isActiveTab ? 'text-purple-600 dark:text-purple-400' : 'text-gray-500 dark:text-gray-400'}">
                    ${label}
                </span>
            </button>
        `;
    }

    render() {
        return this.html`
            <nav class="fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-t border-gray-100 dark:border-gray-800 shadow-2xl z-30 transition-colors lg:hidden"
                 style="height: var(--bottom-nav-height);">
                <div class="flex items-center justify-around h-full px-1">
                    ${this.renderNavItem('home', 'home', 'Home', '/')}
                    ${this.renderNavItem('buy', 'shopping-bag', 'Shop', '/products/all')}
                    ${this.renderNavItem('favorites', 'heart', 'Wishlist', '/', this.favoritesCount)}
                    ${this.renderNavItem('cart', 'shopping-cart', 'Cart', '/', this.cartCount)}
                    ${this.renderNavItem('deals', 'percent', 'Deals', '/products/all')}
                </div>
            </nav>
        `;
    }
}

customElements.define('bottom-nav', BottomNav);
