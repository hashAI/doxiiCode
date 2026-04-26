/**
 * Footer Component
 * - Company info
 * - Quick links
 * - Social media
 * - Newsletter signup
 */

import { BaseComponent } from './base-component.js';
import { navigate } from '../assets/router.js';

class EcomFooter extends BaseComponent {
    render() {
        const currentYear = new Date().getFullYear();

        return this.html`
            <footer class="bg-gray-900 text-gray-300 mt-20">
                <!-- Main Footer -->
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

                        <!-- Company Info -->
                        <div>
                            <div class="flex items-center space-x-2 mb-4">
                                <div class="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                                    <span class="text-white font-bold text-xl">D</span>
                                </div>
                                <span class="text-2xl font-display font-bold text-white">DOXII</span>
                            </div>
                            <p class="text-sm mb-4">
                                Your trusted destination for quality products and exceptional service.
                            </p>
                            <div class="flex space-x-3">
                                <a href="#" class="social-link" aria-label="Facebook">
                                    <i data-lucide="facebook"></i>
                                </a>
                                <a href="#" class="social-link" aria-label="Twitter">
                                    <i data-lucide="twitter"></i>
                                </a>
                                <a href="#" class="social-link" aria-label="Instagram">
                                    <i data-lucide="instagram"></i>
                                </a>
                                <a href="#" class="social-link" aria-label="LinkedIn">
                                    <i data-lucide="linkedin"></i>
                                </a>
                            </div>
                        </div>

                        <!-- Quick Links -->
                        <div>
                            <h3 class="text-white font-semibold mb-4">Quick Links</h3>
                            <ul class="space-y-2">
                                <li><a href="#/" class="footer-link">Home</a></li>
                                <li><a href="#/catalog" class="footer-link">Shop</a></li>
                                <li><a href="#/about" class="footer-link">About Us</a></li>
                                <li><a href="#/contact" class="footer-link">Contact</a></li>
                            </ul>
                        </div>

                        <!-- Customer Service -->
                        <div>
                            <h3 class="text-white font-semibold mb-4">Customer Service</h3>
                            <ul class="space-y-2">
                                <li><a href="#" class="footer-link">Shipping Info</a></li>
                                <li><a href="#" class="footer-link">Returns</a></li>
                                <li><a href="#" class="footer-link">FAQs</a></li>
                                <li><a href="#" class="footer-link">Track Order</a></li>
                            </ul>
                        </div>

                        <!-- Contact Info -->
                        <div>
                            <h3 class="text-white font-semibold mb-4">Get In Touch</h3>
                            <ul class="space-y-3 text-sm">
                                <li class="flex items-start space-x-2">
                                    <i data-lucide="map-pin" width="18" height="18" class="mt-0.5"></i>
                                    <span>123 Commerce St, City, ST 12345</span>
                                </li>
                                <li class="flex items-center space-x-2">
                                    <i data-lucide="phone" width="18" height="18"></i>
                                    <span>(555) 123-4567</span>
                                </li>
                                <li class="flex items-center space-x-2">
                                    <i data-lucide="mail" width="18" height="18"></i>
                                    <span>hello@doxii.com</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <!-- Bottom Bar -->
                <div class="border-t border-gray-800">
                    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                        <div class="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                            <p class="text-sm">
                                © ${currentYear} DOXII. All rights reserved.
                            </p>
                            <div class="flex items-center space-x-6 text-sm">
                                <a href="#" class="footer-link">Privacy Policy</a>
                                <a href="#" class="footer-link">Terms of Service</a>
                                <a href="#" class="footer-link">Cookie Policy</a>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>

            <style>
                .footer-link {
                    @apply hover:text-white transition-colors;
                }

                .social-link {
                    @apply w-10 h-10 rounded-lg bg-gray-800 hover:bg-primary-500 flex items-center justify-center transition-colors;
                }
            </style>
        `;
    }
}

customElements.define('ecom-footer', EcomFooter);
