import { BaseComponent } from '../base-component.js';
import { productsStore, categoriesMeta } from '../../assets/state.js';
import { navigate } from '../../assets/router.js';
import { formatCurrency, getImageUrl } from '../../assets/utils.js';

class ProductsPage extends BaseComponent {
    static properties = {
        category: { type: String },
        products: { type: Array },
        categoryMeta: { type: Object },
        selectedProductIndex: { type: Number },
        compareModalOpen: { type: Boolean },
        compareTab: { type: String }
    };

    constructor() {
        super();
        this.category = '';
        this.products = [];
        this.categoryMeta = null;
        this.selectedProductIndex = 0;
        this.compareModalOpen = false;
        this.compareTab = 'design';
    }

    connectedCallback() {
        super.connectedCallback();
        const params = this.getParams();
        this.category = params.category || '';
        
        if (this.category === 'all') {
            this.products = productsStore.products;
            this.categoryMeta = {
                id: 'all',
                name: 'Store',
                description: 'Shop the latest Apple products.',
                image: getImageUrl('apple store products display', 1000, 0)
            };
        } else {
            this.products = productsStore.getByCategory(this.category);
            this.categoryMeta = categoriesMeta.find(cat => cat.id.toLowerCase() === this.category.toLowerCase());
        }
    }

    openCompareModal() {
        this.compareModalOpen = true;
        document.body.style.overflow = 'hidden';
    }

    closeCompareModal() {
        this.compareModalOpen = false;
        document.body.style.overflow = '';
    }

    setCompareTab(tab) {
        this.compareTab = tab;
    }

    getColorCode(colorName) {
        const colors = {
            'Black Titanium': '#1d1d1f',
            'White Titanium': '#f5f5f0',
            'Natural Titanium': '#c4b6a6',
            'Blue Titanium': '#6e7b8b',
            'Black': '#1d1d1f',
            'White': '#f5f5f7',
            'Pink': '#f9d1cf',
            'Teal': '#5f9ea0',
            'Ultramarine': '#1e3a8a',
            'Blue': '#1e3a8a',
            'Green': '#2e8b57',
            'Yellow': '#ffd700',
            'Purple': '#9370db',
            'Midnight': '#1d1d1f',
            'Starlight': '#f5f5dc',
            'Space Gray': '#4a4a4a',
            'Silver': '#c0c0c0',
            'Red': '#dc143c',
            'Orange': '#ff8c00',
            'Space Black': '#1d1d1f',
            'Natural': '#c4b6a6'
        };
        return colors[colorName] || '#888';
    }

