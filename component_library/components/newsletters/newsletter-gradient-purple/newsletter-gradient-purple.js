/**
 * Newsletter Gradient Purple - E-commerce newsletter section with gradient background
 * Features: Star ratings, reviews count, email signup, responsive design, dark/light mode
 *
 * @element newsletter-gradient-purple
 * @fires email-submit - When email form is submitted with email data
 */

import { BaseComponent } from '../../base-component.js';
import { html } from 'https://cdn.jsdelivr.net/npm/lit@3.2.1/+esm';

export class NewsletterGradientPurple extends BaseComponent {
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
            trustBadge: {
                text: 'Trusted by 12k+ shoppers',
                rating: 4.5,
                totalRatings: 5,
                reviews: '2300+ Reviews'
            },
            title: 'Join our newsletter & Stay Updated',
            subtitle: 'Get exclusive deals, new arrivals, and shopping tips delivered to your inbox weekly',
            emailPlaceholder: 'Enter your email...',
            buttonText: 'Subscribe',
            gradientFrom: '#4C0083',
            gradientTo: '#180047'
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

    renderStars() {
        const stars = [];
        for (let i = 0; i < this.config.trustBadge.totalRatings; i++) {
            stars.push(html`
                <svg width="19" height="18" viewBox="0 0 19 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8.52447 1.46353C8.67415 1.00287 9.32585 1.00287 9.47553 1.46353L10.9084 5.87336C10.9753 6.07937 11.1673 6.21885 11.3839 6.21885H16.0207C16.505 6.21885 16.7064 6.83865 16.3146 7.12336L12.5633 9.84878C12.3881 9.9761 12.3148 10.2018 12.3817 10.4078L13.8145 14.8176C13.9642 15.2783 13.437 15.6613 13.0451 15.3766L9.29389 12.6512C9.11865 12.5239 8.88135 12.5239 8.70611 12.6512L4.95488 15.3766C4.56303 15.6613 4.03578 15.2783 4.18546 14.8176L5.6183 10.4078C5.68524 10.2018 5.61191 9.9761 5.43667 9.84878L1.68544 7.12336C1.29358 6.83866 1.49497 6.21885 1.97933 6.21885H6.6161C6.83272 6.21885 7.02469 6.07937 7.09163 5.87336L8.52447 1.46353Z" fill="#E12AFB"/>
                </svg>
            `);
        }
        return stars;
    }

    render() {
        const isDark = this.theme === 'dark';

        return html`
            <style>
                * {
                    font-family: 'Poppins', sans-serif;
                }
            </style>

            <div class="max-w-5xl py-16 md:pl-20 md:w-full mx-2 md:mx-auto p-4 flex flex-col md:flex-row items-center justify-between text-left rounded-2xl md:p-10 transition-colors ${isDark ? 'bg-gradient-to-b from-indigo-900 via-purple-900 to-slate-900 text-white' : 'bg-gradient-to-b from-[#4C0083] to-[#180047] text-white'}">
                <div>
                    <div>
                        <p class="${isDark ? 'text-slate-300' : 'text-slate-200'}">${this.config.trustBadge.text}</p>
                        <div class="flex items-center gap-2">
                            <div class="flex items-center gap-1">
                                ${this.renderStars()}
                            </div>
                            <span class="text-sm ${isDark ? 'text-slate-400' : 'text-slate-300'}">${this.config.trustBadge.rating}/5 • ${this.config.trustBadge.reviews}</span>
                        </div>
                    </div>
                    <h1 class="text-4xl md:text-[46px] max-md:mt-3 text-balance md:leading-[60px] max-w-md font-semibold ${isDark ? 'bg-gradient-to-r from-white to-slate-300 text-transparent bg-clip-text' : 'bg-gradient-to-r from-white to-[#CAABFF] text-transparent bg-clip-text'}">
                        ${this.config.title}
                    </h1>
                    <p class="mt-3 max-w-md text-sm ${isDark ? 'text-slate-300' : 'text-slate-200'}">${this.config.subtitle}</p>
                </div>
                <form @submit=${(e) => this.handleEmailSubmit(e)} class="flex items-center gap-2 ${isDark ? 'bg-slate-800' : 'bg-violet-900'} max-md:mt-6 pl-4 h-11 text-sm rounded-full overflow-hidden w-full md:w-auto">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" class="${isDark ? 'text-slate-400' : 'text-slate-300'}">
                        <path d="M16.5 5.25L9.75675 9.54525C9.52792 9.67816 9.268 9.74817 9.00337 9.74817C8.73875 9.74817 8.47883 9.67816 8.25 9.54525L1.5 5.25" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M15 3H3C2.17157 3 1.5 3.67157 1.5 4.5V13.5C1.5 14.3284 2.17157 15 3 15H15C15.8284 15 16.5 14.3284 16.5 13.5V4.5C16.5 3.67157 15.8284 3 15 3Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <input
                        type="email"
                        .value=${this.email}
                        @input=${(e) => this.handleEmailInput(e)}
                        placeholder="${this.config.emailPlaceholder}"
                        class="outline-none h-11 bg-transparent flex-1 min-w-0 ${isDark ? 'text-white placeholder:text-slate-500' : 'text-white placeholder:text-slate-400'}"
                        required
                    >
                    <button type="submit" class="px-6 h-10 mr-1 rounded-full border ${isDark ? 'border-indigo-700 bg-indigo-800 hover:bg-indigo-700' : 'border-violet-600 bg-violet-800 hover:bg-violet-700'} transition-colors text-white">
                        ${this.config.buttonText}
                    </button>
                </form>
            </div>
        `;
    }
}

customElements.define('newsletter-gradient-purple', NewsletterGradientPurple);
