import { initAOS, ensureIcons, refreshAOS, initGSAP } from './utils.js';
import { setRoutes } from './router.js';

import '../components/base-component.js';
import '../components/app-header.js';
import '../components/app-footer.js';
import '../components/cart-sidebar.js';
import '../components/search-overlay.js';
import '../components/immersive-menu.js';
import '../components/location-selector.js';
import '../components/favorites-sidebar.js';
import '../components/theme-toggle.js';

import '../components/pages/home-page.js';
import '../components/pages/products-page.js';
import '../components/pages/product-details-page.js';

function initVendors() {
    ensureIcons();
}

function bootstrap() {
    initVendors();
    if (!window.location.hash) {
        window.location.hash = '/';
    }

    setRoutes([
        { path: '/', component: 'home-page' },
        { path: '/products/:category', component: 'products-page' },
        { path: '/product/:id', component: 'product-details-page' },
    ]);

    window.addEventListener('route:changed', () => {
        queueMicrotask(() => {
            ensureIcons();
            window.scrollTo({ top: 0, behavior: 'instant' });
        });
    });
}

document.addEventListener('DOMContentLoaded', bootstrap);
