import '../interactive-3d-carousel.js';

/**
 * Interactive 3D Carousel - Interactive Preview
 * Demonstrates 3D product carousel with reflection effects
 */

export const previewConfig = {
    setup: (element) => {
        console.log('Interactive 3D Carousel - Preview loaded');

        // Handle click events
        element.addEventListener('product-click', (e) => {
            console.log('Product clicked:', e.detail);

            // Create simple toast notification
            const toast = document.createElement('div');
            toast.style.cssText = `
                position: fixed;
                bottom: 2rem;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(0, 0, 0, 0.9);
                color: white;
                padding: 1rem 2rem;
                border-radius: 8px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.5);
                z-index: 1000;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                font-size: 0.95rem;
                animation: fadeInOut 2s ease;
            `;
            toast.textContent = `Product ${e.detail.index + 1} selected`;

            // Add animation
            const style = document.createElement('style');
            style.textContent = `
                @keyframes fadeInOut {
                    0%, 100% { opacity: 0; }
                    10%, 90% { opacity: 1; }
                }
            `;
            if (!document.querySelector('style[data-toast-animation]')) {
                style.setAttribute('data-toast-animation', 'true');
                document.head.appendChild(style);
            }

            document.body.appendChild(toast);
            setTimeout(() => toast.remove(), 2000);
        });
    },

    wrapperClass: 'p-0',

    description: `
        <div class="space-y-4 mb-8 p-6 bg-gradient-to-br from-gray-900 to-gray-800 text-white rounded-xl border-2 border-gray-700">
            <h3 class="text-2xl font-bold">
                Interactive 3D Carousel - Product Showcase
            </h3>
            <p class="text-gray-200 leading-relaxed">
                A stunning 3D carousel with reflection effects, originally designed for album covers and adapted
                for ecommerce product showcases. Features smooth GSAP animations, infinite looping, and multiple
                interaction methods including scroll, drag, keyboard, and buttons.
            </p>

            <div class="grid md:grid-cols-2 gap-4 text-sm">
                <div class="space-y-2">
                    <h4 class="font-semibold text-white">✨ Key Features:</h4>
                    <ul class="list-disc list-inside space-y-1 text-gray-200">
                        <li>GSAP-powered 3D transformations</li>
                        <li>WebKit box-reflect with fallback</li>
                        <li>ScrollTrigger infinite loop</li>
                        <li>Draggable interactions</li>
                        <li>Numbered product indicators</li>
                        <li>Keyboard navigation (A/D keys)</li>
                        <li>Click-to-center selection</li>
                        <li>Smooth auto-snapping</li>
                        <li>Reflection effects</li>
                        <li>Fully responsive design</li>
                    </ul>
                </div>
                <div class="space-y-2">
                    <h4 class="font-semibold text-white">🎯 Perfect For:</h4>
                    <ul class="list-disc list-inside space-y-1 text-gray-200">
                        <li>Sneaker collections</li>
                        <li>Fashion showcases</li>
                        <li>Product portfolios</li>
                        <li>Creative galleries</li>
                        <li>Featured items</li>
                        <li>New arrivals</li>
                        <li>Premium brands</li>
                        <li>Interactive lookbooks</li>
                    </ul>
                </div>
            </div>

            <div class="pt-4 border-t border-gray-600">
                <h4 class="font-semibold text-white mb-2">🎨 Original Design Elements:</h4>
                <div class="grid md:grid-cols-3 gap-3 text-gray-200 text-sm">
                    <div class="bg-gray-800/50 p-3 rounded-lg">
                        <div class="font-medium mb-1">Dark Background</div>
                        <div class="text-xs text-gray-300">HSL(0, 0%, 10%) for dramatic contrast</div>
                    </div>
                    <div class="bg-gray-800/50 p-3 rounded-lg">
                        <div class="font-medium mb-1">Reflection Effect</div>
                        <div class="text-xs text-gray-300">WebKit box-reflect with gradient fallback</div>
                    </div>
                    <div class="bg-gray-800/50 p-3 rounded-lg">
                        <div class="font-medium mb-1">Numbered Items</div>
                        <div class="text-xs text-gray-300">Bold numbers overlay each product</div>
                    </div>
                </div>
            </div>

            <div class="pt-4 border-t border-gray-600">
                <h4 class="font-semibold text-white mb-2">🎮 How to Interact:</h4>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-2 text-gray-200 text-sm">
                    <div class="bg-gray-800/50 p-2 rounded text-center">
                        <div class="text-xl mb-1">📜</div>
                        <div class="font-medium text-xs">Scroll to browse</div>
                    </div>
                    <div class="bg-gray-800/50 p-2 rounded text-center">
                        <div class="text-xl mb-1">🖱️</div>
                        <div class="font-medium text-xs">Drag to rotate</div>
                    </div>
                    <div class="bg-gray-800/50 p-2 rounded text-center">
                        <div class="text-xl mb-1">⌨️</div>
                        <div class="font-medium text-xs">A/D keys</div>
                    </div>
                    <div class="bg-gray-800/50 p-2 rounded text-center">
                        <div class="text-xl mb-1">👆</div>
                        <div class="font-medium text-xs">Click to select</div>
                    </div>
                </div>
            </div>

            <div class="pt-4 border-t border-gray-600">
                <h4 class="font-semibold text-white mb-2">📝 Technical Implementation:</h4>
                <p class="text-gray-200 text-sm">
                    This component faithfully recreates the original 3D carousel design using Lit web components.
                    All GSAP animation parameters (STAGGER: 0.1, DURATION: 1, OFFSET: 0) match the original exactly.
                    The reflection effect uses CSS -webkit-box-reflect when supported, with a gradient-based
                    pseudo-element fallback for other browsers. Only the content has been adapted from album
                    covers to product images for ecommerce use.
                </p>
            </div>

            <div class="mt-4 p-4 bg-gray-800/50 rounded-lg">
                <p class="text-sm text-gray-200">
                    <strong>💡 Try it:</strong>
                    <span class="block mt-2">• Scroll through the carousel to see smooth 3D animations</span>
                    <span class="block">• Drag left/right to manually control rotation</span>
                    <span class="block">• Press A/D keys for quick navigation (no auto-repeat)</span>
                    <span class="block">• Click any product to center it instantly</span>
                    <span class="block">• Watch the reflection effect mirror each product</span>
                </p>
            </div>
        </div>
    `,

    notes: 'Original 3D carousel design adapted for ecommerce. Try scrolling, dragging, A/D keys, or clicking products!'
};

export default previewConfig;
