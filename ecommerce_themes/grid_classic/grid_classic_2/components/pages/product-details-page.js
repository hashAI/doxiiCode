import { BaseComponent } from '../base-component.js';
import { productsStore, cartStore } from '../../assets/state.js';
import { navigate } from '../../assets/router.js';
import { formatCurrency, showToast, getImageUrl } from '../../assets/utils.js';

class ProductDetailsPage extends BaseComponent {
    static properties = {
        product: { type: Object },
        quantity: { type: Number },
        cartQuantity: { type: Number },
        selectedImageIndex: { type: Number },
        images: { type: Array },
        showImageZoom: { type: Boolean }
    };

    constructor() {
        super();
        this.product = null;
        this.quantity = 1;
        this.cartQuantity = 0;
        this.selectedImageIndex = 0;
        this.images = [];
        this.showImageZoom = false;
    }

    connectedCallback() {
        super.connectedCallback();
        const params = this.getParams();
        this.product = productsStore.getProductById(params.id);

        // Generate multiple images for the product (simulate different angles/views)
        if (this.product) {
            this.images = [
                getImageUrl(this.product.name, 900, 0),
                getImageUrl(this.product.name, 900, 1),
                getImageUrl(this.product.name, 900, 2)
            ];
        }

        // Hide bottom nav on product details page
        const bottomNav = document.querySelector('bottom-nav');
        if (bottomNav) {
            bottomNav.style.display = 'none';
        }

        this.unsubscribe = cartStore.subscribe((state) => {
            const item = state.items.find(i => i.id === this.product?.id);
            this.cartQuantity = item?.quantity || 0;
        });
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        this.unsubscribe?.();

        // Show bottom nav again when leaving product details page
        const bottomNav = document.querySelector('bottom-nav');
        if (bottomNav) {
            bottomNav.style.display = '';
        }
    }

    addToCart() {
        if (!this.product) return;
        cartStore.add(this.product, this.quantity);
        showToast({
            title: 'Added to cart',
            message: `${this.quantity}x ${this.product.name} added`,
            variant: 'success'
        });
    }

    updateCartQuantity(delta) {
        if (!this.product) return;
        const newQty = this.cartQuantity + delta;

        if (newQty <= 0) {
            cartStore.remove(this.product.id);
        } else {
            cartStore.update(this.product.id, newQty);
        }
    }

