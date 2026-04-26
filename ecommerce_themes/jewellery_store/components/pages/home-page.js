import { BaseComponent } from '../base-component.js';
import { productsStore, productCategories, shortlistStore, cartStore } from '../../assets/state.js';
import { navigate } from '../../assets/router.js';
import { getImageUrl, showToast } from '../../assets/utils.js';

class HomePage extends BaseComponent {
    static properties = {
        featuredProducts: { type: Array },
        newProducts: { type: Array },
        shortlistIds: { type: Array },
        activeSlide: { type: Number }
    };

    constructor() {
        super();
        this.featuredProducts = productsStore.getFeatured();
        this.newProducts = productsStore.getNewlyAdded();
        this.shortlistIds = [];
        this.activeSlide = 0;
    }

    connectedCallback() {
        super.connectedCallback();
        this.unsubscribe = shortlistStore.subscribe((state) => {
            this.shortlistIds = state.items.map(item => item.id);
        });
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        this.unsubscribe?.();
    }

    toggleShortlist(product, e) {
        e?.stopPropagation();
        shortlistStore.toggle(product);
        const isAdded = this.shortlistIds.includes(product.id);
        showToast({
            title: isAdded ? 'Removed from collection' : 'Added to collection',
            variant: isAdded ? 'info' : 'success'
        });
    }

    addToCart(product, e) {
        e?.stopPropagation();
        cartStore.add(product, 1);
        showToast({
            title: 'Added to cart',
            description: product.name,
            variant: 'success'
        });
    }

    openQuickView(product, e) {
        e?.stopPropagation();
        window.dispatchEvent(new CustomEvent('quickview:open', { detail: product }));
    }

    renderFeaturedCard(product, index) {
        const isSaved = this.shortlistIds.includes(product.id);

        return this.html`
            <div
                class="group relative cursor-pointer opacity-0 animate-fade-in"
                style="animation-delay: ${index * 0.1}s"
                @click=${() => navigate(`/product/${product.id}`)}>

                <div class="aspect-portrait relative overflow-hidden bg-noir-900 border border-noir-800 hover:border-gold-400/30 transition-all duration-500 img-reveal">
                    <img
                        src="${product.image}"
                        alt="${product.name}"
                        class="w-full h-full object-contain p-6 lg:p-10"
                    />

                    <!-- Hover Actions -->
                    <div class="absolute inset-0 bg-noir-950/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <div class="flex gap-3">
                            <button
                                @click=${(e) => this.openQuickView(product, e)}
                                class="px-5 py-2.5 bg-gold-400 hover:bg-gold-500 text-noir-900 text-xs font-medium tracking-wide uppercase transition-colors">
                                Quick View
                            </button>
                            <button
                                @click=${(e) => this.toggleShortlist(product, e)}
                                class="w-10 h-10 border ${isSaved ? 'border-gold-400 bg-gold-400/10' : 'border-noir-100'} flex items-center justify-center transition-all">
                                <i data-lucide="heart" class="w-4 h-4 ${isSaved ? 'fill-gold-400 text-gold-400' : 'text-noir-100'}"></i>
                            </button>
                        </div>
                    </div>

                    <!-- Index -->
                    <div class="absolute bottom-4 right-4 text-[10px] text-noir-600 font-mono">
                        ${String(index + 1).padStart(2, '0')}
                    </div>
                </div>

                <div class="mt-4 space-y-1">
                    <p class="text-[10px] text-noir-500 tracking-ultrawide uppercase">${product.brand}</p>
                    <h3 class="text-base font-display text-noir-100 group-hover:text-gold-400 transition-colors line-clamp-1">${product.name}</h3>
                    <p class="text-lg font-display text-gold-400">$${product.price.toFixed(2)}</p>
                </div>
            </div>
        `;
    }

