import { BaseComponent } from '../base-component.js';
import { productsStore, shortlistStore, cartStore } from '../../assets/state.js';
import { navigate } from '../../assets/router.js';
import { showToast } from '../../assets/utils.js';

class ProductDetailsPage extends BaseComponent {
    static properties = {
        product: { type: Object },
        images: { type: Array },
        selectedImageIndex: { type: Number },
        showZoom: { type: Boolean },
        isSaved: { type: Boolean },
        quantity: { type: Number },
        selectedTab: { type: String },
        isDesktop: { type: Boolean }
    };

    constructor() {
        super();
        this.product = null;
        this.images = [];
        this.selectedImageIndex = 0;
        this.showZoom = false;
        this.isSaved = false;
        this.quantity = 1;
        this.selectedTab = 'details';
        this.isDesktop = window.innerWidth >= 1024;
    }

    connectedCallback() {
        super.connectedCallback();
        const params = this.getParams();
        this.product = productsStore.getProductById(params.id);
        if (this.product) {
            this.images = this.product.images?.length ? this.product.images : [this.product.image];
        }
        const bottomNav = document.querySelector('bottom-nav');
        if (bottomNav) bottomNav.style.display = 'none';

        this.unsubscribe = shortlistStore.subscribe((state) => {
            this.isSaved = !!state.items.find(item => item.id === this.product?.id);
        });

        this.resizeHandler = () => {
            this.isDesktop = window.innerWidth >= 1024;
        };
        window.addEventListener('resize', this.resizeHandler);
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        this.unsubscribe?.();
        window.removeEventListener('resize', this.resizeHandler);
        const bottomNav = document.querySelector('bottom-nav');
        if (bottomNav) bottomNav.style.display = '';
    }

    toggleSave() {
        if (this.product) {
            shortlistStore.toggle(this.product);
            showToast({
                title: this.isSaved ? 'Removed from favorites' : 'Added to favorites',
                variant: this.isSaved ? 'info' : 'success'
            });
        }
    }

