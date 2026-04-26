/**
 * Home Page
 * - Hero section
 * - Featured products
 * - Categories
 * - Newsletter signup
 */

import { BaseComponent } from '../components/base-component.js';
import { productsStore } from '../assets/state.js';

class PageHome extends BaseComponent {
    static properties = {
        featuredProducts: { type: Array }
    };

    constructor() {
        super();
        this.featuredProducts = [];
    }

    connectedCallback() {
        super.connectedCallback();
        this.featuredProducts = productsStore.getFeaturedProducts();
    }

    render() {
        return this.html`
            <div class="min-h-screen mb-16 md:mb-0">
                <!-- Promotional Banner -->
                <ecom-promo-banner
                    message="FLAT ₹300 OFF"
                    code="MYNTRA300"
                    bg-gradient="from-purple-600 via-pink-600 to-red-500"
                ></ecom-promo-banner>

                <!-- Hero Section - Myntra Diwali Sale Style -->
                <div class="relative overflow-hidden bg-gradient-to-br from-purple-700 via-pink-600 to-orange-500 min-h-[60vh] flex items-center">
                    <!-- Decorative Lights -->
                    <div class="absolute top-0 left-0 right-0 h-24 opacity-30">
                        <svg viewBox="0 0 1000 100" class="w-full h-full">
                            ${[...Array(20)].map((_, i) => `
                                <circle cx="${i * 50 + 25}" cy="10" r="3" fill="#FFD700"/>
                                <line x1="${i * 50 + 25}" y1="10" x2="${i * 50 + 25}" y2="30" stroke="#FFD700" stroke-width="1"/>
                            `).join('')}
                        </svg>
                    </div>

                    <div class="max-w-7xl mx-auto px-4 py-16 text-center relative z-10">
                        <!-- Myntra Logo Placeholder -->
                        <div class="mb-6">
                            <svg width="80" height="60" viewBox="0 0 53 36" class="mx-auto fill-white opacity-90">
                                <path d="M12.5 0L0 36h6.8l2.5-7.2h13.4l2.5 7.2h6.8L19.5 0h-7zm-1.3 22.4l4.3-12.4 4.3 12.4H11.2z"></path>
                            </svg>
                        </div>

                        <!-- Sale Badge -->
                        <div class="inline-block relative">
                            <div class="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-3xl p-8 shadow-2xl transform rotate-2">
                                <h1 class="text-6xl md:text-8xl font-bold text-white mb-2" style="font-family: 'Abril Fatface', serif; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);">
                                    Diwali
                                </h1>
                                <div class="text-3xl md:text-5xl font-bold text-white" style="text-shadow: 2px 2px 4px rgba(0,0,0,0.3);">
                                    Sale
                                </div>
                            </div>
                            <!-- Date Badge -->
                            <div class="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-white text-purple-700 px-6 py-2 rounded-full font-bold text-lg shadow-lg">
                                OCT 7-12
                            </div>
                        </div>

                        <p class="mt-12 text-white text-xl md:text-2xl font-semibold">
                            Up to 70% OFF + Extra ₹300 Discount
                        </p>
                    </div>

                    <!-- Decorative Pattern -->
                    <div class="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/10 to-transparent"></div>
                </div>

                <!-- Trust Badges Section -->
                <section class="relative -mt-20 z-20">
                    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div class="glass-card grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 p-6 md:p-8 rounded-3xl shadow-2xl">
                            ${this.renderTrustBadge('truck', 'Free Shipping', 'On orders $100+', 'blue')}
                            ${this.renderTrustBadge('shield-check', 'Secure Checkout', '100% Protected', 'green')}
                            ${this.renderTrustBadge('rotate-ccw', 'Easy Returns', '30-day guarantee', 'purple')}
                            ${this.renderTrustBadge('headset', '24/7 Support', 'Always here', 'orange')}
                        </div>
                    </div>
                </section>

                <!-- Featured Products Section -->
                <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                    <div class="text-center mb-12">
                        <span class="inline-block px-4 py-1 bg-primary-100 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-full text-sm font-semibold mb-4" data-aos="fade-up">
                            ⭐ Best Sellers
                        </span>
                        <h2 class="text-4xl md:text-5xl font-display font-bold mb-4 gradient-text-dark" data-aos="fade-up" data-aos-delay="50">
                            Featured Products
                        </h2>
                        <p class="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto" data-aos="fade-up" data-aos-delay="100">
                            Handpicked selection of our best sellers and customer favorites
                        </p>
                    </div>

                    <ecom-product-grid
                        data-products='${JSON.stringify(this.featuredProducts)}'
                        columns="3"
                    ></ecom-product-grid>

                    <div class="text-center mt-12" data-aos="fade-up">
                        <a
                            href="#/catalog"
                            class="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold rounded-2xl hover:shadow-2xl transition-all transform hover:scale-105"
                        >
                            <span>View All Products</span>
                            <i data-lucide="arrow-right" width="20" height="20" class="transition-transform group-hover:translate-x-1"></i>
                        </a>
                    </div>
                </section>

                <!-- Categories Section - Myntra Style -->
                <section class="relative bg-white dark:bg-gray-900 py-12">
                    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 class="text-2xl md:text-3xl font-bold mb-6 text-gray-900 dark:text-white">
                            Shop by Category
                        </h2>

                        <!-- Category Grid Component -->
                        <ecom-category-grid></ecom-category-grid>
                    </div>
                </section>

                <!-- Testimonials Section -->
                <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                    <div class="text-center mb-12">
                        <span class="inline-block px-4 py-1 bg-accent-100 dark:bg-accent-900/20 text-accent-600 dark:text-accent-400 rounded-full text-sm font-semibold mb-4" data-aos="fade-up">
                            💬 Testimonials
                        </span>
                        <h2 class="text-4xl md:text-5xl font-display font-bold mb-4 gradient-text-dark" data-aos="fade-up" data-aos-delay="50">
                            What Our Customers Say
                        </h2>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                        ${this.renderTestimonial('Amazing quality and fast shipping! Will definitely order again.', 'Sarah Johnson', 'Verified Buyer', '⭐⭐⭐⭐⭐')}
                        ${this.renderTestimonial('Best online shopping experience I\'ve ever had. Highly recommend!', 'Michael Chen', 'Verified Buyer', '⭐⭐⭐⭐⭐')}
                        ${this.renderTestimonial('Great customer service and excellent product range. Love it!', 'Emma Williams', 'Verified Buyer', '⭐⭐⭐⭐⭐')}
                    </div>
                </section>

                <!-- Newsletter Section -->
                <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                    <ecom-newsletter></ecom-newsletter>
                </section>
            </div>
        `;
    }

