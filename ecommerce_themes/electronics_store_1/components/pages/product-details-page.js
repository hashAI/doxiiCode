import { BaseComponent } from '../base-component.js';
import { html } from 'https://cdn.jsdelivr.net/npm/lit@3.2.1/+esm';
import { productsStore, cartStore, eventBus } from '../../assets/state.js';
import { showToast, formatCurrency } from '../../assets/utils.js';

export class ProductDetailsPage extends BaseComponent {
    static properties = {
        product: { state: true },
        selectedImage: { state: true },
        selectedVariant: { state: true },
        activeTab: { state: true },
        quantity: { state: true },
        showImageModal: { state: true },
        modalImageIndex: { state: true },
        showReviewModal: { state: true },
        reviewRating: { state: true },
        reviewText: { state: true },
        reviewTitle: { state: true },
        reviewName: { state: true },
        editingReviewId: { state: true },
        reviews: { state: true },
        reviewSortBy: { state: true }
    };

    constructor() {
        super();
        this.product = null;
        this.selectedImage = 0;
        this.selectedVariant = '';
        this.activeTab = 'overview';
        this.quantity = 1;
        this.showImageModal = false;
        this.modalImageIndex = 0;
        this.showReviewModal = false;
        this.reviewRating = 5;
        this.reviewText = '';
        this.reviewTitle = '';
        this.reviewName = '';
        this.editingReviewId = null;
        this.reviews = [];
        this.reviewSortBy = 'recent';
    }

    connectedCallback() {
        super.connectedCallback?.();
        const params = this.getParams();
        const product = productsStore.getProductById(params?.id);

        if (product) {
            this.product = product;
            this.selectedVariant = product.variants?.[0]?.name || '';
            this.loadReviews();
        }
    }

    loadReviews() {
        // Load reviews from localStorage or use mock data
        const storageKey = `reviews-${this.product.id}`;
        const stored = localStorage.getItem(storageKey);

        if (stored) {
            this.reviews = JSON.parse(stored);
        } else {
            // Generate mock reviews
            this.reviews = this.generateMockReviews();
            localStorage.setItem(storageKey, JSON.stringify(this.reviews));
        }
    }

