/**
 * Newsletter Card Email - E-commerce newsletter card with icon and sign-in link
 * Features: Icon display, card layout, email signup, sign-in link, responsive design, dark/light mode
 *
 * @element newsletter-card-email
 * @fires email-submit - When email form is submitted with email data
 * @fires sign-in-click - When sign-in link is clicked
 */

import { BaseComponent } from '../../base-component.js';
import { html } from 'https://cdn.jsdelivr.net/npm/lit@3.2.1/+esm';

export class NewsletterCardEmail extends BaseComponent {
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
            icon: 'https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/model/faceIcon.svg',
            iconBgColor: 'red',
            title: 'Enjoying shopping with us?',
            subtitle: 'Subscribe to get exclusive deals, product updates, and personalized recommendations delivered to your inbox for free!',
            emailPlaceholder: 'Enter Your Email',
            buttonText: 'Subscribe',
            signInText: 'Already a subscriber?',
            signInLink: 'Sign In'
        };
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

    handleSignInClick(e) {
        e.preventDefault();
        this.emit('sign-in-click', {});
    }

    render() {
        const isDark = this.theme === 'dark';

        return html`
            <div class="flex flex-col items-center ${isDark ? 'bg-slate-800 text-white' : 'bg-white text-gray-900/60'} shadow-[0px_4px_25px_0px_#0000000D] rounded-xl max-w-lg md:w-full w-11/12 md:py-8 py-6 transition-colors">
                <div class="flex items-center justify-center p-3 ${isDark ? 'bg-indigo-900/50' : 'bg-red-100'} rounded-full">
                    <img src="${this.config.icon}" alt="Icon" class="w-8 h-8">
                </div>
                <h2 class="${isDark ? 'text-white' : 'text-slate-900'} font-medium mt-3 text-lg">${this.config.title}</h2>
                <p class="text-sm ${isDark ? 'text-slate-300' : 'text-slate-900/60'} mt-1 md:w-80 w-72 text-center">
                    ${this.config.subtitle}
                </p>
                <form @submit=${(e) => this.handleEmailSubmit(e)} class="flex items-center mt-5 w-full md:px-16 px-6">
                    <input
                        type="email"
                        .value=${this.email}
                        @input=${(e) => this.handleEmailInput(e)}
                        placeholder="${this.config.emailPlaceholder}"
                        class="text-sm border-r-0 outline-none border ${isDark ? 'border-slate-600 bg-slate-700 text-white placeholder:text-slate-400' : 'border-gray-500/50 bg-white text-gray-900 placeholder:text-gray-500'} pl-3 w-full h-10 rounded-l-md transition-colors"
                        required
                    >
                    <button
                        type="submit"
                        class="font-medium text-sm text-white ${isDark ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-gray-900/90 hover:bg-gray-900'} w-36 h-10 rounded-r-md transition-colors"
                    >
                        ${this.config.buttonText}
                    </button>
                </form>
                <div class="w-full h-px ${isDark ? 'bg-slate-700' : 'bg-gray-500/20'} mt-5"></div>
                <p class="text-sm mt-4 ${isDark ? 'text-slate-300' : 'text-gray-900/60'}">
                    ${this.config.signInText}
                    <a
                        href="#"
                        @click=${(e) => this.handleSignInClick(e)}
                        class="${isDark ? 'text-indigo-400 hover:text-indigo-300' : 'text-blue-500 hover:text-blue-600'} underline transition-colors"
                    >
                        ${this.config.signInLink}
                    </a>
                </p>
            </div>
        `;
    }
}

customElements.define('newsletter-card-email', NewsletterCardEmail);
