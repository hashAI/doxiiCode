/**
 * Product Portfolio Showcase - Interactive Scrolling Product Display
 * Inspired by creative portfolio showcases with scroll-based animations
 * Features: GSAP animations, Splitting.js text effects, custom cursor, scroll triggers, modal details
 *
 * Dependencies loaded automatically from CDN:
 * - GSAP 3.12.5
 * - ScrollTrigger plugin
 * - Splitting.js for text animations
 *
 * @property {Array} products - Array of product objects to showcase
 * @property {String} theme - Theme mode: 'light' or 'dark'
 *
 * @event product-view - Fired when user clicks to view product details
 * @event product-close - Fired when user closes product detail modal
 * @event add-to-cart - Fired when user clicks add to cart button in modal
 *
 * @example
 * <product-portfolio-showcase></product-portfolio-showcase>
 */

import { LitElement, html, css } from 'https://cdn.jsdelivr.net/npm/lit@3.2.1/+esm';

// Load external scripts
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
    if (document.querySelector('link[href*="Lexend+Mega"]')) {
        return;
    }
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Lexend+Mega:wght@300;400;500;600;700&family=Inter:wght@400;500;600&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
};

// Initialize dependencies
const initDependencies = async () => {
    loadFonts();

    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined' && typeof Splitting !== 'undefined') {
        return Promise.resolve();
    }

    try {
        await loadScript('https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js');
        await loadScript('https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js');
        await loadScript('https://unpkg.com/splitting@1.0.6/dist/splitting.min.js');

        if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
            gsap.registerPlugin(ScrollTrigger);
        }
    } catch (error) {
        console.error('Failed to load dependencies:', error);
    }
};

export class ProductPortfolioShowcase extends LitElement {
    static properties = {
        products: { type: Array },
        theme: { type: String },
        _activeProduct: { type: Object, state: true },
        _showModal: { type: Boolean, state: true },
        _loaded: { type: Boolean, state: true }
    };