    generateMockReviews() {
        const mockNames = ['Sarah Johnson', 'Michael Chen', 'Emily Davis', 'James Wilson', 'Amanda Martinez', 'David Lee', 'Jessica Brown', 'Robert Garcia'];
        const titles = [
            'Great product!', 'Highly recommend', 'Exceeded expectations', 'Perfect choice',
            'Good value', 'Impressive quality', 'Love it!', 'Fantastic purchase',
            'Worth every penny', 'Amazing features'
        ];
        const comments = [
            'This product exceeded my expectations. The build quality is excellent and it works flawlessly.',
            'I\'ve been using this for a few weeks now and I\'m very impressed. Highly recommended!',
            'Great value for the price. Does everything I need and more.',
            'The quality is outstanding. I can tell this will last for years.',
            'Perfect for my needs. Setup was easy and it works great.',
            'I did a lot of research before buying and I\'m glad I chose this one.',
            'Excellent product. The features are exactly what I was looking for.',
            'Very satisfied with this purchase. Would definitely buy again.'
        ];

        const reviewCount = Math.min(Math.floor((this.product.reviews || 0) / 100), 8);
        const reviews = [];

        for (let i = 0; i < reviewCount; i++) {
            const rating = Math.random() > 0.3 ? (Math.random() > 0.5 ? 5 : 4) : Math.floor(Math.random() * 3) + 3;
            reviews.push({
                id: `review-${Date.now()}-${i}`,
                productId: this.product.id,
                rating,
                title: titles[i % titles.length],
                text: comments[i % comments.length],
                author: mockNames[i % mockNames.length],
                date: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
                helpful: Math.floor(Math.random() * 50),
                verified: Math.random() > 0.3
            });
        }

        return reviews.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    openReviewModal() {
        this.showReviewModal = true;
        this.reviewRating = 5;
        this.reviewText = '';
        this.reviewTitle = '';
        this.reviewName = '';
        this.editingReviewId = null;
        document.body.style.overflow = 'hidden';
    }

    closeReviewModal() {
        this.showReviewModal = false;
        document.body.style.overflow = '';
    }

    editReview(review) {
        this.showReviewModal = true;
        this.editingReviewId = review.id;
        this.reviewRating = review.rating;
        this.reviewTitle = review.title;
        this.reviewText = review.text;
        this.reviewName = review.author;
        document.body.style.overflow = 'hidden';
    }

    deleteReview(reviewId) {
        if (confirm('Are you sure you want to delete this review?')) {
            this.reviews = this.reviews.filter(r => r.id !== reviewId);
            this.saveReviews();
            showToast('Review deleted successfully');
        }
    }

    submitReview() {
        if (!this.reviewTitle.trim() || !this.reviewText.trim() || !this.reviewName.trim()) {
            showToast('Please fill in all fields', 'error');
            return;
        }

        if (this.editingReviewId) {
            // Update existing review
            const index = this.reviews.findIndex(r => r.id === this.editingReviewId);
            if (index !== -1) {
                this.reviews[index] = {
                    ...this.reviews[index],
                    rating: this.reviewRating,
                    title: this.reviewTitle,
                    text: this.reviewText,
                    author: this.reviewName,
                    edited: true
                };
            }
        } else {
            // Add new review
            const newReview = {
                id: `review-${Date.now()}`,
                productId: this.product.id,
                rating: this.reviewRating,
                title: this.reviewTitle,
                text: this.reviewText,
                author: this.reviewName,
                date: new Date().toISOString(),
                helpful: 0,
                verified: false
            };
            this.reviews = [newReview, ...this.reviews];
        }

        this.saveReviews();
        this.closeReviewModal();
        showToast(this.editingReviewId ? 'Review updated successfully' : 'Review submitted successfully');
    }

    saveReviews() {
        const storageKey = `reviews-${this.product.id}`;
        localStorage.setItem(storageKey, JSON.stringify(this.reviews));
        this.requestUpdate();
    }

    markHelpful(reviewId) {
        const review = this.reviews.find(r => r.id === reviewId);
        if (review) {
            review.helpful = (review.helpful || 0) + 1;
            this.saveReviews();
        }
    }

    get sortedReviews() {
        const sorted = [...this.reviews];
        switch (this.reviewSortBy) {
            case 'recent':
                return sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
            case 'oldest':
                return sorted.sort((a, b) => new Date(a.date) - new Date(b.date));
            case 'highest':
                return sorted.sort((a, b) => b.rating - a.rating);
            case 'lowest':
                return sorted.sort((a, b) => a.rating - b.rating);
            case 'helpful':
                return sorted.sort((a, b) => (b.helpful || 0) - (a.helpful || 0));
            default:
                return sorted;
        }
    }

    get ratingDistribution() {
        const dist = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        this.reviews.forEach(r => dist[r.rating]++);
        return dist;
    }

    get averageRating() {
        if (this.reviews.length === 0) return 0;
        const sum = this.reviews.reduce((acc, r) => acc + r.rating, 0);
        return (sum / this.reviews.length).toFixed(1);
    }

    selectImage(index) {
        this.selectedImage = index;
    }

    handleBack() {
        window.location.hash = '/products/all';
    }

    setActiveTab(tab) {
        this.activeTab = tab;
    }

    adjustQuantity(delta) {
        this.quantity = Math.max(1, this.quantity + delta);
    }

    handleAddToCart() {
        if (!this.product) return;

        cartStore.add(this.product, this.quantity);
        showToast({
            title: 'Added to cart',
            message: `${this.product.name}${this.selectedVariant ? ` (${this.selectedVariant})` : ''}`
        });
        eventBus.emit('cart:open');
    }

    openImageModal(index) {
        this.modalImageIndex = index;
        this.showImageModal = true;
        document.body.style.overflow = 'hidden';
    }

    closeImageModal() {
        this.showImageModal = false;
        document.body.style.overflow = '';
    }

    nextImage() {
        const images = this.product.gallery || [this.product.image];
        this.modalImageIndex = (this.modalImageIndex + 1) % images.length;
    }

    prevImage() {
        const images = this.product.gallery || [this.product.image];
        this.modalImageIndex = (this.modalImageIndex - 1 + images.length) % images.length;
    }

    renderStars(rating) {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(html`<span class="text-lg ${i > rating ? 'text-slate-200 dark:text-slate-700' : 'text-yellow-400'}">★</span>`);
        }
        return stars;
    }

