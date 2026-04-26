import { BaseComponent } from './base-component.js';
import { userStore, cartStore, categoriesMeta, themeStore, shortlistStore } from '../assets/state.js';
import { EventBus } from '../assets/utils.js';

class AppHeader extends BaseComponent {
    static properties = {
        cartCount: { type: Number },
        wishlistCount: { type: Number },
        favoritesCount: { type: Number },
        location: { type: Object },
        isGoldMember: { type: Boolean },
        activeDropdown: { type: String },
        isMobileSearchOpen: { type: Boolean },
        isDark: { type: Boolean }
    };

    constructor() {
        super();
        this.cartCount = cartStore.getCount();
        this.wishlistCount = userStore.getWishlist().length;
        this.favoritesCount = 0;
        this.location = userStore.getLocation();
        this.isGoldMember = userStore.isGoldMember();
        this.activeDropdown = null;
        this.isMobileSearchOpen = false;
        this.isDark = themeStore.get() === 'dark';

        this.boundUpdate = () => this.updateCounts();
        EventBus.on('cart:updated', this.boundUpdate);
        EventBus.on('user:updated', this.boundUpdate);
        EventBus.on('theme:changed', (theme) => {
            this.isDark = theme === 'dark';
            this.requestUpdate();
        });
        this.unsubscribeFavorites = shortlistStore.subscribe(({ count }) => {
            this.favoritesCount = count;
            this.requestUpdate();
        });
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        EventBus.off('cart:updated', this.boundUpdate);
        EventBus.off('user:updated', this.boundUpdate);
        this.unsubscribeFavorites?.();
    }

    updateCounts() {
        this.cartCount = cartStore.getCount();
        this.wishlistCount = userStore.getWishlist().length;
        this.location = userStore.getLocation();
        this.isGoldMember = userStore.isGoldMember();
        this.requestUpdate();
    }

    openFavorites() {
        window.dispatchEvent(new CustomEvent('favorites:open'));
    }

    openLocationSelector() {
        const selector = document.querySelector('location-selector');
        if (selector) selector.open();
    }

    openMenu() {
        const menu = document.querySelector('side-menu');
        if (menu) menu.open();
    }

    openCart() {
        const cart = document.querySelector('cart-sidebar');
        if (cart) cart.open();
    }

    toggleTheme() {
        themeStore.toggle();
    }

    setActiveDropdown(name) {
        this.activeDropdown = this.activeDropdown === name ? null : name;
        this.requestUpdate();
    }

    closeDropdown() {
        this.activeDropdown = null;
        this.requestUpdate();
    }

