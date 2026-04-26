import { BaseComponent } from '../base-component.js';
import { productsStore, categoriesMeta, cartStore, shortlistStore } from '../../assets/state.js';
import { formatCurrency, showToast, getImageUrl } from '../../assets/utils.js';

class HomePage extends BaseComponent {
    static properties = {
        featuredProducts: { type: Array },
        categories: { type: Array }
    };

    constructor() {
        super();
        this.featuredProducts = productsStore.getFeatured();
        this.categories = Object.entries(categoriesMeta);
    }

    connectedCallback() {
        super.connectedCallback();
        // Initialize GSAP animations after render
        setTimeout(() => this.initAnimations(), 100);
    }

    initAnimations() {
        if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
            gsap.registerPlugin(ScrollTrigger);

            // Animate sections on scroll
            gsap.utils.toArray('.animate-section').forEach(section => {
                gsap.fromTo(section,
                    { opacity: 0, y: 40 },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.8,
                        ease: 'power3.out',
                        scrollTrigger: {
                            trigger: section,
                            start: 'top 85%',
                            toggleActions: 'play none none none'
                        }
                    }
                );
            });

            // Stagger product cards
            gsap.utils.toArray('.products-grid').forEach(grid => {
                const cards = grid.querySelectorAll('.product-card');
                gsap.fromTo(cards,
                    { opacity: 0, y: 30 },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.5,
                        stagger: 0.1,
                        ease: 'power2.out',
                        scrollTrigger: {
                            trigger: grid,
                            start: 'top 85%'
                        }
                    }
                );
            });
        }
    }

    addToCart(product, event) {
        event.preventDefault();
        event.stopPropagation();
        cartStore.add(product, 1);
        showToast({
            title: 'Added to cart',
            message: `${product.name} added successfully`,
            variant: 'success'
        });
    }

    toggleWishlist(product, event) {
        event.preventDefault();
        event.stopPropagation();
        shortlistStore.toggle(product);
        const isInWishlist = shortlistStore.getState().items.find(item => item.id === product.id);
        showToast({
            title: isInWishlist ? 'Added to Wishlist' : 'Removed from Wishlist',
            message: product.name,
            variant: 'info'
        });
        this.requestUpdate();
    }

    isInWishlist(productId) {
        return shortlistStore.getState().items.find(item => item.id === productId);
    }

    render() {
        return this.html`
            <div class="min-h-screen bg-gray-50 dark:bg-slate-900">
                <!-- Hero Section -->
                <section class="relative overflow-hidden bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900">
                    <!-- Background Pattern -->
                    <div class="absolute inset-0 opacity-10">
                        <div class="absolute inset-0" style="background-image: url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%2300BAB5\" fill-opacity=\"0.4\"%3E%3Ccircle cx=\"10\" cy=\"10\" r=\"2\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E');"></div>
                    </div>

                    <div class="relative container-desktop py-12 lg:py-20">
                        <div class="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
                            <!-- Content -->
                            <div class="text-center lg:text-left order-2 lg:order-1">
                                <div class="inline-flex items-center gap-2 bg-brand-500/20 text-brand-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
                                    <i data-lucide="sparkles" class="w-4 h-4"></i>
                                    <span>Lifetime Free Replacement</span>
                                </div>
                                <h1 class="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                                    Find Your
                                    <span class="text-brand-400">Perfect</span>
                                    <br>Frame Today
                                </h1>
                                <p class="text-lg text-gray-300 mb-8 max-w-lg mx-auto lg:mx-0">
                                    Experience crystal clear vision with our premium collection of eyewear. Free shipping on orders over $50.
                                </p>
                                <div class="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                                    <a href="#/products/eyeglasses" class="inline-flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-all hover:shadow-lg hover:shadow-brand-500/30">
                                        <span>Shop Eyeglasses</span>
                                        <i data-lucide="arrow-right" class="w-5 h-5"></i>
                                    </a>
                                    <a href="#/products/sunglasses" class="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-2xl font-semibold text-lg border border-white/20 transition-all">
                                        <i data-lucide="sun" class="w-5 h-5"></i>
                                        <span>Shop Sunglasses</span>
                                    </a>
                                </div>

                                <!-- Stats -->
                                <div class="flex items-center justify-center lg:justify-start gap-8 mt-12 pt-8 border-t border-white/10">
                                    <div>
                                        <p class="text-3xl font-display font-bold text-white">10M+</p>
                                        <p class="text-sm text-gray-400">Happy Customers</p>
                                    </div>
                                    <div class="w-px h-12 bg-white/20"></div>
                                    <div>
                                        <p class="text-3xl font-display font-bold text-white">5000+</p>
                                        <p class="text-sm text-gray-400">Styles Available</p>
                                    </div>
                                    <div class="w-px h-12 bg-white/20 hidden sm:block"></div>
                                    <div class="hidden sm:block">
                                        <p class="text-3xl font-display font-bold text-white">500+</p>
                                        <p class="text-sm text-gray-400">Store Locations</p>
                                    </div>
                                </div>
                            </div>

                            <!-- Hero Image -->
                            <div class="relative order-1 lg:order-2">
                                <div class="relative z-10">
                                    <img
                                        src="${getImageUrl('stylish-eyeglasses-model', 800, 0)}"
                                        alt="Stylish Eyewear"
                                        class="w-full max-w-lg mx-auto rounded-3xl shadow-2xl"
                                    >
                                </div>
                                <!-- Floating Cards -->
                                <div class="absolute -top-4 -right-4 lg:top-8 lg:-right-8 bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-xl animate-float hidden md:block">
                                    <div class="flex items-center gap-3">
                                        <div class="w-12 h-12 bg-brand-100 dark:bg-brand-900 rounded-xl flex items-center justify-center">
                                            <i data-lucide="eye" class="w-6 h-6 text-brand-500"></i>
                                        </div>
                                        <div>
                                            <p class="font-semibold text-navy-900 dark:text-white">Free Eye Test</p>
                                            <p class="text-xs text-gray-500">At any store</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="absolute -bottom-4 -left-4 lg:bottom-12 lg:-left-8 bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-xl animate-float hidden md:block" style="animation-delay: 1s;">
                                    <div class="flex items-center gap-3">
                                        <div class="w-12 h-12 bg-gold-100 dark:bg-gold-900 rounded-xl flex items-center justify-center">
                                            <i data-lucide="shield-check" class="w-6 h-6 text-gold-500"></i>
                                        </div>
                                        <div>
                                            <p class="font-semibold text-navy-900 dark:text-white">1 Year Warranty</p>
                                            <p class="text-xs text-gray-500">Free replacements</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Wave Divider -->
                    <div class="absolute bottom-0 left-0 right-0">
                        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-auto">
                            <path d="M0 120L60 110C120 100 240 80 360 75C480 70 600 80 720 85C840 90 960 90 1080 85C1200 80 1320 70 1380 65L1440 60V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" class="fill-gray-50 dark:fill-slate-900"/>
                        </svg>
                    </div>
                </section>

                <!-- Categories Section -->
                <section class="py-12 lg:py-20 animate-section">
                    <div class="container-desktop">
                        <div class="text-center mb-10 lg:mb-16">
                            <h2 class="font-display text-3xl lg:text-4xl font-bold text-navy-900 dark:text-white mb-4">Shop by Category</h2>
                            <p class="text-gray-600 dark:text-gray-400 max-w-xl mx-auto">Explore our wide range of eyewear designed for every style and need</p>
                        </div>
                        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                            ${this.categories.map(([key, cat]) => this.html`
                                <a
                                    href="#/products/${key}"
                                    class="group category-card rounded-2xl lg:rounded-3xl overflow-hidden shadow-card hover:shadow-card-hover transition-all"
                                >
                                    <div class="aspect-[4/5] lg:aspect-square bg-gray-200 dark:bg-slate-700">
                                        <img
                                            src="${cat.image}"
                                            alt="${cat.label}"
                                            class="w-full h-full object-cover"
                                        >
                                    </div>
                                    <div class="absolute inset-0 z-10 flex flex-col justify-end p-4 lg:p-6">
                                        <span class="text-2xl lg:text-3xl mb-2">${cat.emoji}</span>
                                        <h3 class="text-white font-display font-bold text-lg lg:text-xl mb-1">${cat.label}</h3>
                                        <p class="text-white/80 text-xs lg:text-sm mb-3 line-clamp-2">${cat.description}</p>
                                        <div class="flex items-center gap-2 text-brand-400 text-sm font-medium group-hover:gap-3 transition-all">
                                            <span>Explore</span>
                                            <i data-lucide="arrow-right" class="w-4 h-4"></i>
                                        </div>
                                    </div>
                                </a>
                            `)}
                        </div>
                    </div>
                </section>

                <!-- Featured Products -->
                <section class="py-12 lg:py-20 bg-white dark:bg-slate-800/50 animate-section">
                    <div class="container-desktop">
                        <div class="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-10">
                            <div>
                                <h2 class="font-display text-3xl lg:text-4xl font-bold text-navy-900 dark:text-white mb-2">Bestsellers</h2>
                                <p class="text-gray-600 dark:text-gray-400">Our most loved eyewear picks</p>
                            </div>
                            <a href="#/products/eyeglasses" class="inline-flex items-center gap-2 text-brand-500 hover:text-brand-600 font-semibold transition-colors">
                                <span>View All Products</span>
                                <i data-lucide="arrow-right" class="w-4 h-4"></i>
                            </a>
                        </div>

                        <div class="products-grid grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
                            ${this.featuredProducts.slice(0, 8).map(product => this.html`
                                <a
                                    href="#/product/${product.id}"
                                    class="product-card group bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-card"
                                >
                                    <div class="relative aspect-square bg-gray-100 dark:bg-slate-700 overflow-hidden">
                                        <img
                                            src="${product.images[0]}"
                                            alt="${product.name}"
                                            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        >
                                        ${product.discount ? this.html`
                                            <span class="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg">
                                                ${product.discount}% OFF
                                            </span>
                                        ` : ''}
                                        ${product.powered ? this.html`
                                            <span class="absolute top-3 ${product.discount ? 'left-20' : 'left-3'} bg-brand-500 text-white text-xs font-bold px-2 py-1 rounded-lg">
                                                POWERED
                                            </span>
                                        ` : ''}
                                        <button
                                            @click=${(e) => this.toggleWishlist(product, e)}
                                            class="absolute top-3 right-3 w-9 h-9 bg-white/90 dark:bg-slate-800/90 backdrop-blur rounded-full flex items-center justify-center hover:bg-white dark:hover:bg-slate-700 transition-colors shadow-sm"
                                        >
                                            <i data-lucide="heart" class="w-4 h-4 ${this.isInWishlist(product.id) ? 'fill-red-500 text-red-500' : 'text-gray-600 dark:text-gray-400'}"></i>
                                        </button>

                                        <!-- Quick Actions on Hover (Desktop) -->
                                        <div class="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity hidden lg:block">
                                            <button
                                                @click=${(e) => this.addToCart(product, e)}
                                                class="w-full bg-white text-navy-900 py-2.5 rounded-xl font-semibold text-sm hover:bg-brand-500 hover:text-white transition-colors"
                                            >
                                                Add to Cart
                                            </button>
                                        </div>
                                    </div>
                                    <div class="p-4">
                                        <h3 class="font-semibold text-sm lg:text-base text-navy-900 dark:text-white line-clamp-2 mb-2">${product.name}</h3>
                                        <div class="flex items-center gap-2 mb-2">
                                            <div class="flex items-center gap-1 text-yellow-500">
                                                <i data-lucide="star" class="w-3.5 h-3.5 fill-current"></i>
                                                <span class="text-xs font-semibold">${product.rating}</span>
                                            </div>
                                            <span class="text-xs text-gray-400">(${product.reviews.toLocaleString()})</span>
                                        </div>
                                        <div class="flex items-center gap-2">
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
                </section>

                <!-- Features Banner -->
                <section class="py-12 lg:py-16 bg-gradient-to-r from-brand-500 to-brand-600 animate-section">
                    <div class="container-desktop">
                        <div class="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                            ${[
                                { icon: 'truck', title: 'Free Delivery', desc: 'On orders above $50' },
                                { icon: 'headphones', title: '24/7 Support', desc: 'We\'re here to help' },
                                { icon: 'refresh-cw', title: '14 Day Returns', desc: 'Easy return policy' },
                                { icon: 'shield-check', title: '1 Year Warranty', desc: 'On all products' }
                            ].map(feature => this.html`
                                <div class="flex items-start gap-4 text-white">
                                    <div class="w-12 h-12 lg:w-14 lg:h-14 bg-white/20 rounded-2xl flex items-center justify-center shrink-0">
                                        <i data-lucide="${feature.icon}" class="w-6 h-6 lg:w-7 lg:h-7"></i>
                                    </div>
                                    <div>
                                        <h3 class="font-semibold text-sm lg:text-base mb-1">${feature.title}</h3>
                                        <p class="text-xs lg:text-sm text-white/80">${feature.desc}</p>
                                    </div>
                                </div>
                            `)}
                        </div>
                    </div>
                </section>

                <!-- Frame Shapes -->
                <section class="py-12 lg:py-20 animate-section">
                    <div class="container-desktop">
                        <div class="text-center mb-10">
                            <h2 class="font-display text-3xl lg:text-4xl font-bold text-navy-900 dark:text-white mb-4">Shop by Frame Shape</h2>
                            <p class="text-gray-600 dark:text-gray-400">Find the perfect shape that complements your face</p>
                        </div>
                        <div class="grid grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-6">
                            ${[
                                { shape: 'Square', image: getImageUrl('square-glasses', 300, 0) },
                                { shape: 'Rectangle', image: getImageUrl('rectangle-glasses', 300, 1) },
                                { shape: 'Aviator', image: getImageUrl('aviator-glasses', 300, 2) },
                                { shape: 'Round', image: getImageUrl('round-glasses', 300, 3) },
                                { shape: 'Cat Eye', image: getImageUrl('cat-eye-glasses', 300, 4) },
                                { shape: 'Wayfarer', image: getImageUrl('wayfarer-glasses', 300, 5) }
                            ].map(item => this.html`
                                <a
                                    href="#/products/eyeglasses?shape=${item.shape.toLowerCase().replace(' ', '-')}"
                                    class="group flex flex-col items-center gap-3 p-4 lg:p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-card hover:shadow-card-hover transition-all"
                                >
                                    <div class="w-20 h-12 lg:w-28 lg:h-16 flex items-center justify-center">
                                        <img src="${item.image}" alt="${item.shape}" class="w-full h-full object-contain group-hover:scale-110 transition-transform">
                                    </div>
                                    <span class="text-sm font-semibold text-navy-900 dark:text-white">${item.shape}</span>
                                </a>
                            `)}
                        </div>
                    </div>
                </section>

                <!-- Contact Lenses Section -->
                <section class="py-12 lg:py-20 bg-gradient-to-br from-navy-900 to-navy-800 animate-section">
                    <div class="container-desktop">
                        <div class="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
                            <div>
                                <span class="inline-block bg-brand-500/20 text-brand-400 px-4 py-2 rounded-full text-sm font-medium mb-6">Contact Lenses</span>
                                <h2 class="font-display text-3xl lg:text-4xl font-bold text-white mb-6">Crystal Clear Vision, Everyday</h2>
                                <p class="text-gray-300 mb-8">From daily disposables to monthly lenses, find the perfect fit for your lifestyle. Available in clear and colored options.</p>
                                <div class="grid grid-cols-2 gap-4 mb-8">
                                    ${[
                                        { label: 'Daily Lenses', icon: '👁️', bg: 'bg-cyan-500/20', href: '#/products/contact-lenses?type=daily' },
                                        { label: 'Monthly Lenses', icon: '📅', bg: 'bg-purple-500/20', href: '#/products/contact-lenses?type=monthly' },
                                        { label: 'Colored Lenses', icon: '🎨', bg: 'bg-pink-500/20', href: '#/products/contact-lenses?type=colored' },
                                        { label: 'Solutions', icon: '🧴', bg: 'bg-blue-500/20', href: '#/products/accessories' }
                                    ].map(item => this.html`
                                        <a href="${item.href}" class="flex items-center gap-3 ${item.bg} p-4 rounded-2xl hover:scale-105 transition-transform">
                                            <span class="text-2xl">${item.icon}</span>
                                            <span class="text-white font-medium">${item.label}</span>
                                        </a>
                                    `)}
                                </div>
                                <a href="#/products/contact-lenses" class="inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors">
                                    <span>Shop Contact Lenses</span>
                                    <i data-lucide="arrow-right" class="w-4 h-4"></i>
                                </a>
                            </div>
                            <div class="relative hidden lg:block">
                                <img src="${getImageUrl('contact-lenses-eye', 600, 0)}" alt="Contact Lenses" class="w-full rounded-3xl shadow-2xl">
                                <div class="absolute -bottom-6 -left-6 bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-xl">
                                    <div class="flex items-center gap-3">
                                        <div class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                            <i data-lucide="check" class="w-5 h-5 text-green-600"></i>
                                        </div>
                                        <div>
                                            <p class="font-semibold text-navy-900 dark:text-white">FDA Approved</p>
                                            <p class="text-xs text-gray-500">Safe & comfortable</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- Trending Section -->
                <section class="py-12 lg:py-20 animate-section">
                    <div class="container-desktop">
                        <div class="text-center mb-10">
                            <h2 class="font-display text-3xl lg:text-4xl font-bold text-navy-900 dark:text-white mb-4">#Trending Now</h2>
                            <p class="text-gray-600 dark:text-gray-400">Stay ahead with the latest eyewear trends</p>
                        </div>
                        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                            ${[
                                { title: 'Transparent Frames', gradient: 'from-gray-600 to-gray-900', image: getImageUrl('transparent-glasses', 400, 0) },
                                { title: 'Vintage Gold', gradient: 'from-amber-600 to-amber-900', image: getImageUrl('gold-vintage-glasses', 400, 1) },
                                { title: 'Blue Light Blocking', gradient: 'from-blue-600 to-indigo-900', image: getImageUrl('blue-light-glasses', 400, 2) },
                                { title: 'Sports Sunglasses', gradient: 'from-red-600 to-rose-900', image: getImageUrl('sports-sunglasses', 400, 3) }
                            ].map(item => this.html`
                                <a href="#/products/eyeglasses" class="group relative aspect-[4/5] lg:aspect-square rounded-2xl lg:rounded-3xl overflow-hidden">
                                    <img src="${item.image}" alt="${item.title}" class="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500">
                                    <div class="absolute inset-0 bg-gradient-to-t ${item.gradient} opacity-60 group-hover:opacity-70 transition-opacity"></div>
                                    <div class="absolute inset-0 flex flex-col justify-end p-4 lg:p-6">
                                        <h3 class="text-white font-display font-bold text-lg lg:text-xl">${item.title}</h3>
                                        <div class="flex items-center gap-1 text-white/80 text-sm mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <span>Shop Now</span>
                                            <i data-lucide="arrow-right" class="w-4 h-4"></i>
                                        </div>
                                    </div>
                                </a>
                            `)}
                        </div>
                    </div>
                </section>

                <!-- Newsletter -->
                <section class="py-12 lg:py-20 bg-gray-100 dark:bg-slate-800 animate-section">
                    <div class="container-desktop">
                        <div class="max-w-2xl mx-auto text-center">
                            <h2 class="font-display text-3xl lg:text-4xl font-bold text-navy-900 dark:text-white mb-4">Stay in the Loop</h2>
                            <p class="text-gray-600 dark:text-gray-400 mb-8">Subscribe for exclusive offers, new arrivals, and eyecare tips</p>
                            <form class="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" @submit=${(e) => e.preventDefault()}>
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    class="flex-1 px-5 py-4 bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 dark:text-white"
                                >
                                <button type="submit" class="bg-navy-900 dark:bg-brand-500 hover:bg-navy-800 dark:hover:bg-brand-600 text-white px-8 py-4 rounded-xl font-semibold transition-colors">
                                    Subscribe
                                </button>
                            </form>
                        </div>
                    </div>
                </section>

                <!-- Footer Spacing for Mobile -->
                <div class="h-4 lg:h-12"></div>
            </div>
        `;
    }
}

customElements.define('home-page', HomePage);
