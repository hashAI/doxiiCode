/**
 * Product Detail Sports - Image-heavy product page with vertical thumbnails
 * Inspired by: Sports/Outdoor ecommerce (Paraglider design)
 * Features: Vertical image gallery, size guide, shipping calculator, quantity controls, wishlist, reviews
 *
 * @element product-detail-sports
 * @fires product:add-to-cart - When add to cart is clicked
 * @fires product:buy-now - When buy now is clicked
 * @fires product:wishlist - When wishlist is toggled
 */

import { BaseComponent } from '../../base-component.js';
import { html } from 'https://cdn.jsdelivr.net/npm/lit@3.2.1/+esm';

export class ProductDetailSports extends BaseComponent {
    static properties = {
        product: { type: Object },
        selectedImage: { type: Number },
        selectedColor: { type: String },
        selectedSize: { type: String },
        quantity: { type: Number },
        isWishlisted: { type: Boolean },
        showSizeGuide: { type: Boolean },
        theme: { type: String },
        showImageModal: { type: Boolean },
        modalImageIndex: { type: Number },
        shippingLocation: { type: String },
        showShippingDropdown: { type: Boolean }
    };

    constructor() {
        super();
        this.theme = 'light';
        this.selectedImage = 0;
        this.selectedColor = '';
        this.selectedSize = '';
        this.quantity = 2;
        this.isWishlisted = false;
        this.showSizeGuide = false;
        this.showImageModal = false;
        this.modalImageIndex = 0;

        this.product = {
            name: 'Paraglider Ozone Mantra M4',
            price: 1290,
            originalPrice: 1083,
            discount: 16,
            rating: 4.99,
            reviewCount: 24,
            totalReviewCount: 215,
            location: 'South Haven, United States',
            shippingCost: 43.68,
            images: [
                'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800&h=600&fit=crop',
                'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&h=600&fit=crop',
                'https://images.unsplash.com/photo-1511593358241-7eea1f3c84e5?w=800&h=600&fit=crop',
                'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&h=600&fit=crop',
                'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
                'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop'
            ],
            colors: [
                { 
                    name: 'Red/Blue', 
                    hex: 'linear-gradient(135deg, #ef4444 50%, #3b82f6 50%)', 
                    imageIndex: 0, 
                    availableSizes: ['XS', 'M', 'L', 'XL'],
                    variants: {
                        'XS': ['https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&h=600&fit=crop'],
                        'M': ['https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1511593358241-7eea1f3c84e5?w=800&h=600&fit=crop'],
                        'L': ['https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1511593358241-7eea1f3c84e5?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&h=600&fit=crop'],
                        'XL': ['https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&h=600&fit=crop']
                    }
                },
                { 
                    name: 'Blue/White', 
                    hex: 'linear-gradient(135deg, #3b82f6 50%, #f3f4f6 50%)', 
                    imageIndex: 1, 
                    availableSizes: ['M', 'L', 'XL'],
                    variants: {
                        'M': ['https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1511593358241-7eea1f3c84e5?w=800&h=600&fit=crop'],
                        'L': ['https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1511593358241-7eea1f3c84e5?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&h=600&fit=crop'],
                        'XL': ['https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1511593358241-7eea1f3c84e5?w=800&h=600&fit=crop']
                    }
                },
                { 
                    name: 'Orange', 
                    hex: '#f97316', 
                    imageIndex: 2, 
                    availableSizes: ['XS', 'S', 'M', 'L', 'XL'],
                    variants: {
                        'XS': ['https://images.unsplash.com/photo-1511593358241-7eea1f3c84e5?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&h=600&fit=crop'],
                        'S': ['https://images.unsplash.com/photo-1511593358241-7eea1f3c84e5?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&h=600&fit=crop'],
                        'M': ['https://images.unsplash.com/photo-1511593358241-7eea1f3c84e5?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop'],
                        'L': ['https://images.unsplash.com/photo-1511593358241-7eea1f3c84e5?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop'],
                        'XL': ['https://images.unsplash.com/photo-1511593358241-7eea1f3c84e5?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&h=600&fit=crop']
                    }
                },
                { 
                    name: 'Gray', 
                    hex: '#9ca3af', 
                    imageIndex: 3, 
                    availableSizes: ['S', 'M', 'L'],
                    variants: {
                        'S': ['https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop'],
                        'M': ['https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop'],
                        'L': ['https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop']
                    }
                },
                { 
                    name: 'Sky Blue', 
                    hex: '#0ea5e9', 
                    imageIndex: 4, 
                    availableSizes: ['XS', 'M', 'XL'],
                    variants: {
                        'XS': ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop'],
                        'M': ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop'],
                        'XL': ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop']
                    }
                }
            ],
            sizes: ['XS', 'S', 'M', 'L', 'XL'],
            reviews: [
                { name: 'Jake Morrison', rating: 5, text: 'Amazing paraglider! The handling is superb and it\'s incredibly stable. Perfect for intermediate to advanced pilots.', likes: 18, dislikes: 0 },
                { name: 'Lisa Chen', rating: 5, text: 'Best investment I\'ve made! The build quality is exceptional and performance exceeds expectations.', likes: 22, dislikes: 1 },
                { name: 'Ryan Parker', rating: 4, text: 'Great glider overall. Very responsive and fun to fly. Only minor issue is the price point, but you get what you pay for.', likes: 14, dislikes: 2 },
                { name: 'Maria Gonzalez', rating: 5, text: 'Absolutely love this paraglider! The color options are beautiful and it flies like a dream.', likes: 16, dislikes: 0 }
            ]
        };

        this.selectedColor = this.product.colors[2].name;
        this.selectedSize = this.product.sizes[4];
        this.shippingLocation = 'Moldova';
        this.showShippingDropdown = false;
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

    incrementQty() {
        this.quantity++;
    }

    decrementQty() {
        if (this.quantity > 1) this.quantity--;
    }

    toggleWishlist() {
        this.isWishlisted = !this.isWishlisted;
        this.dispatchEvent(new CustomEvent('product:wishlist', {
            detail: { isWishlisted: this.isWishlisted, product: this.product },
            bubbles: true,
            composed: true
        }));
    }

    handleAddToCart() {
        this.dispatchEvent(new CustomEvent('product:add-to-cart', {
            detail: {
                product: this.product,
                color: this.selectedColor,
                size: this.selectedSize,
                quantity: this.quantity
            },
            bubbles: true,
            composed: true
        }));
    }

    handleBuyNow() {
        this.dispatchEvent(new CustomEvent('product:buy-now', {
            detail: {
                product: this.product,
                color: this.selectedColor,
                size: this.selectedSize,
                quantity: this.quantity
            },
            bubbles: true,
            composed: true
        }));
    }

    renderStars(rating) {
        const stars = [];
        const fullStars = Math.floor(rating);
        for (let i = 0; i < 5; i++) {
            stars.push(html`<span class="text-lg ${i < fullStars ? 'text-amber-400' : 'text-gray-200 dark:text-gray-700'}">${i < fullStars ? '★' : '☆'}</span>`);
        }
        return stars;
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

    formatPrice(price) {
        return price.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
    }

    getTotalPrice() {
        return this.product.price * this.quantity;
    }

    getReviewBreakdown() {
        // Calculate star rating breakdown (mock data based on overall rating)
        const totalReviews = 215;
        const breakdown = {
            5: Math.round(totalReviews * 0.85),
            4: Math.round(totalReviews * 0.10),
            3: Math.round(totalReviews * 0.01),
            2: Math.round(totalReviews * 0.01),
            1: Math.round(totalReviews * 0.03)
        };
        return breakdown;
    }

    toggleShippingDropdown() {
        this.showShippingDropdown = !this.showShippingDropdown;
    }

    selectShippingLocation(location) {
        this.shippingLocation = location;
        this.showShippingDropdown = false;
    }

    render() {
        const variantImages = this.getCurrentVariantImages();
        const totalPrice = this.getTotalPrice();
        const reviewBreakdown = this.getReviewBreakdown();

        return html`
            <div class="w-full bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen pb-24 md:pb-0">
                <div class="w-full max-w-[1400px] mx-auto px-4 py-6">
                    <!-- Top Navigation -->
                    <div class="flex items-center gap-4 mb-8 flex-wrap">
                        <button 
                            class="w-10 h-10 rounded-full border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 cursor-pointer flex items-center justify-center text-xl transition-all duration-200 flex-shrink-0 hover:border-gray-900 dark:hover:border-gray-100 hover:-translate-x-0.5" 
                            @click="${this.handleBack}" 
                            title="Go back">←</button>
                        <nav class="flex items-center gap-2 flex-1 text-sm text-gray-500 dark:text-gray-400 flex-wrap">
                            <a href="#" class="text-gray-500 dark:text-gray-400 no-underline transition-colors duration-200 hover:text-gray-900 dark:hover:text-gray-100">Home</a>
                            <span>/</span>
                            <a href="#" class="text-gray-500 dark:text-gray-400 no-underline transition-colors duration-200 hover:text-gray-900 dark:hover:text-gray-100">Sports</a>
                            <span>/</span>
                            <a href="#" class="text-gray-500 dark:text-gray-400 no-underline transition-colors duration-200 hover:text-gray-900 dark:hover:text-gray-100">Paragliding</a>
                            <span>/</span>
                            <span>${this.product.name}</span>
                        </nav>
                    </div>

                    <div class="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-8 lg:gap-12">
                        <!-- Left Column: Gallery + Reviews -->
                        <div class="flex flex-col gap-8">
                            <!-- Gallery -->
                            <div class="flex gap-4">
                                <!-- Thumbnails - Vertical -->
                                <div class="flex flex-col gap-3 overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-track]:dark:bg-gray-800 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:dark:bg-gray-600 [&::-webkit-scrollbar-thumb]:rounded [scrollbar-width:thin]" style="max-height: 600px;">
                                    ${variantImages.map((img, i) => html`
                                        <div 
                                            class="w-20 h-20 rounded-lg overflow-hidden cursor-pointer border-2 transition-all duration-200 flex-shrink-0 ${this.selectedImage === i ? 'border-white shadow-md' : 'border-transparent'}" 
                                            @click="${() => this.selectImage(i)}">
                                            <img class="w-full h-full object-cover" src="${img}" alt="View ${i + 1}" />
                                        </div>
                                    `)}
                                </div>

                                <!-- Main Image -->
                                <div class="flex-1 min-w-0">
                                    <div class="relative bg-white dark:bg-gray-800 rounded-lg overflow-hidden aspect-[4/3] group cursor-zoom-in" @click="${() => this.openImageModal(this.selectedImage)}">
                                        <img class="w-full h-full object-cover" src="${variantImages[this.selectedImage]}" alt="${this.product.name}" />
                                        <div class="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1.5 rounded text-sm font-medium">${this.selectedImage + 1}/${variantImages.length}</div>
                                    </div>
                                </div>
                            </div>

                            <!-- Item Reviews Section -->
                            <div class="bg-white dark:bg-gray-800 rounded-lg p-6">
                                <h2 class="text-lg font-semibold mb-4">Item Reviews</h2>
                                <div class="flex items-center gap-2 mb-6">
                                    <div class="flex gap-0.5">${this.renderStars(this.product.rating)}</div>
                                    <span class="text-sm text-gray-600 dark:text-gray-400">${this.product.rating} (${this.product.totalReviewCount || 215})</span>
                                </div>
                                
                                <!-- Star Rating Breakdown -->
                                <div class="space-y-2 mb-4">
                                    ${[5, 4, 3, 2, 1].map(stars => {
                                        const count = reviewBreakdown[stars] || 0;
                                        const percentage = Math.round((count / (this.product.totalReviewCount || 215)) * 100);
                                        return html`
                                            <div class="flex items-center gap-3">
                                                <span class="text-sm text-gray-600 dark:text-gray-400 w-8">${stars} Star</span>
                                                <div class="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                                    <div class="h-full bg-amber-400" style="width: ${percentage}%"></div>
                                                </div>
                                                <span class="text-sm text-gray-600 dark:text-gray-400 w-12 text-right">${percentage}%</span>
                                            </div>
                                        `;
                                    })}
                                </div>
                                
                                <a href="#" class="text-sm text-blue-500 dark:text-blue-400 hover:underline">How does Invastor calculate star ratings?</a>
                            </div>
                        </div>

                        <!-- Right Column: Product Info -->
                        <div class="flex flex-col gap-6 relative">
                            <!-- Top Right Action Buttons -->
                            <div class="absolute top-0 right-0 flex flex-col gap-2 z-10">
                                <button class="w-10 h-10 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors" title="Share">
                                    <svg class="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path>
                                    </svg>
                                </button>
                                <button 
                                    class="w-10 h-10 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors relative group" 
                                    @click="${this.toggleWishlist}"
                                    title="Save">
                                    <svg class="w-5 h-5 ${this.isWishlisted ? 'text-red-500 fill-current' : 'text-gray-600 dark:text-gray-400'}" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
                                    </svg>
                                    <span class="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">Save</span>
                                </button>
                                <button class="w-10 h-10 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors relative">
                                    <div class="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                                        <span class="text-xs text-gray-600 dark:text-gray-400">U</span>
                                    </div>
                                    <div class="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                                        <span class="text-white text-xs">+</span>
                                    </div>
                                </button>
                            </div>

                            <h1 class="text-2xl font-bold leading-tight break-words pr-12">${this.product.name}</h1>

                            <div class="flex items-center gap-3">
                                <div class="flex gap-0.5">${this.renderStars(this.product.rating)}</div>
                                <span class="text-sm text-gray-600 dark:text-gray-400">${this.product.rating} (${this.product.reviewCount})</span>
                                <span class="text-sm text-gray-600 dark:text-gray-400">• ${this.product.location}</span>
                            </div>

                            <!-- Price -->
                            <div class="flex flex-col gap-2">
                                <div class="flex items-baseline gap-3">
                                    <div class="text-3xl font-bold">$${this.formatPrice(this.product.price)}</div>
                                    <div class="bg-purple-500 text-white px-2 py-1 rounded text-xs font-semibold">-${this.product.discount}%</div>
                                </div>
                                <div class="text-base text-gray-500 dark:text-gray-400 line-through">$${this.formatPrice(this.product.originalPrice)}</div>
                            </div>

                            <!-- Color -->
                            <div class="flex flex-col gap-3">
                                <div class="font-semibold text-[0.9375rem]">Color: ${this.selectedColor}</div>
                                <div class="flex gap-3 flex-wrap">
                                    ${this.product.colors.map(color => html`
                                        <div
                                            class="w-12 h-12 rounded-sm cursor-pointer border-2 transition-all duration-200 ${this.selectedColor === color.name ? 'border-white shadow-md' : 'border-transparent'}"
                                            style="background: ${color.hex}"
                                            @click="${() => this.selectColor(color.name)}"
                                            title="${color.name}"
                                        ></div>
                                    `)}
                                </div>
                            </div>

                            <!-- Size -->
                            <div class="flex flex-col gap-3">
                                <div class="flex justify-between items-center">
                                    <div class="font-semibold text-[0.9375rem]">Size: ${this.selectedSize}</div>
                                    <button class="text-blue-500 dark:text-blue-400 text-sm cursor-pointer underline hover:text-blue-600 dark:hover:text-blue-300 transition-colors" @click="${this.toggleSizeGuide}">Size guide</button>
                                </div>
                                <div class="flex gap-3 flex-wrap">
                                    ${this.product.sizes.map(size => html`
                                        <button
                                            class="w-12 h-12 rounded-full border-2 font-semibold text-sm transition-all duration-200 ${this.selectedSize === size ? 'border-black bg-transparent text-black' : 'border-gray-300 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:border-gray-400'} ${!this.isSizeAvailable(size) ? 'opacity-40 cursor-not-allowed line-through' : ''}"
                                            @click="${() => this.selectSize(size)}"
                                            ?disabled="${!this.isSizeAvailable(size)}"
                                            title="${this.isSizeAvailable(size) ? size : size + ' (Not available for ' + this.selectedColor + ')'}"
                                        >
                                            ${size}
                                        </button>
                                    `)}
                                </div>
                            </div>

                            <!-- Quantity -->
                            <div class="flex flex-col gap-3">
                                <div class="font-semibold text-[0.9375rem]">Quantity: ${this.quantity}</div>
                                <div class="flex items-center gap-6">
                                    <div class="flex items-center border border-gray-300 dark:border-gray-600 rounded overflow-hidden">
                                        <button class="w-10 h-10 border-none bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 cursor-pointer text-xl transition-colors duration-200 hover:bg-gray-50 dark:hover:bg-gray-700" @click="${this.decrementQty}">−</button>
                                        <div class="min-w-[60px] text-center font-semibold text-base px-3">${this.quantity < 10 ? '0' : ''}${this.quantity}</div>
                                        <button class="w-10 h-10 border-none bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 cursor-pointer text-xl transition-colors duration-200 hover:bg-gray-50 dark:hover:bg-gray-700" @click="${this.incrementQty}">+</button>
                                    </div>
                                </div>
                            </div>

                            <!-- Actions -->
                            <div class="flex gap-4 md:static fixed bottom-0 left-0 right-0 md:bg-transparent bg-white dark:bg-gray-800 md:border-0 border-t border-gray-200 dark:border-gray-700 md:shadow-none shadow-lg md:p-0 p-4 z-30">
                                <div class="w-full max-w-[1400px] mx-auto flex gap-4 md:px-0 px-4">
                                    <button class="flex-1 px-6 py-3 bg-white dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-600 rounded-lg text-base font-semibold cursor-pointer transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-800" @click="${this.handleAddToCart}">Add to cart</button>
                                    <button class="flex-1 px-6 py-3 bg-purple-500 text-white rounded-lg text-base font-semibold cursor-pointer transition-all duration-200 hover:bg-purple-600" @click="${this.handleBuyNow}">Buy Now</button>
                                </div>
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
                                <p class="text-gray-600 dark:text-gray-400">Find your perfect fit using our paraglider size guide below:</p>
                                <div class="overflow-x-auto">
                                    <table class="w-full border-collapse">
                                        <thead>
                                            <tr class="bg-gray-100 dark:bg-gray-700">
                                                <th class="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left">Size</th>
                                                <th class="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left">Weight Range (kg)</th>
                                                <th class="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left">Wing Area (m²)</th>
                                                <th class="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left">Skill Level</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr><td class="border border-gray-300 dark:border-gray-600 px-4 py-2">XS</td><td class="border border-gray-300 dark:border-gray-600 px-4 py-2">45-65</td><td class="border border-gray-300 dark:border-gray-600 px-4 py-2">20-22</td><td class="border border-gray-300 dark:border-gray-600 px-4 py-2">Beginner</td></tr>
                                            <tr class="bg-gray-50 dark:bg-gray-900"><td class="border border-gray-300 dark:border-gray-600 px-4 py-2">S</td><td class="border border-gray-300 dark:border-gray-600 px-4 py-2">60-80</td><td class="border border-gray-300 dark:border-gray-600 px-4 py-2">22-24</td><td class="border border-gray-300 dark:border-gray-600 px-4 py-2">Beginner</td></tr>
                                            <tr><td class="border border-gray-300 dark:border-gray-600 px-4 py-2">M</td><td class="border border-gray-300 dark:border-gray-600 px-4 py-2">75-95</td><td class="border border-gray-300 dark:border-gray-600 px-4 py-2">24-26</td><td class="border border-gray-300 dark:border-gray-600 px-4 py-2">Intermediate</td></tr>
                                            <tr class="bg-gray-50 dark:bg-gray-900"><td class="border border-gray-300 dark:border-gray-600 px-4 py-2">L</td><td class="border border-gray-300 dark:border-gray-600 px-4 py-2">90-110</td><td class="border border-gray-300 dark:border-gray-600 px-4 py-2">26-28</td><td class="border border-gray-300 dark:border-gray-600 px-4 py-2">Intermediate</td></tr>
                                            <tr><td class="border border-gray-300 dark:border-gray-600 px-4 py-2">XL</td><td class="border border-gray-300 dark:border-gray-600 px-4 py-2">105-125</td><td class="border border-gray-300 dark:border-gray-600 px-4 py-2">28-30</td><td class="border border-gray-300 dark:border-gray-600 px-4 py-2">Advanced</td></tr>
                                        </tbody>
                                    </table>
                                </div>
                                <p class="text-sm text-gray-500 dark:text-gray-400 mt-4">* Weight range includes pilot and equipment. Always consult with a certified instructor for proper sizing.</p>
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

customElements.define('product-detail-sports', ProductDetailSports);
