import { BaseComponent } from './base-component.js';
import { cartStore, preferencesStore, eventBus, shortlistStore, userStore } from '../assets/state.js';

class SiteHeader extends BaseComponent {
    static properties = {
        mobileOpen: { state: true },
        cartCount: { state: true },
        favoritesCount: { state: true },
        location: { state: true },
        theme: { state: true },
        showCategoriesMenu: { state: true },
        searchFocused: { state: true },
        searchQuery: { state: true },
        showMobileSearch: { state: true }
    };

    constructor() {
        super();
        this.mobileOpen = false;
        this.cartCount = 0;
        this.favoritesCount = 0;
        this.location = 'Select Location';
        this.theme = preferencesStore.get('theme') || 'light';
        this.showCategoriesMenu = false;
        this.searchFocused = false;
        this.searchQuery = '';
        this.showMobileSearch = false;
    }

    connectedCallback() {
        super.connectedCallback?.();
        this.unsubscribeCart = cartStore.subscribe(({ count }) => {
            this.cartCount = count;
        });
        this.unsubscribeFavorites = shortlistStore.subscribe(({ count }) => {
            this.favoritesCount = count;
        });
        this.unsubscribeUser = userStore.subscribe((state) => {
            this.location = state.location || 'Select Location';
        });
        this.unsubscribePrefs = preferencesStore.subscribe(({ theme }) => {
            this.theme = theme;
            document.documentElement.classList.toggle('dark', theme === 'dark');
        });

        // Close menus when clicking outside
        this.handleClickOutside = (e) => {
            if (this.showCategoriesMenu && !e.target.closest('.categories-menu-container')) {
                this.showCategoriesMenu = false;
            }
        };
        document.addEventListener('click', this.handleClickOutside);
    }

    disconnectedCallback() {
        this.unsubscribeCart?.();
        this.unsubscribeFavorites?.();
        this.unsubscribeUser?.();
        this.unsubscribePrefs?.();
        document.body.classList.remove('overflow-hidden');
        document.removeEventListener('click', this.handleClickOutside);
    }

    toggleMobile() {
        this.mobileOpen = !this.mobileOpen;
        document.body.classList.toggle('overflow-hidden', this.mobileOpen);
    }

    toggleTheme() {
        const next = this.theme === 'dark' ? 'light' : 'dark';
        preferencesStore.set('theme', next);
    }

    openCart() {
        eventBus.emit('cart:toggle');
    }

    openLocation() {
        window.dispatchEvent(new CustomEvent('open-location-selector'));
    }

    openFavorites() {
        window.dispatchEvent(new CustomEvent('favorites:open'));
    }

    navigateTo(path) {
        window.location.hash = path;
        this.mobileOpen = false;
        this.showCategoriesMenu = false;
        this.showMobileSearch = false;
        document.body.classList.remove('overflow-hidden');
    }

    handleSearch(e) {
        e.preventDefault();
        if (this.searchQuery.trim()) {
            window.location.hash = `/products/all?search=${encodeURIComponent(this.searchQuery.trim())}`;
            this.searchQuery = '';
            this.showMobileSearch = false;
        }
    }

    toggleMobileSearch() {
        this.showMobileSearch = !this.showMobileSearch;
        if (this.showMobileSearch) {
            setTimeout(() => {
                const input = this.shadowRoot?.querySelector('.mobile-search-input') ||
                             document.querySelector('.mobile-search-input');
                input?.focus();
            }, 100);
        }
    }

    get categories() {
        return [
            { name: 'Laptops', icon: 'laptop', path: '/products/all?category=Laptops' },
            { name: 'Smartphones', icon: 'smartphone', path: '/products/all?category=Smartphones' },
            { name: 'Audio', icon: 'headphones', path: '/products/all?category=Audio' },
            { name: 'Wearables', icon: 'watch', path: '/products/all?category=Wearables' },
            { name: 'Cameras', icon: 'camera', path: '/products/all?category=Cameras' },
            { name: 'Gaming', icon: 'gamepad-2', path: '/products/all?category=Gaming' },
            { name: 'Accessories', icon: 'cable', path: '/products/all?category=Accessories' },
            { name: 'Smart Home', icon: 'home', path: '/products/all?category=Smart Home' }
        ];
    }