    render() {
        if (!this.categoryMeta) {
            return this.html`
                <div class="min-h-[60vh] flex items-center justify-center">
                    <p class="text-gray-500 text-xl">Category not found</p>
                </div>
            `;
        }

        const switchCards = [
            {
                title: 'Getting Started',
                headline: `Switching from Android to ${this.categoryMeta.name} is simple.`,
                image: getImageUrl('person switching phone android to iphone', 600, 0)
            },
            {
                title: 'Designed to Last',
                headline: `${this.categoryMeta.name} is built for the long run.`,
                image: getImageUrl('premium device durability quality', 600, 1)
            }
        ];

        return this.html`
            <div class="bg-white min-h-screen">
                <!-- Sticky Product Nav (appears on scroll) -->
                <div class="hidden md:block sticky top-12 z-30 product-sticky-nav border-b border-gray-200">
                    <div class="max-w-[980px] mx-auto px-4 flex items-center justify-between h-12">
                        <h3 class="font-semibold text-apple-gray">${this.categoryMeta.name}</h3>
                        <div class="flex items-center gap-4">
                            <button class="apple-button text-sm py-1.5 px-4">Explore</button>
                            <button class="apple-button apple-button-dark text-sm py-1.5 px-4">Buy</button>
                        </div>
                    </div>
                </div>

                <!-- Category Hero -->
                <section class="bg-apple-lightgray pt-12 pb-8 px-4">
                    <div class="max-w-[980px] mx-auto">
                        <h1 class="text-5xl md:text-7xl font-semibold text-apple-gray tracking-tight mb-8">
                            ${this.categoryMeta.name}
                        </h1>
                        
                        <!-- Product Quick Nav - Horizontal Scroll -->
                        <div class="relative">
                            <div class="flex gap-8 overflow-x-auto pb-4 scrollbar-hide scroll-snap-x">
                                ${this.products.map((product, index) => this.html`
                                    <button 
                                        @click=${() => navigate(`/product/${product.id}`)}
                                        class="flex-shrink-0 scroll-snap-item text-center group">
                                        <div class="w-24 h-24 md:w-32 md:h-32 mb-3 transition-transform group-hover:scale-105">
                                            <img 
                                                src="${product.image}" 
                                                alt="${product.name}"
                                                class="w-full h-full object-contain">
                                        </div>
                                        <p class="text-sm font-medium text-apple-gray whitespace-nowrap">${product.name}</p>
                                        ${product.badge ? this.html`
                                            <p class="text-xs text-apple-orange mt-1">${product.badge}</p>
                                        ` : ''}
                                    </button>
                                `)}
                            </div>
                            <!-- Scroll Arrow -->
                            <button class="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur rounded-full shadow-lg flex items-center justify-center hover:bg-white transition-colors">
                                <svg class="w-5 h-5 text-apple-gray" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M7 4l6 6-6 6"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                </section>

                <!-- Switch To Section -->
                <section class="py-12 px-4">
                    <div class="max-w-[980px] mx-auto">
                        <h2 class="text-3xl md:text-4xl font-semibold text-apple-gray tracking-tight mb-8">
                            Switch to ${this.categoryMeta.name}.
                        </h2>
                        <div class="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                            ${switchCards.map(card => this.html`
                                <div class="flex-shrink-0 w-80 md:w-96 bg-apple-lightgray rounded-2xl overflow-hidden cursor-pointer hover:scale-[1.02] transition-transform">
                                    <div class="p-6">
                                        <p class="text-sm text-gray-500 mb-2">${card.title}</p>
                                        <h3 class="text-xl md:text-2xl font-semibold text-apple-gray mb-4 leading-tight">
                                            ${card.headline}
                                        </h3>
                                    </div>
                                    <img 
                                        src="${card.image}" 
                                        alt="${card.title}"
                                        class="w-full h-48 object-cover">
                                </div>
                            `)}
                        </div>
                    </div>
                </section>

                <!-- Explore the Lineup Section -->
                <section class="py-12 px-4 bg-white">
                    <div class="max-w-6xl mx-auto">
                        <div class="flex items-center justify-between mb-8">
                            <h2 class="text-3xl md:text-4xl font-semibold text-apple-gray tracking-tight">
                                Explore the lineup.
                            </h2>
                            <button 
                                @click=${this.openCompareModal}
                                class="text-apple-blue hover:underline text-sm md:text-base">
                                Compare all models ›
                            </button>
                        </div>

                        <!-- Product Carousel -->
                        <div class="relative">
                            <div class="flex gap-6 overflow-x-auto pb-6 scrollbar-hide scroll-snap-x -mx-4 px-4">
                                ${this.products.map((product, index) => this.html`
                                    <div 
                                        class="flex-shrink-0 w-80 scroll-snap-item"
                                        @click=${() => navigate(`/product/${product.id}`)}>
                                        
                                        <!-- Product Image Card -->
                                        <div class="bg-black rounded-3xl overflow-hidden mb-4 cursor-pointer hover:scale-[1.02] transition-transform">
                                            <div class="aspect-square p-8 flex items-center justify-center">
                                                <img 
                                                    src="${product.image}" 
                                                    alt="${product.name}"
                                                    class="max-w-full max-h-full object-contain">
                                            </div>
                                        </div>

                                        <!-- Color Swatches -->
                                        ${product.colors && product.colors.length > 1 ? this.html`
                                            <div class="flex gap-2 mb-3">
                                                ${product.colors.slice(0, 4).map(color => this.html`
                                                    <div 
                                                        class="w-4 h-4 rounded-full border border-gray-300"
                                                        style="background: ${this.getColorCode(color)}"
                                                        title="${color}">
                                                    </div>
                                                `)}
                                            </div>
                                        ` : ''}

                                        <!-- Product Info -->
                                        ${product.badge ? this.html`
                                            <p class="text-apple-orange text-sm font-medium mb-1">${product.badge}</p>
                                        ` : ''}
                                        <h3 class="text-2xl font-semibold text-apple-gray mb-2">${product.name}</h3>
                                        <p class="text-gray-500 text-sm mb-3">${product.tagline}</p>
                                        <p class="text-base text-apple-gray mb-4">
                                            From ${formatCurrency(product.price)} or ${formatCurrency(product.price / 24)}/mo. for 24 mo.*
                                        </p>

                                        <!-- CTAs -->
                                        <div class="flex gap-3">
                                            <button class="apple-button text-sm py-2 px-5">Learn more</button>
                                            <button class="text-apple-blue hover:underline text-sm">Buy ›</button>
                                        </div>
                                    </div>
                                `)}
                            </div>

                            <!-- Navigation Arrows -->
                            <div class="flex justify-center gap-3 mt-4">
                                <button class="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors">
                                    <svg class="w-5 h-5 text-apple-gray" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M13 4l-6 6 6 6"/>
                                    </svg>
                                </button>
                                <button class="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors">
                                    <svg class="w-5 h-5 text-apple-gray" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M7 4l6 6-6 6"/>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- Why Apple Section -->
                <section class="py-12 px-4 bg-apple-lightgray">
                    <div class="max-w-6xl mx-auto">
                        <h2 class="text-3xl md:text-4xl font-semibold text-apple-gray tracking-tight text-center mb-12">
                            Why Apple is the best place to buy ${this.categoryMeta.name}.
                        </h2>
                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            ${[
                                { 
                                    icon: '💳', 
                                    title: 'Pay over time, interest‑free', 
                                    description: 'When you choose Apple Card Monthly Installments.' 
                                },
                                { 
                                    icon: '📦', 
                                    title: 'Trade in your current device', 
                                    description: 'Get credit toward a new one.' 
                                },
                                { 
                                    icon: '🚚', 
                                    title: 'Free delivery', 
                                    description: 'Get free no-contact delivery on all orders.' 
                                },
                                { 
                                    icon: '🎁', 
                                    title: 'Personalize it', 
                                    description: 'Engrave your device for free.' 
                                }
                            ].map(benefit => this.html`
                                <div class="text-center p-6">
                                    <div class="text-4xl mb-4">${benefit.icon}</div>
                                    <h3 class="text-lg font-semibold text-apple-gray mb-2">${benefit.title}</h3>
                                    <p class="text-sm text-gray-500">${benefit.description}</p>
                                </div>
                            `)}
                        </div>
                    </div>
                </section>
            </div>

            <!-- Compare Modal -->
            ${this.compareModalOpen ? this.html`
                <div class="fixed inset-0 z-50 flex items-end md:items-center justify-center">
                    <!-- Backdrop -->
                    <div 
                        class="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        @click=${this.closeCompareModal}>
                    </div>
                    
                    <!-- Modal Content -->
                    <div class="relative bg-white rounded-t-3xl md:rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden scale-in">
                        <!-- Header -->
                        <div class="sticky top-0 bg-white/90 backdrop-blur-md p-6 border-b border-gray-100 flex items-start justify-between">
                            <h2 class="text-2xl md:text-3xl font-semibold text-apple-gray">
                                Compare latest<br>${this.categoryMeta.name} models.
                            </h2>
                            <button 
                                @click=${this.closeCompareModal}
                                class="w-10 h-10 bg-black rounded-full flex items-center justify-center text-white hover:bg-gray-800 transition-colors">
                                <svg class="w-5 h-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                                    <path d="M5 5l10 10M15 5l-10 10"/>
                                </svg>
                            </button>
                        </div>

                        <!-- Products List -->
                        <div class="p-6 overflow-y-auto max-h-[60vh]">
                            ${this.products.slice(0, 4).map((product, index) => this.html`
                                <div class="flex items-center gap-4 p-4 rounded-xl ${index === 0 ? 'bg-apple-lightgray' : ''} mb-4 cursor-pointer hover:bg-apple-lightgray transition-colors"
                                     @click=${() => { this.closeCompareModal(); navigate(`/product/${product.id}`); }}>
                                    <img 
                                        src="${product.image}" 
                                        alt="${product.name}"
                                        class="w-20 h-20 object-contain bg-white rounded-xl p-2">
                                    <div class="flex-1">
                                        <div class="flex items-center gap-2 mb-1">
                                            <h3 class="font-semibold text-apple-gray">${product.name}</h3>
                                            ${index === 0 ? this.html`
                                                <span class="text-xs text-apple-orange">Currently Viewing</span>
                                            ` : ''}
                                        </div>
                                        <p class="text-sm text-gray-500">${product.tagline}</p>
                                    </div>
                                    <div class="hidden md:flex gap-2">
                                        <button class="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
                                            <svg class="w-4 h-4 text-gray-500" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2">
                                                <path d="M7 4l6 6-6 6"/>
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            `)}
                        </div>

                        <!-- Tab Bar -->
                        <div class="sticky bottom-0 bg-white border-t border-gray-100 p-4">
                            <div class="flex justify-around">
                                ${[
                                    { id: 'design', label: 'Design', icon: '📱' },
                                    { id: 'camera', label: 'Camera', icon: '📷' },
                                    { id: 'chip', label: 'Chip', icon: '⚡' },
                                    { id: 'battery', label: 'Battery', icon: '🔋' }
                                ].map(tab => this.html`
                                    <button 
                                        @click=${() => this.setCompareTab(tab.id)}
                                        class="flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-colors ${this.compareTab === tab.id ? 'bg-apple-gray text-white' : 'hover:bg-gray-100'}">
                                        <span class="text-lg">${tab.icon}</span>
                                        <span class="text-xs font-medium">${tab.label}</span>
                                    </button>
                                `)}
                                <button class="p-2 rounded-full hover:bg-gray-100 transition-colors self-center">
                                    <svg class="w-5 h-5 text-gray-400" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M7 4l6 6-6 6"/>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ` : ''}
        `;
    }
}

customElements.define('products-page', ProductsPage);
