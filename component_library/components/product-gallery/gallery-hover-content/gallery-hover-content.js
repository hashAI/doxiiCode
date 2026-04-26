/**
 * Gallery Hover Content Component
 * 
 * A product image gallery with text overlay on hover, revealing titles and descriptions.
 * Perfect for category showcases or featured product collections in e-commerce stores.
 * 
 * @element gallery-hover-content
 * 
 * @prop {Array} items - Array of objects {url, title, description}
 * @prop {String} title - Gallery title (default: "Shop By Category")
 * @prop {String} subtitle - Gallery subtitle
 * 
 * @fires item-click - Fired when an item is clicked {detail: {index, item}}
 * 
 * @example
 * <gallery-hover-content></gallery-hover-content>
 * 
 * @example
 * <gallery-hover-content 
 *   items='[{"url":"...", "title":"Electronics", "description":"Latest gadgets"}]'
 *   title="Product Categories"
 *   subtitle="Browse our collections">
 * </gallery-hover-content>
 */

import { BaseComponent } from '../../base-component.js';
import { html } from 'https://cdn.jsdelivr.net/npm/lit@3.2.1/+esm';

export class GalleryHoverContent extends BaseComponent {
    static properties = {
        items: { type: Array },
        title: { type: String },
        subtitle: { type: String }
    };

    constructor() {
        super();
        this.items = [
            {
                url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&h=400&auto=format&fit=crop',
                title: 'Fashion Accessories',
                description: 'Discover the perfect accessories to complement your style and elevate your wardrobe.'
            },
            {
                url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&h=400&auto=format&fit=crop',
                title: 'Tech Gadgets',
                description: 'Explore cutting-edge technology and innovative solutions for your digital lifestyle.'
            },
            {
                url: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=800&h=400&auto=format&fit=crop',
                title: 'Home Essentials',
                description: 'Transform your living space with our curated selection of quality home products.'
            }
        ];
        this.title = 'Shop By Category';
        this.subtitle = 'Explore our diverse collection - each category crafted to meet your unique needs and preferences.';
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

    handleItemClick(index, item) {
        this.emit('item-click', { index, item });
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
                    <div class="flex flex-col md:flex-row items-center gap-4 md:gap-6 h-auto w-full max-w-5xl mt-10 mx-auto">
                        ${this.items.map((item, index) => html`
                            <div 
                                class="relative group flex-grow transition-all w-full md:w-56 h-[300px] md:h-[400px] duration-500 hover:md:w-full cursor-pointer"
                                @click="${() => this.handleItemClick(index, item)}"
                                role="button"
                                tabindex="0"
                                aria-label="${item.title}"
                                @keydown="${(e) => e.key === 'Enter' && this.handleItemClick(index, item)}"
                            >
                                <img 
                                    class="h-full w-full object-cover object-center rounded-lg"
                                    src="${item.url}"
                                    alt="${item.title}"
                                    loading="lazy"
                                />
                                <div class="absolute inset-0 flex flex-col justify-end p-6 md:p-10 text-white bg-black/50 opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-lg">
                                    <h2 class="text-2xl md:text-3xl font-semibold mb-2">${item.title}</h2>
                                    <p class="text-sm md:text-base">${item.description}</p>
                                </div>
                            </div>
                        `)}
                    </div>
                </div>
            </div>
        `;
    }
}

customElements.define('gallery-hover-content', GalleryHoverContent);

