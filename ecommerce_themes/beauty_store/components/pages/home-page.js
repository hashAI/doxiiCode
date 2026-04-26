import { BaseComponent } from '../base-component.js';
import { productsStore, productCategories, priceBrackets, shortlistStore, cartStore } from '../../assets/state.js';
import { navigate } from '../../assets/router.js';
import { getImageUrl, showToast } from '../../assets/utils.js';

class HomePage extends BaseComponent {
    static properties = {
        featuredProducts: { type: Array },
        newProducts: { type: Array },
        activeTab: { type: String },
        shortlistIds: { type: Array },
        allProducts: { type: Array }
    };

    constructor() {
        super();
        this.featuredProducts = productsStore.getFeatured();
        this.newProducts = productsStore.getNewlyAdded();
        this.allProducts = productsStore.getAll();
        this.activeTab = 'best';
        this.shortlistIds = [];
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
            title: isAdded ? 'Removed from favorites' : 'Added to favorites',
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

    renderProductCard(product, compact = false) {
        const isSaved = this.shortlistIds.includes(product.id);
        if (compact) {
            return this.html`
                <div @click=${() => navigate(`/product/${product.id}`)} class="flex-shrink-0 w-[160px] lg:w-auto bg-white rounded-2xl shadow-card overflow-hidden touch-feedback desktop-hover cursor-pointer">
                    <div class="relative p-2 bg-gradient-to-br from-gray-50 to-white">
                        <img src="${product.image}" alt="${product.name}" class="w-full h-32 lg:h-40 object-contain">
                        ${product.badge ? this.html`
                            <div class="absolute top-2 left-2 px-2 py-0.5 rounded-full text-xs font-semibold bg-purple-600 text-white">
                                ${product.badge}
                            </div>
                        ` : ''}
                    </div>
                    <div class="px-3 pb-3 space-y-1.5">
                        <h3 class="text-sm font-bold leading-tight line-clamp-2">${product.name}</h3>
                        <div class="flex items-center gap-1 text-xs">
                            <i data-lucide="star" class="w-3 h-3 text-amber-500 fill-amber-500"></i>
                            <span class="font-semibold">${product.rating}</span>
                        </div>
                        <p class="text-lg font-black text-primary-800">$${product.price.toFixed(2)}</p>
                    </div>
                </div>
            `;
        }
        return this.html`
            <div @click=${() => navigate(`/product/${product.id}`)} class="flex-shrink-0 w-[86vw] sm:w-80 lg:w-auto bg-white rounded-3xl shadow-card overflow-hidden desktop-hover cursor-pointer">
                <div class="relative p-3 bg-gradient-to-br from-gray-50 to-white">
                    <img src="${product.image}" alt="${product.name}" class="w-full h-40 lg:h-48 object-contain">
                    <button
                        @click=${(e) => this.toggleShortlist(product, e)}
                        class="absolute top-4 right-4 w-10 h-10 rounded-full bg-white shadow-card flex items-center justify-center touch-feedback hover:scale-110 transition">
                        <i data-lucide="heart" class="w-5 h-5 ${isSaved ? 'fill-accent-500 text-accent-500' : 'text-gray-500'}"></i>
                    </button>
                    ${product.badge ? this.html`
                        <div class="absolute top-4 left-4 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-600 text-white shadow">
                            ${product.badge}
                        </div>
                    ` : ''}
                </div>
                <div class="px-4 pb-4 space-y-2">
                    <h3 class="text-lg font-bold leading-tight">${product.name}</h3>
                    <p class="text-sm text-gray-600">${product.brand}</p>
                    <div class="flex items-baseline gap-3">
                        <p class="text-2xl font-black text-primary-800">$${product.price.toFixed(2)}</p>
                        ${product.originalPrice > product.price ? this.html`<p class="text-sm font-semibold text-gray-400 line-through">$${product.originalPrice.toFixed(2)}</p>` : ''}
                    </div>
                    <div class="flex flex-wrap gap-2 text-xs text-gray-600">
                        <span class="px-3 py-1 bg-gray-100 rounded-full">${product.size}</span>
                        ${product.shade ? this.html`<span class="px-3 py-1 bg-gray-100 rounded-full">${product.shade}</span>` : ''}
                        <span class="px-3 py-1 bg-gray-100 rounded-full">${product.category}</span>
                    </div>
                    <div class="flex items-center gap-2 text-sm text-gray-700">
                        <div class="flex items-center gap-1">
                            <i data-lucide="star" class="w-4 h-4 text-amber-500 fill-amber-500"></i>
                            <span class="font-semibold">${product.rating}</span>
                            <span class="text-gray-500">(${product.reviews})</span>
                        </div>
                        ${product.certified ? this.html`
                            <span class="ml-auto inline-flex items-center gap-1 text-purple-700 text-xs font-semibold">
                                <i data-lucide="shield-check" class="w-4 h-4"></i> Certified
                            </span>
                        ` : ''}
                    </div>
                    <button
                        @click=${(e) => this.addToCart(product, e)}
                        class="w-full py-2.5 rounded-xl bg-accent-500 hover:bg-accent-600 text-white font-bold text-sm touch-feedback transition">
                        Add to Cart
                    </button>
                </div>
            </div>
        `;
    }

    render() {
        const productsToShow = this.activeTab === 'new' ? this.newProducts : this.featuredProducts;

        return this.html`
            <div class="pb-24 lg:pb-12 bg-gradient-to-b from-[#0f001b] via-[#1a0a2e] to-[#0f001b]">
                <div class="max-w-[1440px] mx-auto px-4 lg:px-8 pt-2 space-y-6 lg:space-y-10">
                    
                    <!-- Hero Banner with Personality - Desktop Enhanced -->
                    <div class="rounded-[28px] lg:rounded-[36px] overflow-hidden shadow-2xl relative">
                        <div class="absolute inset-0 bg-gradient-to-br from-[#2D0B52] via-[#4a1c7a] to-[#1a0a2e]"></div>
                        <div class="absolute inset-0 opacity-30" style="background-image: radial-gradient(circle at 30% 20%, rgba(255,182,193,0.4) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(147,112,219,0.3) 0%, transparent 50%);"></div>
                        
                        <!-- Desktop: Side by side layout -->
                        <div class="relative lg:grid lg:grid-cols-2 lg:items-center">
                            <div class="p-6 lg:p-12 space-y-4 lg:space-y-6">
                                <div class="flex items-center gap-2 text-pink-300 text-xs lg:text-sm font-bold uppercase tracking-wider">
                                    <span class="inline-block w-8 lg:w-12 h-0.5 bg-pink-400"></span>
                                    New Collection 2025
                                </div>
                                <h1 class="text-4xl lg:text-6xl xl:text-7xl font-black text-white leading-tight">
                                    Unlock Your<br/>
                                    <span class="text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-purple-300 to-pink-300">Inner Glow</span>
                                </h1>
                                <p class="text-white/70 text-sm lg:text-lg leading-relaxed max-w-md">
                                    Premium beauty products curated for your unique radiance. Because you deserve to shine ✨
                                </p>
                                <div class="flex gap-3 pt-2 lg:pt-4">
                                    <button
                                        @click=${() => navigate('/products/all')}
                                        class="flex-1 lg:flex-initial bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold py-3.5 lg:py-4 lg:px-8 rounded-2xl shadow-lg shadow-pink-500/30 touch-feedback flex items-center justify-center gap-2 hover:opacity-90 transition">
                                        <span>Shop Now</span>
                                        <i data-lucide="arrow-right" class="w-4 h-4"></i>
                                    </button>
                                    <button
                                        @click=${() => navigate('/products/skincare')}
                                        class="px-5 lg:px-6 py-3.5 lg:py-4 rounded-2xl border-2 border-white/20 text-white font-semibold touch-feedback hover:bg-white/10 transition">
                                        Skincare
                                    </button>
                                </div>
                            </div>
                            
                            <!-- Mobile: Image below content -->
                            <div class="relative h-48 lg:h-full lg:min-h-[400px] -mt-4 lg:mt-0">
                                <img src="${getImageUrl('luxury cosmetics beauty products pink', 1000, 2)}" alt="Beauty Products" class="w-full h-full object-cover lg:object-contain object-top lg:object-center">
                                <div class="absolute inset-0 bg-gradient-to-t from-[#1a0a2e] to-transparent lg:bg-gradient-to-l lg:from-transparent lg:to-[#2D0B52]/50"></div>
                            </div>
                        </div>
                    </div>

                    <!-- Flash Sale Banner -->
                    <div class="bg-gradient-to-r from-amber-500 via-orange-500 to-pink-500 rounded-2xl lg:rounded-3xl p-4 lg:p-6 flex items-center gap-4 lg:gap-6 shadow-lg relative overflow-hidden max-w-4xl lg:mx-auto">
                        <div class="absolute inset-0 opacity-20" style="background: repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 20px);"></div>
                        <div class="relative w-14 h-14 lg:w-20 lg:h-20 rounded-2xl bg-white/20 flex items-center justify-center flex-shrink-0">
                            <span class="text-3xl lg:text-5xl">🔥</span>
                        </div>
                        <div class="relative flex-1">
                            <p class="text-xs lg:text-sm font-bold text-white/80 uppercase tracking-wider">Flash Sale</p>
                            <p class="text-lg lg:text-2xl font-black text-white">Up to 40% OFF</p>
                            <p class="text-xs lg:text-sm text-white/70">Limited time only • Ends in 24h</p>
                        </div>
                        <button @click=${() => navigate('/products/all')} class="relative w-10 h-10 lg:w-14 lg:h-14 rounded-full bg-white/20 flex items-center justify-center touch-feedback hover:bg-white/30 transition">
                            <i data-lucide="chevron-right" class="w-5 h-5 lg:w-6 lg:h-6 text-white"></i>
                        </button>
                    </div>

                    <!-- Quick Categories Strip -->
                    <div class="flex gap-3 overflow-x-auto lg:overflow-visible lg:flex-wrap lg:justify-center scrollbar-hide pb-1">
                        ${productCategories.map((category, i) => this.html`
                            <button
                                @click=${() => navigate('/products/' + category.id)}
                                class="flex-shrink-0 px-4 lg:px-6 py-2.5 lg:py-3 rounded-full ${i === 0 ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white' : 'bg-white/10 text-white/80 border border-white/10 hover:bg-white/20'} font-semibold text-sm lg:text-base flex items-center gap-2 touch-feedback hover:scale-105 transition">
                                <i data-lucide="${category.icon}" class="w-4 h-4"></i>
                                ${category.name}
                            </button>
                        `)}
                    </div>

                    <!-- Featured Products -->
                    <div class="bg-white rounded-[28px] lg:rounded-[36px] shadow-card p-4 lg:p-8 space-y-4 lg:space-y-6">
                        <div class="flex items-center justify-between">
                            <div>
                                <h2 class="text-2xl lg:text-3xl font-black text-primary-900">Featured</h2>
                                <p class="text-sm lg:text-base text-gray-500">Curated picks for you</p>
                            </div>
                            <button @click=${() => navigate('/products/all')} class="text-sm lg:text-base font-semibold text-primary-600 flex items-center gap-1 hover:gap-2 transition-all">
                                View all <i data-lucide="chevron-right" class="w-4 h-4"></i>
                            </button>
                        </div>
                        <div class="bg-gradient-to-r from-primary-50 to-purple-50 rounded-2xl p-1 flex gap-1 max-w-md">
                            <button
                                @click=${() => this.activeTab = 'best'}
                                class="flex-1 py-2.5 lg:py-3 rounded-xl font-semibold text-sm lg:text-base transition ${this.activeTab === 'best' ? 'bg-white text-primary-700 shadow-sm' : 'text-primary-600 hover:bg-white/50'}">
                                ⭐ Bestsellers
                            </button>
                            <button
                                @click=${() => this.activeTab = 'new'}
                                class="flex-1 py-2.5 lg:py-3 rounded-xl font-semibold text-sm lg:text-base transition ${this.activeTab === 'new' ? 'bg-white text-primary-700 shadow-sm' : 'text-primary-600 hover:bg-white/50'}">
                                ✨ New Arrivals
                            </button>
                        </div>
                        
                        <!-- Mobile: Horizontal scroll, Desktop: Grid -->
                        <div class="flex gap-4 overflow-x-auto lg:overflow-visible lg:grid lg:grid-cols-3 xl:grid-cols-4 scrollbar-hide pb-2" style="-webkit-overflow-scrolling: touch;">
                            ${productsToShow.map(product => this.html`
                                <div @click=${() => navigate('/product/' + product.id)}>${this.renderProductCard(product)}</div>
                            `)}
                        </div>
                    </div>

                    <!-- Categories Grid -->
                    <div class="bg-white rounded-[28px] lg:rounded-[36px] shadow-card p-4 lg:p-8 space-y-4 lg:space-y-6">
                        <h3 class="text-xl lg:text-2xl font-black text-primary-900 flex items-center gap-2">
                            <span class="text-2xl lg:text-3xl">💄</span> Shop by Category
                        </h3>
                        <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
                            ${productCategories.map((category, i) => this.html`
                                <button
                                    @click=${() => navigate('/products/' + category.id)}
                                    class="p-4 lg:p-6 rounded-2xl ${category.color} border border-gray-100 flex items-center gap-3 lg:gap-4 touch-feedback hover:shadow-lg transition desktop-hover ${i === 0 ? 'col-span-2 lg:col-span-1' : ''}">
                                    <div class="w-14 h-14 lg:w-16 lg:h-16 rounded-xl bg-white flex items-center justify-center shadow-sm">
                                        <i data-lucide="${category.icon}" class="w-7 h-7 lg:w-8 lg:h-8 ${category.textColor}"></i>
                                    </div>
                                    <div class="text-left flex-1">
                                        <p class="font-bold text-primary-900 lg:text-lg">${category.name}</p>
                                        <p class="text-xs lg:text-sm text-gray-600">${i === 0 ? 'Best sellers' : i === 1 ? 'Trending now' : i === 2 ? 'Premium picks' : 'Essentials'}</p>
                                    </div>
                                    <i data-lucide="chevron-right" class="w-5 h-5 text-gray-400 hidden lg:block"></i>
                                </button>
                            `)}
                        </div>
                    </div>

                    <!-- Beauty Tips Banner -->
                    <div class="bg-gradient-to-br from-[#2D0B52] to-[#4a1c7a] rounded-[28px] lg:rounded-[36px] p-5 lg:p-10 relative overflow-hidden lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
                        <div class="absolute top-0 right-0 w-32 h-32 lg:w-64 lg:h-64 bg-pink-500/20 rounded-full blur-3xl"></div>
                        <div class="absolute bottom-0 left-0 w-24 h-24 lg:w-48 lg:h-48 bg-purple-500/20 rounded-full blur-2xl"></div>
                        <div class="relative space-y-4 lg:space-y-6">
                            <div class="flex items-center gap-2 text-pink-300 text-xs lg:text-sm font-bold uppercase tracking-wider mb-2">
                                <i data-lucide="sparkles" class="w-4 h-4"></i> Pro Tip
                            </div>
                            <h3 class="text-xl lg:text-3xl font-bold text-white">Layer Your Skincare</h3>
                            <p class="text-white/70 text-sm lg:text-base mt-2">Apply products from thinnest to thickest consistency for maximum absorption. Serum → Moisturizer → SPF</p>
                            <button class="mt-4 px-5 lg:px-6 py-2.5 lg:py-3 rounded-xl bg-white/10 border border-white/20 text-white font-semibold text-sm lg:text-base flex items-center gap-2 touch-feedback hover:bg-white/20 transition">
                                <i data-lucide="book-open" class="w-4 h-4"></i> Read More Tips
                            </button>
                        </div>
                        <div class="hidden lg:flex items-center justify-center">
                            <div class="w-64 h-64 rounded-full bg-gradient-to-br from-pink-400/20 to-purple-400/20 flex items-center justify-center">
                                <span class="text-8xl">✨</span>
                            </div>
                        </div>
                    </div>

                    <!-- Top Brands -->
                    <div class="bg-white rounded-[28px] lg:rounded-[36px] shadow-card p-4 lg:p-8 space-y-3 lg:space-y-6">
                        <h3 class="text-xl lg:text-2xl font-black text-primary-900 flex items-center gap-2">
                            <span class="text-2xl lg:text-3xl">👑</span> Top Brands
                        </h3>
                        <div class="grid grid-cols-3 lg:grid-cols-6 gap-3 lg:gap-4">
                            ${[
                                { name: 'Luxury Beauty', emoji: '💎' },
                                { name: 'GlowLab', emoji: '✨' },
                                { name: 'ColorPop', emoji: '🎨' },
                                { name: 'SkinEssence', emoji: '🌿' },
                                { name: 'LashPerfect', emoji: '👁️' },
                                { name: 'SunCare Pro', emoji: '☀️' }
                            ].map(brand => this.html`
                                <button
                                    @click=${() => navigate('/products/all')}
                                    class="p-3 lg:p-5 rounded-2xl bg-gradient-to-br from-gray-50 to-white border border-gray-100 text-center touch-feedback hover:shadow-lg transition desktop-hover">
                                    <div class="w-12 h-12 lg:w-16 lg:h-16 mx-auto rounded-xl bg-gradient-to-br from-primary-100 to-purple-100 flex items-center justify-center">
                                        <span class="text-xl lg:text-3xl">${brand.emoji}</span>
                                    </div>
                                    <p class="mt-2 text-xs lg:text-sm font-semibold text-gray-800 line-clamp-1">${brand.name}</p>
                                </button>
                            `)}
                        </div>
                    </div>

                    <!-- Best Sellers by Category -->
                    ${productCategories.slice(0, 2).map(category => this.html`
                        <div class="space-y-3 lg:space-y-4">
                            <div class="flex items-center justify-between">
                                <h3 class="text-lg lg:text-xl font-bold text-white flex items-center gap-2">
                                    <span class="w-8 h-8 lg:w-10 lg:h-10 rounded-lg bg-white/10 flex items-center justify-center">
                                        <i data-lucide="${category.icon}" class="w-4 h-4 lg:w-5 lg:h-5 text-pink-300"></i>
                                    </span>
                                    Best ${category.name}
                                </h3>
                                <button @click=${() => navigate('/products/' + category.id)} class="text-sm lg:text-base font-semibold text-pink-300 flex items-center gap-1 hover:gap-2 transition-all">
                                    View all <i data-lucide="chevron-right" class="w-4 h-4"></i>
                                </button>
                            </div>
                            <div class="flex gap-3 lg:gap-4 overflow-x-auto lg:overflow-visible lg:grid lg:grid-cols-5 scrollbar-hide pb-2">
                                ${productsStore.getByCategory(category.id).slice(0, 5).map(product => this.renderProductCard(product, true))}
                            </div>
                        </div>
                    `)}

                    <!-- Trust & Social Proof -->
                    <div class="bg-white rounded-[28px] lg:rounded-[36px] shadow-card p-5 lg:p-10 space-y-4 lg:space-y-6">
                        <h3 class="text-xl lg:text-2xl font-black text-primary-900 flex items-center gap-2">
                            <span class="text-2xl lg:text-3xl">💖</span> Why Choose Us
                        </h3>
                        <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6">
                            <div class="p-4 lg:p-6 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100 desktop-hover">
                                <div class="w-10 h-10 lg:w-14 lg:h-14 rounded-xl bg-amber-100 flex items-center justify-center mb-2 lg:mb-3">
                                    <span class="text-xl lg:text-2xl">⭐</span>
                                </div>
                                <p class="text-2xl lg:text-4xl font-black text-amber-600">4.8</p>
                                <p class="text-xs lg:text-sm text-gray-600">Average Rating</p>
                            </div>
                            <div class="p-4 lg:p-6 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 desktop-hover">
                                <div class="w-10 h-10 lg:w-14 lg:h-14 rounded-xl bg-green-100 flex items-center justify-center mb-2 lg:mb-3">
                                    <span class="text-xl lg:text-2xl">🚚</span>
                                </div>
                                <p class="text-2xl lg:text-4xl font-black text-green-600">Free</p>
                                <p class="text-xs lg:text-sm text-gray-600">Shipping Over $50</p>
                            </div>
                            <div class="p-4 lg:p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100 desktop-hover">
                                <div class="w-10 h-10 lg:w-14 lg:h-14 rounded-xl bg-purple-100 flex items-center justify-center mb-2 lg:mb-3">
                                    <span class="text-xl lg:text-2xl">✅</span>
                                </div>
                                <p class="text-2xl lg:text-4xl font-black text-purple-600">100%</p>
                                <p class="text-xs lg:text-sm text-gray-600">Authentic Products</p>
                            </div>
                            <div class="p-4 lg:p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100 desktop-hover">
                                <div class="w-10 h-10 lg:w-14 lg:h-14 rounded-xl bg-blue-100 flex items-center justify-center mb-2 lg:mb-3">
                                    <span class="text-xl lg:text-2xl">↩️</span>
                                </div>
                                <p class="text-2xl lg:text-4xl font-black text-blue-600">30 Day</p>
                                <p class="text-xs lg:text-sm text-gray-600">Easy Returns</p>
                            </div>
                        </div>
                    </div>

                    <!-- Customer Reviews -->
                    <div class="bg-gradient-to-br from-pink-50 via-white to-purple-50 rounded-[28px] lg:rounded-[36px] shadow-card p-5 lg:p-10 space-y-4 lg:space-y-6 border border-pink-100">
                        <h3 class="text-xl lg:text-2xl font-black text-primary-900 flex items-center gap-2">
                            <span class="text-2xl lg:text-3xl">💬</span> What Our Customers Say
                        </h3>
                        <div class="space-y-3 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-6">
                            ${[
                                { name: 'Sarah M.', text: 'Absolutely love BeautyHub! The products are amazing and shipping is super fast. My skin has never looked better! 💕', rating: 5 },
                                { name: 'Emily R.', text: 'Finally found my holy grail skincare routine. The recommendations are spot on!', rating: 5 },
                                { name: 'Jessica L.', text: 'Great quality products at reasonable prices. Customer service is excellent too!', rating: 5 }
                            ].map((review, i) => this.html`
                                <div class="p-4 lg:p-6 rounded-2xl bg-white border border-gray-100 shadow-sm desktop-hover">
                                    <div class="flex items-center gap-2 mb-2 lg:mb-3">
                                        <div class="w-8 h-8 lg:w-12 lg:h-12 rounded-full bg-gradient-to-br from-pink-400 to-purple-400 flex items-center justify-center text-white font-bold text-sm lg:text-lg">
                                            ${review.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p class="font-semibold text-sm lg:text-base text-gray-900">${review.name}</p>
                                            <div class="flex gap-0.5">
                                                ${[...Array(review.rating)].map(() => this.html`<i data-lucide="star" class="w-3 h-3 lg:w-4 lg:h-4 text-amber-400 fill-amber-400"></i>`)}
                                            </div>
                                        </div>
                                    </div>
                                    <p class="text-sm lg:text-base text-gray-600 leading-relaxed">${review.text}</p>
                                </div>
                            `)}
                        </div>
                    </div>

                    <!-- Newsletter Signup -->
                    <div class="bg-gradient-to-r from-[#2D0B52] via-[#4a1c7a] to-[#2D0B52] rounded-[28px] lg:rounded-[36px] p-5 lg:p-12 space-y-4 lg:space-y-6 relative overflow-hidden">
                        <div class="absolute inset-0 opacity-20" style="background-image: radial-gradient(circle at 20% 80%, rgba(255,182,193,0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(147,112,219,0.3) 0%, transparent 50%);"></div>
                        <div class="relative text-center space-y-3 lg:space-y-4 max-w-2xl mx-auto">
                            <span class="text-4xl lg:text-6xl">💌</span>
                            <h3 class="text-xl lg:text-3xl font-bold text-white">Get 15% Off Your First Order</h3>
                            <p class="text-white/70 text-sm lg:text-lg">Subscribe for exclusive deals, beauty tips & new arrivals</p>
                            <div class="flex flex-col sm:flex-row gap-2 lg:gap-3 mt-4 max-w-lg mx-auto">
                                <input type="email" placeholder="Enter your email" class="flex-1 px-4 lg:px-6 py-3 lg:py-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 text-sm lg:text-base focus:outline-none focus:ring-2 focus:ring-pink-400">
                                <button class="px-5 lg:px-8 py-3 lg:py-4 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold text-sm lg:text-base touch-feedback hover:opacity-90 transition">
                                    Subscribe
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- App Download CTA - Hide on desktop, show on mobile -->
                    <div class="bg-white rounded-[28px] shadow-card p-5 flex items-center gap-4 lg:hidden">
                        <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center flex-shrink-0">
                            <span class="text-3xl">📱</span>
                        </div>
                        <div class="flex-1">
                            <h4 class="font-bold text-primary-900">Get the App</h4>
                            <p class="text-xs text-gray-600">Shop faster with exclusive app-only deals</p>
                        </div>
                        <button class="px-4 py-2.5 rounded-xl bg-primary-600 text-white font-semibold text-sm touch-feedback">
                            Download
                        </button>
                    </div>

                    <!-- Desktop Footer Section -->
                    <div class="hidden lg:block bg-white rounded-[36px] shadow-card p-10">
                        <div class="grid grid-cols-4 gap-10">
                            <div class="space-y-4">
                                <div class="flex items-center gap-3">
                                    <div class="w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-500 text-white rounded-2xl flex items-center justify-center font-black text-xl shadow-lg shadow-pink-500/30">
                                        ✨
                                    </div>
                                    <div>
                                        <p class="text-lg font-bold text-primary-900">BeautyHub</p>
                                        <p class="text-xs text-gray-500">Glow with confidence</p>
                                    </div>
                                </div>
                                <p class="text-sm text-gray-600">Premium beauty products curated for your unique radiance.</p>
                                <div class="flex gap-3">
                                    <button class="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition">
                                        <i data-lucide="instagram" class="w-5 h-5 text-gray-600"></i>
                                    </button>
                                    <button class="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition">
                                        <i data-lucide="twitter" class="w-5 h-5 text-gray-600"></i>
                                    </button>
                                    <button class="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition">
                                        <i data-lucide="facebook" class="w-5 h-5 text-gray-600"></i>
                                    </button>
                                </div>
                            </div>
                            <div class="space-y-4">
                                <h4 class="font-bold text-primary-900">Shop</h4>
                                <ul class="space-y-2 text-sm text-gray-600">
                                    <li><a href="#" class="hover:text-primary-600 transition">Skincare</a></li>
                                    <li><a href="#" class="hover:text-primary-600 transition">Makeup</a></li>
                                    <li><a href="#" class="hover:text-primary-600 transition">Haircare</a></li>
                                    <li><a href="#" class="hover:text-primary-600 transition">Fragrance</a></li>
                                    <li><a href="#" class="hover:text-primary-600 transition">New Arrivals</a></li>
                                </ul>
                            </div>
                            <div class="space-y-4">
                                <h4 class="font-bold text-primary-900">Help</h4>
                                <ul class="space-y-2 text-sm text-gray-600">
                                    <li><a href="#" class="hover:text-primary-600 transition">Contact Us</a></li>
                                    <li><a href="#" class="hover:text-primary-600 transition">FAQ</a></li>
                                    <li><a href="#" class="hover:text-primary-600 transition">Shipping Info</a></li>
                                    <li><a href="#" class="hover:text-primary-600 transition">Returns</a></li>
                                    <li><a href="#" class="hover:text-primary-600 transition">Track Order</a></li>
                                </ul>
                            </div>
                            <div class="space-y-4">
                                <h4 class="font-bold text-primary-900">Company</h4>
                                <ul class="space-y-2 text-sm text-gray-600">
                                    <li><a href="#" class="hover:text-primary-600 transition">About Us</a></li>
                                    <li><a href="#" class="hover:text-primary-600 transition">Careers</a></li>
                                    <li><a href="#" class="hover:text-primary-600 transition">Press</a></li>
                                    <li><a href="#" class="hover:text-primary-600 transition">Privacy Policy</a></li>
                                    <li><a href="#" class="hover:text-primary-600 transition">Terms of Service</a></li>
                                </ul>
                            </div>
                        </div>
                        <div class="mt-10 pt-6 border-t border-gray-200 flex items-center justify-between text-sm text-gray-500">
                            <p>© 2025 BeautyHub. All rights reserved.</p>
                            <div class="flex items-center gap-4">
                                <img src="https://cdn-icons-png.flaticon.com/32/196/196578.png" alt="Visa" class="h-6 opacity-60">
                                <img src="https://cdn-icons-png.flaticon.com/32/196/196561.png" alt="MasterCard" class="h-6 opacity-60">
                                <img src="https://cdn-icons-png.flaticon.com/32/196/196565.png" alt="PayPal" class="h-6 opacity-60">
                                <img src="https://cdn-icons-png.flaticon.com/32/5968/5968299.png" alt="Apple Pay" class="h-6 opacity-60">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}

customElements.define('home-page', HomePage);
