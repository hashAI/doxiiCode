import '../product-portfolio-showcase.js';

/**
 * Product Portfolio Showcase - Interactive Preview
 * Demonstrates scroll-based product showcase with creative animations
 */

export const previewConfig = {
    setup: (element) => {
        console.log('Product Portfolio Showcase - Preview loaded');

        // Create wrapper
        const wrapper = document.createElement('div');
        wrapper.style.cssText = 'min-height: 100vh; background: #eeece5; position: relative;';

        // Create theme toggle button
        const themeToggle = document.createElement('button');
        themeToggle.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 1000;
            padding: 0.75rem 1.5rem;
            background: #1a1a1a;
            color: white;
            border: none;
            border-radius: 25px;
            font-size: 0.9rem;
            cursor: pointer;
            font-weight: 600;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            transition: all 0.3s ease;
        `;
        themeToggle.textContent = '🌙 Dark Mode';

        let isDark = false;

        themeToggle.addEventListener('click', () => {
            isDark = !isDark;
            element.setAttribute('theme', isDark ? 'dark' : 'light');
            wrapper.style.background = isDark ? '#1a1a1a' : '#eeece5';
            themeToggle.textContent = isDark ? '☀️ Light Mode' : '🌙 Dark Mode';
            themeToggle.style.background = isDark ? '#eeece5' : '#1a1a1a';
            themeToggle.style.color = isDark ? '#1a1a1a' : 'white';
        });

        themeToggle.addEventListener('mouseenter', () => {
            themeToggle.style.transform = 'scale(1.05)';
            themeToggle.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.2)';
        });

        themeToggle.addEventListener('mouseleave', () => {
            themeToggle.style.transform = 'scale(1)';
            themeToggle.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
        });

        // Create intro section with scroll hint
        const intro = document.createElement('section');
        intro.style.cssText = `
            position: relative;
            min-height: 50vh;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            padding: 4rem 2rem 2rem;
            background: linear-gradient(135deg, #f5f1ed 0%, #e8dfd5 100%);
        `;
        intro.innerHTML = `
            <div style="text-align: center; max-width: 700px;">
                <p style="font-size: 0.9rem; letter-spacing: 0.3em; text-transform: uppercase; color: #a58725; margin-bottom: 1rem;">Premium Ecommerce Showcase</p>
                <h1 style="font-family: 'Lexend Mega', sans-serif; font-size: clamp(2.5rem, 6vw, 4rem); line-height: 1.1; margin-bottom: 1.5rem; color: #1a1a1a;">Creative Product Portfolio</h1>
                <p style="font-size: 1.1rem; line-height: 1.7; color: rgba(26, 26, 26, 0.7); margin-bottom: 2rem;">Experience our curated collection with stunning scroll animations, custom cursor interactions, and immersive product views.</p>
                <div style="display: flex; flex-direction: column; align-items: center; gap: 0.5rem; margin-top: 3rem; opacity: 0.6; animation: bounce 2s ease-in-out infinite;">
                    <span style="font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.2em;">Scroll to Explore</span>
                    <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M12 5v14M19 12l-7 7-7-7"/>
                    </svg>
                </div>
            </div>
            <style>
                @keyframes bounce {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(10px); }
                }
            </style>
        `;

        // Create footer
        const footer = document.createElement('footer');
        footer.style.cssText = `
            min-height: 60vh;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            background: linear-gradient(135deg, #d8d4cf 0%, #c9c5c0 100%);
            padding: 4rem 2rem;
            position: relative;
        `;
        footer.innerHTML = `
            <div style="text-align: center; max-width: 600px;">
                <h3 style="font-family: 'Lexend Mega', sans-serif; font-size: 2.5rem; margin-bottom: 1rem; letter-spacing: 0.05em; color: #1a1a1a;">Discover More</h3>
                <p style="font-size: 1rem; color: rgba(26, 26, 26, 0.7); margin-bottom: 2rem; line-height: 1.7;">Browse our complete collection of premium products crafted with attention to detail and timeless design.</p>
                <button style="padding: 1rem 2.5rem; background: #1a1a1a; color: white; border: none; font-size: 1rem; cursor: pointer; border-radius: 4px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; transition: all 0.3s ease;" onmouseover="this.style.background='#fe4e01'" onmouseout="this.style.background='#1a1a1a'">View All Products</button>
            </div>
            <button onclick="window.scrollTo({top: 0, behavior: 'smooth'}); return false;" style="position: absolute; bottom: 3rem; display: flex; flex-direction: column; align-items: center; gap: 0.5rem; background: none; border: none; cursor: pointer; color: #1a1a1a; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.2em; transition: opacity 0.3s ease;" onmouseover="this.style.opacity='0.6'" onmouseout="this.style.opacity='1'">
                <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M12 19V5M5 12l7-7 7 7"/>
                </svg>
                <span>Back to Top</span>
            </button>
            <p style="position: absolute; bottom: 1rem; font-size: 0.75rem; color: rgba(26, 26, 26, 0.5); text-align: center;">© 2024 Premium Collection. All rights reserved.</p>
        `;

        // Wrap element
        const parent = element.parentNode;
        parent.insertBefore(wrapper, element);
        wrapper.appendChild(themeToggle);
        wrapper.appendChild(intro);
        wrapper.appendChild(element);
        wrapper.appendChild(footer);

        // Set custom products for demo
        element.products = [
            {
                name: 'Swiss Chronograph',
                category: 'Luxury Watches',
                description: 'Precision-engineered Swiss automatic movement with Italian leather strap. A timepiece that transcends generations.',
                image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200&h=1600&fit=crop&q=80',
                price: '$2,450',
                id: 'watch-1'
            },
            {
                name: 'Artisan Vase',
                category: 'Home Decor',
                description: 'Hand-thrown ceramic vase with organic glaze finish. Each piece is unique and signed by the artist.',
                image: 'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=1200&h=1600&fit=crop&q=80',
                price: '$320',
                id: 'vase-1'
            },
            {
                name: 'Merino Throw',
                category: 'Textiles',
                description: 'Sustainable merino wool blanket woven by skilled artisans. Soft, warm, and ethically sourced.',
                image: 'https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=1200&h=1600&fit=crop&q=80',
                price: '$560',
                id: 'throw-1'
            },
            {
                name: 'Leather Satchel',
                category: 'Accessories',
                description: 'Full-grain leather messenger bag crafted for modern professionals. Ages beautifully with use.',
                image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=1200&h=1600&fit=crop&q=80',
                price: '$890',
                id: 'bag-1'
            },
            {
                name: 'Designer Sunglasses',
                category: 'Eyewear',
                description: 'Italian acetate frames with polarized lenses. Classic design with modern UV protection.',
                image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=1200&h=1600&fit=crop&q=80',
                price: '$425',
                id: 'sunglasses-1'
            },
            {
                name: 'Minimalist Desk Lamp',
                category: 'Lighting',
                description: 'Scandinavian-inspired LED lamp with adjustable arm. Energy-efficient and elegant.',
                image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=1200&h=1600&fit=crop&q=80',
                price: '$280',
                id: 'lamp-1'
            }
        ];

        // Handle events
        element.addEventListener('product-view', (e) => {
            console.log('Product viewed:', e.detail.product);
        });

        element.addEventListener('product-close', (e) => {
            console.log('Product modal closed');
        });

        element.addEventListener('add-to-cart', (e) => {
            console.log('Add to cart:', e.detail.product);
            alert(`✅ Added "${e.detail.product.name}" to cart!`);
        });

        // Return cleanup function
        return () => {
            themeToggle.remove();
        };
    },

    wrapperClass: 'p-0',

    description: `
        <div class="space-y-4 mb-8 p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border-2 border-purple-200 dark:border-purple-800">
            <h3 class="text-2xl font-bold text-gray-900 dark:text-white">
                Product Portfolio Showcase - Creative Scroll Experience
            </h3>
            <p class="text-gray-700 dark:text-gray-300 leading-relaxed">
                An immersive, creative product showcase inspired by modern portfolio websites. Features
                scroll-triggered animations, custom cursor interactions, large typography, and modal product
                views. Perfect for brands that want to make a bold, artistic statement.
            </p>

            <div class="grid md:grid-cols-2 gap-4 text-sm">
                <div class="space-y-2">
                    <h4 class="font-semibold text-gray-900 dark:text-white">✨ Key Features:</h4>
                    <ul class="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
                        <li>Scroll-triggered panel reveals</li>
                        <li>Custom animated cursor</li>
                        <li>GSAP scroll animations</li>
                        <li>Splitting.js text effects</li>
                        <li>Large typographic titles</li>
                        <li>Image blur/overlay effects</li>
                        <li>Full-screen product modals</li>
                        <li>Loading animation</li>
                        <li>Dark/light theme toggle</li>
                        <li>Fully responsive design</li>
                    </ul>
                </div>
                <div class="space-y-2">
                    <h4 class="font-semibold text-gray-900 dark:text-white">🎯 Perfect For:</h4>
                    <ul class="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
                        <li>Creative agencies</li>
                        <li>Design studios</li>
                        <li>Fashion brands</li>
                        <li>Art galleries</li>
                        <li>Luxury lifestyle products</li>
                        <li>Limited edition collections</li>
                        <li>Premium brand showcases</li>
                        <li>Portfolio-style ecommerce</li>
                    </ul>
                </div>
            </div>

            <div class="pt-4 border-t border-purple-200 dark:border-purple-700">
                <h4 class="font-semibold text-gray-900 dark:text-white mb-2">🎨 Design Highlights:</h4>
                <div class="grid md:grid-cols-3 gap-3 text-gray-700 dark:text-gray-300 text-sm">
                    <div class="bg-white dark:bg-gray-800 p-3 rounded-lg">
                        <div class="font-medium mb-1">Custom Cursor</div>
                        <div class="text-xs">Animated cursor with hover states for interactive feel</div>
                    </div>
                    <div class="bg-white dark:bg-gray-800 p-3 rounded-lg">
                        <div class="font-medium mb-1">Scroll Reveals</div>
                        <div class="text-xs">Panels fade in with number watermarks as you scroll</div>
                    </div>
                    <div class="bg-white dark:bg-gray-800 p-3 rounded-lg">
                        <div class="font-medium mb-1">Bold Typography</div>
                        <div class="text-xs">Large, striking product names with creative text treatments</div>
                    </div>
                </div>
            </div>

            <div class="pt-4 border-t border-purple-200 dark:border-purple-700">
                <h4 class="font-semibold text-gray-900 dark:text-white mb-2">🎬 Interaction Details:</h4>
                <div class="text-gray-700 dark:text-gray-300 text-sm space-y-2">
                    <p><strong>Hover Effect:</strong> Cursor transforms when hovering over product thumbnails with animated "SEE MORE" text</p>
                    <p><strong>Click Action:</strong> Opens full-screen modal with product details, large image, and add-to-cart button</p>
                    <p><strong>Scroll Animation:</strong> Each panel reveals with staggered animations on title, image, and background elements</p>
                    <p><strong>Theme Toggle:</strong> Switch between light and dark modes with smooth color transitions</p>
                </div>
            </div>

            <div class="pt-4 border-t border-purple-200 dark:border-purple-700">
                <h4 class="font-semibold text-gray-900 dark:text-white mb-2">📝 Technical Details:</h4>
                <p class="text-gray-700 dark:text-gray-300 text-sm">
                    Built with LitElement for encapsulation and reusability. Uses GSAP 3.12+ with ScrollTrigger
                    for smooth scroll animations and Splitting.js for text effects. Custom cursor tracking with
                    requestAnimationFrame for performance. Shadow DOM scoped styles with CSS custom properties
                    for theming. Fully responsive with mobile fallbacks (auto cursor removed on touch devices).
                </p>
            </div>

            <div class="mt-4 p-4 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <p class="text-sm text-gray-800 dark:text-gray-200">
                    <strong>💡 Tip:</strong> Scroll slowly to experience all the reveal animations. Hover over
                    product thumbnails to see the custom cursor transform. Click any product to open the immersive
                    detail modal. Toggle between dark and light themes using the button in the top-right corner.
                </p>
            </div>

            <div class="mt-4 p-4 bg-orange-100 dark:bg-orange-900/30 rounded-lg border border-orange-200 dark:border-orange-700">
                <p class="text-sm text-gray-800 dark:text-gray-200">
                    <strong>⚙️ Customization:</strong> Products array can be customized via component properties.
                    Theme colors are CSS custom properties. Animations can be adjusted via GSAP timeline configurations.
                    Component fires <code class="px-1 py-0.5 bg-white dark:bg-gray-800 rounded">product-view</code> and
                    <code class="px-1 py-0.5 bg-white dark:bg-gray-800 rounded">product-close</code> events for integration.
                </p>
            </div>
        </div>
    `,

    notes: 'Scroll through to see reveal animations. Hover thumbnails for cursor effects. Click products for modal view. Toggle theme with top-right button. Auto-loads GSAP, ScrollTrigger, and Splitting.js.'
};

export default previewConfig;