    render() {
        return this.html`
            <div class="min-h-screen bg-noir-950">
                <!-- Hero Section - Full Screen Cinematic -->
                <section class="relative h-screen overflow-hidden">
                    <!-- Background Video/Image -->
                    <div class="absolute inset-0">
                        <img
                            src="${getImageUrl('luxury diamond jewelry dark elegant', 1500, 1)}"
                            alt=""
                            class="w-full h-full object-cover opacity-40"
                        />
                        <div class="absolute inset-0 bg-gradient-to-r from-noir-950 via-noir-950/60 to-noir-950/80"></div>
                        <div class="absolute inset-0 bg-gradient-to-t from-noir-950 via-transparent to-noir-950/40"></div>
                    </div>

                    <!-- Content -->
                    <div class="relative h-full flex flex-col justify-center max-w-[1600px] mx-auto px-6 lg:px-12">
                        <div class="max-w-2xl space-y-6 lg:space-y-8">
                            <p class="text-xs text-gold-400 tracking-megawide uppercase opacity-0 animate-fade-in stagger-1">
                                The Atelier Collection
                            </p>
                            <h1 class="text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-display font-medium text-noir-50 leading-[0.9] opacity-0 animate-slide-up stagger-2">
                                Where Art
                                <span class="block text-gold-gradient">Meets Soul</span>
                            </h1>
                            <p class="text-base lg:text-lg text-noir-300 max-w-lg leading-relaxed opacity-0 animate-fade-in stagger-3">
                                Each piece in our collection is a testament to the art of fine jewelry making.
                                Handcrafted with precision and passion.
                            </p>
                            <div class="flex flex-wrap gap-4 pt-4 opacity-0 animate-fade-in stagger-4">
                                <button
                                    @click=${() => navigate('/products/all')}
                                    class="group px-8 py-4 bg-gold-400 hover:bg-gold-500 text-noir-900 font-medium tracking-wide uppercase text-sm transition-all flex items-center gap-3">
                                    Explore Collection
                                    <i data-lucide="arrow-right" class="w-4 h-4 group-hover:translate-x-1 transition-transform"></i>
                                </button>
                                <button
                                    @click=${() => navigate('/products/rings')}
                                    class="px-8 py-4 border border-noir-400 hover:border-gold-400 text-noir-100 hover:text-gold-400 font-medium tracking-wide uppercase text-sm transition-all">
                                    Shop Rings
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Scroll Indicator -->
                    <div class="absolute bottom-8 lg:bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 opacity-0 animate-fade-in stagger-5">
                        <p class="text-[10px] text-noir-500 tracking-ultrawide uppercase">Scroll to Discover</p>
                        <div class="w-px h-12 bg-gradient-to-b from-gold-400/50 to-transparent"></div>
                    </div>

                    <!-- Floating Badge -->
                    <div class="absolute bottom-8 right-6 lg:right-12 hidden lg:flex items-center gap-4 opacity-0 animate-fade-in stagger-5">
                        <div class="text-right">
                            <p class="text-[10px] text-noir-500 tracking-wide uppercase">Established</p>
                            <p class="text-lg font-display text-noir-300">2024</p>
                        </div>
                        <div class="w-px h-10 bg-noir-700"></div>
                        <div class="text-right">
                            <p class="text-[10px] text-noir-500 tracking-wide uppercase">Pieces</p>
                            <p class="text-lg font-display text-gold-400">${productsStore.getAll().length}</p>
                        </div>
                    </div>
                </section>

                <!-- Categories Section -->
                <section class="py-20 lg:py-32 border-t border-noir-800/50">
                    <div class="max-w-[1600px] mx-auto px-6 lg:px-12">
                        <div class="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12 lg:mb-16">
                            <div class="space-y-3">
                                <p class="text-xs text-gold-400 tracking-ultrawide uppercase">Browse</p>
                                <h2 class="text-3xl lg:text-5xl font-display text-noir-50">Collections</h2>
                            </div>
                            <button
                                @click=${() => navigate('/products/all')}
                                class="text-sm text-noir-400 hover:text-gold-400 tracking-wide flex items-center gap-2 transition-colors group w-fit">
                                View All Categories
                                <i data-lucide="arrow-right" class="w-4 h-4 group-hover:translate-x-1 transition-transform"></i>
                            </button>
                        </div>

                        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                            ${productCategories.map((category, index) => this.html`
                                <button
                                    @click=${() => navigate('/products/' + category.id)}
                                    class="group relative aspect-[3/4] lg:aspect-[2/3] overflow-hidden bg-noir-900 border border-noir-800 hover:border-gold-400/30 transition-all duration-500 opacity-0 animate-fade-in"
                                    style="animation-delay: ${index * 0.1}s">

                                    <img
                                        src="${getImageUrl(category.name + ' jewelry elegant minimal', 800, index + 10)}"
                                        alt="${category.name}"
                                        class="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-70 group-hover:scale-105 transition-all duration-700"
                                    />

                                    <div class="absolute inset-0 bg-gradient-to-t from-noir-950 via-noir-950/20 to-transparent"></div>

                                    <div class="absolute inset-0 flex flex-col justify-end p-5 lg:p-6">
                                        <p class="text-[10px] text-gold-400 tracking-ultrawide uppercase mb-1">0${index + 1}</p>
                                        <h3 class="text-xl lg:text-2xl font-display text-noir-50 group-hover:text-gold-400 transition-colors">${category.name}</h3>
                                        <div class="mt-3 flex items-center gap-2 text-xs text-noir-400 group-hover:text-gold-400/70 transition-colors">
                                            <span>Explore</span>
                                            <i data-lucide="arrow-right" class="w-3 h-3 group-hover:translate-x-1 transition-transform"></i>
                                        </div>
                                    </div>

                                    <!-- Corner Accent -->
                                    <div class="absolute top-0 right-0 w-12 h-12 border-t border-r border-gold-400/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                </button>
                            `)}
                        </div>
                    </div>
                </section>

                <!-- Featured Editorial -->
                <section class="py-20 lg:py-32 bg-noir-900/30 border-y border-noir-800/50">
                    <div class="max-w-[1600px] mx-auto px-6 lg:px-12">
                        <div class="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-16 lg:mb-24">
                            <div class="space-y-6">
                                <p class="text-xs text-gold-400 tracking-ultrawide uppercase">Featured</p>
                                <h2 class="text-4xl lg:text-6xl font-display text-noir-50 leading-tight">
                                    Pieces of
                                    <span class="text-gold-gradient">Distinction</span>
                                </h2>
                                <p class="text-noir-300 leading-relaxed max-w-lg">
                                    Our master artisans dedicate countless hours to perfect each piece.
                                    Every detail tells a story of craftsmanship passed down through generations.
                                </p>
                                <button
                                    @click=${() => navigate('/products/all')}
                                    class="mt-4 text-sm text-gold-400 hover:text-gold-300 tracking-wide flex items-center gap-2 transition-colors group">
                                    View Full Collection
                                    <i data-lucide="arrow-right" class="w-4 h-4 group-hover:translate-x-1 transition-transform"></i>
                                </button>
                            </div>

                            <!-- Stats -->
                            <div class="grid grid-cols-3 gap-8">
                                ${[
                                    { value: '50+', label: 'Years of Heritage' },
                                    { value: '1000+', label: 'Unique Pieces' },
                                    { value: '100%', label: 'Certified Authentic' }
                                ].map((stat, i) => this.html`
                                    <div class="text-center opacity-0 animate-fade-in" style="animation-delay: ${i * 0.1}s">
                                        <p class="text-3xl lg:text-5xl font-display text-gold-400 mb-2">${stat.value}</p>
                                        <p class="text-xs text-noir-400 tracking-wide uppercase">${stat.label}</p>
                                    </div>
                                `)}
                            </div>
                        </div>

                        <!-- Featured Products Grid -->
                        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                            ${this.featuredProducts.slice(0, 8).map((product, index) => this.renderFeaturedCard(product, index))}
                        </div>
                    </div>
                </section>

                <!-- Editorial Quote -->
                <section class="py-24 lg:py-40 relative overflow-hidden">
                    <div class="absolute inset-0 opacity-10">
                        <img
                            src="${getImageUrl('diamond texture abstract', 1500, 5)}"
                            alt=""
                            class="w-full h-full object-cover"
                        />
                    </div>
                    <div class="relative max-w-4xl mx-auto px-6 lg:px-12 text-center">
                        <div class="w-16 h-px line-gold mx-auto mb-12"></div>
                        <blockquote class="text-2xl lg:text-4xl xl:text-5xl font-display font-light text-noir-100 leading-relaxed italic">
                            "True luxury is not about possession—it's about the story each piece carries,
                            the memories it holds, and the legacy it builds."
                        </blockquote>
                        <div class="mt-12 flex items-center justify-center gap-4">
                            <div class="w-12 h-px bg-gold-400/30"></div>
                            <p class="text-sm text-gold-400 tracking-ultrawide uppercase">Auréa Philosophy</p>
                            <div class="w-12 h-px bg-gold-400/30"></div>
                        </div>
                    </div>
                </section>

                <!-- New Arrivals Horizontal Scroll -->
                <section class="py-20 lg:py-32 border-t border-noir-800/50">
                    <div class="max-w-[1600px] mx-auto">
                        <div class="px-6 lg:px-12 flex items-end justify-between gap-6 mb-10">
                            <div class="space-y-3">
                                <p class="text-xs text-gold-400 tracking-ultrawide uppercase">Just In</p>
                                <h2 class="text-3xl lg:text-5xl font-display text-noir-50">New Arrivals</h2>
                            </div>
                            <button
                                @click=${() => navigate('/products/all')}
                                class="text-sm text-noir-400 hover:text-gold-400 tracking-wide flex items-center gap-2 transition-colors group">
                                View All
                                <i data-lucide="arrow-right" class="w-4 h-4 group-hover:translate-x-1 transition-transform"></i>
                            </button>
                        </div>

                        <div class="flex gap-4 lg:gap-6 overflow-x-auto scrollbar-hide px-6 lg:px-12 pb-4">
                            ${this.newProducts.slice(0, 8).map((product, index) => this.html`
                                <div class="flex-shrink-0 w-[70vw] sm:w-72 lg:w-80">
                                    ${this.renderFeaturedCard(product, index)}
                                </div>
                            `)}
                        </div>
                    </div>
                </section>

                <!-- Trust Section -->
                <section class="py-20 lg:py-24 border-t border-noir-800/50 bg-noir-900/20">
                    <div class="max-w-[1600px] mx-auto px-6 lg:px-12">
                        <div class="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
                            ${[
                                { icon: 'gem', title: 'GIA Certified', desc: 'Every diamond authenticated' },
                                { icon: 'truck', title: 'Complimentary Shipping', desc: 'Fully insured worldwide' },
                                { icon: 'award', title: 'Master Crafted', desc: 'Handmade by artisans' },
                                { icon: 'rotate-ccw', title: '30-Day Returns', desc: 'No questions asked' }
                            ].map((item, i) => this.html`
                                <div class="text-center opacity-0 animate-fade-in" style="animation-delay: ${i * 0.1}s">
                                    <div class="inline-flex w-16 h-16 border border-gold-400/20 items-center justify-center mb-4">
                                        <i data-lucide="${item.icon}" class="w-6 h-6 text-gold-400"></i>
                                    </div>
                                    <h4 class="text-base font-display text-noir-100 mb-1">${item.title}</h4>
                                    <p class="text-xs text-noir-500">${item.desc}</p>
                                </div>
                            `)}
                        </div>
                    </div>
                </section>

                <!-- Newsletter -->
                <section class="py-20 lg:py-32 border-t border-noir-800/50">
                    <div class="max-w-2xl mx-auto px-6 lg:px-12 text-center">
                        <div class="w-16 h-16 border border-gold-400/20 flex items-center justify-center mx-auto mb-8">
                            <i data-lucide="mail" class="w-7 h-7 text-gold-400"></i>
                        </div>
                        <h3 class="text-2xl lg:text-4xl font-display text-noir-50 mb-4">Join the Circle</h3>
                        <p class="text-noir-400 mb-8 max-w-md mx-auto">
                            Receive exclusive access to new collections, private sales, and behind-the-scenes stories from our atelier.
                        </p>
                        <div class="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                            <input
                                type="email"
                                placeholder="Your email address"
                                class="flex-1 px-5 py-4 bg-noir-900 border border-noir-700 focus:border-gold-400 text-noir-100 placeholder-noir-500 text-sm outline-none transition-colors"
                            />
                            <button class="px-8 py-4 bg-gold-400 hover:bg-gold-500 text-noir-900 font-medium tracking-wide uppercase text-sm transition-colors">
                                Subscribe
                            </button>
                        </div>
                        <p class="text-[10px] text-noir-600 mt-4">By subscribing, you agree to our Privacy Policy</p>
                    </div>
                </section>

                <!-- Footer spacer for mobile nav -->
                <div class="h-24 lg:h-0"></div>
            </div>
        `;
    }
}

customElements.define('home-page', HomePage);
