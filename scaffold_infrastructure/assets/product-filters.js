/**
 * Universal Product Filtering & Sorting System
 *
 * Provides generic filtering and sorting for products:
 * - Filter by price range, categories, attributes
 * - Sort by price, name, rating, date
 * - Search functionality
 * - Filter combinations
 * - URL state synchronization
 */

// ============================================================================
// Price Range Filtering
// ============================================================================

export function filterByPriceRange(products, minPrice, maxPrice) {
    return products.filter(product => {
        const price = product.price || 0;
        return price >= minPrice && price <= maxPrice;
    });
}

export function getPriceRange(products) {
    if (products.length === 0) {
        return { min: 0, max: 0 };
    }

    const prices = products.map(p => p.price || 0);
    return {
        min: Math.floor(Math.min(...prices)),
        max: Math.ceil(Math.max(...prices))
    };
}

export function createPriceBuckets(products, bucketCount = 5) {
    const { min, max } = getPriceRange(products);
    const range = max - min;
    const bucketSize = range / bucketCount;

    const buckets = [];
    for (let i = 0; i < bucketCount; i++) {
        const bucketMin = min + (i * bucketSize);
        const bucketMax = min + ((i + 1) * bucketSize);

        const count = products.filter(p =>
            p.price >= bucketMin && p.price < bucketMax
        ).length;

        buckets.push({
            label: `$${Math.floor(bucketMin)} - $${Math.ceil(bucketMax)}`,
            min: bucketMin,
            max: bucketMax,
            count
        });
    }

    return buckets;
}

// ============================================================================
// Category Filtering
// ============================================================================

export function filterByCategory(products, category) {
    if (!category || category === 'all') return products;

    return products.filter(product =>
        product.category === category ||
        product.categories?.includes(category)
    );
}

export function filterByCategories(products, categories = []) {
    if (categories.length === 0) return products;

    return products.filter(product =>
        categories.includes(product.category) ||
        categories.some(cat => product.categories?.includes(cat))
    );
}

export function getCategories(products) {
    const categorySet = new Set();

    products.forEach(product => {
        if (product.category) {
            categorySet.add(product.category);
        }
        if (product.categories) {
            product.categories.forEach(cat => categorySet.add(cat));
        }
    });

    return Array.from(categorySet).sort();
}

export function getCategoriesWithCount(products) {
    const categoryCounts = {};

    products.forEach(product => {
        const category = product.category;
        if (category) {
            categoryCounts[category] = (categoryCounts[category] || 0) + 1;
        }
    });

    return Object.entries(categoryCounts)
        .map(([category, count]) => ({ category, count }))
        .sort((a, b) => b.count - a.count);
}

// ============================================================================
// Attribute Filtering (Generic)
// ============================================================================

export function filterByAttribute(products, attribute, value) {
    return products.filter(product =>
        product[attribute] === value
    );
}

export function filterByAttributes(products, filters = {}) {
    return products.filter(product => {
        return Object.entries(filters).every(([key, value]) => {
            // Handle array values (OR logic)
            if (Array.isArray(value)) {
                return value.length === 0 || value.includes(product[key]);
            }
            // Handle single value
            return product[key] === value;
        });
    });
}

export function getAttributeValues(products, attribute) {
    const values = new Set();

    products.forEach(product => {
        const value = product[attribute];
        if (value !== undefined && value !== null) {
            if (Array.isArray(value)) {
                value.forEach(v => values.add(v));
            } else {
                values.add(value);
            }
        }
    });

    return Array.from(values).sort();
}

export function getAttributeValuesWithCount(products, attribute) {
    const valueCounts = {};

    products.forEach(product => {
        const value = product[attribute];
        if (value !== undefined && value !== null) {
            if (Array.isArray(value)) {
                value.forEach(v => {
                    valueCounts[v] = (valueCounts[v] || 0) + 1;
                });
            } else {
                valueCounts[value] = (valueCounts[value] || 0) + 1;
            }
        }
    });

    return Object.entries(valueCounts)
        .map(([value, count]) => ({ value, count }))
        .sort((a, b) => b.count - a.count);
}

// ============================================================================
// Stock Filtering
// ============================================================================

