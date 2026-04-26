/**
 * Luxury Product Showcase - Smooth Scrolling Product Display
 * Inspired by smooth scroll galleries with parallax effects
 * Features: GSAP animations, smooth scrolling, split-screen layout, parallax images
 *
 * Dependencies are loaded automatically from CDN:
 * - GSAP 3.12.5
 * - ScrollTrigger plugin
 * - Google Fonts (Playfair Display & Inter)
 */

import { LitElement, html, css } from 'https://cdn.jsdelivr.net/npm/lit@3.2.1/+esm';

// Load GSAP and dependencies
const loadScript = (src) => {
    return new Promise((resolve, reject) => {
        if (document.querySelector(`script[src="${src}"]`)) {
            resolve();
            return;
        }
        const script = document.createElement('script');
        script.src = src;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
};

// Load Google Fonts
const loadFonts = () => {
    if (document.querySelector('link[href*="Playfair+Display"]')) {
        return;
    }
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;700&family=Inter:wght@300;400;500;600;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
};

// Initialize dependencies
const initDependencies = async () => {
    loadFonts();

    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        return Promise.resolve();
    }

    try {
        await loadScript('https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js');
        await loadScript('https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js');

        if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
            gsap.registerPlugin(ScrollTrigger);
        }
    } catch (error) {
        console.error('Failed to load GSAP dependencies:', error);
    }
};

export class LuxuryProductShowcase extends LitElement {
    static properties = {
        products: { type: Array },
        theme: { type: String }
    };

    static styles = css`
        :host {
            display: block;
            --dark: #1a1a1a;
            --light: #f8f8f8;
            --accent: #8b7355;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        .showcase-stage {
            position: relative;
            background: var(--light);
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            color: var(--dark);
            line-height: 1.6;
            visibility: visible;
            opacity: 1;
        }


        /* Product Slides */
        .product-slide {
            display: flex;
            min-height: 100vh;
            overflow: hidden;
        }

        .product-slide-1 { background: #e8d7cc; }
        .product-slide-2 { background: #d5dbe5; }
        .product-slide-3 { background: #f3e5d3; }
        .product-slide-4 { background: #e5ebe8; }

        .product-col {
            flex: 1;
        }

        .product-col-left {
            position: relative;
            z-index: 1;
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
            padding: 4rem 3rem 6rem;
        }

        .product-col-right {
            position: relative;
            overflow: hidden;
        }

        .product-number {
            font-size: 0.875rem;
            letter-spacing: 0.2em;
            color: rgba(26, 26, 26, 0.5);
            margin-bottom: 1rem;
        }

        .product-title {
            font-family: 'Playfair Display', serif;
            font-size: clamp(4rem, 8vw, 7rem);
            line-height: 1;
            margin-bottom: 2rem;
            letter-spacing: -0.02em;
        }

        .title-line {
            display: block;
            overflow: hidden;
        }

        .title-line:nth-child(2) {
            margin-top: -1rem;
        }

        .product-details {
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
            max-width: 400px;
        }

        .product-description {
            font-size: 1rem;
            line-height: 1.7;
            color: rgba(26, 26, 26, 0.8);
        }

        .product-price {
            font-size: 2rem;
            font-weight: 300;
            font-family: 'Playfair Display', serif;
        }

        .product-actions {
            display: flex;
            align-items: center;
            gap: 2rem;
        }

        .add-to-cart-btn {
            position: relative;
            display: flex;
            align-items: center;
            gap: 1rem;
            background: var(--dark);
            color: white;
            border: none;
            padding: 1rem 2rem;
            cursor: pointer;
            transition: all 0.4s ease;
            font-size: 0.95rem;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }

        .add-to-cart-btn:hover {
            background: var(--accent);
            transform: translateY(-2px);
        }

        .btn-circle {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            border: 1px solid white;
        }

        .view-details-link {
            color: var(--dark);
            text-decoration: none;
            font-size: 0.95rem;
            position: relative;
            padding-bottom: 2px;
            transition: color 0.3s ease;
        }

        .view-details-link::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 1px;
            background: currentColor;
            transform: scaleX(0);
            transform-origin: right;
            transition: transform 0.4s ease;
        }

        .view-details-link:hover::after {
            transform: scaleX(1);
            transform-origin: left;
        }

        .scroll-indicator {
            position: absolute;
            right: -113px;
            bottom: 3.5vw;
            display: block;
            width: 140px;
            height: 140px;
            background: var(--dark);
            overflow: hidden;
            text-decoration: none;
            transition: transform 0.3s ease;
        }

        .scroll-indicator:hover {
            transform: translateX(-5px);
        }

        .scroll-line {
            position: absolute;
            left: 26px;
            bottom: 0;
            width: 1px;
            height: 100%;
            transition: transform 0.3s ease;
        }

        /* Scroll line colors match slide backgrounds */
        .product-slide-1 .scroll-line {
            background: #e8d7cc;
        }

        .product-slide-2 .scroll-line {
            background: #d5dbe5;
        }

        .product-slide-3 .scroll-line {
            background: #f3e5d3;
        }

        .product-slide-4 .scroll-line {
            background: #e5ebe8;
        }

        .product-image-wrap {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 130vh;
            overflow: hidden;
        }

        .product-img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }


        /* Responsive */
        @media (max-width: 1024px) {
            .product-slide { flex-direction: column; }
            .product-col-left {
                min-height: 100vh;
                padding: 4rem 2rem;
                background: rgba(255, 255, 255, 0.9);
            }
            .product-col-right {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100vh;
                z-index: 0;
            }
            .scroll-indicator { display: none; }
        }

        @media (max-width: 768px) {
            .product-col-left { padding: 4rem 1.5rem; }
            .product-title { font-size: 3.5rem; }
            .product-details { max-width: 100%; }
            .product-actions {
                flex-direction: column;
                align-items: flex-start;
                gap: 1rem;
            }
        }
    `;

