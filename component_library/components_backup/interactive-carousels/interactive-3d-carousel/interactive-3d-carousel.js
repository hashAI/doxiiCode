/**
 * Interactive 3D Carousel - 3D Product Showcase Carousel
 * Original design with reflection effects adapted for ecommerce
 * Features: GSAP animations, ScrollTrigger, Draggable, 3D transformations, infinite loop
 *
 * Dependencies are loaded automatically from CDN:
 * - GSAP 3.12.5
 * - ScrollTrigger plugin
 * - Draggable plugin
 *
 * @element interactive-3d-carousel
 *
 * @prop {Array} products - Array of product image URLs
 *
 * @fires product-click - Dispatched when a product is clicked
 *
 * @example
 * <interactive-3d-carousel></interactive-3d-carousel>
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

// Initialize dependencies
const initDependencies = async () => {
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined' && typeof Draggable !== 'undefined') {
        return Promise.resolve();
    }

    try {
        await loadScript('https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js');
        await loadScript('https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js');
        await loadScript('https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/Draggable.min.js');

        if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined' && typeof Draggable !== 'undefined') {
            gsap.registerPlugin(ScrollTrigger);
            gsap.registerPlugin(Draggable);
        }
    } catch (error) {
        console.error('Failed to load GSAP dependencies:', error);
    }
};

export class Interactive3DCarousel extends LitElement {
    static properties = {
        products: { type: Array },
        theme: { type: String }
    };

    static styles = css`
        * {
            box-sizing: border-box;
        }

        :host {
            display: block;
            --bg: hsl(0, 0%, 10%);
            --min-size: 200px;
        }

        .carousel-wrapper {
            display: grid;
            place-items: center;
            min-height: 100vh;
            padding: 0;
            margin: 0;
            overflow-y: hidden;
            background: var(--bg);
        }

        .drag-proxy {
            visibility: hidden;
            position: absolute;
        }


        .scroll-icon {
            height: 30px;
            position: fixed;
            top: 1rem;
            right: 1rem;
            color: hsl(0, 0%, 90%);
            animation: action 4s infinite;
        }

        @keyframes action {
            0%, 25%, 50%, 100% {
                transform: translate(0, 0);
            }
            12.5%, 37.5% {
                transform: translate(0, 25%);
            }
        }

        .boxes {
            height: 100vh;
            width: 100%;
            overflow: hidden;
            position: absolute;
            transform-style: preserve-3d;
            perspective: 800px;
            touch-action: none;
        }

        .box {
            transform-style: preserve-3d;
            position: absolute;
            top: 50%;
            left: 50%;
            height: 20vmin;
            width: 20vmin;
            min-height: var(--min-size);
            min-width: var(--min-size);
            display: none;
        }

        .box:after {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            height: 100%;
            width: 100%;
            background-image: var(--src);
            background-size: cover;
            transform: translate(-50%, -50%) rotate(180deg) translate(0, -100%) translate(0, -0.5vmin);
            opacity: 0.75;
        }

        .box:before {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            height: 100%;
            width: 100%;
            background: linear-gradient(var(--bg) 50%, transparent);
            transform: translate(-50%, -50%) rotate(180deg) translate(0, -100%) translate(0, -0.5vmin) scale(1.01);
            z-index: 2;
        }

        /* WebKit box-reflect support */
        @supports(-webkit-box-reflect: below) {
            .box {
                -webkit-box-reflect: below 0.5vmin linear-gradient(transparent 0 50%, white 100%);
            }

            .box:after,
            .box:before {
                display: none;
            }
        }

        .box img {
            position: absolute;
            height: 100%;
            width: 100%;
            top: 0;
            left: 0;
            object-fit: cover;
        }

        .box span {
            position: absolute;
            bottom: 0.5rem;
            left: 0.5rem;
            color: white;
            font-size: 2rem;
            font-weight: bold;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.8);
            z-index: 10;
        }

        /* Responsive */
        @media (max-width: 768px) {
            .box {
                height: 30vmin;
                width: 30vmin;
            }
        }

        @media (max-width: 480px) {
            .box {
                height: 40vmin;
                width: 40vmin;
            }
        }

        /* Accessibility */
        @media (prefers-reduced-motion: reduce) {
            .box,
            .scroll-icon {
                animation: none;
                transition: none;
            }
        }
    `;

    constructor() {
        super();
        // Default product images for ecommerce (sneakers/shoes)
        this.products = [
            'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=800&fit=crop',
            'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&h=800&fit=crop',
            'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=800&h=800&fit=crop',
            'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&h=800&fit=crop',
            'https://images.unsplash.com/photo-1603808033192-082d6919d3e1?w=800&h=800&fit=crop',
            'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&h=800&fit=crop',
            'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=800&h=800&fit=crop',
            'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=800&h=800&fit=crop',
            'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&h=800&fit=crop',
            'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=800&h=800&fit=crop'
        ];

        this.scrollFunc = null;
        this.draggableInstance = null;
        this.keydownHandler = null;
    }

    async connectedCallback() {
        super.connectedCallback();
        await initDependencies();
    }

    disconnectedCallback() {
        super.disconnectedCallback();

        // Clean up GSAP instances
        if (this.scrollFunc) {
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        }
        if (this.draggableInstance) {
            this.draggableInstance[0].kill();
        }
        if (this.keydownHandler) {
            document.removeEventListener('keydown', this.keydownHandler);
        }
    }

    firstUpdated() {
        requestAnimationFrame(() => {
            this.initGSAPAnimations();
        });
    }

    initGSAPAnimations() {
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || typeof Draggable === 'undefined') {
            console.warn('GSAP not loaded yet, retrying...');
            setTimeout(() => this.initGSAPAnimations(), 100);
            return;
        }

        this.setupCarousel();
    }

    setupCarousel() {
        if (!window.gsap || !window.ScrollTrigger || !window.Draggable) {
            console.warn('GSAP or plugins not available');
            return;
        }

        if (!this.shadowRoot) {
            console.warn('Shadow DOM not ready, retrying...');
            setTimeout(() => this.setupCarousel(), 100);
            return;
        }

        const root = this.shadowRoot;
        const BOXES = Array.from(root.querySelectorAll('.box'));

        if (!BOXES || BOXES.length === 0) {
            console.warn('Boxes not found, retrying...');
            setTimeout(() => this.setupCarousel(), 200);
            return;
        }

        console.log('Setting up 3D carousel with', BOXES.length, 'boxes');

        gsap.set(BOXES, {
            yPercent: -50,
        });

        const STAGGER = 0.1;
        const DURATION = 1;
        const OFFSET = 0;

        const LOOP = gsap.timeline({
            paused: true,
            repeat: -1,
            ease: 'none',
        });

        const SHIFTS = [...BOXES, ...BOXES, ...BOXES];

        SHIFTS.forEach((BOX, index) => {
            const BOX_TL = gsap
                .timeline()
                .set(BOX, {
                    xPercent: 250,
                    rotateY: -50,
                    opacity: 0,
                    scale: 0.5,
                })
                // Opacity && Scale
                .to(
                    BOX,
                    {
                        opacity: 1,
                        scale: 1,
                        duration: 0.1,
                    },
                    0
                )
                .to(
                    BOX,
                    {
                        opacity: 0,
                        scale: 0.5,
                        duration: 0.1,
                    },
                    0.9
                )
                // Panning
                .fromTo(
                    BOX,
                    {
                        xPercent: 250,
                    },
                    {
                        xPercent: -350,
                        duration: 1,
                        immediateRender: false,
                        ease: 'power1.inOut',
                    },
                    0
                )
                // Rotations
                .fromTo(
                    BOX,
                    {
                        rotateY: -50,
                    },
                    {
                        rotateY: 50,
                        immediateRender: false,
                        duration: 1,
                        ease: 'power4.inOut',
                    },
                    0
                )
                // Scale && Z
                .to(
                    BOX,
                    {
                        z: 100,
                        scale: 1.25,
                        duration: 0.1,
                        repeat: 1,
                        yoyo: true,
                    },
                    0.4
                )
                .fromTo(
                    BOX,
                    {
                        zIndex: 1,
                    },
                    {
                        zIndex: BOXES.length,
                        repeat: 1,
                        yoyo: true,
                        ease: 'none',
                        duration: 0.5,
                        immediateRender: false,
                    },
                    0
                );
            LOOP.add(BOX_TL, index * STAGGER);
        });

        const CYCLE_DURATION = STAGGER * BOXES.length;
        const START_TIME = CYCLE_DURATION + DURATION * 0.5 + OFFSET;

        const LOOP_HEAD = gsap.fromTo(
            LOOP,
            {
                totalTime: START_TIME,
            },
            {
                totalTime: `+=${CYCLE_DURATION}`,
                duration: 1,
                ease: 'none',
                repeat: -1,
                paused: true,
            }
        );

        const PLAYHEAD = {
            position: 0,
        };

        const POSITION_WRAP = gsap.utils.wrap(0, LOOP_HEAD.duration());

        const SCRUB = gsap.to(PLAYHEAD, {
            position: 0,
            onUpdate: () => {
                LOOP_HEAD.totalTime(POSITION_WRAP(PLAYHEAD.position));
            },
            paused: true,
            duration: 0.25,
            ease: 'power3',
        });

        let iteration = 0;
        const TRIGGER = ScrollTrigger.create({
            start: 0,
            end: '+=2000',
            horizontal: false,
            pin: root.querySelector('.boxes'),
            onUpdate: self => {
                const SCROLL = self.scroll();
                if (SCROLL > self.end - 1) {
                    WRAP(1, 1);
                } else if (SCROLL < 1 && self.direction < 0) {
                    WRAP(-1, self.end - 1);
                } else {
                    const NEW_POS = (iteration + self.progress) * LOOP_HEAD.duration();
                    SCRUB.vars.position = NEW_POS;
                    SCRUB.invalidate().restart();
                }
            },
        });

        const WRAP = (iterationDelta, scrollTo) => {
            iteration += iterationDelta;
            TRIGGER.scroll(scrollTo);
            TRIGGER.update();
        };

        const SNAP = gsap.utils.snap(1 / BOXES.length);

        const progressToScroll = progress =>
            gsap.utils.clamp(
                1,
                TRIGGER.end - 1,
                gsap.utils.wrap(0, 1, progress) * TRIGGER.end
            );

        const scrollToPosition = position => {
            const SNAP_POS = SNAP(position);
            const PROGRESS =
                (SNAP_POS - LOOP_HEAD.duration() * iteration) / LOOP_HEAD.duration();
            const SCROLL = progressToScroll(PROGRESS);
            if (PROGRESS >= 1 || PROGRESS < 0) return WRAP(Math.floor(PROGRESS), SCROLL);
            TRIGGER.scroll(SCROLL);
        };

        this.scrollFunc = scrollToPosition;

        ScrollTrigger.addEventListener('scrollEnd', () =>
            scrollToPosition(SCRUB.vars.position)
        );

        const NEXT = () => scrollToPosition(SCRUB.vars.position - 1 / BOXES.length);
        const PREV = () => scrollToPosition(SCRUB.vars.position + 1 / BOXES.length);

        // Keyboard navigation (only A/D keys to avoid conflicts with scrolling)
        this.keydownHandler = (event) => {
            // Ignore if key is being held down (prevent auto-repeat)
            if (event.repeat) return;

            if (event.code === 'KeyA') {
                NEXT();
                event.preventDefault();
            }
            if (event.code === 'KeyD') {
                PREV();
                event.preventDefault();
            }
        };
        document.addEventListener('keydown', this.keydownHandler);

        // Click on box to center
        root.querySelector('.boxes').addEventListener('click', e => {
            const BOX = e.target.closest('.box');
            if (BOX) {
                let TARGET = BOXES.indexOf(BOX);
                let CURRENT = gsap.utils.wrap(
                    0,
                    BOXES.length,
                    Math.floor(BOXES.length * SCRUB.vars.position)
                );
                let BUMP = TARGET - CURRENT;
                if (TARGET > CURRENT && TARGET - CURRENT > BOXES.length * 0.5) {
                    BUMP = (BOXES.length - BUMP) * -1;
                }
                if (CURRENT > TARGET && CURRENT - TARGET > BOXES.length * 0.5) {
                    BUMP = BOXES.length + BUMP;
                }
                scrollToPosition(SCRUB.vars.position + BUMP * (1 / BOXES.length));

                // Dispatch event
                this.dispatchEvent(new CustomEvent('product-click', {
                    detail: { index: TARGET, image: this.products[TARGET] },
                    bubbles: true,
                    composed: true
                }));
            }
        });

        gsap.set(BOXES, { display: 'block' });

        // Dragging
        this.draggableInstance = Draggable.create(root.querySelector('.drag-proxy'), {
            type: 'x',
            trigger: BOXES,
            onPress() {
                this.startOffset = SCRUB.vars.position;
            },
            onDrag() {
                SCRUB.vars.position = this.startOffset + (this.startX - this.x) * 0.001;
                SCRUB.invalidate().restart();
            },
            onDragEnd() {
                scrollToPosition(SCRUB.vars.position);
            },
        });

        console.log('3D Carousel setup complete! Try scrolling, dragging, arrow keys, or clicking.');
    }

    render() {
        return html`
            <div class="carousel-wrapper">
                <div class="boxes">
                    ${this.products.map((product, index) => html`
                        <div class="box" style="--src: url(${product})">
                            <span>${index + 1}</span>
                            <img src="${product}" alt="Product ${index + 1}" />
                        </div>
                    `)}
                </div>
                <svg class="scroll-icon" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M20 6H23L19 2L15 6H18V18H15L19 22L23 18H20V6M9 3.09C11.83 3.57 14 6.04 14 9H9V3.09M14 11V15C14 18.3 11.3 21 8 21S2 18.3 2 15V11H14M7 9H2C2 6.04 4.17 3.57 7 3.09V9Z"></path>
                </svg>
                <div class="drag-proxy"></div>
            </div>
        `;
    }
}

customElements.define('interactive-3d-carousel', Interactive3DCarousel);
