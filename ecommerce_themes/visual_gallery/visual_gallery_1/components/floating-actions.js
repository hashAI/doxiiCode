import { BaseComponent } from './base-component.js';
import { cartStore, shortlistStore } from '../assets/state.js';
import { navigate } from '../assets/router.js';

class FloatingActions extends BaseComponent {
    static properties = {
        cartCount: { type: Number },
        wishlistCount: { type: Number },
        isVisible: { type: Boolean },
        lastScrollY: { type: Number },
        currentPath: { type: String }
    };

    constructor() {
        super();
        this.cartCount = 0;
        this.wishlistCount = 0;
        this.isVisible = true;
        this.lastScrollY = 0;
        this.currentPath = '/';
    }

    connectedCallback() {
        super.connectedCallback();

        this.unsubscribeCart = cartStore.subscribe((state) => {
            this.cartCount = state.count;
        });

        this.unsubscribeWishlist = shortlistStore.subscribe((state) => {
            this.wishlistCount = state.items.length;
        });

        // Hide on scroll down, show on scroll up
        this.scrollHandler = () => {
            const currentScrollY = window.scrollY;
            if (currentScrollY > this.lastScrollY && currentScrollY > 100) {
                this.isVisible = false;
            } else {
                this.isVisible = true;
            }
            this.lastScrollY = currentScrollY;
        };
        window.addEventListener('scroll', this.scrollHandler, { passive: true });

        window.addEventListener('route:changed', () => {
            this.currentPath = window.location.hash.slice(1) || '/';
        });
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        this.unsubscribeCart?.();
        this.unsubscribeWishlist?.();
        window.removeEventListener('scroll', this.scrollHandler);
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

    isActive(path) {
        if (path === '/' && (this.currentPath === '/' || this.currentPath === '')) return true;
        if (path === '/products' && this.currentPath.includes('/products')) return true;
        if (path === '/search' && this.currentPath.includes('/search')) return true;
        return false;
    }

    render() {
        return this.html`
            <!-- Mobile Floating Action Bar -->
            <div class="lg:hidden fixed bottom-0 left-0 right-0 z-50 transition-transform duration-300 ${this.isVisible ? 'translate-y-0' : 'translate-y-full'}">
                <div class="px-4 pb-4">
                    <div class="action-bar rounded-full px-2 py-2 flex items-center justify-around gap-1">
                        <!-- Home -->
                        <button
                            @click=${() => navigate('/')}
                            class="flex flex-col items-center gap-1 px-4 py-2 rounded-full ${this.isActive('/') ? 'bg-gold-400/10' : ''} transition-colors touch-scale">
                            <i data-lucide="home" class="w-5 h-5 ${this.isActive('/') ? 'text-gold-400' : 'text-noir-400'}"></i>
                        </button>

                        <!-- Collections -->
                        <button
                            @click=${() => navigate('/products/all')}
                            class="flex flex-col items-center gap-1 px-4 py-2 rounded-full ${this.isActive('/products') ? 'bg-gold-400/10' : ''} transition-colors touch-scale">
                            <i data-lucide="gem" class="w-5 h-5 ${this.isActive('/products') ? 'text-gold-400' : 'text-noir-400'}"></i>
                        </button>

                        <!-- Search -->
                        <button
                            @click=${this.openSearch}
                            class="flex flex-col items-center gap-1 px-4 py-2 rounded-full ${this.isActive('/search') ? 'bg-gold-400/10' : ''} transition-colors touch-scale">
                            <i data-lucide="search" class="w-5 h-5 ${this.isActive('/search') ? 'text-gold-400' : 'text-noir-400'}"></i>
                        </button>

                        <!-- Wishlist -->
                        <button
                            @click=${this.openWishlist}
                            class="relative flex flex-col items-center gap-1 px-4 py-2 rounded-full transition-colors touch-scale">
                            <i data-lucide="heart" class="w-5 h-5 text-noir-400"></i>
                            ${this.wishlistCount > 0 ? this.html`
                                <span class="absolute top-1 right-2 w-4 h-4 bg-gold-400 text-noir-900 text-[9px] font-bold rounded-full flex items-center justify-center">
                                    ${this.wishlistCount > 9 ? '9+' : this.wishlistCount}
                                </span>
                            ` : ''}
                        </button>

                        <!-- Cart -->
                        <button
                            @click=${this.openCart}
                            class="relative flex flex-col items-center gap-1 px-4 py-2 rounded-full transition-colors touch-scale">
                            <i data-lucide="shopping-bag" class="w-5 h-5 text-noir-400"></i>
                            ${this.cartCount > 0 ? this.html`
                                <span class="absolute top-1 right-2 w-4 h-4 bg-gold-400 text-noir-900 text-[9px] font-bold rounded-full flex items-center justify-center">
                                    ${this.cartCount > 9 ? '9+' : this.cartCount}
                                </span>
                            ` : ''}
                        </button>
                    </div>
                </div>
            </div>

            <!-- Desktop: Floating Filter Button (shown on collections page) -->
            ${this.currentPath.includes('/products') ? this.html`
                <button
                    @click=${() => window.dispatchEvent(new CustomEvent('filter:open'))}
                    class="hidden lg:flex fixed bottom-8 right-8 z-50 items-center gap-2 px-5 py-3 bg-noir-800 hover:bg-noir-700 border border-gold-400/20 hover:border-gold-400/40 text-noir-100 text-sm transition-all shadow-lg">
                    <i data-lucide="sliders-horizontal" class="w-4 h-4 text-gold-400"></i>
                    <span class="tracking-wide">Filters</span>
                </button>
            ` : ''}
        `;
    }
}

customElements.define('floating-actions', FloatingActions);
