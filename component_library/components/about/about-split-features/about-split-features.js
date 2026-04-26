/**
 * About Split Features - E-commerce about section with split layout
 * Features: Image on left, feature list on right, responsive design, dark/light mode
 *
 * @element about-split-features
 * @fires feature-click - When a feature item is clicked with index and feature data
 */

import { BaseComponent } from '../../base-component.js';
import { html } from 'https://cdn.jsdelivr.net/npm/lit@3.2.1/+esm';

export class AboutSplitFeatures extends BaseComponent {
    static properties = {
        theme: { type: String },
        config: { type: Object }
    };

    constructor() {
        super();
        this.theme = 'light';

        this.config = {
            title: 'Our Latest features',
            subtitle: 'Experience seamless shopping with cutting-edge features - Personalized recommendations, secure payments, and lightning-fast delivery.',
            image: 'https://images.unsplash.com/photo-1555212697-194d092e3b8f?q=80&w=400&h=500&auto=format&fit=crop',
            features: [
                {
                    icon: 'https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/aboutSection/flashEmoji.png',
                    title: 'Lightning-Fast Checkout',
                    description: 'Complete your purchase in seconds with our streamlined one-click checkout process.'
                },
                {
                    icon: 'https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/aboutSection/colorsEmoji.png',
                    title: 'Beautiful Product Displays',
                    description: 'High-resolution images and interactive 360° product views for confident shopping.'
                },
                {
                    icon: 'https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/aboutSection/puzzelEmoji.png',
                    title: 'Seamless Integration',
                    description: 'Works with all major payment providers, shipping carriers, and loyalty programs.'
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

            <section class="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-center gap-8 px-4 md:px-0 py-16 ${isDark ? 'bg-slate-900' : 'bg-white'} transition-colors">
                <div class="size-[520px] rounded-full absolute blur-[300px] -z-10 ${isDark ? 'bg-indigo-900/30' : 'bg-[#FBFFE1]'}"></div>
                <img
                    class="max-w-sm w-full rounded-xl h-auto"
                    src="${this.config.image}"
                    alt="About our platform"
                />
                <div>
                    <h1 class="text-3xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}">
                        ${this.config.title}
                    </h1>
                    <p class="text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'} mt-2">
                        ${this.config.subtitle}
                    </p>

                    <div class="flex flex-col gap-10 mt-6">
                        ${this.config.features.map((feature, index) => html`
                            <div
                                @click=${() => this.handleFeatureClick(index, feature)}
                                class="flex items-center gap-4 cursor-pointer hover:scale-105 transition-transform duration-300"
                            >
                                <div class="size-9 p-2 ${isDark ? 'bg-indigo-900/50 border-indigo-700' : 'bg-indigo-50 border-indigo-200'} border rounded shrink-0 transition-colors">
                                    <img src="${feature.icon}" alt="${feature.title}">
                                </div>
                                <div>
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
                </div>
            </section>
        `;
    }
}

customElements.define('about-split-features', AboutSplitFeatures);
