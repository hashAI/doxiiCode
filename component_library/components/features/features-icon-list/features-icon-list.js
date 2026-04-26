/**
 * Features Icon List - E-commerce features section with icon list
 * Features: Image on left, icon list on right, responsive design, dark/light mode
 *
 * @element features-icon-list
 * @fires feature-click - When a feature item is clicked with index and feature data
 */

import { BaseComponent } from '../../base-component.js';
import { html } from 'https://cdn.jsdelivr.net/npm/lit@3.2.1/+esm';

export class FeaturesIconList extends BaseComponent {
    static properties = {
        theme: { type: String },
        config: { type: Object }
    };

    constructor() {
        super();
        this.theme = 'light';

        this.config = {
            image: 'https://images.unsplash.com/photo-1607082349566-187342175e2f?q=80&w=500&h=600&auto=format&fit=crop',
            features: [
                {
                    icon: `<svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M14 18.667V24.5m4.668-8.167V24.5m4.664-12.833V24.5m2.333-21L15.578 13.587a.584.584 0 0 1-.826 0l-3.84-3.84a.583.583 0 0 0-.825 0L2.332 17.5M4.668 21v3.5m4.664-8.167V24.5" stroke="#7F22FE" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>`,
                    bgColor: 'violet',
                    title: 'Real-Time Analytics Dashboard',
                    description: 'Track your sales, customer behavior, and inventory levels with live data visualization and insights.'
                },
                {
                    icon: `<svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M14 11.667A2.333 2.333 0 0 0 11.667 14c0 1.19-.117 2.929-.304 4.667m4.972-3.36c0 2.776 0 7.443-1.167 10.36m5.004-1.144c.14-.7.502-2.683.583-3.523M2.332 14a11.667 11.667 0 0 1 21-7m-21 11.667h.01m23.092 0c.233-2.333.152-6.246 0-7" stroke="#00A63E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M5.832 22.75C6.415 21 6.999 17.5 6.999 14a7 7 0 0 1 .396-2.333m2.695 13.999c.245-.77.525-1.54.665-2.333m-.255-15.4A7 7 0 0 1 21 14v2.333" stroke="#00A63E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>`,
                    bgColor: 'green',
                    title: 'Bank-Grade Security',
                    description: 'End-to-end encryption, PCI compliance, fraud detection, and secure payment processing for all transactions.'
                },
                {
                    icon: `<svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4.668 25.666h16.333a2.333 2.333 0 0 0 2.334-2.333V8.166L17.5 2.333H7a2.333 2.333 0 0 0-2.333 2.333v4.667" stroke="#F54900" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M16.332 2.333V7a2.334 2.334 0 0 0 2.333 2.333h4.667m-21 8.167h11.667M10.5 21l3.5-3.5-3.5-3.5" stroke="#F54900" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>`,
                    bgColor: 'orange',
                    title: 'One-Click Export & Reports',
                    description: 'Export sales data, inventory reports, and customer analytics in multiple formats for easy sharing and analysis.'
                }
            ]
        };
    }

    connectedCallback() {
        super.connectedCallback();
        this._loadFonts();
    }

    _loadFonts() {
        if (!document.querySelector('link[href*="Poppins"]')) {
            const link = document.createElement('link');
            link.href = 'https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap';
            link.rel = 'stylesheet';
            document.head.appendChild(link);
        }
    }

    handleFeatureClick(index, feature) {
        this.emit('feature-click', { index, feature });
    }

    getBgColorClass(color, isDark) {
        const colors = {
            violet: isDark ? 'bg-violet-900/50' : 'bg-violet-100',
            green: isDark ? 'bg-green-900/50' : 'bg-green-100',
            orange: isDark ? 'bg-orange-900/50' : 'bg-orange-100'
        };
        return colors[color] || (isDark ? 'bg-gray-700' : 'bg-gray-100');
    }

    render() {
        const isDark = this.theme === 'dark';

        return html`
            <style>
                * {
                    font-family: 'Poppins', sans-serif;
                }
            </style>

            <section class="flex flex-col md:flex-row items-center py-16 px-4 ${isDark ? 'bg-slate-900' : 'bg-white'} transition-colors max-w-6xl mx-auto gap-10">
                <img
                    class="max-w-2xl w-full rounded-xl"
                    src="${this.config.image}"
                    alt="Features showcase"
                >
                <div class="space-y-10 px-4 md:px-0">
                    ${this.config.features.map((feature, index) => html`
                        <div
                            @click=${() => this.handleFeatureClick(index, feature)}
                            class="flex items-center justify-center gap-6 max-w-md cursor-pointer hover:scale-105 transition-transform duration-300"
                        >
                            <div class="p-6 aspect-square ${this.getBgColorClass(feature.bgColor, isDark)} rounded-full shrink-0 transition-colors">
                                ${this.unsafeHTML(feature.icon)}
                            </div>
                            <div class="space-y-2">
                                <h3 class="text-base font-semibold ${isDark ? 'text-slate-200' : 'text-slate-700'}">
                                    ${feature.title}
                                </h3>
                                <p class="text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}">
                                    ${feature.description}
                                </p>
                            </div>
                        </div>
                    `)}
                </div>
            </section>
        `;
    }

    unsafeHTML(html) {
        const template = document.createElement('template');
        template.innerHTML = html;
        return template.content;
    }
}

customElements.define('features-icon-list', FeaturesIconList);
