import { BaseComponent } from './base-component.js';
import { navigate, isActive } from '../assets/router.js';
import { cartStore, shortlistStore, userStore } from '../assets/state.js';

class AppHeader extends BaseComponent {
    static properties = {
        cartCount: { type: Number },
        favoritesCount: { type: Number },
        location: { type: String },
        scrolled: { type: Boolean }
    };

    constructor() {
        super();
        this.cartCount = 0;
        this.favoritesCount = 0;
        this.location = 'Select Location';
        this.scrolled = false;
        this.unsubscribeCart = null;
        this.unsubscribeFavorites = null;
        this.unsubscribeUser = null;
    }

    connectedCallback() {
        super.connectedCallback();
        this.unsubscribeCart = cartStore.subscribe((state) => {
            this.cartCount = state.count;
        });
        this.unsubscribeFavorites = shortlistStore.subscribe((state) => {
            this.favoritesCount = state.count;
        });
        this.unsubscribeUser = userStore.subscribe((state) => {
            this.location = state.location || 'Select Location';
        });

        window.addEventListener('scroll', this.handleScroll.bind(this));
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        this.unsubscribeCart?.();
        this.unsubscribeFavorites?.();
        this.unsubscribeUser?.();
        window.removeEventListener('scroll', this.handleScroll.bind(this));
    }

    handleScroll() {
        this.scrolled = window.scrollY > 10;
    }

    navigateTo(path) {
        navigate(path);
        this.closeMenu();
    }

    openMenu() {
        window.dispatchEvent(new CustomEvent('menu:open'));
    }

    closeMenu() {
        window.dispatchEvent(new CustomEvent('menu:close'));
    }

    openSearch() {
        window.dispatchEvent(new CustomEvent('search:open'));
    }

    openCart() {
        window.dispatchEvent(new CustomEvent('cart:open'));
    }

    openLocation() {
        window.dispatchEvent(new CustomEvent('open-location-selector'));
    }

    openFavorites() {
        window.dispatchEvent(new CustomEvent('favorites:open'));
    }