    render() {
        return this.html`
            <header class="sticky top-0 z-50 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm">
                <!-- Top Banner -->
                <div class="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center py-2 px-4 text-xs sm:text-sm">
                    <span class="font-medium">Free Shipping on Orders Over $99</span>
                    <span class="hidden sm:inline mx-2">•</span>
                    <span class="hidden sm:inline">Extended Holiday Returns</span>
                </div>

                <!-- Main Header -->
                <div class="mx-auto max-w-7xl px-4">
                    <div class="flex items-center justify-between h-16">
                        <!-- Logo -->
                        <div class="flex items-center gap-6">
                            <button class="lg:hidden p-2 -ml-2 active:scale-95 transition" aria-label="Toggle menu" @click=${() => this.toggleMobile()}>
                                <i data-lucide="${this.mobileOpen ? 'x' : 'menu'}" class="w-6 h-6"></i>
                            </button>
                            <a href="#/" class="flex items-center gap-2 font-bold text-xl">
                                <i data-lucide="zap" class="w-6 h-6 text-blue-600"></i>
                                <span class="hidden sm:inline">TechVault</span>
                            </a>
                        </div>

                        <!-- Desktop Navigation -->
                        <nav class="hidden lg:flex items-center gap-1">
                            <div class="relative categories-menu-container">
                                <button
                                    class="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition font-medium"
                                    @click=${(e) => { e.stopPropagation(); this.showCategoriesMenu = !this.showCategoriesMenu; }}
                                >
                                    <i data-lucide="grid-3x3" class="w-4 h-4"></i>
                                    Categories
                                    <i data-lucide="chevron-down" class="w-4 h-4"></i>
                                </button>

                                <!-- Mega Menu Dropdown -->
                                ${this.showCategoriesMenu ? this.html`
                                    <div class="absolute top-full left-0 mt-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl p-4 w-[480px] grid grid-cols-2 gap-2 z-50">
                                        ${this.categories.map(cat => this.html`
                                            <button
                                                class="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition text-left"
                                                @click=${() => this.navigateTo(cat.path)}
                                            >
                                                <div class="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                                    <i data-lucide="${cat.icon}" class="w-5 h-5 text-blue-600 dark:text-blue-400"></i>
                                                </div>
                                                <span class="font-medium">${cat.name}</span>
                                            </button>
                                        `)}
                                    </div>
                                ` : ''}
                            </div>

                            <button
                                class="px-4 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition font-medium"
                                @click=${() => this.navigateTo('/products/all')}
                            >
                                All Products
                            </button>

                            <button
                                class="px-4 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition font-medium text-blue-600 dark:text-blue-400"
                            >
                                Deals
                            </button>
                        </nav>

                        <!-- Search Bar (Desktop) -->
                        <div class="hidden lg:block flex-1 max-w-md mx-6">
                            <form @submit=${(e) => this.handleSearch(e)}>
                                <div class="relative">
                                    <i data-lucide="search" class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"></i>
                                    <input
                                        type="text"
                                        placeholder="Search products..."
                                        class="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border border-transparent focus:border-blue-600 rounded-lg outline-none transition"
                                        .value=${this.searchQuery}
                                        @input=${(e) => this.searchQuery = e.target.value}
                                        @focus=${() => this.searchFocused = true}
                                        @blur=${() => this.searchFocused = false}
                                    >
                                </div>
                            </form>
                        </div>

                        <!-- Right Actions -->
                        <div class="flex items-center gap-2">
                            <button
                                aria-label="Search"
                                class="lg:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-95 transition"
                                @click=${() => this.toggleMobileSearch()}
                            >
                                <i data-lucide="search" class="w-5 h-5"></i>
                            </button>

                            <button
                                aria-label="Location"
                                class="hidden sm:block p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-95 transition"
                                @click=${() => this.openLocation()}
                                title="${this.location}"
                            >
                                <i data-lucide="map-pin" class="w-5 h-5"></i>
                            </button>

                            <button
                                aria-label="Favorites"
                                class="hidden sm:block p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-95 transition relative"
                                @click=${() => this.openFavorites()}
                            >
                                <i data-lucide="heart" class="w-5 h-5"></i>
                                ${this.favoritesCount > 0 ? this.html`
                                    <span class="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center font-bold">
                                        ${this.favoritesCount > 9 ? '9+' : this.favoritesCount}
                                    </span>
                                ` : ''}
                            </button>

                            <button
                                aria-label="Toggle theme"
                                class="hidden sm:block p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-95 transition"
                                @click=${() => this.toggleTheme()}
                            >
                                <i data-lucide=${this.theme === 'dark' ? 'sun' : 'moon'} class="w-5 h-5"></i>
                            </button>

                            <button
                                aria-label="Account"
                                class="hidden sm:block p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-95 transition"
                            >
                                <i data-lucide="user" class="w-5 h-5"></i>
                            </button>

                            <button
                                class="relative p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-95 transition"
                                @click=${() => this.openCart()}
                                aria-label="Open cart"
                            >
                                <i data-lucide="shopping-cart" class="w-5 h-5"></i>
                                ${this.cartCount > 0 ? this.html`
                                    <span class="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center font-bold">
                                        ${this.cartCount}
                                    </span>
                                ` : ''}
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Mobile Search Bar -->
                ${this.showMobileSearch ? this.html`
                    <div class="lg:hidden border-t border-slate-200 dark:border-slate-800 p-4 bg-white dark:bg-slate-900 animate-slideDown">
                        <form @submit=${(e) => this.handleSearch(e)}>
                            <div class="relative">
                                <i data-lucide="search" class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"></i>
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    class="mobile-search-input w-full pl-10 pr-4 py-3 bg-slate-100 dark:bg-slate-800 rounded-lg outline-none text-base"
                                    .value=${this.searchQuery}
                                    @input=${(e) => this.searchQuery = e.target.value}
                                >
                            </div>
                        </form>
                    </div>
                ` : ''}

                ${this.mobileMenuTemplate()}
            </header>

            <style>
                @keyframes slideDown {
                    from {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-slideDown {
                    animation: slideDown 0.2s ease-out;
                }
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            </style>
        `;
    }