    openImageZoom(index) {
        this.selectedImageIndex = index;
        this.showImageZoom = true;
        document.getElementById('overlay')?.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    closeImageZoom() {
        this.showImageZoom = false;
        document.getElementById('overlay')?.classList.add('hidden');
        document.body.style.overflow = '';
    }

    nextImage() {
        this.selectedImageIndex = (this.selectedImageIndex + 1) % this.images.length;
    }

    prevImage() {
        this.selectedImageIndex = (this.selectedImageIndex - 1 + this.images.length) % this.images.length;
    }

    handleCarouselScroll(event) {
        const el = event?.target;
        if (!el || !el.clientWidth) return;
        const index = Math.round(el.scrollLeft / el.clientWidth);
        this.selectedImageIndex = Math.min(Math.max(index, 0), this.images.length - 1);
    }

    render() {
        if (!this.product) {
            return this.html`
                <div class="flex flex-col items-center justify-center min-h-[60vh] px-4">
                    <i data-lucide="package-x" class="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4"></i>
                    <p class="text-gray-500 dark:text-gray-300 font-medium">Product not found</p>
                    <button @click=${() => navigate('/')} class="mt-4 text-primary-500 font-semibold">
                        Go back home
                    </button>
                </div>
            `;
        }

        const savings = this.product.originalPrice ? this.product.originalPrice - this.product.price : 0;
        const savingsPercent = this.product.originalPrice
            ? Math.round((savings / this.product.originalPrice) * 100)
            : 0;

        return this.html`
            <div class="pb-24 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors">
                <!-- Product Images Gallery -->
                <div class="bg-white dark:bg-gray-800 transition-colors">
                    <!-- Image Carousel -->
                    <div class="relative">
                        <div class="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide" style="-webkit-overflow-scrolling: touch;" @scroll=${this.handleCarouselScroll}>
                            ${this.images.map((img, index) => this.html`
                                <div class="w-full flex-shrink-0 snap-center">
                                    <div class="relative bg-white dark:bg-gray-900 transition-colors">
                                        <img
                                            src="${img}"
                                            alt="${this.product.name}"
                                            class="w-full h-96 object-contain"
                                            @click=${() => this.openImageZoom(index)}>
                                        <!-- Image Controls -->
                                        <div class="absolute bottom-4 left-4 flex gap-2">
                                            <button
                                                @click=${() => this.openImageZoom(index)}
                                                class="bg-white dark:bg-gray-800 p-2 rounded-full shadow-lg touch-feedback transition-colors">
                                                <i data-lucide="zoom-in" class="w-5 h-5 text-gray-700 dark:text-gray-200"></i>
                                            </button>
                                            <button class="bg-white dark:bg-gray-800 p-2 rounded-full shadow-lg touch-feedback transition-colors">
                                                <i data-lucide="share-2" class="w-5 h-5 text-gray-700 dark:text-gray-200"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            `)}
                        </div>
                        <!-- Image Indicators -->
                        <div class="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
                            ${this.selectedImageIndex + 1}/${this.images.length}
                        </div>
                    </div>
                </div>

                <!-- Product Info -->
                <div class="bg-white dark:bg-gray-800 px-4 py-4 transition-colors">
                    ${this.product.rating ? this.html`
                        <div class="flex items-center gap-1 mb-3">
                            <i data-lucide="star" class="w-4 h-4 fill-green-600 text-green-600"></i>
                            <span class="font-bold text-base">${this.product.rating}</span>
                            <span class="text-sm text-gray-600 dark:text-gray-400">(${(this.product.reviews / 1000).toFixed(1)}k)</span>
                        </div>
                    ` : ''}

                    <h1 class="text-xl font-bold mb-2 leading-tight dark:text-white">${this.product.name}</h1>
                    <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">Net quantity - ${this.product.unit}</p>

                    <!-- Price -->
                    <div class="flex items-baseline gap-3 mb-2">
                        <p class="text-4xl font-bold text-green-700 dark:text-green-400">${formatCurrency(this.product.price)}</p>
                    </div>

                    ${savings > 0 ? this.html`
                        <div class="flex flex-wrap items-center gap-2 text-sm mb-4">
                            <span class="text-gray-600 dark:text-gray-400">MRP</span>
                            <span class="text-gray-400 dark:text-gray-500 line-through">₹${this.product.originalPrice}</span>
                            <span class="text-gray-600 dark:text-gray-400">(incl. of all taxes)</span>
                            <span class="font-bold text-green-600 dark:text-green-400">₹${savings} OFF</span>
                        </div>
                    ` : ''}

                    <!-- View all brand products -->
                    <button class="flex items-center justify-between w-full py-3 border-t border-gray-200 dark:border-gray-700 mt-4 touch-feedback transition-colors">
                        <span class="text-sm font-semibold dark:text-gray-100">View all Farmley products</span>
                        <i data-lucide="chevron-right" class="w-5 h-5 text-gray-400 dark:text-gray-500"></i>
                    </button>
                </div>

                <!-- Coupons & Offers -->
                <div class="bg-white dark:bg-gray-800 px-4 py-4 mb-2 transition-colors">
                    <h2 class="font-bold text-base mb-3 dark:text-white">Coupons & Offers</h2>
                    <div class="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-xl transition-colors">
                        <div class="bg-purple-600 p-2 rounded-lg">
                            <span class="text-white font-bold text-sm">CRED</span>
                        </div>
                        <div class="flex-1">
                            <p class="font-semibold text-sm dark:text-gray-100">Assured Cashback From CRED</p>
                        </div>
                        <i data-lucide="chevron-right" class="w-5 h-5 text-gray-400 dark:text-gray-500"></i>
                    </div>
                    <button class="text-primary-500 font-semibold text-sm mt-3 flex items-center gap-1">
                        View all coupons
                        <i data-lucide="chevron-right" class="w-4 h-4"></i>
                    </button>
                </div>

                <!-- Similar Products -->
                <div class="bg-white dark:bg-gray-800 px-4 py-4 mb-2 transition-colors">
                    <h2 class="font-bold text-base mb-3 dark:text-white">Similar Products</h2>
                    <div class="flex gap-3 overflow-x-auto scrollbar-hide pb-2" style="-webkit-overflow-scrolling: touch;">
                        ${productsStore.getByCategory(this.product.category)
                            .filter(p => p.id !== this.product.id)
                            .slice(0, 5)
                            .map(p => this.html`
                            <div @click=${() => navigate(`/product/${p.id}`)}
                                 class="flex-shrink-0 w-32 bg-gray-50 dark:bg-gray-900 rounded-xl overflow-hidden touch-feedback transition-colors">
                                <img src="${p.image}" alt="${p.name}" class="w-full h-24 object-cover">
                                <div class="p-2">
                                    <p class="text-xs font-medium line-clamp-2 mb-1 dark:text-gray-100">${p.name}</p>
                                    <p class="text-sm font-bold text-green-700 dark:text-green-400">${formatCurrency(p.price)}</p>
                                </div>
                            </div>
                        `)}
                    </div>
                </div>

                <!-- You might also like -->
                <div class="bg-white dark:bg-gray-800 px-4 py-4 transition-colors">
                    <h2 class="font-bold text-base mb-3 dark:text-white">You might also like</h2>
                    <div class="flex gap-3 overflow-x-auto scrollbar-hide pb-2" style="-webkit-overflow-scrolling: touch;">
                        ${productsStore.getFeaturedProducts()
                            .filter(p => p.id !== this.product.id)
                            .slice(0, 5)
                            .map(p => this.html`
                            <div @click=${() => navigate(`/product/${p.id}`)}
                                 class="flex-shrink-0 w-32 bg-gray-50 dark:bg-gray-900 rounded-xl overflow-hidden touch-feedback transition-colors">
                                <img src="${p.image}" alt="${p.name}" class="w-full h-24 object-cover">
                                <div class="p-2">
                                    <p class="text-xs font-medium line-clamp-2 mb-1 dark:text-gray-100">${p.name}</p>
                                    <p class="text-sm font-bold text-green-700 dark:text-green-400">${formatCurrency(p.price)}</p>
                                    ${p.originalPrice ? this.html`
                                        <p class="text-xs text-gray-400 dark:text-gray-500 line-through">${formatCurrency(p.originalPrice)}</p>
                                    ` : ''}
                                </div>
                            </div>
                        `)}
                    </div>
                </div>

                <!-- Highlights -->
                <div class="bg-white dark:bg-gray-800 px-4 py-4 mt-2 transition-colors">
                    <h2 class="font-bold text-base mb-3 dark:text-white">Highlights</h2>
                    <div class="space-y-3">
                        <div class="flex justify-between">
                            <span class="text-gray-600 dark:text-gray-400">Product Type</span>
                            <span class="font-medium dark:text-gray-100">${this.product.category}</span>
                        </div>
                        ${this.product.subcategory ? this.html`
                            <div class="flex justify-between">
                                <span class="text-gray-600 dark:text-gray-400">Brand</span>
                                <span class="font-medium dark:text-gray-100">Unbranded</span>
                            </div>
                        ` : ''}
                        <div class="flex justify-between">
                            <span class="text-gray-600 dark:text-gray-400">Dietary Preference</span>
                            <span class="font-medium dark:text-gray-100">Veg</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-600 dark:text-gray-400">Unit</span>
                            <span class="font-medium dark:text-gray-100">${this.product.unit}</span>
                        </div>
                    </div>
                </div>

                <!-- Information -->
                <div class="bg-white dark:bg-gray-800 px-4 py-4 mt-2 transition-colors">
                    <h2 class="font-bold text-base mb-3 dark:text-white">Information</h2>
                    <div class="space-y-3">
                        <div>
                            <p class="text-gray-600 dark:text-gray-300 font-medium mb-1">Disclaimer</p>
                            <p class="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                                All images are for representational purposes only. It is advised that you read the batch and manufacturing details, directions for use, allergen information, health and nutritional claims (wherever applicable), and other details mentioned on the label before consuming the product. For combo items, individual prices can be viewed on the page.
                            </p>
                        </div>
                        <div>
                            <p class="text-gray-600 dark:text-gray-300 font-medium mb-1">Customer Care Details</p>
                            <p class="text-sm text-gray-500 dark:text-gray-400">
                                In case of any issue, contact us<br>
                                E-mail address: support@store.com
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Fixed Bottom Bar -->
            <div class="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 p-4 z-30 shadow-2xl border-t border-gray-200 dark:border-gray-700 transition-colors">
                <div class="flex items-center gap-4">
                    ${this.cartQuantity > 0 ? this.html`
                        <!-- Cart Icon with Count -->
                        <button
                            @click=${() => window.dispatchEvent(new CustomEvent('cart:open'))}
                            class="relative p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl touch-feedback transition-colors">
                            <i data-lucide="shopping-cart" class="w-6 h-6 text-gray-700 dark:text-gray-200"></i>
                            <div class="absolute -top-1 -right-1 bg-primary-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                                ${this.cartQuantity}
                            </div>
                        </button>

                        <!-- Add to Cart Button -->
                        <button
                            @click=${() => this.updateCartQuantity(1)}
                            class="flex-1 bg-primary-500 text-white py-4 rounded-2xl font-bold text-lg touch-feedback hover:bg-primary-600 transition-colors">
                            Add To Cart
                        </button>
                    ` : this.html`
                        <!-- Cart Icon -->
                        <button
                            @click=${() => window.dispatchEvent(new CustomEvent('cart:open'))}
                            class="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl touch-feedback transition-colors">
                            <i data-lucide="shopping-cart" class="w-6 h-6 text-gray-700 dark:text-gray-200"></i>
                        </button>

                        <!-- Add to Cart Button -->
                        <button
                            @click=${this.addToCart}
                            class="flex-1 bg-primary-500 text-white py-4 rounded-2xl font-bold text-lg touch-feedback hover:bg-primary-600 transition-colors">
                            Add To Cart
                        </button>
                    `}
                </div>
            </div>

            <!-- Image Zoom Modal -->
            ${this.showImageZoom ? this.html`
                <div class="fixed inset-0 bg-black z-50 flex flex-col">
                    <!-- Header -->
                    <div class="flex items-center justify-between p-4 bg-black/90">
                        <button
                            @click=${this.closeImageZoom}
                            class="p-2 text-white touch-feedback">
                            <i data-lucide="x" class="w-6 h-6"></i>
                        </button>
                        <span class="text-white font-medium">${this.selectedImageIndex + 1} / ${this.images.length}</span>
                        <button class="p-2 text-white touch-feedback">
                            <i data-lucide="share-2" class="w-6 h-6"></i>
                        </button>
                    </div>

                    <!-- Zoomable Image -->
                    <div class="flex-1 flex items-center justify-center overflow-hidden relative">
                        <img
                            src="${this.images[this.selectedImageIndex]}"
                            alt="${this.product.name}"
                            class="max-w-full max-h-full object-contain"
                            style="transform: scale(1); transition: transform 0.3s;">

                        <!-- Navigation Arrows -->
                        ${this.images.length > 1 ? this.html`
                            <button
                                @click=${this.prevImage}
                                class="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm p-3 rounded-full touch-feedback">
                                <i data-lucide="chevron-left" class="w-6 h-6 text-white"></i>
                            </button>
                            <button
                                @click=${this.nextImage}
                                class="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm p-3 rounded-full touch-feedback">
                                <i data-lucide="chevron-right" class="w-6 h-6 text-white"></i>
                            </button>
                        ` : ''}
                    </div>

                    <!-- Thumbnails -->
                    ${this.images.length > 1 ? this.html`
                        <div class="bg-black/90 p-4">
                            <div class="flex gap-2 overflow-x-auto scrollbar-hide justify-center">
                                ${this.images.map((img, index) => this.html`
                                    <button
                                        @click=${() => { this.selectedImageIndex = index; }}
                                        class="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 ${index === this.selectedImageIndex ? 'border-white' : 'border-transparent'} touch-feedback">
                                        <img src="${img}" alt="" class="w-full h-full object-cover">
                                    </button>
                                `)}
                            </div>
                        </div>
                    ` : ''}
                </div>
            ` : ''}
        `;
    }
}

customElements.define('product-details-page', ProductDetailsPage);