    renderTrustBadge(icon, title, description, color) {
        const colorClasses = {
            blue: 'from-blue-500 to-cyan-500',
            green: 'from-green-500 to-emerald-500',
            purple: 'from-purple-500 to-indigo-500',
            orange: 'from-orange-500 to-red-500'
        };

        return this.html`
            <div class="flex flex-col md:flex-row items-center gap-3 md:gap-4" data-aos="fade-up">
                <div class="w-12 h-12 bg-gradient-to-br ${colorClasses[color]} rounded-2xl flex items-center justify-center text-white shadow-lg">
                    <i data-lucide="${icon}" width="24" height="24"></i>
                </div>
                <div class="text-center md:text-left">
                    <h3 class="text-sm md:text-base font-bold text-gray-900 dark:text-white">${title}</h3>
                    <p class="text-xs md:text-sm text-gray-600 dark:text-gray-400">${description}</p>
                </div>
            </div>
        `;
    }

    renderCategoryCardModern(name, icon, gradient, count) {
        return this.html`
            <a
                href="#/catalog"
                class="group relative overflow-hidden rounded-3xl aspect-square bg-gradient-to-br ${gradient} p-6 flex flex-col items-center justify-center text-white cursor-pointer transform hover:scale-105 hover:shadow-2xl transition-all"
                data-aos="fade-up"
            >
                <div class="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors"></div>
                <div class="relative z-10 flex flex-col items-center">
                    <div class="w-16 h-16 md:w-20 md:h-20 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <i data-lucide="${icon}" width="32" height="32" class="md:w-10 md:h-10"></i>
                    </div>
                    <h3 class="text-lg md:text-xl font-bold mb-2">${name}</h3>
                    <p class="text-sm text-white/80">${count}</p>
                </div>
                <div class="absolute bottom-0 left-0 right-0 h-1 bg-white/30 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform"></div>
            </a>
        `;
    }

    renderTestimonial(quote, name, role, rating) {
        return this.html`
            <div
                class="glass-card p-6 md:p-8 rounded-3xl hover:shadow-2xl transition-all transform hover:-translate-y-2"
                data-aos="fade-up"
            >
                <div class="mb-4 text-2xl">${rating}</div>
                <p class="text-gray-700 dark:text-gray-300 mb-6 italic leading-relaxed">
                    "${quote}"
                </p>
                <div class="flex items-center gap-3">
                    <div class="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                        ${name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                        <div class="font-bold text-gray-900 dark:text-white">${name}</div>
                        <div class="text-sm text-gray-600 dark:text-gray-400">${role}</div>
                    </div>
                </div>
            </div>
        `;
    }
}

customElements.define('page-home', PageHome);
