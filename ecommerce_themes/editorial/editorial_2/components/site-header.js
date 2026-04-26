import { BaseComponent } from './base-component.js';
import { cartStore, preferencesStore, eventBus, shortlistStore, userStore } from '../assets/state.js';

class SiteHeader extends BaseComponent {
    static properties = {
        mobileOpen: { state: true },
        cartCount: { state: true },
        favoritesCount: { state: true },
        location: { state: true },
        theme: { state: true }
    };

    constructor() {
        super();
        this.mobileOpen = false;
        this.cartCount = 0;
        this.favoritesCount = 0;
        this.location = 'Select Location';
        this.theme = preferencesStore.get('theme') || 'light';
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
    }

    disconnectedCallback() {
        this.unsubscribeCart?.();
        this.unsubscribeFavorites?.();
        this.unsubscribeUser?.();
        this.unsubscribePrefs?.();
        document.body.classList.remove('overflow-hidden');
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
        document.body.classList.remove('overflow-hidden');
    }

    get navItems() {
        return [
            { label: 'Home', path: '/' },
            { label: 'Products', path: '/products/all' }
        ];
    }

    render() {
        return this.html`
            <header class="fixed top-0 inset-x-0 z-40 bg-white dark:bg-ink-900 border-b border-ink-100 dark:border-ink-800">
                <div class="hidden lg:block text-center text-xs tracking-[0.35em] uppercase py-2 bg-ink-900 text-white">
                    Capsule 08 just landed · Complimentary 2-day shipping over $200
                </div>
                <div class="mx-auto max-w-6xl px-4">
                    <div class="flex items-center justify-between h-[var(--header-height)]">
                        <button class="lg:hidden" aria-label="Toggle menu" @click=${() => this.toggleMobile()}>
                            <i data-lucide="${this.mobileOpen ? 'x' : 'menu'}" class="w-6 h-6"></i>
                        </button>
                        <a href="#/" class="font-display text-2xl tracking-tight">Store Name</a>
                        <nav class="hidden lg:flex items-center gap-8 text-sm uppercase tracking-[0.2em]">
                            ${this.navItems.map(item => this.html`
                                <button
                                    class="pb-1 border-b-2 border-transparent hover:border-ink-900 dark:hover:border-white transition"
                                    @click=${() => this.navigateTo(item.path)}
                                >
                                    ${item.label}
                                </button>
                            `)}
                        </nav>
                        <div class="flex items-center gap-2">
                            <button aria-label="Location" class="hidden lg:block p-2 rounded-full hover:bg-ink-50 dark:hover:bg-ink-800" @click=${() => this.openLocation()} title="${this.location}">
                                <i data-lucide="map-pin" class="w-5 h-5"></i>
                            </button>
                            <button aria-label="Favorites" class="hidden lg:block p-2 rounded-full hover:bg-ink-50 dark:hover:bg-ink-800 relative" @click=${() => this.openFavorites()}>
                                <i data-lucide="heart" class="w-5 h-5"></i>
                                ${this.favoritesCount > 0 ? this.html`
                                    <span class="absolute -top-0.5 -right-0.5 bg-ink-900 dark:bg-white text-white dark:text-ink-900 text-[10px] font-semibold rounded-full w-4 h-4 flex items-center justify-center">
                                        ${this.favoritesCount > 9 ? '9+' : this.favoritesCount}
                                    </span>
                                ` : ''}
                            </button>
                            <button aria-label="Search" class="hidden lg:block p-2 rounded-full hover:bg-ink-50 dark:hover:bg-ink-800">
                                <i data-lucide="search" class="w-5 h-5"></i>
                            </button>
                            <button aria-label="Toggle theme" class="hidden lg:block p-2 rounded-full hover:bg-ink-50 dark:hover:bg-ink-800" @click=${() => this.toggleTheme()}>
                                <i data-lucide=${this.theme === 'dark' ? 'sun' : 'moon'} class="w-5 h-5"></i>
                            </button>
                            <button aria-label="Account" class="hidden lg:block p-2 rounded-full hover:bg-ink-50 dark:hover:bg-ink-800">
                                <i data-lucide="user" class="w-5 h-5"></i>
                            </button>
                            <button
                                class="px-4 py-2 rounded-full bg-ink-900 dark:bg-white text-white dark:text-ink-900 flex items-center gap-2"
                                @click=${() => this.openCart()}
                                aria-label="Open cart"
                            >
                                <i data-lucide="shopping-bag" class="w-5 h-5"></i>
                                <span class="hidden lg:inline">${this.cartCount}</span>
                                <span class="lg:hidden">${this.cartCount}</span>
                            </button>
                        </div>
                    </div>
                </div>
                ${this.mobileMenuTemplate()}
            </header>
            <div class="h-[var(--header-height)] lg:h-[calc(var(--header-height)+2.5rem)]"></div>
        `;
    }

