/**
 * Newsletter Signup Component
 * - Email subscription form
 * - Validation and feedback
 */

import { BaseComponent } from './base-component.js';
import { validateEmail, showToast } from '../assets/utils.js';

class EcomNewsletter extends BaseComponent {
    static properties = {
        email: { type: String },
        isLoading: { type: Boolean }
    };

    constructor() {
        super();
        this.email = '';
        this.isLoading = false;
    }

    async handleSubmit(e) {
        e.preventDefault();

        if (!this.email) {
            showToast('Please enter your email address', 'warning');
            return;
        }

        if (!validateEmail(this.email)) {
            showToast('Please enter a valid email address', 'error');
            return;
        }

        this.isLoading = true;

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        showToast('Thank you for subscribing!', 'success');
        this.email = '';
        this.isLoading = false;
    }

    render() {
        return this.html`
            <div class="bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl p-8 text-white" data-aos="fade-up">
                <div class="max-w-2xl mx-auto text-center">
                    <i data-lucide="mail" width="48" height="48" class="mx-auto mb-4"></i>
                    <h2 class="text-3xl font-bold mb-2">Subscribe to Our Newsletter</h2>
                    <p class="text-white/90 mb-6">
                        Get the latest updates on new products and exclusive offers!
                    </p>

                    <form @submit="${this.handleSubmit}" class="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            .value="${this.email}"
                            @input="${(e) => this.email = e.target.value}"
                            class="flex-1 h-12 px-4 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
                            ?disabled="${this.isLoading}"
                        />
                        <button
                            type="submit"
                            class="h-12 px-6 bg-white text-gray-900 font-semibold rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            ?disabled="${this.isLoading}"
                        >
                            ${this.isLoading ? 'Subscribing...' : 'Subscribe'}
                        </button>
                    </form>

                    <p class="text-xs text-white/70 mt-4">
                        We respect your privacy. Unsubscribe at any time.
                    </p>
                </div>
            </div>
        `;
    }
}

customElements.define('ecom-newsletter', EcomNewsletter);
