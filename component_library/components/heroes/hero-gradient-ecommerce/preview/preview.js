import '../hero-gradient-ecommerce.js';

// Preview configuration
export default {
    title: 'Hero Gradient Ecommerce',
    component: 'hero-gradient-ecommerce',
    description: 'Modern e-commerce hero section with gradient backgrounds, fixed navigation, mobile menu, announcement bar, and trust indicators',

    // Event handlers for preview
    setupEventListeners: (container) => {
        const component = container.querySelector('hero-gradient-ecommerce');

        if (component) {
            component.addEventListener('nav-click', (e) => {
                console.log('Navigation clicked:', e.detail);
            });

            component.addEventListener('cta-primary-click', (e) => {
                console.log('Primary CTA clicked:', e.detail);
                alert('Starting free trial!');
            });

            component.addEventListener('cta-secondary-click', (e) => {
                console.log('Secondary CTA clicked:', e.detail);
                alert(`Action: ${e.detail.action}`);
            });

            component.addEventListener('menu-toggle', (e) => {
                console.log('Mobile menu toggled:', e.detail);
            });

            component.addEventListener('theme-changed', (e) => {
                console.log('Theme changed to:', e.detail.theme);
            });
        }
    },

    // Default configuration
    defaultConfig: {},

    // Available configurations for preview controls
    configurations: [
        {
            name: 'Light Mode',
            config: {
                theme: 'light'
            }
        },
        {
            name: 'Dark Mode',
            config: {
                theme: 'dark'
            }
        }
    ]
};
