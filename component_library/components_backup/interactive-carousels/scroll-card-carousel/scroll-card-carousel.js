/**
 * Scroll Card Carousel - Interactive Product Card Stack
 * Inspired by scroll-based card stacking with seamless looping
 * Features: GSAP animations, scroll-based navigation, drag support, seamless looping
 *
 * Dependencies are loaded automatically from CDN:
 * - GSAP 3.12.5
 * - ScrollTrigger plugin
 * - Draggable plugin
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
            gsap.registerPlugin(ScrollTrigger, Draggable);
        }
    } catch (error) {
        console.error('Failed to load GSAP dependencies:', error);
    }
};

export class ScrollCardCarousel extends LitElement {
    static properties = {
        cards: { type: Array },
        theme: { type: String, reflect: true }
    };

    static styles = css`
        * {
            box-sizing: border-box;
        }

        :host {
            display: block;
            min-height: 100vh;
            padding: 0;
            margin: 0;
        }

        :host([theme="dark"]) {
            background: #0a0a0a;
        }

        :host([theme="light"]) {
            background: #f5f5f5;
        }

        :host(:not([theme])) {
            background: #111;
        }

        .gallery {
            position: absolute;
            width: 100%;
            height: 100vh;
            overflow: hidden;
        }

        .cards {
            position: absolute;
            width: 14rem;
            height: 18rem;
            top: 40%;
            left: 50%;
            transform: translate(-50%, -50%);
            padding: 0;
            margin: 0;
            list-style: none;
        }

        .cards li {
            list-style: none;
            padding: 0;
            margin: 0;
            width: 14rem;
            aspect-ratio: 9/16;
            text-align: center;
            line-height: 18rem;
            font-size: 2rem;
            position: absolute;
            background-size: contain;
            background-position: center;
            background-repeat: no-repeat;
            top: 0;
            left: 0;
            border-radius: 0.8rem;
            cursor: grab;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        }

        .cards li:active {
            cursor: grabbing;
        }

        .actions {
            position: absolute;
            bottom: 25px;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 1rem;
            z-index: 100;
        }

        .actions button {
            background: rgba(255, 255, 255, 0.9);
            border: none;
            padding: 0.75rem 1.5rem;
            border-radius: 2rem;
            cursor: pointer;
            font-size: 0.95rem;
            font-weight: 600;
            color: #111;
            transition: all 0.3s ease;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }

        :host([theme="dark"]) .actions button {
            background: rgba(255, 255, 255, 0.95);
            color: #0a0a0a;
        }

        :host([theme="light"]) .actions button {
            background: rgba(0, 0, 0, 0.85);
            color: #fff;
        }

        .actions button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(0, 0, 0, 0.4);
        }

        .actions button:active {
            transform: translateY(0);
        }

        .drag-proxy {
            visibility: hidden;
            position: absolute;
        }

        /* Responsive */
        @media (max-width: 768px) {
            .cards {
                width: 11rem;
                height: 15rem;
            }

            .cards li {
                width: 11rem;
            }

            .actions {
                bottom: 15px;
                gap: 0.75rem;
            }

            .actions button {
                padding: 0.6rem 1.2rem;
                font-size: 0.85rem;
            }
        }

        @media (max-width: 480px) {
            .cards {
                width: 10rem;
                height: 14rem;
            }

            .cards li {
                width: 10rem;
            }

            .actions button {
                padding: 0.5rem 1rem;
                font-size: 0.8rem;
            }
        }
    `;

    constructor() {
        super();
        this.theme = 'dark';
        this.cards = [
            {
                id: 1,
                image: 'https://assets.codepen.io/16327/portrait-number-01.png',
                title: 'Portrait 01'
            },
            {
                id: 2,
                image: 'https://assets.codepen.io/16327/portrait-number-02.png',
                title: 'Portrait 02'
            },
            {
                id: 3,
                image: 'https://assets.codepen.io/16327/portrait-number-03.png',
                title: 'Portrait 03'
            },
            {
                id: 4,
                image: 'https://assets.codepen.io/16327/portrait-number-04.png',
                title: 'Portrait 04'
            },
            {
                id: 5,
                image: 'https://assets.codepen.io/16327/portrait-number-05.png',
                title: 'Portrait 05'
            },
            {
                id: 6,
                image: 'https://assets.codepen.io/16327/portrait-number-06.png',
                title: 'Portrait 06'
            },
            {
                id: 7,
                image: 'https://assets.codepen.io/16327/portrait-number-07.png',
                title: 'Portrait 07'
            }
        ];

        // Animation state
        this.iteration = 0;
        this.seamlessLoop = null;
        this.playhead = { offset: 0 };
        this.scrub = null;
        this.trigger = null;
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
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || typeof Draggable === 'undefined') {
            console.warn('GSAP not loaded yet, retrying...');
            setTimeout(() => this.initGSAPAnimations(), 100);
            return;
        }

        this.setupAnimations();
    }

    setupAnimations() {
        if (!window.gsap || !window.ScrollTrigger || !window.Draggable) {
            console.warn('GSAP or plugins not available');
            return;
        }

        // Check if Shadow DOM is ready
        if (!this.shadowRoot) {
            console.warn('Shadow DOM not ready, retrying...');
            setTimeout(() => this.setupAnimations(), 100);
            return;
        }

        const root = this.shadowRoot;
        const cardElements = root.querySelectorAll('.cards li');
        const gallery = root.querySelector('.gallery');

        if (!cardElements || cardElements.length === 0 || !gallery) {
            console.warn('Card elements not found, retrying animations...');
            setTimeout(() => this.setupAnimations(), 200);
            return;
        }

        console.log('Setting up scroll card carousel animations with GSAP...');

        // Set initial state of items
        gsap.set(cardElements, { xPercent: 400, opacity: 0, scale: 0 });

        const spacing = 0.1;
        const snapTime = gsap.utils.snap(spacing);
        const cards = Array.from(cardElements);
        const component = this;

        // Animation function for each card
        const animateFunc = element => {
            const tl = gsap.timeline();
            tl.fromTo(element,
                { scale: 0, opacity: 0 },
                { scale: 1, opacity: 1, zIndex: 100, duration: 0.5, yoyo: true, repeat: 1, ease: "power1.in", immediateRender: false }
            ).fromTo(element,
                { xPercent: 400 },
                { xPercent: -400, duration: 1, ease: "none", immediateRender: false },
                0
            );
            return tl;
        };

        // Build seamless loop
        this.seamlessLoop = this.buildSeamlessLoop(cards, spacing, animateFunc);

        const wrapTime = gsap.utils.wrap(0, this.seamlessLoop.duration());

        // Scrub tween
        this.scrub = gsap.to(this.playhead, {
            offset: 0,
            onUpdate: () => {
                this.seamlessLoop.time(wrapTime(this.playhead.offset));
            },
            duration: 0.5,
            ease: "power3",
            paused: true
        });

        // Helper function to convert progress to scroll position
        const progressToScroll = progress =>
            gsap.utils.clamp(1, this.trigger.end - 1, gsap.utils.wrap(0, 1, progress) * this.trigger.end);

        // Wrap function for infinite scrolling
        const wrap = (iterationDelta, scrollTo) => {
            this.iteration += iterationDelta;
            this.trigger.scroll(scrollTo);
            this.trigger.update();
        };

        // ScrollTrigger for scroll-based navigation
        this.trigger = ScrollTrigger.create({
            trigger: gallery,
            start: 0,
            onUpdate(self) {
                let scroll = self.scroll();
                if (scroll > self.end - 1) {
                    wrap(1, 2);
                } else if (scroll < 1 && self.direction < 0) {
                    wrap(-1, self.end - 2);
                } else {
                    component.scrub.vars.offset = (component.iteration + self.progress) * component.seamlessLoop.duration();
                    component.scrub.invalidate().restart();
                }
            },
            end: "+=3000",
            pin: gallery
        });

        // Scroll to offset function
        const scrollToOffset = (offset) => {
            let snappedTime = snapTime(offset);
            let progress = (snappedTime - component.seamlessLoop.duration() * component.iteration) / component.seamlessLoop.duration();
            let scroll = progressToScroll(progress);
            if (progress >= 1 || progress < 0) {
                return wrap(Math.floor(progress), scroll);
            }
            component.trigger.scroll(scroll);
        };

        // Snap to closest card when scrolling stops
        ScrollTrigger.addEventListener("scrollEnd", () => scrollToOffset(component.scrub.vars.offset));

        // Button controls
        const nextBtn = root.querySelector('.next');
        const prevBtn = root.querySelector('.prev');

        if (nextBtn) {
            nextBtn.addEventListener("click", () => scrollToOffset(this.scrub.vars.offset + spacing));
        }
        if (prevBtn) {
            prevBtn.addEventListener("click", () => scrollToOffset(this.scrub.vars.offset - spacing));
        }

        // Dragging functionality
        const dragProxy = root.querySelector('.drag-proxy');
        const cardsContainer = root.querySelector('.cards');

        if (dragProxy && cardsContainer) {
            let startOffset = 0;

            Draggable.create(dragProxy, {
                type: "x",
                trigger: cardsContainer,
                onPress() {
                    startOffset = component.scrub?.vars?.offset || 0;
                },
                onDrag() {
                    const offset = startOffset + (this.startX - this.x) * 0.001;
                    component.scrub.vars.offset = offset;
                    component.scrub.invalidate().restart();
                },
                onDragEnd() {
                    scrollToOffset(component.scrub.vars.offset);
                }
            });
        }

        console.log('Scroll card carousel animations setup complete!');
    }

    buildSeamlessLoop(items, spacing, animateFunc) {
        let overlap = Math.ceil(1 / spacing);
        let startTime = items.length * spacing + 0.5;
        let loopTime = (items.length + overlap) * spacing + 1;
        let rawSequence = gsap.timeline({ paused: true });
        let seamlessLoop = gsap.timeline({
            paused: true,
            repeat: -1,
            onRepeat() {
                this._time === this._dur && (this._tTime += this._dur - 0.01);
            }
        });

        let l = items.length + overlap * 2;
        let time, i, index;

        for (i = 0; i < l; i++) {
            index = i % items.length;
            time = i * spacing;
            rawSequence.add(animateFunc(items[index]), time);
            if (i <= items.length) {
                seamlessLoop.add("label" + i, time);
            }
        }

        rawSequence.time(startTime);
        seamlessLoop.to(rawSequence, {
            time: loopTime,
            duration: loopTime - startTime,
            ease: "none"
        }).fromTo(rawSequence,
            { time: overlap * spacing + 1 },
            {
                time: startTime,
                duration: startTime - (overlap * spacing + 1),
                immediateRender: false,
                ease: "none"
            }
        );

        return seamlessLoop;
    }

    handleCardClick(card) {
        this.dispatchEvent(new CustomEvent('card-click', {
            detail: { card },
            bubbles: true,
            composed: true
        }));
    }

    render() {
        return html`
            <div class="gallery">
                <ul class="cards">
                    ${this.cards.map(card => html`
                        <li
                            style="background-image: url(${card.image})"
                            @click="${() => this.handleCardClick(card)}"
                            title="${card.title}"
                        ></li>
                    `)}
                </ul>
                <div class="actions">
                    <button class="prev">Prev</button>
                    <button class="next">Next</button>
                </div>
            </div>
            <div class="drag-proxy"></div>
        `;
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        // Clean up ScrollTrigger instances
        if (this.trigger) {
            this.trigger.kill();
        }
        // Clean up any other ScrollTrigger instances
        if (typeof ScrollTrigger !== 'undefined') {
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        }
    }
}

// Only define if not already defined (prevents duplicate registration errors)
if (!customElements.get('scroll-card-carousel')) {
    customElements.define('scroll-card-carousel', ScrollCardCarousel);
}
