/**
 * About Video Content - E-commerce about section with video/image and content
 * Features: Video/image with play button, content section, CTA button, responsive design, dark/light mode
 *
 * @element about-video-content
 * @fires video-play - When video play button is clicked
 * @fires read-more-click - When read more button is clicked
 */

import { BaseComponent } from '../../base-component.js';
import { html } from 'https://cdn.jsdelivr.net/npm/lit@3.2.1/+esm';

export class AboutVideoContent extends BaseComponent {
    static properties = {
        theme: { type: String },
        config: { type: Object }
    };

    constructor() {
        super();
        this.theme = 'light';

        this.config = {
            badge: 'What we do?',
            videoThumbnail: 'https://images.unsplash.com/photo-1531497865144-0464ef8fb9a9?q=80&w=450&h=450&auto=format&fit=crop',
            content: [
                'Our platform helps you discover and purchase the best products tailored to your lifestyle and preferences.',
                'Whether you\'re looking for the latest fashion trends, home essentials, or tech gadgets, our curated marketplace connects you with trusted sellers worldwide.',
                'From personalized recommendations to secure checkout and fast shipping, our platform empowers you to shop with confidence and convenience.'
            ],
            buttonText: 'Explore Products',
            buttonUrl: '#'
        };
    }

    connectedCallback() {
        super.connectedCallback();
        this._loadFonts();
        this._initLucide();
    }

    updated(changedProperties) {
        super.updated(changedProperties);
        if (changedProperties.has('theme')) {
            this._initLucide();
        }
    }

    _loadFonts() {
        if (!document.querySelector('link[href*="Poppins"]')) {
            const link = document.createElement('link');
            link.href = 'https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap';
            link.rel = 'stylesheet';
            document.head.appendChild(link);
        }
    }

    _initLucide() {
        if (window.lucide) {
            setTimeout(() => {
                window.lucide.createIcons();
            }, 0);
        } else {
            const script = document.createElement('script');
            script.src = 'https://unpkg.com/lucide@latest';
            script.onload = () => {
                setTimeout(() => {
                    window.lucide.createIcons();
                }, 0);
            };
            document.head.appendChild(script);
        }
    }

    handleVideoPlay() {
        this.emit('video-play', {});
    }

    handleReadMoreClick(e) {
        e.preventDefault();
        this.emit('read-more-click', { url: this.config.buttonUrl });
    }

    render() {
        const isDark = this.theme === 'dark';

        return html`
            <style>
                * {
                    font-family: 'Poppins', sans-serif;
                }
            </style>

            <section class="flex flex-col md:flex-row items-center justify-center gap-10 max-md:px-4 py-16 ${isDark ? 'bg-slate-900' : 'bg-white'} transition-colors max-w-6xl mx-auto">
                <div class="relative shadow-2xl ${isDark ? 'shadow-indigo-900/40' : 'shadow-indigo-600/40'} rounded-2xl overflow-hidden shrink-0">
                    <img
                        class="max-w-md w-full object-cover rounded-2xl"
                        src="${this.config.videoThumbnail}"
                        alt="About our platform"
                    >
                    <button
                        @click=${() => this.handleVideoPlay()}
                        class="gap-1 max-w-72 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 border-2 border-white size-16 flex items-center justify-center aspect-square backdrop-blur rounded-full hover:scale-110 transition-transform duration-300"
                        aria-label="Play video"
                    >
                        <i data-lucide="play" class="w-6 h-6 text-white ml-1"></i>
                    </button>
                </div>
                <div class="text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'} max-w-lg">
                    <h1 class="text-xl uppercase font-semibold ${isDark ? 'text-slate-200' : 'text-slate-700'}">
                        ${this.config.badge}
                    </h1>
                    <div class="w-24 h-[3px] rounded-full bg-gradient-to-r ${isDark ? 'from-indigo-500 to-indigo-300' : 'from-indigo-600 to-[#DDD9FF]'}"></div>
                    ${this.config.content.map((paragraph, index) => html`
                        <p class="${index === 0 ? 'mt-8' : 'mt-4'}">${paragraph}</p>
                    `)}
                    <button
                        @click=${(e) => this.handleReadMoreClick(e)}
                        class="flex items-center gap-2 mt-8 hover:-translate-y-0.5 transition bg-gradient-to-r ${isDark ? 'from-indigo-600 to-indigo-800 hover:from-indigo-700 hover:to-indigo-900' : 'from-indigo-600 to-[#8A7DFF] hover:from-indigo-700 hover:to-[#7B6EFF]'} py-3 px-8 rounded-full text-white"
                    >
                        <span>${this.config.buttonText}</span>
                        <svg width="13" height="12" viewBox="0 0 13 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M12.53 6.53a.75.75 0 0 0 0-1.06L7.757.697a.75.75 0 1 0-1.06 1.06L10.939 6l-4.242 4.243a.75.75 0 0 0 1.06 1.06zM0 6v.75h12v-1.5H0z"
                                fill="#fff"
                            />
                        </svg>
                    </button>
                </div>
            </section>
        `;
    }
}

customElements.define('about-video-content', AboutVideoContent);
