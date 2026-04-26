/**
 * Contact Page
 */

import { BaseComponent } from '../components/base-component.js';
import { validateEmail, showToast } from '../assets/utils.js';

class PageContact extends BaseComponent {
    static properties = {
        formData: { type: Object },
        isSubmitting: { type: Boolean }
    };

    constructor() {
        super();
        this.formData = { name: '', email: '', subject: '', message: '' };
        this.isSubmitting = false;
    }

    handleInputChange(field, value) {
        this.formData = { ...this.formData, [field]: value };
    }

    async handleSubmit(e) {
        e.preventDefault();

        if (!validateEmail(this.formData.email)) {
            showToast('Please enter a valid email', 'error');
            return;
        }

        this.isSubmitting = true;
        await new Promise(resolve => setTimeout(resolve, 1000));

        showToast('Message sent successfully!', 'success');
        this.formData = { name: '', email: '', subject: '', message: '' };
        this.isSubmitting = false;
    }

    render() {
        return this.html`
            <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div class="text-center mb-12">
                        <h1 class="text-4xl font-bold mb-4" data-aos="fade-up">Get In Touch</h1>
                        <p class="text-xl text-gray-600 dark:text-gray-400" data-aos="fade-up" data-aos-delay="100">
                            We'd love to hear from you. Send us a message!
                        </p>
                    </div>

                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        <!-- Contact Form -->
                        <div class="bg-white dark:bg-gray-800 rounded-2xl p-8" data-aos="fade-right">
                            <form @submit="${this.handleSubmit}" class="space-y-6">
                                <div>
                                    <label class="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100">Name</label>
                                    <input type="text" .value="${this.formData.name}" @input="${(e) => this.handleInputChange('name', e.target.value)}" class="input-field" placeholder="Your full name" required />
                                </div>
                                <div>
                                    <label class="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100">Email</label>
                                    <input type="email" .value="${this.formData.email}" @input="${(e) => this.handleInputChange('email', e.target.value)}" class="input-field" placeholder="your.email@example.com" required />
                                </div>
                                <div>
                                    <label class="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100">Subject</label>
                                    <input type="text" .value="${this.formData.subject}" @input="${(e) => this.handleInputChange('subject', e.target.value)}" class="input-field" placeholder="How can we help?" required />
                                </div>
                                <div>
                                    <label class="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100">Message</label>
                                    <textarea .value="${this.formData.message}" @input="${(e) => this.handleInputChange('message', e.target.value)}" class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white focus:border-transparent transition-all" rows="6" required></textarea>
                                </div>
                                <button type="submit" class="w-full h-12 px-6 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-semibold rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors disabled:opacity-50" ?disabled="${this.isSubmitting}">
                                    ${this.isSubmitting ? 'Sending...' : 'Send Message'}
                                </button>
                            </form>
                        </div>

                        <!-- Contact Info -->
                        <div class="space-y-8" data-aos="fade-left">
                            <div class="bg-white dark:bg-gray-800 rounded-2xl p-8">
                                <h3 class="text-xl font-bold mb-6">Contact Information</h3>
                                <div class="space-y-4">
                                    ${this.renderContactItem('map-pin', 'Address', '123 Commerce St, City, ST 12345')}
                                    ${this.renderContactItem('phone', 'Phone', '(555) 123-4567')}
                                    ${this.renderContactItem('mail', 'Email', 'hello@doxii.com')}
                                    ${this.renderContactItem('clock', 'Hours', 'Mon-Fri: 9AM-6PM')}
                                </div>
                            </div>

                            <div class="bg-white dark:bg-gray-800 rounded-2xl p-8">
                                <h3 class="text-xl font-bold mb-6">Follow Us</h3>
                                <div class="flex gap-4">
                                    ${['facebook', 'twitter', 'instagram', 'linkedin'].map(social => this.html`
                                        <a href="#" class="w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-primary-500 hover:text-white flex items-center justify-center transition-colors">
                                            <i data-lucide="${social}" width="20" height="20"></i>
                                        </a>
                                    `)}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>
                .input-field {
                    @apply w-full h-11 px-4 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white focus:border-transparent transition-all;
                }
            </style>
        `;
    }

    renderContactItem(icon, label, value) {
        return this.html`
            <div class="flex items-start gap-3">
                <div class="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 flex items-center justify-center flex-shrink-0">
                    <i data-lucide="${icon}" width="20" height="20"></i>
                </div>
                <div>
                    <p class="font-semibold">${label}</p>
                    <p class="text-gray-600 dark:text-gray-400">${value}</p>
                </div>
            </div>
        `;
    }
}

customElements.define('page-contact', PageContact);
