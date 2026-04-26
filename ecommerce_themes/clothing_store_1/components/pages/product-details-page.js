/**
 * Product Details Page
 * Adapted from component_library/product-detail-fashion
 * Customized for Nova Threads aesthetic: Ink/Sand/Blush palette, Playfair Display headings
 */

import { BaseComponent } from '../base-component.js';
import { html } from 'https://cdn.jsdelivr.net/npm/lit@3.2.1/+esm';
import { productsStore, cartStore, eventBus } from '../../assets/state.js';
import { showToast, formatCurrency } from '../../assets/utils.js';

export class ProductDetailsPage extends BaseComponent {
    static properties = {
        product: { state: true },
        selectedImage: { state: true },
        selectedColor: { state: true },
        selectedSize: { state: true },
        activeTab: { state: true },
        quantity: { state: true },
        showImageModal: { state: true },
        modalImageIndex: { state: true }
    };

    constructor() {
        super();
        this.product = null;
        this.selectedImage = 0;
        this.selectedColor = '';
        this.selectedSize = '';
        this.activeTab = 'details';
        this.quantity = 1;
        this.showImageModal = false;
        this.modalImageIndex = 0;
    }

    connectedCallback() {
        super.connectedCallback?.();
        const params = this.getParams();
        const product = productsStore.getProductById(params?.id);

        if (product) {
            this.product = product;
            this.selectedColor = product.colors?.[0] || '';
            this.selectedSize = product.sizes?.[0] || '';
        }
    }

    selectImage(index) {
        this.selectedImage = index;
    }

    handleBack() {
        window.location.hash = '/products/all';
    }

    setActiveTab(tab) {
        this.activeTab = tab;
    }

    adjustQuantity(delta) {
        this.quantity = Math.max(1, this.quantity + delta);
    }

    handleAddToCart() {
        if (!this.product) return;

        cartStore.add(this.product, this.quantity);
        showToast({
            title: 'Added to cart',
            message: `${this.product.name} (${this.selectedSize}, ${this.selectedColor})`
        });
        eventBus.emit('cart:open');
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
        const images = this.product.gallery || [this.product.image];
        this.modalImageIndex = (this.modalImageIndex + 1) % images.length;
    }

    prevImage() {
        const images = this.product.gallery || [this.product.image];
        this.modalImageIndex = (this.modalImageIndex - 1 + images.length) % images.length;
    }

