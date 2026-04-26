import { ensureIcons } from './utils.js';
import { setRoutes } from './router.js';

// Base component
import '../components/base-component.js';

// New Gallery-style components
import '../components/gallery-header.js';
import '../components/immersive-menu.js';
import '../components/jewelry-box-cart.js';
import '../components/private-collection.js';
import '../components/floating-actions.js';
import '../components/filter-panel.js';
import '../components/quick-view.js';
import '../components/theme-toggle.js';

// Pages
import '../components/pages/home-page.js';
import '../components/pages/products-page.js';
import '../components/pages/product-details-page.js';

function initVendors() {
    // Initialize icons
    ensureIcons();

    // Initialize GSAP ScrollTrigger if available
    if (window.gsap && window.ScrollTrigger) {
        gsap.registerPlugin(ScrollTrigger);
    }
}

function bootstrap() {
    initVendors();

    if (!window.location.hash) {
        window.location.hash = '/';
    }

    setRoutes([
        { path: '/', component: 'home-page' },
        { path: '/products/:category', component: 'products-page' },
        { path: '/product/:id', component: 'product-details-page' }
    ]);

    window.addEventListener('route:changed', () => {
        queueMicrotask(() => {
            ensureIcons();
            window.scrollTo({ top: 0, behavior: 'instant' });
        });
    });
}

document.addEventListener('DOMContentLoaded', bootstrap);
