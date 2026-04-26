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

import { LitElement, css } from 'https://cdn.jsdelivr.net/npm/lit@3/+esm';

export class BaseComponent extends LitElement {
    /**
     * Disable Shadow DOM so Tailwind CSS works
     */
    createRenderRoot() {
        return this;
    }
}

/**
 * Simple template literal helper that returns a string (not Lit's TemplateResult)
 * This allows using tagged templates with innerHTML
 */
export const html = (strings, ...values) => {
    return strings.reduce((result, str, i) => {
        return result + str + (values[i] !== undefined ? values[i] : '');
    }, '');
};

export { css };