    static styles = css`
        :host {
            display: block;
            --bg-light: #eeece5;
            --gold: #a58725;
            --cyan: #00eded;
            --orange: #fe4e01;
            --pink: #eb98b4;
            --dark-green: #08350e;
            --text-dark: #1a1a1a;

            /* Theme colors */
            --bg-color: var(--bg-light);
            --text-color: var(--text-dark);
            --accent-primary: var(--gold);
            --accent-secondary: var(--orange);
        }

        :host([theme="dark"]) {
            --bg-color: #1a1a1a;
            --text-color: #eeece5;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        .showcase-container {
            background: var(--bg-color);
            color: var(--text-color);
            font-family: 'Lexend Mega', -apple-system, BlinkMacSystemFont, sans-serif;
            cursor: none;
            position: relative;
            transition: background-color 0.3s ease, color 0.3s ease;
            pointer-events: none;
        }

        .showcase-container.modal-active {
            cursor: auto;
        }

        .showcase-container.modal-active .cursor {
            display: none;
        }

        .showcase-container.loaded {
            pointer-events: all;
        }

        .showcase-container.loaded h1 {
            transform: scaleX(1);
            transition: transform 0.3s cubic-bezier(1, 0.885, 0.32, 1);
            transition-delay: 1.75s;
        }

        .showcase-container.loaded .panel {
            transition-delay: 1.75s;
        }

        .showcase-container.loaded .subhead {
            transition-delay: 2s;
        }

        /* Custom Cursor */
        .cursor {
            position: fixed;
            z-index: 97;
            width: 30px;
            height: 30px;
            border-radius: 100%;
            top: 0;
            left: 0;
            border: 2px solid var(--accent-primary);
            box-shadow: inset 0 0 0 0 var(--accent-primary);
            pointer-events: none;
            display: flex;
            justify-content: center;
            align-items: center;
            opacity: 0;
            transition: opacity 0.3s ease, border-width 0.3s ease, box-shadow 0.3s ease;
            will-change: transform;
        }

        .cursor.visible {
            opacity: 1;
        }

        .cursor.link-hover {
            border-color: transparent;
            border-width: 4px;
            box-shadow: 0 0 0 2px var(--accent-secondary);
        }

        .cursor.active .cursor-circle {
            box-shadow: inset 0 0 0 20px var(--accent-primary);
        }

        .cursor.active .cursor-text {
            opacity: 1;
        }

        .cursor-circle {
            position: relative;
            width: 30px;
            height: 30px;
            border-radius: 100%;
            transition: 0.3s ease;
        }

        .cursor-text {
            position: absolute;
            width: 0;
            height: 0;
            left: 50%;
            top: 50%;
            font-size: 10px;
            color: var(--text-color);
            opacity: 0;
            transition: 0.3s ease;
            animation: rotate 10s linear infinite;
            animation-play-state: paused;
        }

        .cursor.active .cursor-text {
            animation-play-state: running;
        }

        @keyframes rotate {
            to { transform: rotate(360deg); }
        }

        .cursor-char {
            position: absolute;
            left: calc(50% - 5px);
            top: calc(50% - 30px);
            width: 10px;
            height: 10px;
            display: flex;
            justify-content: center;
            align-items: center;
            transform-origin: 50% 30px;
            font-size: 10px;
            color: var(--text-color);
        }

        .cursor-char:nth-child(1) { transform: rotate(0deg); }
        .cursor-char:nth-child(2) { transform: rotate(40deg); }
        .cursor-char:nth-child(3) { transform: rotate(80deg); }

        /* Loader */
        .loader {
            display: flex;
            justify-content: center;
            align-items: center;
            color: var(--bg-color);
            position: fixed;
            width: 100vw;
            height: 100vh;
            top: 0;
            left: 0;
            z-index: 999;
            background: var(--accent-secondary);
            transition: transform 0.6s cubic-bezier(1, 0.885, 0.32, 1);
            transition-delay: 1.25s;
            transform-origin: bottom;
        }

        .loader.loaded {
            transform: scaleY(0);
        }

        .loader-wrap {
            animation: spinner-rotate 5s linear infinite;
        }

        @keyframes spinner-rotate {
            to { transform: rotate(360deg); }
        }

        .loader-text {
            color: #fff;
            font-size: 12px;
            animation: popping 0.25s ease-in-out infinite alternate;
        }

        @keyframes popping {
            to { transform: translateY(10px); }
        }

        /* Main Wrapper */
        .wrap {
            display: block;
            width: 1000px;
            max-width: 85vw;
            margin: 0 auto;
            padding: 2.5vh 50px 25vh;
            transition: 0.5s cubic-bezier(1, 0.885, 0.32, 1);
            overflow: hidden;
            position: relative;
        }

        .wrap.modal-active {
            transform: translateX(-125vw);
        }

        /* Title */
        h1 {
            --progress: 0;
            text-align: center;
            font-family: 'Lexend Mega', sans-serif;
            color: transparent;
            font-size: 100px;
            position: relative;
            width: 100%;
            line-height: 0.9;
            padding: 10px 0;
            overflow: hidden;
            margin-bottom: 20px;
            transform: scaleX(0);
            transition: transform 0.3s cubic-bezier(1, 0.885, 0.32, 1);
        }

        h1::before,
        h1::after {
            content: '';
            position: absolute;
            width: 100%;
            height: 2px;
            bottom: 0;
            left: 0;
            background: var(--accent-primary);
            z-index: 2;
        }

        h1::after {
            transform-origin: left;
            background: var(--accent-secondary);
            z-index: 3;
            transform: scaleX(calc(1 - (var(--progress) * 2)));
        }

        .title-word {
            position: relative;
            display: inline-block;
            color: var(--text-color);
            -webkit-text-fill-color: transparent;
            -webkit-text-stroke: 2px var(--text-color);
            transform: translateY(calc((var(--progress) * 1200px) - 200px));
        }

        .subhead {
            width: 100%;
            text-align: center;
            position: relative;
            color: var(--accent-primary);
            font-size: 1rem;
            opacity: 0;
            transform: translateY(50px);
            transition: 0.6s ease-in-out;
            margin-bottom: 5vh;
        }

        .subhead.visible {
            opacity: 1;
            transform: translateY(0);
        }

        .subhead.final {
            color: var(--text-color);
            display: block;
            margin: 0 auto;
            width: 100px;
        }

        /* Product Panel */
        .panel {
            --progress: 0;
            position: relative;
            width: 100%;
            height: 100vh;
            margin-bottom: 25vh;
            max-height: 75vh;
            display: grid;
            grid-template-columns: repeat(5, 1fr);
            grid-template-rows: repeat(5, 1fr);
            padding: 20px;
            opacity: 0;
            transition: 1s cubic-bezier(1, 0.885, 0.32, 1);
        }

        .panel.visible {
            opacity: 1;
        }

        .panel::before {
            font-family: 'Lexend Mega', sans-serif;
            font-size: 400px;
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            width: 40%;
            display: flex;
            left: 0;
            justify-content: flex-start;
            align-items: center;
            color: var(--bg-color);
            -webkit-text-stroke: 2px var(--accent-primary);
            line-height: 1;
            opacity: 0;
            transition: 1.75s ease-in-out;
        }

        .panel.visible::before {
            opacity: 0.15;
        }

        .panel:nth-of-type(1)::before { content: '1'; }
        .panel:nth-of-type(2)::before { content: '2'; }
        .panel:nth-of-type(3)::before { content: '3'; }
        .panel:nth-of-type(4)::before { content: '4'; }
        .panel:nth-of-type(5)::before { content: '5'; }
        .panel:nth-of-type(6)::before { content: '6'; }
        .panel:nth-of-type(7)::before { content: '7'; }
        .panel:nth-of-type(8)::before { content: '8'; }
        .panel:nth-of-type(9)::before { content: '9'; }
        .panel:nth-of-type(10)::before { content: '10'; }

        .panel:nth-of-type(even)::before {
            left: auto;
            right: 0;
            justify-content: flex-end;
        }

        .panel h2 {
            grid-area: 3 / 1 / 4 / 4;
            font-family: 'Lexend Mega', sans-serif;
            font-size: 64px;
            position: relative;
            z-index: 3;
            color: transparent;
            line-height: 1;
            pointer-events: none;
            transform: translateY(calc(100px - (var(--progress) * 200px)));
        }

        .panel:nth-of-type(even) h2 {
            text-align: right;
            grid-area: 3 / 3 / 4 / 6;
        }

        .panel-title-word {
            position: relative;
            display: inline-block;
            color: transparent;
            padding: 20px 0;
            margin: -20px 0;
        }

        .panel-title-char {
            color: transparent;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-image: linear-gradient(
                to bottom,
                transparent 25%,
                var(--accent-secondary) 25%,
                var(--accent-secondary) 75%,
                transparent 75%
            );
            background-size: 100% 250%;
            background-position: 50% calc((var(--progress) * 200px) - 150px);
            -webkit-text-stroke: 2px var(--accent-secondary);
        }

        /* Thumbnail */
        .thumb {
            grid-area: 2 / 3 / 5 / 6;
            position: relative;
            box-shadow: 0 0 0 2px var(--text-color);
            border-radius: 5px;
            cursor: pointer;
            transition: box-shadow 0.3s ease;
        }

        .panel:nth-of-type(even) .thumb {
            grid-area: 2 / 1 / 5 / 4;
        }

        .thumb:hover {
            box-shadow: 0 0 0 2px var(--accent-primary), 0 0 0 6px var(--bg-color), 0 0 0 8px var(--accent-secondary);
        }

        .thumb::before {
            content: '';
            position: absolute;
            width: 100%;
            height: 100%;
            left: 5%;
            top: 5%;
            box-shadow: 0 0 0 2px var(--accent-primary);
            transition: transform 0.2s cubic-bezier(1, 0.885, 0.32, 1);
            background: radial-gradient(
                circle at center,
                var(--accent-primary) 1px,
                transparent 1px
            ) 0px 0px / 20px 20px,
            radial-gradient(
                circle at center,
                var(--accent-primary) 1px,
                transparent 1px
            ) 10px 10px / 20px 20px;
            border-radius: 5px;
        }

        .thumb:hover::before {
            transform: translate(-5%, -5%);
        }

        .thumb-label {
            position: absolute;
            width: 100%;
            top: -30px;
            margin: 0;
            color: var(--accent-primary);
            font-size: 12px;
            left: 0;
            text-align: center;
        }

        .thumb-inner {
            position: absolute;
            width: 100%;
            height: 100%;
            left: 0;
            top: 0;
            overflow: hidden;
            z-index: 0;
            border-radius: 5px;
        }

        .thumb-inner::before {
            content: '';
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            background: var(--accent-primary);
            mix-blend-mode: lighten;
            opacity: 0.2;
            z-index: 2;
            pointer-events: none;
        }

        .thumb-inner::after {
            content: '';
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            background: var(--bg-color);
            opacity: 0.15;
            z-index: 0;
            mix-blend-mode: normal;
            pointer-events: none;
        }

        .thumb img {
            mix-blend-mode: overlay;
            padding: 2vmin;
            position: absolute;
            top: -75%;
            left: 50%;
            transform: translateY(calc(var(--progress) * 25%)) translateX(-50%);
            width: auto;
            height: 200%;
            z-index: 1;
            filter: saturate(0) blur(calc(50px - (var(--progress) * 125px))) brightness(0.5) contrast(4);
            border-radius: 5px;
            object-fit: cover;
        }

        /* Modal */
        .modal-frame {
            position: fixed;
            z-index: 98;
            left: 0;
            top: 0;
            width: 100vw;
            height: 100vh;
            background: var(--bg-color);
            display: grid;
            place-items: center;
            transition: 0.5s cubic-bezier(1, 0.885, 0.32, 1);
            transform: translateX(125%);
            cursor: auto;
        }

        .modal-frame.active {
            transform: translateX(0);
        }

        .modal-close {
            position: absolute;
            left: 45px;
            top: 45px;
            width: 30px;
            height: 30px;
            box-shadow: 0 0 0 2px var(--text-color);
            background: var(--bg-color);
            border-radius: 100%;
            cursor: pointer !important;
            transition: transform 0.3s ease, box-shadow 0.2s ease;
            z-index: 999;
        }

        .modal-close:hover {
            box-shadow: 0 0 0 2px var(--accent-secondary), inset 0 0 0 20px var(--accent-secondary);
            transform: scale(1.1);
        }

        .modal-close::before,
        .modal-close::after {
            content: '';
            position: absolute;
            width: 10px;
            height: 2px;
            background: var(--text-color);
            top: calc(50% - 1px);
            left: 14px;
            transition: 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        .modal-close::before {
            transform: rotate(-45deg);
        }

        .modal-close::after {
            transform: rotate(45deg);
        }

        .modal-content {
            width: calc(100% - 10vw);
            height: calc(100% - 10vw);
            max-width: 1200px;
            max-height: 800px;
            background: var(--bg-color);
            border-radius: 5px;
            padding: 4rem;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
            align-items: flex-start;
        }

        .modal-content img {
            align-self: center;
        }

        .modal-content button {
            cursor: pointer !important;
        }

        /* Responsive */
        @media (max-width: 1024px) {
            h1 { font-size: 60px; }
            .panel h2 { font-size: 48px; }
            .panel::before { font-size: 250px; }
        }

        @media (max-width: 768px) {
            h1 { font-size: 40px; }
            .panel h2 {
                font-size: 32px;
                grid-area: 2 / 1 / 3 / 6 !important;
                text-align: left !important;
            }
            .thumb {
                grid-area: 3 / 1 / 5 / 6 !important;
            }
            .panel::before { font-size: 150px; }
            .cursor { display: none; }
            .showcase-container { cursor: auto; }
        }
    `;

