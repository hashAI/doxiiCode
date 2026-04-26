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

        // Close dropdown when clicking outside
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
                <div class="bg-gradient-to-r from-[#2D0B52] via-[#3d1469] to-[#2D0B52] text-white shadow-xl relative overflow-hidden">
                    <!-- Decorative gradient overlay -->
                    <div class="absolute inset-0 opacity-30" style="background: radial-gradient(circle at 10% 50%, rgba(236,72,153,0.2) 0%, transparent 50%), radial-gradient(circle at 90% 50%, rgba(147,112,219,0.2) 0%, transparent 50%);"></div>
                    
                    <!-- Top bar with location and help -->
                    <div class="relative border-b border-white/10">
                        <div class="max-w-[1440px] mx-auto px-6 py-2 flex items-center justify-between text-sm">
                            <div class="flex items-center gap-6">
                                <button
                                    @click=${this.handleLocationClick}
                                    class="flex items-center gap-1.5 text-white/80 hover:text-white transition">
                                    <i data-lucide="map-pin" class="w-4 h-4 text-pink-300"></i>
                                    <span class="truncate max-w-[150px]">${this.location}</span>
                                    <i data-lucide="chevron-down" class="w-3 h-3"></i>
                                </button>
                                <span class="text-white/50">|</span>
                                <a href="#" class="text-white/80 hover:text-white transition flex items-center gap-1.5">
                                    <i data-lucide="truck" class="w-4 h-4"></i>
                                    Free shipping over $50
                                </a>
                            </div>
                            <div class="flex items-center gap-6">
                                <a href="#" class="text-white/80 hover:text-white transition flex items-center gap-1.5">
                                    <i data-lucide="headphones" class="w-4 h-4"></i>
                                    Help & Support
                                </a>
                                <theme-toggle></theme-toggle>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Main navigation -->
                    <div class="relative">
                        <div class="max-w-[1440px] mx-auto px-6 py-4 flex items-center gap-8">
                            <!-- Logo -->
                            <a href="#/" @click=${() => navigate('/')} class="flex items-center gap-3 flex-shrink-0">
                                <div class="w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-500 text-white rounded-2xl flex items-center justify-center font-black text-xl shadow-lg shadow-pink-500/30">
                                    ✨
                                </div>
                                <div class="leading-tight">
                                    <p class="text-lg font-bold text-white">BeautyHub</p>
                                    <p class="text-xs text-pink-200/80">Glow with confidence</p>
                                </div>
                            </a>

                            <!-- Search Bar -->
                            <div class="flex-1 max-w-2xl">
                                <button
                                    @click=${this.handleSearch}
                                    class="w-full flex items-center gap-3 px-5 py-3 bg-white text-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition group">
                                    <i data-lucide="search" class="w-5 h-5 text-purple-400 group-hover:text-purple-600 transition"></i>
                                    <span class="text-gray-500 flex-1 text-left">Search for skincare, makeup, haircare...</span>
                                    <span class="px-2 py-1 bg-gray-100 rounded-lg text-xs text-gray-500 font-medium">⌘K</span>
                                </button>
                            </div>

                            <!-- Action buttons -->
                            <div class="flex items-center gap-3">
                                <button
                                    @click=${() => window.dispatchEvent(new CustomEvent('favorites:open'))}
                                    class="relative p-3 rounded-xl bg-white/10 hover:bg-white/20 transition border border-white/10 group">
                                    <i data-lucide="heart" class="w-5 h-5 group-hover:scale-110 transition"></i>
                                    <span class="absolute -top-1 -right-1 w-2 h-2 bg-pink-500 rounded-full"></span>
                                </button>
                                <button
                                    @click=${this.openCart}
                                    class="relative flex items-center gap-2 px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition border border-white/10 group">
                                    <i data-lucide="shopping-bag" class="w-5 h-5 group-hover:scale-110 transition"></i>
                                    <span class="font-semibold">Cart</span>
                                    ${this.cartCount > 0 ? this.html`
                                        <span class="px-2 py-0.5 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs font-bold rounded-full shadow-lg">
                                            ${this.cartCount > 9 ? '9+' : this.cartCount}
                                        </span>
                                    ` : ''}
                                </button>
                                <button class="flex items-center gap-2 px-4 py-3 rounded-xl bg-white text-purple-800 font-semibold hover:bg-white/90 transition shadow-lg">
                                    <i data-lucide="user" class="w-5 h-5"></i>
                                    <span>Sign In</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Category Navigation -->
                    <div class="relative bg-white/5 border-t border-white/10">
                        <div class="max-w-[1440px] mx-auto px-6">
                            <nav class="flex items-center gap-1">
                                <!-- All Categories Dropdown -->
                                <div class="relative category-dropdown-trigger">
                                    <button
                                        @click=${this.toggleCategoryDropdown}
                                        class="flex items-center gap-2 px-4 py-3 font-semibold text-white hover:bg-white/10 rounded-lg transition">
                                        <i data-lucide="grid-3x3" class="w-5 h-5 text-pink-300"></i>
                                        <span>All Categories</span>
                                        <i data-lucide="chevron-down" class="w-4 h-4 transition ${this.showCategoryDropdown ? 'rotate-180' : ''}"></i>
                                    </button>
                                    
                                    ${this.showCategoryDropdown ? this.html`
                                        <div class="category-dropdown absolute top-full left-0 mt-2 bg-white rounded-2xl shadow-2xl p-4 min-w-[280px] z-50">
                                            <div class="space-y-1">
                                                ${productCategories.map(category => this.html`
                                                    <button
                                                        @click=${() => { this.showCategoryDropdown = false; navigate('/products/' + category.id); }}
                                                        class="w-full p-3 rounded-xl hover:bg-gray-50 flex items-center gap-3 transition">
                                                        <div class="w-10 h-10 rounded-xl ${category.color} flex items-center justify-center">
                                                            <i data-lucide="${category.icon}" class="w-5 h-5 ${category.textColor}"></i>
                                                        </div>
                                                        <div class="flex-1 text-left">
                                                            <p class="font-semibold text-gray-900">${category.name}</p>
                                                            <p class="text-xs text-gray-500">Shop collection</p>
                                                        </div>
                                                        <i data-lucide="chevron-right" class="w-4 h-4 text-gray-400"></i>
                                                    </button>
                                                `)}
                                            </div>
                                        </div>
                                    ` : ''}
                                </div>

                                <!-- Quick category links -->
                                ${productCategories.slice(0, 4).map(category => this.html`
                                    <button
                                        @click=${() => navigate('/products/' + category.id)}
                                        class="px-4 py-3 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition font-medium">
                                        ${category.name}
                                    </button>
                                `)}
                                
                                <button
                                    @click=${() => navigate('/products/all')}
                                    class="px-4 py-3 text-pink-300 hover:text-pink-200 hover:bg-white/10 rounded-lg transition font-semibold flex items-center gap-1.5">
                                    <i data-lucide="percent" class="w-4 h-4"></i>
                                    Deals
                                </button>

                                <button class="ml-auto px-4 py-3 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition font-medium flex items-center gap-1.5">
                                    <i data-lucide="sparkles" class="w-4 h-4 text-pink-300"></i>
                                    New Arrivals
                                </button>
                            </nav>
                        </div>
                    </div>
                </div>
            </header>
            <div class="hidden lg:block" style="height: 172px"></div>
        `;
    }

    renderMobileHeader() {
        return this.html`
            <header class="fixed top-0 left-0 right-0 z-40 lg:hidden">
                <div class="bg-gradient-to-r from-[#2D0B52] via-[#3d1469] to-[#2D0B52] text-white px-4 pt-4 pb-4 shadow-xl rounded-b-3xl relative overflow-hidden">
                    <!-- Decorative gradient overlay -->
                    <div class="absolute inset-0 opacity-30" style="background: radial-gradient(circle at 10% 50%, rgba(236,72,153,0.2) 0%, transparent 50%), radial-gradient(circle at 90% 50%, rgba(147,112,219,0.2) 0%, transparent 50%);"></div>
                    
                    <div class="relative flex items-center justify-between">
                        <div class="flex items-center gap-3">
                            <button
                                @click=${this.toggleMenu}
                                class="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 transition touch-feedback border border-white/10">
                                <i data-lucide="menu" class="w-5 h-5"></i>
                            </button>
                            <div class="flex items-center gap-2.5">
                                <div class="w-10 h-10 bg-gradient-to-br from-pink-400 to-purple-500 text-white rounded-xl flex items-center justify-center font-black text-lg shadow-lg shadow-pink-500/30">
                                    ✨
                                </div>
                                <div class="leading-tight">
                                    <p class="text-sm font-bold text-white">BeautyHub</p>
                                    <p class="text-xs text-pink-200/80">Glow with confidence</p>
                                </div>
                            </div>
                        </div>
                        <div class="flex items-center gap-2">
                            <button
                                @click=${this.openCart}
                                class="relative p-2.5 rounded-xl bg-white/10 hover:bg-white/20 transition touch-feedback border border-white/10">
                                <i data-lucide="shopping-bag" class="w-5 h-5"></i>
                                ${this.cartCount > 0 ? this.html`
                                    <span class="absolute -top-1.5 -right-1.5 w-5 h-5 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg">
                                        ${this.cartCount > 9 ? '9+' : this.cartCount}
                                    </span>
                                ` : ''}
                            </button>
                            <button
                                @click=${() => window.dispatchEvent(new CustomEvent('favorites:open'))}
                                class="relative p-2.5 rounded-xl bg-white/10 hover:bg-white/20 transition touch-feedback border border-white/10">
                                <i data-lucide="heart" class="w-5 h-5"></i>
                            </button>
                        </div>
                    </div>

                    <div class="relative mt-3 flex gap-2">
                        <button
                            @click=${this.handleLocationClick}
                            class="flex items-center gap-1.5 px-3 py-2.5 bg-white/10 rounded-xl flex-shrink-0 text-sm font-medium touch-feedback border border-white/10">
                            <i data-lucide="map-pin" class="w-4 h-4 text-pink-300"></i>
                            <span class="truncate max-w-[80px] text-white/90">${this.location}</span>
                            <i data-lucide="chevron-down" class="w-3 h-3 text-white/60"></i>
                        </button>
                        <button
                            @click=${this.handleSearch}
                            class="flex-1 flex items-center gap-2 px-4 py-2.5 bg-white text-gray-800 rounded-xl touch-feedback shadow-lg">
                            <i data-lucide="search" class="w-4 h-4 text-purple-400"></i>
                            <span class="text-sm text-gray-500">Search beauty products...</span>
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
                    <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click=${this.closeMenu}></div>
                    <div class="absolute top-0 left-0 bottom-0 w-[85%] max-w-sm bg-gradient-to-b from-[#1a0a2e] to-[#0f001b] text-white rounded-r-3xl overflow-y-auto shadow-2xl">
                        <!-- Header with Glam -->
                        <div class="relative p-5 bg-gradient-to-r from-[#2D0B52] via-[#4a1c7a] to-[#2D0B52]">
                            <div class="absolute inset-0 opacity-20" style="background-image: radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,182,193,0.15) 0%, transparent 40%);"></div>
                            <div class="relative flex items-center justify-between">
                                <div class="flex items-center gap-3">
                                    <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-400 to-purple-600 flex items-center justify-center shadow-lg">
                                        <span class="text-2xl">✨</span>
                                    </div>
                                    <div>
                                        <p class="text-sm font-bold text-pink-200">Welcome, Beauty!</p>
                                        <p class="text-xs text-white/60">Your glow journey starts here</p>
                                    </div>
                                </div>
                                <button @click=${this.closeMenu} class="p-2.5 rounded-full bg-white/10 hover:bg-white/20 transition">
                                    <i data-lucide="x" class="w-5 h-5"></i>
                                </button>
                            </div>
                            
                            <!-- Login CTA -->
                            <button class="mt-4 w-full py-3 rounded-xl bg-white/10 border border-white/20 text-sm font-semibold flex items-center justify-center gap-2 hover:bg-white/20 transition touch-feedback">
                                <i data-lucide="user" class="w-4 h-4"></i>
                                Sign In for Rewards
                            </button>
                        </div>

                        <div class="p-4 space-y-5">
                            <!-- Quick Navigation -->
                            <div class="grid grid-cols-3 gap-2">
                                <button @click=${() => { this.closeMenu(); navigate('/'); }} class="p-3 rounded-xl bg-white/5 border border-white/10 flex flex-col items-center gap-2 hover:bg-white/10 transition touch-feedback">
                                    <div class="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center">
                                        <i data-lucide="home" class="w-5 h-5 text-white"></i>
                                    </div>
                                    <span class="text-xs font-semibold text-white/80">Home</span>
                                </button>
                                <button @click=${() => { this.closeMenu(); navigate('/products/all'); }} class="p-3 rounded-xl bg-white/5 border border-white/10 flex flex-col items-center gap-2 hover:bg-white/10 transition touch-feedback">
                                    <div class="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                                        <i data-lucide="shopping-bag" class="w-5 h-5 text-white"></i>
                                    </div>
                                    <span class="text-xs font-semibold text-white/80">Shop</span>
                                </button>
                                <button @click=${() => { this.closeMenu(); window.dispatchEvent(new CustomEvent('favorites:open')); }} class="p-3 rounded-xl bg-white/5 border border-white/10 flex flex-col items-center gap-2 hover:bg-white/10 transition touch-feedback">
                                    <div class="w-10 h-10 rounded-full bg-gradient-to-br from-red-400 to-pink-500 flex items-center justify-center">
                                        <i data-lucide="heart" class="w-5 h-5 text-white"></i>
                                    </div>
                                    <span class="text-xs font-semibold text-white/80">Wishlist</span>
                                </button>
                            </div>

                            <!-- Special Offer Banner -->
                            <div class="p-4 rounded-2xl bg-gradient-to-r from-pink-600/30 to-purple-600/30 border border-pink-500/20">
                                <div class="flex items-center gap-3">
                                    <span class="text-3xl">💄</span>
                                    <div class="flex-1">
                                        <p class="text-sm font-bold text-pink-200">GLOW UP SALE</p>
                                        <p class="text-xs text-white/60">Up to 40% off on premium beauty</p>
                                    </div>
                                    <i data-lucide="chevron-right" class="w-5 h-5 text-pink-300"></i>
                                </div>
                            </div>

                            <!-- Shop by Category -->
                            <div>
                                <p class="text-xs font-bold text-purple-300 mb-3 uppercase tracking-wider flex items-center gap-2">
                                    <i data-lucide="sparkles" class="w-3 h-3"></i> Shop by Category
                                </p>
                                <div class="space-y-2">
                                    ${productCategories.map(category => this.html`
                                        <button
                                            @click=${() => { this.closeMenu(); navigate('/products/' + category.id); }}
                                            class="w-full p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3 hover:bg-white/10 transition touch-feedback">
                                            <div class="w-11 h-11 rounded-xl ${category.color} flex items-center justify-center">
                                                <i data-lucide="${category.icon}" class="w-5 h-5 ${category.textColor}"></i>
                                            </div>
                                            <div class="flex-1 text-left">
                                                <p class="font-semibold text-sm text-white">${category.name}</p>
                                                <p class="text-xs text-white/50">Explore collection</p>
                                            </div>
                                            <i data-lucide="chevron-right" class="w-4 h-4 text-white/40"></i>
                                        </button>
                                    `)}
                                </div>
                            </div>

                            <!-- Popular Brands -->
                            <div>
                                <p class="text-xs font-bold text-purple-300 mb-3 uppercase tracking-wider flex items-center gap-2">
                                    <i data-lucide="award" class="w-3 h-3"></i> Top Brands
                                </p>
                                <div class="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
                                    ${['Luxury Beauty', 'GlowLab', 'ColorPop', 'SkinEssence'].map(brand => this.html`
                                        <button
                                            @click=${() => { this.closeMenu(); navigate('/products/all'); }}
                                            class="flex-shrink-0 px-4 py-2.5 rounded-full bg-white/10 border border-white/10 text-xs font-semibold text-white/80 hover:bg-white/20 transition touch-feedback">
                                            ${brand}
                                        </button>
                                    `)}
                                </div>
                            </div>

                            <!-- Help & Support -->
                            <div class="space-y-2 pt-2 border-t border-white/10">
                                <button class="w-full p-3 rounded-xl bg-white/5 flex items-center gap-3 hover:bg-white/10 transition touch-feedback">
                                    <div class="w-9 h-9 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                                        <i data-lucide="headphones" class="w-4 h-4 text-emerald-400"></i>
                                    </div>
                                    <div class="flex-1 text-left">
                                        <p class="text-sm font-semibold text-white">Need Help?</p>
                                        <p class="text-xs text-white/50">24/7 Beauty Support</p>
                                    </div>
                                </button>
                                <button class="w-full p-3 rounded-xl bg-white/5 flex items-center gap-3 hover:bg-white/10 transition touch-feedback">
                                    <div class="w-9 h-9 rounded-lg bg-blue-500/20 flex items-center justify-center">
                                        <i data-lucide="truck" class="w-4 h-4 text-blue-400"></i>
                                    </div>
                                    <div class="flex-1 text-left">
                                        <p class="text-sm font-semibold text-white">Track Order</p>
                                        <p class="text-xs text-white/50">Check delivery status</p>
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
