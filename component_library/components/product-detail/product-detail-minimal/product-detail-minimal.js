/**
 * Product Detail Minimal - Clean minimalist product page
 * Inspired by: Luxury/Watch ecommerce (Swiss Watch design)
 * Features: Clean layout, minimal design, color pills, elegant typography, wishlist
 *
 * @element product-detail-minimal
 * @fires product:add-to-cart - When add to cart is clicked
 * @fires product:wishlist - When wishlist is toggled
 */

import { BaseComponent } from '../../base-component.js';
import { html } from 'https://cdn.jsdelivr.net/npm/lit@3.2.1/+esm';

export class ProductDetailMinimal extends BaseComponent {
    static properties = {
        product: { type: Object },
        selectedImage: { type: Number },
        selectedColor: { type: String },
        selectedSize: { type: String },
        isWishlisted: { type: Boolean },
        expandedSection: { type: String },
        theme: { type: String },
        showSizeGuide: { type: Boolean },
        showImageModal: { type: Boolean },
        modalImageIndex: { type: Number }
    };

    constructor() {
        super();
        this.theme = 'light';
        this.selectedImage = 0;
        this.selectedColor = '';
        this.selectedSize = '';
        this.isWishlisted = false;
        this.expandedSection = null;

        this.product = {
            category: 'MODERN 27',
            name: 'Iconic Swiss Mode',
            subtitle: 'Premium Timepiece Collection',
            price: 249.00,
            originalPrice: 299.00,
            rating: 4.5,
            reviewCount: 174,
            description: 'This 40mm watch features a pink dial, slim steel hands, and a patchwork leather strap. We removed the timer bezel, simplifying the dial and highlighting our iconic offset hour bloke.',
            images: [
                'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800&h=800&fit=crop',
                'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=800&h=800&fit=crop',
                'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&h=800&fit=crop'
            ],
            colors: [
                { 
                    name: 'Rose Pink', 
                    hex: '#e8b4b8', 
                    imageIndex: 0, 
                    availableSizes: ['38', '40', '42', '44', '46'],
                    variants: {
                        '38': ['https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800&h=800&fit=crop', 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=800&h=800&fit=crop'],
                        '40': ['https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800&h=800&fit=crop', 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=800&h=800&fit=crop', 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&h=800&fit=crop'],
                        '42': ['https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800&h=800&fit=crop', 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=800&h=800&fit=crop'],
                        '44': ['https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800&h=800&fit=crop', 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=800&h=800&fit=crop', 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&h=800&fit=crop'],
                        '46': ['https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800&h=800&fit=crop', 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=800&h=800&fit=crop']
                    }
                },
                { 
                    name: 'Lavender', 
                    hex: '#c4b5d4', 
                    imageIndex: 1, 
                    availableSizes: ['40', '42', '44'],
                    variants: {
                        '40': ['https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=800&h=800&fit=crop', 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&h=800&fit=crop'],
                        '42': ['https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=800&h=800&fit=crop', 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&h=800&fit=crop'],
                        '44': ['https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=800&h=800&fit=crop', 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&h=800&fit=crop']
                    }
                },
                { 
                    name: 'Yellow', 
                    hex: '#f4d15a', 
                    imageIndex: 2, 
                    availableSizes: ['38', '42', '44', '46'],
                    variants: {
                        '38': ['https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&h=800&fit=crop', 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800&h=800&fit=crop'],
                        '42': ['https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&h=800&fit=crop', 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800&h=800&fit=crop', 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=800&h=800&fit=crop'],
                        '44': ['https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&h=800&fit=crop', 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800&h=800&fit=crop'],
                        '46': ['https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&h=800&fit=crop', 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800&h=800&fit=crop', 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=800&h=800&fit=crop']
                    }
                },
                { 
                    name: 'Sky Blue', 
                    hex: '#85b8cb', 
                    imageIndex: 0, 
                    availableSizes: ['38', '40', '46'],
                    variants: {
                        '38': ['https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800&h=800&fit=crop', 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=800&h=800&fit=crop'],
                        '40': ['https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800&h=800&fit=crop', 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=800&h=800&fit=crop', 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&h=800&fit=crop'],
                        '46': ['https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800&h=800&fit=crop', 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=800&h=800&fit=crop']
                    }
                },
                { 
                    name: 'Forest Green', 
                    hex: '#5d7461', 
                    imageIndex: 1, 
                    availableSizes: ['40', '42', '44', '46'],
                    variants: {
                        '40': ['https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=800&h=800&fit=crop', 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&h=800&fit=crop'],
                        '42': ['https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=800&h=800&fit=crop', 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&h=800&fit=crop'],
                        '44': ['https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=800&h=800&fit=crop', 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&h=800&fit=crop'],
                        '46': ['https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=800&h=800&fit=crop', 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&h=800&fit=crop']
                    }
                },
                { 
                    name: 'Crimson', 
                    hex: '#c1433a', 
                    imageIndex: 2, 
                    availableSizes: ['38', '40', '42'],
                    variants: {
                        '38': ['https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&h=800&fit=crop', 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800&h=800&fit=crop'],
                        '40': ['https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&h=800&fit=crop', 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800&h=800&fit=crop', 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=800&h=800&fit=crop'],
                        '42': ['https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&h=800&fit=crop', 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800&h=800&fit=crop']
                    }
                }
            ],
            sizes: ['38', '40', '42', '44', '46'],
            materials: [
                { label: 'Case + Bezel', value: 'Swiss nylon bio polymer' },
                { label: 'Strap Upper', value: '100% recycled woven polyester' },
                { label: 'Strap Liner', value: 'Antimicrobial polyurethane alt-nappa leather' }
            ],
            shipping: {
                policy: 'Free shipping on orders over $50. Standard delivery takes 3-5 business days. Express shipping available.',
                returns: '30-day return policy. Items must be unworn and in original packaging with all tags attached.'
            },
            reviews: [
                { name: 'Alice Cooper', rating: 5, text: 'Stunning watch! The craftsmanship is incredible and it looks even better in person. Highly recommend!', likes: 45, dislikes: 2 },
                { name: 'Marcus Johnson', rating: 4, text: 'Beautiful timepiece with excellent build quality. The strap is very comfortable. Only minor issue is the clasp feels a bit stiff.', likes: 32, dislikes: 3 },
                { name: 'Sophie Anderson', rating: 5, text: 'Absolutely love this watch! The color is perfect and it goes with everything. Worth the investment.', likes: 28, dislikes: 0 },
                { name: 'David Lee', rating: 5, text: 'Elegant design and great attention to detail. This watch exceeded my expectations in every way.', likes: 19, dislikes: 1 }
            ]
        };

        this.selectedColor = this.product.colors[0].name;
        this.selectedSize = this.product.sizes[1];
        this.showSizeGuide = false;
        this.showImageModal = false;
        this.modalImageIndex = 0;
        this.expandedSection = 'materials'; // Materials And Care expanded by default
    }

    connectedCallback() {
        super.connectedCallback();
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            this.theme = 'dark';
            this.setAttribute('theme', 'dark');
        }
    }

    selectImage(index) {
        this.selectedImage = index;
    }

    getCurrentVariantImages() {
        const selectedColorObj = this.product.colors.find(c => c.name === this.selectedColor);
        if (selectedColorObj && selectedColorObj.variants && selectedColorObj.variants[this.selectedSize]) {
            return selectedColorObj.variants[this.selectedSize];
        }
        return this.product.images;
    }

    selectColor(colorName) {
        const selectedColorObj = this.product.colors.find(c => c.name === colorName);
        this.selectedColor = colorName;

        // Check if currently selected size is available for this color
        if (selectedColorObj && !selectedColorObj.availableSizes.includes(this.selectedSize)) {
            this.selectedSize = selectedColorObj.availableSizes[0] || this.product.sizes[0];
        }

        // Reset to first image of the new variant
        this.selectedImage = 0;
    }

    selectSize(sizeName) {
        const selectedColorObj = this.product.colors.find(c => c.name === this.selectedColor);
        if (selectedColorObj && selectedColorObj.availableSizes.includes(sizeName)) {
            this.selectedSize = sizeName;
            // Reset to first image of the new variant
            this.selectedImage = 0;
        }
    }

    isSizeAvailable(sizeName) {
        const selectedColorObj = this.product.colors.find(c => c.name === this.selectedColor);
        return selectedColorObj ? selectedColorObj.availableSizes.includes(sizeName) : false;
    }

    handleBack() {
        window.history.back();
    }

    toggleWishlist() {
        this.isWishlisted = !this.isWishlisted;
        this.dispatchEvent(new CustomEvent('product:wishlist', {
            detail: { isWishlisted: this.isWishlisted },
            bubbles: true,
            composed: true
        }));
    }

    toggleSection(section) {
        this.expandedSection = this.expandedSection === section ? null : section;
    }

    isSectionExpanded(section) {
        return this.expandedSection === section;
    }

    handleAddToCart() {
        this.dispatchEvent(new CustomEvent('product:add-to-cart', {
            detail: {
                product: this.product,
                color: this.selectedColor,
                size: this.selectedSize
            },
            bubbles: true,
            composed: true
        }));
    }

    toggleSizeGuide() {
        this.showSizeGuide = !this.showSizeGuide;
    }

    openImageModal(index) {
        this.modalImageIndex = index;
        this.showImageModal = true;
        document.body.style.overflow = 'hidden';
    }

    closeImageModal() {
        this.showImageModal = false;
        document.body.style.overflow = '';
    }

    nextImage() {
        const images = this.getCurrentVariantImages();
        this.modalImageIndex = (this.modalImageIndex + 1) % images.length;
    }

    prevImage() {
        const images = this.getCurrentVariantImages();
        this.modalImageIndex = (this.modalImageIndex - 1 + images.length) % images.length;
    }

    renderStars(rating) {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalf = rating % 1 !== 0;

        for (let i = 0; i < 5; i++) {
            if (i < fullStars) {
                stars.push(html`<span class="text-base text-yellow-400">★</span>`);
            } else if (i === fullStars && hasHalf) {
                stars.push(html`<span class="text-base text-yellow-400">⯪</span>`);
            } else {
                stars.push(html`<span class="text-base text-gray-200 dark:text-gray-700">★</span>`);
            }
        }
        return stars;
    }

    render() {
        const variantImages = this.getCurrentVariantImages();
        return html`
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
                
                @keyframes scroll {
                    0% {
                        transform: translateX(0);
                    }
                    100% {
                        transform: translateX(-50%);
                    }
                }
                .animate-scroll {
                    animation: scroll 60s linear infinite;
                    display: flex;
                    width: fit-content;
                }
                .animate-scroll:hover {
                    animation-play-state: paused;
                }
            </style>
            <div class="w-full max-w-[1200px] mx-auto bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100" style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
                <!-- Top Banner -->
                <div class="w-full bg-[#e87ba8] py-3 overflow-hidden">
                    <div class="flex items-center gap-2 whitespace-nowrap animate-scroll">
                        ${Array(20).fill(0).map(() => html`
                            <span class="text-white text-sm font-medium flex items-center gap-2 flex-shrink-0">
                                I LET MY INNER LIGHT SHINE
                                <svg class="w-3 h-3 fill-white flex-shrink-0" viewBox="0 0 24 24">
                                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                </svg>
                            </span>
                        `)}
                        ${Array(20).fill(0).map(() => html`
                            <span class="text-white text-sm font-medium flex items-center gap-2 flex-shrink-0">
                                I LET MY INNER LIGHT SHINE
                                <svg class="w-3 h-3 fill-white flex-shrink-0" viewBox="0 0 24 24">
                                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                </svg>
                            </span>
                        `)}
                    </div>
                </div>

                <div class="px-4 py-12 md:py-8">
                    <!-- Top Navigation -->
                    <div class="flex items-center gap-4 mb-6">
                        <button 
                            class="w-10 h-10 rounded-full border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 cursor-pointer flex items-center justify-center text-xl transition-all duration-200 flex-shrink-0 hover:border-gray-900 dark:hover:border-gray-100 hover:-translate-x-0.5" 
                            @click="${this.handleBack}" 
                            title="Go back">←</button>
                        <nav class="flex items-center gap-2 flex-1 text-sm text-gray-500 dark:text-gray-400 flex-wrap">
                            <a href="#" class="text-gray-500 dark:text-gray-400 no-underline transition-colors duration-200 hover:text-gray-900 dark:hover:text-gray-100">Home</a>
                            <span>/</span>
                            <a href="#" class="text-gray-500 dark:text-gray-400 no-underline transition-colors duration-200 hover:text-gray-900 dark:hover:text-gray-100">Watches</a>
                            <span>/</span>
                            <a href="#" class="text-gray-500 dark:text-gray-400 no-underline transition-colors duration-200 hover:text-gray-900 dark:hover:text-gray-100">${this.product.category}</a>
                            <span>/</span>
                            <span>${this.product.name}</span>
                        </nav>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-16">
                        <!-- Image Section -->
                        <div class="flex flex-col gap-6">
                            <div class="bg-gray-100 dark:bg-gray-800 rounded-[20px] overflow-hidden aspect-square relative group cursor-zoom-in" @click="${() => this.openImageModal(this.selectedImage)}">
                                <img class="w-full h-full object-cover" src="${variantImages[this.selectedImage]}" alt="${this.product.name}" />
                                <div class="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-200 flex items-center justify-center">
                                    <div class="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white/90 dark:bg-gray-800/90 rounded-full p-3">
                                        <svg class="w-6 h-6 text-gray-900 dark:text-gray-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"></path>
                                        </svg>
                                    </div>
                                </div>
                            </div>
                            <div class="grid grid-cols-3 gap-4">
                                ${variantImages.map((img, i) => html`
                                    <div 
                                        class="aspect-square rounded-2xl overflow-hidden cursor-pointer border-[3px] transition-all duration-300 ${this.selectedImage === i ? 'border-[#d97757] scale-95' : 'border-transparent'}" 
                                        @click="${() => this.selectImage(i)}">
                                        <img class="w-full h-full object-cover" src="${img}" alt="View ${i + 1}" />
                                    </div>
                                `)}
                            </div>
                        </div>

                        <!-- Product Info -->
                        <div class="flex flex-col gap-8">
                            <!-- Product Name -->
                            <div>
                                <div class="text-[#e87ba8] text-lg font-normal mb-1">${this.product.category}</div>
                                <h1 class="text-3xl font-bold text-[#5d7461] leading-tight break-words">${this.product.name}</h1>
                            </div>

                            <div class="flex items-center gap-6 flex-wrap">
                                <div class="flex items-center gap-2">
                                    <div class="flex gap-0.5">${this.renderStars(this.product.rating)}</div>
                                    <span class="text-sm text-gray-500 dark:text-gray-400">(${this.product.reviewCount} Review)</span>
                                </div>
                            </div>

                            <div class="flex flex-col gap-2">
                                <div class="flex items-baseline gap-4">
                                    <div class="text-3xl font-bold text-[#5d7461]">$${this.product.price.toFixed(2)}</div>
                                    <div class="text-lg text-gray-400 line-through">$${this.product.originalPrice.toFixed(2)}</div>
                                </div>
                            </div>

                            <p class="text-gray-500 dark:text-gray-400 leading-[1.8]">
                                ${this.product.description}
                            </p>

                            <!-- Watch Size -->
                            <div class="flex flex-col gap-4">
                                <div class="flex justify-between items-center">
                                    <div class="text-gray-500 dark:text-gray-400 text-sm uppercase tracking-wider">WATCH SIZE:</div>
                                    <button class="text-[#e87ba8] dark:text-[#e87ba8] text-sm cursor-pointer underline hover:text-[#d46995] dark:hover:text-[#d46995] transition-colors" @click="${this.toggleSizeGuide}">Size guide</button>
                                </div>
                                <div class="flex gap-3 flex-wrap">
                                    ${this.product.sizes.map(size => html`
                                        <button
                                            class="min-w-[60px] px-4 py-2.5 border-2 rounded font-semibold text-sm transition-all duration-200 text-center ${this.selectedSize === size ? 'bg-black text-white border-black' : 'border-gray-300 bg-white text-gray-900 hover:border-gray-900'} ${!this.isSizeAvailable(size) ? 'opacity-40 cursor-not-allowed line-through' : ''}"
                                            @click="${() => this.selectSize(size)}"
                                            ?disabled="${!this.isSizeAvailable(size)}"
                                            title="${this.isSizeAvailable(size) ? size + 'mm' : size + 'mm (Not available for ' + this.selectedColor + ')'}"
                                        >
                                            ${size}
                                        </button>
                                    `)}
                                </div>
                            </div>

                            <!-- Colour -->
                            <div class="flex flex-col gap-4">
                                <div class="text-gray-500 dark:text-gray-400 text-sm uppercase tracking-wider">COLOUR:</div>
                                <div class="flex gap-3 flex-wrap">
                                    ${this.product.colors.map(color => html`
                                        <div
                                            class="w-10 h-10 rounded-full cursor-pointer border-2 transition-all duration-200 ${this.selectedColor === color.name ? 'border-black' : 'border-gray-300'}"
                                            style="background: ${color.hex}"
                                            @click="${() => this.selectColor(color.name)}"
                                            title="${color.name}"
                                        ></div>
                                    `)}
                                </div>
                            </div>

                            <!-- Add to Cart and Wishlist -->
                            <div class="flex items-center gap-3">
                                <button class="flex-1 px-8 py-4 bg-[#e87ba8] text-white border-none rounded-full text-base font-semibold cursor-pointer transition-all duration-300 hover:bg-[#d46995] hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(232,123,168,0.4)]" @click="${this.handleAddToCart}">
                                    ADD TO CART
                                </button>
                                <button 
                                    class="w-12 h-12 rounded-full border-2 cursor-pointer flex items-center justify-center transition-all duration-300 flex-shrink-0 hover:scale-105 ${this.isWishlisted ? 'bg-red-500 border-red-500 text-white shadow-lg shadow-red-500/30' : 'border-gray-300 bg-white hover:border-red-400 hover:bg-red-50'}" 
                                    @click="${this.toggleWishlist}"
                                    title="${this.isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}">
                                    <svg class="w-6 h-6 ${this.isWishlisted ? 'fill-current' : 'stroke-current fill-none'}" viewBox="0 0 24 24" stroke-width="2">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                    </svg>
                                </button>
                            </div>

                            <!-- Expandable Sections -->
                            <div class="flex flex-col gap-2 mt-8">
                                <!-- Returns Policy -->
                                <div class="border-t border-gray-200 dark:border-gray-700">
                                    <button 
                                        class="w-full flex justify-between items-center py-5 bg-transparent border-none cursor-pointer text-[0.9375rem] font-semibold text-gray-900 dark:text-gray-100 text-left" 
                                        @click="${() => this.toggleSection('returns')}">
                                        <span>Returns Policy</span>
                                        <span class="text-lg transition-transform duration-300 text-gray-500 dark:text-gray-400 ${this.isSectionExpanded('returns') ? 'rotate-90' : ''}">→</span>
                                    </button>
                                    <div class="${this.isSectionExpanded('returns') ? 'max-h-[600px]' : 'max-h-0'} overflow-hidden transition-all duration-300 ease-out">
                                        <div class="pb-6 text-gray-500 dark:text-gray-400 leading-[1.8]">
                                            ${this.product.shipping.returns}
                                        </div>
                                    </div>
                                </div>

                                <!-- Materials And Care -->
                                <div class="border-t border-gray-200 dark:border-gray-700">
                                    <button 
                                        class="w-full flex justify-between items-center py-5 bg-transparent border-none cursor-pointer text-[0.9375rem] font-semibold text-gray-900 dark:text-gray-100 text-left" 
                                        @click="${() => this.toggleSection('materials')}">
                                        <span>Materials And Care</span>
                                        <span class="text-lg transition-transform duration-300 text-gray-500 dark:text-gray-400 ${this.isSectionExpanded('materials') ? 'rotate-90' : ''}">→</span>
                                    </button>
                                    <div class="${this.isSectionExpanded('materials') ? 'max-h-[600px]' : 'max-h-0'} overflow-hidden transition-all duration-300 ease-out">
                                        <div class="pb-6 text-gray-500 dark:text-gray-400 leading-[1.8]">
                                            <div class="flex flex-col gap-3">
                                                ${this.product.materials.map(item => html`
                                                    <div class="flex justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                                                        <span class="font-medium">${item.label}:</span>
                                                        <span class="text-gray-500 dark:text-gray-400">${item.value}</span>
                                                    </div>
                                                `)}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Shipping And Returns -->
                                <div class="border-t border-gray-200 dark:border-gray-700">
                                    <button 
                                        class="w-full flex justify-between items-center py-5 bg-transparent border-none cursor-pointer text-[0.9375rem] font-semibold text-gray-900 dark:text-gray-100 text-left" 
                                        @click="${() => this.toggleSection('shipping')}">
                                        <span>Shipping And Returns</span>
                                        <span class="text-lg transition-transform duration-300 text-gray-500 dark:text-gray-400 ${this.isSectionExpanded('shipping') ? 'rotate-90' : ''}">→</span>
                                    </button>
                                    <div class="${this.isSectionExpanded('shipping') ? 'max-h-[600px]' : 'max-h-0'} overflow-hidden transition-all duration-300 ease-out">
                                        <div class="pb-6 text-gray-500 dark:text-gray-400 leading-[1.8]">
                                            ${this.product.shipping.policy}
                                        </div>
                                    </div>
                                </div>

                                <!-- Customer Reviews -->
                                <div class="border-t border-b border-gray-200 dark:border-gray-700">
                                    <button 
                                        class="w-full flex justify-between items-center py-5 bg-transparent border-none cursor-pointer text-[0.9375rem] font-semibold text-gray-900 dark:text-gray-100 text-left" 
                                        @click="${() => this.toggleSection('reviews')}">
                                        <span>Customer Reviews (${this.product.reviewCount})</span>
                                        <span class="text-lg transition-transform duration-300 text-gray-500 dark:text-gray-400 ${this.isSectionExpanded('reviews') ? 'rotate-90' : ''}">→</span>
                                    </button>
                                    <div class="${this.isSectionExpanded('reviews') ? 'max-h-[600px]' : 'max-h-0'} overflow-hidden transition-all duration-300 ease-out">
                                        <div class="pb-6 text-gray-500 dark:text-gray-400 leading-[1.8]">
                                            <div class="flex flex-col gap-6 mt-4">
                                                ${this.product.reviews.map(review => html`
                                                    <div class="pb-6 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                                                        <div class="flex gap-4 mb-3">
                                                            <div class="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center font-semibold text-[#e87ba8]">${review.name.charAt(0)}</div>
                                                            <div class="flex-1">
                                                                <div class="font-semibold text-[0.9375rem] mb-1">${review.name}</div>
                                                                <div class="flex gap-0.5">${this.renderStars(review.rating)}</div>
                                                            </div>
                                                        </div>
                                                        <p class="leading-[1.7] text-gray-500 dark:text-gray-400 my-3 break-words">${review.text}</p>
                                                        <div class="flex gap-6 mt-3">
                                                            <button class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 bg-transparent border-none cursor-pointer transition-colors duration-200 hover:text-[#e87ba8]">👍 ${review.likes}</button>
                                                            <button class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 bg-transparent border-none cursor-pointer transition-colors duration-200 hover:text-[#e87ba8]">👎 ${review.dislikes}</button>
                                                            <button class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 bg-transparent border-none cursor-pointer transition-colors duration-200 hover:text-[#e87ba8]">Reply</button>
                                                        </div>
                                                    </div>
                                                `)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Related Product Section -->
                    <div class="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
                        <div class="flex flex-col md:flex-row gap-6">
                            <div class="w-full md:w-32 h-32 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0">
                                <img class="w-full h-full object-cover" src="${this.product.colors[4]?.variants?.['40']?.[0] || this.product.images[0]}" alt="Related product" />
                            </div>
                            <div class="flex-1 flex flex-col gap-2">
                                <div class="text-[#e87ba8] text-sm font-normal">${this.product.category}</div>
                                <h3 class="text-lg font-bold text-[#5d7461]">${this.product.name}</h3>
                                <p class="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">${this.product.description}</p>
                                <button class="self-start px-6 py-2.5 bg-[#e87ba8] text-white border-none rounded-full text-sm font-semibold cursor-pointer transition-all duration-300 hover:bg-[#d46995] mt-2" @click="${this.handleAddToCart}">
                                    ADD TO CART
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Size Guide Modal -->
                ${this.showSizeGuide ? html`
                    <div class="fixed inset-0 bg-black/50 dark:bg-black/70 z-50 flex items-center justify-center p-4" @click="${this.toggleSizeGuide}">
                        <div class="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8" @click="${(e) => e.stopPropagation()}">
                            <div class="flex justify-between items-center mb-6">
                                <h2 class="text-2xl font-bold">Size Guide</h2>
                                <button class="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors" @click="${this.toggleSizeGuide}">×</button>
                            </div>
                            <div class="space-y-4">
                                <p class="text-gray-600 dark:text-gray-400">Find your perfect fit using our watch size guide below:</p>
                                <div class="overflow-x-auto">
                                    <table class="w-full border-collapse">
                                        <thead>
                                            <tr class="bg-gray-100 dark:bg-gray-700">
                                                <th class="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left">Size (mm)</th>
                                                <th class="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left">Case Diameter</th>
                                                <th class="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left">Band Width</th>
                                                <th class="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left">Wrist Size</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr><td class="border border-gray-300 dark:border-gray-600 px-4 py-2">38</td><td class="border border-gray-300 dark:border-gray-600 px-4 py-2">38mm</td><td class="border border-gray-300 dark:border-gray-600 px-4 py-2">18mm</td><td class="border border-gray-300 dark:border-gray-600 px-4 py-2">5.5-6.5"</td></tr>
                                            <tr class="bg-gray-50 dark:bg-gray-900"><td class="border border-gray-300 dark:border-gray-600 px-4 py-2">40</td><td class="border border-gray-300 dark:border-gray-600 px-4 py-2">40mm</td><td class="border border-gray-300 dark:border-gray-600 px-4 py-2">20mm</td><td class="border border-gray-300 dark:border-gray-600 px-4 py-2">6-7"</td></tr>
                                            <tr><td class="border border-gray-300 dark:border-gray-600 px-4 py-2">42</td><td class="border border-gray-300 dark:border-gray-600 px-4 py-2">42mm</td><td class="border border-gray-300 dark:border-gray-600 px-4 py-2">22mm</td><td class="border border-gray-300 dark:border-gray-600 px-4 py-2">6.5-7.5"</td></tr>
                                            <tr class="bg-gray-50 dark:bg-gray-900"><td class="border border-gray-300 dark:border-gray-600 px-4 py-2">44</td><td class="border border-gray-300 dark:border-gray-600 px-4 py-2">44mm</td><td class="border border-gray-300 dark:border-gray-600 px-4 py-2">22mm</td><td class="border border-gray-300 dark:border-gray-600 px-4 py-2">7-8"</td></tr>
                                            <tr><td class="border border-gray-300 dark:border-gray-600 px-4 py-2">46</td><td class="border border-gray-300 dark:border-gray-600 px-4 py-2">46mm</td><td class="border border-gray-300 dark:border-gray-600 px-4 py-2">24mm</td><td class="border border-gray-300 dark:border-gray-600 px-4 py-2">7.5-8.5"</td></tr>
                                        </tbody>
                                    </table>
                                </div>
                                <p class="text-sm text-gray-500 dark:text-gray-400 mt-4">* Measurements are approximate. For best fit, measure your wrist at the point where you normally wear your watch.</p>
                            </div>
                        </div>
                    </div>
                ` : ''}

                <!-- Image Modal / Fullscreen View -->
                ${this.showImageModal ? html`
                    <div class="fixed inset-0 bg-black z-50 flex items-center justify-center" @click="${this.closeImageModal}">
                        <button class="absolute top-4 right-4 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white text-2xl z-10 transition-colors" @click="${this.closeImageModal}">×</button>
                        <button class="absolute left-4 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white text-xl z-10 transition-colors" @click="${(e) => { e.stopPropagation(); this.prevImage(); }}">‹</button>
                        <button class="absolute right-4 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white text-xl z-10 transition-colors" @click="${(e) => { e.stopPropagation(); this.nextImage(); }}">›</button>
                        <div class="max-w-[90vw] max-h-[90vh] flex items-center justify-center" @click="${(e) => e.stopPropagation()}">
                            <img class="max-w-full max-h-[90vh] object-contain" src="${variantImages[this.modalImageIndex]}" alt="${this.product.name}" />
                        </div>
                        <div class="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-lg text-sm">
                            ${this.modalImageIndex + 1} / ${variantImages.length}
                        </div>
                    </div>
                ` : ''}
            </div>
        `;
    }
}

customElements.define('product-detail-minimal', ProductDetailMinimal);