    mobileMenuTemplate() {
        if (!this.mobileOpen) return '';

        return this.html`
            <div class="lg:hidden fixed left-0 right-0 bg-white dark:bg-slate-900 z-40 overflow-y-auto" style="top: ${this.showMobileSearch ? '152px' : '104px'}; bottom: 0;">
                <div class="p-6 space-y-6 pb-safe">
                    <!-- Categories -->
                    <div>
                        <h3 class="text-xs uppercase tracking-wider text-slate-400 mb-4 font-semibold">Categories</h3>
                        <div class="grid grid-cols-2 gap-3">
                            ${this.categories.map(cat => this.html`
                                <button
                                    class="flex flex-col items-center gap-2 p-4 rounded-xl bg-slate-50 dark:bg-slate-800 active:scale-95 transition-transform touch-manipulation"
                                    @click=${() => this.navigateTo(cat.path)}
                                >
                                    <div class="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                        <i data-lucide="${cat.icon}" class="w-6 h-6 text-blue-600 dark:text-blue-400"></i>
                                    </div>
                                    <span class="text-sm font-medium">${cat.name}</span>
                                </button>
                            `)}
                        </div>
                    </div>

                    <!-- Quick Links -->
                    <div>
                        <h3 class="text-xs uppercase tracking-wider text-slate-400 mb-4 font-semibold">Quick Links</h3>
                        <div class="space-y-2">
                            <button
                                class="w-full flex items-center justify-between p-4 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 active:scale-[0.98] transition-transform touch-manipulation"
                                @click=${() => this.navigateTo('/products/all')}
                            >
                                <span class="font-medium">All Products</span>
                                <i data-lucide="chevron-right" class="w-5 h-5"></i>
                            </button>
                            <button class="w-full flex items-center justify-between p-4 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 active:scale-[0.98] transition-transform touch-manipulation">
                                <span class="font-medium text-blue-600 dark:text-blue-400">Deals & Offers</span>
                                <i data-lucide="chevron-right" class="w-5 h-5 text-blue-600 dark:text-blue-400"></i>
                            </button>
                        </div>
                    </div>

                    <!-- Settings -->
                    <div class="pt-6 border-t border-slate-200 dark:border-slate-800 space-y-2">
                        <button
                            class="w-full flex items-center justify-between p-4 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 active:scale-[0.98] transition-transform touch-manipulation"
                            @click=${() => { this.openLocation(); this.mobileOpen = false; }}
                        >
                            <span class="flex items-center gap-3">
                                <i data-lucide="map-pin" class="w-5 h-5"></i>
                                <span>Location</span>
                            </span>
                            <span class="text-xs text-slate-400">${this.location}</span>
                        </button>
                        <button
                            class="w-full flex items-center justify-between p-4 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 active:scale-[0.98] transition-transform touch-manipulation"
                            @click=${() => { this.openFavorites(); this.mobileOpen = false; }}
                        >
                            <span class="flex items-center gap-3">
                                <i data-lucide="heart" class="w-5 h-5"></i>
                                <span>Favorites</span>
                            </span>
                            ${this.favoritesCount > 0 ? this.html`<span class="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full">${this.favoritesCount}</span>` : ''}
                        </button>
                        <button
                            class="w-full flex items-center justify-between p-4 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 active:scale-[0.98] transition-transform touch-manipulation"
                            @click=${() => this.toggleTheme()}
                        >
                            <span class="flex items-center gap-3">
                                <i data-lucide=${this.theme === 'dark' ? 'sun' : 'moon'} class="w-5 h-5"></i>
                                <span>${this.theme === 'dark' ? 'Light' : 'Dark'} Mode</span>
                            </span>
                        </button>
                        <button class="w-full flex items-center justify-between p-4 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 active:scale-[0.98] transition-transform touch-manipulation">
                            <span class="flex items-center gap-3">
                                <i data-lucide="user" class="w-5 h-5"></i>
                                <span>My Account</span>
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }
}

customElements.define('site-header', SiteHeader);
