/**
 * Newsletter Modal Simple - E-commerce newsletter modal with close button
 * Features: Image display, close button, email signup, responsive design, dark/light mode
 *
 * @element newsletter-modal-simple
 * @fires email-submit - When email form is submitted with email data
 * @fires modal-close - When close button is clicked
 */

import { BaseComponent } from '../../base-component.js';
import { html } from 'https://cdn.jsdelivr.net/npm/lit@3.2.1/+esm';

export class NewsletterModalSimple extends BaseComponent {
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
            image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=500&h=600&auto=format&fit=crop',
            title: 'Subscribe to our newsletter',
            subtitle: 'Be the first to get exclusive deals, new arrivals, seasonal sales, and special promotions delivered to your inbox!',
            emailPlaceholder: 'Your email address',
            buttonText: 'Submit'
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

    handleClose() {
        this.emit('modal-close', {});
    }

    render() {
        const isDark = this.theme === 'dark';

        return html`
            <div class="md:grid md:grid-cols-2 max-w-4xl ${isDark ? 'bg-slate-800' : 'bg-white'} mx-4 md:mx-auto rounded-xl shadow-2xl overflow-hidden transition-colors">
                <img
                    src="${this.config.image}"
                    alt="Newsletter"
                    class="hidden md:block w-full h-full object-cover rounded-l-xl"
                >
                <div class="relative flex items-center justify-center">
                    <button
                        @click=${() => this.handleClose()}
                        class="absolute top-6 right-6 ${isDark ? 'hover:bg-slate-700' : 'hover:bg-gray-100'} rounded-full p-1 transition-colors"
                        aria-label="Close"
                    >
                        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M13 2 2 13M2 2l11 11" stroke="${isDark ? '#cbd5e1' : '#1F2937'}" stroke-opacity="${isDark ? '1' : '.7'}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </button>
                    <div class="max-md:py-20 px-6 md:px-10 text-center">
                        <h1 class="text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}">
                            ${this.config.title}
                        </h1>
                        <p class="mt-4 ${isDark ? 'text-slate-300' : 'text-gray-500'}">
                            ${this.config.subtitle}
                        </p>
                        <form @submit=${(e) => this.handleEmailSubmit(e)} class="mt-8 flex">
                            <input
                                type="email"
                                .value=${this.email}
                                @input=${(e) => this.handleEmailInput(e)}
                                placeholder="${this.config.emailPlaceholder}"
                                class="w-full outline-none rounded-l-md border border-r-0 ${isDark ? 'border-slate-600 bg-slate-700 text-white placeholder:text-slate-400' : 'border-gray-300 bg-white text-gray-900 placeholder:text-gray-500'} p-4 transition-colors"
                                required
                            >
                            <button
                                type="submit"
                                class="rounded-r-md ${isDark ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-blue-600 hover:bg-blue-700'} px-7 py-2 text-white transition-colors"
                            >
                                ${this.config.buttonText}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        `;
    }
}

customElements.define('newsletter-modal-simple', NewsletterModalSimple);
