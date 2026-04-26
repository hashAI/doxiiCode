/**
 * Gallery Marquee Testimonials Component
 * 
 * An infinite scrolling marquee displaying customer testimonials in two rows.
 * Perfect for showcasing reviews, social proof, and customer feedback.
 * 
 * @element gallery-marquee-testimonials
 * 
 * @prop {Array} cards - Array of testimonial objects {image, name, handle, date, testimonial}
 * @prop {Number} animationDuration - Animation duration in seconds (default: 25)
 * @prop {Boolean} pauseOnHover - Pause animation on hover (default: true)
 * 
 * @fires card-click - Fired when a testimonial card is clicked {detail: {index, card}}
 * @fires link-click - Fired when social link is clicked {detail: {index, card, platform}}
 * 
 * @example
 * <gallery-marquee-testimonials></gallery-marquee-testimonials>
 * 
 * @example
 * <gallery-marquee-testimonials 
 *   cards='[{"image":"...", "name":"John", "handle":"@john", "date":"May 2025", "testimonial":"Great!"}]'
 *   animation-duration="30">
 * </gallery-marquee-testimonials>
 */

import { BaseComponent } from '../../base-component.js';
import { html } from 'https://cdn.jsdelivr.net/npm/lit@3.2.1/+esm';

export class GalleryMarqueeTestimonials extends BaseComponent {
    static properties = {
        cards: { type: Array },
        animationDuration: { type: Number },
        pauseOnHover: { type: Boolean }
    };

    constructor() {
        super();
        this.cards = [
            {
                image: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200',
                name: 'Sarah Mitchell',
                handle: '@sarahstyle',
                date: 'April 20, 2025',
                testimonial: 'Amazing quality and fast shipping! These products exceeded my expectations. Will definitely shop here again.'
            },
            {
                image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200',
                name: 'Alex Turner',
                handle: '@alexreviews',
                date: 'May 10, 2025',
                testimonial: 'Best online shopping experience! The customer service team was incredibly helpful and responsive.'
            },
            {
                image: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=200&auto=format&fit=crop&q=60',
                name: 'Jordan Chen',
                handle: '@jordanstyle',
                date: 'June 5, 2025',
                testimonial: 'Love the variety of products available. Found exactly what I was looking for at a great price!'
            },
            {
                image: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&auto=format&fit=crop&q=60',
                name: 'Emily Roberts',
                handle: '@emilyshops',
                date: 'June 15, 2025',
                testimonial: 'Exceptional quality and attention to detail. These products have become my go-to favorites!'
            },
            {
                image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200',
                name: 'Maya Patel',
                handle: '@mayafinds',
                date: 'July 1, 2025',
                testimonial: 'Outstanding value for money. The quality is comparable to luxury brands at affordable prices.'
            }
        ];
        this.animationDuration = 25;
        this.pauseOnHover = true;
    }

    handleCardClick(index, card) {
        this.emit('card-click', { index, card });
    }

    handleLinkClick(e, index, card, platform) {
        e.preventDefault();
        e.stopPropagation();
        this.emit('link-click', { index, card, platform });
    }