    render() {
        const navCategories = [
            {
                id: 'eyeglasses',
                label: 'Eyeglasses',
                items: [
                    { label: 'Classic Eyeglasses', href: '#/products/eyeglasses' },
                    { label: 'Premium Eyeglasses', href: '#/products/eyeglasses?type=premium' },
                    { label: 'Computer Glasses', href: '#/products/eyeglasses?type=computer' },
                    { label: 'Reading Glasses', href: '#/products/eyeglasses?type=reading' }
                ]
            },
            {
                id: 'sunglasses',
                label: 'Sunglasses',
                items: [
                    { label: 'Wayfarer', href: '#/products/sunglasses?shape=wayfarer' },
                    { label: 'Aviator', href: '#/products/sunglasses?shape=aviator' },
                    { label: 'Cat Eye', href: '#/products/sunglasses?shape=cat-eye' },
                    { label: 'Sports', href: '#/products/sunglasses?type=sports' }
                ]
            },
            {
                id: 'contact-lenses',
                label: 'Contact Lenses',
                items: [
                    { label: 'Daily Disposable', href: '#/products/contact-lenses?type=daily' },
                    { label: 'Monthly', href: '#/products/contact-lenses?type=monthly' },
                    { label: 'Colored Lenses', href: '#/products/contact-lenses?type=colored' },
                    { label: 'Toric Lenses', href: '#/products/contact-lenses?type=toric' }
                ]
            },
            {
                id: 'accessories',
                label: 'Accessories',
                items: [
                    { label: 'Cases', href: '#/products/accessories?type=cases' },
                    { label: 'Lens Solutions', href: '#/products/accessories?type=solutions' },
                    { label: 'Cleaning Kits', href: '#/products/accessories?type=cleaning' }
                ]
            }
        ];

        return this.html`
            <!-- Mobile Header -->
            <header class="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white dark:bg-slate-900 shadow-nav">
                <!-- Top Bar -->
                <div class="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-slate-800">
                    <!-- Menu & Logo -->
                    <div class="flex items-center gap-3">
                        <button @click="${this.openMenu}" class="p-2 -ml-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl touch-feedback">
                            <i data-lucide="menu" class="w-5 h-5 text-navy-900 dark:text-white"></i>
                        </button>
                        <a href="#/" class="flex items-center gap-2">
                            <div class="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center">
                                <svg class="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <circle cx="8" cy="12" r="4"/>
                                    <circle cx="16" cy="12" r="4"/>
                                    <line x1="12" y1="12" x2="12" y2="12"/>
                                </svg>
                            </div>
                            <span class="font-display font-bold text-lg text-navy-900 dark:text-white">Store Name</span>
                        </a>
                    </div>

                    <!-- Actions -->
                    <div class="flex items-center gap-1">
                        ${this.isGoldMember ? this.html`
                            <div class="bg-gradient-to-r from-gold-400 to-gold-500 text-navy-900 text-xs font-bold px-2.5 py-1 rounded-full">
                                GOLD
                            </div>
                        ` : ''}
                        <button @click="${this.toggleTheme}" class="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl">
                            <i data-lucide="${this.isDark ? 'sun' : 'moon'}" class="w-5 h-5 text-navy-900 dark:text-white"></i>
                        </button>
                        <a href="#/search" class="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl">
                            <i data-lucide="search" class="w-5 h-5 text-navy-900 dark:text-white"></i>
                        </a>
                        <button @click="${this.openCart}" class="relative p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl">
                            <i data-lucide="shopping-bag" class="w-5 h-5 text-navy-900 dark:text-white"></i>
                            ${this.cartCount > 0 ? this.html`
                                <span class="absolute -top-0.5 -right-0.5 bg-brand-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                                    ${this.cartCount > 9 ? '9+' : this.cartCount}
                                </span>
                            ` : ''}
                        </button>
                    </div>
                </div>

                <!-- Location Bar -->
                <button @click="${this.openLocationSelector}" class="w-full flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-slate-800/50 border-b border-gray-100 dark:border-slate-800">
                    <i data-lucide="map-pin" class="w-4 h-4 text-brand-500"></i>
                    <span class="text-sm text-gray-600 dark:text-gray-400">Deliver to</span>
                    <span class="text-sm font-semibold text-navy-900 dark:text-white">${this.location?.label || 'Select Location'}</span>
                    <i data-lucide="chevron-down" class="w-4 h-4 text-gray-400 ml-auto"></i>
                </button>
            </header>

            <!-- Desktop Header -->
            <header class="hidden lg:block fixed top-0 left-0 right-0 z-50 bg-white dark:bg-slate-900 shadow-nav">
                <!-- Top Bar -->
                <div class="border-b border-gray-100 dark:border-slate-800">
                    <div class="container-desktop flex items-center justify-between py-2">
                        <!-- Left Info -->
                        <div class="flex items-center gap-6 text-sm">
                            <button @click="${this.openLocationSelector}" class="flex items-center gap-2 hover:text-brand-500 transition-colors">
                                <i data-lucide="map-pin" class="w-4 h-4 text-brand-500"></i>
                                <span class="text-gray-600 dark:text-gray-400">Deliver to:</span>
                                <span class="font-semibold text-navy-900 dark:text-white">${this.location?.label || 'Select Location'}</span>
                                <i data-lucide="chevron-down" class="w-3 h-3"></i>
                            </button>
                            <a href="tel:1800-000-0000" class="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-brand-500 transition-colors">
                                <i data-lucide="phone" class="w-4 h-4"></i>
                                <span>1800-000-0000</span>
                            </a>
                        </div>

                        <!-- Right Actions -->
                        <div class="flex items-center gap-4 text-sm">
                            ${this.isGoldMember ? this.html`
                                <div class="flex items-center gap-2">
                                    <div class="bg-gradient-to-r from-gold-400 to-gold-500 text-navy-900 text-xs font-bold px-3 py-1 rounded-full">
                                        GOLD MEMBER
                                    </div>
                                </div>
                            ` : this.html`
                                <a href="#/" class="text-gold-500 font-semibold hover:text-gold-600 transition-colors">Get GOLD Membership</a>
                            `}
                            <span class="text-gray-300 dark:text-gray-700">|</span>
                            <button @click="${this.toggleTheme}" class="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-brand-500 transition-colors">
                                <i data-lucide="${this.isDark ? 'sun' : 'moon'}" class="w-4 h-4"></i>
                                <span>${this.isDark ? 'Light Mode' : 'Dark Mode'}</span>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Main Navigation -->
                <div class="container-desktop flex items-center justify-between py-4">
                    <!-- Logo -->
                    <a href="#/" class="flex items-center gap-3 group">
                        <div class="w-10 h-10 bg-brand-500 rounded-xl flex items-center justify-center group-hover:bg-brand-600 transition-colors">
                            <svg class="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="8" cy="12" r="4"/>
                                <circle cx="16" cy="12" r="4"/>
                                <line x1="12" y1="12" x2="12" y2="12"/>
                            </svg>
                        </div>
                        <div>
                            <span class="font-display font-bold text-2xl text-navy-900 dark:text-white">Store Name</span>
                            <p class="text-xs text-gray-500 dark:text-gray-400 -mt-0.5">Eyewear for Everyone</p>
                        </div>
                    </a>

                    <!-- Search Bar -->
                    <a href="#/search" class="flex-1 max-w-xl mx-8 relative group">
                        <div class="flex items-center gap-3 bg-gray-100 dark:bg-slate-800 rounded-2xl px-5 py-3 border-2 border-transparent hover:border-brand-200 dark:hover:border-brand-800 focus-within:border-brand-500 transition-colors">
                            <i data-lucide="search" class="w-5 h-5 text-gray-400"></i>
                            <span class="flex-1 text-gray-500 dark:text-gray-400">Search for eyeglasses, sunglasses...</span>
                            <div class="flex items-center gap-2 text-xs text-gray-400">
                                <kbd class="px-2 py-1 bg-white dark:bg-slate-700 rounded border border-gray-200 dark:border-slate-600">Ctrl</kbd>
                                <kbd class="px-2 py-1 bg-white dark:bg-slate-700 rounded border border-gray-200 dark:border-slate-600">K</kbd>
                            </div>
                        </div>
                    </a>

                    <!-- Actions -->
                    <div class="flex items-center gap-2">
                        <button @click="${this.openFavorites}" class="relative flex items-center gap-2 px-4 py-2.5 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
                            <i data-lucide="heart" class="w-5 h-5 text-navy-900 dark:text-white"></i>
                            <span class="text-sm font-medium text-navy-900 dark:text-white">Wishlist</span>
                            ${this.favoritesCount > 0 ? this.html`
                                <span class="absolute top-1 left-6 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-bold">
                                    ${this.favoritesCount > 9 ? '9+' : this.favoritesCount}
                                </span>
                            ` : ''}
                        </button>
                        <button @click="${this.openCart}" class="relative flex items-center gap-2 px-4 py-2.5 bg-navy-900 dark:bg-brand-500 hover:bg-navy-800 dark:hover:bg-brand-600 text-white rounded-xl transition-colors">
                            <i data-lucide="shopping-bag" class="w-5 h-5"></i>
                            <span class="text-sm font-medium">Cart</span>
                            ${this.cartCount > 0 ? this.html`
                                <span class="bg-white text-navy-900 dark:text-brand-500 text-xs font-bold px-2 py-0.5 rounded-full">
                                    ${this.cartCount}
                                </span>
                            ` : ''}
                        </button>
                    </div>
                </div>

                <!-- Category Navigation -->
                <div class="border-t border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-800/30">
                    <nav class="container-desktop">
                        <ul class="flex items-center gap-1">
                            ${navCategories.map(cat => this.html`
                                <li class="relative group">
                                    <a
                                        href="#/products/${cat.id}"
                                        class="flex items-center gap-1.5 px-4 py-3 text-sm font-medium text-navy-900 dark:text-white hover:text-brand-500 transition-colors"
                                        @mouseenter="${() => this.setActiveDropdown(cat.id)}"
                                    >
                                        ${cat.label}
                                        <i data-lucide="chevron-down" class="w-3.5 h-3.5 transition-transform group-hover:rotate-180"></i>
                                    </a>

                                    <!-- Dropdown -->
                                    <div
                                        class="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200"
                                        @mouseleave="${() => this.closeDropdown()}"
                                    >
                                        <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-700 p-4 min-w-[220px]">
                                            ${cat.items.map(item => this.html`
                                                <a
                                                    href="${item.href}"
                                                    class="block px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-900/20 rounded-lg transition-colors"
                                                >
                                                    ${item.label}
                                                </a>
                                            `)}
                                            <div class="border-t border-gray-100 dark:border-slate-700 mt-2 pt-2">
                                                <a
                                                    href="#/products/${cat.id}"
                                                    class="block px-4 py-2.5 text-sm font-semibold text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-900/20 rounded-lg transition-colors"
                                                >
                                                    View All ${cat.label} →
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            `)}
                            <li class="ml-auto">
                                <a href="#/" class="flex items-center gap-2 px-4 py-2 bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 rounded-full text-sm font-semibold hover:bg-brand-100 dark:hover:bg-brand-900/50 transition-colors">
                                    <i data-lucide="sparkles" class="w-4 h-4"></i>
                                    Free Shipping on Orders $50+
                                </a>
                            </li>
                        </ul>
                    </nav>
                </div>
            </header>

            <!-- Spacer -->
            <div class="h-[108px] lg:h-[156px]"></div>
        `;
    }
}

customElements.define('app-header', AppHeader);
