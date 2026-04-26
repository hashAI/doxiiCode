/**
 * Gallery Grid Component
 * 
 * A responsive grid-based product image gallery with hover overlay containing titles and links.
 * Perfect for product listings or portfolio showcases in e-commerce stores.
 * 
 * @element gallery-grid
 * 
 * @prop {Array} items - Array of objects {url, title, link} (default: 8 product items)
 * @prop {String} title - Gallery title (default: "Our Latest Products")
 * @prop {String} subtitle - Gallery subtitle
 * @prop {Number} columns - Number of columns in grid (default: responsive)
 * 
 * @fires item-click - Fired when an item is clicked {detail: {index, item}}
 * @fires link-click - Fired when "Show More" link is clicked {detail: {index, item}}
 * 
 * @example
 * <gallery-grid></gallery-grid>
 * 
 * @example
 * <gallery-grid 
 *   items='[{"url":"...", "title":"Product 1", "link":"#"}]'
 *   title="Featured Products"
 *   subtitle="Browse our collection">
 * </gallery-grid>
 */

import { BaseComponent } from '../../base-component.js';
import { html } from 'https://cdn.jsdelivr.net/npm/lit@3.2.1/+esm';

export class GalleryGrid extends BaseComponent {
    static properties = {
        items: { type: Array },
        title: { type: String },
        subtitle: { type: String },
        columns: { type: Number }
    };

    constructor() {
        super();
        this.items = [
            {
                url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=736&auto=format&fit=crop',
                title: 'Premium Headphones',
                link: '#headphones'
            },
            {
                url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=798&auto=format&fit=crop',
                title: 'Smart Watch',
                link: '#watch'
            },
            {
                url: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=687&auto=format&fit=crop',
                title: 'Sunglasses',
                link: '#sunglasses'
            },
            {
                url: 'https://images.unsplash.com/photo-1560343090-f0409e92791a?q=80&w=862&auto=format&fit=crop',
                title: 'Leather Wallet',
                link: '#wallet'
            },
            {
                url: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?q=80&w=687&auto=format&fit=crop',
                title: 'Running Shoes',
                link: '#shoes'
            },
            {
                url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=703&auto=format&fit=crop',
                title: 'Sneakers',
                link: '#sneakers'
            },
            {
                url: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?q=80&w=736&auto=format&fit=crop',
                title: 'Backpack',
                link: '#backpack'
            },
            {
                url: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?q=80&w=798&auto=format&fit=crop',
                title: 'Office Chair',
                link: '#chair'
            }
        ];
        this.title = 'Our Latest Products';
        this.subtitle = 'Explore our newest arrivals - each product carefully selected to bring quality and style to your life.';
        this.columns = 4; // Not used directly, handled by Tailwind responsive classes
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

    handleLinkClick(e, index, item) {
        e.preventDefault();
        e.stopPropagation();
        this.emit('link-click', { index, item });
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

                    <!-- Grid Gallery -->
                    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-12 max-w-5xl mx-auto">
                        ${this.items.map((item, index) => html`
                            <div 
                                class="relative group rounded-lg overflow-hidden cursor-pointer"
                                @click="${() => this.handleItemClick(index, item)}"
                                role="button"
                                tabindex="0"
                                aria-label="${item.title}"
                                @keydown="${(e) => e.key === 'Enter' && this.handleItemClick(index, item)}"
                            >
                                <img 
                                    src="${item.url}" 
                                    alt="${item.title}" 
                                    class="w-full h-56 object-cover object-top"
                                    loading="lazy"
                                />
                                <div class="absolute inset-0 flex flex-col justify-end p-4 text-white bg-black/50 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                    <h2 class="text-xl font-medium mb-1">${item.title}</h2>
                                    <a 
                                        href="${item.link}" 
                                        class="flex items-center gap-1 text-sm text-white/70 hover:text-white no-underline transition-colors"
                                        @click="${(e) => this.handleLinkClick(e, index, item)}"
                                    >
                                        Show More
                                        <svg width="16" height="16" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M8.125 1.625H11.375V4.875" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>
                                            <path d="M5.41602 7.58333L11.3743 1.625" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>
                                            <path d="M9.75 7.04167V10.2917C9.75 10.579 9.63586 10.8545 9.4327 11.0577C9.22953 11.2609 8.95398 11.375 8.66667 11.375H2.70833C2.42102 11.375 2.14547 11.2609 1.9423 11.0577C1.73914 10.8545 1.625 10.579 1.625 10.2917V4.33333C1.625 4.04602 1.73914 3.77047 1.9423 3.5673C2.14547 3.36414 2.42102 3.25 2.70833 3.25H5.95833" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>
                                        </svg>
                                    </a>
                                </div>
                            </div>
                        `)}
                    </div>
                </div>
            </div>
        `;
    }
}

customElements.define('gallery-grid', GalleryGrid);

