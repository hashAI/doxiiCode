import { LitElement, html, nothing } from 'https://cdn.jsdelivr.net/npm/lit@3.2.1/+esm';
import { ensureIcons, refreshAOS } from '../assets/utils.js';

export class BaseComponent extends LitElement {
  // Disable Shadow DOM so Tailwind utility classes apply
  createRenderRoot() { return this; }

  updated() {
    ensureIcons(this);
    refreshAOS();
  }

  // Convenience to read JSON passed via attribute like data-params
  readJsonAttr(name, fallback = null) {
    try { return JSON.parse(this.getAttribute(name) || 'null') ?? fallback; } catch { return fallback; }
  }

  // lit helpers passthrough
  html(strings, ...values) { return html(strings, ...values); }
  nothing() { return nothing; }
}

customElements.define('base-component', BaseComponent);


