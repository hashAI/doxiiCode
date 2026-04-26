/**
 * Header Component - Professional Design
 * - Clean, minimal navigation
 * - Professional dropdown menu
 * - Responsive design
 */

import { BaseComponent } from './base-component.js';
import { cartStore } from '../assets/state.js';
import { toggleTheme, getCurrentTheme, toggleDrawer } from '../assets/utils.js';
import { navigate, isActive } from '../assets/router.js';

class EcomHeader extends BaseComponent {
    static properties = {
        cartCount: { type: Number },
        isDark: { type: Boolean },
        isScrolled: { type: Boolean },
        searchQuery: { type: String },
        activeDropdown: { type: String }
    };

    constructor() {
        super();
        this.cartCount = 0;
        this.isDark = getCurrentTheme() === 'dark';
        this.isScrolled = false;
        this.searchQuery = '';
        this.activeDropdown = null;
        this.unsubscribe = null;
    }

    connectedCallback() {
        super.connectedCallback();

        // Subscribe to cart changes
        this.unsubscribe = cartStore.subscribe((state) => {
            this.cartCount = state.count;
        });

        // Listen for theme changes
        window.addEventListener('theme:changed', this.handleThemeChange);

        // Listen for scroll
        window.addEventListener('scroll', this.handleScroll);

        // Initial cart count
        this.cartCount = cartStore.getCount();
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        if (this.unsubscribe) this.unsubscribe();
        window.removeEventListener('theme:changed', this.handleThemeChange);
        window.removeEventListener('scroll', this.handleScroll);
    }

    handleThemeChange = (e) => {
        this.isDark = e.detail.theme === 'dark';
    };

    handleScroll = () => {
        this.isScrolled = window.scrollY > 20;
    };

    handleThemeToggle() {
        this.isDark = toggleTheme();
    }

    handleCartClick() {
        toggleDrawer('cart-drawer');
    }

    handleMobileMenuClick() {
        toggleDrawer('mobile-menu');
    }

    handleSearch(e) {
        e.preventDefault();
        if (this.searchQuery.trim()) {
            navigate('/catalog', { search: this.searchQuery });
            this.searchQuery = '';
        }
    }

    handleNavClick(path) {
        navigate(path);
        this.activeDropdown = null;
    }

    showDropdown(category) {
        this.activeDropdown = category;
    }

    hideDropdown() {
        this.activeDropdown = null;
    }

    getDropdownItems(category) {
        const dropdowns = {
            men: ['T-Shirts', 'Casual Shirts', 'Formal Shirts', 'Jeans', 'Casual Trousers', 'Formal Trousers', 'Shorts', 'Jackets', 'Blazers', 'Suits'],
            women: ['Kurtas & Kurtis', 'Sarees', 'Dresses', 'Tops', 'T-Shirts', 'Jeans', 'Trousers', 'Ethnic Wear', 'Western Wear', 'Leggings'],
            kids: ['T-Shirts', 'Shirts', 'Jeans', 'Dresses', 'Frocks', 'Shorts', 'Ethnic Wear', 'Nightwear', 'Winterwear', 'Party Wear']
        };
        return dropdowns[category] || [];
    }

