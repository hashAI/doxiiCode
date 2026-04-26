/**
 * Gallery Slider Buttons Component
 * 
 * An auto-sliding product image gallery with previous/next navigation buttons.
 * Perfect for hero sections or featured product showcases in e-commerce stores.
 * 
 * @element gallery-slider-buttons
 * 
 * @prop {Array} images - Array of image URLs to display (default: 5 product images)
 * @prop {Number} autoSlideInterval - Auto-slide interval in milliseconds (default: 3000)
 * @prop {Boolean} autoSlide - Enable/disable auto-sliding (default: true)
 * 
 * @fires slide-change - Fired when slide changes {detail: {index, url}}
 * @fires button-click - Fired when navigation button is clicked {detail: {direction, index}}
 * 
 * @example
 * <gallery-slider-buttons></gallery-slider-buttons>
 * 
 * @example
 * <gallery-slider-buttons 
 *   images='["url1", "url2", "url3"]'
 *   auto-slide-interval="5000">
 * </gallery-slider-buttons>
 */

import { BaseComponent } from '../../base-component.js';
import { html } from 'https://cdn.jsdelivr.net/npm/lit@3.2.1/+esm';

export class GallerySliderButtons extends BaseComponent {
    static properties = {
        images: { type: Array },
        autoSlideInterval: { type: Number },
        autoSlide: { type: Boolean },
        currentSlide: { type: Number }
    };

    constructor() {
        super();
        this.images = [
            'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1200&h=600&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1200&h=600&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=1200&h=600&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1560343090-f0409e92791a?q=80&w=1200&h=600&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1491553895911-0055eca6402d?q=80&w=1200&h=600&auto=format&fit=crop'
        ];
        this.autoSlideInterval = 3000;
        this.autoSlide = true;
        this.currentSlide = 0;
        this.slideTimer = null;
    }

    firstUpdated() {
        this.startAutoSlide();
        // Handle window resize to recalculate slide position
        this.resizeHandler = () => this.requestUpdate();
        window.addEventListener('resize', this.resizeHandler);
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        this.stopAutoSlide();
        if (this.resizeHandler) {
            window.removeEventListener('resize', this.resizeHandler);
        }
    }

    startAutoSlide() {
        if (this.autoSlide) {
            this.stopAutoSlide();
            this.slideTimer = setInterval(() => {
                this.nextSlide();
            }, this.autoSlideInterval);
        }
    }

    stopAutoSlide() {
        if (this.slideTimer) {
            clearInterval(this.slideTimer);
            this.slideTimer = null;
        }
    }

    goToSlide(index) {
        this.currentSlide = index;
        this.emit('slide-change', { index, url: this.images[index] });
    }

    nextSlide() {
        this.currentSlide = (this.currentSlide + 1) % this.images.length;
        this.emit('slide-change', { index: this.currentSlide, url: this.images[this.currentSlide] });
        this.emit('button-click', { direction: 'next', index: this.currentSlide });
    }

    prevSlide() {
        this.currentSlide = (this.currentSlide - 1 + this.images.length) % this.images.length;
        this.emit('slide-change', { index: this.currentSlide, url: this.images[this.currentSlide] });
        this.emit('button-click', { direction: 'prev', index: this.currentSlide });
    }

    handlePrevClick() {
        this.prevSlide();
        this.stopAutoSlide();
        this.startAutoSlide();
    }

    handleNextClick() {
        this.nextSlide();
        this.stopAutoSlide();
        this.startAutoSlide();
    }

    render() {
        return html`
            <div class="w-full bg-white dark:bg-gray-900 py-12 px-4 transition-colors duration-300">
                <div class="flex items-center justify-center max-w-7xl mx-auto">
                    <!-- Previous Button -->
                    <button 
                        class="md:p-2 p-1 bg-black/30 dark:bg-white/30 md:mr-6 mr-2 rounded-full hover:bg-black/50 dark:hover:bg-white/50 transition-all duration-200 flex-shrink-0 z-10"
                        @click="${this.handlePrevClick}"
                        aria-label="Previous slide"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white dark:text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>

                    <!-- Slider Container -->
                    <div class="w-full max-w-3xl overflow-hidden relative rounded-lg shadow-lg">
                        <div 
                            class="flex transition-transform duration-500 ease-in-out"
                            style="transform: translateX(-${this.currentSlide * 100}%)"
                        >
                            ${this.images.map((img, index) => html`
                                <img 
                                    src="${img}" 
                                    class="w-full flex-shrink-0 object-cover h-[300px] md:h-[400px]" 
                                    alt="Slide ${index + 1}"
                                    loading="${index === 0 ? 'eager' : 'lazy'}"
                                />
                            `)}
                        </div>
                    </div>

                    <!-- Next Button -->
                    <button 
                        class="p-1 md:p-2 bg-black/30 dark:bg-white/30 md:ml-6 ml-2 rounded-full hover:bg-black/50 dark:hover:bg-white/50 transition-all duration-200 flex-shrink-0 z-10"
                        @click="${this.handleNextClick}"
                        aria-label="Next slide"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white dark:text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </div>
        `;
    }
}

customElements.define('gallery-slider-buttons', GallerySliderButtons);

