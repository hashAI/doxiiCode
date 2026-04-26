import { BaseComponent } from './base-component.js';
import { userStore } from '../assets/state.js';
import { showToast, showOverlay, hideOverlay } from '../assets/utils.js';

class LocationSelector extends BaseComponent {
    static properties = {
        isOpen: { type: Boolean },
        location: { type: Object },
        savedAddresses: { type: Array }
    };

    constructor() {
        super();
        this.isOpen = false;
        this.location = userStore.getLocation();
        this.savedAddresses = userStore.getAddresses();
    }

    open() {
        this.isOpen = true;
        showOverlay(() => this.close());
        this.requestUpdate();
    }

    close() {
        this.isOpen = false;
        hideOverlay();
        this.requestUpdate();
    }

    selectLocation(location) {
        userStore.setLocation(location);
        this.location = location;
        showToast({
            title: 'Location updated',
            message: `Delivering to ${location.label}`,
            variant: 'success'
        });
        this.close();
    }

    useCurrentLocation() {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const location = {
                        label: 'Current Location',
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    this.selectLocation(location);
                },
                (error) => {
                    showToast({
                        title: 'Location access denied',
                        message: 'Please enable location services',
                        variant: 'danger'
                    });
                }
            );
        }
    }

    render() {
        const popularCities = [
            { label: 'Mumbai', pincode: '400001' },
            { label: 'Delhi', pincode: '110001' },
            { label: 'Bangalore', pincode: '560001' },
            { label: 'Hyderabad', pincode: '500001' },
            { label: 'Chennai', pincode: '600001' },
            { label: 'Pune', pincode: '411001' }
        ];

        return this.html`
            <div class="bottom-sheet ${this.isOpen ? 'open' : ''}">
                <div class="bottom-sheet-handle"></div>
                <div class="p-6 pb-8">
                    <h2 class="text-xl font-bold mb-4 dark:text-white">Select Location</h2>

                    <!-- Current Location Button -->
                    <button
                        @click=${() => this.useCurrentLocation()}
                        class="w-full flex items-center gap-3 p-4 bg-teal-50 dark:bg-teal-900 text-teal-900 dark:text-teal-100 rounded-xl mb-4 hover:bg-teal-100 dark:hover:bg-teal-800 transition-colors touch-feedback"
                    >
                        <i data-lucide="crosshair" class="w-5 h-5"></i>
                        <div class="flex-1 text-left">
                            <p class="font-semibold">Use current location</p>
                            <p class="text-xs opacity-80">Get faster delivery</p>
                        </div>
                        <i data-lucide="chevron-right" class="w-5 h-5"></i>
                    </button>

                    <!-- Saved Addresses -->
                    ${this.savedAddresses.length > 0 ? this.html`
                        <div class="mb-4">
                            <h3 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Saved Addresses</h3>
                            <div class="space-y-2">
                                ${this.savedAddresses.map(addr => this.html`
                                    <button
                                        @click=${() => this.selectLocation(addr)}
                                        class="w-full flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors touch-feedback text-left"
                                    >
                                        <i data-lucide="map-pin" class="w-4 h-4 text-gray-500 dark:text-gray-400"></i>
                                        <div class="flex-1">
                                            <p class="font-medium text-sm dark:text-white">${addr.label}</p>
                                            ${addr.pincode ? this.html`
                                                <p class="text-xs text-gray-500 dark:text-gray-400">${addr.pincode}</p>
                                            ` : ''}
                                        </div>
                                    </button>
                                `)}
                            </div>
                        </div>
                    ` : ''}

                    <!-- Popular Cities -->
                    <div>
                        <h3 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Popular Cities</h3>
                        <div class="grid grid-cols-2 gap-2">
                            ${popularCities.map(city => this.html`
                                <button
                                    @click=${() => this.selectLocation(city)}
                                    class="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors touch-feedback"
                                >
                                    <i data-lucide="map-pin" class="w-4 h-4 text-gray-500 dark:text-gray-400"></i>
                                    <span class="text-sm font-medium dark:text-white">${city.label}</span>
                                </button>
                            `)}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}

customElements.define('location-selector', LocationSelector);
