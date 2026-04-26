import { BaseComponent } from './base-component.js';
import { userStore, shortlistStore } from '../assets/state.js';
import { navigate } from '../assets/router.js';

class AppHeader extends BaseComponent {
    static properties = {
        location: { type: String },
        favoritesCount: { type: Number },
        showSearch: { type: Boolean }
    };

    constructor() {
        super();
        this.location = 'Select Location';
        this.favoritesCount = 0;
        this.showSearch = false;
    }

    connectedCallback() {
        super.connectedCallback();
        this.unsubscribeUser = userStore.subscribe((state) => {
            this.location = state.location;
        });
        this.unsubscribeFavorites = shortlistStore.subscribe(({ count }) => {
            this.favoritesCount = count;
        });

        window.addEventListener('route:changed', () => {
            const path = window.location.hash.slice(1);
            this.showSearch = !path.includes('/search');
        });
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        this.unsubscribeUser?.();
        this.unsubscribeFavorites?.();
    }

    handleSearch() {
        navigate('/search');
    }

    handleLocationClick() {
        // Open location selector modal
        const event = new CustomEvent('open-location-selector', { bubbles: true });
        this.dispatchEvent(event);
    }

    openFavorites() {
        window.dispatchEvent(new CustomEvent('favorites:open'));
    }

    render() {
        const path = window.location.hash.slice(1);
        const isHomePage = path === '/' || path === '';

        return this.html`
            <header class="fixed top-0 left-0 right-0 bg-white dark:bg-gray-800 shadow-sm z-30 transition-colors">
                <!-- Main Header -->
                <div class="flex items-center justify-between px-4 py-3">
                    <!-- Logo & Location -->
                    <div class="flex items-center gap-3 flex-1 min-w-0">
                        ${!isHomePage ? this.html`
                            <button
                                @click=${() => window.history.back()}
                                class="p-1 -ml-1 touch-feedback flex-shrink-0">
                                <i data-lucide="arrow-left" class="w-6 h-6"></i>
                            </button>
                        ` : ''}

                        <div class="flex flex-col min-w-0 flex-1">
                            <!-- Brand Logo -->
                            ${isHomePage ? this.html`
                                <div class="flex items-center gap-2 mb-0.5">
                                    <div class="w-7 h-7 bg-gradient-to-br from-primary-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <span class="text-white font-bold text-sm">Q</span>
                                    </div>
                                    <h1 class="font-bold text-lg text-gray-900 dark:text-white">QuickCart</h1>
                                </div>
                            ` : ''}

                            <!-- Location Selector -->
                            <button
                                @click=${this.handleLocationClick}
                                class="flex items-center gap-1 touch-feedback text-left -ml-1 pl-1">
                                <i data-lucide="map-pin" class="w-4 h-4 text-gray-600 dark:text-gray-400 flex-shrink-0"></i>
                                <span class="text-sm font-medium text-gray-900 dark:text-white truncate">${this.location}</span>
                                <i data-lucide="chevron-down" class="w-3.5 h-3.5 text-gray-600 dark:text-gray-400 flex-shrink-0"></i>
                            </button>
                        </div>
                    </div>

                    <!-- Right Actions -->
                    <div class="flex items-center gap-1">
                        <button
                            @click=${this.openFavorites}
                            class="p-2 touch-feedback relative">
                            <i data-lucide="heart" class="w-6 h-6 text-gray-700 dark:text-gray-300"></i>
                            ${this.favoritesCount > 0 ? this.html`
                                <span class="absolute -top-0.5 -right-0.5 bg-primary-500 text-white text-[10px] font-semibold rounded-full w-4 h-4 flex items-center justify-center">
                                    ${this.favoritesCount > 9 ? '9+' : this.favoritesCount}
                                </span>
                            ` : ''}
                        </button>
                        <theme-toggle></theme-toggle>
                        <button
                            @click=${this.handleSearch}
                            class="p-2 touch-feedback">
                            <i data-lucide="search" class="w-6 h-6 text-gray-700 dark:text-gray-300"></i>
                        </button>
                        <button
                            @click=${() => navigate('/')}
                            class="p-2 touch-feedback">
                            <i data-lucide="user" class="w-6 h-6 text-gray-700 dark:text-gray-300"></i>
                        </button>
                    </div>
                </div>

                <!-- Search Bar (on homepage only) -->
                ${this.showSearch ? this.html`
                    <div class="px-4 pb-3">
                        <button
                            @click=${this.handleSearch}
                            class="w-full flex items-center gap-3 px-4 py-2.5 bg-gray-100 dark:bg-gray-700 rounded-xl touch-feedback transition-colors">
                            <i data-lucide="search" class="w-5 h-5 text-gray-400 dark:text-gray-500"></i>
                            <span class="text-gray-500 dark:text-gray-400 text-sm">Search for "amul butter"</span>
                        </button>
                    </div>
                ` : ''}
            </header>

            <div style="height: ${this.showSearch ? '120px' : '64px'}"></div>
        `;
    }
}

customElements.define('app-header', AppHeader);