    render() {
        if (!this.product) {
            return html`
                <section class="min-h-[40vh] flex flex-col items-center justify-center gap-4">
                    <p class="text-sm uppercase tracking-wider text-slate-400">Product</p>
                    <h1 class="text-3xl font-bold">Product not found.</h1>
                    <a href="#/products/all" class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                        Back to Products
                    </a>
                </section>
            `;
        }

        const variantImages = this.product.gallery || [this.product.image];
        const discount = this.product.originalPrice
            ? Math.round(((this.product.originalPrice - this.product.price) / this.product.originalPrice) * 100)
            : 0;

        return html`
            <div class="min-h-screen bg-slate-50 dark:bg-slate-900">
                <div class="w-full max-w-7xl mx-auto px-4 py-8">

                    <!-- Breadcrumb Navigation -->
                    <div class="flex items-center gap-4 mb-6">
                        <button
                            class="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition"
                            @click="${this.handleBack}">
                            <i data-lucide="arrow-left" class="w-5 h-5"></i>
                            <span>Back to Products</span>
                        </button>
                    </div>

                    <!-- Product Layout -->
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">

                        <!-- Image Gallery -->
                        <div class="space-y-4">
                            <div class="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 aspect-square relative group cursor-zoom-in"
                                 @click="${() => this.openImageModal(this.selectedImage)}">
                                <img class="w-full h-full object-cover" src="${variantImages[this.selectedImage]}" alt="${this.product.name}" />
                                ${discount > 0 ? html`
                                    <div class="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-full font-bold">
                                        -${discount}% OFF
                                    </div>
                                ` : ''}
                                <div class="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition flex items-center justify-center">
                                    <div class="opacity-0 group-hover:opacity-100 transition bg-white/90 dark:bg-slate-800/90 rounded-full p-3">
                                        <i data-lucide="zoom-in" class="w-6 h-6"></i>
                                    </div>
                                </div>
                            </div>

                            <!-- Thumbnails -->
                            <div class="grid grid-cols-4 gap-3">
                                ${variantImages.slice(0, 4).map((img, i) => html`
                                    <div class="aspect-square rounded-lg overflow-hidden cursor-pointer border-2 transition ${this.selectedImage === i ? 'border-blue-600' : 'border-slate-200 dark:border-slate-700 hover:border-blue-400'}"
                                         @click="${() => this.selectImage(i)}">
                                        <img class="w-full h-full object-cover" src="${img}" alt="View ${i + 1}" />
                                    </div>
                                `)}
                            </div>
                        </div>

                        <!-- Product Info -->
                        <div class="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-200 dark:border-slate-700 h-fit sticky top-8">

                            <!-- Brand & Badge -->
                            <div class="flex items-center gap-2 mb-3">
                                <span class="text-sm font-bold text-blue-600 dark:text-blue-400 uppercase">
                                    ${this.product.brand || this.product.category}
                                </span>
                                ${this.product.badge ? html`
                                    <span class="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-semibold px-3 py-1 rounded-full">
                                        ${this.product.badge}
                                    </span>
                                ` : ''}
                            </div>

                            <!-- Product Name -->
                            <h1 class="text-3xl font-bold text-slate-900 dark:text-white leading-tight mb-4">${this.product.name}</h1>

                            <!-- Rating & Reviews -->
                            ${this.product.rating ? html`
                                <div class="flex items-center gap-3 mb-6">
                                    <div class="flex gap-0.5">${this.renderStars(this.product.rating || 4.5)}</div>
                                    <span class="text-sm font-semibold">${this.product.rating}</span>
                                    <span class="text-sm text-slate-400">(${this.product.reviews || 0} reviews)</span>
                                </div>
                            ` : ''}

                            <!-- Price -->
                            <div class="flex items-baseline gap-4 mb-6 pb-6 border-b border-slate-200 dark:border-slate-700">
                                <div class="text-4xl font-bold text-slate-900 dark:text-white">${formatCurrency(this.product.price)}</div>
                                ${this.product.originalPrice ? html`
                                    <div class="text-xl text-slate-400 line-through">${formatCurrency(this.product.originalPrice)}</div>
                                    <span class="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-bold">Save ${discount}%</span>
                                ` : ''}
                            </div>

                            <!-- Key Features -->
                            ${this.product.keySpecs ? html`
                                <div class="mb-6">
                                    <h3 class="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">Key Features</h3>
                                    <ul class="space-y-2">
                                        ${this.product.keySpecs.map(spec => html`
                                            <li class="flex items-start gap-2">
                                                <i data-lucide="check-circle" class="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5"></i>
                                                <span class="text-sm text-slate-700 dark:text-slate-300">${spec}</span>
                                            </li>
                                        `)}
                                    </ul>
                                </div>
                            ` : ''}

                            <!-- Variants (Storage/RAM/etc) -->
                            ${this.product.variants?.length ? html`
                                <div class="mb-6">
                                    <h3 class="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">Choose Variant</h3>
                                    <div class="grid grid-cols-2 gap-3">
                                        ${this.product.variants.map(variant => html`
                                            <button
                                                class="px-4 py-3 border-2 rounded-lg transition ${this.selectedVariant === variant.name ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20' : 'border-slate-200 dark:border-slate-700 hover:border-blue-400'}"
                                                @click="${() => this.selectedVariant = variant.name}">
                                                <div class="font-semibold">${variant.name}</div>
                                                ${variant.price ? html`<div class="text-sm text-slate-500">+${formatCurrency(variant.price)}</div>` : ''}
                                            </button>
                                        `)}
                                    </div>
                                </div>
                            ` : ''}

                            <!-- Quantity -->
                            <div class="mb-6">
                                <h3 class="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">Quantity</h3>
                                <div class="flex items-center border-2 border-slate-200 dark:border-slate-700 rounded-lg w-fit">
                                    <button class="px-5 py-3 hover:bg-slate-100 dark:hover:bg-slate-700 transition" @click="${() => this.adjustQuantity(-1)}">
                                        <i data-lucide="minus" class="w-5 h-5"></i>
                                    </button>
                                    <span class="px-6 py-3 font-bold min-w-[60px] text-center">${this.quantity}</span>
                                    <button class="px-5 py-3 hover:bg-slate-100 dark:hover:bg-slate-700 transition" @click="${() => this.adjustQuantity(1)}">
                                        <i data-lucide="plus" class="w-5 h-5"></i>
                                    </button>
                                </div>
                            </div>

                            <!-- Add to Cart Button -->
                            <button
                                class="w-full px-8 py-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg transition flex items-center justify-center gap-3 mb-4"
                                @click="${this.handleAddToCart}">
                                <i data-lucide="shopping-cart" class="w-6 h-6"></i>
                                Add to Cart
                            </button>

                            <!-- Quick Info Grid -->
                            <div class="grid grid-cols-2 gap-3 pt-6 border-t border-slate-200 dark:border-slate-700">
                                <div class="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                                    <i data-lucide="truck" class="w-5 h-5 text-blue-600"></i>
                                    <div class="text-sm">
                                        <div class="font-semibold">Free Shipping</div>
                                        <div class="text-xs text-slate-500">On orders $99+</div>
                                    </div>
                                </div>
                                <div class="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                                    <i data-lucide="shield-check" class="w-5 h-5 text-green-600"></i>
                                    <div class="text-sm">
                                        <div class="font-semibold">Warranty</div>
                                        <div class="text-xs text-slate-500">1-Year Coverage</div>
                                    </div>
                                </div>
                                <div class="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                                    <i data-lucide="rotate-ccw" class="w-5 h-5 text-orange-600"></i>
                                    <div class="text-sm">
                                        <div class="font-semibold">30-Day Returns</div>
                                        <div class="text-xs text-slate-500">Easy refunds</div>
                                    </div>
                                </div>
                                <div class="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                                    <i data-lucide="headphones" class="w-5 h-5 text-purple-600"></i>
                                    <div class="text-sm">
                                        <div class="font-semibold">Support</div>
                                        <div class="text-xs text-slate-500">24/7 Available</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Tabs Section -->
                    <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                        <!-- Tab Headers -->
                        <div class="flex border-b border-slate-200 dark:border-slate-700 overflow-x-auto">
                            ${[
                                { id: 'overview', label: 'Overview', icon: 'info' },
                                { id: 'specs', label: 'Tech Specs', icon: 'cpu' },
                                { id: 'reviews', label: 'Reviews', icon: 'star' }
                            ].map(tab => html`
                                <button
                                    class="px-6 py-4 font-semibold flex items-center gap-2 transition border-b-2 whitespace-nowrap ${this.activeTab === tab.id ? 'text-blue-600 dark:text-blue-400 border-blue-600' : 'text-slate-600 dark:text-slate-400 border-transparent hover:text-slate-900 dark:hover:text-white'}"
                                    @click="${() => this.setActiveTab(tab.id)}">
                                    <i data-lucide="${tab.icon}" class="w-5 h-5"></i>
                                    ${tab.label}
                                </button>
                            `)}
                        </div>

                        <!-- Tab Content -->
                        <div class="p-8">
                            <!-- Overview Tab -->
                            <div class="${this.activeTab === 'overview' ? 'block' : 'hidden'}">
                                <h3 class="text-2xl font-bold mb-4">Product Overview</h3>
                                <div class="prose dark:prose-invert max-w-none">
                                    <p class="text-slate-600 dark:text-slate-400 leading-relaxed">
                                        ${this.product.description}
                                    </p>
                                    <p class="text-slate-600 dark:text-slate-400 leading-relaxed mt-4">
                                        This premium electronics product combines cutting-edge technology with exceptional build quality.
                                        Designed for professionals and enthusiasts alike, it delivers outstanding performance in a sleek package.
                                    </p>
                                </div>
                            </div>

                            <!-- Tech Specs Tab -->
                            <div class="${this.activeTab === 'specs' ? 'block' : 'hidden'}">
                                <h3 class="text-2xl font-bold mb-4">Technical Specifications</h3>
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    ${this.product.technicalSpecs ? Object.entries(this.product.technicalSpecs).map(([category, specs]) => html`
                                        <div class="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                                            <h4 class="font-bold text-lg mb-3 text-blue-600 dark:text-blue-400">${category}</h4>
                                            <dl class="space-y-2">
                                                ${Object.entries(specs).map(([key, value]) => html`
                                                    <div class="flex justify-between text-sm">
                                                        <dt class="text-slate-600 dark:text-slate-400">${key}</dt>
                                                        <dd class="font-semibold">${value}</dd>
                                                    </div>
                                                `)}
                                            </dl>
                                        </div>
                                    `) : html`
                                        <div class="col-span-2">
                                            <table class="w-full">
                                                <tbody class="divide-y divide-slate-200 dark:divide-slate-700">
                                                    ${[
                                                        ['Brand', this.product.brand || 'TechVault'],
                                                        ['Model', this.product.name],
                                                        ['Category', this.product.category],
                                                        ['Warranty', '1 Year Manufacturer Warranty'],
                                                        ['In Stock', 'Yes']
                                                    ].map(([label, value]) => html`
                                                        <tr>
                                                            <td class="py-3 pr-4 text-sm font-semibold text-slate-600 dark:text-slate-400 w-1/3">${label}</td>
                                                            <td class="py-3 text-sm font-medium">${value}</td>
                                                        </tr>
                                                    `)}
                                                </tbody>
                                            </table>
                                        </div>
                                    `}
                                </div>
                            </div>

                            <!-- Reviews Tab -->
                            <div class="${this.activeTab === 'reviews' ? 'block' : 'hidden'}">
                                ${this.renderReviewsSection()}
                            </div>
                        </div>
                    </div>

                    <!-- Image Modal -->
                    ${this.showImageModal ? html`
                        <div class="fixed inset-0 bg-black/95 z-50 flex items-center justify-center" @click="${this.closeImageModal}">
                            <button class="absolute top-4 right-4 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white text-2xl transition" @click="${this.closeImageModal}">×</button>
                            <button class="absolute left-4 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white text-xl transition" @click="${(e) => { e.stopPropagation(); this.prevImage(); }}">‹</button>
                            <button class="absolute right-4 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white text-xl transition" @click="${(e) => { e.stopPropagation(); this.nextImage(); }}">›</button>
                            <div class="max-w-[90vw] max-h-[90vh]" @click="${(e) => e.stopPropagation()}">
                                <img class="max-w-full max-h-[90vh] object-contain" src="${variantImages[this.modalImageIndex]}" alt="${this.product.name}" />
                            </div>
                            <div class="absolute bottom-4 bg-black/50 text-white px-4 py-2 rounded-lg text-sm">
                                ${this.modalImageIndex + 1} / ${variantImages.length}
                            </div>
                        </div>
                    ` : ''}

                    <!-- Review Modal -->
                    ${this.renderReviewModal()}
                </div>
            </div>
        `;
    }

