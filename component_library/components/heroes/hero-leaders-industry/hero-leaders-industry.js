/**
 * Hero Leaders Industry - E-commerce hero section for industry leaders
 * Features: Announcement badge, dual CTAs, leader photos in grid, gradient background
 *
 * @element hero-leaders-industry
 * @fires cta-primary-click - When primary CTA (Read Success Stories) is clicked
 * @fires cta-secondary-click - When secondary CTA (Get Started) is clicked
 */

import { BaseComponent } from '../../base-component.js';
import { html } from 'https://cdn.jsdelivr.net/npm/lit@3.2.1/+esm';

export class HeroLeadersIndustry extends BaseComponent {
    static properties = {
        theme: { type: String },
        config: { type: Object }
    };

    constructor() {
        super();
        this.theme = 'light';

        this.config = {
            badge: {
                text: 'Explore how we help grow brands.',
                icon: 'arrow-right'
            },
            title: 'Preferred choice of shoppers in',
            titleHighlight: 'every category',
            subtitle: 'Learn why professionals trust our marketplace to complete their shopping journey.',
            cta: {
                primary: 'Browse Products',
                secondary: 'Get Started'
            },
            images: [
                'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=735&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=687&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=687&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=687&auto=format&fit=crop'
            ]
        };
    }

    connectedCallback() {
        super.connectedCallback();
        this._initLucide();
        this._loadFont();
    }

    updated(changedProperties) {
        super.updated(changedProperties);
        if (changedProperties.has('theme')) {
            this._initLucide();
        }
    }

    _loadFont() {
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

    handlePrimaryCtaClick() {
        this.emit('cta-primary-click', {});
    }

    handleSecondaryCtaClick() {
        this.emit('cta-secondary-click', {});
    }

    render() {
        const isDark = this.theme === 'dark';
        
        return html`
            <style>
                * {
                    font-family: 'Poppins', sans-serif;
                }
            </style>
            
            <section class="h-full ${isDark ? 'bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-b from-[#F5F7FF] via-[#fffbee] to-[#E6EFFF]'}">
                <!-- Main Content -->
                <main class="flex flex-col md:flex-row items-center max-md:text-center justify-between pt-16 pb-16 px-6 sm:px-10 md:px-24 max-w-7xl mx-auto w-full">
                    <!-- Text Content -->
                    <div class="flex flex-col items-center md:items-start">
                        <!-- Announcement Badge -->
                        <button
                            @click=${(e) => e.preventDefault()}
                            class="mb-6 flex items-center space-x-2 border ${isDark ? 'border-indigo-500 text-indigo-400' : 'border-indigo-600 text-indigo-600'} text-xs rounded-full px-4 pr-1.5 py-1.5 ${isDark ? 'hover:bg-indigo-900/30' : 'hover:bg-indigo-50'} transition"
                            type="button"
                        >
                            <span>${this.config.badge.text}</span>
                            <span class="flex items-center justify-center size-6 p-1 rounded-full ${isDark ? 'bg-indigo-600' : 'bg-indigo-600'}">
                                <i data-lucide="${this.config.badge.icon}" class="w-3 h-3 text-white"></i>
                            </span>
                        </button>

                        <!-- Title -->
                        <h1 class="${isDark ? 'text-white' : 'text-gray-900'} font-semibold text-3xl sm:text-4xl md:text-5xl max-w-xl">
                            ${this.config.title}
                            <span class="${isDark ? 'text-indigo-400' : 'text-indigo-600'}">
                                ${this.config.titleHighlight}
                            </span>
                        </h1>

                        <!-- Subtitle -->
                        <p class="mt-4 ${isDark ? 'text-slate-300' : 'text-gray-600'} max-w-md text-sm sm:text-base leading-relaxed">
                            ${this.config.subtitle}
                        </p>

                        <!-- CTA Buttons -->
                        <div class="flex flex-col md:flex-row items-center mt-8 gap-3">
                            <button
                                @click=${() => this.handlePrimaryCtaClick()}
                                class="bg-indigo-600 text-white px-6 pr-2.5 py-2.5 rounded-full text-sm font-medium flex items-center space-x-2 hover:bg-indigo-700 transition"
                                type="button"
                            >
                                <span>${this.config.cta.primary}</span>
                                <i data-lucide="arrow-right" class="w-5 h-5"></i>
                            </button>
                            <button
                                @click=${() => this.handleSecondaryCtaClick()}
                                class="${isDark ? 'text-indigo-400 bg-indigo-900/30 hover:bg-indigo-900/50' : 'text-indigo-600 bg-indigo-100 hover:bg-indigo-200'} px-5 py-2 rounded-full text-sm font-medium transition"
                            >
                                ${this.config.cta.secondary}
                            </button>
                        </div>
                    </div>

                    <!-- Photos Grid -->
                    <div aria-label="Product showcase" class="mt-12 grid grid-cols-2 gap-6 pb-6">
                        ${this.config.images.map(url => html`
                            <img
                                alt="Product showcase"
                                class="w-36 h-44 rounded-lg hover:scale-105 transition duration-300 object-cover flex-shrink-0 shadow-lg"
                                src="${url}"
                            />
                        `)}
                    </div>
                </main>
            </section>
        `;
    }
}

customElements.define('hero-leaders-industry', HeroLeadersIndustry);

