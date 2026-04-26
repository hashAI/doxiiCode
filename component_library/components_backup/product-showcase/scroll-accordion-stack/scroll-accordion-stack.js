/**
 * Scroll Accordion Stack - Pinned Scrolling Accordion Component
 * Smooth scrolling accordion that stacks and collapses cards on scroll
 * Features: GSAP ScrollTrigger, pinning, smooth scroll effects
 *
 * Dependencies are loaded automatically from CDN:
 * - GSAP 3.12.5
 * - ScrollTrigger plugin
 *
 * @fires accordion-item-focus - Dispatched when an accordion item comes into focus during scroll
 * @fires accordion-item-collapse - Dispatched when an accordion item collapses
 * @fires accordion-item-activated - Dispatched when user activates an item via click or keyboard
 * @fires theme-changed - Dispatched when theme is toggled
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
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        return Promise.resolve();
    }

    try {
        await loadScript('https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js');
        await loadScript('https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js');

        // Wait a bit for GSAP to be available globally
        await new Promise(resolve => setTimeout(resolve, 100));

        if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
            gsap.registerPlugin(ScrollTrigger);
            return Promise.resolve();
        } else {
            throw new Error('GSAP or ScrollTrigger not available after loading');
        }
    } catch (error) {
        console.error('Failed to load GSAP dependencies:', error);
        throw error;
    }
};

export class ScrollAccordionStack extends LitElement {
    static properties = {
        items: { type: Array },
        theme: { type: String, reflect: true }
    };

    static styles = css`
        :host {
            display: block;
            --bg-gradient-start: #5c2fa6;
            --bg-gradient-end: #5a36c0;
            --accordion-1: linear-gradient(200deg, rgb(29, 145, 252) 13.57%, rgb(90, 54, 192) 98.38%);
            --accordion-2: linear-gradient(200deg, rgb(242, 136, 133) 13.57%, rgb(233, 79, 102) 98.38%);
            --accordion-3: linear-gradient(200deg, rgb(101, 187, 118) 13.57%, rgb(70, 111, 171) 98.38%);
            --accordion-4: linear-gradient(200deg, #c215d1 13.57%, #9813a1 98.38%);
            --text-primary: rgb(255, 255, 255);
            --text-secondary: rgba(255, 255, 255, 0.7);
            --shadow-color: rgba(0, 0, 0, 0.3);
            --title-shadow: rgba(0, 0, 0, 0.1);
        }

        :host([theme="dark"]) {
            --bg-gradient-start: #1a1a2e;
            --bg-gradient-end: #16213e;
            --accordion-1: linear-gradient(200deg, rgb(24, 120, 210) 13.57%, rgb(75, 45, 160) 98.38%);
            --accordion-2: linear-gradient(200deg, rgb(200, 110, 108) 13.57%, rgb(195, 65, 85) 98.38%);
            --accordion-3: linear-gradient(200deg, rgb(85, 155, 98) 13.57%, rgb(58, 92, 142) 98.38%);
            --accordion-4: linear-gradient(200deg, #a012b8 13.57%, #7f1088 98.38%);
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        #wrapper {
            position: relative;
            width: 100%;
            height: 100%;
        }

        #content {
            position: relative;
            width: 100%;
        }

        .scroll-container {
            margin: 0;
            background: var(--text-primary);
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background: linear-gradient(120deg, var(--bg-gradient-start) 13.57%, var(--bg-gradient-end) 98.38%);
            scroll-behavior: smooth;
            overflow-x: hidden;
        }

        .title {
            font-size: max(2vw, 24px);
            line-height: 1.1;
            padding-bottom: 0.4em;
            color: var(--text-primary);
            text-shadow: 0 2px 2px var(--title-shadow);
            font-weight: 600;
            letter-spacing: -0.02em;
        }

        .text {
            font-size: max(1vw, 15px);
            line-height: 1.4;
            overflow: hidden;
            padding-bottom: 20px;
            color: var(--text-secondary);
        }

        .accordions {
            display: flex;
            flex-direction: column;
            align-items: center;
            padding-bottom: 20vh;
        }

        .accordion {
            background: var(--accordion-1);
            width: max(50vw, 280px);
            padding: 25px 30px 10px;
            border-radius: 15px;
            margin-bottom: 40px;
            box-shadow: 0 30px 30px -10px var(--shadow-color);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            cursor: pointer;
        }

        .accordion:hover {
            transform: translateY(-5px);
            box-shadow: 0 40px 40px -15px var(--shadow-color);
        }

        .accordion:nth-child(1) {
            background: var(--accordion-1);
        }

        .accordion:nth-child(2) {
            background: var(--accordion-2);
        }

        .accordion:nth-child(3) {
            background: var(--accordion-3);
        }

        .accordion:nth-child(4) {
            background: var(--accordion-4);
        }

        .spacer {
            height: 70vh;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
            .accordion {
                width: max(80vw, 280px);
                padding: 15px 20px 8px;
            }

            .title {
                font-size: 20px;
            }

            .text {
                font-size: 14px;
            }

            .spacer {
                height: 50vh;
            }

            .accordions {
                padding-bottom: 10vh;
            }
        }

        @media (max-width: 480px) {
            .accordion {
                width: 90vw;
                margin-bottom: 30px;
            }

            .title {
                font-size: 18px;
            }

            .text {
                font-size: 13px;
            }
        }

        /* Accessibility */
        .accordion:focus {
            outline: 3px solid rgba(255, 255, 255, 0.5);
            outline-offset: 4px;
        }

        @media (prefers-reduced-motion: reduce) {
            .scroll-container {
                scroll-behavior: auto;
            }

            .accordion {
                transition: none;
            }

            .accordion:hover {
                transform: none;
            }
        }

        /* Loading state */
        :host([loading]) .accordions {
            opacity: 0;
        }
    `;

    constructor() {
        super();
        this.theme = 'light';
        this.items = [
            {
                title: 'Premium Quality Products',
                description: 'Discover our curated collection of high-quality products. Each item is carefully selected to meet the highest standards of craftsmanship and design, ensuring you receive nothing but the best for your lifestyle.'
            },
            {
                title: 'Fast & Free Shipping',
                description: 'Experience lightning-fast delivery with our advanced logistics network. Enjoy free shipping on all orders with real-time tracking, secure packaging, and hassle-free returns within 30 days.'
            },
            {
                title: 'Secure Checkout Process',
                description: 'Shop with confidence using our industry-leading security measures. Your payment information is encrypted end-to-end, and we support multiple payment methods including credit cards, PayPal, and digital wallets.'
            },
            {
                title: 'Award-Winning Support',
                description: 'Get help whenever you need it with our 24/7 customer support team. Chat with experts, schedule video calls, or browse our comprehensive knowledge base. We\'re here to make your shopping experience exceptional.'
            }
        ];
        this.scrollTriggerInstance = null;
    }

    async connectedCallback() {
        super.connectedCallback();
        await initDependencies();
    }

    firstUpdated() {
        requestAnimationFrame(() => {
            this.initGSAPAnimations();
        });
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        this.cleanupAnimations();
    }

    cleanupAnimations() {
        if (this.scrollTriggerInstance) {
            this.scrollTriggerInstance.kill();
            this.scrollTriggerInstance = null;
        }

        // Kill all ScrollTriggers created by this component
        if (typeof ScrollTrigger !== 'undefined') {
            ScrollTrigger.getAll().forEach(trigger => {
                if (trigger.vars && trigger.vars.id && trigger.vars.id.includes('accordion-stack')) {
                    trigger.kill();
                }
            });
        }
    }

    initGSAPAnimations() {
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

        if (!this.shadowRoot) {
            console.warn('Shadow DOM not ready, retrying...');
            setTimeout(() => this.setupAnimations(), 100);
            return;
        }

        const root = this.shadowRoot;
        const wrapper = root.querySelector('#wrapper');
        const content = root.querySelector('#content');
        const accordions = root.querySelector('.accordions');

        if (!wrapper || !content || !accordions) {
            console.warn('Required elements not found, retrying animations...');
            setTimeout(() => this.setupAnimations(), 200);
            return;
        }

        // Cleanup previous animations
        this.cleanupAnimations();

        // Note: ScrollSmoother is not compatible with Shadow DOM, so we use native smooth scrolling
        // Set smooth scrolling on the host element
        this.style.scrollBehavior = 'smooth';

        // Create accordion stacking animation
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: accordions,
                pin: true,
                start: 'top top',
                end: 'bottom top',
                scrub: 1,
                ease: 'linear',
                id: 'accordion-stack-main',
                onUpdate: (self) => {
                    const progress = self.progress;
                    const itemCount = this.items.length;
                    const currentItemIndex = Math.floor(progress * itemCount);

                    if (currentItemIndex !== this._lastItemIndex) {
                        this._lastItemIndex = currentItemIndex;
                        this.dispatchEvent(new CustomEvent('accordion-item-focus', {
                            detail: { index: currentItemIndex, item: this.items[currentItemIndex] },
                            bubbles: true,
                            composed: true
                        }));
                    }
                }
            }
        });

        // Animate text collapse
        tl.to(root.querySelectorAll('.accordion .text'), {
            height: 0,
            paddingBottom: 0,
            opacity: 0,
            stagger: 0.5,
            onComplete: () => {
                this.dispatchEvent(new CustomEvent('accordion-item-collapse', {
                    bubbles: true,
                    composed: true
                }));
            }
        });

        // Animate accordion stacking
        tl.to(root.querySelectorAll('.accordion'), {
            marginBottom: -15,
            stagger: 0.5,
        }, '<');

        this.scrollTriggerInstance = tl.scrollTrigger;

        console.log('Scroll Accordion Stack animations initialized');
    }

    handleThemeToggle() {
        this.theme = this.theme === 'light' ? 'dark' : 'light';
        this.dispatchEvent(new CustomEvent('theme-changed', {
            detail: { theme: this.theme },
            bubbles: true,
            composed: true
        }));
    }

    render() {
        return html`
            <div id="wrapper">
                <div id="content">
                    <div class="scroll-container">
                        <div class="spacer"></div>
                        <div class="accordions" role="list" aria-label="Product features">
                            ${this.items.map((item, index) => html`
                                <div
                                    class="accordion"
                                    role="listitem"
                                    tabindex="0"
                                    aria-label="${item.title}"
                                    @keydown="${(e) => this.handleAccordionKeydown(e, index)}"
                                >
                                    <div class="title">${item.title}</div>
                                    <div class="text">${item.description}</div>
                                </div>
                            `)}
                        </div>
                        <div class="spacer"></div>
                    </div>
                </div>
            </div>
        `;
    }

    handleAccordionKeydown(e, index) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this.dispatchEvent(new CustomEvent('accordion-item-activated', {
                detail: { index, item: this.items[index] },
                bubbles: true,
                composed: true
            }));
        }
    }
}

customElements.define('scroll-accordion-stack', ScrollAccordionStack);