    constructor() {
        super();
        this.products = [
            {
                name: 'Premium Leather Watch',
                category: 'Luxury Timepieces',
                description: 'Swiss-made precision meets Italian craftsmanship',
                image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200&h=1600&fit=crop&q=80',
                price: '$2,450',
                id: 'watch-1'
            },
            {
                name: 'Artisan Ceramic Vase',
                category: 'Home Decor',
                description: 'Hand-thrown pottery with minimalist aesthetics',
                image: 'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=1200&h=1600&fit=crop&q=80',
                price: '$320',
                id: 'ceramic-1'
            },
            {
                name: 'Designer Wool Blanket',
                category: 'Textiles',
                description: 'Sustainable merino wool woven with care',
                image: 'https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=1200&h=1600&fit=crop&q=80',
                price: '$560',
                id: 'blanket-1'
            },
            {
                name: 'Heritage Leather Bag',
                category: 'Accessories',
                description: 'Full-grain leather satchel for professionals',
                image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=1200&h=1600&fit=crop&q=80',
                price: '$890',
                id: 'bag-1'
            }
        ];
        this.theme = 'light';
        this._activeProduct = null;
        this._showModal = false;
        this._loaded = false;
        this._mousePos = { x: 0, y: 0 };
    }

    async connectedCallback() {
        super.connectedCallback();
        await initDependencies();
        setTimeout(() => {
            this._loaded = true;
            // Refresh ScrollTrigger after load
            setTimeout(() => {
                if (typeof ScrollTrigger !== 'undefined') {
                    ScrollTrigger.refresh();
                }
            }, 500);
        }, 1500);
    }