    mobileMenuTemplate() {
        const containerClasses = [
            'lg:hidden fixed inset-x-0 top-[var(--header-height)] z-50',
            'bg-white dark:bg-ink-900 transition-all duration-300 border-t border-ink-100 dark:border-ink-800',
            this.mobileOpen ? 'translate-y-0 opacity-100 pointer-events-auto' : '-translate-y-full opacity-0 pointer-events-none'
        ].join(' ');

        return this.html`
            <div class="${containerClasses}" aria-hidden=${this.mobileOpen ? 'false' : 'true'} style="height: calc(100vh - var(--header-height)); height: calc(100dvh - var(--header-height));">
                <div class="h-full overflow-y-auto px-6 pt-8 pb-16 flex flex-col gap-6">
                    ${this.navItems.map(item => this.html`
                        <button class="text-left text-lg uppercase tracking-[0.3em] hover:text-ink-900 dark:hover:text-white transition" @click=${() => this.navigateTo(item.path)}>
                            ${item.label}
                        </button>
                    `)}

                    <div class="pt-6 border-t border-ink-100 dark:border-ink-800 space-y-4">
                        <p class="text-xs uppercase tracking-[0.4em] text-ink-400">Tools</p>

                        <button class="w-full flex items-center justify-between px-4 py-3 rounded-full border border-ink-200 dark:border-ink-700 hover:bg-ink-50 dark:hover:bg-ink-800 transition" @click=${() => { this.openLocation(); this.mobileOpen = false; }}>
                            <span class="flex items-center gap-3">
                                <i data-lucide="map-pin" class="w-5 h-5"></i>
                                <span>Location</span>
                            </span>
                            <span class="text-xs text-ink-400">${this.location}</span>
                        </button>

                        <button class="w-full flex items-center justify-between px-4 py-3 rounded-full border border-ink-200 dark:border-ink-700 hover:bg-ink-50 dark:hover:bg-ink-800 transition" @click=${() => { this.openFavorites(); this.mobileOpen = false; }}>
                            <span class="flex items-center gap-3">
                                <i data-lucide="heart" class="w-5 h-5"></i>
                                <span>Favorites</span>
                            </span>
                            ${this.favoritesCount > 0 ? this.html`<span class="text-xs bg-ink-900 dark:bg-white text-white dark:text-ink-900 px-2 py-0.5 rounded-full">${this.favoritesCount}</span>` : ''}
                        </button>

                        <button class="w-full flex items-center justify-between px-4 py-3 rounded-full border border-ink-200 dark:border-ink-700 hover:bg-ink-50 dark:hover:bg-ink-800 transition">
                            <span class="flex items-center gap-3">
                                <i data-lucide="search" class="w-5 h-5"></i>
                                <span>Search</span>
                            </span>
                        </button>

                        <button class="w-full flex items-center justify-between px-4 py-3 rounded-full border border-ink-200 dark:border-ink-700 hover:bg-ink-50 dark:hover:bg-ink-800 transition" @click=${() => this.toggleTheme()}>
                            <span class="flex items-center gap-3">
                                <i data-lucide=${this.theme === 'dark' ? 'sun' : 'moon'} class="w-5 h-5"></i>
                                <span>${this.theme === 'dark' ? 'Light' : 'Dark'} mode</span>
                            </span>
                        </button>

                        <button class="w-full flex items-center justify-between px-4 py-3 rounded-full border border-ink-200 dark:border-ink-700 hover:bg-ink-50 dark:hover:bg-ink-800 transition">
                            <span class="flex items-center gap-3">
                                <i data-lucide="user" class="w-5 h-5"></i>
                                <span>Account</span>
                            </span>
                        </button>
                    </div>

                    <div class="pt-6 border-t border-ink-100 dark:border-ink-800 space-y-4">
                        <p class="text-xs uppercase tracking-[0.4em] text-ink-400">About</p>
                        <p class="text-sm text-ink-500 dark:text-ink-200">
                            Studio visits, playlists, and the craft stories behind each drop.
                        </p>
                    </div>
                </div>
            </div>
        `;
    }
}

customElements.define('site-header', SiteHeader);

