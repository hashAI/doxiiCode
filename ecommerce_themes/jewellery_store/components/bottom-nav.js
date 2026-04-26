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
                class="relative flex-1 flex flex-col items-center justify-center gap-1 py-2 touch-feedback transition-all"
            >
                <div class="relative px-4 py-1.5 rounded-2xl transition-all ${isActiveTab ? 'bg-gradient-to-r from-rose-100 to-rose-200 dark:from-rose-900/40 dark:to-rose-800/40 shadow-soft' : ''}">
                    <i
                        data-lucide="${icon}"
                        class="w-5 h-5 transition-colors ${isActiveTab ? 'text-rose-500 dark:text-rose-400' : 'text-sand-600 dark:text-stone-400'}"
                        style="${isActiveTab ? 'stroke-width: 2.5' : 'stroke-width: 2'}"
                    ></i>
                    ${badgeCount > 0 ? this.html`
                        <span class="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold shadow-rose">
                            ${badgeCount > 9 ? '9+' : badgeCount}
                        </span>
                    ` : ''}
                </div>
                <span class="text-[10px] font-semibold transition-colors ${isActiveTab ? 'text-rose-500 dark:text-rose-400' : 'text-sand-600 dark:text-stone-400'}">
                    ${label}
                </span>
            </button>
        `;
    }

    render() {
        return this.html`
            <nav class="fixed bottom-0 left-0 right-0 glass border-t border-sand-200/40 dark:border-stone-700/40 shadow-soft z-30 transition-colors lg:hidden"
                 style="height: var(--bottom-nav-height); padding-bottom: env(safe-area-inset-bottom);">
                <div class="flex items-center justify-around h-full px-1">
                    ${this.renderNavItem('home', 'home', 'Home', '/')}
                    ${this.renderNavItem('buy', 'gem', 'Shop', '/products/all')}
                    ${this.renderNavItem('favorites', 'heart', 'Wishlist', '/', this.favoritesCount)}
                    ${this.renderNavItem('cart', 'shopping-bag', 'Cart', '/', this.cartCount)}
                    ${this.renderNavItem('deals', 'sparkles', 'New', '/products/all')}
                </div>
            </nav>
        `;
    }
}

customElements.define('bottom-nav', BottomNav);
