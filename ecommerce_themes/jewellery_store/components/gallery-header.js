import { BaseComponent } from './base-component.js';
import { cartStore, shortlistStore } from '../assets/state.js';
import { navigate } from '../assets/router.js';

class GalleryHeader extends BaseComponent {
    static properties = {
        cartCount: { type: Number },
        wishlistCount: { type: Number },
        isScrolled: { type: Boolean },
        currentPage: { type: String }
    };

    constructor() {
        super();
        this.cartCount = 0;
        this.wishlistCount = 0;
        this.isScrolled = false;
        this.currentPage = 'home';
    }

    connectedCallback() {
        super.connectedCallback();

        this.unsubscribeCart = cartStore.subscribe((state) => {
            this.cartCount = state.count;
        });

        this.unsubscribeWishlist = shortlistStore.subscribe((state) => {
            this.wishlistCount = state.items.length;
        });

        this.scrollHandler = () => {
            this.isScrolled = window.scrollY > 50;
        };
        window.addEventListener('scroll', this.scrollHandler, { passive: true });

        window.addEventListener('route:changed', () => {
            const path = window.location.hash.slice(1);
            if (path === '/' || path === '') {
                this.currentPage = 'home';
            } else if (path.includes('/products')) {
                this.currentPage = 'collections';
            } else if (path.includes('/product')) {
                this.currentPage = 'product';
            } else {
                this.currentPage = 'other';
            }
        });
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        this.unsubscribeCart?.();
        this.unsubscribeWishlist?.();
        window.removeEventListener('scroll', this.scrollHandler);
    }

    openMenu() {
        window.dispatchEvent(new CustomEvent('menu:open'));
    }

    openCart() {
        window.dispatchEvent(new CustomEvent('cart:open'));
    }

    openWishlist() {
        window.dispatchEvent(new CustomEvent('collection:open'));
    }

    openSearch() {
        navigate('/search');
    }

    render() {
        return this.html`
            <!-- Desktop Header -->
            <header class="fixed top-0 left-0 right-0 z-50 hidden lg:block transition-all duration-500 ${this.isScrolled ? 'py-4' : 'py-6'}">
                <div class="max-w-[1600px] mx-auto px-8 xl:px-12">
                    <div class="flex items-center justify-between ${this.isScrolled ? 'glass-dark rounded-full px-8 py-3 border border-gold-400/10' : ''}">
                        <!-- Left: Menu Trigger -->
                        <button
                            @click=${this.openMenu}
                            class="group flex items-center gap-3 text-noir-300 hover:text-gold-400 transition-colors">
                            <div class="flex flex-col gap-1.5">
                                <span class="block w-6 h-px bg-current group-hover:w-5 transition-all"></span>
                                <span class="block w-4 h-px bg-current group-hover:w-6 transition-all"></span>
                            </div>
                            <span class="text-xs font-medium tracking-ultrawide uppercase">Menu</span>
                        </button>

                        <!-- Center: Logo -->
                        <a href="#/" @click=${() => navigate('/')} class="absolute left-1/2 -translate-x-1/2 group">
                            <div class="text-center">
                                <h1 class="text-2xl xl:text-3xl font-display font-medium text-noir-50 tracking-widest group-hover:text-gold-400 transition-colors">
                                    AURÉA
                                </h1>
                                <p class="text-[10px] text-noir-400 tracking-megawide uppercase mt-0.5">Atelier</p>
                            </div>
                        </a>

                        <!-- Right: Actions -->
                        <div class="flex items-center gap-6">
                            <theme-toggle></theme-toggle>
                            
                            <button
                                @click=${this.openSearch}
                                class="text-noir-300 hover:text-gold-400 transition-colors hover-line">
                                <span class="text-xs font-medium tracking-ultrawide uppercase">Search</span>
                            </button>

                            <button
                                @click=${this.openWishlist}
                                class="relative group text-noir-300 hover:text-gold-400 transition-colors">
                                <span class="text-xs font-medium tracking-ultrawide uppercase hover-line">Collection</span>
                                ${this.wishlistCount > 0 ? this.html`
                                    <span class="absolute -top-2 -right-3 w-4 h-4 bg-gold-400 text-noir-900 text-[10px] font-bold rounded-full flex items-center justify-center">
                                        ${this.wishlistCount}
                                    </span>
                                ` : ''}
                            </button>

                            <button
                                @click=${this.openCart}
                                class="relative flex items-center gap-2 px-5 py-2 border border-gold-400/30 hover:border-gold-400 hover:bg-gold-400/5 text-noir-100 transition-all group">
                                <span class="text-xs font-medium tracking-ultrawide uppercase">Cart</span>
                                ${this.cartCount > 0 ? this.html`
                                    <span class="px-1.5 py-0.5 bg-gold-400 text-noir-900 text-[10px] font-bold">
                                        ${this.cartCount}
                                    </span>
                                ` : this.html`
                                    <span class="text-[10px] text-noir-500">(0)</span>
                                `}
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <!-- Mobile Header -->
            <header class="fixed top-0 left-0 right-0 z-50 lg:hidden transition-all duration-300 ${this.isScrolled ? 'py-3' : 'py-4'}">
                <div class="px-5">
                    <div class="flex items-center justify-between ${this.isScrolled ? 'glass-dark rounded-full px-5 py-3 border border-gold-400/10' : ''}">
                        <!-- Menu -->
                        <button
                            @click=${this.openMenu}
                            class="p-2 -ml-2 text-noir-300 hover:text-gold-400 transition-colors touch-scale">
                            <div class="flex flex-col gap-1.5">
                                <span class="block w-5 h-px bg-current"></span>
                                <span class="block w-3 h-px bg-current"></span>
                            </div>
                        </button>

                        <!-- Logo -->
                        <a href="#/" @click=${() => navigate('/')} class="absolute left-1/2 -translate-x-1/2">
                            <h1 class="text-xl font-display font-medium text-noir-50 tracking-wider">AURÉA</h1>
                        </a>

                        <!-- Right Actions -->
                        <div class="flex items-center gap-2">
                            <theme-toggle></theme-toggle>
                            
                            <button
                                @click=${this.openCart}
                                class="relative p-2 -mr-2 text-noir-300 hover:text-gold-400 transition-colors touch-scale">
                                <i data-lucide="shopping-bag" class="w-5 h-5"></i>
                                ${this.cartCount > 0 ? this.html`
                                    <span class="absolute top-0 right-0 w-4 h-4 bg-gold-400 text-noir-900 text-[10px] font-bold rounded-full flex items-center justify-center">
                                        ${this.cartCount}
                                    </span>
                                ` : ''}
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <!-- Spacer -->
            <div class="h-20 lg:h-24"></div>
        `;
    }
}

customElements.define('gallery-header', GalleryHeader);