    constructor() {
        super();
        this.products = [
            {
                number: '01',
                name: 'Heritage Watch',
                description: 'A timepiece that transcends generations. Precision-crafted with Swiss movement and Italian leather.',
                price: '$2,450',
                image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200&h=1600&fit=crop',
                bgColor: '#e8d7cc'
            },
            {
                number: '02',
                name: 'Leather Satchel',
                description: 'Full-grain leather bag handcrafted by artisans. Designed for the modern professional.',
                price: '$890',
                image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=1200&h=1600&fit=crop',
                bgColor: '#d5dbe5'
            },
            {
                number: '03',
                name: 'Ceramic Vase',
                description: 'Minimalist design meets traditional craftsmanship. Hand-thrown and glazed to perfection.',
                price: '$320',
                image: 'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=1200&h=1600&fit=crop',
                bgColor: '#f3e5d3'
            },
            {
                number: '04',
                name: 'Wool Blanket',
                description: 'Merino wool woven with care. Sustainable luxury that keeps you warm in style.',
                price: '$560',
                image: 'https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=1200&h=1600&fit=crop',
                bgColor: '#e5ebe8'
            }
        ];
    }

    async connectedCallback() {
        super.connectedCallback();
        // Load dependencies before component renders
        await initDependencies();
    }

    firstUpdated() {
        // Wait a frame to ensure DOM is ready
        requestAnimationFrame(() => {
            this.initGSAPAnimations();
        });
    }

    initGSAPAnimations() {
        // Check if GSAP is loaded
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
            console.warn('GSAP not loaded yet, retrying...');
            setTimeout(() => this.initGSAPAnimations(), 100);
            return;
        }

