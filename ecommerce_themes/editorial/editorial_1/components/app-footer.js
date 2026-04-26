import { BaseComponent } from './base-component.js';

class AppFooter extends BaseComponent {
    render() {
        const footerLinks = [
            {
                title: 'Shop and Learn',
                links: [
                    { name: 'Store', href: '#/products/all' },
                    { name: 'Computers', href: '#/products/Mac' },
                    { name: 'Tablets', href: '#/products/iPad' },
                    { name: 'Phones', href: '#/products/iPhone' },
                    { name: 'Watches', href: '#/products/Watch' },
                    { name: 'Vision', href: '#/products/Vision' },
                    { name: 'Audio', href: '#/products/AirPods' },
                    { name: 'TV & Home', href: '#/products/Accessories' },
                    { name: 'Trackers', href: '#' },
                    { name: 'Accessories', href: '#/products/Accessories' }
                ]
            },
            {
                title: 'Wallet',
                links: [
                    { name: 'Wallet', href: '#' },
                    { name: 'Store Card', href: '#' },
                    { name: 'Digital Pay', href: '#' },
                    { name: 'Cash', href: '#' }
                ]
            },
            {
                title: 'Account',
                links: [
                    { name: 'Manage Your ID', href: '#' },
                    { name: 'Store Account', href: '#' },
                    { name: 'Cloud Services', href: '#' }
                ]
            },
            {
                title: 'Entertainment',
                links: [
                    { name: 'All-in-One Plan', href: '#' },
                    { name: 'TV+', href: '#' },
                    { name: 'Music', href: '#' },
                    { name: 'Arcade', href: '#' },
                    { name: 'Fitness+', href: '#' },
                    { name: 'News+', href: '#' },
                    { name: 'Podcasts', href: '#' },
                    { name: 'Books', href: '#' }
                ]
            },
            {
                title: 'Store',
                links: [
                    { name: 'Find a Store', href: '#' },
                    { name: 'Support Bar', href: '#' },
                    { name: 'Today at Store', href: '#' },
                    { name: 'Group Reservations', href: '#' },
                    { name: 'Camp', href: '#' },
                    { name: 'Store App', href: '#' },
                    { name: 'Certified Refurbished', href: '#' },
                    { name: 'Trade In', href: '#' },
                    { name: 'Financing', href: '#' },
                    { name: 'Carrier Deals', href: '#' },
                    { name: 'Order Status', href: '#' },
                    { name: 'Shopping Help', href: '#' }
                ]
            },
            {
                title: 'For Business',
                links: [
                    { name: 'Business Solutions', href: '#' },
                    { name: 'Shop for Business', href: '#' }
                ]
            },
            {
                title: 'For Education',
                links: [
                    { name: 'Education Solutions', href: '#' },
                    { name: 'Shop for K-12', href: '#' },
                    { name: 'Shop for College', href: '#' }
                ]
            },
            {
                title: 'For Healthcare',
                links: [
                    { name: 'Healthcare Solutions', href: '#' },
                    { name: 'Health on Watch', href: '#' }
                ]
            },
            {
                title: 'Our Values',
                links: [
                    { name: 'Accessibility', href: '#' },
                    { name: 'Education', href: '#' },
                    { name: 'Environment', href: '#' },
                    { name: 'Inclusion and Diversity', href: '#' },
                    { name: 'Privacy', href: '#' },
                    { name: 'Racial Equity and Justice', href: '#' },
                    { name: 'Supply Chain', href: '#' }
                ]
            },
            {
                title: 'About Us',
                links: [
                    { name: 'Newsroom', href: '#' },
                    { name: 'Leadership', href: '#' },
                    { name: 'Career Opportunities', href: '#' },
                    { name: 'Investors', href: '#' },
                    { name: 'Ethics & Compliance', href: '#' },
                    { name: 'Events', href: '#' },
                    { name: 'Contact Us', href: '#' }
                ]
            }
        ];

        return this.html`
            <footer class="bg-gray-100 text-xs text-gray-600 border-t border-gray-200">
                <!-- Disclaimer Text -->
                <div class="max-w-[980px] mx-auto px-4 lg:px-0 pt-4 pb-3 border-b border-gray-300">
                    <p class="text-xs text-gray-500 leading-relaxed">
                        * Monthly pricing is after purchase using Store Card Monthly Installments. Pricing including product configuration, taxes, and shipping costs vary by store. See how it works.
                    </p>
                    <p class="text-xs text-gray-500 leading-relaxed mt-2">
                        ** Trade-in values will vary based on the condition, year, and configuration of your eligible trade-in device. Not all devices are eligible for credit. You must be at least 18 years old to be eligible to trade in for credit or for a Store Gift Card.
                    </p>
                </div>

                <!-- Footer Links Grid -->
                <div class="max-w-[980px] mx-auto px-4 lg:px-0 py-6">
                    <div class="grid grid-cols-2 md:grid-cols-5 gap-6">
                        ${footerLinks.slice(0, 5).map(section => this.html`
                            <div>
                                <h3 class="font-semibold text-gray-700 text-xs mb-3">${section.title}</h3>
                                <ul class="space-y-2">
                                    ${section.links.slice(0, 8).map(link => this.html`
                                        <li>
                                            <a href="${link.href}" class="text-gray-500 hover:text-gray-700 hover:underline transition-colors">
                                                ${link.name}
                                            </a>
                                        </li>
                                    `)}
                                </ul>
                            </div>
                        `)}
                    </div>
                </div>

                <!-- More ways to shop -->
                <div class="max-w-[980px] mx-auto px-4 lg:px-0 py-4 border-t border-gray-300">
                    <p class="text-xs text-gray-500">
                        More ways to shop: 
                        <a href="#" class="text-blue-600 hover:underline">Find a Store</a> or 
                        <a href="#" class="text-blue-600 hover:underline">other retailer</a> near you. 
                        Or call 1-800-STORE.
                    </p>
                </div>

                <!-- Copyright & Legal -->
                <div class="max-w-[980px] mx-auto px-4 lg:px-0 py-4 border-t border-gray-300">
                    <div class="flex flex-col md:flex-row md:justify-between md:items-center gap-3">
                        <p class="text-xs text-gray-500">
                            Copyright © 2025 Store Inc. All rights reserved.
                        </p>
                        <div class="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                            <a href="#" class="text-gray-500 hover:text-gray-700 hover:underline">Privacy Policy</a>
                            <span class="text-gray-300">|</span>
                            <a href="#" class="text-gray-500 hover:text-gray-700 hover:underline">Terms of Use</a>
                            <span class="text-gray-300">|</span>
                            <a href="#" class="text-gray-500 hover:text-gray-700 hover:underline">Sales and Refunds</a>
                            <span class="text-gray-300">|</span>
                            <a href="#" class="text-gray-500 hover:text-gray-700 hover:underline">Legal</a>
                            <span class="text-gray-300">|</span>
                            <a href="#" class="text-gray-500 hover:text-gray-700 hover:underline">Site Map</a>
                        </div>
                        <p class="text-xs text-gray-500">United States</p>
                    </div>
                </div>
            </footer>
        `;
    }
}

customElements.define('app-footer', AppFooter);
