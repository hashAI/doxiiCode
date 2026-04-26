import '../scroll-accordion-stack.js';

/**
 * Scroll Accordion Stack - Interactive Preview
 * Demonstrates pinned scrolling accordion with stacking effects
 */

export const previewConfig = {
    setup: (element) => {
        console.log('Scroll Accordion Stack - Preview loaded');

        // Create wrapper
        const wrapper = document.createElement('div');
        wrapper.style.cssText = 'min-height: 100vh; position: relative;';

        // Create header
        const header = document.createElement('header');
        header.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            z-index: 1000;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 1rem 2rem;
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            border-bottom: 1px solid rgba(0, 0, 0, 0.1);
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        `;

        const themeToggle = document.createElement('button');
        themeToggle.textContent = '🌙 Dark Mode';
        themeToggle.style.cssText = `
            padding: 0.5rem 1rem;
            background: #5c2fa6;
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 0.9rem;
            font-weight: 500;
            transition: all 0.3s ease;
        `;
        themeToggle.onmouseover = () => {
            themeToggle.style.background = '#7a4fc4';
        };
        themeToggle.onmouseout = () => {
            themeToggle.style.background = '#5c2fa6';
        };
        themeToggle.onclick = () => {
            const currentTheme = element.getAttribute('theme') || 'light';
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            element.setAttribute('theme', newTheme);
            themeToggle.textContent = newTheme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode';
        };

        header.innerHTML = `
            <div style="font-size: 1.25rem; font-weight: 700; letter-spacing: -0.02em;">✨ Our Features</div>
        `;
        header.appendChild(themeToggle);

        // Create intro section
        const intro = document.createElement('section');
        intro.style.cssText = `
            position: relative;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 6rem 2rem 4rem;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            text-align: center;
        `;
        intro.innerHTML = `
            <div style="max-width: 700px; color: white;">
                <h1 style="font-size: clamp(2.5rem, 8vw, 5rem); line-height: 1.1; margin-bottom: 1.5rem; font-weight: 800; letter-spacing: -0.03em;">Experience Excellence</h1>
                <p style="font-size: 1.2rem; line-height: 1.6; margin-bottom: 2rem; opacity: 0.95;">Scroll down to discover why customers love shopping with us. Each feature is designed to make your experience exceptional.</p>
                <div style="font-size: 0.9rem; opacity: 0.8; margin-top: 3rem;">
                    ↓ Scroll to explore
                </div>
            </div>
        `;

        // Create footer
        const footer = document.createElement('footer');
        footer.style.cssText = `
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
            padding: 4rem 2rem;
            text-align: center;
            color: white;
        `;
        footer.innerHTML = `
            <div>
                <h2 style="font-size: clamp(2rem, 6vw, 4rem); margin-bottom: 1.5rem; font-weight: 800;">Ready to Get Started?</h2>
                <p style="font-size: 1.1rem; margin-bottom: 2.5rem; opacity: 0.95; max-width: 600px;">Join thousands of satisfied customers who trust us for their shopping needs.</p>
                <button style="padding: 1.2rem 3rem; background: white; color: #f5576c; border: none; font-size: 1.1rem; cursor: pointer; border-radius: 50px; font-weight: 700; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2); transition: transform 0.3s ease;" onmouseover="this.style.transform='translateY(-3px)'" onmouseout="this.style.transform='translateY(0)'">Shop Now</button>
            </div>
            <p style="position: absolute; bottom: 2rem; font-size: 0.85rem; opacity: 0.8;">© 2024 Your Store. All rights reserved.</p>
        `;

        // Wrap element
        const parent = element.parentNode;
        parent.insertBefore(wrapper, element);
        wrapper.appendChild(header);
        wrapper.appendChild(intro);
        wrapper.appendChild(element);
        wrapper.appendChild(footer);

        // Handle events
        element.addEventListener('accordion-item-focus', (e) => {
            console.log('Accordion item focused:', e.detail);
        });

        element.addEventListener('accordion-item-collapse', (e) => {
            console.log('Accordion items collapsed');
        });

        element.addEventListener('accordion-item-activated', (e) => {
            console.log('Accordion item activated:', e.detail);
            alert(`📌 Feature: ${e.detail.item.title}`);
        });

        element.addEventListener('theme-changed', (e) => {
            console.log('Theme changed to:', e.detail.theme);
        });
    },

    wrapperClass: 'p-0',

    description: `
        <div class="space-y-4 mb-8 p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border-2 border-purple-200 dark:border-purple-800">
            <h3 class="text-2xl font-bold text-gray-900 dark:text-white">
                Scroll Accordion Stack - Pinned Scrolling Accordion
            </h3>
            <p class="text-gray-700 dark:text-gray-300 leading-relaxed">
                An innovative scrolling accordion component that pins to the viewport and elegantly stacks
                items as you scroll. Perfect for showcasing product features, benefits, or key selling points
                with smooth GSAP-powered animations that create an engaging, interactive experience.
                Uses native smooth scrolling for optimal compatibility.
            </p>

            <div class="grid md:grid-cols-2 gap-4 text-sm">
                <div class="space-y-2">
                    <h4 class="font-semibold text-gray-900 dark:text-white">✨ Key Features:</h4>
                    <ul class="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
                        <li>GSAP ScrollTrigger pinning animation</li>
                        <li>Native smooth scrolling</li>
                        <li>Automatic text collapse on scroll</li>
                        <li>Card stacking effects</li>
                        <li>Dark/light theme support</li>
                        <li>Fully responsive design</li>
                        <li>Accessibility features (ARIA, keyboard nav)</li>
                        <li>Custom event dispatching</li>
                        <li>Gradient background themes</li>
                        <li>Reduced motion support</li>
                    </ul>
                </div>
                <div class="space-y-2">
                    <h4 class="font-semibold text-gray-900 dark:text-white">🎯 Perfect For:</h4>
                    <ul class="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
                        <li>Feature showcases</li>
                        <li>Product benefits sections</li>
                        <li>Service highlights</li>
                        <li>Trust indicators</li>
                        <li>Key selling points</li>
                        <li>About us sections</li>
                        <li>Value propositions</li>
                        <li>Process explanations</li>
                    </ul>
                </div>
            </div>

            <div class="pt-4 border-t border-purple-200 dark:border-purple-700">
                <h4 class="font-semibold text-gray-900 dark:text-white mb-2">🎨 Design Highlights:</h4>
                <div class="grid md:grid-cols-3 gap-3 text-gray-700 dark:text-gray-300 text-sm">
                    <div class="bg-white dark:bg-gray-800 p-3 rounded-lg">
                        <div class="font-medium mb-1">Pinning Effect</div>
                        <div class="text-xs">Cards pin to viewport and stack smoothly</div>
                    </div>
                    <div class="bg-white dark:bg-gray-800 p-3 rounded-lg">
                        <div class="font-medium mb-1">Color Gradients</div>
                        <div class="text-xs">Vibrant gradient backgrounds per card</div>
                    </div>
                    <div class="bg-white dark:bg-gray-800 p-3 rounded-lg">
                        <div class="font-medium mb-1">Text Collapse</div>
                        <div class="text-xs">Descriptions fade and collapse on scroll</div>
                    </div>
                </div>
            </div>

            <div class="pt-4 border-t border-purple-200 dark:border-purple-700">
                <h4 class="font-semibold text-gray-900 dark:text-white mb-2">🎭 Theme Support:</h4>
                <p class="text-gray-700 dark:text-gray-300 text-sm mb-2">
                    The component supports both light and dark modes with carefully crafted color palettes.
                    Toggle the theme button in the header to see the difference!
                </p>
                <div class="flex gap-2 flex-wrap">
                    <span class="px-3 py-1 bg-purple-100 dark:bg-purple-900/50 rounded-full text-xs">Light Mode</span>
                    <span class="px-3 py-1 bg-purple-100 dark:bg-purple-900/50 rounded-full text-xs">Dark Mode</span>
                    <span class="px-3 py-1 bg-purple-100 dark:bg-purple-900/50 rounded-full text-xs">Auto Theme</span>
                </div>
            </div>

            <div class="pt-4 border-t border-purple-200 dark:border-purple-700">
                <h4 class="font-semibold text-gray-900 dark:text-white mb-2">📝 Technical Details:</h4>
                <p class="text-gray-700 dark:text-gray-300 text-sm">
                    Built with Lit for fast, lightweight web components. Uses GSAP 3.12+ with ScrollTrigger
                    plugin for professional-grade animations. Native smooth scrolling ensures maximum compatibility
                    with Shadow DOM. All styles use CSS custom properties for easy theming. Shadow DOM ensures style
                    isolation. Fully accessible with ARIA labels, keyboard navigation, and reduced motion support.
                </p>
            </div>

            <div class="pt-4 border-t border-purple-200 dark:border-purple-700">
                <h4 class="font-semibold text-gray-900 dark:text-white mb-2">🎪 Events:</h4>
                <div class="space-y-2 text-sm">
                    <div class="bg-white dark:bg-gray-800 p-3 rounded-lg">
                        <code class="text-purple-600 dark:text-purple-400">accordion-item-focus</code>
                        <p class="text-gray-600 dark:text-gray-400 text-xs mt-1">Fired when an item comes into focus during scroll</p>
                    </div>
                    <div class="bg-white dark:bg-gray-800 p-3 rounded-lg">
                        <code class="text-purple-600 dark:text-purple-400">accordion-item-collapse</code>
                        <p class="text-gray-600 dark:text-gray-400 text-xs mt-1">Fired when items collapse during animation</p>
                    </div>
                    <div class="bg-white dark:bg-gray-800 p-3 rounded-lg">
                        <code class="text-purple-600 dark:text-purple-400">accordion-item-activated</code>
                        <p class="text-gray-600 dark:text-gray-400 text-xs mt-1">Fired when user clicks or activates an item with keyboard</p>
                    </div>
                    <div class="bg-white dark:bg-gray-800 p-3 rounded-lg">
                        <code class="text-purple-600 dark:text-purple-400">theme-changed</code>
                        <p class="text-gray-600 dark:text-gray-400 text-xs mt-1">Fired when theme is toggled</p>
                    </div>
                </div>
            </div>

            <div class="mt-4 p-4 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <p class="text-sm text-gray-800 dark:text-gray-200">
                    <strong>💡 Tip:</strong> Scroll down slowly to experience the smooth pinning and stacking animations.
                    Try toggling dark mode to see the theme switch in action. The component automatically loads
                    GSAP libraries for optimal performance. Click on any card or press Enter/Space while focused
                    to activate items.
                </p>
            </div>
        </div>
    `,

    notes: 'Scroll through to experience the pinning and stacking effects. Toggle dark mode in the header. GSAP and ScrollTrigger load automatically from CDN.'
};

export default previewConfig;
