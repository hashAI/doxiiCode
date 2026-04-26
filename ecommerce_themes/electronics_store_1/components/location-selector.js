import { BaseComponent } from './base-component.js';
import { userStore } from '../assets/state.js';
import { showToast } from '../assets/utils.js';

class LocationSelector extends BaseComponent {
    static properties = {
        isOpen: { type: Boolean },
        savedAddresses: { type: Array },
        newAddress: { type: String },
        isAddingNew: { type: Boolean }
    };

    constructor() {
        super();
        this.isOpen = false;
        this.savedAddresses = [];
        this.newAddress = '';
        this.isAddingNew = false;
    }

    connectedCallback() {
        super.connectedCallback();

        // Listen for open event
        window.addEventListener('open-location-selector', () => {
            this.isOpen = true;
            document.getElementById('overlay')?.classList.remove('hidden');
        });

        // Subscribe to user store for saved addresses
        this.unsubscribe = userStore.subscribe((state) => {
            this.savedAddresses = state.savedAddresses || [];

            // Auto-open on first load if no location set
            const currentLocation = state.location;
            if (currentLocation === 'Select Location') {
                // Show popup after a brief delay for better UX
                setTimeout(() => {
                    this.isOpen = true;
                    document.getElementById('overlay')?.classList.remove('hidden');
                }, 500);
            }
        });

        // Close on overlay click
        document.getElementById('overlay')?.addEventListener('click', () => {
            this.close();
        });
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        this.unsubscribe?.();
    }

    close() {
        // Don't allow closing if no location is set yet
        const currentLocation = userStore.get('location');
        if (currentLocation === 'Select Location') {
            showToast({
                title: 'Location Required',
                message: 'Please select a delivery location to continue',
                variant: 'error'
            });
            return;
        }

        this.isOpen = false;
        this.isAddingNew = false;
        this.newAddress = '';
        document.getElementById('overlay')?.classList.add('hidden');
    }

    selectAddress(address) {
        userStore.set('location', address);
        showToast({
            title: 'Location updated',
            message: `Delivering to ${address}`,
            variant: 'success'
        });
        this.close();
    }

    saveNewAddress() {
        if (!this.newAddress.trim()) {
            showToast({
                title: 'Invalid address',
                message: 'Please enter a valid address',
                variant: 'error'
            });
            return;
        }

        const addresses = userStore.get('savedAddresses') || [];
        addresses.unshift(this.newAddress.trim());
        userStore.set('savedAddresses', addresses.slice(0, 5)); // Keep only 5 recent

        this.selectAddress(this.newAddress.trim());
        this.newAddress = '';
        this.isAddingNew = false;
    }

    getCurrentLocation() {
        if (!navigator.geolocation) {
            showToast({
                title: 'Not supported',
                message: 'Geolocation is not supported',
                variant: 'error'
            });
            return;
        }

        showToast({
            title: 'Getting location',
            message: 'Please wait...',
            variant: 'info'
        });

        navigator.geolocation.getCurrentPosition(
            (position) => {
                // In real app, we would reverse geocode the coordinates
                const mockAddress = `Lat: ${position.coords.latitude.toFixed(4)}, Lng: ${position.coords.longitude.toFixed(4)}`;
                this.selectAddress(mockAddress);
            },
            (error) => {
                showToast({
                    title: 'Location error',
                    message: 'Could not get your location',
                    variant: 'error'
                });
            }
        );
    }

