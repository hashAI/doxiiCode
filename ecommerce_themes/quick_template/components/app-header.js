import { BaseComponent } from './base-component.js';
import { userStore, productCategories, cartStore } from '../assets/state.js';
import { navigate } from '../assets/router.js';

class AppHeader extends BaseComponent {
    static properties = {
        location: { type: String },
        showSearch: { type: Boolean },
        showMenu: { type: Boolean },
        cartCount: { type: Number },
        showCategoryDropdown: { type: Boolean },
        isDesktop: { type: Boolean }
    };

    constructor() {
        super();
        this.location = 'Select Location';
        this.showSearch = false;
        this.showMenu = false;
        this.cartCount = 0;
        this.showCategoryDropdown = false;
        this.isDesktop = window.innerWidth >= 1024;
    }

    connectedCallback() {
        super.connectedCallback();
        this.unsubscribeUser = userStore.subscribe((state) => {
            this.location = state.location;
        });

        this.unsubscribeCart = cartStore.subscribe((state) => {
            this.cartCount = state.count;
        });

        window.addEventListener('route:changed', () => {
            const path = window.location.hash.slice(1);
            this.showSearch = !path.includes('/search');
        });

        this.resizeHandler = () => {
            this.isDesktop = window.innerWidth >= 1024;
            if (this.isDesktop) {
                this.showMenu = false;
                document.getElementById('overlay')?.classList.add('hidden');
            }
        };
        window.addEventListener('resize', this.resizeHandler);

        this.clickOutsideHandler = (e) => {
            if (!e.target.closest('.category-dropdown-trigger') && !e.target.closest('.category-dropdown')) {
                this.showCategoryDropdown = false;
            }
        };
        document.addEventListener('click', this.clickOutsideHandler);
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        this.unsubscribeUser?.();
        this.unsubscribeCart?.();
        window.removeEventListener('resize', this.resizeHandler);
        document.removeEventListener('click', this.clickOutsideHandler);
    }

    openCart() {
        window.dispatchEvent(new CustomEvent('cart:open'));
    }

    handleSearch() {
        navigate('/search');
    }

    toggleMenu() {
        this.showMenu = !this.showMenu;
        const overlay = document.getElementById('overlay');
        if (this.showMenu) {
            overlay?.classList.remove('hidden');
        } else {
            overlay?.classList.add('hidden');
        }
    }

    closeMenu() {
        this.showMenu = false;
        document.getElementById('overlay')?.classList.add('hidden');
    }

    handleLocationClick() {
        const event = new CustomEvent('open-location-selector', { bubbles: true });
        this.dispatchEvent(event);
    }

    toggleCategoryDropdown(e) {
        e.stopPropagation();
        this.showCategoryDropdown = !this.showCategoryDropdown;
    }