    renderCard(card, index) {
        return html`
            <div 
                class="bg-white dark:bg-gray-800 p-4 rounded-lg mx-4 shadow hover:shadow-lg transition-all duration-200 w-72 shrink-0 cursor-pointer border border-gray-100 dark:border-gray-700"
                @click="${() => this.handleCardClick(index, card)}"
                role="button"
                tabindex="0"
                @keydown="${(e) => e.key === 'Enter' && this.handleCardClick(index, card)}"
            >
                <!-- User Info -->
                <div class="flex gap-2 mb-3">
                    <img 
                        class="size-11 rounded-full object-cover" 
                        src="${card.image}" 
                        alt="${card.name}"
                        loading="lazy"
                    />
                    <div class="flex flex-col">
                        <div class="flex items-center gap-1">
                            <p class="text-gray-900 dark:text-gray-100 font-medium text-sm">${card.name}</p>
                            <!-- Verified Badge -->
                            <svg class="mt-0.5 flex-shrink-0" width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M4.555.72a4 4 0 0 1-.297.24c-.179.12-.38.202-.59.244a4 4 0 0 1-.38.041c-.48.039-.721.058-.922.129a1.63 1.63 0 0 0-.992.992c-.071.2-.09.441-.129.922a4 4 0 0 1-.041.38 1.6 1.6 0 0 1-.245.59 3 3 0 0 1-.239.297c-.313.368-.47.551-.56.743-.213.444-.213.96 0 1.404.09.192.247.375.56.743.125.146.187.219.24.297.12.179.202.38.244.59.018.093.026.189.041.38.039.48.058.721.129.922.163.464.528.829.992.992.2.071.441.09.922.129.191.015.287.023.38.041.21.042.411.125.59.245.078.052.151.114.297.239.368.313.551.47.743.56.444.213.96.213 1.404 0 .192-.09.375-.247.743-.56.146-.125.219-.187.297-.24.179-.12.38-.202.59-.244a4 4 0 0 1 .38-.041c.48-.039.721-.058.922-.129.464-.163.829-.528.992-.992.071-.2.09-.441.129-.922a4 4 0 0 1 .041-.38c.042-.21.125-.411.245-.59.052-.078.114-.151.239-.297.313-.368.47-.551.56-.743.213-.444.213-.96 0-1.404-.09-.192-.247-.375-.56-.743a4 4 0 0 1-.24-.297 1.6 1.6 0 0 1-.244-.59 3 3 0 0 1-.041-.38c-.039-.48-.058-.721-.129-.922a1.63 1.63 0 0 0-.992-.992c-.2-.071-.441-.09-.922-.129a4 4 0 0 1-.38-.041 1.6 1.6 0 0 1-.59-.245A3 3 0 0 1 7.445.72C7.077.407 6.894.25 6.702.16a1.63 1.63 0 0 0-1.404 0c-.192.09-.375.247-.743.56m4.07 3.998a.488.488 0 0 0-.691-.69l-2.91 2.91-.958-.957a.488.488 0 0 0-.69.69l1.302 1.302c.19.191.5.191.69 0z" fill="#2196F3" />
                            </svg>
                        </div>
                        <span class="text-xs text-gray-500 dark:text-gray-400">${card.handle}</span>
                    </div>
                </div>

                <!-- Testimonial Text -->
                <p class="text-sm py-3 text-gray-800 dark:text-gray-200 leading-relaxed">
                    ${card.testimonial}
                </p>

                <!-- Footer -->
                <div class="flex items-center justify-between text-gray-500 dark:text-gray-400 text-xs">
                    <div class="flex items-center gap-1.5">
                        <span>Posted on</span>
                        <a 
                            href="https://x.com/${card.handle}" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            class="hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
                            @click="${(e) => this.handleLinkClick(e, index, card, 'twitter')}"
                            aria-label="View on X (Twitter)"
                        >
                            <svg width="11" height="10" viewBox="0 0 11 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="m.027 0 4.247 5.516L0 10h.962l3.742-3.926L7.727 10H11L6.514 4.174 10.492 0H9.53L6.084 3.616 3.3 0zM1.44.688h1.504l6.64 8.624H8.082z" fill="currentColor" />
                            </svg>
                        </a>
                    </div>
                    <p>${card.date}</p>
                </div>
            </div>
        `;
    }

    render() {
        // Double the cards for seamless infinite scroll
        const doubledCards = [...this.cards, ...this.cards];

        return html`
            <style>
                @keyframes marqueeScroll {
                    0% {
                        transform: translateX(0%);
                    }
                    100% {
                        transform: translateX(-50%);
                    }
                }

                .marquee-inner {
                    animation: marqueeScroll ${this.animationDuration}s linear infinite;
                }

                .marquee-reverse {
                    animation-direction: reverse;
                }

                ${this.pauseOnHover ? `
                    .marquee-row:hover .marquee-inner {
                        animation-play-state: paused;
                    }
                ` : ''}
            </style>

            <div class="w-full bg-white dark:bg-gray-900 py-8 transition-colors duration-300">
                <div class="w-full mx-auto max-w-7xl">
                    <!-- Row 1 - Left to Right -->
                    <div class="marquee-row w-full overflow-hidden relative mb-4">
                        <!-- Left Fade -->
                        <div class="absolute left-0 top-0 h-full w-20 md:w-32 z-10 pointer-events-none bg-gradient-to-r from-white dark:from-gray-900 to-transparent"></div>
                        
                        <!-- Scrolling Content -->
                        <div class="marquee-inner flex transform-gpu min-w-[200%] py-4">
                            ${doubledCards.map((card, index) => this.renderCard(card, index))}
                        </div>
                        
                        <!-- Right Fade -->
                        <div class="absolute right-0 top-0 h-full w-20 md:w-32 z-10 pointer-events-none bg-gradient-to-l from-white dark:from-gray-900 to-transparent"></div>
                    </div>

                    <!-- Row 2 - Right to Left -->
                    <div class="marquee-row w-full overflow-hidden relative">
                        <!-- Left Fade -->
                        <div class="absolute left-0 top-0 h-full w-20 md:w-32 z-10 pointer-events-none bg-gradient-to-r from-white dark:from-gray-900 to-transparent"></div>
                        
                        <!-- Scrolling Content (Reversed) -->
                        <div class="marquee-inner marquee-reverse flex transform-gpu min-w-[200%] py-4">
                            ${doubledCards.map((card, index) => this.renderCard(card, index))}
                        </div>
                        
                        <!-- Right Fade -->
                        <div class="absolute right-0 top-0 h-full w-20 md:w-32 z-10 pointer-events-none bg-gradient-to-l from-white dark:from-gray-900 to-transparent"></div>
                    </div>
                </div>
            </div>
        `;
    }
}

customElements.define('gallery-marquee-testimonials', GalleryMarqueeTestimonials);

