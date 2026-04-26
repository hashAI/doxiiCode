// App bootstrap: imports, router setup, vendors init
import { initAOS, refreshAOS, ensureIcons } from './utils.js';
import { setRoutes } from './router.js';

// Register components
import '../components/base-component.js';
import '../components/header.js';
import '../components/footer.js';
import '../components/hero.js';
import '../components/product-card.js';
import '../components/product-grid.js';
import '../components/cart-drawer.js';

// Register pages
import '../pages/page-home.js';
import '../pages/page-catalog.js';
import '../pages/page-product.js';
import '../pages/page-cart.js';

function initVendors() {
  if (window.lucide && window.lucide.createIcons) {
    window.lucide.createIcons();
  }
  initAOS();
}

function onRouteChanged() {
  // After route render, refresh icons and AOS animations
  queueMicrotask(() => {
    ensureIcons();
    refreshAOS();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initVendors();

  // Listen for route changes
  document.addEventListener('route:changed', onRouteChanged);

  // Define routes
  setRoutes([
    { path: '/', component: 'page-home' },
    { path: '/catalog', component: 'page-catalog' },
    { path: '/product/:id', component: 'page-product' },
    { path: '/cart', component: 'page-cart' }
  ]);
});


