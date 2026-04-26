/**
 * Motorcycle Landing - Bikes24 Hero Section
 * Elevate Your Riding Experience - Motorcycle landing page with hero bike showcase
 *
 * Dependencies:
 * - Google Fonts: Inter (auto-loaded from CDN)
 * - TailwindCSS (via CDN)
 */

import { BaseComponent } from '../../base-component.js';
import { html } from 'https://cdn.jsdelivr.net/npm/lit@3.2.1/+esm';

// Load Google Fonts
const loadGoogleFonts = () => {
    if (document.querySelector('link[href*="fonts.googleapis.com"][href*="Inter"]')) {
        return;
    }
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
};

export class MotorcycleLanding extends BaseComponent {
    static properties = {
        brandName: { type: String },
        heroTitle: { type: String },
        heroSubtitle: { type: String },
        ctaText: { type: String },
        heroImage: { type: String },
        bikes: { type: Array },
        navItems: { type: Array },
        contactButtonText: { type: String },
        theme: { type: String }
    };

    constructor() {
        super();
        this.theme = 'light';
        this.brandName = 'Bikes24';
        this.heroTitle = 'Elevate Your Riding Experience!';
        this.heroSubtitle = 'Experience The Thrill Of Precision Engineering – Discover Your Perfect Ride Today.';
        this.ctaText = 'Get Started';
        this.heroImage = 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=900&h=700&fit=crop';
        this.contactButtonText = 'Contact Us';
        this.navItems = [
            { label: 'Home', href: '#' },
            { label: 'Overview', href: '#' },
            { label: 'Career', href: '#' },
            { label: 'Article', href: '#' },
            { label: 'Suppport', href: '#' }
        ];
        this.bikes = [
            {
                brand: 'HONDA',
                model: 'PCX125',
                image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=400&h=300&fit=crop',
                specs: ['Top Speed:', '115 mph']
            },
            {
                brand: 'HONDA',
                model: 'ZK470',
                image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=400&h=300&fit=crop',
                specs: ['10W power', 'efficiency']
            }
        ];
    }

    connectedCallback() {
        super.connectedCallback();
        loadGoogleFonts();
        // Detect system preference for dark mode
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            this.theme = 'dark';
        }
    }

    _handleNavClick(e) {
        e.preventDefault();
        this.dispatchEvent(new CustomEvent('nav-click', {
            detail: { target: e.target.textContent, href: e.target.href },
            bubbles: true,
            composed: true
        }));
    }

    _handleContactClick(e) {
        e.preventDefault();
        this.dispatchEvent(new CustomEvent('contact-click', {
            bubbles: true,
            composed: true
        }));
    }

    _handleCTAClick(e) {
        e.preventDefault();
        this.dispatchEvent(new CustomEvent('cta-click', {
            detail: {
                action: 'get-started',
                text: this.ctaText
            },
            bubbles: true,
            composed: true
        }));
    }

    _handleBikeClick(bike) {
        this.dispatchEvent(new CustomEvent('bike-click', {
            detail: {
                brand: bike.brand,
                model: bike.model
            },
            bubbles: true,
            composed: true
        }));
    }

    render() {
        return html`
            <div class="m-0 p-0 bg-gradient-to-br from-yellow-100 via-yellow-200 to-yellow-400 dark:from-gray-800 dark:via-gray-900 dark:to-black min-h-screen" style="font-family: 'Inter', sans-serif;">
                <!-- Navigation -->
                <nav class="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
                    <div class="flex items-center gap-2">
                        <svg class="w-8 h-8 text-orange-500 dark:text-orange-400" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M13 3L4 14h7l-1 7 9-11h-7l1-7z"/>
                        </svg>
                        <span class="text-2xl font-bold text-gray-900 dark:text-white">${this.brandName}</span>
                    </div>

                    <ul class="hidden md:flex items-center gap-8 list-none">
                        ${this.navItems.map(item => html`
                            <li>
                                <a href="${item.href}"
                                   class="text-gray-900 dark:text-gray-100 font-medium no-underline hover:text-orange-500 dark:hover:text-orange-400 transition-colors"
                                   @click="${this._handleNavClick}">
                                    ${item.label}
                                </a>
                            </li>
                        `)}
                    </ul>

                    <button class="bg-orange-500 hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-700 text-white px-8 py-3 rounded-full font-semibold border-none cursor-pointer shadow-lg transition-colors"
                            @click="${this._handleContactClick}">
                        ${this.contactButtonText}
                    </button>
                </nav>

                <!-- Hero Section -->
                <main class="max-w-7xl mx-auto px-8 mt-12">
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <!-- Left Content -->
                        <div class="flex flex-col gap-8">
                            <h1 class="text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white leading-tight italic">
                                Elevate Your Riding<br>Experience!
                            </h1>

                            <p class="text-xl text-gray-800 dark:text-gray-300 max-w-xl">
                                ${this.heroSubtitle}
                            </p>

                            <button class="inline-flex items-center gap-4 bg-yellow-100 hover:bg-yellow-200 dark:bg-gray-700 dark:hover:bg-gray-600 px-8 py-4 rounded-full border-none cursor-pointer shadow-md transition-colors w-fit"
                                    @click="${this._handleCTAClick}">
                                <span class="text-gray-900 dark:text-white font-semibold text-lg">${this.ctaText}</span>
                                <div class="flex items-center gap-1">
                                    <svg class="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                                    </svg>
                                    <svg class="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                                    </svg>
                                </div>
                                <div class="bg-orange-500 dark:bg-orange-600 p-3 rounded-full flex items-center justify-center">
                                    <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
                                    </svg>
                                </div>
                            </button>

                            <!-- Bike Cards -->
                            <div class="flex gap-4 mt-8">
                                ${this.bikes.map(bike => html`
                                    <div class="bg-white/40 dark:bg-gray-800/40 backdrop-blur-sm rounded-3xl p-6 shadow-lg flex-1 max-w-xs cursor-pointer hover:shadow-xl transition-shadow"
                                         @click="${() => this._handleBikeClick(bike)}">
                                        <h3 class="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">${bike.brand}</h3>
                                        <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-4 not-italic">${bike.model}</h2>
                                        <img src="${bike.image}"
                                             alt="${bike.brand} ${bike.model}"
                                             class="w-full h-32 object-cover rounded-xl mb-3">
                                        ${bike.specs.map(spec => html`
                                            <p class="text-sm text-gray-700 dark:text-gray-300 font-medium m-0">${spec}</p>
                                        `)}
                                    </div>
                                `)}
                            </div>
                        </div>

                        <!-- Right Content - Hero Bike -->
                        <div class="relative">
                            <img src="${this.heroImage}"
                                 alt="Yellow Sports Motorcycle"
                                 class="w-full h-auto drop-shadow-2xl">

                            <!-- Smart Tracking Badge -->
                            <div class="absolute top-1/4 right-8 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl px-5 py-3 shadow-xl flex items-center gap-3">
                                <div class="bg-orange-100 dark:bg-orange-900/40 p-2 rounded-full flex items-center justify-center">
                                    <svg class="w-6 h-6 text-orange-500 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                    </svg>
                                </div>
                                <div>
                                    <p class="text-xs text-gray-600 dark:text-gray-400 font-medium m-0">Smart Tracking</p>
                                    <p class="text-2xl font-bold text-gray-900 dark:text-white m-0">24/7</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        `;
    }
}

customElements.define('motorcycle-landing', MotorcycleLanding);