    renderReviewsSection() {
        const dist = this.ratingDistribution;
        const total = this.reviews.length;

        return this.html`
            <div class="space-y-6">
                <!-- Header & Stats -->
                <div class="flex flex-col md:flex-row gap-8 pb-6 border-b border-slate-200 dark:border-slate-800">
                    <!-- Overall Rating -->
                    <div class="flex flex-col items-center md:items-start">
                        <div class="text-5xl font-bold mb-2">${this.averageRating}</div>
                        <div class="flex gap-1 mb-2">
                            ${[1, 2, 3, 4, 5].map(i => this.html`
                                <i data-lucide="star" class="w-6 h-6 ${i <= Math.round(this.averageRating) ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'}"></i>
                            `)}
                        </div>
                        <p class="text-sm text-slate-600 dark:text-slate-400">${total} review${total !== 1 ? 's' : ''}</p>
                    </div>

                    <!-- Rating Distribution -->
                    <div class="flex-1 space-y-2">
                        ${[5, 4, 3, 2, 1].map(rating => {
                            const count = dist[rating] || 0;
                            const percentage = total > 0 ? (count / total) * 100 : 0;
                            return this.html`
                                <div class="flex items-center gap-3">
                                    <span class="text-sm font-medium w-8">${rating} ★</span>
                                    <div class="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                        <div class="h-full bg-yellow-400 rounded-full transition-all" style="width: ${percentage}%"></div>
                                    </div>
                                    <span class="text-sm text-slate-600 dark:text-slate-400 w-12 text-right">${count}</span>
                                </div>
                            `;
                        })}
                    </div>

                    <!-- Write Review Button -->
                    <div class="flex items-center">
                        <button
                            class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold active:scale-95 transition touch-manipulation flex items-center gap-2"
                            @click=${() => this.openReviewModal()}
                        >
                            <i data-lucide="pen" class="w-5 h-5"></i>
                            Write Review
                        </button>
                    </div>
                </div>

                <!-- Sort & Filter -->
                <div class="flex items-center justify-between">
                    <h3 class="text-xl font-bold">All Reviews</h3>
                    <select
                        class="px-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-lg outline-none cursor-pointer"
                        .value=${this.reviewSortBy}
                        @change=${e => this.reviewSortBy = e.target.value}
                    >
                        <option value="recent">Most Recent</option>
                        <option value="oldest">Oldest First</option>
                        <option value="highest">Highest Rated</option>
                        <option value="lowest">Lowest Rated</option>
                        <option value="helpful">Most Helpful</option>
                    </select>
                </div>

                <!-- Reviews List -->
                <div class="space-y-4">
                    ${this.sortedReviews.length === 0 ? this.html`
                        <div class="text-center py-12 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                            <i data-lucide="message-square" class="w-16 h-16 mx-auto mb-4 text-slate-300"></i>
                            <p class="text-slate-600 dark:text-slate-400">No reviews yet. Be the first to review!</p>
                        </div>
                    ` : this.sortedReviews.map(review => this.renderReview(review))}
                </div>
            </div>
        `;
    }

