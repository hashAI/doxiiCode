/**
 * Gallery Slider Indicators Component
 * 
 * An auto-sliding product image gallery with dot indicators.
 * Perfect for hero sections or featured product showcases in e-commerce stores.
 * 
 * @element gallery-slider-indicators
 * 
 * @prop {Array} images - Array of image URLs to display (default: 5 product images)
 * @prop {Number} autoSlideInterval - Auto-slide interval in milliseconds (default: 3000)
 * @prop {Boolean} autoSlide - Enable/disable auto-sliding (default: true)
 * 
 * @fires slide-change - Fired when slide changes {detail: {index, url}}
 * @fires indicator-click - Fired when indicator is clicked {detail: {index}}
 * 
 * @example
 * <gallery-slider-indicators></gallery-slider-indicators>
 * 
 * @example
 * <gallery-slider-indicators 
 *   images='["url1", "url2", "url3"]'
 *   auto-slide-interval="5000">
 * </gallery-slider-indicators>
 */

import { BaseComponent } from '../../base-component.js';
import { html } from 'https://cdn.jsdelivr.net/npm/lit@3.2.1/+esm';

export class GallerySliderIndicators extends BaseComponent {
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
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        this.stopAutoSlide();
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
        this.stopAutoSlide();
        this.startAutoSlide();
    }

    nextSlide() {
        this.currentSlide = (this.currentSlide + 1) % this.images.length;
        this.emit('slide-change', { index: this.currentSlide, url: this.images[this.currentSlide] });
    }

    handleIndicatorClick(index) {
        this.goToSlide(index);
        this.emit('indicator-click', { index });
    }

    render() {
        return html`
            <div class="w-full bg-white dark:bg-gray-900 py-12 px-4 transition-colors duration-300">
                <div class="flex flex-col items-center max-w-7xl mx-auto">
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

                    <!-- Dot Indicators -->
                    <div class="flex items-center mt-5 space-x-2" role="tablist" aria-label="Slide navigation">
                        ${this.images.map((_, index) => html`
                            <button
                                class="w-3 h-3 rounded-full transition-all duration-300 ${
                                    this.currentSlide === index 
                                        ? 'bg-gray-900 dark:bg-gray-100' 
                                        : 'bg-gray-300 dark:bg-gray-600'
                                }"
                                @click="${() => this.handleIndicatorClick(index)}"
                                role="tab"
                                aria-label="Go to slide ${index + 1}"
                                aria-selected="${this.currentSlide === index}"
                            ></button>
                        `)}
                    </div>
                </div>
            </div>
        `;
    }
}

customElements.define('gallery-slider-indicators', GallerySliderIndicators);

