import { initAOS, ensureIcons, refreshAOS } from './utils.js';
import { setRoutes } from './router.js';

import '../components/base-component.js';
import '../components/site-header.js';
import '../components/site-footer.js';
import '../components/cart-drawer.js';
import '../components/location-selector.js';
import '../components/favorites-sidebar.js';

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
        { path: '/products/:category', component: 'products-page' },
        { path: '/product/:id', component: 'product-details-page' }
    ]);

    window.addEventListener('route:changed', () => {
        queueMicrotask(() => {
            ensureIcons();
            refreshAOS();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });
}

document.addEventListener('DOMContentLoaded', bootstrap);