    firstUpdated() {
        requestAnimationFrame(() => {
            setTimeout(() => {
                this.initAnimations();
                this.initCursor();
                this.initThumbHoverEffects();
            }, 100);
        });
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        // Clean up ScrollTrigger instances
        if (typeof ScrollTrigger !== 'undefined') {
            ScrollTrigger.getAll().forEach(trigger => {
                if (trigger.trigger && this.shadowRoot?.contains(trigger.trigger)) {
                    trigger.kill();
                }
            });
        }
    }

    initCursor() {
        const cursor = this.shadowRoot.querySelector('.cursor');
        if (!cursor) return;

        const updateCursor = (e) => {
            this._mousePos.x = e.clientX;
            this._mousePos.y = e.clientY;
            cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
        };

        window.addEventListener('mousemove', updateCursor);

        // Show cursor on hover
        this.addEventListener('mouseenter', () => {
            cursor.classList.add('visible');
        });

        this.addEventListener('mouseleave', () => {
            cursor.classList.remove('visible');
        });
    }

    initThumbHoverEffects() {
        const cursor = this.shadowRoot.querySelector('.cursor');
        const thumbs = this.shadowRoot.querySelectorAll('.thumb');

        thumbs.forEach(thumb => {
            thumb.addEventListener('mouseenter', () => {
                cursor?.classList.add('active');
            });

            thumb.addEventListener('mouseleave', () => {
                cursor?.classList.remove('active');
            });
        });
    }

