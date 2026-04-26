/**
 * Bottom Navigation Bar Component
 * - iOS/Android style bottom tab bar for mobile
 * - Quick access to main sections
 * - Active state indicators
 */

import { BaseComponent } from './base-component.js';
import { cartStore } from '../assets/state.js';
import { navigate, isActive } from '../assets/router.js';
import { toggleDrawer } from '../assets/utils.js';

class EcomBottomNav extends BaseComponent {
    static properties = {
        cartCount: { type: Number },
        currentPath: { type: String }
    };

    constructor() {
        super();
        this.cartCount = 0;
        this.currentPath = window.location.hash.slice(1) || '/';
        this.unsubscribe = null;
    }

    connectedCallback() {
        super.connectedCallback();

        // Subscribe to cart changes
        this.unsubscribe = cartStore.subscribe((state) => {
            this.cartCount = state.count;
        });

        // Listen for route changes
        window.addEventListener('hashchange', this.handleRouteChange);

        // Initial cart count
        this.cartCount = cartStore.getCount();
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        if (this.unsubscribe) this.unsubscribe();
        window.removeEventListener('hashchange', this.handleRouteChange);
    }

    handleRouteChange = () => {
        this.currentPath = window.location.hash.slice(1) || '/';
    };

    handleNavClick(path, e) {
        e.preventDefault();
        navigate(path);
    }

    handleCartClick(e) {
        e.preventDefault();
        toggleDrawer('cart-drawer');
    }

    handleMenuClick(e) {
        e.preventDefault();
        toggleDrawer('mobile-menu');
    }

    getNavItems() {
        const path = this.currentPath;
        
        // Home page navigation
        if (path === '/' || (!path.includes('/catalog') && !path.includes('/product') && !path.includes('/cart'))) {
            return [
                { icon: 'home', label: 'Home', path: '/', active: true },
                { icon: 'layout-grid', label: 'Under ₹999', path: '/catalog?price=under-999', active: false },
                { icon: 'sparkles', label: 'Beauty', path: '/catalog?category=beauty', active: false },
                { icon: 'user', label: 'Profile', path: '/about', active: false }
            ];
        }
        
        // Catalog/Product pages navigation
        if (path.includes('/catalog') || path.includes('/product')) {
            return [
                { icon: 'home', label: 'Home', path: '/', active: false },
                { icon: 'layout-grid', label: 'Categories', path: '/catalog', active: path.includes('/catalog') },
                { icon: 'sliders', label: 'Filter', action: 'filter', active: false },
                { icon: 'arrow-up-down', label: 'Sort', action: 'sort', active: false }
            ];
        }
        
        // Cart page navigation  
        if (path.includes('/cart') || path.includes('/checkout')) {
            return [
                { icon: 'home', label: 'Home', path: '/', active: false },
                { icon: 'shopping-bag', label: 'Shop', path: '/catalog', active: false },
                { icon: 'shopping-cart', label: 'Bag', path: '/cart', active: true },
                { icon: 'user', label: 'Profile', path: '/about', active: false }
            ];
        }
        
        // Default navigation
        return [
            { icon: 'home', label: 'Home', path: '/', active: false },
            { icon: 'shopping-bag', label: 'Shop', path: '/catalog', active: false },
            { icon: 'shopping-cart', label: 'Bag', path: '/cart', active: false },
            { icon: 'user', label: 'Profile', path: '/about', active: false }
        ];
    }

    handleItemClick(item, e) {
        e.preventDefault();
        
        if (item.action === 'filter') {
            // Dispatch filter event
            window.dispatchEvent(new CustomEvent('show-filters'));
        } else if (item.action === 'sort') {
            // Dispatch sort event
            window.dispatchEvent(new CustomEvent('show-sort'));
        } else if (item.path) {
            navigate(item.path);
        }
    }

    render() {
        const navItems = this.getNavItems();
        
        return this.html`
            <nav class="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 safe-bottom">
                <div class="flex items-center justify-around h-16">
                    ${navItems.map(item => this.html`
                        <a
                            href="${item.path ? `#${item.path}` : '#'}"
                            @click="${(e) => this.handleItemClick(item, e)}"
                            class="bottom-nav-item ${item.active ? 'active' : ''}"
                        >
                            <div class="bottom-nav-icon ${item.active ? 'text-gray-900 dark:text-white' : ''}">
                                ${item.label === 'Bag' && this.cartCount > 0 ? this.html`
                                    <div class="relative">
                                        <i data-lucide="${item.icon}" width="24" height="24"></i>
                                        <span class="absolute -top-2 -right-2 w-5 h-5 bg-red-600 dark:bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                                            ${this.cartCount > 9 ? '9+' : this.cartCount}
                                        </span>
                                    </div>
                                ` : this.html`
                                    <i data-lucide="${item.icon}" width="24" height="24"></i>
                                `}
                            </div>
                            <span class="bottom-nav-label ${item.active ? 'text-gray-900 dark:text-white font-semibold' : ''}">${item.label}</span>
                        </a>
                    `)}
                </div>
            </nav>

            <style>
                /* Safe area for iPhone notch */
                .safe-bottom {
                    padding-bottom: env(safe-area-inset-bottom);
                }

                .bottom-nav-item {
                    @apply relative flex flex-col items-center justify-center flex-1 h-full text-gray-600 dark:text-gray-400 transition-all;
                }

                .bottom-nav-item.active {
                    @apply text-gray-900 dark:text-white;
                }

                .bottom-nav-icon {
                    @apply mb-1 transition-all;
                }

                .bottom-nav-item:active .bottom-nav-icon {
                    @apply scale-90;
                }

                .bottom-nav-label {
                    @apply text-xs;
                }
            </style>
        `;
    }
}

customElements.define('ecom-bottom-nav', EcomBottomNav);