export function filterInStock(products) {
    return products.filter(product => product.inStock !== false);
}

export function filterOutOfStock(products) {
    return products.filter(product => product.inStock === false);
}

// ============================================================================
// Rating Filtering
// ============================================================================

export function filterByRating(products, minRating) {
    return products.filter(product =>
        (product.rating || 0) >= minRating
    );
}

export function filterByReviewCount(products, minReviews) {
    return products.filter(product =>
        (product.reviews || 0) >= minReviews
    );
}

// ============================================================================
// Featured/Special Filters
// ============================================================================

export function filterFeatured(products) {
    return products.filter(product => product.featured === true);
}

export function filterOnSale(products) {
    return products.filter(product =>
        product.originalPrice && product.price < product.originalPrice
    );
}

export function filterNew(products, daysOld = 30) {
    const cutoffDate = Date.now() - (daysOld * 24 * 60 * 60 * 1000);

    return products.filter(product => {
        if (!product.createdAt) return false;
        const createdDate = new Date(product.createdAt).getTime();
        return createdDate >= cutoffDate;
    });
}

// ============================================================================
// Search/Text Filtering
// ============================================================================

export function searchProducts(products, searchTerm) {
    if (!searchTerm || searchTerm.trim() === '') return products;

    const term = searchTerm.toLowerCase().trim();

    return products.filter(product => {
        // Search in name
        if (product.name?.toLowerCase().includes(term)) return true;

        // Search in description
        if (product.description?.toLowerCase().includes(term)) return true;

        // Search in category
        if (product.category?.toLowerCase().includes(term)) return true;

        // Search in brand
        if (product.brand?.toLowerCase().includes(term)) return true;

        // Search in tags
        if (product.tags?.some(tag => tag.toLowerCase().includes(term))) return true;

        return false;
    });
}

// ============================================================================
// Sorting
// ============================================================================

export function sortProducts(products, sortBy = 'name', order = 'asc') {
    const sorted = [...products];

    sorted.sort((a, b) => {
        let aVal, bVal;

        switch (sortBy) {
            case 'price':
                aVal = a.price || 0;
                bVal = b.price || 0;
                break;

            case 'name':
                aVal = (a.name || '').toLowerCase();
                bVal = (b.name || '').toLowerCase();
                break;

            case 'rating':
                aVal = a.rating || 0;
                bVal = b.rating || 0;
                break;

            case 'reviews':
                aVal = a.reviews || 0;
                bVal = b.reviews || 0;
                break;

            case 'newest':
                aVal = a.createdAt ? new Date(a.createdAt).getTime() : 0;
                bVal = b.createdAt ? new Date(b.createdAt).getTime() : 0;
                break;

            case 'popular':
                aVal = (a.views || 0) + (a.purchases || 0);
                bVal = (b.views || 0) + (b.purchases || 0);
                break;

            case 'discount':
                aVal = a.originalPrice ? ((a.originalPrice - a.price) / a.originalPrice) : 0;
                bVal = b.originalPrice ? ((b.originalPrice - b.price) / b.originalPrice) : 0;
                break;

            default:
                aVal = a[sortBy];
                bVal = b[sortBy];
        }

        // Handle string comparison
        if (typeof aVal === 'string') {
            aVal = aVal.toLowerCase();
            bVal = bVal ? bVal.toLowerCase() : '';
        }

        // Sort
        if (order === 'asc') {
            return aVal > bVal ? 1 : -1;
        } else {
            return aVal < bVal ? 1 : -1;
        }
    });

    return sorted;
}

// ============================================================================
// Combined Filtering
// ============================================================================