    addToCart() {
        if (this.product) {
            cartStore.add(this.product, this.quantity);
            showToast({
                title: 'Added to cart',
                description: `${this.quantity}x ${this.product.name}`,
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

    openZoom(index) {
        this.selectedImageIndex = index;
        this.showZoom = true;
        document.getElementById('overlay')?.classList.remove('hidden');
    }

    closeZoom() {
        this.showZoom = false;
        document.getElementById('overlay')?.classList.add('hidden');
    }

    updateQuantity(change) {
        this.quantity = Math.max(1, this.quantity + change);
    }

    selectImage(index) {
        this.selectedImageIndex = index;
    }

    renderChip(label) {
        return this.html`<span class="px-3 py-1 rounded-full bg-gray-100 text-sm font-semibold text-gray-700">${label}</span>`;
    }

    render() {
        if (!this.product) {
            return this.html`
                <div class="min-h-[60vh] flex flex-col items-center justify-center">
                    <p class="text-lg font-semibold text-gray-700">Product not found</p>
                    <button @click=${() => navigate('/')} class="mt-3 text-primary-700 font-semibold">Back to home</button>
                </div>
            `;
        }

        return this.html`
            <div class="pb-28 lg:pb-12 bg-gradient-to-b from-gray-50 to-white">
                <div class="max-w-[1440px] mx-auto px-4 lg:px-8">
                    <!-- Breadcrumb - Desktop only -->
                    <nav class="hidden lg:flex items-center gap-2 py-4 text-sm text-gray-500">
                        <a href="#/" @click=${() => navigate('/')} class="hover:text-primary-600 transition">Home</a>
                        <i data-lucide="chevron-right" class="w-4 h-4"></i>
                        <a href="#/products/all" @click=${() => navigate('/products/all')} class="hover:text-primary-600 transition">Products</a>
                        <i data-lucide="chevron-right" class="w-4 h-4"></i>
                        <span class="text-gray-900 font-medium">${this.product.name}</span>
                    </nav>

                    <!-- Main content - Two column on desktop -->
                    <div class="lg:grid lg:grid-cols-2 lg:gap-12 lg:items-start">
                        
                        <!-- Left: Image Gallery -->
                        <div class="relative lg:sticky lg:top-48">
                            <!-- Mobile: Horizontal scroll gallery -->
                            <div class="lg:hidden bg-gradient-to-br from-purple-50 via-pink-50 to-white rounded-b-3xl">
                                <div class="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide" style="-webkit-overflow-scrolling: touch;">
                                    ${this.images.map((img, idx) => this.html`
                                        <div class="w-full snap-center flex-shrink-0 relative p-4">
                                            <img src="${img}" alt="${this.product.name}" class="w-full h-72 object-contain drop-shadow-xl" @click=${() => this.openZoom(idx)}>
                                        </div>
                                    `)}
                                </div>
                                <!-- Image dots indicator -->
                                <div class="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                                    ${this.images.map((_, idx) => this.html`
                                        <button 
                                            class="w-2 h-2 rounded-full transition ${idx === this.selectedImageIndex ? 'bg-purple-500 w-6' : 'bg-gray-300'}">
                                        </button>
                                    `)}
                                </div>
                                <!-- Top Actions -->
                                <div class="absolute top-4 left-4 right-4 flex justify-between">
                                    <button @click=${() => navigate('/')} class="w-10 h-10 rounded-xl bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center touch-feedback">
                                        <i data-lucide="arrow-left" class="w-5 h-5 text-gray-700"></i>
                                    </button>
                                    <div class="flex gap-2">
                                        <button class="w-10 h-10 rounded-xl bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center touch-feedback" @click=${this.toggleSave}>
                                            <i data-lucide="heart" class="w-5 h-5 ${this.isSaved ? 'fill-pink-500 text-pink-500' : 'text-gray-700'}"></i>
                                        </button>
                                        <button class="w-10 h-10 rounded-xl bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center touch-feedback">
                                            <i data-lucide="share-2" class="w-5 h-5 text-gray-700"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <!-- Desktop: Main image + thumbnails -->
                            <div class="hidden lg:block space-y-4">
                                <div class="bg-gradient-to-br from-purple-50 via-pink-50 to-white rounded-3xl p-8 relative group">
                                    <img 
                                        src="${this.images[this.selectedImageIndex]}" 
                                        alt="${this.product.name}" 
                                        class="w-full h-[500px] object-contain drop-shadow-xl cursor-zoom-in transition group-hover:scale-105"
                                        @click=${() => this.openZoom(this.selectedImageIndex)}>
                                    
                                    <!-- Zoom hint -->
                                    <div class="absolute bottom-4 right-4 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full text-sm text-gray-600 font-medium flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition">
                                        <i data-lucide="zoom-in" class="w-4 h-4"></i>
                                        Click to zoom
                                    </div>

                                    ${this.product.badge ? this.html`
                                        <div class="absolute top-6 left-6 px-3 py-1.5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-bold shadow-lg">
                                            ✨ ${this.product.badge}
                                        </div>
                                    ` : ''}
                                </div>

                                <!-- Thumbnails -->
                                ${this.images.length > 1 ? this.html`
                                    <div class="flex gap-3 justify-center">
                                        ${this.images.map((img, idx) => this.html`
                                            <button
                                                @click=${() => this.selectImage(idx)}
                                                class="w-20 h-20 rounded-xl overflow-hidden border-2 transition ${idx === this.selectedImageIndex ? 'border-purple-500 ring-2 ring-purple-500/30' : 'border-gray-200 hover:border-purple-300'}">
                                                <img src="${img}" alt="" class="w-full h-full object-contain bg-gray-50">
                                            </button>
                                        `)}
                                    </div>
                                ` : ''}
                            </div>
                        </div>

                        <!-- Right: Product Details -->
                        <div class="px-0 lg:px-0 py-5 lg:py-0 space-y-4 lg:space-y-6 -mt-4 lg:mt-0 relative z-10">
                            <!-- Badges -->
                            <div class="flex flex-wrap items-center gap-2">
                                ${this.product.badge ? this.html`
                                    <span class="lg:hidden px-3 py-1.5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold shadow-sm">
                                        ✨ ${this.product.badge}
                                    </span>
                                ` : ''}
                                ${this.product.certified ? this.html`
                                    <span class="px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs lg:text-sm font-semibold inline-flex items-center gap-1 border border-emerald-200">
                                        <i data-lucide="shield-check" class="w-3.5 h-3.5"></i> Certified
                                    </span>
                                ` : ''}
                                <span class="px-3 py-1.5 rounded-full bg-amber-50 text-amber-700 text-xs lg:text-sm font-semibold inline-flex items-center gap-1 border border-amber-200">
                                    <i data-lucide="truck" class="w-3.5 h-3.5"></i> Free Shipping
                                </span>
                            </div>
                            
                            <!-- Title & Brand -->
                            <div>
                                <h1 class="text-2xl lg:text-4xl font-black text-gray-900 leading-tight">${this.product.name}</h1>
                                <p class="text-sm lg:text-base text-purple-600 font-semibold mt-1 lg:mt-2 flex items-center gap-1">
                                    <span class="w-5 h-5 lg:w-6 lg:h-6 rounded-full bg-purple-100 flex items-center justify-center text-xs">👑</span>
                                    ${this.product.brand}
                                </p>
                            </div>

                            <!-- Rating -->
                            <div class="flex items-center gap-3">
                                <div class="flex items-center gap-1">
                                    ${[...Array(5)].map((_, i) => this.html`
                                        <i data-lucide="star" class="w-5 h-5 ${i < Math.floor(this.product.rating) ? 'text-amber-500 fill-amber-500' : 'text-gray-300'}"></i>
                                    `)}
                                </div>
                                <span class="text-xl font-bold">${this.product.rating}</span>
                                <span class="text-gray-500">(${this.product.reviews} reviews)</span>
                            </div>

                            <!-- Price -->
                            <div class="flex items-baseline gap-3 lg:gap-4">
                                <p class="text-4xl lg:text-5xl font-black text-primary-800">$${this.product.price.toFixed(2)}</p>
                                ${this.product.originalPrice > this.product.price ? this.html`
                                    <p class="text-xl lg:text-2xl font-semibold text-gray-400 line-through">$${this.product.originalPrice.toFixed(2)}</p>
                                    <span class="px-3 py-1.5 bg-green-100 text-green-700 text-sm lg:text-base font-bold rounded-full">
                                        Save $${(this.product.originalPrice - this.product.price).toFixed(2)}
                                    </span>
                                ` : ''}
                            </div>

                            <!-- Tags -->
                            <div class="flex items-center gap-3 flex-wrap">
                                ${this.renderChip(this.product.size)}
                                ${this.product.shade ? this.renderChip(this.product.shade) : ''}
                                ${this.renderChip(this.product.category)}
                            </div>

                            <!-- Desktop: Add to Cart section -->
                            <div class="hidden lg:block bg-gray-50 rounded-2xl p-6 space-y-4">
                                <div class="flex items-center gap-4">
                                    <span class="text-gray-700 font-medium">Quantity:</span>
                                    <div class="flex items-center bg-white rounded-xl border border-gray-200">
                                        <button
                                            @click=${() => this.updateQuantity(-1)}
                                            class="w-12 h-12 rounded-l-xl flex items-center justify-center hover:bg-gray-50 transition">
                                            <i data-lucide="minus" class="w-5 h-5 text-gray-600"></i>
                                        </button>
                                        <span class="w-16 text-center font-bold text-lg">${this.quantity}</span>
                                        <button
                                            @click=${() => this.updateQuantity(1)}
                                            class="w-12 h-12 rounded-r-xl flex items-center justify-center hover:bg-gray-50 transition">
                                            <i data-lucide="plus" class="w-5 h-5 text-gray-600"></i>
                                        </button>
                                    </div>
                                </div>

                                <div class="flex gap-3">
                                    <button
                                        @click=${this.addToCart}
                                        class="flex-1 h-14 rounded-xl border-2 border-primary-600 text-primary-700 font-bold text-base hover:bg-primary-50 transition flex items-center justify-center gap-2">
                                        <i data-lucide="shopping-bag" class="w-5 h-5"></i>
                                        Add to Cart
                                    </button>
                                    <button
                                        @click=${this.buyNow}
                                        class="flex-1 h-14 rounded-xl bg-gradient-to-r from-accent-500 to-pink-500 text-white font-bold text-base hover:opacity-90 transition flex items-center justify-center gap-2 shadow-lg shadow-accent-500/30">
                                        <i data-lucide="zap" class="w-5 h-5"></i>
                                        Buy Now
                                    </button>
                                    <button
                                        @click=${this.toggleSave}
                                        class="w-14 h-14 rounded-xl border-2 border-gray-200 flex items-center justify-center hover:bg-gray-50 transition ${this.isSaved ? 'border-pink-500 bg-pink-50' : ''}">
                                        <i data-lucide="heart" class="w-6 h-6 ${this.isSaved ? 'fill-pink-500 text-pink-500' : 'text-gray-500'}"></i>
                                    </button>
                                </div>
                            </div>

                            <!-- Product Details Grid -->
                            <div class="grid grid-cols-2 lg:grid-cols-4 gap-3">
                                <div class="p-3 lg:p-4 rounded-2xl bg-gray-50 border border-gray-100">
                                    <p class="text-xs text-gray-500">Brand</p>
                                    <p class="font-semibold text-gray-900">${this.product.brand}</p>
                                </div>
                                <div class="p-3 lg:p-4 rounded-2xl bg-gray-50 border border-gray-100">
                                    <p class="text-xs text-gray-500">Category</p>
                                    <p class="font-semibold text-gray-900">${this.product.category}</p>
                                </div>
                                <div class="p-3 lg:p-4 rounded-2xl bg-gray-50 border border-gray-100">
                                    <p class="text-xs text-gray-500">Size</p>
                                    <p class="font-semibold text-gray-900">${this.product.size}</p>
                                </div>
                                <div class="p-3 lg:p-4 rounded-2xl bg-gray-50 border border-gray-100">
                                    <p class="text-xs text-gray-500">Type</p>
                                    <p class="font-semibold text-gray-900 capitalize">${this.product.productType}</p>
                                </div>
                            </div>

                            <!-- Highlights -->
                            <div class="bg-purple-50 rounded-2xl p-4 lg:p-5 space-y-2">
                                <h3 class="font-bold text-primary-900">Product Highlights</h3>
                                <div class="flex flex-wrap gap-2 text-sm text-purple-900 font-semibold">
                                    ${this.product.tags.map(tag => this.renderChip(tag))}
                                </div>
                            </div>

                            <!-- Tabs -->
                            <div class="bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden">
                                <div class="flex border-b border-gray-200">
                                    <button
                                        @click=${() => this.selectedTab = 'details'}
                                        class="flex-1 py-3 lg:py-4 text-sm lg:text-base font-semibold transition ${this.selectedTab === 'details' ? 'text-primary-700 border-b-2 border-primary-700' : 'text-gray-600 hover:text-gray-900'}">
                                        Details
                                    </button>
                                    <button
                                        @click=${() => this.selectedTab = 'benefits'}
                                        class="flex-1 py-3 lg:py-4 text-sm lg:text-base font-semibold transition ${this.selectedTab === 'benefits' ? 'text-primary-700 border-b-2 border-primary-700' : 'text-gray-600 hover:text-gray-900'}">
                                        Benefits
                                    </button>
                                    <button
                                        @click=${() => this.selectedTab = 'reviews'}
                                        class="flex-1 py-3 lg:py-4 text-sm lg:text-base font-semibold transition ${this.selectedTab === 'reviews' ? 'text-primary-700 border-b-2 border-primary-700' : 'text-gray-600 hover:text-gray-900'}">
                                        Reviews
                                    </button>
                                </div>
                                <div class="p-4 lg:p-6">
                                    ${this.selectedTab === 'details' ? this.html`
                                        <div class="space-y-3 lg:space-y-4 text-sm lg:text-base text-gray-700">
                                            <p class="leading-relaxed">
                                                This premium ${this.product.category.toLowerCase()} is formulated with the finest ingredients to deliver exceptional results. 
                                                Perfect for daily use and suitable for all skin types.
                                            </p>
                                            <div class="space-y-2">
                                                <h4 class="font-bold text-gray-900">Ingredients:</h4>
                                                <p class="text-xs lg:text-sm text-gray-600">Aqua, Glycerin, Niacinamide, Hyaluronic Acid, Vitamin E, and more natural extracts</p>
                                            </div>
                                            <div class="space-y-2">
                                                <h4 class="font-bold text-gray-900">How to Use:</h4>
                                                <p>Apply a small amount to clean skin and massage gently. Use morning and evening for best results.</p>
                                            </div>
                                        </div>
                                    ` : ''}
                                    ${this.selectedTab === 'benefits' ? this.html`
                                        <ul class="space-y-2.5 lg:space-y-3 text-sm lg:text-base text-gray-800 lg:grid lg:grid-cols-2 lg:gap-x-6">
                                            ${['Premium quality ingredients', 'Dermatologically tested', 'Cruelty-free formula', 'Long-lasting results', 'Suitable for all skin types', 'Non-comedogenic', 'Paraben-free', 'Fragrance-free option'].map(f => this.html`<li class="flex items-center gap-2"><i data-lucide="check" class="w-4 h-4 lg:w-5 lg:h-5 text-primary-700"></i>${f}</li>`)}
                                        </ul>
                                    ` : ''}
                                    ${this.selectedTab === 'reviews' ? this.html`
                                        <div class="space-y-4 lg:space-y-6">
                                            <div class="flex items-center gap-3 lg:gap-6 pb-3 lg:pb-4 border-b border-gray-200">
                                                <div class="text-center">
                                                    <div class="text-3xl lg:text-5xl font-black text-gray-900">${this.product.rating}</div>
                                                    <div class="flex items-center gap-0.5 mt-1 justify-center">
                                                        ${[...Array(5)].map((_, i) => this.html`
                                                            <i data-lucide="star" class="w-3.5 h-3.5 lg:w-4 lg:h-4 ${i < Math.floor(this.product.rating) ? 'fill-amber-500 text-amber-500' : 'text-gray-300'}"></i>
                                                        `)}
                                                    </div>
                                                    <div class="text-xs lg:text-sm text-gray-500 mt-1">${this.product.reviews} reviews</div>
                                                </div>
                                                <div class="flex-1 space-y-1.5 lg:space-y-2">
                                                    ${[5,4,3,2,1].map(star => {
                                                        const percent = star === 5 ? 75 : star === 4 ? 20 : 5;
                                                        return this.html`
                                                            <div class="flex items-center gap-2 text-xs lg:text-sm">
                                                                <span class="w-8">${star} ★</span>
                                                                <div class="flex-1 h-2 lg:h-2.5 bg-gray-200 rounded-full overflow-hidden">
                                                                    <div class="h-full bg-amber-500" style="width: ${percent}%"></div>
                                                                </div>
                                                                <span class="text-gray-500 w-10">${percent}%</span>
                                                            </div>
                                                        `;
                                                    })}
                                                </div>
                                            </div>
                                            <div class="space-y-3 lg:space-y-4">
                                                ${[
                                                    { name: 'Sarah M.', rating: 5, text: 'Absolutely love this product! Best purchase ever.', date: '2 days ago' },
                                                    { name: 'Emily R.', rating: 5, text: 'Amazing quality and fast delivery. Highly recommend!', date: '1 week ago' },
                                                    { name: 'Jessica L.', rating: 4, text: 'Great product, does what it promises. Will buy again.', date: '2 weeks ago' }
                                                ].map(review => this.html`
                                                    <div class="space-y-1.5 lg:space-y-2 p-3 lg:p-4 bg-gray-50 rounded-xl">
                                                        <div class="flex items-center justify-between">
                                                            <span class="font-semibold text-sm lg:text-base">${review.name}</span>
                                                            <span class="text-xs lg:text-sm text-gray-500">${review.date}</span>
                                                        </div>
                                                        <div class="flex items-center gap-0.5">
                                                            ${[...Array(5)].map((_, i) => this.html`
                                                                <i data-lucide="star" class="w-3 h-3 lg:w-4 lg:h-4 ${i < review.rating ? 'fill-amber-500 text-amber-500' : 'text-gray-300'}"></i>
                                                            `)}
                                                        </div>
                                                        <p class="text-sm lg:text-base text-gray-700">${review.text}</p>
                                                    </div>
                                                `)}
                                            </div>
                                        </div>
                                    ` : ''}
                                </div>
                            </div>

                            <!-- Free Samples Banner -->
                            <div class="bg-gradient-to-r from-orange-100 to-amber-200 rounded-2xl p-4 lg:p-5 flex items-center justify-between">
                                <div>
                                    <p class="text-lg lg:text-xl font-bold text-gray-900">Free Samples</p>
                                    <p class="text-sm lg:text-base text-gray-700">Get free samples with every order</p>
                                </div>
                                <i data-lucide="gift" class="w-10 h-10 lg:w-12 lg:h-12 text-gray-800"></i>
                            </div>
                        </div>
                    </div>

                    <!-- Related Products -->
                    <div class="space-y-3 lg:space-y-4 mt-8 lg:mt-12">
                        <h3 class="text-xl lg:text-2xl font-bold text-gray-900">You May Also Like</h3>
                        <div class="flex gap-3 lg:gap-4 overflow-x-auto lg:overflow-visible lg:grid lg:grid-cols-4 xl:grid-cols-5 scrollbar-hide pb-2">
                            ${productsStore.getByCategory(this.product.productType).filter(p => p.id !== this.product.id).slice(0, 5).map(product => this.html`
                                <div @click=${() => { window.location.hash = `/product/${product.id}`; window.location.reload(); }} class="min-w-[160px] lg:min-w-0 bg-white rounded-2xl p-3 lg:p-4 space-y-2 touch-feedback cursor-pointer shadow-card desktop-hover">
                                    <img src="${product.image}" alt="${product.name}" class="w-full h-32 lg:h-40 object-contain bg-gray-50 rounded-xl">
                                    <div class="space-y-1">
                                        <p class="font-semibold text-sm lg:text-base leading-tight line-clamp-2">${product.name}</p>
                                        <p class="text-xs lg:text-sm text-gray-600">${product.brand}</p>
                                        <p class="text-lg lg:text-xl font-bold text-primary-800">$${product.price.toFixed(2)}</p>
                                    </div>
                                </div>
                            `)}
                        </div>
                    </div>
                </div>
            </div>

            <!-- Mobile: Fixed bottom action bar -->
            <div class="fixed bottom-0 left-0 right-0 bg-white p-3 shadow-2xl border-t border-gray-100 z-40 lg:hidden">
                <div class="flex items-center gap-2 max-w-2xl mx-auto">
                    <!-- Compact Quantity Selector -->
                    <div class="flex items-center bg-gray-100 rounded-xl">
                        <button
                            @click=${() => this.updateQuantity(-1)}
                            class="w-9 h-10 rounded-l-xl flex items-center justify-center touch-feedback hover:bg-gray-200 transition">
                            <i data-lucide="minus" class="w-4 h-4 text-gray-600"></i>
                        </button>
                        <span class="w-8 text-center font-bold text-sm">${this.quantity}</span>
                        <button
                            @click=${() => this.updateQuantity(1)}
                            class="w-9 h-10 rounded-r-xl flex items-center justify-center touch-feedback hover:bg-gray-200 transition">
                            <i data-lucide="plus" class="w-4 h-4 text-gray-600"></i>
                        </button>
                    </div>
                    <!-- Compact Add to Cart -->
                    <button
                        @click=${this.addToCart}
                        class="flex-1 h-11 rounded-xl border-2 border-primary-600 text-primary-700 font-bold text-sm touch-feedback hover:bg-primary-50 transition flex items-center justify-center gap-1.5">
                        <i data-lucide="shopping-bag" class="w-4 h-4"></i>
                        <span>Add</span>
                    </button>
                    <!-- Buy Now - Primary Action -->
                    <button
                        @click=${this.buyNow}
                        class="flex-[1.2] h-11 rounded-xl bg-gradient-to-r from-accent-500 to-pink-500 text-white font-bold text-sm touch-feedback hover:opacity-90 transition flex items-center justify-center gap-1.5 shadow-lg shadow-accent-500/30">
                        <i data-lucide="zap" class="w-4 h-4"></i>
                        <span>Buy Now</span>
                    </button>
                </div>
            </div>

            <!-- Image Zoom Modal -->
            ${this.showZoom ? this.html`
                <div class="fixed inset-0 bg-black/90 z-50 flex flex-col">
                    <div class="flex items-center justify-between p-4 text-white">
                        <button @click=${this.closeZoom} class="p-2 hover:bg-white/10 rounded-lg transition">
                            <i data-lucide="x" class="w-6 h-6"></i>
                        </button>
                        <span class="text-sm font-semibold">${this.selectedImageIndex + 1}/${this.images.length}</span>
                        <button class="p-2 hover:bg-white/10 rounded-lg transition">
                            <i data-lucide="share-2" class="w-6 h-6"></i>
                        </button>
                    </div>
                    <div class="flex-1 flex items-center justify-center p-4">
                        <img src="${this.images[this.selectedImageIndex]}" alt="${this.product.name}" class="max-w-full max-h-full object-contain">
                    </div>
                    ${this.images.length > 1 ? this.html`
                        <div class="flex items-center justify-center gap-4 p-4">
                            <button 
                                @click=${() => this.selectImage(Math.max(0, this.selectedImageIndex - 1))}
                                class="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition ${this.selectedImageIndex === 0 ? 'opacity-50' : ''}">
                                <i data-lucide="chevron-left" class="w-6 h-6 text-white"></i>
                            </button>
                            <div class="flex gap-2">
                                ${this.images.map((_, idx) => this.html`
                                    <button 
                                        @click=${() => this.selectImage(idx)}
                                        class="w-2.5 h-2.5 rounded-full transition ${idx === this.selectedImageIndex ? 'bg-white w-8' : 'bg-white/40'}">
                                    </button>
                                `)}
                            </div>
                            <button 
                                @click=${() => this.selectImage(Math.min(this.images.length - 1, this.selectedImageIndex + 1))}
                                class="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition ${this.selectedImageIndex === this.images.length - 1 ? 'opacity-50' : ''}">
                                <i data-lucide="chevron-right" class="w-6 h-6 text-white"></i>
                            </button>
                        </div>
                    ` : ''}
                </div>
            ` : ''}
        `;
    }
}

customElements.define('product-details-page', ProductDetailsPage);
