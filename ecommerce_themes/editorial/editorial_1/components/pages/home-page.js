import { BaseComponent } from '../base-component.js';
import { productsStore } from '../../assets/state.js';
import { navigate } from '../../assets/router.js';
import { formatCurrency, getImageUrl } from '../../assets/utils.js';

class HomePage extends BaseComponent {
    static properties = {
        entertainmentIndex: { type: Number },
        moreFromAppleIndex: { type: Number }
    };

    constructor() {
        super();
        this.entertainmentIndex = 1;
        this.moreFromAppleIndex = 0;
        this.autoplayInterval = null;
    }

    connectedCallback() {
        super.connectedCallback();
        this.startAutoplay();
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        this.stopAutoplay();
    }

    startAutoplay() {
        this.autoplayInterval = setInterval(() => {
            this.entertainmentIndex = (this.entertainmentIndex + 1) % 5;
        }, 5000);
    }

    stopAutoplay() {
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
        }
    }

    setEntertainmentIndex(index) {
        this.entertainmentIndex = index;
        this.stopAutoplay();
        this.startAutoplay();
    }

    render() {
        const iphone = productsStore.getProductById(1);
        const airpodsPro = productsStore.getProductById(12);
        const ipadAir = productsStore.getProductById(8);
        const appleWatch = productsStore.getProductById(10);

        const entertainmentItems = [
            { 
                title: 'Apple TV+', 
                subtitle: 'F1: The Movie',
                description: 'Now streaming on Apple TV.',
                genre: 'Action',
                image: getImageUrl('F1 racing Brad Pitt movie poster', 800, 0),
                bg: 'bg-gradient-to-b from-gray-900 to-black'
            },
            { 
                title: 'Apple TV+', 
                subtitle: 'Severance',
                description: 'The thriller returns.',
                genre: 'Drama',
                image: getImageUrl('severance tv show office thriller', 800, 1),
                bg: 'bg-gradient-to-b from-blue-900 to-slate-900'
            },
            { 
                title: 'Apple TV+', 
                subtitle: 'Prehistoric Planet',
                description: 'A new era begins.',
                genre: 'Documentary',
                image: getImageUrl('prehistoric dinosaur documentary nature', 800, 2),
                bg: 'bg-gradient-to-b from-amber-800 to-stone-900'
            },
            { 
                title: 'Apple Music', 
                subtitle: 'Beyoncé',
                description: 'Cowboy Carter. Out now.',
                genre: 'Music',
                image: getImageUrl('beyonce cowboy carter album music', 800, 3),
                bg: 'bg-gradient-to-b from-yellow-600 to-amber-900'
            },
            { 
                title: 'Apple Arcade', 
                subtitle: 'NBA 2K25',
                description: 'Hit the court.',
                genre: 'Gaming',
                image: getImageUrl('basketball nba video game sports', 800, 4),
                bg: 'bg-gradient-to-b from-purple-900 to-indigo-950'
            }
        ];

        const moreFromApple = [
            { title: 'Designed for Every Student', subtitle: 'Accessibility', image: getImageUrl('student using iphone accessibility diverse', 800, 0) },
            { title: 'The Weeknd', subtitle: 'Hurry Up Tomorrow', image: getImageUrl('the weeknd hurry up tomorrow album', 800, 1) },
            { title: 'Apple Vision Pro', subtitle: 'Experience immersion', image: getImageUrl('apple vision pro spatial computing', 800, 2) },
            { title: 'iPhone Photography', subtitle: 'Shot on iPhone', image: getImageUrl('stunning landscape photography iphone', 800, 3) },
            { title: 'Environmental Progress', subtitle: 'Apple 2030', image: getImageUrl('environmental nature green sustainability', 800, 4) }
        ];

        return this.html`
            <div class="bg-white">
                <!-- Holiday Hero Section -->
                <section class="bg-apple-lightgray text-center py-16 px-4">
                    <div class="max-w-4xl mx-auto">
                        <h1 class="text-4xl md:text-6xl font-semibold text-apple-gray tracking-tight mb-3 fade-in-up">
                            Wrapping up<br>this special season.
                        </h1>
                        <p class="text-xl md:text-2xl text-gray-600 mb-8 fade-in-up delay-100">
                            There's still time to make their<br class="md:hidden"> holiday one of a kind.
                        </p>
                        <div class="fade-in-up delay-200">
                            <button @click=${() => navigate('/products/all')} class="apple-button">
                                Shop gifts
                            </button>
                        </div>
                        <!-- Gift Bag Image -->
                        <div class="mt-12 fade-in-up delay-300">
                            <img 
                                src="${getImageUrl('apple gift bag holiday shopping premium', 600, 0)}" 
                                alt="Apple gift bag"
                                class="mx-auto max-w-sm md:max-w-md rounded-3xl">
                        </div>
                    </div>
                </section>

                <!-- iPhone Section -->
                <section class="bg-white text-center py-16 px-4 border-t border-gray-100">
                    <div class="max-w-4xl mx-auto">
                        <h2 class="text-4xl md:text-6xl font-semibold text-apple-gray tracking-tight mb-2">
                            iPhone
                        </h2>
                        <p class="text-xl md:text-2xl text-gray-600 mb-8">
                            Say hello to the latest
                        </p>
                        <div class="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                            <button @click=${() => navigate(`/product/${iphone.id}`)} class="apple-button">
                                Learn more
                            </button>
                            <button @click=${() => navigate('/products/iPhone')} class="apple-button apple-button-secondary">
                                Shop iPhone
                            </button>
                        </div>
                        <div class="flex justify-center gap-4 md:gap-8">
                            <img 
                                src="${getImageUrl('iphone 16 pro titanium black premium', 400, 0)}" 
                                alt="iPhone 16 Pro"
                                class="h-72 md:h-96 object-contain">
                            <img 
                                src="${getImageUrl('iphone 16 side view thin silver', 200, 1)}" 
                                alt="iPhone 16 side"
                                class="h-72 md:h-96 object-contain hidden sm:block">
                            <img 
                                src="${getImageUrl('iphone 16 purple lavender color', 400, 2)}" 
                                alt="iPhone 16"
                                class="h-72 md:h-96 object-contain">
                        </div>
                    </div>
                </section>

                <!-- AirPods Pro Section -->
                <section class="bg-white text-center py-16 px-4 border-t border-gray-100">
                    <div class="max-w-4xl mx-auto">
                        <h2 class="text-4xl md:text-6xl font-semibold text-apple-gray tracking-tight mb-2">
                            AirPods Pro 3
                        </h2>
                        <p class="text-xl md:text-2xl text-gray-600 mb-8">
                            The world's best in-ear<br>Active Noise Cancellation.
                        </p>
                        <div class="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                            <button @click=${() => navigate(`/product/${airpodsPro.id}`)} class="apple-button">
                                Learn more
                            </button>
                            <button class="apple-button apple-button-secondary">
                                Buy
                            </button>
                        </div>
                        <div class="flex justify-center">
                            <img 
                                src="${getImageUrl('airpods pro 3 floating white premium', 600, 0)}" 
                                alt="AirPods Pro"
                                class="max-w-xs md:max-w-sm">
                        </div>
                    </div>
                </section>

                <!-- iPad Air Section -->
                <section class="text-center py-16 px-4 overflow-hidden" style="background: linear-gradient(180deg, #e8f4fd 0%, #c5e3f6 100%);">
                    <div class="max-w-4xl mx-auto">
                        <div class="mb-2">
                            <span class="text-4xl md:text-5xl font-semibold text-apple-gray tracking-tight">iPad</span>
                            <span class="text-4xl md:text-5xl font-light italic text-apple-blue ml-1">air</span>
                        </div>
                        <p class="text-xl md:text-2xl text-gray-600 mb-8">
                            Now supercharged by the M3 chip.
                        </p>
                        <div class="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                            <button @click=${() => navigate(`/product/${ipadAir.id}`)} class="apple-button">
                                Learn more
                            </button>
                            <button class="apple-button apple-button-secondary">
                                Buy
                            </button>
                        </div>
                        <div class="relative">
                            <img 
                                src="${getImageUrl('ipad air m3 blue floating angle premium', 800, 0)}" 
                                alt="iPad Air"
                                class="mx-auto max-w-md md:max-w-xl">
                        </div>
                    </div>
                </section>

                <!-- Apple Watch Section -->
                <section class="bg-white text-center py-16 px-4 border-t border-gray-100">
                    <div class="max-w-4xl mx-auto">
                        <div class="flex items-center justify-center gap-2 mb-2">
                            <svg class="w-8 h-8" viewBox="0 0 50 50" fill="currentColor">
                                <path d="M25 2C12.3 2 2 12.3 2 25s10.3 23 23 23 23-10.3 23-23S37.7 2 25 2zm0 42c-10.5 0-19-8.5-19-19S14.5 6 25 6s19 8.5 19 19-8.5 19-19 19z"/>
                            </svg>
                            <span class="text-3xl md:text-4xl font-semibold tracking-tight">WATCH</span>
                            <span class="text-xl md:text-2xl font-light text-gray-500 ml-1">SERIES 11</span>
                        </div>
                        <p class="text-xl md:text-2xl text-gray-600 mb-8">
                            The ultimate way to<br>watch your health.
                        </p>
                        <div class="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                            <button @click=${() => navigate(`/product/${appleWatch.id}`)} class="apple-button">
                                Learn more
                            </button>
                            <button class="apple-button apple-button-secondary">
                                Buy
                            </button>
                        </div>
                        <div class="flex justify-center">
                            <img 
                                src="${getImageUrl('apple watch series 11 health fitness band', 600, 0)}" 
                                alt="Apple Watch Series 11"
                                class="max-w-xs md:max-w-sm">
                        </div>
                    </div>
                </section>

                <!-- Entertainment Section -->
                <section class="bg-white py-12 px-4">
                    <div class="max-w-6xl mx-auto">
                        <h2 class="text-3xl md:text-5xl font-semibold text-apple-gray tracking-tight mb-8 text-center">
                            Endless entertainment.
                        </h2>
                        
                        <!-- Carousel -->
                        <div class="relative">
                            <div class="flex gap-4 overflow-x-auto pb-6 scrollbar-hide scroll-snap-x px-4 -mx-4">
                                ${entertainmentItems.map((item, index) => this.html`
                                    <div 
                                        class="flex-shrink-0 w-72 md:w-96 scroll-snap-item rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 ${index === this.entertainmentIndex ? 'scale-100 opacity-100' : 'scale-95 opacity-70'}"
                                        @click=${() => this.setEntertainmentIndex(index)}>
                                        <div class="relative h-96 md:h-[500px] ${item.bg}">
                                            <img 
                                                src="${item.image}" 
                                                alt="${item.subtitle}"
                                                class="w-full h-full object-cover opacity-80">
                                            <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                                            <div class="absolute top-4 left-4 right-4">
                                                <div class="flex items-center gap-2">
                                                    <svg class="w-6 h-6 text-white" viewBox="0 0 50 50" fill="currentColor">
                                                        <path d="M25 2C12.3 2 2 12.3 2 25s10.3 23 23 23 23-10.3 23-23S37.7 2 25 2zm0 42c-10.5 0-19-8.5-19-19S14.5 6 25 6s19 8.5 19 19-8.5 19-19 19z"/>
                                                    </svg>
                                                    <span class="text-white text-sm font-medium">${item.title.replace('Apple ', '')}</span>
                                                </div>
                                            </div>
                                            <div class="absolute bottom-6 left-4 right-4 text-center text-white">
                                                <p class="text-sm text-white/80 mb-1">${item.genre}</p>
                                                <p class="text-lg mb-4">${item.description}</p>
                                                <button class="apple-button-light px-6 py-2 rounded-full text-sm font-medium">
                                                    Stream now
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                `)}
                            </div>
                        </div>

                        <!-- Service Cards -->
                        <div class="grid grid-cols-3 md:grid-cols-5 gap-3 mt-6">
                            ${[
                                { name: 'Apple Music', color: 'bg-gradient-to-br from-pink-500 to-red-600', icon: '♪' },
                                { name: 'Apple Arcade', color: 'bg-gradient-to-br from-blue-500 to-indigo-600', icon: '🎮' },
                                { name: 'Apple Fitness+', color: 'bg-gradient-to-br from-green-500 to-teal-600', icon: '🏃' },
                                { name: 'Apple News+', color: 'bg-gradient-to-br from-orange-500 to-red-500', icon: '📰' },
                                { name: 'iCloud+', color: 'bg-gradient-to-br from-blue-400 to-blue-600', icon: '☁️' }
                            ].map(service => this.html`
                                <div class="rounded-xl overflow-hidden cursor-pointer hover:scale-105 transition-transform ${service.color}">
                                    <div class="aspect-square flex flex-col items-center justify-center p-4 text-white">
                                        <span class="text-3xl mb-2">${service.icon}</span>
                                        <span class="text-xs text-center font-medium">${service.name}</span>
                                    </div>
                                </div>
                            `)}
                        </div>
                    </div>
                </section>

                <!-- More from Apple Section -->
                <section class="bg-black text-white py-12 px-4">
                    <div class="max-w-6xl mx-auto">
                        <h2 class="text-3xl md:text-5xl font-semibold tracking-tight mb-8 text-center">
                            More from Apple.
                        </h2>
                        
                        <div class="relative">
                            <div class="flex gap-4 overflow-x-auto pb-6 scrollbar-hide scroll-snap-x px-4 -mx-4">
                                ${moreFromApple.map((item, index) => this.html`
                                    <div class="flex-shrink-0 w-72 md:w-96 scroll-snap-item rounded-2xl overflow-hidden cursor-pointer hover:scale-[1.02] transition-transform">
                                        <div class="relative h-96 md:h-[500px]">
                                            <img 
                                                src="${item.image}" 
                                                alt="${item.title}"
                                                class="w-full h-full object-cover">
                                            <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                                            <div class="absolute bottom-6 left-4 right-4 text-center text-white">
                                                <h3 class="text-xl font-semibold mb-1">${item.title}</h3>
                                                <p class="text-sm text-white/80 mb-4">${item.subtitle}</p>
                                                <button class="apple-button-light px-6 py-2 rounded-full text-sm font-medium">
                                                    Watch the film
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                `)}
                            </div>
                        </div>

                        <!-- Carousel Indicators -->
                        <div class="flex justify-center items-center gap-2 mt-6">
                            ${moreFromApple.map((_, index) => this.html`
                                <button 
                                    class="carousel-dot ${index === this.moreFromAppleIndex ? 'active' : ''}"
                                    @click=${() => this.moreFromAppleIndex = index}>
                                </button>
                            `)}
                            <button class="ml-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                                <svg class="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
                                    <path d="M6 3.5l5 4.5-5 4.5V3.5z"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                </section>

                <!-- Product Grid - Explore -->
                <section class="bg-apple-lightgray py-16 px-4">
                    <div class="max-w-6xl mx-auto">
                        <h2 class="text-3xl md:text-4xl font-semibold text-apple-gray tracking-tight mb-8">
                            Explore the lineup.
                        </h2>
                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            ${productsStore.getFeaturedProducts().map(product => this.html`
                                <div 
                                    class="bg-white rounded-2xl overflow-hidden cursor-pointer apple-card"
                                    @click=${() => navigate(`/product/${product.id}`)}>
                                    <div class="p-6">
                                        ${product.badge ? this.html`
                                            <span class="text-apple-orange text-sm font-medium">${product.badge}</span>
                                        ` : ''}
                                        <h3 class="text-2xl font-semibold text-apple-gray mt-1 mb-1">
                                            ${product.name}
                                        </h3>
                                        <p class="text-gray-500 text-sm mb-4">${product.tagline}</p>
                                        <img 
                                            src="${product.image}" 
                                            alt="${product.name}"
                                            class="w-full h-48 object-contain mb-4">
                                        
                                        <!-- Color Dots -->
                                        ${product.colors && product.colors.length > 1 ? this.html`
                                            <div class="flex gap-2 mb-4">
                                                ${product.colors.slice(0, 4).map((color, i) => this.html`
                                                    <div 
                                                        class="w-3 h-3 rounded-full border border-gray-300"
                                                        style="background: ${this.getColorCode(color)}">
                                                    </div>
                                                `)}
                                            </div>
                                        ` : ''}
                                        
                                        <p class="text-base text-apple-gray mb-4">
                                            From ${formatCurrency(product.price)}
                                        </p>
                                        <div class="flex gap-4">
                                            <button class="apple-button text-sm py-2 px-4">Learn more</button>
                                            <button class="text-apple-blue hover:underline text-sm">Buy ›</button>
                                        </div>
                                    </div>
                                </div>
                            `)}
                        </div>
                    </div>
                </section>
            </div>
        `;
    }

    getColorCode(colorName) {
        const colors = {
            'Black Titanium': '#1d1d1f',
            'White Titanium': '#f5f5f0',
            'Natural Titanium': '#c4b6a6',
            'Blue Titanium': '#6e7b8b',
            'Black': '#1d1d1f',
            'White': '#f5f5f7',
            'Pink': '#f9d1cf',
            'Teal': '#5f9ea0',
            'Ultramarine': '#1e3a8a',
            'Blue': '#1e3a8a',
            'Green': '#2e8b57',
            'Yellow': '#ffd700',
            'Purple': '#9370db',
            'Midnight': '#1d1d1f',
            'Starlight': '#f5f5dc',
            'Space Gray': '#4a4a4a',
            'Silver': '#c0c0c0',
            'Red': '#dc143c',
            'Orange': '#ff8c00',
            'Space Black': '#1d1d1f',
            'Natural': '#c4b6a6'
        };
        return colors[colorName] || '#888';
    }
}

customElements.define('home-page', HomePage);
