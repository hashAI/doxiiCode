import { initAOS, ensureIcons, refreshAOS } from './utils.js';
import { setRoutes } from './router.js';

import '../components/base-component.js';
import '../components/app-header.js';
import '../components/app-footer.js';
import '../components/bottom-nav.js';
import '../components/cart-sidebar.js';
import '../components/location-selector.js';
import '../components/side-menu.js';
import '../components/favorites-sidebar.js';

import '../components/pages/home-page.js';
import '../components/pages/products-page.js';
import '../components/pages/product-details-page.js';
import '../components/pages/search-page.js';

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
        { path: '/product/:id', component: 'product-details-page' },
        { path: '/search', component: 'search-page' }
    ]);

    window.addEventListener('route:changed', () => {
        queueMicrotask(() => {
            ensureIcons();
            refreshAOS();
            window.scrollTo({ top: 0, behavior: 'instant' });
        });
    });

    // WhatsApp button click handler
    const whatsappButton = document.getElementById('whatsapp-float');
    if (whatsappButton) {
        whatsappButton.addEventListener('click', () => {
            window.open('https://wa.me/9999899998', '_blank');
        });
    }
}

document.addEventListener('DOMContentLoaded', bootstrap);