    render() {
        return this.html`
            <header class="sticky top-0 z-40 bg-white dark:bg-gray-900 shadow-sm">
                <!-- Mobile Header -->
                <div class="md:hidden border-b border-gray-200 dark:border-gray-800">
                    <div class="px-4">
                        <div class="flex items-center justify-between h-20">
                            <!-- Mobile Menu Button -->
                            <button
                                @click="${this.handleMobileMenuClick}"
                                class="p-2 -ml-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
                                aria-label="Menu"
                            >
                                <i data-lucide="menu" class="text-gray-900 dark:text-gray-100" width="24" height="24"></i>
                            </button>

                            <!-- Logo -->
                            <a href="#/" class="flex-shrink-0">
                                <svg width="53" height="36" viewBox="0 0 53 36" class="fill-myntra-pink">
                                    <path d="M12.5 0L0 36h6.8l2.5-7.2h13.4l2.5 7.2h6.8L19.5 0h-7zm-1.3 22.4l4.3-12.4 4.3 12.4H11.2z"></path>
                                </svg>
                            </a>

                            <!-- Action Icons -->
                            <div class="flex items-center gap-3">
                                <!-- Wishlist -->
                                <button
                                    @click="${() => navigate('/catalog')}"
                                    class="p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
                                    aria-label="Wishlist"
                                >
                                    <i data-lucide="heart" class="text-gray-900 dark:text-gray-100" width="22" height="22"></i>
                                </button>

                                <!-- Shopping Bag -->
                                <button
                                    @click="${this.handleCartClick}"
                                    class="relative p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
                                    aria-label="Shopping bag"
                                >
                                    <i data-lucide="shopping-bag" class="text-gray-900 dark:text-gray-100" width="22" height="22"></i>
                                    ${this.cartCount > 0
                                        ? this.html`
                                            <span class="absolute -top-0.5 -right-0.5 w-5 h-5 bg-accent-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                                                ${this.cartCount > 9 ? '9+' : this.cartCount}
                                            </span>
                                        `
                                        : ''
                                    }
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Search Bar - Mobile -->
                    <div class="px-4 py-3">
                        <form @submit="${this.handleSearch}" class="w-full">
                            <div class="relative">
                                <i data-lucide="search" class="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" width="20" height="20"></i>
                                <input
                                    type="text"
                                    placeholder="Search for products, brands and more"
                                    .value="${this.searchQuery}"
                                    @input="${(e) => this.searchQuery = e.target.value}"
                                    class="w-full h-12 pl-12 pr-4 rounded-lg bg-gray-50 dark:bg-gray-800 border-0 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-500"
                                />
                            </div>
                        </form>
                    </div>
                </div>

                <!-- Desktop Header -->
                <div class="hidden md:block">
                    <!-- Top Bar -->
                    <div class="border-b border-gray-200 dark:border-gray-800">
                        <div class="max-w-7xl mx-auto px-4">
                            <div class="flex items-center justify-between h-20">
                                <!-- Logo -->
                                <a href="#/" class="flex-shrink-0">
                                    <svg width="53" height="36" viewBox="0 0 53 36" class="fill-myntra-pink">
                                        <path d="M12.5 0L0 36h6.8l2.5-7.2h13.4l2.5 7.2h6.8L19.5 0h-7zm-1.3 22.4l4.3-12.4 4.3 12.4H11.2z"></path>
                                    </svg>
                                </a>

                                <!-- Main Navigation -->
                                <nav class="flex items-center gap-8 mx-8">
                                    <div class="relative" @mouseenter="${() => this.showDropdown('men')}" @mouseleave="${() => this.hideDropdown()}">
                                        <a href="#/catalog?category=men" class="nav-link">
                                            <span class="font-bold text-sm uppercase tracking-wide">Men</span>
                                        </a>
                                        ${this.activeDropdown === 'men' ? this.html`
                                            <div class="absolute top-full left-0 mt-0 bg-white dark:bg-gray-800 shadow-lg rounded-b-lg min-w-[200px] py-2 animate-fade-in">
                                                ${this.getDropdownItems('men').map(item => this.html`
                                                    <a href="#/catalog?category=men&subcategory=${item.toLowerCase()}" class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                                                        ${item}
                                                    </a>
                                                `)}
                                            </div>
                                        ` : ''}
                                    </div>
                                    <div class="relative" @mouseenter="${() => this.showDropdown('women')}" @mouseleave="${() => this.hideDropdown()}">
                                        <a href="#/catalog?category=women" class="nav-link">
                                            <span class="font-bold text-sm uppercase tracking-wide">Women</span>
                                        </a>
                                        ${this.activeDropdown === 'women' ? this.html`
                                            <div class="absolute top-full left-0 mt-0 bg-white dark:bg-gray-800 shadow-lg rounded-b-lg min-w-[200px] py-2 animate-fade-in">
                                                ${this.getDropdownItems('women').map(item => this.html`
                                                    <a href="#/catalog?category=women&subcategory=${item.toLowerCase()}" class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                                                        ${item}
                                                    </a>
                                                `)}
                                            </div>
                                        ` : ''}
                                    </div>
                                    <div class="relative" @mouseenter="${() => this.showDropdown('kids')}" @mouseleave="${() => this.hideDropdown()}">
                                        <a href="#/catalog?category=kids" class="nav-link">
                                            <span class="font-bold text-sm uppercase tracking-wide">Kids</span>
                                        </a>
                                        ${this.activeDropdown === 'kids' ? this.html`
                                            <div class="absolute top-full left-0 mt-0 bg-white dark:bg-gray-800 shadow-lg rounded-b-lg min-w-[200px] py-2 animate-fade-in">
                                                ${this.getDropdownItems('kids').map(item => this.html`
                                                    <a href="#/catalog?category=kids&subcategory=${item.toLowerCase()}" class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                                                        ${item}
                                                    </a>
                                                `)}
                                            </div>
                                        ` : ''}
                                    </div>
                                    <a href="#/catalog?category=home-living" class="nav-link">
                                        <span class="font-bold text-sm uppercase tracking-wide">Home</span>
                                    </a>
                                    <a href="#/catalog?category=beauty" class="nav-link">
                                        <span class="font-bold text-sm uppercase tracking-wide">Beauty</span>
                                    </a>
                                    <a href="#/catalog?category=genz" class="nav-link">
                                        <span class="font-bold text-sm uppercase tracking-wide">
                                            Genz
                                        </span>
                                    </a>
                                    <a href="#/catalog?studio=true" class="nav-link">
                                        <span class="font-bold text-sm uppercase tracking-wide flex items-center gap-1">
                                            Studio
                                            <span class="text-[10px] text-red-600 dark:text-red-500 font-medium">NEW</span>
                                        </span>
                                    </a>
                                </nav>

                                <!-- Search Bar - Desktop -->
                                <div class="flex-1 max-w-md">
                                    <form @submit="${this.handleSearch}" class="w-full">
                                        <div class="relative">
                                            <i data-lucide="search" class="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" width="18" height="18"></i>
                                            <input
                                                type="text"
                                                placeholder="Search for products, brands and more"
                                                .value="${this.searchQuery}"
                                                @input="${(e) => this.searchQuery = e.target.value}"
                                                class="w-full h-10 pl-11 pr-4 rounded-md bg-gray-50 dark:bg-gray-800 border-0 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-300"
                                            />
                                        </div>
                                    </form>
                                </div>

                                <!-- Action Icons -->
                                <div class="flex items-center gap-6 ml-8">
                                    <!-- Profile -->
                                    <button class="flex flex-col items-center gap-1 hover:text-gray-900 dark:hover:text-white transition-colors">
                                        <i data-lucide="user" width="20" height="20"></i>
                                        <span class="text-xs font-medium">Profile</span>
                                    </button>

                                    <!-- Wishlist -->
                                    <button
                                        @click="${() => navigate('/catalog')}"
                                        class="flex flex-col items-center gap-1 hover:text-gray-900 dark:hover:text-white transition-colors"
                                    >
                                        <i data-lucide="heart" width="20" height="20"></i>
                                        <span class="text-xs font-medium">Wishlist</span>
                                    </button>

                                    <!-- Shopping Bag -->
                                    <button
                                        @click="${this.handleCartClick}"
                                        class="relative flex flex-col items-center gap-1 hover:text-gray-900 dark:hover:text-white transition-colors"
                                    >
                                        <div class="relative">
                                            <i data-lucide="shopping-bag" width="20" height="20"></i>
                                            ${this.cartCount > 0
                                                ? this.html`
                                                    <span class="absolute -top-2 -right-2 w-5 h-5 bg-accent-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                                                        ${this.cartCount > 9 ? '9+' : this.cartCount}
                                                    </span>
                                                `
                                                : ''
                                            }
                                        </div>
                                        <span class="text-xs font-medium">Bag</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <style>
                .nav-link {
                    @apply text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors relative;
                }
                
                .nav-link:hover::after {
                    content: '';
                    @apply absolute -bottom-5 left-0 right-0 h-1 bg-red-600 dark:bg-red-500;
                }
            </style>
        `;
    }
}

customElements.define('ecom-header', EcomHeader);
