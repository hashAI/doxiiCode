import { BaseComponent } from '../../components/base-component.js';
import { productsStore, collectionsMeta } from '../../assets/state.js';
import '../ui/product-card.js';

class HomePage extends BaseComponent {
    static properties = {
        activeCategory: { state: true }
    };

    constructor() {
        super();
        this.activeCategory = 'all';
    }

    get heroImage() {
        return 'http://194.238.23.194/epicsum/media/image/modern%20tech%20workspace?size=1200&index=0';
    }

    get categories() {
        return [
            { id: 'all', name: 'All Products', icon: 'grid-3x3' },
            { id: 'Laptops', name: 'Laptops', icon: 'laptop' },
            { id: 'Smartphones', name: 'Smartphones', icon: 'smartphone' },
            { id: 'Audio', name: 'Audio', icon: 'headphones' },
            { id: 'Wearables', name: 'Wearables', icon: 'watch' },
            { id: 'Cameras', name: 'Cameras', icon: 'camera' },
            { id: 'Gaming', name: 'Gaming', icon: 'gamepad-2' },
            { id: 'Accessories', name: 'Accessories', icon: 'cable' }
        ];
    }

    navigateToCategory(category) {
        if (category === 'all') {
            window.location.hash = '/products/all';
        } else {
            window.location.hash = `/products/all?category=${encodeURIComponent(category)}`;
        }
    }

    render() {
        const featured = productsStore.getFeaturedProducts().slice(0, 8);
        const deals = productsStore.products.filter(p => p.originalPrice).slice(0, 4);

        return this.html`
            <section class="space-y-16 md:space-y-24 pb-24">
                ${this.heroSection()}
                ${this.categorySection()}
                ${this.featuredSection(featured)}
                ${this.dealsSection(deals)}
                ${this.trustBadges()}
                ${this.newsletterSection()}
            </section>
        `;
    }

