import '../hero-ai-geometric.js';

// Preview configuration
export default {
    title: 'Hero AI Geometric',
    component: 'hero-ai-geometric',
    description: 'Dark hero section with geometric SVG patterns, mobile menu, community badge, and dual CTAs',

    // Event handlers for preview
    setupEventListeners: (container) => {
        const component = container.querySelector('hero-ai-geometric');

        if (component) {
            component.addEventListener('nav-click', (e) => {
                console.log('Navigation clicked:', e.detail);
            });

            component.addEventListener('cta-primary-click', (e) => {
                console.log('Primary CTA clicked:', e.detail);
                alert('Getting started!');
            });

            component.addEventListener('cta-secondary-click', (e) => {
                console.log('Secondary CTA clicked:', e.detail);
                alert('Opening demo video...');
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
            name: 'Dark Mode',
            config: {
                theme: 'dark'
            }
        },
        {
            name: 'Light Mode',
            config: {
                theme: 'light'
            }
        }
    ]
};
