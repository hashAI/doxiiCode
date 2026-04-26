/**
 * Header Search Bar - E-commerce header with prominent search functionality
 * Features: Search bar, category dropdown, cart with item count, wishlist, mobile menu
 *
 * @element header-search-bar
 * @fires nav-click - When a navigation item is clicked
 * @fires search - When search is performed
 * @fires cart-click - When cart is clicked
 * @fires wishlist-click - When wishlist is clicked
 * @fires category-click - When category is clicked
 * @fires menu-toggle - When mobile menu is toggled
 * @fires theme-changed - When theme is toggled
 */

import { BaseComponent } from '../../base-component.js';
import { html } from 'https://cdn.jsdelivr.net/npm/lit@3.2.1/+esm';

export class HeaderSearchBar extends BaseComponent {
    static properties = {
        theme: { type: String },
        mobileMenuOpen: { type: Boolean },
        searchQuery: { type: String },
        selectedCategory: { type: String },
        config: { type: Object }
    };

    constructor() {
        super();
        this.theme = 'light';
        this.mobileMenuOpen = false;
        this.searchQuery = '';
        this.selectedCategory = 'all';

        this.config = {
            brandName: 'MarketHub',
            navigation: [
                { label: 'Deals', href: '/deals' },
                { label: 'New Arrivals', href: '/new' },
                { label: 'Best Sellers', href: '/bestsellers' },
                { label: 'Categories', href: '/categories' }
            ],
            categories: [
                { label: 'All Categories', value: 'all' },
                { label: 'Electronics', value: 'electronics' },
                { label: 'Fashion', value: 'fashion' },
                { label: 'Home & Living', value: 'home' },
                { label: 'Sports', value: 'sports' },
                { label: 'Beauty', value: 'beauty' }
            ],
            cart: {
                itemCount: 0
            },
            wishlist: {
                itemCount: 0
            },
            user: {
                isLoggedIn: false,
                name: ''
            }
        };
    }

    connectedCallback() {
        super.connectedCallback();
        this._initLucide();
        this._loadFont();
    }

    updated(changedProperties) {
        super.updated(changedProperties);
        if (changedProperties.has('theme') || changedProperties.has('mobileMenuOpen')) {
            this._initLucide();
        }
    }

    _loadFont() {
        if (!document.querySelector('link[href*="Poppins"]')) {
            const link = document.createElement('link');
            link.href = 'https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap';
            link.rel = 'stylesheet';
            document.head.appendChild(link);
        }
    }

    _initLucide() {
        if (window.lucide) {
            setTimeout(() => {
                window.lucide.createIcons();
            }, 0);
        } else {
            const script = document.createElement('script');
            script.src = 'https://unpkg.com/lucide@latest';
            script.onload = () => {
                setTimeout(() => {
                    window.lucide.createIcons();
                }, 0);
            };
            document.head.appendChild(script);
        }
    }

    toggleMobileMenu() {
        this.mobileMenuOpen = !this.mobileMenuOpen;
        this.emit('menu-toggle', { open: this.mobileMenuOpen });
    }

    handleNavClick(item) {
        this.emit('nav-click', { item });
    }

    handleSearch(e) {
        e.preventDefault();
        this.emit('search', { query: this.searchQuery, category: this.selectedCategory });
    }

    handleSearchInput(e) {
        this.searchQuery = e.target.value;
    }

    handleCategoryChange(e) {
        this.selectedCategory = e.target.value;
        this.emit('category-click', { category: this.selectedCategory });
    }

    handleCartClick() {
        this.emit('cart-click', {});
    }

    handleWishlistClick() {
        this.emit('wishlist-click', {});
    }

    toggleTheme() {
        this.theme = this.theme === 'light' ? 'dark' : 'light';
        this.emit('theme-changed', { theme: this.theme });
    }

