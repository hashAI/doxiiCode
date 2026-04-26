/**
 * Hero Component
 * - Main hero section for homepage
 * - Customizable title, subtitle, CTA
 */

import { BaseComponent } from './base-component.js';
import { navigate } from '../assets/router.js';

class EcomHero extends BaseComponent {
    static properties = {
        title: { type: String },
        subtitle: { type: String },
        ctaText: { type: String },
        ctaLink: { type: String },
        backgroundImage: { type: String }
    };

    constructor() {
        super();
        this.title = 'Welcome to DOXII Store';
        this.subtitle = 'Discover amazing products at unbeatable prices';
        this.ctaText = 'Shop Now';
        this.ctaLink = '/catalog';
        this.backgroundImage = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&h=800&fit=crop';
    }

    handleCtaClick() {
        navigate(this.ctaLink);
    }

    render() {
        return this.html`
            <section class="relative min-h-[70vh] md:min-h-[75vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
                <!-- Subtle Background Pattern -->
                <div class="absolute inset-0 opacity-5 dark:opacity-10">
                    <svg class="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <pattern id="dots" width="20" height="20" patternUnits="userSpaceOnUse">
                                <circle cx="2" cy="2" r="1" fill="currentColor"/>
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#dots)" />
                    </svg>
                </div>

                <!-- Content -->
                <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <!-- Badge -->
                    <div
                        class="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-full text-sm font-medium mb-6 shadow-sm border border-gray-200 dark:border-gray-700"
                        data-aos="fade-down"
                    >
                        <span class="w-2 h-2 bg-green-500 rounded-full"></span>
                        <span class="text-gray-700 dark:text-gray-300">New Collection Available</span>
                    </div>

                    <!-- Main Heading -->
                    <h1
                        class="text-5xl sm:text-6xl md:text-7xl font-bold mb-6 text-gray-900 dark:text-white leading-tight"
                        data-aos="fade-up"
                        data-aos-delay="100"
                    >
                        Discover Your <br/>
                        <span class="text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300">
                            Perfect Style
                        </span>
                    </h1>

                    <!-- Subtitle -->
                    <p
                        class="text-lg md:text-xl mb-10 max-w-2xl mx-auto text-gray-600 dark:text-gray-400"
                        data-aos="fade-up"
                        data-aos-delay="200"
                    >
                        Shop the latest trends in fashion, electronics, and lifestyle products
                    </p>

                    <!-- CTA Buttons -->
                    <div
                        class="flex flex-col sm:flex-row items-center justify-center gap-4"
                        data-aos="fade-up"
                        data-aos-delay="300"
                    >
                        <button
                            @click="${this.handleCtaClick}"
                            class="group inline-flex items-center gap-2 px-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-semibold rounded-xl transition-all hover:scale-105 hover:shadow-lg"
                        >
                            <span>Shop Now</span>
                            <i data-lucide="arrow-right" width="20" height="20" class="transition-transform group-hover:translate-x-1"></i>
                        </button>
                        <button
                            @click="${() => navigate('/catalog')}"
                            class="inline-flex items-center gap-2 px-8 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-semibold rounded-xl border-2 border-gray-300 dark:border-gray-700 transition-all hover:border-gray-400 dark:hover:border-gray-600"
                        >
                            <span>Browse Catalog</span>
                        </button>
                    </div>

                    <!-- Stats -->
                    <div
                        class="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto"
                        data-aos="fade-up"
                        data-aos-delay="400"
                    >
                        <div class="text-center">
                            <div class="text-3xl md:text-4xl font-bold mb-1 text-gray-900 dark:text-white">10K+</div>
                            <div class="text-sm text-gray-600 dark:text-gray-400">Customers</div>
                        </div>
                        <div class="text-center border-x border-gray-300 dark:border-gray-700">
                            <div class="text-3xl md:text-4xl font-bold mb-1 text-gray-900 dark:text-white">500+</div>
                            <div class="text-sm text-gray-600 dark:text-gray-400">Products</div>
                        </div>
                        <div class="text-center">
                            <div class="text-3xl md:text-4xl font-bold mb-1 text-gray-900 dark:text-white">4.9★</div>
                            <div class="text-sm text-gray-600 dark:text-gray-400">Rating</div>
                        </div>
                    </div>
                </div>
            </section>
        `;
    }
}

customElements.define('ecom-hero', EcomHero);
