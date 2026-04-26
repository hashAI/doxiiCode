/**
 * About Grid Features - E-commerce about section with grid layout
 * Features: Three-column grid, icons, responsive design, dark/light mode
 *
 * @element about-grid-features
 * @fires feature-click - When a feature item is clicked with index and feature data
 */

import { BaseComponent } from '../../base-component.js';
import { html } from 'https://cdn.jsdelivr.net/npm/lit@3.2.1/+esm';

export class AboutGridFeatures extends BaseComponent {
    static properties = {
        theme: { type: String },
        config: { type: Object }
    };

    constructor() {
        super();
        this.theme = 'light';

        this.config = {
            title: 'About our platform',
            subtitle: 'A comprehensive collection of features designed to enhance your shopping experience - each crafted with care, innovation and style.',
            features: [
                {
                    icon: 'https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/aboutSection/flashEmoji.png',
                    title: 'Lightning-Fast Checkout',
                    description: 'Complete your purchase in seconds with our streamlined checkout process and saved payment methods.'
                },
                {
                    icon: 'https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/aboutSection/colorsEmoji.png',
                    title: 'Beautiful Product Displays',
                    description: 'High-resolution images, 360° views, and detailed specifications for every product.'
                },
                {
                    icon: 'https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/aboutSection/puzzelEmoji.png',
                    title: 'Seamless Integration',
                    description: 'Connect with your favorite payment methods, shipping providers, and loyalty programs effortlessly.'
                }
            ]
        };
    }

    connectedCallback() {
        super.connectedCallback();
        this._loadFonts();
    }

    _loadFonts() {
        if (!document.querySelector('link[href*="Poppins"]')) {
            const link = document.createElement('link');
            link.href = 'https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap';
            link.rel = 'stylesheet';
            document.head.appendChild(link);
        }
    }

    handleFeatureClick(index, feature) {
        this.emit('feature-click', { index, feature });
    }

    render() {
        const isDark = this.theme === 'dark';

        return html`
            <style>
                * {
                    font-family: 'Poppins', sans-serif;
                }
            </style>

            <section class="py-16 px-4 ${isDark ? 'bg-slate-900' : 'bg-white'} transition-colors">
                <h1 class="text-3xl font-semibold text-center mx-auto ${isDark ? 'text-white' : 'text-gray-900'}">
                    ${this.config.title}
                </h1>
                <p class="text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'} text-center mt-2 max-w-lg mx-auto">
                    ${this.config.subtitle}
                </p>
                <div class="relative max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 px-8 md:px-0 pt-20 gap-y-10 md:gap-y-0">
                    <div class="size-[520px] -top-80 left-1/2 -translate-x-1/2 rounded-full absolute blur-[300px] -z-10 ${isDark ? 'bg-indigo-900/30' : 'bg-[#FBFFE1]'}"></div>
                    ${this.config.features.map((feature, index) => html`
                        <div
                            @click=${() => this.handleFeatureClick(index, feature)}
                            class="py-10 ${index < this.config.features.length - 1 ? 'border-b md:border-b-0' : ''} ${index < 2 ? 'md:border-r' : ''} ${isDark ? 'border-slate-700' : 'border-slate-200'} md:px-10 cursor-pointer hover:scale-105 transition-transform duration-300"
                        >
                            <div class="size-10 p-2 ${isDark ? 'bg-indigo-900/50 border-indigo-700' : 'bg-indigo-50 border-indigo-200'} border rounded transition-colors">
                                <img src="${feature.icon}" alt="${feature.title}">
                            </div>
                            <div class="mt-5 space-y-2">
                                <h3 class="text-base font-medium ${isDark ? 'text-slate-200' : 'text-slate-600'}">
                                    ${feature.title}
                                </h3>
                                <p class="text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}">
                                    ${feature.description}
                                </p>
                            </div>
                        </div>
                    `)}
                </div>
            </section>
        `;
    }
}

customElements.define('about-grid-features', AboutGridFeatures);
