/**
 * Product Detail Fashion - Fashion-focused product page with tabs and reviews
 * Inspired by: Fashion ecommerce (Peanuts Sweatshirt design)
 * Features: Size selection, color swatches, tabs (Details/Reviews/Discussion), rating distribution
 *
 * @element product-detail-fashion
 * @fires product:add-to-cart - When add to cart is clicked
 * @fires product:buy-item - When buy item is clicked
 * @fires product:wishlist - When wishlist is toggled
 * @fires product:share - When share is clicked
 */

import { BaseComponent } from '../../base-component.js';
import { html } from 'https://cdn.jsdelivr.net/npm/lit@3.2.1/+esm';

export class ProductDetailFashion extends BaseComponent {
    static properties = {
        product: { type: Object },
        selectedImage: { type: Number },
        selectedColor: { type: String },
        selectedSize: { type: String },
        activeTab: { type: String },
        isWishlisted: { type: Boolean },
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
        this.activeTab = 'reviews';
        this.isWishlisted = false;

        this.product = {
            name: 'Premium Cotton Sweatshirt',
            subtitle: 'Comfort Collection - Limited Edition',
            price: 122.00,
            originalPrice: 166.00,
            rating: 4.9,
            reviewCount: 225,
            sold: '5K+',
            description: 'Experience ultimate comfort with our premium cotton sweatshirt. Features a relaxed fit, soft brushed interior, and timeless design. Perfect for casual everyday wear or lounging at home.',
            images: [
                'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&h=1000&fit=crop',
                'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&h=1000&fit=crop',
                'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=800&h=1000&fit=crop',
                'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&h=1000&fit=crop',
                'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=800&h=1000&fit=crop'
            ],
            colors: [
                { 
                    name: 'Forest Green', 
                    hex: '#5f8a6f', 
                    imageIndex: 0, 
                    availableSizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
                    variants: {
                        'XS': ['https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&h=1000&fit=crop', 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&h=1000&fit=crop'],
                        'S': ['https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&h=1000&fit=crop', 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&h=1000&fit=crop'],
                        'M': ['https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&h=1000&fit=crop', 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&h=1000&fit=crop', 'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=800&h=1000&fit=crop'],
                        'L': ['https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&h=1000&fit=crop', 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&h=1000&fit=crop', 'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=800&h=1000&fit=crop', 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&h=1000&fit=crop'],
                        'XL': ['https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&h=1000&fit=crop', 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&h=1000&fit=crop'],
                        'XXL': ['https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&h=1000&fit=crop', 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&h=1000&fit=crop', 'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=800&h=1000&fit=crop']
                    }
                },
                { 
                    name: 'Blush Pink', 
                    hex: '#e5b3b3', 
                    imageIndex: 1, 
                    availableSizes: ['S', 'M', 'L', 'XL'],
                    variants: {
                        'S': ['https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&h=1000&fit=crop', 'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=800&h=1000&fit=crop'],
                        'M': ['https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&h=1000&fit=crop', 'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=800&h=1000&fit=crop', 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&h=1000&fit=crop'],
                        'L': ['https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&h=1000&fit=crop', 'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=800&h=1000&fit=crop'],
                        'XL': ['https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&h=1000&fit=crop', 'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=800&h=1000&fit=crop', 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&h=1000&fit=crop', 'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=800&h=1000&fit=crop']
                    }
                },
                { 
                    name: 'Light Gray', 
                    hex: '#c4c4c4', 
                    imageIndex: 2, 
                    availableSizes: ['XS', 'M', 'L', 'XL', 'XXL'],
                    variants: {
                        'XS': ['https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=800&h=1000&fit=crop', 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&h=1000&fit=crop'],
                        'M': ['https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=800&h=1000&fit=crop', 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&h=1000&fit=crop', 'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=800&h=1000&fit=crop'],
                        'L': ['https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=800&h=1000&fit=crop', 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&h=1000&fit=crop'],
                        'XL': ['https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=800&h=1000&fit=crop', 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&h=1000&fit=crop', 'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=800&h=1000&fit=crop'],
                        'XXL': ['https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=800&h=1000&fit=crop', 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&h=1000&fit=crop']
                    }
                }
            ],
            sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
            reviews: [
                { name: 'James Gouse', rating: 5, text: 'A simple sweater but makes the user seem neat and beautiful, the material is soft, but when worn it often wrinkles because of sitting for too long', likes: 6, dislikes: 0 },
                { name: 'Guy Hawkins', rating: 5, text: 'Nice colour looks like oversized shirt and fitting is just right.', likes: 2, dislikes: 0 },
                { name: 'Sarah Martinez', rating: 5, text: 'Absolutely love this sweatshirt! The quality is amazing and it\'s so comfortable. Worth every penny.', likes: 12, dislikes: 1 },
                { name: 'Alex Johnson', rating: 4, text: 'Great fit and quality. The color is slightly different from the photo but still very nice.', likes: 8, dislikes: 2 },
                { name: 'Emily Chen', rating: 5, text: 'Best purchase I\'ve made this season! Soft, cozy, and stylish. Highly recommend!', likes: 15, dislikes: 0 }
            ],
            ratingDistribution: { 5: 184, 4: 63, 3: 29, 2: 7, 1: 2 }
        };

        this.selectedColor = this.product.colors[0].name;
        this.selectedSize = this.product.sizes[2];
        this.showSizeGuide = false;
        this.showImageModal = false;
        this.modalImageIndex = 0;
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
        // Fallback to default images if variant not found
        return this.product.images;
    }

    selectColor(colorName) {
        const selectedColorObj = this.product.colors.find(c => c.name === colorName);
        this.selectedColor = colorName;

        // Check if currently selected size is available for this color
        if (selectedColorObj && !selectedColorObj.availableSizes.includes(this.selectedSize)) {
            // Select first available size for this color
            this.selectedSize = selectedColorObj.availableSizes[0] || this.product.sizes[0];
        }

        // Reset to first image of the new variant
        this.selectedImage = 0;
    }

    selectSize(size) {
        const selectedColorObj = this.product.colors.find(c => c.name === this.selectedColor);
        // Only select if available for current color
        if (selectedColorObj && selectedColorObj.availableSizes.includes(size)) {
            this.selectedSize = size;
            // Reset to first image of the new variant
            this.selectedImage = 0;
        }
    }

    isSizeAvailable(size) {
        const selectedColorObj = this.product.colors.find(c => c.name === this.selectedColor);
        return selectedColorObj ? selectedColorObj.availableSizes.includes(size) : false;
    }

    handleBack() {
        window.history.back();
    }

    setActiveTab(tab) {
        this.activeTab = tab;
    }

    toggleWishlist() {
        this.isWishlisted = !this.isWishlisted;
        this.dispatchEvent(new CustomEvent('product:wishlist', {
            detail: { isWishlisted: this.isWishlisted },
            bubbles: true,
            composed: true
        }));
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

    handleBuyItem() {
        this.dispatchEvent(new CustomEvent('product:buy-item', {
            detail: {
                product: this.product,
                color: this.selectedColor,
                size: this.selectedSize
            },
            bubbles: true,
            composed: true
        }));
    }

    handleShare() {
        this.dispatchEvent(new CustomEvent('product:share', {
            detail: { product: this.product },
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
        for (let i = 1; i <= 5; i++) {
            stars.push(html`<span class="text-lg ${i > rating ? 'text-gray-200 dark:text-gray-700' : 'text-amber-400'}">★</span>`);
        }
        return stars;
    }

    render() {
        const discount = Math.round(((this.product.originalPrice - this.product.price) / this.product.originalPrice) * 100);
        const variantImages = this.getCurrentVariantImages();

        return html`
            <div class="w-full max-w-[1400px] mx-auto px-4 md:px-6 py-6 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 overflow-x-hidden box-border">
                <!-- Top Navigation -->
                <div class="flex items-center gap-4 mb-8 flex-wrap">
                    <button 
                        class="w-10 h-10 rounded-full border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 cursor-pointer flex items-center justify-center text-xl transition-all duration-200 flex-shrink-0 hover:border-gray-900 dark:hover:border-gray-100 hover:-translate-x-0.5" 
                        @click="${this.handleBack}" 
                        title="Go back">←</button>
                    <nav class="flex items-center gap-2 flex-1 text-sm text-gray-500 dark:text-gray-400 flex-wrap">
                        <a href="#" class="text-gray-500 dark:text-gray-400 no-underline transition-colors duration-200 hover:text-gray-900 dark:hover:text-gray-100">Home</a>
                        <span>/</span>
                        <a href="#" class="text-gray-500 dark:text-gray-400 no-underline transition-colors duration-200 hover:text-gray-900 dark:hover:text-gray-100">Men</a>
                        <span>/</span>
                        <a href="#" class="text-gray-500 dark:text-gray-400 no-underline transition-colors duration-200 hover:text-gray-900 dark:hover:text-gray-100">Tops</a>
                        <span>/</span>
                        <span>${this.product.name}</span>
                    </nav>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-10 mb-12 w-full max-w-full box-border">
                    <!-- Gallery -->
                    <div class="flex flex-col gap-4 w-full max-w-full box-border">
                        <div class="bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden aspect-[3/4] w-full max-w-full box-border relative group cursor-zoom-in" @click="${() => this.openImageModal(this.selectedImage)}">
                            <img class="w-full h-full max-w-full object-cover block" src="${variantImages[this.selectedImage]}" alt="${this.product.name}" />
                            <div class="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-200 flex items-center justify-center">
                                <div class="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white/90 dark:bg-gray-800/90 rounded-full p-3">
                                    <svg class="w-6 h-6 text-gray-900 dark:text-gray-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"></path>
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <div class="flex gap-3 overflow-x-auto w-full max-w-full box-border [&::-webkit-scrollbar]:h-1 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-track]:dark:bg-gray-800 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:dark:bg-gray-600 [&::-webkit-scrollbar-thumb]:rounded [&::-webkit-scrollbar]:rounded [scrollbar-width:thin]">
                            ${variantImages.slice(0, 4).map((img, i) => html`
                                <div 
                                    class="flex-shrink-0 w-20 h-20 min-w-[80px] rounded-lg overflow-hidden cursor-pointer border-2 transition-all duration-200 box-border ${this.selectedImage === i ? 'border-emerald-500 dark:border-emerald-500' : 'border-transparent'}" 
                                    @click="${() => this.selectImage(i)}">
                                    <img class="w-full h-full max-w-full object-cover block" src="${img}" alt="View ${i + 1}" />
                                </div>
                            `)}
                            ${variantImages.length > 4 ? html`
                                <div class="w-20 h-20 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-sm font-semibold text-gray-500 dark:text-gray-400 cursor-pointer">+${variantImages.length - 4} more</div>
                            ` : ''}
                        </div>
                    </div>

                    <!-- Product Info -->
                    <div class="flex flex-col gap-6 w-full max-w-full box-border">
                        <h1 class="text-3xl md:text-2xl font-bold leading-tight break-words">${this.product.name}</h1>
                        <p class="text-base text-gray-500 dark:text-gray-400 -mt-2">${this.product.subtitle}</p>

                        <p class="text-[0.9375rem] leading-[1.7] text-gray-500 dark:text-gray-400 break-words">
                            ${this.product.description}
                        </p>

                        <div class="flex items-center gap-4 flex-wrap w-full max-w-full">
                            <span class="inline-flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-md text-sm">⭐ ${this.product.sold} Sold</span>
                            <div class="flex items-center gap-2 flex-wrap w-full max-w-full">
                                <div class="flex gap-0.5 flex-shrink-0">${this.renderStars(this.product.rating)}</div>
                                <span class="text-sm text-gray-500 dark:text-gray-400 min-w-0 break-words">${this.product.rating} (${this.product.reviewCount} reviews)</span>
                            </div>
                        </div>

                        <div class="flex items-baseline gap-4 w-full max-w-full flex-wrap">
                            <div class="text-3xl md:text-2xl font-bold text-emerald-500">$${this.product.price.toFixed(2)}</div>
                            <div class="text-xl text-gray-500 dark:text-gray-400 line-through">$${this.product.originalPrice.toFixed(2)}</div>
                        </div>

                        <!-- Color -->
                        <div class="flex flex-col gap-3 w-full max-w-full">
                            <div class="font-semibold text-[0.9375rem]">Color: ${this.selectedColor}</div>
                            <div class="flex gap-3 flex-wrap w-full max-w-full">
                                ${this.product.colors.map(color => html`
                                    <div
                                        class="w-11 h-11 rounded-lg cursor-pointer border-[3px] transition-all duration-200 ${this.selectedColor === color.name ? 'border-gray-900 dark:border-gray-100 scale-110' : 'border-transparent'}"
                                        style="background: ${color.hex}"
                                        @click="${() => this.selectColor(color.name)}"
                                        title="${color.name}"
                                    ></div>
                                `)}
                            </div>
                        </div>

                        <!-- Size -->
                        <div class="flex flex-col gap-3 w-full max-w-full">
                            <div class="flex justify-between items-center">
                                <div class="font-semibold text-[0.9375rem]">Size: ${this.selectedSize}</div>
                                <button class="text-emerald-500 dark:text-emerald-400 text-sm cursor-pointer underline hover:text-emerald-600 dark:hover:text-emerald-300 transition-colors" @click="${this.toggleSizeGuide}">Size guide</button>
                            </div>
                            <div class="flex gap-3 md:gap-2 flex-wrap w-full max-w-full">
                                ${this.product.sizes.map(size => html`
                                    <button
                                        class="min-w-[60px] md:min-w-[50px] px-4 py-3 md:px-3.5 md:py-2.5 border-2 rounded-lg font-semibold transition-all duration-200 ${this.selectedSize === size ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 hover:border-emerald-500'} ${!this.isSizeAvailable(size) ? 'opacity-40 cursor-not-allowed line-through' : ''} text-base md:text-sm"
                                        @click="${() => this.selectSize(size)}"
                                        ?disabled="${!this.isSizeAvailable(size)}"
                                        title="${this.isSizeAvailable(size) ? size : size + ' (Not available for ' + this.selectedColor + ')'}"
                                    >
                                        ${size}
                                    </button>
                                `)}
                            </div>
                        </div>

                        <!-- Actions -->
                        <div class="flex flex-col gap-4 mt-4 w-full max-w-full">
                            <button class="px-8 py-4 rounded-[10px] text-base font-semibold cursor-pointer transition-all duration-200 border-none flex items-center justify-center gap-2 w-full max-w-full box-border bg-emerald-500 text-white hover:bg-emerald-600 hover:-translate-y-0.5" @click="${this.handleAddToCart}">
                                + Add to Cart
                            </button>
                            <button class="px-8 py-4 rounded-[10px] text-base font-semibold cursor-pointer transition-all duration-200 border-2 flex items-center justify-center gap-2 w-full max-w-full box-border bg-transparent text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-700 hover:border-gray-900 dark:hover:border-gray-100" @click="${this.handleBuyItem}">
                                Buy this Item
                            </button>
                            <div class="flex gap-3 justify-center w-full max-w-full flex-wrap">
                                <button 
                                    class="w-12 h-12 rounded-lg border-2 cursor-pointer flex items-center justify-center transition-all duration-200 ${this.isWishlisted ? 'bg-red-500 border-red-500 text-white shadow-lg shadow-red-500/30' : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-red-400 hover:bg-red-50 dark:hover:bg-red-900/20'}" 
                                    @click="${this.toggleWishlist}"
                                    title="${this.isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}">
                                    <svg class="w-6 h-6 ${this.isWishlisted ? 'fill-current' : 'stroke-current fill-none'}" viewBox="0 0 24 24" stroke-width="2">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                    </svg>
                                </button>
                                </div>
                        </div>
                    </div>
                </div>

                <!-- Tabs Section -->
                <div class="mt-12 pt-12 border-t border-gray-200 dark:border-gray-700">
                    <div class="flex gap-8 md:gap-4 border-b-2 border-gray-200 dark:border-gray-700 mb-8 flex-wrap">
                        <button class="py-4 bg-transparent border-none border-b-[3px] mb-[-2px] cursor-pointer text-base md:text-sm font-semibold transition-all duration-200 ${this.activeTab === 'details' ? 'text-gray-900 dark:text-gray-100 border-b-emerald-500' : 'text-gray-500 dark:text-gray-400 border-b-transparent'}" @click="${() => this.setActiveTab('details')}">
                            Details
                        </button>
                        <button class="py-4 bg-transparent border-none border-b-[3px] mb-[-2px] cursor-pointer text-base md:text-sm font-semibold transition-all duration-200 ${this.activeTab === 'reviews' ? 'text-gray-900 dark:text-gray-100 border-b-emerald-500' : 'text-gray-500 dark:text-gray-400 border-b-transparent'}" @click="${() => this.setActiveTab('reviews')}">
                            Reviews
                        </button>
                    </div>

                    <!-- Details Tab -->
                    <div class="${this.activeTab === 'details' ? 'block' : 'hidden'}">
                        <div class="text-gray-500 dark:text-gray-400 leading-[1.7]">
                            <h3 class="mb-4 text-gray-900 dark:text-gray-100">Product Details</h3>
                            <p>Premium 100% cotton construction with reinforced stitching. Features ribbed cuffs and hem, relaxed fit design, and pre-shrunk fabric for lasting quality. Machine washable. Available in multiple colors and sizes.</p>
                        </div>
                    </div>

                    <!-- Reviews Tab -->
                    <div class="${this.activeTab === 'reviews' ? 'block' : 'hidden'}">
                        <div class="flex gap-12 md:flex-col md:gap-8 mb-8 flex-wrap">
                            <div class="text-center">
                                <div class="text-[3.5rem] font-bold leading-none">${this.product.rating}</div>
                                <div class="flex gap-0.5 justify-center mt-2">${this.renderStars(this.product.rating)}</div>
                                <div class="text-sm text-gray-500 dark:text-gray-400 mt-2">${this.product.reviewCount} reviews</div>
                            </div>

                            <div class="flex-1">
                                ${[5, 4, 3, 2, 1].map(star => {
                                    const count = this.product.ratingDistribution[star];
                                    const percentage = (count / this.product.reviewCount) * 100;
                                    return html`
                                        <div class="flex items-center gap-4 mb-3">
                                            <div class="text-sm text-gray-500 dark:text-gray-400 w-10">${star} ★</div>
                                            <div class="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded overflow-hidden">
                                                <div class="h-full bg-amber-400 transition-all duration-300" style="width: ${percentage}%"></div>
                                            </div>
                                            <div class="text-sm text-gray-500 dark:text-gray-400 w-10 text-right">${count}</div>
                                        </div>
                                    `;
                                })}
                            </div>
                        </div>

                        <div class="flex flex-col gap-6 mt-8">
                            ${this.product.reviews.map(review => html`
                                <div class="pb-6 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                                    <div class="flex gap-4 mb-3">
                                        <div class="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center font-semibold text-emerald-500">${review.name.charAt(0)}</div>
                                        <div class="flex-1">
                                            <div class="font-semibold text-[0.9375rem]">${review.name}</div>
                                            <div class="flex gap-0.5">${this.renderStars(review.rating)}</div>
                                        </div>
                                    </div>
                                    <p class="leading-[1.7] text-gray-500 dark:text-gray-400 my-3 break-words">${review.text}</p>
                                    <div class="flex gap-6 mt-3">
                                        <button class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 bg-transparent border-none cursor-pointer hover:text-emerald-500">👍 ${review.likes}</button>
                                        <button class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 bg-transparent border-none cursor-pointer hover:text-emerald-500">👎 ${review.dislikes}</button>
                                        <button class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 bg-transparent border-none cursor-pointer hover:text-emerald-500">Reply</button>
                                    </div>
                                </div>
                            `)}
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
                                <p class="text-gray-600 dark:text-gray-400">Find your perfect fit using our size guide below:</p>
                                <div class="overflow-x-auto">
                                    <table class="w-full border-collapse">
                                        <thead>
                                            <tr class="bg-gray-100 dark:bg-gray-700">
                                                <th class="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left">Size</th>
                                                <th class="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left">Chest (inches)</th>
                                                <th class="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left">Length (inches)</th>
                                                <th class="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left">Sleeve (inches)</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr><td class="border border-gray-300 dark:border-gray-600 px-4 py-2">XS</td><td class="border border-gray-300 dark:border-gray-600 px-4 py-2">34-36</td><td class="border border-gray-300 dark:border-gray-600 px-4 py-2">26</td><td class="border border-gray-300 dark:border-gray-600 px-4 py-2">32</td></tr>
                                            <tr class="bg-gray-50 dark:bg-gray-900"><td class="border border-gray-300 dark:border-gray-600 px-4 py-2">S</td><td class="border border-gray-300 dark:border-gray-600 px-4 py-2">36-38</td><td class="border border-gray-300 dark:border-gray-600 px-4 py-2">27</td><td class="border border-gray-300 dark:border-gray-600 px-4 py-2">33</td></tr>
                                            <tr><td class="border border-gray-300 dark:border-gray-600 px-4 py-2">M</td><td class="border border-gray-300 dark:border-gray-600 px-4 py-2">38-40</td><td class="border border-gray-300 dark:border-gray-600 px-4 py-2">28</td><td class="border border-gray-300 dark:border-gray-600 px-4 py-2">34</td></tr>
                                            <tr class="bg-gray-50 dark:bg-gray-900"><td class="border border-gray-300 dark:border-gray-600 px-4 py-2">L</td><td class="border border-gray-300 dark:border-gray-600 px-4 py-2">40-42</td><td class="border border-gray-300 dark:border-gray-600 px-4 py-2">29</td><td class="border border-gray-300 dark:border-gray-600 px-4 py-2">35</td></tr>
                                            <tr><td class="border border-gray-300 dark:border-gray-600 px-4 py-2">XL</td><td class="border border-gray-300 dark:border-gray-600 px-4 py-2">42-44</td><td class="border border-gray-300 dark:border-gray-600 px-4 py-2">30</td><td class="border border-gray-300 dark:border-gray-600 px-4 py-2">36</td></tr>
                                            <tr class="bg-gray-50 dark:bg-gray-900"><td class="border border-gray-300 dark:border-gray-600 px-4 py-2">XXL</td><td class="border border-gray-300 dark:border-gray-600 px-4 py-2">44-46</td><td class="border border-gray-300 dark:border-gray-600 px-4 py-2">31</td><td class="border border-gray-300 dark:border-gray-600 px-4 py-2">37</td></tr>
                                        </tbody>
                                    </table>
                                </div>
                                <p class="text-sm text-gray-500 dark:text-gray-400 mt-4">* Measurements are approximate and may vary slightly. For best fit, measure your chest at the fullest point.</p>
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

customElements.define('product-detail-fashion', ProductDetailFashion);
