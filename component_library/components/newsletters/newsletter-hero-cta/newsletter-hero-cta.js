/**
 * Newsletter Hero CTA - E-commerce newsletter hero section with badge and CTA
 * Features: Badge with icon, hero title, email signup, responsive design, dark/light mode
 *
 * @element newsletter-hero-cta
 * @fires email-submit - When email form is submitted with email data
 */

import { BaseComponent } from '../../base-component.js';
import { html } from 'https://cdn.jsdelivr.net/npm/lit@3.2.1/+esm';

export class NewsletterHeroCta extends BaseComponent {
    static properties = {
        theme: { type: String },
        email: { type: String },
        config: { type: Object }
    };

    constructor() {
        super();
        this.theme = 'light';
        this.email = '';

        this.config = {
            badge: {
                icon: 'zap',
                text: 'Join Our Community'
            },
            title: 'Get started for free today',
            subtitle: 'Join thousands of shoppers discovering amazing products and exclusive deals. Sign up now and get 10% off your first order!',
            emailPlaceholder: 'Enter your email',
            buttonText: 'Subscribe now'
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

    handleEmailSubmit(e) {
        e.preventDefault();
        if (this.email.trim()) {
            this.emit('email-submit', { email: this.email });
            this.email = '';
        }
    }

    handleEmailInput(e) {
        this.email = e.target.value;
    }

    render() {
        const isDark = this.theme === 'dark';

        return html`
            <style>
                * {
                    font-family: 'Poppins', sans-serif;
                }
            </style>

            <section class="flex flex-col items-center justify-center py-16 px-4 ${isDark ? 'bg-slate-900' : 'bg-white'} transition-colors">
                <div class="flex items-center gap-2 text-sm ${isDark ? 'text-indigo-400 bg-indigo-950/50' : 'text-indigo-600 bg-indigo-50'} rounded-full px-3 py-1 transition-colors">
                    <i data-lucide="${this.config.badge.icon}" class="w-4 h-4"></i>
                    <span>${this.config.badge.text}</span>
                </div>
                <h1 class="text-4xl md:text-6xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mt-4 text-center">
                    ${this.config.title}
                </h1>
                <p class="max-w-lg text-center ${isDark ? 'text-slate-300' : 'text-slate-500'} mt-6">
                    ${this.config.subtitle}
                </p>
                <form @submit=${(e) => this.handleEmailSubmit(e)} class="relative flex items-center rounded-md border ${isDark ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-white'} mt-6 text-sm max-w-md w-full transition-colors">
                    <svg class="absolute left-3" width="19" height="17" viewBox="0 0 19 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M14 6 9.505 8.865a1 1 0 0 1-1.005 0L4 6" stroke="${isDark ? '#cbd5e1' : '#90A1B9'}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M16.3 1H2.7C1.761 1 1 1.84 1 2.875v11.25C1 15.161 1.761 16 2.7 16h13.6c.939 0 1.7-.84 1.7-1.875V2.875C18 1.839 17.239 1 16.3 1" stroke="${isDark ? '#cbd5e1' : '#90A1B9'}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <input
                        type="email"
                        name="email"
                        .value=${this.email}
                        @input=${(e) => this.handleEmailInput(e)}
                        placeholder="${this.config.emailPlaceholder}"
                        class="focus:outline-none pl-10 py-5 ${isDark ? 'bg-slate-800 text-white placeholder:text-slate-500' : 'bg-transparent text-gray-900 placeholder:text-gray-500'} w-full transition-colors"
                        required
                    >
                    <button type="submit" class="shrink-0 mr-2 px-6 py-3 text-sm bg-gradient-to-r ${isDark ? 'from-indigo-600 to-indigo-800 hover:from-indigo-700 hover:to-indigo-900' : 'from-indigo-600 to-indigo-800 hover:from-indigo-700 hover:to-indigo-900'} rounded-md active:scale-95 transition duration-300 text-white">
                        ${this.config.buttonText}
                    </button>
                </form>
            </section>
        `;
    }
}

customElements.define('newsletter-hero-cta', NewsletterHeroCta);
