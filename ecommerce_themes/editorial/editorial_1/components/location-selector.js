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
            const overlay = document.getElementById('overlay');
            if (overlay) overlay.classList.remove('hidden');
        });

        // Subscribe to user store for saved addresses
        this.unsubscribe = userStore.subscribe((state) => {
            this.savedAddresses = state.savedAddresses || [];

            // Auto-open on first load if no location set
            const currentLocation = state.location;
            if (currentLocation === 'Select Location') {
                setTimeout(() => {
                    this.isOpen = true;
                    const overlay = document.getElementById('overlay');
                    if (overlay) overlay.classList.remove('hidden');
                }, 500);
            }
        });

        // Close on overlay click
        const overlay = document.getElementById('overlay');
        if (overlay) {
            overlay.addEventListener('click', () => {
                this.close();
            });
        }
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        this.unsubscribe?.();
    }

    close() {
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
        const overlay = document.getElementById('overlay');
        if (overlay) overlay.classList.add('hidden');
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
        userStore.set('savedAddresses', addresses.slice(0, 5));

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
            <div class="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl transform transition-transform duration-300 z-50 ${this.isOpen ? 'translate-y-0' : 'translate-y-full'}" style="max-height: ${isFirstTime ? '85vh' : '80vh'};">
                <div class="w-12 h-1 bg-gray-300 rounded-full mx-auto mt-3 mb-4"></div>

                <div class="px-6 pt-2 pb-6 max-h-[calc(85vh-60px)] overflow-y-auto">
                    <!-- Header -->
                    <div class="flex items-center justify-between mb-6">
                        <div class="flex-1">
                            <h3 class="font-semibold text-2xl text-apple-gray">${isFirstTime ? 'Welcome' : 'Select Location'}</h3>
                            ${isFirstTime ? this.html`
                                <p class="text-sm text-gray-600 mt-1">Choose your delivery location to get started</p>
                            ` : ''}
                        </div>
                        ${!isFirstTime ? this.html`
                            <button @click=${this.close} class="p-2 hover:bg-gray-100 rounded-full transition">
                                <i data-lucide="x" class="w-5 h-5 text-gray-600"></i>
                            </button>
                        ` : ''}
                    </div>

                    ${isFirstTime && !this.isAddingNew ? this.html`
                        <div class="flex flex-col items-center py-6 mb-4">
                            <div class="w-24 h-24 bg-apple-lightgray rounded-full flex items-center justify-center mb-4">
                                <i data-lucide="map-pin" class="w-12 h-12 text-apple-blue"></i>
                            </div>
                            <p class="text-center text-gray-600 text-sm max-w-xs">
                                We'll show you the best products available in your area with fast delivery
                            </p>
                        </div>
                    ` : ''}

                    ${this.isAddingNew ? this.html`
                        <div class="bg-apple-lightgray rounded-2xl p-5 mb-4">
                            <h4 class="font-semibold mb-3 text-apple-gray">Add New Address</h4>
                            <input
                                type="text"
                                .value=${this.newAddress}
                                @input=${(e) => { this.newAddress = e.target.value; }}
                                placeholder="Enter your complete address"
                                class="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-apple-blue mb-3">
                            <div class="flex gap-2">
                                <button
                                    @click=${this.saveNewAddress}
                                    class="flex-1 bg-apple-blue text-white py-2.5 rounded-xl font-semibold text-sm hover:bg-apple-hover transition">
                                    Save Address
                                </button>
                                <button
                                    @click=${() => { this.isAddingNew = false; this.newAddress = ''; }}
                                    class="flex-1 bg-gray-200 text-gray-700 py-2.5 rounded-xl font-semibold text-sm hover:bg-gray-300 transition">
                                    Cancel
                                </button>
                            </div>
                        </div>
                    ` : this.html`
                        <button
                            @click=${this.getCurrentLocation}
                            class="w-full flex items-center gap-3 p-4 ${isFirstTime ? 'bg-apple-blue text-white' : 'bg-apple-lightgray'} rounded-2xl mb-4 hover:opacity-90 transition shadow-md">
                            <div class="${isFirstTime ? 'bg-white' : 'bg-apple-blue'} p-2 rounded-full">
                                <i data-lucide="map-pin" class="w-5 h-5 ${isFirstTime ? 'text-apple-blue' : 'text-white'}"></i>
                            </div>
                            <div class="text-left flex-1">
                                <p class="font-semibold text-sm">Use Current Location</p>
                                <p class="text-xs ${isFirstTime ? 'text-white/90' : 'text-gray-600'}">Get your location automatically</p>
                            </div>
                            <i data-lucide="chevron-right" class="w-5 h-5 ${isFirstTime ? 'text-white' : 'text-gray-400'}"></i>
                        </button>

                        ${isFirstTime ? this.html`
                            <div class="flex items-center gap-3 my-6">
                                <div class="flex-1 h-px bg-gray-200"></div>
                                <span class="text-xs text-gray-500 font-medium">OR</span>
                                <div class="flex-1 h-px bg-gray-200"></div>
                            </div>
                        ` : ''}

                        ${this.savedAddresses.length > 0 && !isFirstTime ? this.html`
                            <div class="mb-4">
                                <h4 class="font-semibold text-sm text-gray-700 mb-3">Saved Addresses</h4>
                                <div class="space-y-2">
                                    ${this.savedAddresses.map(address => this.html`
                                        <button
                                            @click=${() => this.selectAddress(address)}
                                            class="w-full flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-xl hover:border-apple-blue transition">
                                            <i data-lucide="home" class="w-5 h-5 text-gray-400"></i>
                                            <span class="text-sm flex-1 text-left text-apple-gray">${address}</span>
                                            <i data-lucide="chevron-right" class="w-4 h-4 text-gray-400"></i>
                                        </button>
                                    `)}
                                </div>
                            </div>
                        ` : ''}

                        <button
                            @click=${() => { this.isAddingNew = true; }}
                            class="w-full flex items-center justify-center gap-2 p-4 bg-white border-2 border-dashed border-gray-300 rounded-xl hover:border-apple-blue transition">
                            <i data-lucide="plus" class="w-5 h-5 text-apple-blue"></i>
                            <span class="font-semibold text-sm text-apple-blue">${isFirstTime ? 'Enter Address Manually' : 'Add New Address'}</span>
                        </button>
                    `}
                </div>
            </div>
        `;
    }
}

customElements.define('location-selector', LocationSelector);

