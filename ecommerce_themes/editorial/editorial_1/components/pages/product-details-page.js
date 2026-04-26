import { BaseComponent } from '../base-component.js';
import { productsStore, cartStore } from '../../assets/state.js';
import { navigate } from '../../assets/router.js';
import { formatCurrency, showToast, getImageUrl } from '../../assets/utils.js';

class ProductDetailsPage extends BaseComponent {
    static properties = {
        product: { type: Object },
        selectedColor: { type: String },
        selectedColorIndex: { type: Number },
        quantity: { type: Number },
        activeHighlight: { type: Number },
        activeFeatureTab: { type: String },
        showStickyNav: { type: Boolean }
    };

    constructor() {
        super();
        this.product = null;
        this.selectedColor = '';
        this.selectedColorIndex = 0;
        this.quantity = 1;
        this.activeHighlight = 0;
        this.activeFeatureTab = 'colors';
        this.showStickyNav = false;
        this.highlightInterval = null;
    }

    connectedCallback() {
        super.connectedCallback();
        const params = this.getParams();
        const productId = params.id;
        this.product = productsStore.getProductById(productId);

        if (this.product && this.product.colors && this.product.colors.length > 0) {
            this.selectedColor = this.product.colors[0];
        }

        window.addEventListener('scroll', this.handleScroll.bind(this));
        this.startHighlightAutoplay();
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        window.removeEventListener('scroll', this.handleScroll.bind(this));
        this.stopHighlightAutoplay();
    }

    handleScroll() {
        this.showStickyNav = window.scrollY > 400;
    }

    startHighlightAutoplay() {
        this.highlightInterval = setInterval(() => {
            this.activeHighlight = (this.activeHighlight + 1) % 5;
        }, 4000);
    }

    stopHighlightAutoplay() {
        if (this.highlightInterval) {
            clearInterval(this.highlightInterval);
        }
    }

    selectColor(color, index) {
        this.selectedColor = color;
        this.selectedColorIndex = index;
    }

    addToCart() {
        if (this.product) {
            cartStore.add(this.product, this.quantity);
            showToast({
                title: 'Added to Bag',
                message: `${this.product.name} has been added to your bag`,
                variant: 'success'
            });
        }
    }