    initAnimations() {
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
            setTimeout(() => this.initAnimations(), 100);
            return;
        }

        const panels = this.shadowRoot.querySelectorAll('.panel');

        panels.forEach((panel, index) => {
            // Panel visibility on scroll
            gsap.to(panel, {
                scrollTrigger: {
                    trigger: panel,
                    start: 'top 90%',
                    end: 'top 60%',
                    onEnter: () => panel.classList.add('visible'),
                    scroller: window
                }
            });

            // Scroll progress tracking for animations
            gsap.to(panel, {
                scrollTrigger: {
                    trigger: panel,
                    start: 'top 100%',
                    end: 'bottom 25%',
                    scrub: 0,
                    scroller: window,
                    onUpdate: (self) => {
                        panel.style.setProperty('--progress', self.progress);
                    }
                }
            });
        });

        // Full page scroll progress for title
        const h1 = this.shadowRoot.querySelector('h1');
        if (h1) {
            gsap.to(h1, {
                scrollTrigger: {
                    trigger: this.shadowRoot.querySelector('.wrap'),
                    start: 'top 100%',
                    end: '50% 50%',
                    scrub: 0,
                    scroller: window,
                    onUpdate: (self) => {
                        h1.style.setProperty('--progress', self.progress);
                    }
                }
            });
        }
    }

    handleThumbClick(product) {
        this._activeProduct = product;
        this._showModal = true;

        this.dispatchEvent(new CustomEvent('product-view', {
            detail: { product },
            bubbles: true,
            composed: true
        }));
    }

    closeModal() {
        this._showModal = false;
        this._activeProduct = null;

        this.dispatchEvent(new CustomEvent('product-close', {
            bubbles: true,
            composed: true
        }));
    }

    handleAddToCart(product) {
        this.dispatchEvent(new CustomEvent('add-to-cart', {
            detail: { product },
            bubbles: true,
            composed: true
        }));
    }

    render() {
        return html`
            <div class="showcase-container ${this._loaded ? 'loaded' : ''} ${this._showModal ? 'modal-active' : ''}">
                <!-- Loader -->
                <div class="loader ${this._loaded ? 'loaded' : ''}">
                    <div class="loader-wrap">
                        <span class="loader-text">L</span>
                        <span class="loader-text">O</span>
                        <span class="loader-text">A</span>
                        <span class="loader-text">D</span>
                        <span class="loader-text">I</span>
                        <span class="loader-text">N</span>
                        <span class="loader-text">G</span>
                    </div>
                </div>

                <!-- Custom Cursor -->
                <div class="cursor">
                    <div class="cursor-circle">
                        <div class="cursor-text">
                            <span class="cursor-char">S</span>
                            <span class="cursor-char">E</span>
                            <span class="cursor-char">E</span>
                        </div>
                    </div>
                </div>

                <!-- Main Content -->
                <div class="wrap ${this._showModal ? 'modal-active' : ''}">
                    <h1>
                        <span class="title-word" data-word="Selected">Selected</span>
                        <span class="title-word" data-word="Products">Products</span>
                    </h1>

                    <p class="subhead ${this._loaded ? 'visible' : ''}">Premium Collection</p>

                    ${this.products.map((product, index) => html`
                        <div class="panel">
                            <h2>
                                ${product.name.split(' ').map(word => html`
                                    <span class="panel-title-word">
                                        ${word.split('').map(char => html`
                                            <span class="panel-title-char">${char}</span>
                                        `)}
                                    </span>
                                `)}
                            </h2>
                            <div class="thumb" @click="${() => this.handleThumbClick(product)}">
                                <p class="thumb-label">${product.category} • ${product.price}</p>
                                <div class="thumb-inner">
                                    <img src="${product.image}" alt="${product.name}" loading="lazy" />
                                </div>
                            </div>
                        </div>
                    `)}

                    <p class="subhead final ${this._loaded ? 'visible' : ''}">Fin</p>
                </div>

                <!-- Modal -->
                <div class="modal-frame ${this._showModal ? 'active' : ''}">
                    <div class="modal-close" @click="${this.closeModal}"></div>
                    ${this._activeProduct ? html`
                        <div class="modal-content">
                            <h2 style="font-size: 3rem; margin-bottom: 1rem; font-family: 'Lexend Mega', sans-serif;">${this._activeProduct.name}</h2>
                            <p style="font-size: 1.2rem; color: var(--accent-primary); margin-bottom: 2rem;">${this._activeProduct.category}</p>
                            <img src="${this._activeProduct.image}" alt="${this._activeProduct.name}" style="width: 100%; max-width: 600px; margin-bottom: 2rem; border-radius: 8px;" />
                            <p style="font-size: 1.1rem; line-height: 1.8; margin-bottom: 2rem;">${this._activeProduct.description}</p>
                            <p style="font-size: 2rem; font-weight: 600; margin-bottom: 2rem;">${this._activeProduct.price}</p>
                            <button @click="${() => this.handleAddToCart(this._activeProduct)}" style="padding: 1rem 2rem; background: var(--accent-secondary); color: white; border: none; font-size: 1rem; cursor: pointer; border-radius: 4px; font-weight: 600; transition: all 0.3s ease;" onmouseover="this.style.background='var(--gold)'; this.style.transform='scale(1.05)'" onmouseout="this.style.background='var(--accent-secondary)'; this.style.transform='scale(1)'">Add to Cart</button>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }
}

customElements.define('product-portfolio-showcase', ProductPortfolioShowcase);