    heroSection() {
        return this.html`
            <div class="relative bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 text-white overflow-hidden">
                <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDEzNGg0djJ6bTAtNGg0djJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>

                <div class="relative mx-auto max-w-7xl px-4 py-16 md:py-24">
                    <div class="grid gap-12 lg:grid-cols-2 items-center">
                        <!-- Hero Content -->
                        <div class="space-y-6 md:space-y-8" data-aos="fade-up">
                            <div class="inline-block px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-semibold">
                                <span class="flex items-center gap-2">
                                    <i data-lucide="zap" class="w-4 h-4"></i>
                                    New Arrivals Daily
                                </span>
                            </div>

                            <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                                Premium Products for Modern Life
                            </h1>

                            <p class="text-lg md:text-xl text-white/90 max-w-xl">
                                Discover cutting-edge tech, latest gadgets, and accessories. Free shipping on orders over $99.
                            </p>

                            <div class="flex flex-col sm:flex-row gap-4">
                                <a
                                    href="#/products/all"
                                    class="px-8 py-4 bg-white text-blue-600 rounded-lg font-bold text-center hover:bg-blue-50 transition flex items-center justify-center gap-2"
                                >
                                    Shop Now
                                    <i data-lucide="arrow-right" class="w-5 h-5"></i>
                                </a>
                                <button
                                    class="px-8 py-4 border-2 border-white/30 backdrop-blur-sm rounded-lg font-bold hover:bg-white/10 transition"
                                >
                                    Browse Deals
                                </button>
                            </div>

                            <!-- Stats -->
                            <div class="grid grid-cols-3 gap-6 pt-8">
                                ${[
                                    { value: '1200+', label: 'Products' },
                                    { value: '15K+', label: 'Customers' },
                                    { value: '4.8★', label: 'Rating' }
                                ].map(stat => this.html`
                                    <div class="text-center sm:text-left">
                                        <div class="text-2xl md:text-3xl font-bold">${stat.value}</div>
                                        <div class="text-sm text-white/70">${stat.label}</div>
                                    </div>
                                `)}
                            </div>
                        </div>

                        <!-- Hero Image -->
                        <div class="relative lg:block" data-aos="fade-left">
                            <div class="relative rounded-2xl overflow-hidden shadow-2xl">
                                <img
                                    src="${this.heroImage}"
                                    alt="Premium Products"
                                    class="w-full h-[400px] md:h-[500px] object-cover"
                                >
                                <!-- Floating Badge -->
                                <div class="absolute bottom-6 left-6 right-6 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm p-4 rounded-xl shadow-xl">
                                    <div class="flex items-center justify-between">
                                        <div>
                                            <div class="text-xs font-semibold text-slate-500 uppercase">Hot Deal</div>
                                            <div class="font-bold text-lg">Up to 40% Off</div>
                                        </div>
                                        <div class="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                                            <i data-lucide="zap" class="w-6 h-6 text-white"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    categorySection() {
        return this.html`
            <div class="mx-auto max-w-7xl px-4">
                <div class="text-center mb-10">
                    <h2 class="text-3xl md:text-4xl font-bold mb-3">Shop by Category</h2>
                    <p class="text-slate-600 dark:text-slate-400">Find exactly what you need</p>
                </div>

                <!-- Desktop Grid -->
                <div class="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-4">
                    ${this.categories.filter(cat => cat.id !== 'all').map((cat, index) => this.html`
                        <button
                            class="group p-6 bg-white dark:bg-slate-800 rounded-xl border-2 border-slate-200 dark:border-slate-700 hover:border-blue-600 dark:hover:border-blue-400 transition-all hover:shadow-lg"
                            @click=${() => this.navigateToCategory(cat.id)}
                            data-aos="fade-up"
                            data-aos-delay="${index * 50}"
                        >
                            <div class="w-16 h-16 mx-auto mb-4 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                                <i data-lucide="${cat.icon}" class="w-8 h-8 text-blue-600 dark:text-blue-400"></i>
                            </div>
                            <h3 class="font-bold text-lg mb-1">${cat.name}</h3>
                            <p class="text-sm text-slate-500 dark:text-slate-400">View All</p>
                        </button>
                    `)}
                </div>

                <!-- Mobile Horizontal Scroll -->
                <div class="md:hidden flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory -mx-4 px-4 scrollbar-hide">
                    ${this.categories.filter(cat => cat.id !== 'all').map(cat => this.html`
                        <button
                            class="flex-shrink-0 snap-start w-36 p-5 bg-white dark:bg-slate-800 rounded-xl border-2 border-slate-200 dark:border-slate-700 active:scale-95 transition-transform"
                            @click=${() => this.navigateToCategory(cat.id)}
                        >
                            <div class="w-14 h-14 mx-auto mb-3 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                                <i data-lucide="${cat.icon}" class="w-7 h-7 text-blue-600 dark:text-blue-400"></i>
                            </div>
                            <h3 class="font-bold text-sm text-center">${cat.name}</h3>
                        </button>
                    `)}
                </div>
            </div>
        `;
    }

    featuredSection(products) {
        return this.html`
            <div class="mx-auto max-w-7xl px-4">
                <div class="flex items-center justify-between mb-8">
                    <div>
                        <h2 class="text-3xl md:text-4xl font-bold mb-2">Featured Products</h2>
                        <p class="text-slate-600 dark:text-slate-400">Handpicked tech essentials</p>
                    </div>
                    <a
                        href="#/products/all"
                        class="hidden sm:flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold"
                    >
                        View All
                        <i data-lucide="arrow-right" class="w-5 h-5"></i>
                    </a>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    ${products.map((product, index) => this.html`
                        <div data-aos="fade-up" data-aos-delay="${index * 50}">
                            <product-card data-product=${JSON.stringify(product)}></product-card>
                        </div>
                    `)}
                </div>

                <!-- Mobile View All Button -->
                <div class="sm:hidden mt-6">
                    <a
                        href="#/products/all"
                        class="w-full flex items-center justify-center gap-2 px-6 py-4 bg-slate-100 dark:bg-slate-800 rounded-lg font-semibold active:scale-95 transition-transform"
                    >
                        View All Products
                        <i data-lucide="arrow-right" class="w-5 h-5"></i>
                    </a>
                </div>
            </div>
        `;
    }

    dealsSection(products) {
        if (products.length === 0) return '';

        return this.html`
            <div class="bg-gradient-to-br from-red-500 to-orange-600 text-white">
                <div class="mx-auto max-w-7xl px-4 py-16 md:py-20">
                    <div class="text-center mb-10">
                        <div class="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-bold mb-4">
                            <span class="flex items-center gap-2">
                                <i data-lucide="flame" class="w-4 h-4"></i>
                                Limited Time
                            </span>
                        </div>
                        <h2 class="text-3xl md:text-4xl font-bold mb-3">Hot Deals</h2>
                        <p class="text-white/90 text-lg">Save big on premium products</p>
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        ${products.map((product, index) => {
                            const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
                            return this.html`
                                <div
                                    class="bg-white dark:bg-slate-900 rounded-xl overflow-hidden cursor-pointer hover:scale-105 transition-transform"
                                    @click=${() => window.location.hash = `/product/${product.id}`}
                                    data-aos="zoom-in"
                                    data-aos-delay="${index * 50}"
                                >
                                    <div class="relative">
                                        <img src="${product.image}" alt="${product.name}" class="w-full h-48 object-cover">
                                        <div class="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full font-bold text-sm">
                                            -${discount}%
                                        </div>
                                    </div>
                                    <div class="p-4">
                                        <h3 class="font-bold mb-2 text-slate-900 dark:text-white line-clamp-2">${product.name}</h3>
                                        <div class="flex items-baseline gap-2">
                                            <span class="text-2xl font-bold text-red-600">\$${product.price}</span>
                                            <span class="text-sm text-slate-400 line-through">\$${product.originalPrice}</span>
                                        </div>
                                    </div>
                                </div>
                            `;
                        })}
                    </div>
                </div>
            </div>
        `;
    }

    trustBadges() {
        return this.html`
            <div class="bg-slate-100 dark:bg-slate-800/50">
                <div class="mx-auto max-w-7xl px-4 py-12">
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                        ${[
                            { icon: 'truck', title: 'Free Shipping', desc: 'On orders over $99' },
                            { icon: 'shield-check', title: 'Secure Payment', desc: 'SSL encryption' },
                            { icon: 'rotate-ccw', title: '30-Day Returns', desc: 'Easy refunds' },
                            { icon: 'headphones', title: '24/7 Support', desc: 'Expert help' }
                        ].map((item, index) => this.html`
                            <div class="text-center" data-aos="fade-up" data-aos-delay="${index * 100}">
                                <div class="w-14 h-14 mx-auto mb-3 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                                    <i data-lucide="${item.icon}" class="w-7 h-7 text-blue-600 dark:text-blue-400"></i>
                                </div>
                                <h3 class="font-bold text-sm md:text-base mb-1">${item.title}</h3>
                                <p class="text-xs md:text-sm text-slate-600 dark:text-slate-400">${item.desc}</p>
                            </div>
                        `)}
                    </div>
                </div>
            </div>
        `;
    }

    newsletterSection() {
        return this.html`
            <div class="mx-auto max-w-7xl px-4">
                <div class="relative rounded-2xl bg-gradient-to-br from-blue-600 to-purple-700 text-white p-8 md:p-12 overflow-hidden">
                    <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDEzNGg0djJ6bTAtNGg0djJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>

                    <div class="relative grid md:grid-cols-2 gap-8 items-center">
                        <div>
                            <div class="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold mb-4">
                                Newsletter
                            </div>
                            <h2 class="text-3xl md:text-4xl font-bold mb-3">Get Exclusive Deals</h2>
                            <p class="text-white/90 text-lg">
                                Join 15,000+ tech enthusiasts and get early access to sales, new products, and expert tips.
                            </p>
                        </div>

                        <form class="space-y-4" @submit=${(e) => { e.preventDefault(); }}>
                            <div class="flex flex-col sm:flex-row gap-3">
                                <input
                                    type="email"
                                    class="flex-1 px-6 py-4 rounded-lg bg-white/10 backdrop-blur-sm border-2 border-white/20 focus:border-white/40 outline-none text-white placeholder:text-white/60"
                                    placeholder="Enter your email"
                                    required
                                >
                                <button
                                    type="submit"
                                    class="px-8 py-4 bg-white text-blue-600 rounded-lg font-bold hover:bg-blue-50 transition active:scale-95"
                                >
                                    Subscribe
                                </button>
                            </div>
                            <p class="text-xs text-white/70">
                                <i data-lucide="lock" class="w-3 h-3 inline"></i>
                                We respect your privacy. Unsubscribe anytime.
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        `;
    }
}

customElements.define('home-page', HomePage);