    renderReview(review) {
        const date = new Date(review.date);
        const timeAgo = this.getTimeAgo(date);

        return this.html`
            <div class="p-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                <div class="flex items-start justify-between gap-4 mb-3">
                    <div class="flex-1">
                        <div class="flex items-center gap-2 mb-2">
                            <div class="flex gap-0.5">
                                ${[1, 2, 3, 4, 5].map(i => this.html`
                                    <i data-lucide="star" class="w-4 h-4 ${i <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'}"></i>
                                `)}
                            </div>
                            ${review.verified ? this.html`
                                <span class="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs rounded-full font-medium">
                                    ✓ Verified Purchase
                                </span>
                            ` : ''}
                        </div>
                        <h4 class="font-bold text-lg mb-1">${review.title}</h4>
                        <p class="text-sm text-slate-600 dark:text-slate-400 mb-3">
                            by ${review.author} • ${timeAgo}
                            ${review.edited ? this.html`<span class="text-slate-400"> (edited)</span>` : ''}
                        </p>
                    </div>
                    <div class="flex gap-1">
                        <button
                            class="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition"
                            @click=${() => this.editReview(review)}
                            title="Edit review"
                        >
                            <i data-lucide="pencil" class="w-4 h-4"></i>
                        </button>
                        <button
                            class="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 rounded-lg transition"
                            @click=${() => this.deleteReview(review.id)}
                            title="Delete review"
                        >
                            <i data-lucide="trash-2" class="w-4 h-4"></i>
                        </button>
                    </div>
                </div>

                <p class="text-slate-700 dark:text-slate-300 mb-4 leading-relaxed">${review.text}</p>

                <div class="flex items-center gap-4">
                    <button
                        class="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition text-sm"
                        @click=${() => this.markHelpful(review.id)}
                    >
                        <i data-lucide="thumbs-up" class="w-4 h-4"></i>
                        <span>Helpful (${review.helpful || 0})</span>
                    </button>
                </div>
            </div>
        `;
    }

