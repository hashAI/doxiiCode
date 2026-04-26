import { BaseComponent } from './base-component.js';
import { productsStore } from '../assets/state.js';
import { navigate } from '../assets/router.js';
import { formatCurrency } from '../assets/utils.js';

class SearchOverlay extends BaseComponent {
    static properties = {
        isOpen: { type: Boolean },
        query: { type: String },
        results: { type: Array }
    };

    constructor() {
        super();
        this.isOpen = false;
        this.query = '';
        this.results = [];
    }

    connectedCallback() {
        super.connectedCallback();
        window.addEventListener('search:toggle', () => this.toggle());
        window.addEventListener('search:open', () => this.open());
        window.addEventListener('search:close', () => this.close());

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                this.toggle();
            }
        });
    }

    open() {
        this.isOpen = true;
        document.body.style.overflow = 'hidden';
        setTimeout(() => {
            this.querySelector('input')?.focus();
        }, 100);
    }

    close() {
        this.isOpen = false;
        this.query = '';
        this.results = [];
        document.body.style.overflow = '';
    }

    toggle() {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }

    handleInput(e) {
        this.query = e.target.value;
        this.search();
    }

    search() {
        if (!this.query.trim()) {
            this.results = [];
            return;
        }

        const q = this.query.toLowerCase();
        this.results = productsStore.products.filter(product =>
            product.name.toLowerCase().includes(q) ||
            product.category.toLowerCase().includes(q) ||
            product.tagline.toLowerCase().includes(q) ||
            product.description.toLowerCase().includes(q)
        ).slice(0, 6);
    }

    goToProduct(productId) {
        this.close();
        navigate(`/product/${productId}`);
    }

    goToCategory(category) {
        this.close();
        navigate(`/products/${category}`);
    }

    render() {
        const quickLinks = [
            { name: 'Shop Gifts', path: '/products/all', icon: 'gift' },
            { name: 'Find a Store', path: '#stores', icon: 'map-pin' },
            { name: 'Apple Gift Card', path: '#giftcard', icon: 'credit-card' },
            { name: 'Apple Vision Pro', path: '/products/Vision', icon: 'glasses' },
            { name: 'Apple Trade In', path: '#tradein', icon: 'refresh-cw' }
        ];

        return this.html`
            <!-- Full Screen Overlay -->
            <div
                class="fixed inset-0 z-50 transition-all duration-300 ${
                    this.isOpen ? 'pointer-events-auto' : 'pointer-events-none'
                }">
                
                <!-- White Background -->
                <div class="absolute inset-0 bg-white transition-opacity duration-300 ${
                    this.isOpen ? 'opacity-100' : 'opacity-0'
                }"></div>

                <!-- Content -->
                <div class="relative h-full flex flex-col">
                    <!-- Header with Close -->
                    <div class="flex justify-end p-4">
                        <button 
                            @click=${this.close}
                            class="p-3 text-apple-gray/60 hover:text-apple-gray transition-colors ${
                                this.isOpen ? 'opacity-100' : 'opacity-0'
                            }"
                            style="transition-delay: ${this.isOpen ? '100ms' : '0ms'}">
                            <svg class="w-5 h-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
                                <path d="M5 5l10 10M15 5l-10 10"/>
                            </svg>
                        </button>
                    </div>

                    <!-- Search Input -->
                    <div class="px-8 md:px-16 lg:px-24">
                        <div 
                            class="flex items-center gap-4 transform transition-all duration-300 ${
                                this.isOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                            }"
                            style="transition-delay: ${this.isOpen ? '50ms' : '0ms'}">
                            <svg class="w-6 h-6 text-gray-400 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="11" cy="11" r="8"/>
                                <path d="M21 21l-4.35-4.35"/>
                            </svg>
                            <input 
                                type="text"
                                .value=${this.query}
                                @input=${this.handleInput}
                                placeholder="Search"
                                class="flex-1 text-3xl md:text-4xl font-light text-apple-gray placeholder-gray-300 bg-transparent outline-none border-none">
                            ${this.query ? this.html`
                                <button 
                                    @click=${() => { this.query = ''; this.results = []; }}
                                    class="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                                    <svg class="w-5 h-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                                        <circle cx="10" cy="10" r="8"/>
                                        <path d="M7 7l6 6M13 7l-6 6"/>
                                    </svg>
                                </button>
                            ` : ''}
                        </div>
                    </div>

                    <!-- Search Results or Quick Links -->
                    <div class="flex-1 overflow-y-auto px-8 md:px-16 lg:px-24 py-8">
                        ${this.query && this.results.length > 0 ? this.html`
                            <!-- Search Results -->
                            <div 
                                class="transform transition-all duration-300 ${this.isOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}"
                                style="transition-delay: 100ms">
                                <h3 class="text-sm text-gray-400 mb-4">Products</h3>
                                <div class="space-y-2">
                                    ${this.results.map(product => this.html`
                                        <button 
                                            @click=${() => this.goToProduct(product.id)}
                                            class="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-apple-lightgray transition-colors text-left">
                                            <div class="w-12 h-12 bg-apple-lightgray rounded-xl flex-shrink-0 overflow-hidden">
                                                <img src="${product.image}" alt="${product.name}" class="w-full h-full object-contain p-1">
                                            </div>
                                            <div class="flex-1 min-w-0">
                                                <h4 class="font-medium text-apple-gray">${product.name}</h4>
                                                <p class="text-sm text-gray-500">${formatCurrency(product.price)}</p>
                                            </div>
                                            <svg class="w-5 h-5 text-gray-400 flex-shrink-0" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5">
                                                <path d="M7 4l6 6-6 6"/>
                                            </svg>
                                        </button>
                                    `)}
                                </div>
                            </div>
                        ` : this.query && this.results.length === 0 ? this.html`
                            <!-- No Results -->
                            <div 
                                class="text-center py-16 transform transition-all duration-300 ${this.isOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}">
                                <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                                    <circle cx="11" cy="11" r="8"/>
                                    <path d="M21 21l-4.35-4.35"/>
                                    <path d="M8 11h6"/>
                                </svg>
                                <h3 class="text-xl font-semibold text-apple-gray mb-2">No results found</h3>
                                <p class="text-gray-500">Try searching for something else</p>
                            </div>
                        ` : this.html`
                            <!-- Quick Links -->
                            <div 
                                class="transform transition-all duration-300 ${this.isOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}"
                                style="transition-delay: 100ms">
                                <h3 class="text-sm text-gray-400 mb-4">Quick Links</h3>
                                <div class="space-y-1">
                                    ${quickLinks.map((link, index) => this.html`
                                        <button 
                                            @click=${() => this.goToCategory(link.path)}
                                            class="w-full flex items-center gap-4 py-3 text-left hover:bg-apple-lightgray rounded-xl px-3 -mx-3 transition-colors transform ${this.isOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}"
                                            style="transition-delay: ${this.isOpen ? `${150 + index * 50}ms` : '0ms'}">
                                            <svg class="w-5 h-5 text-gray-400" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5">
                                                <path d="M7 4l6 6-6 6"/>
                                            </svg>
                                            <span class="font-semibold text-apple-gray">${link.name}</span>
                                        </button>
                                    `)}
                                </div>
                            </div>
                        `}
                    </div>
                </div>
            </div>
        `;
    }
}

customElements.define('search-overlay', SearchOverlay);