    render() {
        const currentLocation = userStore.get('location');
        const isFirstTime = currentLocation === 'Select Location';

        return this.html`
            <div class="bottom-sheet ${this.isOpen ? 'open' : ''}" style="max-height: ${isFirstTime ? '85vh' : '80vh'};">
                <div class="bottom-sheet-handle"></div>

                <div class="px-4 pt-2 pb-4">
                    <!-- Header -->
                    <div class="flex items-center justify-between mb-4">
                        <div class="flex-1">
                            <h3 class="font-bold text-xl dark:text-white">${isFirstTime ? 'Welcome to TechVault!' : 'Select Location'}</h3>
                            ${isFirstTime ? this.html`
                                <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Choose your delivery location to get started</p>
                            ` : ''}
                        </div>
                        ${!isFirstTime ? this.html`
                            <button @click=${this.close} class="p-2 touch-feedback">
                                <i data-lucide="x" class="w-5 h-5 dark:text-gray-300"></i>
                            </button>
                        ` : ''}
                    </div>

                    <!-- Welcome Illustration for First Time -->
                    ${isFirstTime && !this.isAddingNew ? this.html`
                        <div class="flex flex-col items-center py-6 mb-4">
                            <div class="w-24 h-24 bg-gradient-to-br from-primary-100 to-purple-100 dark:from-primary-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center mb-4">
                                <i data-lucide="map-pin" class="w-12 h-12 text-primary-500 dark:text-primary-400"></i>
                            </div>
                            <p class="text-center text-gray-600 dark:text-gray-400 text-sm max-w-xs">
                                We'll show you the best products available in your area with fast delivery
                            </p>
                        </div>
                    ` : ''}

                    ${this.isAddingNew ? this.html`
                        <!-- Add New Address Form -->
                        <div class="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 mb-4">
                            <h4 class="font-semibold mb-3 dark:text-white">Add New Address</h4>
                            <input
                                type="text"
                                .value=${this.newAddress}
                                @input=${(e) => { this.newAddress = e.target.value; }}
                                placeholder="Enter your complete address"
                                class="w-full px-4 py-3 bg-white dark:bg-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 rounded-xl text-sm focus:outline-none focus:border-primary-500 dark:focus:border-primary-400 mb-3">
                            <div class="flex gap-2">
                                <button
                                    @click=${this.saveNewAddress}
                                    class="flex-1 bg-primary-500 text-white py-2.5 rounded-xl font-semibold text-sm touch-feedback">
                                    Save Address
                                </button>
                                <button
                                    @click=${() => { this.isAddingNew = false; this.newAddress = ''; }}
                                    class="flex-1 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 py-2.5 rounded-xl font-semibold text-sm touch-feedback">
                                    Cancel
                                </button>
                            </div>
                        </div>
                    ` : this.html`
                        <!-- Use Current Location -->
                        <button
                            @click=${this.getCurrentLocation}
                            class="w-full flex items-center gap-3 p-4 ${isFirstTime ? 'bg-primary-500' : 'bg-gradient-to-r from-primary-50 to-purple-50 dark:from-primary-900/30 dark:to-purple-900/30'} rounded-xl mb-4 touch-feedback shadow-md">
                            <div class="${isFirstTime ? 'bg-white' : 'bg-primary-500'} p-2 rounded-full">
                                <i data-lucide="map-pin" class="w-5 h-5 ${isFirstTime ? 'text-primary-500' : 'text-white'}"></i>
                            </div>
                            <div class="text-left flex-1">
                                <p class="font-semibold text-sm ${isFirstTime ? 'text-white' : 'text-primary-700 dark:text-primary-400'}">Use Current Location</p>
                                <p class="text-xs ${isFirstTime ? 'text-white/90' : 'text-gray-600 dark:text-gray-400'}">Get your location automatically</p>
                            </div>
                            <i data-lucide="chevron-right" class="w-5 h-5 ${isFirstTime ? 'text-white' : 'text-gray-400'}"></i>
                        </button>

                        <!-- OR Divider -->
                        ${isFirstTime ? this.html`
                            <div class="flex items-center gap-3 my-6">
                                <div class="flex-1 h-px bg-gray-200 dark:bg-gray-600"></div>
                                <span class="text-xs text-gray-500 dark:text-gray-400 font-medium">OR</span>
                                <div class="flex-1 h-px bg-gray-200 dark:bg-gray-600"></div>
                            </div>
                        ` : ''}

                        <!-- Saved Addresses -->
                        ${this.savedAddresses.length > 0 && !isFirstTime ? this.html`
                            <div class="mb-4">
                                <h4 class="font-semibold text-sm text-gray-700 dark:text-gray-300 mb-3">Saved Addresses</h4>
                                <div class="space-y-2">
                                    ${this.savedAddresses.map(address => this.html`
                                        <button
                                            @click=${() => this.selectAddress(address)}
                                            class="w-full flex items-center gap-3 p-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl touch-feedback hover:border-primary-300 dark:hover:border-primary-600">
                                            <i data-lucide="home" class="w-5 h-5 text-gray-400 dark:text-gray-500"></i>
                                            <span class="text-sm flex-1 text-left dark:text-white">${address}</span>
                                            <i data-lucide="chevron-right" class="w-4 h-4 text-gray-400 dark:text-gray-500"></i>
                                        </button>
                                    `)}
                                </div>
                            </div>
                        ` : ''}

                        <!-- Add New Address Button -->
                        <button
                            @click=${() => { this.isAddingNew = true; }}
                            class="w-full flex items-center justify-center gap-2 p-4 bg-white dark:bg-gray-700 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl touch-feedback hover:border-primary-400 dark:hover:border-primary-600">
                            <i data-lucide="plus" class="w-5 h-5 text-primary-500 dark:text-primary-400"></i>
                            <span class="font-semibold text-sm text-primary-500 dark:text-primary-400">${isFirstTime ? 'Enter Address Manually' : 'Add New Address'}</span>
                        </button>
                    `}
                </div>
            </div>
        `;
    }
}

customElements.define('location-selector', LocationSelector);
