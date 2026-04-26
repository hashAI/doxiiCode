import '../motorcycle-landing.js';

/**
 * Motorcycle Landing - Interactive Preview
 * Demonstrates Bikes24 motorcycle landing page with hero bike showcase
 */

export const previewConfig = {
    setup: (element) => {
        console.log('Motorcycle Landing - Preview loaded');

        // Toast notification helper
        const showToast = (message, icon = '🏍️') => {
            const toast = document.createElement('div');
            toast.style.cssText = `
                position: fixed;
                bottom: 2rem;
                right: 2rem;
                z-index: 1000;
                background: rgba(249, 115, 22, 0.95);
                color: white;
                padding: 1rem 1.5rem;
                border-radius: 12px;
                font-family: 'Inter', sans-serif;
                font-size: 0.875rem;
                font-weight: 500;
                box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
                animation: slideInUp 0.3s ease;
                display: flex;
                align-items: center;
                gap: 0.75rem;
            `;
            toast.innerHTML = `<span style="font-size: 1.2rem;">${icon}</span><span>${message}</span>`;
            document.body.appendChild(toast);
            setTimeout(() => {
                toast.style.animation = 'slideOutDown 0.3s ease';
                setTimeout(() => toast.remove(), 300);
            }, 2500);
        };

        // Handle custom events
        element.addEventListener('nav-click', (e) => {
            console.log('Navigation clicked:', e.detail);
            showToast(`Navigating to ${e.detail.target}`, '📍');
        });

        element.addEventListener('contact-click', () => {
            console.log('Contact button clicked');
            showToast('Contact form opened', '📧');
        });

        element.addEventListener('cta-click', (e) => {
            console.log('CTA clicked:', e.detail);
            showToast(`Starting ${e.detail.text} flow`, '✨');
        });

        element.addEventListener('bike-click', (e) => {
            console.log('Bike clicked:', e.detail);
            showToast(`Viewing ${e.detail.brand} ${e.detail.model}`, '🏍️');
        });

        // Add animation styles
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideInUp {
                from {
                    transform: translateY(20px);
                    opacity: 0;
                }
                to {
                    transform: translateY(0);
                    opacity: 1;
                }
            }
            @keyframes slideOutDown {
                from {
                    transform: translateY(0);
                    opacity: 1;
                }
                to {
                    transform: translateY(20px);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    },

    wrapperClass: 'p-0',

    description: `
        <div class="space-y-4 mb-8 p-6 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl border-2 border-orange-200">
            <h3 class="text-2xl font-bold text-gray-900">
                Motorcycle Landing - Bikes24 Hero Section
            </h3>
            <p class="text-gray-700 leading-relaxed">
                A vibrant motorcycle landing page with a gradient yellow background, hero bike showcase, and product cards.
                Features a modern navigation bar, large hero title, CTA button with double arrows, and smart tracking badge.
                Perfect for motorcycle dealerships, bike rental services, and automotive ecommerce stores.
            </p>

            <div class="grid md:grid-cols-2 gap-4 text-sm">
                <div class="space-y-2">
                    <h4 class="font-semibold text-gray-900">✨ Key Features:</h4>
                    <ul class="list-disc list-inside space-y-1 text-gray-700">
                        <li>Vibrant yellow gradient background</li>
                        <li>Modern navigation with orange accents</li>
                        <li>Large italic hero title</li>
                        <li>Interactive CTA button with double arrows</li>
                        <li>Two product bike cards (Honda PCX125 & ZK470)</li>
                        <li>Hero bike image with drop shadow</li>
                        <li>Smart tracking badge overlay</li>
                        <li>Fully responsive design</li>
                        <li>Custom event emissions</li>
                        <li>Inter font family</li>
                    </ul>
                </div>
                <div class="space-y-2">
                    <h4 class="font-semibold text-gray-900">🎯 Perfect For:</h4>
                    <ul class="list-disc list-inside space-y-1 text-gray-700">
                        <li>Motorcycle dealerships</li>
                        <li>Bike rental services</li>
                        <li>Automotive ecommerce stores</li>
                        <li>Motorcycle brand websites</li>
                        <li>Riding experience platforms</li>
                        <li>Bike showcase landing pages</li>
                        <li>Automotive lifestyle brands</li>
                        <li>Motorcycle accessories stores</li>
                    </ul>
                </div>
            </div>

            <div class="pt-4 border-t border-orange-200">
                <h4 class="font-semibold text-gray-900 mb-2">🎨 Design Highlights:</h4>
                <div class="grid md:grid-cols-3 gap-3 text-gray-700 text-sm">
                    <div class="bg-white p-3 rounded-lg">
                        <div class="font-medium mb-1">Gradient Background</div>
                        <div class="text-xs">Yellow gradient from yellow-100 to yellow-400</div>
                    </div>
                    <div class="bg-white p-3 rounded-lg">
                        <div class="font-medium mb-1">Hero Bike Image</div>
                        <div class="text-xs">Large motorcycle image with drop shadow</div>
                    </div>
                    <div class="bg-white p-3 rounded-lg">
                        <div class="font-medium mb-1">Product Cards</div>
                        <div class="text-xs">Glass-morphism bike cards with specs</div>
                    </div>
                </div>
            </div>

            <div class="pt-4 border-t border-orange-200">
                <h4 class="font-semibold text-gray-900 mb-2">🎬 Interactive Elements:</h4>
                <div class="space-y-2 text-gray-700 text-sm">
                    <div class="flex items-start gap-2">
                        <span class="font-medium">🔘</span>
                        <div>
                            <strong>CTA Button:</strong> Click "Get Started" to see the interaction event
                        </div>
                    </div>
                    <div class="flex items-start gap-2">
                        <span class="font-medium">🏍️</span>
                        <div>
                            <strong>Bike Cards:</strong> Click on Honda PCX125 or ZK470 cards to see bike selection
                        </div>
                    </div>
                    <div class="flex items-start gap-2">
                        <span class="font-medium">📍</span>
                        <div>
                            <strong>Navigation:</strong> Click nav links to see navigation feedback
                        </div>
                    </div>
                    <div class="flex items-start gap-2">
                        <span class="font-medium">📧</span>
                        <div>
                            <strong>Contact Button:</strong> Click "Contact Us" to see contact interaction
                        </div>
                    </div>
                    <div class="flex items-start gap-2">
                        <span class="font-medium">📱</span>
                        <div>
                            <strong>Responsive Design:</strong> Resize your browser to see mobile, tablet, and desktop layouts
                        </div>
                    </div>
                </div>
            </div>

            <div class="pt-4 border-t border-orange-200">
                <h4 class="font-semibold text-gray-900 mb-2">📝 Technical Details:</h4>
                <p class="text-gray-700 text-sm">
                    Built with Lit web components for maximum reusability. Uses TailwindCSS via CDN for styling.
                    Inter font family auto-loads from Google Fonts. All styles are scoped within Shadow DOM.
                    Fully responsive with breakpoints at 1024px (lg). Component properties can be easily customized
                    including brand name, hero content, bike data, and navigation items. Emits custom events for
                    all interactions (nav-click, contact-click, cta-click, bike-click).
                </p>
            </div>

            <div class="pt-4 border-t border-orange-200">
                <h4 class="font-semibold text-gray-900 mb-2">🔧 Customization Options:</h4>
                <div class="grid md:grid-cols-2 gap-3 text-gray-700 text-sm">
                    <div>
                        <strong>Branding:</strong> brandName, contactButtonText
                    </div>
                    <div>
                        <strong>Hero Content:</strong> heroTitle, heroSubtitle, heroImage
                    </div>
                    <div>
                        <strong>CTA:</strong> ctaText
                    </div>
                    <div>
                        <strong>Navigation:</strong> navItems array with label and href
                    </div>
                    <div>
                        <strong>Bikes:</strong> bikes array with brand, model, image, and specs
                    </div>
                </div>
            </div>

            <div class="mt-4 p-4 bg-yellow-100 rounded-lg">
                <p class="text-sm text-gray-800">
                    <strong>💡 Tip:</strong> This component features a vibrant yellow gradient background perfect for
                    motorcycle brands. The hero section showcases a large bike image with a smart tracking badge overlay.
                    Two product cards display featured bikes with their specifications. All interactive elements emit
                    custom events that you can listen to and handle in your application. The design is fully responsive
                    and works great on mobile, tablet, and desktop devices.
                </p>
            </div>
        </div>
    `,

    notes: 'Bikes24 motorcycle landing page. Click any interactive element for toast notifications. Fully responsive with vibrant yellow gradient background!'
};

export default previewConfig;