    renderReviewModal() {
        if (!this.showReviewModal) return '';

        return this.html`
            <!-- Overlay -->
            <div
                class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                @click=${() => this.closeReviewModal()}
            >
                <!-- Modal -->
                <div
                    class="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
                    @click=${(e) => e.stopPropagation()}
                >
                    <!-- Header -->
                    <div class="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800">
                        <h3 class="text-2xl font-bold">${this.editingReviewId ? 'Edit Review' : 'Write a Review'}</h3>
                        <button
                            class="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
                            @click=${() => this.closeReviewModal()}
                        >
                            <i data-lucide="x" class="w-6 h-6"></i>
                        </button>
                    </div>

                    <!-- Form -->
                    <div class="p-6 space-y-6">
                        <!-- Rating -->
                        <div>
                            <label class="block text-sm font-semibold mb-3">Rating *</label>
                            <div class="flex gap-2">
                                ${[1, 2, 3, 4, 5].map(rating => this.html`
                                    <button
                                        class="p-2 hover:scale-110 transition-transform"
                                        @click=${() => this.reviewRating = rating}
                                    >
                                        <i data-lucide="star" class="w-8 h-8 ${rating <= this.reviewRating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'}"></i>
                                    </button>
                                `)}
                            </div>
                        </div>

                        <!-- Name -->
                        <div>
                            <label class="block text-sm font-semibold mb-2">Your Name *</label>
                            <input
                                type="text"
                                class="w-full px-4 py-3 bg-slate-100 dark:bg-slate-800 rounded-xl border-none outline-none"
                                placeholder="Enter your name"
                                .value=${this.reviewName}
                                @input=${(e) => this.reviewName = e.target.value}
                            >
                        </div>

                        <!-- Title -->
                        <div>
                            <label class="block text-sm font-semibold mb-2">Review Title *</label>
                            <input
                                type="text"
                                class="w-full px-4 py-3 bg-slate-100 dark:bg-slate-800 rounded-xl border-none outline-none"
                                placeholder="Summarize your experience"
                                .value=${this.reviewTitle}
                                @input=${(e) => this.reviewTitle = e.target.value}
                            >
                        </div>

                        <!-- Review Text -->
                        <div>
                            <label class="block text-sm font-semibold mb-2">Your Review *</label>
                            <textarea
                                class="w-full px-4 py-3 bg-slate-100 dark:bg-slate-800 rounded-xl border-none outline-none resize-none"
                                rows="6"
                                placeholder="Share your thoughts about this product..."
                                .value=${this.reviewText}
                                @input=${(e) => this.reviewText = e.target.value}
                            ></textarea>
                        </div>
                    </div>

                    <!-- Footer -->
                    <div class="flex gap-3 p-6 border-t border-slate-200 dark:border-slate-800">
                        <button
                            class="flex-1 px-6 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl font-semibold transition"
                            @click=${() => this.closeReviewModal()}
                        >
                            Cancel
                        </button>
                        <button
                            class="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition active:scale-95"
                            @click=${() => this.submitReview()}
                        >
                            ${this.editingReviewId ? 'Update Review' : 'Submit Review'}
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    getTimeAgo(date) {
        const seconds = Math.floor((new Date() - date) / 1000);
        const intervals = {
            year: 31536000,
            month: 2592000,
            week: 604800,
            day: 86400,
            hour: 3600,
            minute: 60
        };

        for (const [name, secondsInInterval] of Object.entries(intervals)) {
            const interval = Math.floor(seconds / secondsInInterval);
            if (interval >= 1) {
                return `${interval} ${name}${interval !== 1 ? 's' : ''} ago`;
            }
        }
        return 'Just now';
    }
}

customElements.define('product-details-page', ProductDetailsPage);
