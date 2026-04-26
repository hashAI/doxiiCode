/**
 * Features Split Image - E-commerce features section with split layout
 * Features: Image on left, content on right, link, responsive design, dark/light mode
 *
 * @element features-split-image
 * @fires learn-more-click - When learn more link is clicked
 */

import { BaseComponent } from '../../base-component.js';
import { html } from 'https://cdn.jsdelivr.net/npm/lit@3.2.1/+esm';

export class FeaturesSplitImage extends BaseComponent {
    static properties = {
        theme: { type: String },
        config: { type: Object }
    };

    constructor() {
        super();
        this.theme = 'light';

        this.config = {
            intro: 'Our platform helps you shop smarter by transforming your browsing experience into personalized product discovery.',
            mainImage: 'https://images.unsplash.com/photo-1556742044-3c52d6e88c62?q=80&w=600&h=450&auto=format&fit=crop',
            featureImage: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=350&h=400&auto=format&fit=crop',
            featureTitle: 'Shop smarter with personalized recommendations and exclusive deals',
            featureDescription: 'Our intelligent shopping assistant helps you discover products you\'ll love, track price drops, and never miss a sale.',
            linkText: 'Explore all features',
            linkUrl: '#'
        };
    }

    connectedCallback() {
        super.connectedCallback();
        this._loadFonts();
        this._initLucide();
    }

    updated(changedProperties) {
        super.updated(changedProperties);
        if (changedProperties.has('theme')) {
            this._initLucide();
        }
    }

    _loadFonts() {
        if (!document.querySelector('link[href*="Poppins"]')) {
            const link = document.createElement('link');
            link.href = 'https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap';
            link.rel = 'stylesheet';
            document.head.appendChild(link);
        }
    }

    _initLucide() {
        if (window.lucide) {
            setTimeout(() => {
                window.lucide.createIcons();
            }, 0);
        } else {
            const script = document.createElement('script');
            script.src = 'https://unpkg.com/lucide@latest';
            script.onload = () => {
                setTimeout(() => {
                    window.lucide.createIcons();
                }, 0);
            };
            document.head.appendChild(script);
        }
    }

    handleLearnMoreClick(e) {
        e.preventDefault();
        this.emit('learn-more-click', { url: this.config.linkUrl });
    }

    render() {
        const isDark = this.theme === 'dark';

        return html`
            <style>
                * {
                    font-family: 'Poppins', sans-serif;
                }
            </style>

            <section class="relative mx-auto max-w-5xl px-4 py-16 ${isDark ? 'bg-slate-900' : 'bg-white'} transition-colors">
                <div class="absolute -z-50 size-[400px] -top-10 -left-20 aspect-square rounded-full ${isDark ? 'bg-indigo-900/30' : 'bg-indigo-500/30'} blur-3xl"></div>
                <p class="${isDark ? 'text-slate-300' : 'text-slate-800'} text-lg text-left max-w-3xl">
                    ${this.config.intro}
                </p>
                <div class="grid grid-cols-1 md:grid-cols-3 mt-8 gap-10">
                    <div class="md:col-span-2">
                        <img
                            alt="Features showcase"
                            src="${this.config.mainImage}"
                            class="w-full rounded-xl"
                        >
                    </div>
                    <div class="md:col-span-1">
                        <img
                            alt="Feature detail"
                            class="hover:-translate-y-0.5 transition duration-300 w-full rounded-xl"
                            src="${this.config.featureImage}"
                        >
                        <h3 class="text-[24px]/7.5 ${isDark ? 'text-white' : 'text-slate-800'} font-medium mt-6">
                            ${this.config.featureTitle}
                        </h3>
                        <p class="${isDark ? 'text-slate-400' : 'text-slate-600'} mt-2">
                            ${this.config.featureDescription}
                        </p>
                        <a
                            href="${this.config.linkUrl}"
                            @click=${(e) => this.handleLearnMoreClick(e)}
                            class="group flex items-center gap-2 mt-4 ${isDark ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-700'} transition"
                        >
                            ${this.config.linkText}
                            <i data-lucide="arrow-up-right" class="size-5 group-hover:translate-x-0.5 transition duration-300"></i>
                        </a>
                    </div>
                </div>
            </section>
        `;
    }
}

customElements.define('features-split-image', FeaturesSplitImage);