    buyNow() {
        if (this.product) {
            cartStore.add(this.product, this.quantity);
            window.dispatchEvent(new CustomEvent('cart:open'));
        }
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
        if (!this.product) {
            return this.html`
                <div class="min-h-[60vh] flex flex-col items-center justify-center text-center space-y-6 px-6">
                    <h1 class="text-6xl font-bold text-gray-900">404</h1>
                    <p class="text-gray-500 text-xl">Product not found</p>
                    <button @click=${() => navigate('/')} class="apple-button">
                        Return to Home
                    </button>
                </div>
            `;
        }

        const highlights = [
            { 
                title: 'New Center Stage front camera. Flexible ways to frame your shot. Smarter group selfies. And so much more.',
                image: getImageUrl(`${this.product.name} camera selfie feature`, 800, 0)
            },
            { 
                title: `The powerful ${this.product.features?.[0] || 'chip'} delivers incredible performance for everything you do.`,
                image: getImageUrl(`${this.product.name} chip performance speed`, 800, 1)
            },
            { 
                title: 'All-day battery life keeps you going from morning to night.',
                image: getImageUrl(`${this.product.name} battery life long`, 800, 2)
            },
            { 
                title: 'Beautiful display with vibrant colors and sharp detail.',
                image: getImageUrl(`${this.product.name} display screen beautiful`, 800, 3)
            },
            { 
                title: 'Premium materials and precision engineering in every detail.',
                image: getImageUrl(`${this.product.name} design premium craftsmanship`, 800, 4)
            }
        ];

        const relatedProducts = productsStore.getByCategory(this.product.category)
            .filter(p => p.id !== this.product.id)
            .slice(0, 3);

        return this.html`
            <div class="bg-white min-h-screen">
                <!-- Sticky Product Nav -->
                <div class="sticky top-12 z-30 transition-all duration-300 ${this.showStickyNav ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full pointer-events-none'} product-sticky-nav border-b border-gray-200">
                    <div class="max-w-[980px] mx-auto px-4 flex items-center justify-between h-12">
                        <h3 class="font-semibold text-apple-gray">${this.product.name}</h3>
                        <div class="flex items-center gap-4">
                            <button class="text-sm text-apple-gray hover:text-apple-blue transition-colors px-3 py-1 rounded-full border border-gray-300">Explore</button>
                            <button @click=${this.buyNow} class="apple-button apple-button-dark text-sm py-1.5 px-4">Buy</button>
                        </div>
                    </div>
                </div>

                <!-- Hero Section -->
                <section class="bg-apple-lightgray text-center py-12 px-4">
                    <div class="max-w-4xl mx-auto">
                        <!-- Badge -->
                            ${this.product.badge ? this.html`
                            <p class="text-sm text-gray-500 mb-2">Get up to $365 when you trade in your current smartphone.**
                                <button class="text-apple-blue hover:underline ml-1">Learn more ›</button>
                            </p>
                            ` : ''}

                        <!-- Product Name -->
                        <h1 class="text-3xl md:text-4xl font-semibold text-apple-gray tracking-tight mb-2">
                            ${this.product.name}
                        </h1>

                        <!-- Gradient Tagline -->
                        <h2 class="text-4xl md:text-6xl font-semibold mb-8">
                            <span class="gradient-text">${this.product.tagline}</span>
                        </h2>

                        <!-- Product Image Stack -->
                        <div class="relative mb-8">
                            <div class="flex justify-center items-end gap-1 md:gap-2">
                                ${this.product.colors?.slice(0, 5).map((color, i) => this.html`
                                    <div 
                                        class="transition-all duration-500 cursor-pointer ${i === this.selectedColorIndex ? 'scale-100 z-10' : 'scale-75 opacity-60'}"
                                        style="transform: ${i === this.selectedColorIndex ? 'translateY(0)' : `translateY(${Math.abs(i - this.selectedColorIndex) * 10}px)`}"
                                        @click=${() => this.selectColor(color, i)}>
                                        <img 
                                            src="${this.product.image}"
                                            alt="${color}"
                                            class="h-64 md:h-96 object-contain ${i === this.selectedColorIndex ? '' : 'grayscale-[30%]'}"
                                            style="filter: ${i !== this.selectedColorIndex ? `hue-rotate(${i * 40}deg)` : 'none'}">
                                    </div>
                                `) || this.html`
                                    <img 
                                        src="${this.product.heroImage || this.product.image}"
                                        alt="${this.product.name}"
                                        class="max-w-full md:max-w-2xl mx-auto">
                                `}
                            </div>
                        </div>

                        <!-- Price & CTA -->
                        <p class="text-lg text-apple-gray mb-6">
                            From ${formatCurrency(this.product.price)} or ${formatCurrency(this.product.price / 24)}/mo. for 24 mo.*
                        </p>
                        <button @click=${this.buyNow} class="apple-button">
                            Buy
                        </button>
                    </div>
                </section>

                <!-- Get the Highlights Section -->
                <section class="py-12 px-4 border-t border-gray-100">
                    <div class="max-w-6xl mx-auto">
                        <h2 class="text-3xl md:text-4xl font-semibold text-apple-gray tracking-tight mb-8">
                            Get the highlights.
                        </h2>

                        <!-- Highlights Carousel -->
                        <div class="relative">
                            <div class="flex gap-4 overflow-x-auto pb-6 scrollbar-hide scroll-snap-x -mx-4 px-4">
                                ${highlights.map((highlight, index) => this.html`
                                    <div 
                                        class="flex-shrink-0 w-80 md:w-96 scroll-snap-item rounded-3xl overflow-hidden cursor-pointer transition-all duration-300 ${index === this.activeHighlight ? 'ring-2 ring-apple-blue' : ''}"
                                        @click=${() => { this.activeHighlight = index; this.stopHighlightAutoplay(); this.startHighlightAutoplay(); }}>
                                        <div class="relative aspect-square bg-gradient-to-b from-blue-100 to-blue-200">
                                            <div class="absolute top-6 left-6 right-6">
                                                <p class="text-lg md:text-xl font-semibold text-apple-gray leading-tight">
                                                    ${highlight.title}
                                                </p>
                                            </div>
                                            <img 
                                                src="${highlight.image}"
                                                alt="Feature"
                                                class="absolute bottom-0 w-full h-2/3 object-cover object-top">
                                        </div>
                                    </div>
                                `)}
                            </div>
                        </div>

                        <!-- Carousel Controls -->
                        <div class="flex justify-center items-center gap-3 mt-4">
                            <div class="flex gap-2">
                                ${highlights.map((_, index) => this.html`
                                    <button 
                                        class="carousel-dot ${index === this.activeHighlight ? 'active' : ''}"
                                        @click=${() => { this.activeHighlight = index; this.stopHighlightAutoplay(); this.startHighlightAutoplay(); }}>
                                    </button>
                                `)}
                            </div>
                            <button 
                                class="ml-4 w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                                @click=${() => { 
                                    if (this.highlightInterval) {
                                        this.stopHighlightAutoplay();
                                    } else {
                                        this.startHighlightAutoplay();
                                    }
                                }}>
                                <svg class="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
                                    ${this.highlightInterval ? this.html`
                                        <rect x="4" y="3" width="3" height="10" rx="1"/>
                                        <rect x="9" y="3" width="3" height="10" rx="1"/>
                                    ` : this.html`
                                        <path d="M5 3l8 5-8 5V3z"/>
                                    `}
                                </svg>
                            </button>
                        </div>
                    </div>
                </section>

                <!-- Product Description -->
                <section class="py-12 px-4 bg-white">
                    <div class="max-w-3xl mx-auto">
                        <p class="text-2xl md:text-3xl text-gray-700 leading-relaxed mb-8">
                            ${this.product.description.split('. ').map((sentence, i) => this.html`
                                ${i > 0 ? ' ' : ''}
                                <span class="${i % 2 === 0 ? 'font-semibold text-apple-gray' : ''}">${sentence}${sentence.endsWith('.') ? '' : '.'}</span>
                            `)}
                        </p>
                    </div>
                </section>

                <!-- Features Tabs Section -->
                <section class="py-12 px-4 bg-apple-lightgray">
                    <div class="max-w-5xl mx-auto">
                        <!-- Feature Image -->
                        <div class="bg-white rounded-3xl overflow-hidden mb-6">
                            <img 
                                src="${this.product.heroImage || this.product.image}"
                                alt="${this.product.name}"
                                class="w-full h-80 md:h-[500px] object-contain p-8">
                        </div>

                        <!-- Feature Tabs -->
                        <div class="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
                            ${[
                                { id: 'colors', label: 'Colors', icon: this.html`<div class="w-5 h-5 rounded-full bg-gradient-to-r from-pink-400 to-purple-400"></div>` },
                                { id: 'display', label: 'Display', icon: this.html`<svg class="w-5 h-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="4" width="14" height="12" rx="2"/></svg>` },
                                { id: 'chip', label: 'Chip', icon: this.html`<svg class="w-5 h-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="5" y="5" width="10" height="10" rx="2"/><path d="M8 2v3M12 2v3M8 15v3M12 15v3M2 8h3M2 12h3M15 8h3M15 12h3"/></svg>` },
                                { id: 'camera', label: 'Camera', icon: this.html`<svg class="w-5 h-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="10" cy="10" r="3"/><path d="M3 7h2l1-2h8l1 2h2v9H3V7z"/></svg>` },
                                { id: 'battery', label: 'Battery', icon: this.html`<svg class="w-5 h-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="6" width="14" height="8" rx="2"/><path d="M16 9h2v2h-2"/></svg>` }
                            ].map(tab => this.html`
                                <button 
                                    @click=${() => this.activeFeatureTab = tab.id}
                                    class="flex items-center gap-2 px-5 py-3 rounded-full whitespace-nowrap transition-all ${this.activeFeatureTab === tab.id ? 'bg-white shadow-md' : 'bg-white/50 hover:bg-white/80'}">
                                    ${tab.icon}
                                    <span class="text-sm font-medium">${tab.label}</span>
                                </button>
                            `)}
                        </div>
                    </div>
                </section>

                <!-- Camera Section -->
                <section class="py-12 px-4 bg-gray-50">
                    <div class="max-w-5xl mx-auto">
                        <div class="grid md:grid-cols-2 gap-8 items-center">
                            <div>
                                <img 
                                    src="${getImageUrl(`${this.product.name} camera close up lens`, 800, 0)}"
                                    alt="Camera"
                                    class="rounded-3xl w-full">
                            </div>
                            <div class="flex flex-col justify-center">
                                <img 
                                    src="${getImageUrl(`${this.product.name} photo sample portrait`, 800, 1)}"
                                    alt="Photo sample"
                                    class="rounded-3xl w-full mb-4">
                                <p class="text-sm text-gray-500 text-center">Shot on ${this.product.name}</p>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- Buy Section -->
                <section class="py-16 px-4 bg-white">
                    <div class="max-w-2xl mx-auto text-center">
                        <h2 class="text-3xl md:text-4xl font-semibold text-apple-gray tracking-tight mb-2">
                            Buy ${this.product.name}
                                </h2>
                        <p class="text-xl text-gray-600 mb-8">
                            From ${formatCurrency(this.product.price)}
                        </p>

                                <!-- Color Selection -->
                                ${this.product.colors && this.product.colors.length > 0 ? this.html`
                                    <div class="mb-8">
                                <p class="text-sm text-gray-500 mb-4">Color – <span class="font-medium text-apple-gray">${this.selectedColor}</span></p>
                                <div class="flex justify-center gap-4">
                                    ${this.product.colors.map((color, index) => this.html`
                                                <button
                                            @click=${() => this.selectColor(color, index)}
                                            class="color-swatch ${this.selectedColor === color ? 'active' : ''}"
                                            style="background: ${this.getColorCode(color)}"
                                            title="${color}">
                                                </button>
                                            `)}
                                        </div>
                                    </div>
                                ` : ''}

                        <!-- CTAs -->
                        <div class="flex flex-col sm:flex-row gap-4 justify-center">
                            <button @click=${this.buyNow} class="apple-button px-12">
                                        Buy Now
                                    </button>
                            <button @click=${this.addToCart} class="apple-button apple-button-secondary px-12">
                                        Add to Bag
                                    </button>
                                </div>

                        <!-- Delivery Info -->
                        <div class="mt-12 space-y-4 text-left max-w-md mx-auto">
                            <div class="flex items-start gap-4 p-4 bg-apple-lightgray rounded-xl">
                                <svg class="w-6 h-6 text-apple-blue flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M5 12h14M12 5l7 7-7 7"/>
                                </svg>
                                        <div>
                                    <p class="font-semibold text-apple-gray">Free delivery</p>
                                    <p class="text-sm text-gray-500">Get it by Dec 24 with free shipping.</p>
                                        </div>
                                    </div>
                            <div class="flex items-start gap-4 p-4 bg-apple-lightgray rounded-xl">
                                <svg class="w-6 h-6 text-apple-blue flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <rect x="3" y="3" width="18" height="18" rx="2"/>
                                    <path d="M3 9h18"/>
                                </svg>
                                        <div>
                                    <p class="font-semibold text-apple-gray">Pickup</p>
                                    <p class="text-sm text-gray-500">Order now, pick up at an Apple Store.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- Related Products -->
                ${relatedProducts.length > 0 ? this.html`
                <section class="py-12 px-4 bg-apple-lightgray">
                        <div class="max-w-6xl mx-auto">
                            <h2 class="text-3xl md:text-4xl font-semibold text-apple-gray tracking-tight mb-8">
                                Which ${this.product.category} is right for you?
                        </h2>
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                                ${relatedProducts.map(product => this.html`
                                    <div 
                                        class="bg-white rounded-2xl p-6 cursor-pointer hover:scale-[1.02] transition-transform"
                                        @click=${() => navigate(`/product/${product.id}`)}>
                                        <img 
                                            src="${product.image}"
                                            alt="${product.name}"
                                            class="w-full h-48 object-contain mb-4">
                                        <h3 class="text-xl font-semibold text-apple-gray mb-1">${product.name}</h3>
                                        <p class="text-sm text-gray-500 mb-3">${product.tagline}</p>
                                        <p class="text-base text-apple-gray">From ${formatCurrency(product.price)}</p>
                                </div>
                            `)}
                        </div>
                    </div>
                </section>
                ` : ''}
            </div>
        `;
    }
}

customElements.define('product-details-page', ProductDetailsPage);
