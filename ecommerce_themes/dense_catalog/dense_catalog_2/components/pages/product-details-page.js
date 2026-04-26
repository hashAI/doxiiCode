import { BaseComponent } from '../base-component.js';
import { productsStore, cartStore, shortlistStore } from '../../assets/state.js';
import { formatCurrency, showToast } from '../../assets/utils.js';

class ProductDetailsPage extends BaseComponent {
    static properties = {
        product: { type: Object },
        selectedColor: { type: String },
        selectedColorIndex: { type: Number },
        selectedSize: { type: String },
        selectedProductType: { type: String },
        currentImageIndex: { type: Number },
        quantity: { type: Number }
    };

    constructor() {
        super();
        this.product = null;
        this.selectedColor = null;
        this.selectedColorIndex = 0;
        this.selectedSize = null;
        this.selectedProductType = null;
        this.currentImageIndex = 0;
        this.quantity = 1;
    }

    connectedCallback() {
        super.connectedCallback();
        const params = this.getParams();
        const productId = params.id;

        this.product = productsStore.getById(productId);
        if (this.product) {
            this.selectedColor = this.product.colors?.[0];
            this.selectedColorIndex = 0;
            this.selectedSize = this.product.sizes?.[1] || this.product.sizes?.[0];
            this.selectedProductType = this.product.productType?.[0];
        }
    }

    selectColor(color, index) {
        this.selectedColor = color;
        this.selectedColorIndex = index;
        this.requestUpdate();
    }

    selectSize(size) {
        this.selectedSize = size;
        this.requestUpdate();
    }

    selectProductType(type) {
        this.selectedProductType = type;
        this.requestUpdate();
    }

    selectImage(index) {
        this.currentImageIndex = index;
        this.requestUpdate();
    }

    updateQuantity(delta) {
        this.quantity = Math.max(1, this.quantity + delta);
        this.requestUpdate();
    }

    isInWishlist() {
        return shortlistStore.getState().items.find(item => item.id === this.product?.id);
    }

    addToCart() {
        if (!this.product) return;

        cartStore.add(this.product, this.quantity, {
            selectedColor: this.selectedColor,
            selectedSize: this.selectedSize
        });

        showToast({
            title: 'Added to Cart',
            message: `${this.product.name} (${this.quantity}) added to your cart`,
            variant: 'success'
        });
    }

    toggleWishlist() {
        if (!this.product) return;

        shortlistStore.toggle(this.product);
        const isInWishlist = this.isInWishlist();
        showToast({
            title: isInWishlist ? 'Added to Wishlist' : 'Removed from Wishlist',
            message: this.product.name,
            variant: 'info'
        });
        this.requestUpdate();
    }

