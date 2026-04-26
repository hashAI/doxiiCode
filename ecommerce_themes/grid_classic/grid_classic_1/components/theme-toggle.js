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
        this.unsubscribe = themeStore.subscribe((theme) => {
            this.theme = theme;
        });
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
                class="p-2 touch-feedback rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
                aria-label="Toggle theme">
                ${isDark ? this.html`
                    <i data-lucide="sun" class="w-6 h-6 text-yellow-500"></i>
                ` : this.html`
                    <i data-lucide="moon" class="w-6 h-6 text-gray-700"></i>
                `}
            </button>
        `;
    }
}

customElements.define('theme-toggle', ThemeToggle);
