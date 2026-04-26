/**
 * Category Grid Component - Myntra Style
 * - Grid of category tiles with images
 * - Pink-tinted overlay effect
 * - Click to navigate to category
 */

import { BaseComponent } from './base-component.js';
import { navigate } from '../assets/router.js';

class EcomCategoryGrid extends BaseComponent {
    static properties = {
        categories: { type: Array }
    };

    constructor() {
        super();
        this.categories = [
            {
                id: 'shirts',
                name: 'Shirts',
                image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400',
                link: '/catalog?category=shirts'
            },
            {
                id: 'tshirts',
                name: 'T-shirts',
                image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
                link: '/catalog?category=tshirts'
            },
            {
                id: 'jeans',
                name: 'Jeans',
                image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400',
                link: '/catalog?category=jeans'
            },
            {
                id: 'casual-shoes',
                name: 'Casual Shoes',
                image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400',
                link: '/catalog?category=shoes'
            },
            {
                id: 'flip-flops',
                name: 'Flip Flops',
                image: 'https://images.unsplash.com/photo-1603487742131-4160ec999306?w=400',
                link: '/catalog?category=footwear'
            },
            {
                id: 'shubh-diwali',
                name: 'Shubh Diwali',
                image: 'https://images.unsplash.com/photo-1604869515882-4d10fa4b0492?w=400',
                link: '/catalog?occasion=diwali'
            },
            {
                id: 'lipstick',
                name: 'Lipstick',
                image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400',
                link: '/catalog?category=beauty'
            },
            {
                id: 'makeup',
                name: 'Make Up',
                image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=400',
                link: '/catalog?category=makeup'
            },
            {
                id: 'trousers',
                name: 'Trousers',
                image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400',
                link: '/catalog?category=trousers'
            },
            {
                id: 'handbags',
                name: 'Handbags',
                image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400',
                link: '/catalog?category=bags'
            }
        ];
    }

    handleCategoryClick(category) {
        navigate(category.link);
    }

    render() {
        return this.html`
            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
                ${this.categories.map(category => this.html`
                    <div
                        @click="${() => this.handleCategoryClick(category)}"
                        class="category-tile group cursor-pointer"
                    >
                        <div class="relative aspect-[3/4] overflow-hidden rounded-lg bg-gradient-to-br from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20">
                            <!-- Image with Pink Tint -->
                            <img
                                src="${category.image}"
                                alt="${category.name}"
                                class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                loading="lazy"
                            />

                            <!-- Pink Overlay -->
                            <div class="absolute inset-0 bg-gradient-to-b from-transparent via-pink-500/10 to-pink-500/20 dark:to-pink-500/30"></div>

                            <!-- Category Label -->
                            <div class="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent">
                                <h3 class="text-white font-bold text-sm md:text-base">
                                    ${category.name}
                                </h3>
                            </div>

                            <!-- Hover Arrow -->
                            <div class="absolute top-3 right-3 w-7 h-7 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <i data-lucide="chevron-right" width="16" height="16" class="text-gray-900 dark:text-white"></i>
                            </div>
                        </div>
                    </div>
                `)}
            </div>

            <style>
                .category-tile:hover img {
                    filter: brightness(1.1);
                }
            </style>
        `;
    }
}

customElements.define('ecom-category-grid', EcomCategoryGrid);