    render() {
        if (!this.product) {
            return this.html`
                <div class="flex items-center justify-center min-h-screen">
                    <div class="text-center">
                        <i data-lucide="package-x" class="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4"></i>
                        <p class="text-gray-500 dark:text-gray-400 text-lg">Product not found</p>
                        <a href="#/" class="inline-block mt-4 text-brand-500 hover:text-brand-600 font-medium">
                            Go back to home
                        </a>
                    </div>
                </div>
            `;
        }

        const similarProducts = productsStore
            .getByCategory(this.product.category)
            .filter(p => p.id !== this.product.id)
            .slice(0, 4);

        return this.html`
            <div class="min-h-screen bg-white dark:bg-slate-900">
                <!-- Desktop Layout -->
                <div class="hidden lg:block container-desktop py-8">
                    <div class="grid lg:grid-cols-2 gap-12">
                        <!-- Image Gallery - Desktop -->
                        <div class="sticky top-[180px]">
                            <!-- Main Image -->
                            <div class="relative aspect-square bg-gray-50 dark:bg-slate-800 rounded-2xl overflow-hidden mb-4">
                                <img
                                    src="${this.product.images[this.currentImageIndex]}"
                                    alt="${this.product.name}"
                                    class="w-full h-full object-contain"
                                >
                                ${this.product.discount ? this.html`
                                    <span class="absolute top-4 left-4 bg-red-500 text-white text-sm font-bold px-3 py-1.5 rounded-lg">
                                        ${this.product.discount}% OFF
                                    </span>
                                ` : ''}
                                ${this.product.powered ? this.html`
                                    <span class="absolute top-4 ${this.product.discount ? 'left-28' : 'left-4'} bg-brand-500 text-white text-sm font-bold px-3 py-1.5 rounded-lg">
                                        POWERED
                                    </span>
                                ` : ''}
                            </div>

                            <!-- Thumbnails -->
                            ${this.product.images.length > 1 ? this.html`
                                <div class="flex gap-3">
                                    ${this.product.images.map((img, index) => this.html`
                                        <button
                                            @click=${() => this.selectImage(index)}
                                            class="w-20 h-20 rounded-xl overflow-hidden border-2 ${
                                                index === this.currentImageIndex
                                                    ? 'border-brand-500'
                                                    : 'border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600'
                                            } transition-colors"
                                        >
                                            <img src="${img}" alt="View ${index + 1}" class="w-full h-full object-contain bg-gray-50 dark:bg-slate-800">
                                        </button>
                                    `)}
                                </div>
                            ` : ''}
                        </div>

                        <!-- Product Info - Desktop -->
                        <div class="space-y-6">
                            <!-- Breadcrumb -->
                            <nav class="flex items-center gap-2 text-sm text-gray-500">
                                <a href="#/" class="hover:text-brand-500">Home</a>
                                <i data-lucide="chevron-right" class="w-4 h-4"></i>
                                <a href="#/products/${this.product.category}" class="hover:text-brand-500 capitalize">${this.product.category.replace('-', ' ')}</a>
                                <i data-lucide="chevron-right" class="w-4 h-4"></i>
                                <span class="text-navy-900 dark:text-white">${this.product.name}</span>
                            </nav>

                            <!-- Title & Rating -->
                            <div>
                                <h1 class="text-3xl font-bold text-navy-900 dark:text-white mb-2">${this.product.name}</h1>
                                <p class="text-gray-600 dark:text-gray-400 mb-4">${this.product.description}</p>
                                <div class="flex items-center gap-4">
                                    <div class="flex items-center gap-1 text-yellow-500">
                                        <i data-lucide="star" class="w-5 h-5 fill-current"></i>
                                        <span class="font-bold">${this.product.rating}</span>
                                    </div>
                                    <span class="text-gray-400">(${this.product.reviews?.toLocaleString() || 0} reviews)</span>
                                </div>
                            </div>

                            <!-- Price -->
                            <div class="flex items-center gap-4">
                                <span class="text-3xl font-bold text-navy-900 dark:text-white">${formatCurrency(this.product.price)}</span>
                                ${this.product.originalPrice ? this.html`
                                    <span class="text-xl text-gray-400 line-through">${formatCurrency(this.product.originalPrice)}</span>
                                    <span class="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-sm font-semibold px-3 py-1 rounded-full">
                                        Save ${this.product.discount}%
                                    </span>
                                ` : ''}
                            </div>

                            <!-- Product Type (if applicable) -->
                            ${this.product.productType ? this.html`
                                <div>
                                    <h3 class="font-semibold text-navy-900 dark:text-white mb-3">Product Type</h3>
                                    <div class="flex gap-2 flex-wrap">
                                        ${this.product.productType.map(type => this.html`
                                            <button
                                                @click=${() => this.selectProductType(type)}
                                                class="px-5 py-2.5 rounded-xl font-medium transition-all ${
                                                    this.selectedProductType === type
                                                        ? 'bg-navy-900 dark:bg-brand-500 text-white shadow-lg'
                                                        : 'bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700'
                                                }"
                                            >
                                                ${type}
                                            </button>
                                        `)}
                                    </div>
                                </div>
                            ` : ''}

                            <!-- Frame Color -->
                            ${this.product.colors ? this.html`
                                <div>
                                    <h3 class="font-semibold text-navy-900 dark:text-white mb-3">
                                        Color: <span class="font-normal text-gray-600 dark:text-gray-400">${this.selectedColor}</span>
                                    </h3>
                                    <div class="flex gap-3 flex-wrap">
                                        ${this.product.colors.map((color, index) => this.html`
                                            <button
                                                @click=${() => this.selectColor(color, index)}
                                                class="flex items-center gap-2 px-4 py-2 rounded-xl border-2 transition-all ${
                                                    this.selectedColor === color
                                                        ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20'
                                                        : 'border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600'
                                                }"
                                            >
                                                <div
                                                    class="w-6 h-6 rounded-full border border-gray-200 dark:border-slate-600"
                                                    style="background-color: ${this.product.colorHex?.[index] || '#ccc'}"
                                                ></div>
                                                <span class="text-sm font-medium text-navy-900 dark:text-white">${color}</span>
                                            </button>
                                        `)}
                                    </div>
                                </div>
                            ` : ''}

                            <!-- Frame Size -->
                            ${this.product.sizes ? this.html`
                                <div>
                                    <div class="flex items-center justify-between mb-3">
                                        <h3 class="font-semibold text-navy-900 dark:text-white">Frame Size</h3>
                                        <button class="text-sm text-brand-500 hover:text-brand-600 font-medium">Size guide</button>
                                    </div>
                                    <div class="flex gap-3">
                                        ${this.product.sizes.map(size => this.html`
                                            <button
                                                @click=${() => this.selectSize(size)}
                                                class="min-w-[60px] px-6 py-3 rounded-xl font-semibold transition-all ${
                                                    this.selectedSize === size
                                                        ? 'bg-navy-900 dark:bg-brand-500 text-white shadow-lg'
                                                        : 'bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700'
                                                }"
                                            >
                                                ${size}
                                            </button>
                                        `)}
                                    </div>
                                    ${this.product.frameWidth ? this.html`
                                        <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">Frame Width: ${this.product.frameWidth}</p>
                                    ` : ''}
                                </div>
                            ` : ''}

                            <!-- Quantity & Actions -->
                            <div class="flex items-center gap-4 pt-4">
                                <div class="flex items-center gap-2 bg-gray-100 dark:bg-slate-800 rounded-xl p-1">
                                    <button
                                        @click=${() => this.updateQuantity(-1)}
                                        class="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
                                    >
                                        <i data-lucide="minus" class="w-4 h-4"></i>
                                    </button>
                                    <span class="w-10 text-center font-semibold">${this.quantity}</span>
                                    <button
                                        @click=${() => this.updateQuantity(1)}
                                        class="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
                                    >
                                        <i data-lucide="plus" class="w-4 h-4"></i>
                                    </button>
                                </div>
                                <button
                                    @click=${() => this.addToCart()}
                                    class="flex-1 bg-navy-900 dark:bg-brand-500 hover:bg-navy-800 dark:hover:bg-brand-600 text-white py-4 rounded-xl font-bold text-lg transition-colors flex items-center justify-center gap-2"
                                >
                                    <i data-lucide="shopping-bag" class="w-5 h-5"></i>
                                    <span>Add to Cart</span>
                                </button>
                                <button
                                    @click=${() => this.toggleWishlist()}
                                    class="w-14 h-14 rounded-xl border-2 ${
                                        this.isInWishlist()
                                            ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                                            : 'border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600'
                                    } flex items-center justify-center transition-colors"
                                >
                                    <i data-lucide="heart" class="w-6 h-6 ${this.isInWishlist() ? 'fill-red-500 text-red-500' : 'text-gray-600 dark:text-gray-400'}"></i>
                                </button>
                            </div>

                            <!-- Product Details -->
                            <div class="border-t border-gray-200 dark:border-slate-800 pt-6 space-y-4">
                                <h3 class="font-semibold text-navy-900 dark:text-white">Product Details</h3>
                                <div class="grid grid-cols-2 gap-4 text-sm">
                                    ${this.product.frameMaterial ? this.html`
                                        <div>
                                            <span class="text-gray-500 dark:text-gray-400">Frame Material</span>
                                            <p class="font-medium text-navy-900 dark:text-white">${this.product.frameMaterial}</p>
                                        </div>
                                    ` : ''}
                                    ${this.product.frameShape ? this.html`
                                        <div>
                                            <span class="text-gray-500 dark:text-gray-400">Frame Shape</span>
                                            <p class="font-medium text-navy-900 dark:text-white">${this.product.frameShape}</p>
                                        </div>
                                    ` : ''}
                                    ${this.product.warranty ? this.html`
                                        <div>
                                            <span class="text-gray-500 dark:text-gray-400">Warranty</span>
                                            <p class="font-medium text-navy-900 dark:text-white">${this.product.warranty}</p>
                                        </div>
                                    ` : ''}
                                    ${this.product.uvProtection ? this.html`
                                        <div>
                                            <span class="text-gray-500 dark:text-gray-400">UV Protection</span>
                                            <p class="font-medium text-navy-900 dark:text-white">${this.product.uvProtection}</p>
                                        </div>
                                    ` : ''}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Mobile Layout -->
                <div class="lg:hidden">
                    <!-- Image Gallery -->
                    <div class="relative bg-gray-50 dark:bg-slate-800">
                        <button
                            @click=${() => window.history.back()}
                            class="absolute top-4 left-4 z-10 w-10 h-10 bg-white dark:bg-slate-700 rounded-full flex items-center justify-center shadow-lg"
                        >
                            <i data-lucide="arrow-left" class="w-5 h-5 dark:text-gray-300"></i>
                        </button>
                        <div class="absolute top-4 right-4 z-10 flex gap-2">
                            <button
                                @click=${() => this.toggleWishlist()}
                                class="w-10 h-10 bg-white dark:bg-slate-700 rounded-full flex items-center justify-center shadow-lg"
                            >
                                <i data-lucide="heart" class="w-5 h-5 ${this.isInWishlist() ? 'fill-red-500 text-red-500' : 'dark:text-gray-300'}"></i>
                            </button>
                        </div>

                        <div class="aspect-square overflow-hidden">
                            <img
                                src="${this.product.images[this.currentImageIndex]}"
                                alt="${this.product.name}"
                                class="w-full h-full object-contain"
                            >
                        </div>

                        <!-- Image Thumbnails -->
                        ${this.product.images.length > 1 ? this.html`
                            <div class="flex justify-center gap-2 py-3 px-4">
                                ${this.product.images.map((_, index) => this.html`
                                    <button
                                        @click=${() => this.selectImage(index)}
                                        class="w-3 h-3 rounded-full transition-colors ${
                                            index === this.currentImageIndex
                                                ? 'bg-brand-500'
                                                : 'bg-gray-300 dark:bg-slate-600'
                                        }"
                                    ></button>
                                `)}
                            </div>
                        ` : ''}
                    </div>

                    <!-- Product Info -->
                    <div class="p-4 space-y-4">
                        <!-- Rating -->
                        <div class="flex items-center gap-3">
                            <div class="flex items-center gap-1 text-yellow-500">
                                <i data-lucide="star" class="w-4 h-4 fill-current"></i>
                                <span class="font-bold">${this.product.rating}</span>
                            </div>
                            <span class="text-sm text-gray-500">(${this.product.reviews?.toLocaleString() || 0} reviews)</span>
                        </div>

                        <!-- Title & Description -->
                        <div>
                            <h1 class="text-xl font-bold text-navy-900 dark:text-white">${this.product.name}</h1>
                            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">${this.product.description}</p>
                        </div>

                        <!-- Price -->
                        <div class="flex items-center gap-3">
                            <span class="text-2xl font-bold text-navy-900 dark:text-white">${formatCurrency(this.product.price)}</span>
                            ${this.product.originalPrice ? this.html`
                                <span class="text-lg text-gray-400 line-through">${formatCurrency(this.product.originalPrice)}</span>
                                <span class="text-sm text-green-600 dark:text-green-400 font-semibold">(${this.product.discount}% OFF)</span>
                            ` : ''}
                        </div>

                        <!-- Product Type -->
                        ${this.product.productType ? this.html`
                            <div>
                                <h3 class="font-semibold text-navy-900 dark:text-white mb-3">Product Type</h3>
                                <div class="flex gap-2 flex-wrap">
                                    ${this.product.productType.map(type => this.html`
                                        <button
                                            @click=${() => this.selectProductType(type)}
                                            class="px-4 py-2 rounded-full font-medium text-sm transition-colors ${
                                                this.selectedProductType === type
                                                    ? 'bg-navy-900 dark:bg-brand-500 text-white'
                                                    : 'bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300'
                                            }"
                                        >
                                            ${type}
                                        </button>
                                    `)}
                                </div>
                            </div>
                        ` : ''}

                        <!-- Frame Color -->
                        ${this.product.colors ? this.html`
                            <div>
                                <h3 class="font-semibold text-navy-900 dark:text-white mb-3">Frame Color</h3>
                                <div class="flex gap-3 flex-wrap">
                                    ${this.product.colors.map((color, index) => this.html`
                                        <button
                                            @click=${() => this.selectColor(color, index)}
                                            class="flex flex-col items-center gap-1"
                                        >
                                            <div class="w-10 h-10 rounded-full border-2 ${
                                                this.selectedColor === color ? 'border-brand-500' : 'border-gray-300 dark:border-slate-600'
                                            } p-0.5">
                                                <div class="w-full h-full rounded-full" style="background-color: ${this.product.colorHex?.[index] || '#ccc'}"></div>
                                            </div>
                                            <span class="text-xs ${this.selectedColor === color ? 'font-semibold text-brand-500' : 'text-gray-600 dark:text-gray-400'}">${color}</span>
                                        </button>
                                    `)}
                                </div>
                            </div>
                        ` : ''}

                        <!-- Frame Size -->
                        ${this.product.sizes ? this.html`
                            <div>
                                <div class="flex items-center justify-between mb-3">
                                    <h3 class="font-semibold text-navy-900 dark:text-white">Frame Size</h3>
                                    <button class="text-sm text-brand-500 font-medium">Size guide</button>
                                </div>
                                <div class="flex gap-2">
                                    ${this.product.sizes.map(size => this.html`
                                        <button
                                            @click=${() => this.selectSize(size)}
                                            class="flex-1 py-3 rounded-lg font-semibold transition-colors ${
                                                this.selectedSize === size
                                                    ? 'bg-navy-900 dark:bg-brand-500 text-white'
                                                    : 'bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300'
                                            }"
                                        >
                                            ${size}
                                        </button>
                                    `)}
                                </div>
                            </div>
                        ` : ''}

                        <!-- Similar Products -->
                        ${similarProducts.length > 0 ? this.html`
                            <div class="pt-4">
                                <h3 class="font-bold text-lg text-navy-900 dark:text-white mb-4">Similar Products</h3>
                                <div class="grid grid-cols-2 gap-3">
                                    ${similarProducts.map(product => this.html`
                                        <a href="#/product/${product.id}" class="bg-gray-50 dark:bg-slate-800 rounded-xl overflow-hidden">
                                            <div class="aspect-square bg-gray-100 dark:bg-slate-700">
                                                <img src="${product.images[0]}" alt="${product.name}" class="w-full h-full object-contain">
                                            </div>
                                            <div class="p-3">
                                                <p class="text-sm font-medium line-clamp-1 text-navy-900 dark:text-white">${product.name}</p>
                                                <p class="text-sm font-bold text-brand-500">${formatCurrency(product.price)}</p>
                                            </div>
                                        </a>
                                    `)}
                                </div>
                            </div>
                        ` : ''}
                    </div>

                    <!-- Fixed Bottom Bar -->
                    <div class="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-800 p-4 z-40">
                        <div class="flex gap-3">
                            <div class="flex items-center gap-2 bg-gray-100 dark:bg-slate-800 rounded-xl px-2">
                                <button
                                    @click=${() => this.updateQuantity(-1)}
                                    class="w-8 h-10 flex items-center justify-center"
                                >
                                    <i data-lucide="minus" class="w-4 h-4"></i>
                                </button>
                                <span class="w-6 text-center font-semibold">${this.quantity}</span>
                                <button
                                    @click=${() => this.updateQuantity(1)}
                                    class="w-8 h-10 flex items-center justify-center"
                                >
                                    <i data-lucide="plus" class="w-4 h-4"></i>
                                </button>
                            </div>
                            <button
                                @click=${() => this.addToCart()}
                                class="flex-1 bg-navy-900 dark:bg-brand-500 text-white py-3 rounded-xl font-bold text-lg"
                            >
                                Add to Cart - ${formatCurrency(this.product.price * this.quantity)}
                            </button>
                        </div>
                    </div>

                    <!-- Bottom Padding -->
                    <div class="h-24"></div>
                </div>

                <!-- Similar Products (Desktop) -->
                ${similarProducts.length > 0 ? this.html`
                    <div class="hidden lg:block container-desktop pb-12">
                        <div class="border-t border-gray-200 dark:border-slate-800 pt-12">
                            <h3 class="font-bold text-2xl text-navy-900 dark:text-white mb-6">Similar Products</h3>
                            <div class="grid grid-cols-4 gap-6">
                                ${similarProducts.map(product => this.html`
                                    <a href="#/product/${product.id}" class="product-card group bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-card">
                                        <div class="aspect-square bg-gray-50 dark:bg-slate-700">
                                            <img src="${product.images[0]}" alt="${product.name}" class="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300">
                                        </div>
                                        <div class="p-4">
                                            <h4 class="font-semibold text-navy-900 dark:text-white line-clamp-1">${product.name}</h4>
                                            <div class="flex items-center gap-2 mt-2">
                                                <span class="font-bold text-lg text-navy-900 dark:text-white">${formatCurrency(product.price)}</span>
                                                ${product.originalPrice ? this.html`
                                                    <span class="text-sm text-gray-400 line-through">${formatCurrency(product.originalPrice)}</span>
                                                ` : ''}
                                            </div>
                                        </div>
                                    </a>
                                `)}
                            </div>
                        </div>
                    </div>
                ` : ''}
            </div>
        `;
    }
}

customElements.define('product-details-page', ProductDetailsPage);