    renderDesktopHeader() {
        return this.html`
            <header class="fixed top-0 left-0 right-0 z-40 hidden lg:block">
                <div class="bg-white/90 dark:bg-stone-900/90 backdrop-blur-xl border-b border-sand-300/20 dark:border-rose-900/20 shadow-soft">
                    <!-- Top info bar -->
                    <div class="border-b border-sand-200/30 dark:border-rose-900/20 bg-gradient-to-r from-cream-200/50 via-rose-50/50 to-cream-200/50 dark:from-stone-900/50 dark:via-stone-800/50 dark:to-stone-900/50">
                        <div class="max-w-[1440px] mx-auto px-8 py-2 flex items-center justify-between text-xs">
                            <div class="flex items-center gap-6">
                                <button
                                    @click=${this.handleLocationClick}
                                    class="flex items-center gap-1.5 text-sand-700 dark:text-cream-300 hover:text-rose-500 dark:hover:text-rose-400 transition">
                                    <i data-lucide="map-pin" class="w-3.5 h-3.5 text-rose-500 dark:text-rose-400"></i>
                                    <span class="truncate max-w-[150px] font-medium">${this.location}</span>
                                    <i data-lucide="chevron-down" class="w-3 h-3"></i>
                                </button>
                                <span class="text-sand-300 dark:text-stone-700">|</span>
                                <a href="#" class="text-sand-700 dark:text-cream-300 hover:text-rose-500 dark:hover:text-rose-400 transition flex items-center gap-1.5 font-medium">
                                    <i data-lucide="truck" class="w-3.5 h-3.5"></i>
                                    Free Shipping on Orders Over $200
                                </a>
                            </div>
                            <div class="flex items-center gap-6">
                                <a href="#" class="text-sand-700 dark:text-cream-300 hover:text-rose-500 dark:hover:text-rose-400 transition flex items-center gap-1.5 font-medium">
                                    <i data-lucide="phone" class="w-3.5 h-3.5"></i>
                                    1-800-STORE
                                </a>
                                <theme-toggle></theme-toggle>
                            </div>
                        </div>
                    </div>

                    <!-- Main header -->
                    <div class="max-w-[1440px] mx-auto px-8 py-5 flex items-center gap-8">
                        <!-- Logo -->
                        <a href="#/" @click=${() => navigate('/')} class="flex items-center gap-3 flex-shrink-0 group">
                            <div class="w-11 h-11 bg-gradient-to-br from-rose-400 to-rose-500 dark:from-rose-500 dark:to-rose-600 rounded-2xl flex items-center justify-center shadow-rose group-hover:shadow-rose transition-all">
                                <span class="font-display font-bold text-2xl text-white">A</span>
                            </div>
                            <div class="leading-tight">
                                <p class="text-xl font-display font-semibold text-sand-900 dark:text-cream-50">Store Name</p>
                                <p class="text-xs text-sand-600 dark:text-cream-400">Contemporary Collection</p>
                            </div>
                        </a>

                        <!-- Search -->
                        <div class="flex-1 max-w-2xl">
                            <button
                                @click=${this.handleSearch}
                                class="w-full flex items-center gap-3 px-5 py-3 bg-sand-100/50 dark:bg-stone-800/50 border border-sand-200 dark:border-stone-700 rounded-2xl hover:border-rose-300 dark:hover:border-rose-700 transition group">
                                <i data-lucide="search" class="w-5 h-5 text-rose-400 group-hover:text-rose-500 dark:text-rose-500 dark:group-hover:text-rose-400 transition"></i>
                                <span class="text-sand-500 dark:text-stone-400 flex-1 text-left">Search for products...</span>
                                <span class="px-2 py-1 bg-sand-200/50 dark:bg-stone-700/50 rounded-lg text-xs text-sand-500 dark:text-stone-400 font-medium">⌘K</span>
                            </button>
                        </div>

                        <!-- Actions -->
                        <div class="flex items-center gap-3">
                            <button
                                @click=${() => window.dispatchEvent(new CustomEvent('favorites:open'))}
                                class="p-3 rounded-2xl bg-sand-100/50 dark:bg-stone-800/50 hover:bg-rose-100 dark:hover:bg-rose-900/30 border border-sand-200 dark:border-stone-700 hover:border-rose-300 dark:hover:border-rose-700 transition group">
                                <i data-lucide="heart" class="w-5 h-5 text-sand-700 dark:text-cream-300 group-hover:text-rose-500 dark:group-hover:text-rose-400 transition"></i>
                            </button>
                            <button
                                @click=${this.openCart}
                                class="relative flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-sand-100/50 dark:bg-stone-800/50 hover:bg-rose-100 dark:hover:bg-rose-900/30 border border-sand-200 dark:border-stone-700 hover:border-rose-300 dark:hover:border-rose-700 transition group">
                                <i data-lucide="shopping-bag" class="w-5 h-5 text-sand-700 dark:text-cream-300 group-hover:text-rose-500 dark:group-hover:text-rose-400 transition"></i>
                                <span class="font-semibold text-sand-900 dark:text-cream-100">Cart</span>
                                ${this.cartCount > 0 ? this.html`
                                    <span class="px-2.5 py-0.5 bg-rose-500 text-white text-xs font-bold rounded-full shadow-rose">
                                        ${this.cartCount > 9 ? '9+' : this.cartCount}
                                    </span>
                                ` : ''}
                            </button>
                            <button class="flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-gradient-to-r from-rose-400 to-rose-500 dark:from-rose-500 dark:to-rose-600 text-white font-semibold hover:shadow-rose transition-all shadow-soft">
                                <i data-lucide="user" class="w-5 h-5"></i>
                                <span>Sign In</span>
                            </button>
                        </div>
                    </div>

                    <!-- Category nav -->
                    <div class="border-t border-sand-200/30 dark:border-rose-900/20 bg-cream-50/30 dark:bg-stone-900/30">
                        <div class="max-w-[1440px] mx-auto px-8">
                            <nav class="flex items-center gap-1">
                                <!-- Collections dropdown -->
                                <div class="relative category-dropdown-trigger">
                                    <button
                                        @click=${this.toggleCategoryDropdown}
                                        class="flex items-center gap-2 px-4 py-3.5 font-semibold text-sand-900 dark:text-cream-100 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-rose-50/50 dark:hover:bg-rose-900/20 rounded-xl transition">
                                        <i data-lucide="grid-3x3" class="w-4 h-4 text-rose-500 dark:text-rose-400"></i>
                                        <span>Collections</span>
                                        <i data-lucide="chevron-down" class="w-4 h-4 transition ${this.showCategoryDropdown ? 'rotate-180' : ''}"></i>
                                    </button>

                                    ${this.showCategoryDropdown ? this.html`
                                        <div class="category-dropdown absolute top-full left-0 mt-2 bg-white dark:bg-stone-900 border border-sand-200 dark:border-stone-700 rounded-2xl shadow-float p-3 min-w-[280px] z-50">
                                            <div class="space-y-1">
                                                ${productCategories.map(category => this.html`
                                                    <button
                                                        @click=${() => { this.showCategoryDropdown = false; navigate('/products/' + category.id); }}
                                                        class="w-full p-3 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-900/20 flex items-center gap-3 transition group">
                                                        <div class="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center group-hover:bg-rose-200 dark:group-hover:bg-rose-900/50 transition">
                                                            <i data-lucide="${category.icon}" class="w-5 h-5 text-rose-500 dark:text-rose-400"></i>
                                                        </div>
                                                        <div class="flex-1 text-left">
                                                            <p class="font-semibold text-sand-900 dark:text-cream-100">${category.name}</p>
                                                            <p class="text-xs text-sand-600 dark:text-cream-400">Shop collection</p>
                                                        </div>
                                                        <i data-lucide="chevron-right" class="w-4 h-4 text-sand-400 dark:text-stone-600"></i>
                                                    </button>
                                                `)}
                                            </div>
                                        </div>
                                    ` : ''}
                                </div>

                                <!-- Quick links -->
                                ${productCategories.slice(0, 4).map(category => this.html`
                                    <button
                                        @click=${() => navigate('/products/' + category.id)}
                                        class="px-4 py-3.5 text-sand-700 dark:text-cream-300 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-rose-50/50 dark:hover:bg-rose-900/20 rounded-xl transition font-medium">
                                        ${category.name}
                                    </button>
                                `)}

                                <button
                                    @click=${() => navigate('/products/all')}
                                    class="px-4 py-3.5 text-rose-500 dark:text-rose-400 hover:bg-rose-50/50 dark:hover:bg-rose-900/20 rounded-xl transition font-semibold flex items-center gap-1.5">
                                    <i data-lucide="sparkles" class="w-4 h-4"></i>
                                    New Arrivals
                                </button>

                                <button class="ml-auto px-4 py-3.5 text-sand-700 dark:text-cream-300 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-rose-50/50 dark:hover:bg-rose-900/20 rounded-xl transition font-medium flex items-center gap-1.5">
                                    <i data-lucide="percent" class="w-4 h-4"></i>
                                    Sale
                                </button>
                            </nav>
                        </div>
                    </div>
                </div>
            </header>
            <div class="hidden lg:block" style="height: 165px"></div>
        `;
    }