    render() {
        const isDark = this.theme === 'dark';

        return html`
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');

                header-search-bar * {
                    font-family: 'Poppins', sans-serif;
                }
            </style>

            <header class="w-full ${isDark ? 'bg-slate-900 text-white' : 'bg-white text-slate-800'} border-b ${isDark ? 'border-slate-700' : 'border-slate-200'}">
                <!-- Top Bar -->
                <div class="w-full py-3 px-4 md:px-8 flex items-center justify-between gap-4">
                    <!-- Logo -->
                    <a href="/" class="font-bold text-xl md:text-2xl ${isDark ? 'text-indigo-400' : 'text-indigo-600'} whitespace-nowrap">
                        ${this.config.brandName}
                    </a>

                    <!-- Search Bar (Desktop) -->
                    <form @submit=${this.handleSearch} class="hidden md:flex items-center flex-1 max-w-2xl mx-4">
                        <select
                            @change=${this.handleCategoryChange}
                            class="px-3 py-2.5 ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-800'} border-r-0 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            ${this.config.categories.map(cat => html`
                                <option value="${cat.value}" ?selected=${this.selectedCategory === cat.value}>
                                    ${cat.label}
                                </option>
                            `)}
                        </select>
                        <input
                            type="text"
                            placeholder="Search products..."
                            .value=${this.searchQuery}
                            @input=${this.handleSearchInput}
                            class="flex-1 px-4 py-2.5 ${isDark ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-400' : 'bg-slate-50 border-slate-300 text-slate-800 placeholder-slate-500'} border-l border-y focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <button
                            type="submit"
                            class="px-6 py-2.5 ${isDark ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-indigo-600 hover:bg-indigo-700'} text-white rounded-r-lg transition"
                        >
                            <i data-lucide="search" class="w-5 h-5"></i>
                        </button>
                    </form>

                    <!-- Right Icons -->
                    <div class="flex items-center gap-2 md:gap-4">
                        <!-- Wishlist -->
                        <button
                            @click=${this.handleWishlistClick}
                            class="relative p-2 hover:${isDark ? 'bg-slate-800' : 'bg-slate-100'} rounded-lg transition hidden md:block"
                            aria-label="Wishlist"
                        >
                            <i data-lucide="heart" class="w-5 h-5"></i>
                            ${this.config.wishlist.itemCount > 0 ? html`
                                <span class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                    ${this.config.wishlist.itemCount}
                                </span>
                            ` : ''}
                        </button>

                        <!-- Cart -->
                        <button
                            @click=${this.handleCartClick}
                            class="relative p-2 hover:${isDark ? 'bg-slate-800' : 'bg-slate-100'} rounded-lg transition"
                            aria-label="Shopping cart"
                        >
                            <i data-lucide="shopping-cart" class="w-5 h-5"></i>
                            ${this.config.cart.itemCount > 0 ? html`
                                <span class="absolute -top-1 -right-1 ${isDark ? 'bg-indigo-600' : 'bg-indigo-600'} text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                    ${this.config.cart.itemCount}
                                </span>
                            ` : ''}
                        </button>

                        <!-- Theme Toggle (Desktop) -->
                        <button
                            @click=${() => this.toggleTheme()}
                            class="hidden md:block p-2 hover:${isDark ? 'bg-slate-800' : 'bg-slate-100'} rounded-lg transition"
                            aria-label="Toggle theme"
                        >
                            <i data-lucide="${isDark ? 'sun' : 'moon'}" class="w-5 h-5"></i>
                        </button>

                        <!-- Mobile Menu Button -->
                        <button
                            @click=${() => this.toggleMobileMenu()}
                            class="md:hidden p-2"
                            aria-label="Toggle menu"
                        >
                            <i data-lucide="menu" class="w-6 h-6"></i>
                        </button>
                    </div>
                </div>

                <!-- Navigation Links (Desktop) -->
                <nav class="hidden md:flex items-center gap-8 px-8 py-3 border-t ${isDark ? 'border-slate-700' : 'border-slate-200'}">
                    ${this.config.navigation.map(item => html`
                        <a
                            href="${item.href}"
                            class="text-sm hover:${isDark ? 'text-indigo-400' : 'text-indigo-600'} transition"
                            @click=${(e) => { e.preventDefault(); this.handleNavClick(item); }}
                        >
                            ${item.label}
                        </a>
                    `)}
                </nav>

                <!-- Mobile Search Bar -->
                <form @submit=${this.handleSearch} class="md:hidden flex items-center gap-2 px-4 pb-3">
                    <input
                        type="text"
                        placeholder="Search products..."
                        .value=${this.searchQuery}
                        @input=${this.handleSearchInput}
                        class="flex-1 px-4 py-2 ${isDark ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-400' : 'bg-slate-50 border-slate-300 text-slate-800 placeholder-slate-500'} border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <button
                        type="submit"
                        class="px-4 py-2 ${isDark ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-indigo-600 hover:bg-indigo-700'} text-white rounded-lg transition"
                    >
                        <i data-lucide="search" class="w-5 h-5"></i>
                    </button>
                </form>

                <!-- Mobile Menu -->
                <div class="fixed inset-0 z-50 ${isDark ? 'bg-slate-900' : 'bg-white'} flex-col items-start p-6 md:hidden transition-transform duration-300 ${this.mobileMenuOpen ? 'flex translate-x-0' : 'hidden -translate-x-full'}">
                    <div class="flex items-center justify-between w-full mb-8">
                        <span class="font-bold text-xl ${isDark ? 'text-indigo-400' : 'text-indigo-600'}">${this.config.brandName}</span>
                        <button
                            @click=${() => this.toggleMobileMenu()}
                            class="p-2"
                        >
                            <i data-lucide="x" class="w-6 h-6"></i>
                        </button>
                    </div>

                    <nav class="flex flex-col gap-4 w-full">
                        ${this.config.navigation.map(item => html`
                            <a
                                href="${item.href}"
                                class="text-lg hover:${isDark ? 'text-indigo-400' : 'text-indigo-600'} transition"
                                @click=${(e) => { e.preventDefault(); this.handleNavClick(item); this.toggleMobileMenu(); }}
                            >
                                ${item.label}
                            </a>
                        `)}

                        <div class="border-t ${isDark ? 'border-slate-700' : 'border-slate-200'} my-4"></div>

                        <button
                            @click=${() => { this.handleWishlistClick(); this.toggleMobileMenu(); }}
                            class="flex items-center gap-3 text-lg"
                        >
                            <i data-lucide="heart" class="w-5 h-5"></i>
                            <span>Wishlist ${this.config.wishlist.itemCount > 0 ? `(${this.config.wishlist.itemCount})` : ''}</span>
                        </button>

                        <button
                            @click=${() => this.toggleTheme()}
                            class="flex items-center gap-3 text-lg"
                        >
                            <i data-lucide="${isDark ? 'sun' : 'moon'}" class="w-5 h-5"></i>
                            <span>Toggle Theme</span>
                        </button>
                    </nav>
                </div>
            </header>
        `;
    }
}

customElements.define('header-search-bar', HeaderSearchBar);
