/**
 * Hero Gradient Ecommerce - Modern hero section with gradient backgrounds
 * Inspired by: Modern SaaS/Product landing pages
 * Features: Gradient backgrounds, trust indicators, dual CTAs, badge, hero image
 *
 * @element hero-gradient-ecommerce
 * @fires cta-primary-click - When primary CTA is clicked
 * @fires cta-secondary-click - When secondary CTA is clicked
 */

import { BaseComponent } from '../../base-component.js';
import { html } from 'https://cdn.jsdelivr.net/npm/lit@3.2.1/+esm';

export class HeroGradientEcommerce extends BaseComponent {
    static properties = {
        theme: { type: String },
        config: { type: Object }
    };

    constructor() {
        super();
        this.theme = 'light';

        this.config = {
            hero: {
                badge: {
                    label: 'NEW',
                    text: 'Try our 30-day free trial with no credit card required'
                },
                title: 'Launch your online store in minutes, not months.',
                subtitle: 'Everything you need to launch, manage, and grow your online business. No technical skills required.',
                cta: {
                    primary: 'Start Free Trial',
                    secondary: 'View Pricing'
                },
                trustIndicators: [
                    'No credit card required',
                    '30 days free trial',
                    'Setup in 10 minutes'
                ],
                image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=800&fit=crop&q=80',
                background: {
                    light: 'bg-[url(\'https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/hero/bg-with-grid.png\')] bg-cover bg-center bg-no-repeat',
                    dark: ''
                }
            }
        };
    }

    connectedCallback() {
        super.connectedCallback();
        this._loadFont();
    }

    _loadFont() {
        if (!document.querySelector('link[href*="Poppins"]')) {
            const link = document.createElement('link');
            link.href = 'https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap';
            link.rel = 'stylesheet';
            document.head.appendChild(link);
        }
    }

    handlePrimaryCTA() {
        this.emit('cta-primary-click', { action: 'start-trial' });
    }

    handleSecondaryCTA() {
        this.emit('cta-secondary-click', { action: 'view-pricing' });
    }

    renderLightMode() {
        return html`
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');

                hero-gradient-ecommerce * {
                    font-family: 'Poppins', sans-serif;
                }
            </style>

            <section class="flex flex-col items-center text-sm ${this.config.hero.background.light}">
                <!-- Hero Content -->
                <main class="flex flex-col items-center max-md:px-2 w-full py-16">
                    <a href="#" class="flex items-center gap-2 border border-indigo-200 rounded-full p-1 pr-3 text-sm font-medium text-indigo-500 bg-indigo-200/20"
                       @click=${(e) => { e.preventDefault(); }}>
                        <span class="bg-indigo-600 text-white text-xs px-3 py-1 rounded-full">
                            ${this.config.hero.badge.label}
                        </span>
                        <p class="flex items-center gap-1">
                            <span>${this.config.hero.badge.text}</span>
                            <svg class="mt-1" width="6" height="9" viewBox="0 0 6 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="m1 1 4 3.5L1 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                        </p>
                    </a>

                    <h1 class="text-center text-5xl leading-[68px] md:text-6xl md:leading-[80px] font-semibold max-w-4xl text-slate-900 mt-6">
                        ${this.config.hero.title}
                    </h1>
                    <p class="text-center text-base text-slate-700 max-w-lg mt-4">
                        ${this.config.hero.subtitle}
                    </p>
                    <div class="flex flex-col sm:flex-row items-center gap-4 mt-8">
                        <button class="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white active:scale-95 rounded-lg px-7 h-11 transition-all"
                                @click=${() => this.handlePrimaryCTA()}>
                            ${this.config.hero.cta.primary}
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M4.166 10h11.667m0 0L9.999 4.165m5.834 5.833-5.834 5.834" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </button>
                        <button class="border border-slate-600 active:scale-95 hover:bg-white/10 transition text-slate-600 rounded-lg px-8 h-11"
                                @click=${() => this.handleSecondaryCTA()}>
                            ${this.config.hero.cta.secondary}
                        </button>
                    </div>

                    <!-- Trust Indicators -->
                    <div class="flex flex-wrap justify-center items-center gap-4 md:gap-8 mt-8">
                        ${this.config.hero.trustIndicators.map(indicator => html`
                            <p class="flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-indigo-600">
                                    <path d="M20 6 9 17l-5-5"/>
                                </svg>
                                <span class="text-slate-600">${indicator}</span>
                            </p>
                        `)}
                    </div>

                    <img src="${this.config.hero.image}"
                        class="w-full rounded-[15px] max-w-4xl mt-16 mb-16 shadow-2xl"
                        alt="E-commerce dashboard showcase"
                    />
                </main>
            </section>
        `;
    }

    renderDarkMode() {
        return html`
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');

                hero-gradient-ecommerce * {
                    font-family: 'Poppins', sans-serif;
                }
            </style>

            <section class="flex flex-col items-center text-sm bg-slate-900">
                <!-- Hero Content -->
                <main class="flex flex-col items-center max-md:px-2 w-full py-16">
                    <a href="#" class="flex items-center gap-2 border border-purple-500/30 rounded-full p-1 pr-3 text-sm font-medium text-purple-300 bg-purple-500/10"
                       @click=${(e) => { e.preventDefault(); }}>
                        <span class="bg-purple-600 text-white text-xs px-3 py-1 rounded-full">
                            ${this.config.hero.badge.label}
                        </span>
                        <p class="flex items-center gap-1">
                            <span>${this.config.hero.badge.text}</span>
                            <svg class="mt-1" width="6" height="9" viewBox="0 0 6 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="m1 1 4 3.5L1 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                        </p>
                    </a>

                    <h1 class="text-center text-5xl leading-[68px] md:text-6xl md:leading-[80px] font-semibold max-w-4xl text-white mt-6">
                        ${this.config.hero.title}
                    </h1>
                    <p class="text-center text-base text-slate-300 max-w-lg mt-4">
                        ${this.config.hero.subtitle}
                    </p>
                    <div class="flex flex-col sm:flex-row items-center gap-4 mt-8">
                        <button class="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white active:scale-95 rounded-lg px-7 h-11 transition-all"
                                @click=${() => this.handlePrimaryCTA()}>
                            ${this.config.hero.cta.primary}
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M4.166 10h11.667m0 0L9.999 4.165m5.834 5.833-5.834 5.834" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </button>
                        <button class="border border-purple-600 active:scale-95 hover:bg-purple-900/30 transition text-purple-300 rounded-lg px-8 h-11"
                                @click=${() => this.handleSecondaryCTA()}>
                            ${this.config.hero.cta.secondary}
                        </button>
                    </div>

                    <!-- Trust Indicators -->
                    <div class="flex flex-wrap justify-center items-center gap-4 md:gap-8 mt-8">
                        ${this.config.hero.trustIndicators.map(indicator => html`
                            <p class="flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-purple-400">
                                    <path d="M20 6 9 17l-5-5"/>
                                </svg>
                                <span class="text-slate-400">${indicator}</span>
                            </p>
                        `)}
                    </div>

                    <img src="${this.config.hero.image}"
                        class="w-full rounded-[15px] max-w-4xl mt-16 mb-16 shadow-2xl"
                        alt="E-commerce dashboard showcase"
                    />
                </main>
            </section>
        `;
    }

    render() {
        return this.theme === 'light' ? this.renderLightMode() : this.renderDarkMode();
    }
}

customElements.define('hero-gradient-ecommerce', HeroGradientEcommerce);
