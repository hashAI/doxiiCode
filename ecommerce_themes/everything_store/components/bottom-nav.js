import { BaseComponent } from './base-component.js';
import { navigate, getCurrentRoute } from '../assets/router.js';
import { cartStore } from '../assets/state.js';

class BottomNav extends BaseComponent {
    static properties = {
        activeTab: { type: String },
        cartCount: { type: Number }
    };

    constructor() {
        super();
        this.activeTab = 'home';
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

        this.unsubscribe = cartStore.subscribe((state) => {
            this.cartCount = state.count;
        });
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        window.removeEventListener('route:changed', this.handleRouteChange);
        this.unsubscribe?.();
    }

    updateActiveTab(routeDetail) {
        const route = routeDetail || getCurrentRoute();
        const path = route?.path || window.location.hash.slice(1) || '/';
        const querySection = route?.query?.section;

        if (querySection === 'trending' || path === '/trending') {
            this.activeTab = 'trending';
        } else if (path.includes('/products')) {
            this.activeTab = 'categories';
        } else if (path.includes('/search')) {
            this.activeTab = 'search';
        } else {
            this.activeTab = 'home';
        }
    }

    handleNavClick(tab, path) {
        this.activeTab = tab;
        if (tab === 'cart') {
            window.dispatchEvent(new CustomEvent('cart:open'));
        } else if (tab === 'categories') {
            // Show bottom sheet with categories
            window.dispatchEvent(new CustomEvent('categories:open'));
            this.activeTab = 'categories';
        } else if (tab === 'trending') {
            navigate('/trending', { section: 'trending' });
        } else {
            navigate(path);
        }
    }

    renderNavItem(id, icon, label, path) {
        const isActiveTab = this.activeTab === id;
        return this.html`
            <button
                @click=${() => this.handleNavClick(id, path)}
                class="relative flex-1 flex flex-col items-center justify-center gap-1 py-2 touch-feedback transition-all"
            >
                <div class="relative px-4 py-2 rounded-2xl transition-colors ${isActiveTab ? 'bg-primary-50 dark:bg-primary-900/30' : ''}">
                    <i
                        data-lucide="${icon}"
                        class="w-6 h-6 ${isActiveTab ? 'text-primary-600 dark:text-primary-400 stroke-[2.5]' : 'text-gray-400 dark:text-gray-500 stroke-[2]'}"
                    ></i>
                    ${id === 'cart' && this.cartCount > 0 ? this.html`
                        <span class="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                            ${this.cartCount}
                        </span>
                    ` : ''}
                </div>
                <span class="text-xs font-semibold ${isActiveTab ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400'}">
                    ${label}
                </span>
            </button>
        `;
    }

    render() {
        return this.html`
            <nav class="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-mobile z-30 transition-colors"
                 style="height: var(--bottom-nav-height);">
                <div class="flex items-center justify-around h-full px-2">
                    ${this.renderNavItem('home', 'home', 'Home', '/')}
                    ${this.renderNavItem('categories', 'grid-2x2', 'Categories', '')}
                    ${this.renderNavItem('trending', 'trending-up', 'Trending', '/')}
                    ${this.renderNavItem('cart', 'shopping-bag', 'Cart', '')}
                </div>
            </nav>
        `;
    }
}

customElements.define('bottom-nav', BottomNav);
