import { initAOS, ensureIcons, refreshAOS } from './utils.js';
import { setRoutes } from './router.js';

import '../components/base-component.js';
import '../components/app-header.js';
import '../components/bottom-nav.js';
import '../components/cart-sidebar.js';
import '../components/favorites-sidebar.js';
import '../components/location-selector.js';
import '../components/theme-toggle.js';

import '../components/pages/home-page.js';
import '../components/pages/products-page.js';
import '../components/pages/product-details-page.js';

function initVendors() {
    initAOS();
    ensureIcons();
}

function bootstrap() {
    initVendors();
    if (!window.location.hash) {
        window.location.hash = '/';
    }

    setRoutes([
        { path: '/', component: 'home-page' },
        { path: '/trending', component: 'home-page' },
        { path: '/products/:category', component: 'products-page' },
        { path: '/product/:id', component: 'product-details-page' }
    ]);

    window.addEventListener('route:changed', () => {
        queueMicrotask(() => {
            ensureIcons();
            refreshAOS();
            window.scrollTo({ top: 0, behavior: 'instant' });
        });
    });
}

document.addEventListener('DOMContentLoaded', bootstrap);
