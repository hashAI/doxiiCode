/**
 * About Page
 */

import { BaseComponent } from '../components/base-component.js';

class PageAbout extends BaseComponent {
    render() {
        return this.html`
            <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
                <!-- Hero -->
                <section class="bg-gradient-to-br from-primary-500 to-secondary-500 text-white py-20">
                    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h1 class="text-5xl font-display font-bold mb-6" data-aos="fade-up">About DOXII</h1>
                        <p class="text-xl max-w-3xl mx-auto" data-aos="fade-up" data-aos-delay="100">
                            We're passionate about bringing you the best products with exceptional service and unbeatable value.
                        </p>
                    </div>
                </section>

                <!-- Story -->
                <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div data-aos="fade-right">
                            <h2 class="text-3xl font-bold mb-6">Our Story</h2>
                            <p class="text-gray-600 dark:text-gray-400 mb-4">
                                Founded with a vision to revolutionize online shopping, DOXII has grown from a small startup to a trusted e-commerce destination for thousands of customers worldwide.
                            </p>
                            <p class="text-gray-600 dark:text-gray-400">
                                We believe in quality, transparency, and customer satisfaction above all else. Every product we offer is carefully selected to meet our high standards.
                            </p>
                        </div>
                        <div class="bg-gray-200 dark:bg-gray-800 aspect-video rounded-2xl" data-aos="fade-left"></div>
                    </div>
                </section>

                <!-- Values -->
                <section class="bg-white dark:bg-gray-800 py-16">
                    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 class="text-3xl font-bold text-center mb-12" data-aos="fade-up">Our Values</h2>
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                            ${this.renderValue('Quality First', 'We never compromise on product quality', 'award')}
                            ${this.renderValue('Customer Focus', 'Your satisfaction is our priority', 'users')}
                            ${this.renderValue('Innovation', 'Always improving our service', 'zap')}
                        </div>
                    </div>
                </section>
            </div>
        `;
    }

    renderValue(title, description, icon) {
        return this.html`
            <div class="text-center" data-aos="fade-up">
                <div class="w-16 h-16 bg-primary-100 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i data-lucide="${icon}" width="32" height="32"></i>
                </div>
                <h3 class="text-xl font-bold mb-2">${title}</h3>
                <p class="text-gray-600 dark:text-gray-400">${description}</p>
            </div>
        `;
    }
}

customElements.define('page-about', PageAbout);
