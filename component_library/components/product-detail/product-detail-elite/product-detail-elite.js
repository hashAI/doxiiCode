/**
 * Product Detail Elite - Elegant product page with expandable accordion sections
 * Inspired by: Furniture/Home decor ecommerce (Elite Chair design)
 * Features: Color swatches, size selection, quantity controls, expandable sections, shipping info, reviews, wishlist
 *
 * @element product-detail-elite
 * @fires product:add-to-cart - When add to cart is clicked
 * @fires product:buy-now - When buy now is clicked
 * @fires product:color-change - When color selection changes
 * @fires product:wishlist - When wishlist is toggled
 */

import { BaseComponent } from '../../base-component.js';
import { html } from 'https://cdn.jsdelivr.net/npm/lit@3.2.1/+esm';

export class ProductDetailElite extends BaseComponent {
    static properties = {
        product: { type: Object },
        selectedColor: { type: String },
        selectedSize: { type: String },
        quantity: { type: Number },
        expandedSections: { type: Array },
        isWishlisted: { type: Boolean },
        theme: { type: String },
        selectedImage: { type: Number },
        showSizeGuide: { type: Boolean },
        showImageModal: { type: Boolean },
        modalImageIndex: { type: Number }
    };

    constructor() {
        super();
        this.theme = 'light';
        this.quantity = 1;
        this.expandedSections = ['description'];
        this.isWishlisted = false;
        this.selectedImage = 0;
        this.showSizeGuide = false;
        this.showImageModal = false;
        this.modalImageIndex = 0;

        this.product = {
            name: 'Elite Comfort Chair',
            price: 240.99,
            rating: 4.8,
            reviewCount: 156,
            description: 'Ergonomic design chair in premium fabric with adjustable height and tilt. Perfect blend of comfort and style for modern workspaces. Features memory foam cushioning and breathable mesh back support.',
            images: [
                'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=800&h=600&fit=crop',
                'https://images.unsplash.com/photo-1519947486511-46149fa0a254?w=800&h=600&fit=crop',
                'https://images.unsplash.com/photo-1503602642458-232111445657?w=800&h=600&fit=crop'
            ],
            colors: [
                { 
                    name: 'Beige', 
                    hex: '#E8DCC4', 
                    imageIndex: 0, 
                    availableSizes: ['Small', 'Medium', 'Large'],
                    variants: {
                        'Small': ['https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1519947486511-46149fa0a254?w=800&h=600&fit=crop'],
                        'Medium': ['https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1519947486511-46149fa0a254?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1503602642458-232111445657?w=800&h=600&fit=crop'],
                        'Large': ['https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1519947486511-46149fa0a254?w=800&h=600&fit=crop']
                    }
                },
                { 
                    name: 'Gray', 
                    hex: '#9CA3AF', 
                    imageIndex: 1, 
                    availableSizes: ['Small', 'Medium', 'Large', 'XL'],
                    variants: {
                        'Small': ['https://images.unsplash.com/photo-1519947486511-46149fa0a254?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1503602642458-232111445657?w=800&h=600&fit=crop'],
                        'Medium': ['https://images.unsplash.com/photo-1519947486511-46149fa0a254?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1503602642458-232111445657?w=800&h=600&fit=crop'],
                        'Large': ['https://images.unsplash.com/photo-1519947486511-46149fa0a254?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1503602642458-232111445657?w=800&h=600&fit=crop'],
                        'XL': ['https://images.unsplash.com/photo-1519947486511-46149fa0a254?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1503602642458-232111445657?w=800&h=600&fit=crop']
                    }
                },
                { 
                    name: 'Charcoal', 
                    hex: '#374151', 
                    imageIndex: 2, 
                    availableSizes: ['Medium', 'Large', 'XL'],
                    variants: {
                        'Medium': ['https://images.unsplash.com/photo-1503602642458-232111445657?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=800&h=600&fit=crop'],
                        'Large': ['https://images.unsplash.com/photo-1503602642458-232111445657?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1519947486511-46149fa0a254?w=800&h=600&fit=crop'],
                        'XL': ['https://images.unsplash.com/photo-1503602642458-232111445657?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=800&h=600&fit=crop']
                    }
                },
                { 
                    name: 'Brown', 
                    hex: '#92400E', 
                    imageIndex: 0, 
                    availableSizes: ['Small', 'Large'],
                    variants: {
                        'Small': ['https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1519947486511-46149fa0a254?w=800&h=600&fit=crop'],
                        'Large': ['https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1519947486511-46149fa0a254?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1503602642458-232111445657?w=800&h=600&fit=crop']
                    }
                }
            ],
            sizes: ['Small', 'Medium', 'Large', 'XL'],
            shipping: [
                { icon: '📦', label: 'Discount', value: 'Disc 50%' },
                { icon: '📦', label: 'Package', value: 'Reg' },
                { icon: '⏱️', label: 'Delivery Time', value: '3-4 Working Days' },
                { icon: '📅', label: 'Arrive', value: '0 - 12 Oct 2024' }
            ],
            features: [
                'Adjustable height mechanism (45-55cm)',
                '360-degree swivel rotation',
                'High-density memory foam padding',
                'Breathable mesh back support',
                'Maximum weight capacity: 120kg',
                'Easy assembly with included tools'
            ],
            materials: 'Frame: Premium steel with powder coating. Upholstery: High-grade polyester blend fabric. Padding: Multi-layer memory foam. Base: Reinforced plastic with smooth-rolling casters.',
            reviews: [
                { name: 'Michael Chen', rating: 5, text: 'Absolutely fantastic chair! The comfort level is unmatched and the build quality is exceptional. Worth every penny.', likes: 24, dislikes: 1 },
                { name: 'Sarah Williams', rating: 5, text: 'Best office chair I\'ve ever owned. My back pain has significantly reduced since I started using it.', likes: 18, dislikes: 0 },
                { name: 'David Martinez', rating: 4, text: 'Great chair overall. Assembly was straightforward and it looks beautiful in my office. Only wish it had more color options.', likes: 12, dislikes: 2 },
                { name: 'Emma Thompson', rating: 5, text: 'Perfect for long working hours. The adjustability is excellent and the memory foam is so comfortable.', likes: 31, dislikes: 0 }
            ]
        };

        this.selectedColor = this.product.colors[0].name;
        this.selectedSize = this.product.sizes[1]; // Default to 'Medium'
    }

