/**
 * Newsletter Dark Simple - E-commerce newsletter section with centered layout
 * Features: Badge, centered text, email signup, responsive design, dark/light mode
 *
 * @element newsletter-dark-simple
 * @fires email-submit - When email form is submitted with email data
 */

import { BaseComponent } from '../../base-component.js';
import { html } from 'https://cdn.jsdelivr.net/npm/lit@3.2.1/+esm';

export class NewsletterDarkSimple extends BaseComponent {
    static properties = {
        theme: { type: String },
        email: { type: String },
        config: { type: Object }
    };

    constructor() {
        super();
        this.theme = 'dark';
        this.email = '';

        this.config = {
            badge: 'Get updated',
            title: 'Subscribe to our newsletter & get the latest deals',
            subtitle: 'Join thousands of shoppers receiving exclusive offers and early access to sales',
            emailPlaceholder: 'Enter your email address',
            buttonText: 'Subscribe now'
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

            <div class="w-full ${isDark ? 'bg-slate-900' : 'bg-slate-100'} px-2 text-center py-20 flex flex-col items-center justify-center transition-colors">
                <p class="${isDark ? 'text-indigo-400' : 'text-indigo-600'} font-medium">${this.config.badge}</p>
                <h1 class="max-w-lg font-semibold text-4xl/[44px] mt-2 ${isDark ? 'text-white' : 'text-slate-900'}">
                    ${this.config.title}
                </h1>
                <p class="mt-3 max-w-md text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}">${this.config.subtitle}</p>
                <form @submit=${(e) => this.handleEmailSubmit(e)} class="flex items-center justify-center mt-10 border ${isDark ? 'border-slate-600 focus-within:outline-indigo-500' : 'border-slate-300 focus-within:outline-indigo-600'} focus-within:outline text-sm rounded-full h-14 max-w-md w-full transition-colors">
                    <input
                        type="email"
                        .value=${this.email}
                        @input=${(e) => this.handleEmailInput(e)}
                        class="${isDark ? 'bg-transparent text-white placeholder:text-slate-500' : 'bg-white text-slate-900 placeholder:text-slate-400'} outline-none rounded-full px-4 h-full flex-1 min-w-0 transition-colors"
                        placeholder="${this.config.emailPlaceholder}"
                        required
                    />
                    <button type="submit" class="${isDark ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-indigo-600 hover:bg-indigo-700'} text-white rounded-full h-11 mr-1 px-8 flex items-center justify-center transition-colors">
                        ${this.config.buttonText}
                    </button>
                </form>
            </div>
        `;
    }
}

customElements.define('newsletter-dark-simple', NewsletterDarkSimple);
