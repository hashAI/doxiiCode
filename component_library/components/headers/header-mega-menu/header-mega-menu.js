/**
 * Header Mega Menu - E-commerce header with dropdown mega menu showing categories with images
 * Features: Mega menu with images, mobile menu, cart, search, theme toggle
 *
 * @element header-mega-menu
 * @fires nav-click - When a navigation item is clicked
 * @fires category-click - When a category is clicked
 * @fires cart-click - When cart is clicked
 * @fires search - When search is performed
 * @fires menu-toggle - When mobile menu is toggled
 * @fires theme-changed - When theme is toggled
 */

import { BaseComponent } from '../../base-component.js';
import { html } from 'https://cdn.jsdelivr.net/npm/lit@3.2.1/+esm';

export class HeaderMegaMenu extends BaseComponent {
    static properties = {
        theme: { type: String },
        mobileMenuOpen: { type: Boolean },
        megaMenuOpen: { type: Boolean },
        searchQuery: { type: String },
        config: { type: Object }
    };

    constructor() {
        super();
        this.theme = 'light';
        this.mobileMenuOpen = false;
        this.megaMenuOpen = false;
        this.searchQuery = '';

        this.config = {
            brandName: 'MegaStore',
            navigation: [
                { label: 'Shop', href: '/shop', hasMegaMenu: true },
                { label: 'Deals', href: '/deals', hasMegaMenu: false },
                { label: 'New Arrivals', href: '/new', hasMegaMenu: false },
                { label: 'Brands', href: '/brands', hasMegaMenu: false }
            ],
            megaMenu: {
                categories: [
                    {
                        title: 'Electronics',
                        items: [
                            { label: 'Smartphones', href: '/electronics/smartphones', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=200&h=150&fit=crop' },
                            { label: 'Laptops', href: '/electronics/laptops', image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=200&h=150&fit=crop' },
                            { label: 'Headphones', href: '/electronics/headphones', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=150&fit=crop' },
                            { label: 'Cameras', href: '/electronics/cameras', image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=200&h=150&fit=crop' }
                        ]
                    },
                    {
                        title: 'Fashion',
                        items: [
                            { label: "Men's Wear", href: '/fashion/mens', image: 'https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=200&h=150&fit=crop' },
                            { label: "Women's Wear", href: '/fashion/womens', image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=200&h=150&fit=crop' },
                            { label: 'Shoes', href: '/fashion/shoes', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&h=150&fit=crop' },
                            { label: 'Accessories', href: '/fashion/accessories', image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=200&h=150&fit=crop' }
                        ]
                    },
                    {
                        title: 'Home & Living',
                        items: [
                            { label: 'Furniture', href: '/home/furniture', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=200&h=150&fit=crop' },
                            { label: 'Decor', href: '/home/decor', image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=200&h=150&fit=crop' },
                            { label: 'Kitchen', href: '/home/kitchen', image: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=200&h=150&fit=crop' },
                            { label: 'Bedding', href: '/home/bedding', image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=200&h=150&fit=crop' }
                        ]
                    }
                ]
            },
            cart: {
                itemCount: 0
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
        if (changedProperties.has('theme') || changedProperties.has('mobileMenuOpen') || changedProperties.has('megaMenuOpen')) {
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

    toggleMegaMenu() {
        this.megaMenuOpen = !this.megaMenuOpen;
    }

    handleNavClick(item) {
        this.emit('nav-click', { item });
        if (item.hasMegaMenu) {
            this.toggleMegaMenu();
        }
    }

    handleCategoryClick(item) {
        this.emit('category-click', { item });
        this.megaMenuOpen = false;
    }

    handleSearch(e) {
        e.preventDefault();
        this.emit('search', { query: this.searchQuery });
    }

    handleSearchInput(e) {
        this.searchQuery = e.target.value;
    }

    handleCartClick() {
        this.emit('cart-click', {});
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

                header-mega-menu * {
                    font-family: 'Poppins', sans-serif;
                }
            </style>

            <header class="relative w-full ${isDark ? 'bg-slate-900 text-white' : 'bg-white text-slate-800'} border-b ${isDark ? 'border-slate-700' : 'border-slate-200'}">
                <!-- Main Header -->
                <div class="w-full py-4 px-4 md:px-8 flex items-center justify-between gap-4">
                    <!-- Logo -->
                    <a href="/" class="font-bold text-xl md:text-2xl ${isDark ? 'text-indigo-400' : 'text-indigo-600'} whitespace-nowrap">
                        ${this.config.brandName}
                    </a>

                    <!-- Desktop Navigation -->
                    <nav class="hidden md:flex items-center gap-6">
                        ${this.config.navigation.map(item => html`
                            ${item.hasMegaMenu ? html`
                                <button
                                    @click=${() => this.toggleMegaMenu()}
                                    class="flex items-center gap-1 text-sm hover:${isDark ? 'text-indigo-400' : 'text-indigo-600'} transition"
                                >
                                    ${item.label}
                                    <i data-lucide="chevron-down" class="w-4 h-4"></i>
                                </button>
                            ` : html`
                                <a
                                    href="${item.href}"
                                    class="text-sm hover:${isDark ? 'text-indigo-400' : 'text-indigo-600'} transition"
                                    @click=${(e) => { e.preventDefault(); this.handleNavClick(item); }}
                                >
                                    ${item.label}
                                </a>
                            `}
                        `)}
                    </nav>

                    <!-- Search (Desktop) -->
                    <form @submit=${this.handleSearch} class="hidden md:flex items-center flex-1 max-w-md mx-4">
                        <input
                            type="text"
                            placeholder="Search products..."
                            .value=${this.searchQuery}
                            @input=${this.handleSearchInput}
                            class="flex-1 px-4 py-2 ${isDark ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-400' : 'bg-slate-50 border-slate-300 text-slate-800 placeholder-slate-500'} border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <button
                            type="submit"
                            class="px-4 py-2 ${isDark ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-indigo-600 hover:bg-indigo-700'} text-white rounded-r-lg transition"
                        >
                            <i data-lucide="search" class="w-5 h-5"></i>
                        </button>
                    </form>

                    <!-- Right Actions -->
                    <div class="flex items-center gap-3">
                        <button
                            @click=${this.handleCartClick}
                            class="relative p-2 hover:${isDark ? 'bg-slate-800' : 'bg-slate-100'} rounded-lg transition"
                            aria-label="Shopping cart"
                        >
                            <i data-lucide="shopping-cart" class="w-5 h-5"></i>
                            ${this.config.cart.itemCount > 0 ? html`
                                <span class="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                    ${this.config.cart.itemCount}
                                </span>
                            ` : ''}
                        </button>

                        <button
                            @click=${() => this.toggleTheme()}
                            class="hidden md:block p-2 hover:${isDark ? 'bg-slate-800' : 'bg-slate-100'} rounded-lg transition"
                            aria-label="Toggle theme"
                        >
                            <i data-lucide="${isDark ? 'sun' : 'moon'}" class="w-5 h-5"></i>
                        </button>

                        <button
                            @click=${() => this.toggleMobileMenu()}
                            class="md:hidden p-2"
                            aria-label="Toggle menu"
                        >
                            <i data-lucide="menu" class="w-6 h-6"></i>
                        </button>
                    </div>
                </div>

                <!-- Mega Menu -->
                ${this.megaMenuOpen ? html`
                    <div class="absolute top-full left-0 w-full ${isDark ? 'bg-slate-800' : 'bg-white'} border-t ${isDark ? 'border-slate-700' : 'border-slate-200'} shadow-2xl z-50">
                        <div class="container mx-auto px-8 py-8">
                            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                                ${this.config.megaMenu.categories.map(category => html`
                                    <div>
                                        <h3 class="font-semibold text-lg mb-4 ${isDark ? 'text-indigo-400' : 'text-indigo-600'}">${category.title}</h3>
                                        <div class="grid grid-cols-2 gap-4">
                                            ${category.items.map(item => html`
                                                <a
                                                    href="${item.href}"
                                                    @click=${(e) => { e.preventDefault(); this.handleCategoryClick(item); }}
                                                    class="block group"
                                                >
                                                    <div class="aspect-video rounded-lg overflow-hidden mb-2">
                                                        <img
                                                            src="${item.image}"
                                                            alt="${item.label}"
                                                            class="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                                                        />
                                                    </div>
                                                    <p class="text-sm group-hover:${isDark ? 'text-indigo-400' : 'text-indigo-600'} transition">${item.label}</p>
                                                </a>
                                            `)}
                                        </div>
                                    </div>
                                `)}
                            </div>
                            <button
                                @click=${() => this.toggleMegaMenu()}
                                class="mt-6 text-sm ${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'} transition"
                            >
                                Close Menu
                            </button>
                        </div>
                    </div>
                ` : ''}

                <!-- Mobile Menu -->
                <div class="fixed inset-0 z-50 ${isDark ? 'bg-slate-900' : 'bg-white'} flex-col p-6 md:hidden transition-transform duration-300 ${this.mobileMenuOpen ? 'flex translate-x-0' : 'hidden -translate-x-full'}">
                    <div class="flex items-center justify-between mb-6">
                        <span class="font-bold text-xl ${isDark ? 'text-indigo-400' : 'text-indigo-600'}">${this.config.brandName}</span>
                        <button @click=${() => this.toggleMobileMenu()}>
                            <i data-lucide="x" class="w-6 h-6"></i>
                        </button>
                    </div>

                    <form @submit=${this.handleSearch} class="flex items-center gap-2 mb-6">
                        <input
                            type="text"
                            placeholder="Search..."
                            .value=${this.searchQuery}
                            @input=${this.handleSearchInput}
                            class="flex-1 px-4 py-2 ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-800'} border rounded-lg"
                        />
                        <button type="submit" class="px-4 py-2 bg-indigo-600 text-white rounded-lg">
                            <i data-lucide="search" class="w-5 h-5"></i>
                        </button>
                    </form>

                    <nav class="flex flex-col gap-4">
                        ${this.config.navigation.map(item => html`
                            <a
                                href="${item.href}"
                                class="text-lg"
                                @click=${(e) => { e.preventDefault(); this.handleNavClick(item); this.toggleMobileMenu(); }}
                            >
                                ${item.label}
                            </a>
                        `)}
                    </nav>
                </div>
            </header>
        `;
    }
}

customElements.define('header-mega-menu', HeaderMegaMenu);