    connectedCallback() {
        super.connectedCallback();
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            this.theme = 'dark';
            this.setAttribute('theme', 'dark');
        }
    }

    incrementQty() {
        this.quantity++;
    }

    decrementQty() {
        if (this.quantity > 1) this.quantity--;
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

        this.dispatchEvent(new CustomEvent('product:color-change', {
            detail: { color: colorName },
            bubbles: true,
            composed: true
        }));
    }

    selectSize(sizeName) {
        const selectedColorObj = this.product.colors.find(c => c.name === this.selectedColor);
        if (selectedColorObj && selectedColorObj.availableSizes.includes(sizeName)) {
            this.selectedSize = sizeName;
            // Reset to first image of the new variant
            this.selectedImage = 0;
        }
    }

    selectImage(index) {
        this.selectedImage = index;
    }

    isSizeAvailable(sizeName) {
        const selectedColorObj = this.product.colors.find(c => c.name === this.selectedColor);
        return selectedColorObj ? selectedColorObj.availableSizes.includes(sizeName) : false;
    }

    toggleWishlist() {
        this.isWishlisted = !this.isWishlisted;
        this.dispatchEvent(new CustomEvent('product:wishlist', {
            detail: { isWishlisted: this.isWishlisted, product: this.product },
            bubbles: true,
            composed: true
        }));
    }

    handleBack() {
        window.history.back();
    }

    toggleSection(section) {
        const index = this.expandedSections.indexOf(section);
        if (index > -1) {
            this.expandedSections = this.expandedSections.filter(s => s !== section);
        } else {
            this.expandedSections = [...this.expandedSections, section];
        }
    }

    isSectionExpanded(section) {
        return this.expandedSections.includes(section);
    }

    handleAddToCart() {
        this.dispatchEvent(new CustomEvent('product:add-to-cart', {
            detail: {
                product: this.product,
                color: this.selectedColor,
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
        const hasHalf = rating % 1 !== 0;

        for (let i = 0; i < 5; i++) {
            if (i < fullStars) {
                stars.push(html`<span class="text-base text-amber-400">★</span>`);
            } else if (i === fullStars && hasHalf) {
                stars.push(html`<span class="text-base text-amber-400">⯪</span>`);
            } else {
                stars.push(html`<span class="text-base text-gray-200 dark:text-gray-700">★</span>`);
            }
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

    render() {
        const variantImages = this.getCurrentVariantImages();
        return html`
            <div class="w-full max-w-[1400px] mx-auto px-4 py-8 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
                <!-- Top Navigation -->
                <div class="flex items-center gap-4 mb-8">
                    <button 
                        class="w-10 h-10 rounded-full border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 cursor-pointer flex items-center justify-center text-xl transition-all duration-200 hover:border-gray-900 dark:hover:border-gray-100 hover:-translate-x-0.5" 
                        @click="${this.handleBack}" 
                        title="Go back">←</button>
                    <nav class="flex items-center gap-2 flex-1 text-sm text-gray-500 dark:text-gray-400">
                        <a href="#" class="text-gray-500 dark:text-gray-400 no-underline transition-colors duration-200 hover:text-gray-900 dark:hover:text-gray-100">Home</a>
                        <span>/</span>
                        <a href="#" class="text-gray-500 dark:text-gray-400 no-underline transition-colors duration-200 hover:text-gray-900 dark:hover:text-gray-100">Products</a>
                        <span>/</span>
                        <span>${this.product.name}</span>
                    </nav>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <!-- Image Section -->
                    <div class="flex flex-col gap-6">
                        <div class="bg-gray-100 dark:bg-gray-800 rounded-2xl overflow-hidden aspect-[4/3] relative group cursor-zoom-in" @click="${() => this.openImageModal(this.selectedImage)}">
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
                                <div class="aspect-square rounded-xl overflow-hidden cursor-pointer border-2 transition-all duration-200 ${this.selectedImage === i ? 'border-gray-900 dark:border-gray-100' : 'border-transparent hover:border-gray-900 dark:hover:border-gray-100'}" @click="${() => this.selectImage(i)}">
                                    <img class="w-full h-full object-cover" src="${img}" alt="Product view" />
                                </div>
                            `)}
                        </div>
                    </div>

                    <!-- Product Info -->
                    <div class="flex flex-col gap-6">
                        <h1 class="text-3xl md:text-2xl font-bold leading-tight break-words">${this.product.name}</h1>

                        <!-- Rating & Wishlist -->
                        <div class="flex items-center justify-between gap-4 flex-wrap">
                            <div class="flex items-center gap-2">
                                <div class="flex gap-0.5">${this.renderStars(this.product.rating)}</div>
                                <span class="text-sm text-gray-500 dark:text-gray-400">${this.product.rating} (${this.product.reviewCount} reviews)</span>
                            </div>
                            <button 
                                class="w-12 h-12 rounded-full border-2 cursor-pointer flex items-center justify-center transition-all duration-300 hover:scale-105 ${this.isWishlisted ? 'bg-red-500 border-red-500 text-white shadow-lg shadow-red-500/30' : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-red-400 hover:bg-red-50 dark:hover:bg-red-900/20'}" 
                                @click="${this.toggleWishlist}" 
                                title="${this.isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}">
                                <svg class="w-6 h-6 ${this.isWishlisted ? 'fill-current' : 'stroke-current fill-none'}" viewBox="0 0 24 24" stroke-width="2">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                            </button>
                        </div>

                        <div class="text-4xl md:text-3xl font-bold">$${this.product.price.toFixed(2)}</div>

                        <!-- Description Toggle -->
                        <div class="border-t border-b border-gray-200 dark:border-gray-700">
                            <button
                                class="w-full flex justify-between items-center py-5 bg-transparent border-none cursor-pointer text-base font-semibold text-gray-900 dark:text-gray-100"
                                @click="${() => this.toggleSection('description')}"
                            >
                                <span>Description</span>
                                <span class="transition-transform duration-300 ${this.isSectionExpanded('description') ? 'rotate-180' : ''}">▼</span>
                            </button>
                            <div class="${this.isSectionExpanded('description') ? 'max-h-[300px] pb-5' : 'max-h-0'} overflow-hidden transition-all duration-300 ease-out">
                                <p class="leading-[1.7] text-gray-500 dark:text-gray-400">${this.product.description}</p>
                            </div>
                        </div>

                        <!-- Color Selection -->
                        <div class="flex flex-col gap-4">
                            <div class="font-semibold text-sm uppercase tracking-wider">Color: ${this.selectedColor}</div>
                            <div class="flex gap-3 flex-wrap">
                                ${this.product.colors.map(color => html`
                                    <div
                                        class="w-12 h-12 rounded-lg cursor-pointer border-[3px] transition-all duration-200 hover:scale-110 ${this.selectedColor === color.name ? 'border-gray-900 dark:border-gray-100' : 'border-transparent'}"
                                        style="background: ${color.hex}"
                                        @click="${() => this.selectColor(color.name)}"
                                        title="${color.name}"
                                    ></div>
                                `)}
                            </div>
                        </div>

                        <!-- Size Selection -->
                        <div class="flex flex-col gap-4">
                            <div class="flex justify-between items-center">
                                <div class="font-semibold text-sm uppercase tracking-wider">Size: ${this.selectedSize}</div>
                                <button class="text-gray-600 dark:text-gray-400 text-sm cursor-pointer underline hover:text-gray-900 dark:hover:text-gray-100 transition-colors" @click="${this.toggleSizeGuide}">Size guide</button>
                            </div>
                            <div class="flex gap-3 flex-wrap">
                                ${this.product.sizes.map(size => html`
                                    <button
                                        class="min-w-[60px] px-5 py-3.5 rounded-lg border-2 font-semibold text-[0.9375rem] transition-all duration-200 text-center ${this.selectedSize === size ? 'border-gray-900 dark:border-gray-100 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900' : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 hover:border-gray-900 dark:hover:border-gray-100'} ${!this.isSizeAvailable(size) ? 'opacity-40 cursor-not-allowed line-through' : ''}"
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
                        <div class="flex items-center gap-8">
                            <div class="flex items-center border-2 border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                                <button class="w-12 h-12 border-none bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 cursor-pointer text-2xl font-light transition-colors duration-200 hover:bg-gray-200 dark:hover:bg-gray-700" @click="${this.decrementQty}">−</button>
                                <div class="min-w-[60px] text-center font-semibold text-lg">${this.quantity}</div>
                                <button class="w-12 h-12 border-none bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 cursor-pointer text-2xl font-light transition-colors duration-200 hover:bg-gray-200 dark:hover:bg-gray-700" @click="${this.incrementQty}">+</button>
                            </div>
                        </div>

                        <!-- Action Buttons -->
                        <div class="flex flex-col gap-4 mt-4 md:sticky md:bottom-0 md:bg-white md:dark:bg-gray-900 md:p-4 md:-mx-4 md:border-t md:border-gray-200 md:dark:border-gray-700 md:z-10">
                            <button class="px-8 py-5 rounded-xl text-base font-semibold cursor-pointer transition-all duration-300 border-none bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-200 hover:-translate-y-0.5 hover:shadow-[0_10px_25px_rgba(0,0,0,0.15)]" @click="${this.handleAddToCart}">
                                Add to Cart
                            </button>
                            <button class="px-8 py-5 rounded-xl text-base font-semibold cursor-pointer transition-all duration-300 border-2 bg-transparent text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-700 hover:border-gray-900 dark:hover:border-gray-100" @click="${this.handleBuyNow}">
                                Buy Now
                            </button>
                        </div>

                        <!-- Accordion Sections -->
                        <div class="flex flex-col mt-8">
                            <!-- Shipping -->
                            <div class="border-t border-gray-200 dark:border-gray-700">
                                <button
                                    class="w-full flex justify-between items-center py-6 bg-transparent border-none cursor-pointer text-gray-900 dark:text-gray-100 text-base font-semibold"
                                    @click="${() => this.toggleSection('shipping')}"
                                >
                                    <span>Shipping</span>
                                    <span class="transition-transform duration-300 ${this.isSectionExpanded('shipping') ? 'rotate-180' : ''}">▼</span>
                                </button>
                                <div class="${this.isSectionExpanded('shipping') ? 'max-h-[800px]' : 'max-h-0'} overflow-hidden transition-all duration-300 ease-out">
                                    <div class="pb-6 text-gray-500 dark:text-gray-400 leading-[1.7]">
                                        <div class="grid grid-cols-2 md:grid-cols-1 gap-6">
                                            ${this.product.shipping.map(item => html`
                                                <div class="flex flex-col gap-2">
                                                    <div class="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-2xl">${item.icon}</div>
                                                    <div class="font-semibold text-gray-900 dark:text-gray-100 text-sm">${item.label}</div>
                                                    <div class="text-[0.8125rem] text-gray-500 dark:text-gray-400">${item.value}</div>
                                                </div>
                                            `)}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Features -->
                            <div class="border-t border-gray-200 dark:border-gray-700">
                                <button
                                    class="w-full flex justify-between items-center py-6 bg-transparent border-none cursor-pointer text-gray-900 dark:text-gray-100 text-base font-semibold"
                                    @click="${() => this.toggleSection('features')}"
                                >
                                    <span>Features</span>
                                    <span class="transition-transform duration-300 ${this.isSectionExpanded('features') ? 'rotate-180' : ''}">▼</span>
                                </button>
                                <div class="${this.isSectionExpanded('features') ? 'max-h-[800px]' : 'max-h-0'} overflow-hidden transition-all duration-300 ease-out">
                                    <div class="pb-6 text-gray-500 dark:text-gray-400 leading-[1.7]">
                                        <ul class="pl-6">
                                            ${this.product.features.map(feature => html`
                                                <li class="mb-2">${feature}</li>
                                            `)}
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <!-- Materials -->
                            <div class="border-t border-gray-200 dark:border-gray-700">
                                <button
                                    class="w-full flex justify-between items-center py-6 bg-transparent border-none cursor-pointer text-gray-900 dark:text-gray-100 text-base font-semibold"
                                    @click="${() => this.toggleSection('materials')}"
                                >
                                    <span>Materials & Care</span>
                                    <span class="transition-transform duration-300 ${this.isSectionExpanded('materials') ? 'rotate-180' : ''}">▼</span>
                                </button>
                                <div class="${this.isSectionExpanded('materials') ? 'max-h-[800px]' : 'max-h-0'} overflow-hidden transition-all duration-300 ease-out">
                                    <div class="pb-6 text-gray-500 dark:text-gray-400 leading-[1.7]">
                                        ${this.product.materials}
                                    </div>
                                </div>
                            </div>

                            <!-- Reviews -->
                            <div class="border-t border-b border-gray-200 dark:border-gray-700">
                                <button
                                    class="w-full flex justify-between items-center py-6 bg-transparent border-none cursor-pointer text-gray-900 dark:text-gray-100 text-base font-semibold"
                                    @click="${() => this.toggleSection('reviews')}"
                                >
                                    <span>Customer Reviews (${this.product.reviewCount})</span>
                                    <span class="transition-transform duration-300 ${this.isSectionExpanded('reviews') ? 'rotate-180' : ''}">▼</span>
                                </button>
                                <div class="${this.isSectionExpanded('reviews') ? 'max-h-[800px]' : 'max-h-0'} overflow-hidden transition-all duration-300 ease-out">
                                    <div class="pb-6 text-gray-500 dark:text-gray-400 leading-[1.7]">
                                        <div class="flex flex-col gap-6 mt-4">
                                            ${this.product.reviews.map(review => html`
                                                <div class="pb-6 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                                                    <div class="flex gap-4 mb-3">
                                                        <div class="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center font-semibold text-gray-900 dark:text-gray-100">${review.name.charAt(0)}</div>
                                                        <div class="flex-1">
                                                            <div class="font-semibold text-[0.9375rem] mb-1">${review.name}</div>
                                                            <div class="flex gap-0.5">${this.renderStars(review.rating)}</div>
                                                        </div>
                                                    </div>
                                                    <p class="leading-[1.7] text-gray-500 dark:text-gray-400 my-3 break-words">${review.text}</p>
                                                    <div class="flex gap-6 mt-3">
                                                        <button class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 bg-transparent border-none cursor-pointer transition-colors duration-200 hover:text-gray-900 dark:hover:text-gray-100">👍 ${review.likes}</button>
                                                        <button class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 bg-transparent border-none cursor-pointer transition-colors duration-200 hover:text-gray-900 dark:hover:text-gray-100">👎 ${review.dislikes}</button>
                                                        <button class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 bg-transparent border-none cursor-pointer transition-colors duration-200 hover:text-gray-900 dark:hover:text-gray-100">Reply</button>
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
                                                <th class="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left">Seat Width</th>
                                                <th class="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left">Seat Depth</th>
                                                <th class="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left">Height Range</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr><td class="border border-gray-300 dark:border-gray-600 px-4 py-2">Small</td><td class="border border-gray-300 dark:border-gray-600 px-4 py-2">45cm</td><td class="border border-gray-300 dark:border-gray-600 px-4 py-2">40cm</td><td class="border border-gray-300 dark:border-gray-600 px-4 py-2">45-50cm</td></tr>
                                            <tr class="bg-gray-50 dark:bg-gray-900"><td class="border border-gray-300 dark:border-gray-600 px-4 py-2">Medium</td><td class="border border-gray-300 dark:border-gray-600 px-4 py-2">50cm</td><td class="border border-gray-300 dark:border-gray-600 px-4 py-2">45cm</td><td class="border border-gray-300 dark:border-gray-600 px-4 py-2">50-55cm</td></tr>
                                            <tr><td class="border border-gray-300 dark:border-gray-600 px-4 py-2">Large</td><td class="border border-gray-300 dark:border-gray-600 px-4 py-2">55cm</td><td class="border border-gray-300 dark:border-gray-600 px-4 py-2">50cm</td><td class="border border-gray-300 dark:border-gray-600 px-4 py-2">55-60cm</td></tr>
                                            <tr class="bg-gray-50 dark:bg-gray-900"><td class="border border-gray-300 dark:border-gray-600 px-4 py-2">XL</td><td class="border border-gray-300 dark:border-gray-600 px-4 py-2">60cm</td><td class="border border-gray-300 dark:border-gray-600 px-4 py-2">55cm</td><td class="border border-gray-300 dark:border-gray-600 px-4 py-2">60-65cm</td></tr>
                                        </tbody>
                                    </table>
                                </div>
                                <p class="text-sm text-gray-500 dark:text-gray-400 mt-4">* Measurements are approximate. Height is adjustable within the specified range.</p>
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

customElements.define('product-detail-elite', ProductDetailElite);