    renderMobileHeader() {
        return this.html`
            <header class="fixed top-0 left-0 right-0 z-40 lg:hidden">
                <div class="glass border-b border-sand-200/30 dark:border-rose-900/20 px-4 pt-4 pb-4 shadow-soft">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-3">
                            <button
                                @click=${this.toggleMenu}
                                class="p-2.5 rounded-2xl bg-sand-100/70 dark:bg-stone-800/70 hover:bg-rose-100 dark:hover:bg-rose-900/30 border border-sand-200/50 dark:border-stone-700/50 transition touch-feedback">
                                <i data-lucide="menu" class="w-5 h-5 text-sand-900 dark:text-cream-100"></i>
                            </button>
                            <div class="flex items-center gap-2.5">
                                <div class="w-10 h-10 bg-gradient-to-br from-rose-400 to-rose-500 dark:from-rose-500 dark:to-rose-600 rounded-2xl flex items-center justify-center shadow-rose">
                                    <span class="font-display font-bold text-lg text-white">A</span>
                                </div>
                                <div class="leading-tight">
                                    <p class="text-sm font-display font-semibold text-sand-900 dark:text-cream-50">Store Name</p>
                                    <p class="text-xs text-sand-600 dark:text-cream-400">Collection</p>
                                </div>
                            </div>
                        </div>
                        <div class="flex items-center gap-2">
                            <button
                                @click=${this.openCart}
                                class="relative p-2.5 rounded-2xl bg-sand-100/70 dark:bg-stone-800/70 hover:bg-rose-100 dark:hover:bg-rose-900/30 border border-sand-200/50 dark:border-stone-700/50 transition touch-feedback">
                                <i data-lucide="shopping-bag" class="w-5 h-5 text-sand-900 dark:text-cream-100"></i>
                                ${this.cartCount > 0 ? this.html`
                                    <span class="absolute -top-1.5 -right-1.5 w-5 h-5 bg-rose-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-rose">
                                        ${this.cartCount > 9 ? '9+' : this.cartCount}
                                    </span>
                                ` : ''}
                            </button>
                            <button
                                @click=${() => window.dispatchEvent(new CustomEvent('favorites:open'))}
                                class="p-2.5 rounded-2xl bg-sand-100/70 dark:bg-stone-800/70 hover:bg-rose-100 dark:hover:bg-rose-900/30 border border-sand-200/50 dark:border-stone-700/50 transition touch-feedback">
                                <i data-lucide="heart" class="w-5 h-5 text-sand-900 dark:text-cream-100"></i>
                            </button>
                        </div>
                    </div>

                    <div class="mt-3 flex gap-2">
                        <button
                            @click=${this.handleLocationClick}
                            class="flex items-center gap-1.5 px-3 py-2.5 bg-sand-100/70 dark:bg-stone-800/70 border border-sand-200/50 dark:border-stone-700/50 rounded-2xl flex-shrink-0 text-sm font-medium touch-feedback">
                            <i data-lucide="map-pin" class="w-4 h-4 text-rose-500 dark:text-rose-400"></i>
                            <span class="truncate max-w-[80px] text-sand-900 dark:text-cream-100">${this.location}</span>
                            <i data-lucide="chevron-down" class="w-3 h-3 text-sand-600 dark:text-cream-400"></i>
                        </button>
                        <button
                            @click=${this.handleSearch}
                            class="flex-1 flex items-center gap-2 px-4 py-2.5 bg-sand-100/70 dark:bg-stone-800/70 border border-sand-200/50 dark:border-stone-700/50 rounded-2xl touch-feedback">
                            <i data-lucide="search" class="w-4 h-4 text-rose-500 dark:text-rose-400"></i>
                            <span class="text-sm text-sand-500 dark:text-stone-400">Search...</span>
                        </button>
                    </div>
                </div>
            </header>

            <div class="lg:hidden" style="height: 118px"></div>
        `;
    }

