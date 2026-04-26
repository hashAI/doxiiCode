/**
 * Features Card Grid - E-commerce features section with card grid layout
 * Features: Three-column grid, images, hover effects, responsive design, dark/light mode
 *
 * @element features-card-grid
 * @fires feature-click - When a feature card is clicked with index and feature data
 */

import { BaseComponent } from '../../base-component.js';
import { html } from 'https://cdn.jsdelivr.net/npm/lit@3.2.1/+esm';

export class FeaturesCardGrid extends BaseComponent {
    static properties = {
        theme: { type: String },
        config: { type: Object }
    };

    constructor() {
        super();
        this.theme = 'light';

        this.config = {
            title: 'Powerful Features',
            subtitle: 'Everything you need to shop smarter, track orders, and discover amazing products effortlessly.',
            features: [
                {
                    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=350&h=250&auto=format&fit=crop',
                    title: 'Real-time Order Tracking',
                    description: 'Track your orders from checkout to doorstep with live updates and delivery notifications.'
                },
                {
                    image: 'https://images.unsplash.com/photo-1556742111-a301076d9d18?q=80&w=350&h=250&auto=format&fit=crop',
                    title: 'Smart Recommendations',
                    description: 'Get personalized product suggestions based on your browsing and purchase history.'
                },
                {
                    image: 'https://images.unsplash.com/photo-1556742111-a301076d9d18?q=80&w=350&h=250&auto=format&fit=crop',
                    title: 'Secure Checkout',
                    description: 'Shop with confidence using our encrypted payment system and fraud protection.'
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
                <p class="text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'} text-center mt-2 max-w-md mx-auto">
                    ${this.config.subtitle}
                </p>

                <div class="flex flex-wrap items-center justify-center gap-10 mt-16 max-w-6xl mx-auto">
                    ${this.config.features.map((feature, index) => html`
                        <div
                            @click=${() => this.handleFeatureClick(index, feature)}
                            class="max-w-80 hover:-translate-y-0.5 transition duration-300 cursor-pointer"
                        >
                            <img
                                class="rounded-xl w-full h-60 object-cover"
                                src="${feature.image}"
                                alt="${feature.title}"
                            >
                            <h3 class="text-base font-semibold ${isDark ? 'text-slate-200' : 'text-slate-700'} mt-4">
                                ${feature.title}
                            </h3>
                            <p class="text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'} mt-1">
                                ${feature.description}
                            </p>
                        </div>
                    `)}
                </div>
            </section>
        `;
    }
}

customElements.define('features-card-grid', FeaturesCardGrid);
