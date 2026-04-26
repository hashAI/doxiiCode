import { LitElement, html } from 'https://cdn.jsdelivr.net/npm/lit@3.2.1/+esm';
import { ensureIcons, refreshAOS } from '../assets/utils.js';

export class BaseComponent extends LitElement {
    createRenderRoot() {
        return this;
    }

    updated(changed) {
        super.updated?.(changed);
        ensureIcons(this);
        refreshAOS();
    }

    html(strings, ...values) {
        return html(strings, ...values);
    }

    readJsonAttr(name, fallback = null) {
        try {
            const value = this.getAttribute(name);
            return value ? JSON.parse(value) : fallback;
        } catch (error) {
            console.warn(`Unable to parse attribute ${name}`, error);
            return fallback;
        }
    }

    getParams() {
        const attr = this.getAttribute('data-params');
        return attr ? JSON.parse(attr) : {};
    }

    getQuery() {
        const attr = this.getAttribute('data-query');
        return attr ? JSON.parse(attr) : {};
    }
}

customElements.define('store-base', BaseComponent);

