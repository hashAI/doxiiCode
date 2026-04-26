import { BaseComponent } from './base-component.js';
import { themeStore } from '../assets/state.js';

class ThemeToggle extends BaseComponent {
    static properties = {
        theme: { type: String }
    };

    constructor() {
        super();
        this.theme = 'light';
    }

    connectedCallback() {
        super.connectedCallback();
        // Subscribe to theme changes (callback is called immediately with current theme)
        this.unsubscribe = themeStore.subscribe((theme) => {
            this.theme = theme;
            this.requestUpdate();
        });
        // Ensure initial render
        this.requestUpdate();
    }

    updated(changedProperties) {
        super.updated?.(changedProperties);
        // Ensure icons are initialized after render
        if (window.lucide) {
            window.lucide.createIcons(this);
        }
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        this.unsubscribe?.();
    }

    handleToggle() {
        themeStore.toggle();
    }

    render() {
        const isDark = this.theme === 'dark';

        return this.html`
            <button
                @click=${this.handleToggle}
                class="p-2 touch-scale rounded-lg transition-colors hover:bg-noir-800/50 text-noir-300 hover:text-gold-400"
                aria-label="Toggle theme">
                ${isDark ? this.html`
                    <i data-lucide="sun" class="w-5 h-5"></i>
                ` : this.html`
                    <i data-lucide="moon" class="w-5 h-5"></i>
                `}
            </button>
        `;
    }
}

customElements.define('theme-toggle', ThemeToggle);
