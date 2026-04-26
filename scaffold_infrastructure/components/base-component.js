/* eslint-disable import/no-unresolved */
/* global customElements */
/**
 * Base Component for all Lit Components
 *
 * This is the ONLY file that imports from Lit CDN.
 * All other components extend this base class.
 *
 * Features:
 * - No Shadow DOM (Tailwind works directly)
 * - Auto icon refresh
 * - Auto AOS refresh
 * - Helper methods for common tasks
 */

import { LitElement, html, nothing } from 'https://cdn.jsdelivr.net/npm/lit@3.2.1/+esm';
import { ensureIcons, refreshAOS } from '../assets/utils.js';

export class BaseComponent extends LitElement {
    /**
     * Disable Shadow DOM so Tailwind CSS works
     */
    createRenderRoot() {
        return this;
    }

    /**
     * Lifecycle: After component updates
     * Refresh icons and animations
     */
    updated(changedProperties) {
        super.updated(changedProperties);
        ensureIcons(this);
        refreshAOS();
    }

    /**
     * Helper: Read JSON from data attributes
     */
    readJsonAttr(name, fallback = null) {
        try {
            const value = this.getAttribute(name);
            return value ? JSON.parse(value) : fallback;
        } catch (e) {
            console.warn(`Error parsing JSON attribute "${name}":`, e);
            return fallback;
        }
    }

    /**
     * Helper: Write JSON to data attributes
     */
    writeJsonAttr(name, value) {
        this.setAttribute(name, JSON.stringify(value));
    }

    /**
     * Helper: Get route params
     */
    getParams() {
        return this.readJsonAttr('data-params', {});
    }

    /**
     * Helper: Get query params
     */
    getQuery() {
        return this.readJsonAttr('data-query', {});
    }

    /**
     * Helper: Emit custom event
     */
    emit(eventName, detail = {}) {
        this.dispatchEvent(new CustomEvent(eventName, {
            detail,
            bubbles: true,
            composed: true
        }));
    }

    /**
     * Expose html template literal
     */
    html(strings, ...values) {
        return html(strings, ...values);
    }

    /**
     * Expose nothing for conditional rendering
     */
    nothing() {
        return nothing;
    }
}

// Register base component (not meant to be used directly)
customElements.define('base-component', BaseComponent);