    renderMobileMenu() {
        if (!this.showMenu) return '';

        return this.html`
            <div class="fixed inset-0 z-50 lg:hidden">
                <div class="absolute inset-0 bg-sand-900/20 dark:bg-black/40 backdrop-blur-sm" @click=${this.closeMenu}></div>
                <div class="absolute top-0 left-0 bottom-0 w-[85%] max-w-sm bg-white dark:bg-stone-900 rounded-r-3xl overflow-y-auto shadow-hover border-r border-sand-200 dark:border-stone-700">
                    <!-- Header -->
                    <div class="p-5 bg-gradient-to-r from-cream-100 via-rose-50 to-cream-100 dark:from-stone-900 dark:via-stone-800 dark:to-stone-900 border-b border-sand-200 dark:border-stone-700">
                        <div class="flex items-center justify-between">
                            <div class="flex items-center gap-3">
                                <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-400 to-rose-500 dark:from-rose-500 dark:to-rose-600 flex items-center justify-center shadow-rose">
                                    <span class="font-display font-bold text-2xl text-white">A</span>
                                </div>
                                <div>
                                    <p class="text-sm font-display font-semibold text-sand-900 dark:text-cream-50">Welcome</p>
                                    <p class="text-xs text-sand-600 dark:text-cream-400">Discover elegance</p>
                                </div>
                            </div>
                            <button @click=${this.closeMenu} class="p-2.5 rounded-2xl bg-sand-100 dark:bg-stone-800 hover:bg-rose-100 dark:hover:bg-rose-900/30 transition border border-sand-200 dark:border-stone-700">
                                <i data-lucide="x" class="w-5 h-5 text-sand-900 dark:text-cream-100"></i>
                            </button>
                        </div>

                        <!-- Login CTA -->
                        <button class="mt-4 w-full py-3 rounded-2xl bg-gradient-to-r from-rose-400 to-rose-500 dark:from-rose-500 dark:to-rose-600 text-white text-sm font-semibold flex items-center justify-center gap-2 hover:shadow-rose transition touch-feedback shadow-soft">
                            <i data-lucide="user" class="w-4 h-4"></i>
                            Sign In for Exclusive Access
                        </button>
                    </div>

                    <div class="p-4 space-y-5">
                        <!-- Quick nav -->
                        <div class="grid grid-cols-3 gap-2">
                            <button @click=${() => { this.closeMenu(); navigate('/'); }} class="p-3 rounded-2xl bg-sand-100/70 dark:bg-stone-800/70 border border-sand-200 dark:border-stone-700 flex flex-col items-center gap-2 hover:bg-rose-100 dark:hover:bg-rose-900/30 transition touch-feedback">
                                <div class="w-10 h-10 rounded-full bg-gradient-to-br from-rose-400 to-rose-500 flex items-center justify-center">
                                    <i data-lucide="home" class="w-5 h-5 text-white"></i>
                                </div>
                                <span class="text-xs font-semibold text-sand-900 dark:text-cream-100">Home</span>
                            </button>
                            <button @click=${() => { this.closeMenu(); navigate('/products/all'); }} class="p-3 rounded-2xl bg-sand-100/70 dark:bg-stone-800/70 border border-sand-200 dark:border-stone-700 flex flex-col items-center gap-2 hover:bg-rose-100 dark:hover:bg-rose-900/30 transition touch-feedback">
                                <div class="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center">
                                    <i data-lucide="gem" class="w-5 h-5 text-white"></i>
                                </div>
                                <span class="text-xs font-semibold text-sand-900 dark:text-cream-100">Shop</span>
                            </button>
                            <button @click=${() => { this.closeMenu(); window.dispatchEvent(new CustomEvent('favorites:open')); }} class="p-3 rounded-2xl bg-sand-100/70 dark:bg-stone-800/70 border border-sand-200 dark:border-stone-700 flex flex-col items-center gap-2 hover:bg-rose-100 dark:hover:bg-rose-900/30 transition touch-feedback">
                                <div class="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-pink-500 flex items-center justify-center">
                                    <i data-lucide="heart" class="w-5 h-5 text-white"></i>
                                </div>
                                <span class="text-xs font-semibold text-sand-900 dark:text-cream-100">Wishlist</span>
                            </button>
                        </div>

                        <!-- Promo banner -->
                        <div class="p-4 rounded-2xl bg-gradient-to-r from-rose-100 to-amber-100 dark:from-rose-900/30 dark:to-amber-900/30 border border-rose-200 dark:border-rose-800">
                            <div class="flex items-center gap-3">
                                <span class="text-3xl">💎</span>
                                <div class="flex-1">
                                    <p class="text-sm font-bold text-rose-700 dark:text-rose-400">SEASONAL SALE</p>
                                    <p class="text-xs text-sand-700 dark:text-cream-400">Up to 30% off selected pieces</p>
                                </div>
                                <i data-lucide="chevron-right" class="w-5 h-5 text-rose-500 dark:text-rose-400"></i>
                            </div>
                        </div>

                        <!-- Categories -->
                        <div>
                            <p class="text-xs font-bold text-rose-500 dark:text-rose-400 mb-3 uppercase tracking-wider flex items-center gap-2">
                                <i data-lucide="gem" class="w-3 h-3"></i> Collections
                            </p>
                            <div class="space-y-2">
                                ${productCategories.map(category => this.html`
                                    <button
                                        @click=${() => { this.closeMenu(); navigate('/products/' + category.id); }}
                                        class="w-full p-3 rounded-2xl bg-sand-100/70 dark:bg-stone-800/70 border border-sand-200 dark:border-stone-700 flex items-center gap-3 hover:bg-rose-100 dark:hover:bg-rose-900/30 transition touch-feedback">
                                        <div class="w-11 h-11 rounded-xl bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center">
                                            <i data-lucide="${category.icon}" class="w-5 h-5 text-rose-500 dark:text-rose-400"></i>
                                        </div>
                                        <div class="flex-1 text-left">
                                            <p class="font-semibold text-sm text-sand-900 dark:text-cream-100">${category.name}</p>
                                            <p class="text-xs text-sand-600 dark:text-cream-400">Explore collection</p>
                                        </div>
                                        <i data-lucide="chevron-right" class="w-4 h-4 text-sand-400 dark:text-stone-600"></i>
                                    </button>
                                `)}
                            </div>
                        </div>

                        <!-- Services -->
                        <div class="space-y-2 pt-2 border-t border-sand-200 dark:border-stone-700">
                            <button class="w-full p-3 rounded-2xl bg-sand-100/70 dark:bg-stone-800/70 border border-sand-200 dark:border-stone-700 flex items-center gap-3 hover:bg-rose-100 dark:hover:bg-rose-900/30 transition touch-feedback">
                                <div class="w-9 h-9 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                                    <i data-lucide="phone" class="w-4 h-4 text-emerald-600 dark:text-emerald-400"></i>
                                </div>
                                <div class="flex-1 text-left">
                                    <p class="text-sm font-semibold text-sand-900 dark:text-cream-100">Personal Service</p>
                                    <p class="text-xs text-sand-600 dark:text-cream-400">Expert consultation</p>
                                </div>
                            </button>
                            <button class="w-full p-3 rounded-2xl bg-sand-100/70 dark:bg-stone-800/70 border border-sand-200 dark:border-stone-700 flex items-center gap-3 hover:bg-rose-100 dark:hover:bg-rose-900/30 transition touch-feedback">
                                <div class="w-9 h-9 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                    <i data-lucide="truck" class="w-4 h-4 text-blue-600 dark:text-blue-400"></i>
                                </div>
                                <div class="flex-1 text-left">
                                    <p class="text-sm font-semibold text-sand-900 dark:text-cream-100">Track Order</p>
                                    <p class="text-xs text-sand-600 dark:text-cream-400">Check delivery status</p>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    render() {
        return this.html`
            ${this.renderDesktopHeader()}
            ${this.renderMobileHeader()}
            ${this.renderMobileMenu()}
        `;
    }
}

customElements.define('app-header', AppHeader);