    render() {
        return this.html`
            <!-- Apple Header -->
            <header class="sticky top-0 z-40 transition-all duration-300 ${this.scrolled ? 'bg-white/80 backdrop-blur-xl shadow-sm' : 'bg-white/95 backdrop-blur-md'}">
                <!-- Navigation Bar -->
                <nav class="max-w-[980px] mx-auto px-4 lg:px-0">
                    <div class="flex items-center justify-between h-12">
                        <!-- Apple Logo -->
                        <button @click=${() => this.navigateTo('/')} class="text-apple-gray hover:text-black transition-colors p-2 -ml-2">
                            <svg class="w-[18px] h-[18px]" viewBox="0 0 18 44" fill="currentColor">
                                <path d="M15.462 16.593c-.036-3.387 2.768-5.012 2.893-5.088-1.574-2.304-4.027-2.62-4.9-2.655-2.085-.212-4.073 1.23-5.134 1.23-1.06 0-2.7-1.199-4.439-1.167-2.284.033-4.39 1.33-5.566 3.378-2.373 4.12-.607 10.23 1.704 13.578 1.13 1.638 2.476 3.48 4.245 3.414 1.703-.068 2.347-1.103 4.407-1.103 2.06 0 2.638 1.103 4.44 1.068 1.834-.03 2.99-1.669 4.112-3.313 1.297-1.9 1.83-3.742 1.862-3.837-.04-.017-3.572-1.37-3.608-5.44z"/>
                                <path d="M12.025 5.715c.94-1.14 1.575-2.724 1.402-4.3-1.354.054-2.996.902-3.968 2.04-.87 1.007-1.633 2.617-1.428 4.16 1.51.117 3.052-.768 3.994-1.9z"/>
                            </svg>
                        </button>

                        <!-- Desktop Navigation Links -->
                        <div class="hidden lg:flex items-center gap-7">
                            ${[
                                { name: 'Store', path: '/products/all' },
                                { name: 'Mac', path: '/products/Mac' },
                                { name: 'iPad', path: '/products/iPad' },
                                { name: 'iPhone', path: '/products/iPhone' },
                                { name: 'Watch', path: '/products/Watch' },
                                { name: 'Vision', path: '/products/Vision' },
                                { name: 'AirPods', path: '/products/AirPods' },
                                { name: 'TV & Home', path: '/products/Accessories' },
                                { name: 'Entertainment', path: '#entertainment' },
                                { name: 'Accessories', path: '/products/Accessories' },
                                { name: 'Support', path: '#support' }
                            ].map(item => this.html`
                                <button
                                    @click=${() => this.navigateTo(item.path)}
                                    class="text-xs text-apple-gray/80 hover:text-apple-gray transition-colors ${isActive(item.path) ? 'text-apple-gray' : ''}">
                                    ${item.name}
                                </button>
                            `)}
                        </div>

                        <!-- Right Icons -->
                        <div class="flex items-center gap-2 lg:gap-4">
                            <!-- Location -->
                            <button @click=${this.openLocation} class="text-apple-gray/80 hover:text-apple-gray transition-colors p-2 relative" title="${this.location}">
                                <i data-lucide="map-pin" class="w-[18px] h-[18px]"></i>
                            </button>

                            <!-- Favorites -->
                            <button @click=${this.openFavorites} class="text-apple-gray/80 hover:text-apple-gray transition-colors p-2 relative">
                                <i data-lucide="heart" class="w-[18px] h-[18px]"></i>
                                ${this.favoritesCount > 0 ? this.html`
                                    <span class="absolute -top-0.5 -right-0.5 bg-apple-blue text-white text-[9px] font-semibold rounded-full w-4 h-4 flex items-center justify-center">
                                        ${this.favoritesCount > 9 ? '9+' : this.favoritesCount}
                                    </span>
                                ` : ''}
                            </button>

                            <!-- Theme Toggle -->
                            <theme-toggle></theme-toggle>

                            <!-- Search -->
                            <button @click=${this.openSearch} class="text-apple-gray/80 hover:text-apple-gray transition-colors p-2">
                                <svg class="w-[18px] h-[18px]" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
                                    <circle cx="7.5" cy="7.5" r="6"/>
                                    <path d="M12 12l4.5 4.5"/>
                                </svg>
                            </button>

                            <!-- Cart/Bag -->
                            <button @click=${this.openCart} class="text-apple-gray/80 hover:text-apple-gray transition-colors p-2 relative">
                                <svg class="w-[18px] h-[18px]" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.5">
                                    <path d="M4.5 5L5.25 14.25C5.3 14.7 5.7 15 6.15 15h5.7c.45 0 .85-.3.9-.75L13.5 5"/>
                                    <path d="M3 5h12"/>
                                    <path d="M6.75 5V3.75a2.25 2.25 0 014.5 0V5"/>
                                </svg>
                                ${this.cartCount > 0 ? this.html`
                                    <span class="absolute -top-0.5 -right-0.5 bg-apple-blue text-white text-[9px] font-semibold rounded-full w-4 h-4 flex items-center justify-center">
                                        ${this.cartCount}
                                    </span>
                                ` : ''}
                            </button>

                            <!-- Mobile Menu Toggle -->
                            <button @click=${this.openMenu} class="lg:hidden text-apple-gray/80 hover:text-apple-gray transition-colors p-2 -mr-2">
                                <svg class="w-[18px] h-[18px]" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
                                    <path d="M2 5h14"/>
                                    <path d="M2 9h14"/>
                                    <path d="M2 13h14"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                </nav>

                <!-- Promo Banner -->
                <div class="bg-apple-lightgray border-t border-gray-200/50">
                    <div class="max-w-[980px] mx-auto px-4 lg:px-0">
                        <p class="py-3 text-center text-sm text-apple-gray">
                            Order by 12/22 for free delivery of in-stock items by 12/24. See checkout for specific delivery dates and options.
                            <button class="text-apple-blue hover:underline ml-1" @click=${() => this.navigateTo('/products/all')}>Shop ›</button>
                        </p>
                    </div>
                </div>
            </header>
        `;
    }
}

customElements.define('app-header', AppHeader);
