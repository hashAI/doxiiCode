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
        selectedTab: { type: String }
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
    }

    connectedCallback() {
        super.connectedCallback();
        const params = this.getParams();
        this.product = productsStore.getProductById(params.id);
        if (this.product) {
            this.images = this.product.images?.length ? this.product.images : [this.product.image];
        }

        this.unsubscribe = shortlistStore.subscribe((state) => {
            this.isSaved = !!state.items.find(item => item.id === this.product?.id);
        });
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        this.unsubscribe?.();
    }

    toggleSave() {
        if (this.product) {
            shortlistStore.toggle(this.product);
            showToast({
                title: this.isSaved ? 'Removed from collection' : 'Added to collection',
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
        document.body.style.overflow = 'hidden';
    }

    closeZoom() {
        this.showZoom = false;
        document.body.style.overflow = '';
    }

    updateQuantity(change) {
        this.quantity = Math.max(1, this.quantity + change);
    }

    selectImage(index) {
        this.selectedImageIndex = index;
    }

    render() {
        if (!this.product) {
            return this.html`
                <div class="min-h-[60vh] flex flex-col items-center justify-center bg-noir-950">
                    <div class="w-20 h-20 border border-gold-400/20 flex items-center justify-center mb-6">
                        <i data-lucide="package-x" class="w-8 h-8 text-gold-400/30"></i>
                    </div>
                    <p class="text-lg font-display text-noir-100 mb-2">Product not found</p>
                    <button @click=${() => navigate('/')} class="text-gold-400 hover:text-gold-300 transition-colors">
                        Return to home
                    </button>
                </div>
            `;
        }

        const relatedProducts = productsStore.getByCategory(this.product.productType)
            .filter(p => p.id !== this.product.id)
            .slice(0, 4);

        return this.html`
            <div class="min-h-screen bg-noir-950 pb-28 lg:pb-12">
                <!-- Breadcrumb -->
                <div class="max-w-[1600px] mx-auto px-6 lg:px-12 py-4">
                    <nav class="flex items-center gap-2 text-xs text-noir-500">
                        <a href="#/" @click=${() => navigate('/')} class="hover:text-gold-400 transition-colors">Home</a>
                        <span>/</span>
                        <a href="#/products/all" @click=${() => navigate('/products/all')} class="hover:text-gold-400 transition-colors">Collection</a>
                        <span>/</span>
                        <span class="text-noir-300">${this.product.name}</span>
                    </nav>
                </div>

                <!-- Main Content -->
                <div class="max-w-[1600px] mx-auto px-6 lg:px-12">
                    <div class="lg:grid lg:grid-cols-2 lg:gap-16 xl:gap-24">
                        <!-- Left: Image Gallery -->
                        <div class="lg:sticky lg:top-24 lg:self-start">
                            <!-- Main Image -->
                            <div class="relative bg-noir-900 border border-noir-800 overflow-hidden group">
                                <div class="aspect-square lg:aspect-[4/5]">
                                    <img
                                        src="${this.images[this.selectedImageIndex]}"
                                        alt="${this.product.name}"
                                        class="w-full h-full object-contain p-8 lg:p-12 cursor-zoom-in"
                                        @click=${() => this.openZoom(this.selectedImageIndex)}
                                    />
                                </div>

                                <!-- Badge -->
                                ${this.product.badge ? this.html`
                                    <div class="absolute top-4 left-4 px-3 py-1 bg-gold-400 text-noir-900 text-[10px] font-medium tracking-wide uppercase">
                                        ${this.product.badge}
                                    </div>
                                ` : ''}

                                <!-- Zoom hint -->
                                <div class="absolute bottom-4 right-4 px-3 py-1.5 bg-noir-900/80 backdrop-blur-sm text-[10px] text-noir-300 tracking-wide uppercase opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5">
                                    <i data-lucide="zoom-in" class="w-3 h-3"></i>
                                    Click to enlarge
                                </div>

                                <!-- Mobile: Save button -->
                                <button
                                    @click=${this.toggleSave}
                                    class="lg:hidden absolute top-4 right-4 w-10 h-10 bg-noir-900/80 backdrop-blur-sm border border-noir-700 flex items-center justify-center">
                                    <i data-lucide="heart" class="w-5 h-5 ${this.isSaved ? 'fill-gold-400 text-gold-400' : 'text-noir-300'}"></i>
                                </button>
                            </div>

                            <!-- Thumbnails -->
                            ${this.images.length > 1 ? this.html`
                                <div class="flex gap-3 mt-4">
                                    ${this.images.map((img, idx) => this.html`
                                        <button
                                            @click=${() => this.selectImage(idx)}
                                            class="w-20 h-20 border ${idx === this.selectedImageIndex ? 'border-gold-400' : 'border-noir-800 hover:border-noir-600'} transition-all overflow-hidden">
                                            <img src="${img}" alt="" class="w-full h-full object-contain bg-noir-900 p-2" />
                                        </button>
                                    `)}
                                </div>
                            ` : ''}
                        </div>

                        <!-- Right: Product Details -->
                        <div class="mt-8 lg:mt-0 space-y-6 lg:space-y-8">
                            <!-- Brand & Certification -->
                            <div class="flex items-center gap-3 flex-wrap">
                                <p class="text-xs text-gold-400 tracking-ultrawide uppercase">${this.product.brand}</p>
                                ${this.product.certified ? this.html`
                                    <span class="px-2 py-1 border border-emerald-500/30 text-emerald-400 text-[10px] tracking-wide uppercase flex items-center gap-1">
                                        <i data-lucide="shield-check" class="w-3 h-3"></i>
                                        GIA Certified
                                    </span>
                                ` : ''}
                            </div>

                            <!-- Title -->
                            <h1 class="text-3xl lg:text-5xl font-display font-medium text-noir-50 leading-tight">
                                ${this.product.name}
                            </h1>

                            <!-- Rating -->
                            <div class="flex items-center gap-3">
                                <div class="flex items-center gap-0.5">
                                    ${[...Array(5)].map((_, i) => this.html`
                                        <i data-lucide="star" class="w-4 h-4 ${i < Math.floor(this.product.rating) ? 'text-gold-400 fill-gold-400' : 'text-noir-700'}"></i>
                                    `)}
                                </div>
                                <span class="text-sm text-noir-300">${this.product.rating} (${this.product.reviews} reviews)</span>
                            </div>

                            <!-- Price -->
                            <div class="flex items-baseline gap-4">
                                <span class="text-4xl lg:text-5xl font-display text-gold-400">$${this.product.price.toFixed(2)}</span>
                                ${this.product.originalPrice > this.product.price ? this.html`
                                    <span class="text-xl text-noir-600 line-through">$${this.product.originalPrice.toFixed(2)}</span>
                                    <span class="px-2 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs">
                                        Save $${(this.product.originalPrice - this.product.price).toFixed(2)}
                                    </span>
                                ` : ''}
                            </div>

                            <!-- Divider -->
                            <div class="w-full h-px line-gold"></div>

                            <!-- Product Attributes -->
                            <div class="grid grid-cols-2 gap-4">
                                <div class="p-4 border border-noir-800 bg-noir-900/50">
                                    <p class="text-[10px] text-noir-500 tracking-wide uppercase mb-1">Category</p>
                                    <p class="text-sm text-noir-100">${this.product.category}</p>
                                </div>
                                <div class="p-4 border border-noir-800 bg-noir-900/50">
                                    <p class="text-[10px] text-noir-500 tracking-wide uppercase mb-1">Size</p>
                                    <p class="text-sm text-noir-100">${this.product.size}</p>
                                </div>
                                <div class="p-4 border border-noir-800 bg-noir-900/50">
                                    <p class="text-[10px] text-noir-500 tracking-wide uppercase mb-1">Metal</p>
                                    <p class="text-sm text-noir-100 capitalize">${this.product.shade || 'Gold'}</p>
                                </div>
                                <div class="p-4 border border-noir-800 bg-noir-900/50">
                                    <p class="text-[10px] text-noir-500 tracking-wide uppercase mb-1">Brand</p>
                                    <p class="text-sm text-noir-100">${this.product.brand}</p>
                                </div>
                            </div>

                            <!-- Quantity & Add to Cart -->
                            <div class="space-y-4 p-6 border border-gold-400/20 bg-noir-900/30">
                                <div class="flex items-center gap-6">
                                    <p class="text-xs text-noir-400 tracking-wide uppercase">Quantity</p>
                                    <div class="flex items-center border border-noir-700">
                                        <button
                                            @click=${() => this.updateQuantity(-1)}
                                            class="w-12 h-12 flex items-center justify-center text-noir-300 hover:text-gold-400 hover:bg-noir-800 transition-colors">
                                            <i data-lucide="minus" class="w-4 h-4"></i>
                                        </button>
                                        <span class="w-16 text-center text-lg font-medium text-noir-100">${this.quantity}</span>
                                        <button
                                            @click=${() => this.updateQuantity(1)}
                                            class="w-12 h-12 flex items-center justify-center text-noir-300 hover:text-gold-400 hover:bg-noir-800 transition-colors">
                                            <i data-lucide="plus" class="w-4 h-4"></i>
                                        </button>
                                    </div>
                                </div>

                                <div class="flex gap-3">
                                    <button
                                        @click=${this.addToCart}
                                        class="flex-1 py-4 border border-gold-400 text-gold-400 hover:bg-gold-400/10 font-medium tracking-wide uppercase text-sm transition-colors flex items-center justify-center gap-2">
                                        <i data-lucide="shopping-bag" class="w-4 h-4"></i>
                                        Add to Cart
                                    </button>
                                    <button
                                        @click=${this.toggleSave}
                                        class="hidden lg:flex w-14 h-14 border ${this.isSaved ? 'border-gold-400 bg-gold-400/10' : 'border-noir-700 hover:border-gold-400'} items-center justify-center transition-all">
                                        <i data-lucide="heart" class="w-5 h-5 ${this.isSaved ? 'fill-gold-400 text-gold-400' : 'text-noir-300'}"></i>
                                    </button>
                                </div>

                                <button
                                    @click=${this.buyNow}
                                    class="w-full py-4 bg-gold-400 hover:bg-gold-500 text-noir-900 font-medium tracking-wide uppercase text-sm transition-colors flex items-center justify-center gap-2">
                                    Buy Now
                                </button>
                            </div>

                            <!-- Trust Badges -->
                            <div class="flex items-center justify-center gap-6 py-4 text-noir-500">
                                <div class="flex items-center gap-2 text-[10px] tracking-wide uppercase">
                                    <i data-lucide="truck" class="w-4 h-4 text-gold-400/50"></i>
                                    Free Shipping
                                </div>
                                <div class="w-px h-4 bg-noir-700"></div>
                                <div class="flex items-center gap-2 text-[10px] tracking-wide uppercase">
                                    <i data-lucide="shield-check" class="w-4 h-4 text-gold-400/50"></i>
                                    Certified
                                </div>
                                <div class="w-px h-4 bg-noir-700"></div>
                                <div class="flex items-center gap-2 text-[10px] tracking-wide uppercase">
                                    <i data-lucide="rotate-ccw" class="w-4 h-4 text-gold-400/50"></i>
                                    30-Day Returns
                                </div>
                            </div>

                            <!-- Tabs -->
                            <div class="border border-noir-800">
                                <div class="flex border-b border-noir-800">
                                    ${['details', 'care', 'reviews'].map(tab => this.html`
                                        <button
                                            @click=${() => this.selectedTab = tab}
                                            class="flex-1 py-4 text-xs tracking-wide uppercase transition-colors ${this.selectedTab === tab ? 'text-gold-400 border-b border-gold-400 -mb-px' : 'text-noir-400 hover:text-noir-200'}">
                                            ${tab}
                                        </button>
                                    `)}
                                </div>
                                <div class="p-6">
                                    ${this.selectedTab === 'details' ? this.html`
                                        <div class="space-y-4 text-sm text-noir-300 leading-relaxed">
                                            <p>This exquisite ${this.product.category.toLowerCase()} is crafted with the finest materials and utmost precision. Each piece is hand-finished by master artisans.</p>
                                            <p><strong class="text-noir-100">Materials:</strong> ${this.product.shade || 'Gold'}, ${this.product.size}</p>
                                            <p><strong class="text-noir-100">Craftsmanship:</strong> Hand-finished with meticulous attention to detail. Includes certificate of authenticity.</p>
                                        </div>
                                    ` : this.selectedTab === 'care' ? this.html`
                                        <ul class="space-y-3 text-sm text-noir-300">
                                            ${['Store separately in a soft pouch', 'Clean with soft lint-free cloth', 'Avoid contact with perfumes', 'Remove before swimming', 'Annual professional inspection'].map(tip => this.html`
                                                <li class="flex items-center gap-2">
                                                    <i data-lucide="check" class="w-4 h-4 text-gold-400"></i>
                                                    ${tip}
                                                </li>
                                            `)}
                                        </ul>
                                    ` : this.html`
                                        <div class="space-y-4">
                                            <div class="flex items-center gap-4 pb-4 border-b border-noir-800">
                                                <div class="text-center">
                                                    <div class="text-3xl font-display text-noir-100">${this.product.rating}</div>
                                                    <div class="flex items-center gap-0.5 mt-1">
                                                        ${[...Array(5)].map((_, i) => this.html`
                                                            <i data-lucide="star" class="w-3 h-3 ${i < Math.floor(this.product.rating) ? 'fill-gold-400 text-gold-400' : 'text-noir-700'}"></i>
                                                        `)}
                                                    </div>
                                                    <div class="text-xs text-noir-500 mt-1">${this.product.reviews} reviews</div>
                                                </div>
                                            </div>
                                            ${[
                                                { name: 'Victoria M.', rating: 5, text: 'Absolutely stunning piece! The craftsmanship is impeccable.', date: '2 days ago' },
                                                { name: 'Alexandra R.', rating: 5, text: 'Exceeded all expectations. Worth every penny.', date: '1 week ago' }
                                            ].map(review => this.html`
                                                <div class="p-4 border border-noir-800 space-y-2">
                                                    <div class="flex items-center justify-between">
                                                        <span class="text-sm font-medium text-noir-100">${review.name}</span>
                                                        <span class="text-xs text-noir-500">${review.date}</span>
                                                    </div>
                                                    <div class="flex items-center gap-0.5">
                                                        ${[...Array(5)].map((_, i) => this.html`
                                                            <i data-lucide="star" class="w-3 h-3 ${i < review.rating ? 'fill-gold-400 text-gold-400' : 'text-noir-700'}"></i>
                                                        `)}
                                                    </div>
                                                    <p class="text-sm text-noir-300">${review.text}</p>
                                                </div>
                                            `)}
                                        </div>
                                    `}
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Related Products -->
                    ${relatedProducts.length > 0 ? this.html`
                        <section class="mt-20 lg:mt-32 pt-12 border-t border-noir-800">
                            <div class="flex items-end justify-between mb-8">
                                <div>
                                    <p class="text-xs text-gold-400 tracking-ultrawide uppercase mb-2">You May Also Like</p>
                                    <h3 class="text-2xl lg:text-3xl font-display text-noir-50">Similar Pieces</h3>
                                </div>
                            </div>
                            <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                                ${relatedProducts.map((product, i) => this.html`
                                    <div
                                        @click=${() => { window.location.hash = `/product/${product.id}`; window.location.reload(); }}
                                        class="group cursor-pointer">
                                        <div class="aspect-portrait bg-noir-900 border border-noir-800 group-hover:border-gold-400/30 transition-all overflow-hidden">
                                            <img src="${product.image}" alt="${product.name}" class="w-full h-full object-contain p-4 lg:p-6" />
                                        </div>
                                        <div class="mt-3 space-y-1">
                                            <p class="text-[10px] text-noir-500 tracking-ultrawide uppercase">${product.brand}</p>
                                            <h4 class="text-sm font-display text-noir-100 group-hover:text-gold-400 transition-colors line-clamp-1">${product.name}</h4>
                                            <p class="text-base font-display text-gold-400">$${product.price.toFixed(2)}</p>
                                        </div>
                                    </div>
                                `)}
                            </div>
                        </section>
                    ` : ''}
                </div>
            </div>

            <!-- Mobile: Fixed bottom action bar -->
            <div class="lg:hidden fixed bottom-0 left-0 right-0 bg-noir-900/95 backdrop-blur-sm border-t border-noir-800 p-4 z-40">
                <div class="flex items-center gap-3">
                    <div class="flex items-center border border-noir-700">
                        <button @click=${() => this.updateQuantity(-1)} class="w-10 h-10 flex items-center justify-center text-noir-300">
                            <i data-lucide="minus" class="w-4 h-4"></i>
                        </button>
                        <span class="w-8 text-center text-sm font-medium text-noir-100">${this.quantity}</span>
                        <button @click=${() => this.updateQuantity(1)} class="w-10 h-10 flex items-center justify-center text-noir-300">
                            <i data-lucide="plus" class="w-4 h-4"></i>
                        </button>
                    </div>
                    <button @click=${this.addToCart} class="flex-1 py-3 border border-gold-400 text-gold-400 text-sm font-medium tracking-wide uppercase">
                        Add to Cart
                    </button>
                    <button @click=${this.buyNow} class="flex-1 py-3 bg-gold-400 text-noir-900 text-sm font-medium tracking-wide uppercase">
                        Buy Now
                    </button>
                </div>
            </div>

            <!-- Zoom Modal -->
            ${this.showZoom ? this.html`
                <div class="fixed inset-0 bg-noir-950/95 z-[100] flex flex-col" @click=${this.closeZoom}>
                    <div class="flex items-center justify-between p-4">
                        <button class="p-2 text-noir-400 hover:text-gold-400 transition-colors">
                            <i data-lucide="x" class="w-6 h-6"></i>
                        </button>
                        <span class="text-sm text-noir-400">${this.selectedImageIndex + 1} / ${this.images.length}</span>
                        <div class="w-10"></div>
                    </div>
                    <div class="flex-1 flex items-center justify-center p-4" @click=${(e) => e.stopPropagation()}>
                        <img src="${this.images[this.selectedImageIndex]}" alt="${this.product.name}" class="max-w-full max-h-full object-contain" />
                    </div>
                    ${this.images.length > 1 ? this.html`
                        <div class="flex items-center justify-center gap-4 p-4">
                            <button
                                @click=${(e) => { e.stopPropagation(); this.selectImage(Math.max(0, this.selectedImageIndex - 1)); }}
                                class="w-12 h-12 border border-noir-700 flex items-center justify-center hover:border-gold-400 transition-colors ${this.selectedImageIndex === 0 ? 'opacity-30' : ''}">
                                <i data-lucide="chevron-left" class="w-5 h-5 text-noir-300"></i>
                            </button>
                            <button
                                @click=${(e) => { e.stopPropagation(); this.selectImage(Math.min(this.images.length - 1, this.selectedImageIndex + 1)); }}
                                class="w-12 h-12 border border-noir-700 flex items-center justify-center hover:border-gold-400 transition-colors ${this.selectedImageIndex === this.images.length - 1 ? 'opacity-30' : ''}">
                                <i data-lucide="chevron-right" class="w-5 h-5 text-noir-300"></i>
                            </button>
                        </div>
                    ` : ''}
                </div>
            ` : ''}
        `;
    }
}

customElements.define('product-details-page', ProductDetailsPage);
