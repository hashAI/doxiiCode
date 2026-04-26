/**
 * Features Trusted Brands - E-commerce features section showcasing trusted brands
 * Features: Brand images, hover effects, responsive design, dark/light mode
 *
 * @element features-trusted-brands
 * @fires brand-click - When a brand image is clicked with index and brand data
 */

import { BaseComponent } from '../../base-component.js';
import { html } from 'https://cdn.jsdelivr.net/npm/lit@3.2.1/+esm';

export class FeaturesTrustedBrands extends BaseComponent {
    static properties = {
        theme: { type: String },
        config: { type: Object }
    };

    constructor() {
        super();
        this.theme = 'light';

        this.config = {
            title: 'Trusted by leading brands worldwide.',
            subtitle: 'Join thousands of businesses that power their sales with our platform',
            brands: [
                {
                    image: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?q=80&w=400&h=300&auto=format&fit=crop',
                    name: 'Brand 1',
                    url: '#'
                },
                {
                    image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=600&h=400&auto=format&fit=crop',
                    name: 'Brand 2',
                    url: '#'
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

    handleBrandClick(index, brand) {
        this.emit('brand-click', { index, brand });
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
                <div class="max-md:px-4 max-w-6xl mx-auto">
                    <p class="${isDark ? 'bg-gradient-to-r from-slate-200 to-slate-400' : 'bg-gradient-to-r from-slate-800 to-[#4D6EA3]'} text-transparent bg-clip-text text-3xl text-left max-w-2xl font-semibold">
                        ${this.config.title}
                    </p>
                    <p class="${isDark ? 'text-slate-400' : 'text-slate-600'} mt-2 text-sm max-w-xl">
                        ${this.config.subtitle}
                    </p>
                    <div class="flex flex-col-reverse md:flex-row items-center justify-center max-h-[450px] gap-6 mt-6">
                        ${this.config.brands.map((brand, index) => html`
                            <img
                                src="${brand.image}"
                                alt="${brand.name}"
                                @click=${() => this.handleBrandClick(index, brand)}
                                class="hover:-translate-y-1 transition-all duration-300 cursor-pointer rounded-xl w-full md:max-w-md ${index === 0 ? 'md:max-h-80' : 'max-md:w-full'}"
                            >
                        `)}
                    </div>
                </div>
            </section>
        `;
    }
}

customElements.define('features-trusted-brands', FeaturesTrustedBrands);
