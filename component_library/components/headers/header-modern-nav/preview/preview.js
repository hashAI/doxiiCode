import { HeaderModernNav } from '../header-modern-nav.js';

// Example usage
const headerDemo = document.createElement('header-modern-nav');

// Customize the config
headerDemo.config = {
    brandName: 'ShopFlow',
    announcement: {
        badge: 'Launch Offer',
        text: 'Start selling today and get 30 days free + $100 in ad credits'
    },
    navigation: [
        { label: 'Shop', href: '/shop' },
        { label: 'Products', href: '/products' },
        { label: 'About', href: '/about' },
        { label: 'Contact', href: '/contact' }
    ],
    cta: {
        primary: { label: 'Get Started', action: 'get-started' },
        secondary: { label: 'Login', action: 'login' }
    },
    cart: {
        show: true,
        itemCount: 3
    }
};

// Add event listeners
headerDemo.addEventListener('nav-click', (e) => {
    console.log('Navigation clicked:', e.detail);
});

headerDemo.addEventListener('cta-click', (e) => {
    console.log('CTA clicked:', e.detail);
});

headerDemo.addEventListener('theme-changed', (e) => {
    console.log('Theme changed to:', e.detail.theme);
});

headerDemo.addEventListener('menu-toggle', (e) => {
    console.log('Mobile menu toggled:', e.detail.open ? 'open' : 'closed');
});

document.body.appendChild(headerDemo);
