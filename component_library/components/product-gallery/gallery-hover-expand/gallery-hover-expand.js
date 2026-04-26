/**
 * Gallery Hover Expand Component
 * 
 * An elegant product image gallery with horizontal expand-on-hover effect.
 * Perfect for showcasing product collections in e-commerce stores.
 * 
 * @element gallery-hover-expand
 * 
 * @prop {Array} images - Array of image URLs to display (default: 6 product images)
 * @prop {String} title - Gallery title (default: "Our Latest Collection")
 * @prop {String} subtitle - Gallery subtitle
 * 
 * @fires image-click - Fired when an image is clicked {detail: {index, url}}
 * 
 * @example
 * <gallery-hover-expand></gallery-hover-expand>
 * 
 * @example
 * <gallery-hover-expand 
 *   images='["url1", "url2", "url3"]'
 *   title="New Arrivals"
 *   subtitle="Check out our latest products">
 * </gallery-hover-expand>
 */

import { BaseComponent } from '../../base-component.js';
import { html } from 'https://cdn.jsdelivr.net/npm/lit@3.2.1/+esm';

export class GalleryHoverExpand extends BaseComponent {
    static properties = {
        images: { type: Array },
        title: { type: String },
        subtitle: { type: String }
    };

    constructor() {
        super();
        this.images = [
            'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&h=800&w=800&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&h=800&w=800&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&h=800&w=800&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1560343090-f0409e92791a?q=80&h=800&w=800&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1491553895911-0055eca6402d?q=80&h=800&w=800&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&h=800&w=800&auto=format&fit=crop'
        ];
        this.title = 'Our Latest Collection';
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
                    <div class="flex flex-col md:flex-row items-center gap-2 h-auto md:h-[400px] w-full max-w-4xl mt-10 mx-auto">
                        ${this.images.map((img, index) => html`
                            <div 
                                class="relative group flex-grow transition-all w-full md:w-56 rounded-lg overflow-hidden h-[200px] md:h-[400px] duration-500 hover:md:w-full cursor-pointer"
                                @click="${() => this.handleImageClick(index, img)}"
                                role="button"
                                tabindex="0"
                                aria-label="View product ${index + 1}"
                                @keydown="${(e) => e.key === 'Enter' && this.handleImageClick(index, img)}"
                            >
                                <img 
                                    class="h-full w-full object-cover object-center transition-transform duration-300"
                                    src="${img}"
                                    alt="Product ${index + 1}"
                                    loading="lazy"
                                />
                            </div>
                        `)}
                    </div>
                </div>
            </div>
        `;
    }
}

customElements.define('gallery-hover-expand', GalleryHoverExpand);

