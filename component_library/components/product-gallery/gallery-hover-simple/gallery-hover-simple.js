/**
 * Gallery Hover Simple Component
 * 
 * A simple product image gallery with translate-up hover effect.
 * Perfect for clean product showcases in e-commerce stores.
 * 
 * @element gallery-hover-simple
 * 
 * @prop {Array} images - Array of image URLs to display (default: 4 product images)
 * @prop {String} title - Gallery title (default: "Explore Our Products")
 * @prop {String} subtitle - Gallery subtitle
 * 
 * @fires image-click - Fired when an image is clicked {detail: {index, url}}
 * 
 * @example
 * <gallery-hover-simple></gallery-hover-simple>
 * 
 * @example
 * <gallery-hover-simple 
 *   images='["url1", "url2", "url3", "url4"]'
 *   title="Featured Items"
 *   subtitle="Our handpicked selection">
 * </gallery-hover-simple>
 */

import { BaseComponent } from '../../base-component.js';
import { html } from 'https://cdn.jsdelivr.net/npm/lit@3.2.1/+esm';

export class GalleryHoverSimple extends BaseComponent {
    static properties = {
        images: { type: Array },
        title: { type: String },
        subtitle: { type: String }
    };

    constructor() {
        super();
        this.images = [
            'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600&h=900&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600&h=900&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=600&h=900&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1560343090-f0409e92791a?q=80&w=600&h=900&auto=format&fit=crop'
        ];
        this.title = 'Explore Our Products';
        this.subtitle = 'A visual collection of our most recent products - each piece crafted with quality, style, and precision.';
    }

    firstUpdated() {
        // Load Google Fonts
        if (!document.querySelector('link[href*="Poppins"]')) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;300;400;500;600;700;800;900&display=swap';
            document.head.appendChild(link);
        }
    }

    handleImageClick(index, url) {
        this.emit('image-click', { index, url });
    }

    render() {
        return html`
            <style>
                * {
                    font-family: 'Poppins', sans-serif;
                }
            </style>
            
            <div class="w-full bg-white dark:bg-gray-900 py-12 px-4 transition-colors duration-300">
                <div class="max-w-7xl mx-auto">
                    <!-- Header -->
                    <h1 class="text-3xl md:text-4xl font-semibold text-center text-gray-900 dark:text-gray-100">
                        ${this.title}
                    </h1>
                    <p class="text-sm md:text-base text-gray-500 dark:text-gray-400 text-center mt-2 max-w-lg mx-auto">
                        ${this.subtitle}
                    </p>

                    <!-- Gallery -->
                    <div class="flex flex-wrap items-center justify-center mt-10 mx-auto gap-4">
                        ${this.images.map((img, index) => html`
                            <img 
                                class="max-w-full w-full sm:max-w-56 h-80 object-cover rounded-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                                src="${img}"
                                alt="Product ${index + 1}"
                                loading="lazy"
                                @click="${() => this.handleImageClick(index, img)}"
                                role="button"
                                tabindex="0"
                                @keydown="${(e) => e.key === 'Enter' && this.handleImageClick(index, img)}"
                            />
                        `)}
                    </div>
                </div>
            </div>
        `;
    }
}

customElements.define('gallery-hover-simple', GalleryHoverSimple);