    renderStars(rating) {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(html`<span class="text-lg ${i > rating ? 'text-ink-200 dark:text-ink-700' : 'text-sand-400'}">★</span>`);
        }
        return stars;
    }

    render() {
        if (!this.product) {
            return html`
                <section class="min-h-[40vh] flex flex-col items-center justify-center gap-4">
                    <p class="text-sm uppercase tracking-[0.3em] text-ink-400">Product</p>
                    <h1 class="text-3xl font-display">Piece not found.</h1>
                    <a href="#/products/all" class="px-5 py-3 rounded-full border border-ink-200 hover:bg-ink-50 transition">
                        Back to collections
                    </a>
                </section>
            `;
        }

        const variantImages = this.product.gallery || [this.product.image];
        const discount = this.product.originalPrice
            ? Math.round(((this.product.originalPrice - this.product.price) / this.product.originalPrice) * 100)
            : 0;

        return html`
            <div class="w-full max-w-[1400px] mx-auto px-4 md:px-6 py-6 bg-white dark:bg-ink-900 text-ink-700 dark:text-white">

                <!-- Breadcrumb Navigation -->
                <div class="flex items-center gap-4 mb-8">
                    <button
                        class="w-10 h-10 rounded-full border-2 border-ink-200 dark:border-ink-700 hover:border-ink-700 dark:hover:border-ink-200 flex items-center justify-center transition-all"
                        @click="${this.handleBack}">
                        ←
                    </button>
                    <nav class="flex items-center gap-2 text-sm text-ink-400">
                        <a href="#/" class="hover:text-ink-700 dark:hover:text-white transition">Home</a>
                        <span>/</span>
                        <a href="#/products/all" class="hover:text-ink-700 dark:hover:text-white transition">Collections</a>
                        <span>/</span>
                        <span class="text-ink-700 dark:text-white">${this.product.name}</span>
                    </nav>
                </div>

                <!-- Product Layout -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-10 mb-12">

                    <!-- Image Gallery -->
                    <div class="flex flex-col gap-4">
                        <div class="bg-ink-50 dark:bg-ink-800 rounded-3xl overflow-hidden aspect-[3/4] relative group cursor-zoom-in"
                             @click="${() => this.openImageModal(this.selectedImage)}">
                            <img class="w-full h-full object-cover" src="${variantImages[this.selectedImage]}" alt="${this.product.name}" />
                            <div class="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition flex items-center justify-center">
                                <div class="opacity-0 group-hover:opacity-100 transition bg-white/90 dark:bg-ink-800/90 rounded-full p-3">
                                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"></path>
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <!-- Thumbnails -->
                        <div class="flex gap-3 overflow-x-auto">
                            ${variantImages.slice(0, 4).map((img, i) => html`
                                <div class="flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden cursor-pointer border-2 transition ${this.selectedImage === i ? 'border-blush-400' : 'border-transparent'}"
                                     @click="${() => this.selectImage(i)}">
                                    <img class="w-full h-full object-cover" src="${img}" alt="View ${i + 1}" />
                                </div>
                            `)}
                        </div>
                    </div>

                    <!-- Product Info -->
                    <div class="flex flex-col gap-6">

                        <!-- Category Tag -->
                        <p class="text-xs uppercase tracking-[0.4em] text-ink-400">${this.product.category}</p>

                        <!-- Product Name -->
                        <h1 class="text-4xl font-display text-ink-900 dark:text-white leading-tight">${this.product.name}</h1>

                        <!-- Description -->
                        <p class="text-base leading-relaxed text-ink-500 dark:text-ink-400">${this.product.description}</p>

                        <!-- Rating -->
                        <div class="flex items-center gap-3">
                            <div class="flex gap-0.5">${this.renderStars(this.product.rating || 4.5)}</div>
                            <span class="text-sm text-ink-400">${this.product.rating || 4.5} (${this.product.reviews || 0} reviews)</span>
                        </div>

                        <!-- Price -->
                        <div class="flex items-baseline gap-4">
                            <div class="text-3xl font-semibold text-ink-900 dark:text-white">${formatCurrency(this.product.price)}</div>
                            ${this.product.originalPrice ? html`
                                <div class="text-xl text-ink-400 line-through">${formatCurrency(this.product.originalPrice)}</div>
                                <span class="bg-blush-100 text-blush-500 px-3 py-1 rounded-full text-sm font-semibold">-${discount}%</span>
                            ` : ''}
                        </div>

                        <!-- Color Selection -->
                        ${this.product.colors?.length ? html`
                            <div>
                                <div class="text-sm font-semibold mb-3 uppercase tracking-[0.3em] text-ink-400">Color: ${this.selectedColor}</div>
                                <div class="flex gap-3">
                                    ${this.product.colors.map(color => html`
                                        <button
                                            class="px-4 py-2 rounded-full border-2 transition ${this.selectedColor === color ? 'border-ink-900 dark:border-white bg-ink-900 dark:bg-white text-white dark:text-ink-900' : 'border-ink-200 dark:border-ink-700 hover:border-ink-400'}"
                                            @click="${() => this.selectedColor = color}">
                                            ${color}
                                        </button>
                                    `)}
                                </div>
                            </div>
                        ` : ''}

                        <!-- Size Selection -->
                        ${this.product.sizes?.length ? html`
                            <div>
                                <div class="text-sm font-semibold mb-3 uppercase tracking-[0.3em] text-ink-400">Size: ${this.selectedSize}</div>
                                <div class="flex gap-2 flex-wrap">
                                    ${this.product.sizes.map(size => html`
                                        <button
                                            class="min-w-[60px] px-4 py-3 border-2 rounded-xl font-semibold transition ${this.selectedSize === size ? 'border-ink-900 dark:border-white bg-ink-900 dark:bg-white text-white dark:text-ink-900' : 'border-ink-200 dark:border-ink-700 hover:border-ink-400'}"
                                            @click="${() => this.selectedSize = size}">
                                            ${size}
                                        </button>
                                    `)}
                                </div>
                            </div>
                        ` : ''}

                        <!-- Quantity -->
                        <div>
                            <div class="text-sm font-semibold mb-3 uppercase tracking-[0.3em] text-ink-400">Quantity</div>
                            <div class="flex items-center border border-ink-200 dark:border-ink-700 rounded-full w-fit">
                                <button class="px-4 py-2 hover:bg-ink-50 dark:hover:bg-ink-800 transition rounded-l-full" @click="${() => this.adjustQuantity(-1)}">−</button>
                                <span class="px-6 py-2 font-semibold">${this.quantity}</span>
                                <button class="px-4 py-2 hover:bg-ink-50 dark:hover:bg-ink-800 transition rounded-r-full" @click="${() => this.adjustQuantity(1)}">+</button>
                            </div>
                        </div>

                        <!-- Add to Cart Button -->
                        <button
                            class="px-8 py-4 rounded-full bg-ink-900 dark:bg-white text-white dark:text-ink-900 font-semibold hover:bg-ink-700 dark:hover:bg-ink-100 transition flex items-center justify-center gap-2"
                            @click="${this.handleAddToCart}">
                            <i data-lucide="shopping-bag"></i>
                            Add to Cart
                        </button>

                        <!-- Product Details Grid -->
                        <div class="grid gap-4 md:grid-cols-2 mt-4">
                            ${this.product.material ? html`
                                <div class="p-4 rounded-2xl border border-ink-100 dark:border-ink-800">
                                    <p class="text-sm font-semibold uppercase tracking-[0.3em] text-ink-400 mb-1">Material</p>
                                    <p class="text-sm text-ink-500">${this.product.material}</p>
                                </div>
                            ` : ''}
                            ${this.product.shipping ? html`
                                <div class="p-4 rounded-2xl border border-ink-100 dark:border-ink-800">
                                    <p class="text-sm font-semibold uppercase tracking-[0.3em] text-ink-400 mb-1">Shipping</p>
                                    <p class="text-sm text-ink-500">${this.product.shipping}</p>
                                </div>
                            ` : ''}
                        </div>

                        <!-- Craft Notes -->
                        <div class="border border-ink-100 dark:border-ink-800 rounded-3xl p-5 space-y-3 mt-2">
                            <p class="text-xs uppercase tracking-[0.4em] text-ink-400">Craft Notes</p>
                            <p class="text-sm text-ink-500">
                                Each piece is finished by hand in small ateliers. We recommend storing garments flat and steaming at low heat.
                            </p>
                            <div class="flex items-center gap-2 text-sm text-ink-400">
                                <i data-lucide="shield-check" class="w-4 h-4"></i>
                                Certified sustainable materials
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Tabs Section -->
                <div class="mt-12 pt-12 border-t border-ink-200 dark:border-ink-700">
                    <div class="flex gap-8 border-b-2 border-ink-200 dark:border-ink-700 mb-8">
                        <button
                            class="py-4 border-b-[3px] mb-[-2px] font-semibold transition ${this.activeTab === 'details' ? 'text-ink-900 dark:text-white border-b-blush-400' : 'text-ink-400 border-b-transparent'}"
                            @click="${() => this.setActiveTab('details')}">
                            Details
                        </button>
                        <button
                            class="py-4 border-b-[3px] mb-[-2px] font-semibold transition ${this.activeTab === 'care' ? 'text-ink-900 dark:text-white border-b-blush-400' : 'text-ink-400 border-b-transparent'}"
                            @click="${() => this.setActiveTab('care')}">
                            Care
                        </button>
                    </div>

                    <!-- Details Tab -->
                    <div class="${this.activeTab === 'details' ? 'block' : 'hidden'}">
                        <div class="text-ink-500 dark:text-ink-400 leading-relaxed space-y-4">
                            <h3 class="text-xl font-display text-ink-900 dark:text-white">Product Details</h3>
                            <p>Crafted with attention to detail and sustainable practices. Each garment is made to last, using premium materials sourced from certified suppliers.</p>
                            <p>Our commitment to quality ensures that every piece meets the highest standards of craftsmanship.</p>
                        </div>
                    </div>

                    <!-- Care Tab -->
                    <div class="${this.activeTab === 'care' ? 'block' : 'hidden'}">
                        <div class="text-ink-500 dark:text-ink-400 leading-relaxed space-y-4">
                            <h3 class="text-xl font-display text-ink-900 dark:text-white">Care Instructions</h3>
                            <ul class="list-disc list-inside space-y-2">
                                <li>Dry clean recommended for best results</li>
                                <li>If machine washing, use cold water and gentle cycle</li>
                                <li>Hang or lay flat to dry</li>
                                <li>Steam at low temperature if needed</li>
                                <li>Store folded or on padded hangers</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <!-- Image Modal -->
                ${this.showImageModal ? html`
                    <div class="fixed inset-0 bg-black z-50 flex items-center justify-center" @click="${this.closeImageModal}">
                        <button class="absolute top-4 right-4 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white text-2xl transition" @click="${this.closeImageModal}">×</button>
                        <button class="absolute left-4 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white text-xl transition" @click="${(e) => { e.stopPropagation(); this.prevImage(); }}">‹</button>
                        <button class="absolute right-4 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white text-xl transition" @click="${(e) => { e.stopPropagation(); this.nextImage(); }}">›</button>
                        <div class="max-w-[90vw] max-h-[90vh]" @click="${(e) => e.stopPropagation()}">
                            <img class="max-w-full max-h-[90vh] object-contain" src="${variantImages[this.modalImageIndex]}" alt="${this.product.name}" />
                        </div>
                        <div class="absolute bottom-4 bg-black/50 text-white px-4 py-2 rounded-lg text-sm">
                            ${this.modalImageIndex + 1} / ${variantImages.length}
                        </div>
                    </div>
                ` : ''}
            </div>
        `;
    }
}

customElements.define('product-details-page', ProductDetailsPage);