export function applyFilters(products, filters = {}) {
    let filtered = [...products];

    // Price range
    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
        const min = filters.minPrice ?? 0;
        const max = filters.maxPrice ?? Infinity;
        filtered = filterByPriceRange(filtered, min, max);
    }

    // Categories
    if (filters.categories && filters.categories.length > 0) {
        filtered = filterByCategories(filtered, filters.categories);
    } else if (filters.category) {
        filtered = filterByCategory(filtered, filters.category);
    }

    // Generic attributes
    if (filters.attributes) {
        filtered = filterByAttributes(filtered, filters.attributes);
    }

    // Stock
    if (filters.inStock === true) {
        filtered = filterInStock(filtered);
    }

    // Rating
    if (filters.minRating) {
        filtered = filterByRating(filtered, filters.minRating);
    }

    // Special filters
    if (filters.featured) {
        filtered = filterFeatured(filtered);
    }

    if (filters.onSale) {
        filtered = filterOnSale(filtered);
    }

    if (filters.new) {
        filtered = filterNew(filtered, filters.newDays || 30);
    }

    // Search
    if (filters.search) {
        filtered = searchProducts(filtered, filters.search);
    }

    // Sort
    if (filters.sortBy) {
        filtered = sortProducts(filtered, filters.sortBy, filters.order || 'asc');
    }

    return filtered;
}

// ============================================================================
// Filter State Management
// ============================================================================

export class FilterState {
    constructor(initialFilters = {}) {
        this.filters = { ...initialFilters };
        this.listeners = [];
    }

    setFilter(key, value) {
        this.filters[key] = value;
        this.notifyListeners();
    }

    removeFilter(key) {
        delete this.filters[key];
        this.notifyListeners();
    }

    clearFilters() {
        this.filters = {};
        this.notifyListeners();
    }

    getFilters() {
        return { ...this.filters };
    }

    hasActiveFilters() {
        return Object.keys(this.filters).length > 0;
    }

    getActiveFilterCount() {
        return Object.keys(this.filters).length;
    }

    onChange(callback) {
        this.listeners.push(callback);
        return () => {
            this.listeners = this.listeners.filter(l => l !== callback);
        };
    }

    notifyListeners() {
        this.listeners.forEach(listener => {
            listener(this.getFilters());
        });
    }

    // URL synchronization
    toURLParams() {
        const params = new URLSearchParams();

        Object.entries(this.filters).forEach(([key, value]) => {
            if (Array.isArray(value)) {
                value.forEach(v => params.append(key, v));
            } else if (value !== undefined && value !== null) {
                params.set(key, value);
            }
        });

        return params.toString();
    }

    static fromURLParams(searchParams) {
        const filters = {};

        for (const [key, value] of searchParams) {
            if (filters[key]) {
                // Multiple values - convert to array
                if (!Array.isArray(filters[key])) {
                    filters[key] = [filters[key]];
                }
                filters[key].push(value);
            } else {
                filters[key] = value;
            }
        }

        return new FilterState(filters);
    }
}

// ============================================================================
// Pagination
// ============================================================================

export function paginateProducts(products, page = 1, perPage = 12) {
    const start = (page - 1) * perPage;
    const end = start + perPage;

    return {
        products: products.slice(start, end),
        currentPage: page,
        totalPages: Math.ceil(products.length / perPage),
        totalProducts: products.length,
        hasNextPage: end < products.length,
        hasPrevPage: page > 1
    };
}

// ============================================================================
// Analytics/Statistics
// ============================================================================

export function getFilterStats(products, filteredProducts) {
    const originalCount = products.length;
    const filteredCount = filteredProducts.length;

    return {
        originalCount,
        filteredCount,
        percentageRemaining: (filteredCount / originalCount) * 100,
        removedCount: originalCount - filteredCount
    };
}

// ============================================================================
// Default Export - Convenience Object
// ============================================================================

/**
 * Convenience object that wraps all filter functions.
 * Use this for cleaner imports: import { productFilters } from '../assets/product-filters.js'
 */
export const productFilters = {
    // Price filtering
    filterByPriceRange,
    getPriceRange,
    createPriceBuckets,

    // Category filtering
    filterByCategory,
    filterByCategories,
    getCategories,
    getCategoriesWithCount,

    // Attribute filtering
    filterByAttribute,
    filterByAttributes,
    getAttributeValues,
    getAttributeValuesWithCount,

    // Stock filtering
    filterInStock,
    filterOutOfStock,

    // Rating filtering
    filterByRating,
    filterByReviewCount,

    // Special filters
    filterFeatured,
    filterOnSale,
    filterNew,

    // Search
    searchProducts,

    // Sorting
    sortProducts,

    // Combined
    applyFilters,

    // Pagination
    paginateProducts,

    // Stats
    getFilterStats,

    // State management
    FilterState
};