        this.setupAnimations();
    }

    setupAnimations() {
        if (!window.gsap || !window.ScrollTrigger) {
            console.warn('GSAP or ScrollTrigger not available');
            return;
        }

        // Check if Shadow DOM is ready
        if (!this.shadowRoot) {
            console.warn('Shadow DOM not ready, retrying...');
            setTimeout(() => this.setupAnimations(), 100);
            return;
        }

        const root = this.shadowRoot;

        // Make sure elements exist
        const productSlides = root.querySelectorAll('.product-slide');

        if (!productSlides || productSlides.length === 0) {
            console.warn('Product slides not found, retrying animations...');
            setTimeout(() => this.setupAnimations(), 200);
            return;
        }

        console.log('Setting up animations with GSAP...');

        // Product slide animations with ScrollTrigger
        productSlides.forEach((slide, i) => {
            const title = slide.querySelector('.product-title');
            const details = slide.querySelector('.product-details');
            const imageWrap = slide.querySelector('.product-image-wrap');
            const scrollLine = slide.querySelector('.scroll-line');

            if (title) {
                gsap.from(title, {
                    scrollTrigger: {
                        trigger: slide,
                        start: 'top 80%',
                        end: 'top 50%',
                        toggleActions: 'play none none none',
                        // For Shadow DOM, we need to use the window as scroller
                        scroller: window
                    },
                    y: 80,
                    opacity: 0,
                    duration: 1,
                    ease: 'power3.out'
                });
            }

            if (details) {
                gsap.from(details, {
                    scrollTrigger: {
                        trigger: slide,
                        start: 'top 80%',
                        end: 'top 50%',
                        toggleActions: 'play none none none',
                        scroller: window
                    },
                    y: 50,
                    opacity: 0,
                    duration: 0.8,
                    ease: 'power3.out',
                    delay: 0.2
                });
            }

            // Animate scroll indicator line
            if (scrollLine) {
                gsap.to(scrollLine, {
                    scrollTrigger: {
                        trigger: slide,
                        start: 'top 80%',
                        end: 'top 50%',
                        toggleActions: 'play none none none',
                        scroller: window
                    },
                    scaleY: 0.6,
                    transformOrigin: 'bottom left',
                    duration: 2.5,
                    ease: 'elastic(1, 0.5)'
                });
            }

            // Parallax effect on images
            if (imageWrap) {
                gsap.fromTo(imageWrap,
                    { y: '-15%' },
                    {
                        scrollTrigger: {
                            trigger: slide,
                            start: 'top bottom',
                            end: 'bottom top',
                            scrub: 1,
                            scroller: window
                        },
                        y: '15%',
                        ease: 'none'
                    }
                );
            }
        });

        console.log('Animations setup complete!');
    }

    render() {
        return html`
            <div class="showcase-stage">
                <!-- Product Slides -->
                ${this.products.map((product, index) => html`
                    <section class="product-slide product-slide-${index + 1}" style="background: ${product.bgColor}">
                        <div class="product-col product-col-left">
                            <div class="product-content">
                                <div class="product-number">${product.number}</div>
                                <h2 class="product-title">
                                    ${product.name.split(' ').map(word => html`<span class="title-line">${word}</span>`)}
                                </h2>
                                <div class="product-details">
                                    <p class="product-description">${product.description}</p>
                                    <div class="product-price">${product.price}</div>
                                    <div class="product-actions">
                                        <button class="add-to-cart-btn" @click="${() => this.handleAddToCart(product)}">
                                            <span class="btn-circle"></span>
                                            <span class="btn-text">Add to Cart</span>
                                        </button>
                                        <a href="#" class="view-details-link" @click="${(e) => this.handleViewDetails(e, product)}">View Details</a>
                                    </div>
                                </div>
                            </div>
                            ${index < this.products.length - 1 ? html`
                                <a href="#product-${index + 2}" class="scroll-indicator">
                                    <span class="scroll-line"></span>
                                </a>
                            ` : ''}
                        </div>
                        <div class="product-col product-col-right">
                            <div class="product-image-wrap">
                                <img class="product-img" src="${product.image}" alt="${product.name}" />
                            </div>
                        </div>
                    </section>
                `)}
            </div>
        `;
    }

    handleAddToCart(product) {
        this.dispatchEvent(new CustomEvent('add-to-cart', {
            detail: { product },
            bubbles: true,
            composed: true
        }));
    }

    handleViewDetails(e, product) {
        e.preventDefault();
        this.dispatchEvent(new CustomEvent('view-details', {
            detail: { product },
            bubbles: true,
            composed: true
        }));
    }
}

customElements.define('luxury-product-showcase', LuxuryProductShowcase);
